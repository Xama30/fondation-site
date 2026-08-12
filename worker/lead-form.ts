/**
 * Lead form handler — invoked from worker/index.ts.
 *
 * ROUTING. This is NOT a Cloudflare Pages Function. The project deploys as a
 * **Worker with static assets**, not a Pages project, and a Worker does not read
 * the `functions/` directory — that convention is Pages-only. This file was briefly
 * `functions/api/soumission.ts`; deployed against a Worker it was silently ignored
 * and every POST fell through to the default script, which answered `Hello world`.
 * A form that returns 200 and loses the lead is the worst possible failure here, so
 * routing is now explicit in worker/index.ts. Do not move this back under
 * `functions/` unless the project is also moved back to Pages.
 *
 * WHY A SERVER FUNCTION AND NOT A DIRECT POST TO MAILGUN
 * Mailgun authenticates with an API key in an Authorization header. A plain HTML
 * form cannot send one, and putting the key in the page would publish it. So the
 * form posts here, and this function holds the key as an encrypted environment
 * variable. Nothing secret ever enters the repo or the HTML.
 *
 * RULE 7 IS INTACT. This runs at the edge, not in the browser. The site still
 * ships 0 KB of client-side JavaScript. Every other route on the site is a
 * prerendered static file — this is the only executable thing deployed.
 *
 * `btoa` is available in the Workers runtime, so no Buffer import is needed.
 *
 * DELIVERABILITY — the part that silently breaks most contact forms:
 * the message is sent FROM our own Mailgun subdomain and sets Reply-To to the
 * visitor. Sending From: the visitor's own address would fail SPF and DKIM (we
 * are not gmail.com) and land in spam. Reply still works normally in your inbox.
 *
 * Required environment variables
 * (Cloudflare dashboard → the Worker → Settings → Variables and Secrets):
 *   MAILGUN_API_KEY   private-xxxxxxxx        ← store as a SECRET, not plaintext
 *   MAILGUN_DOMAIN    mg.<le domaine du site>
 *   LEAD_TO_EMAIL     where leads land
 *   MAILGUN_BASE_URL  optional — https://api.eu.mailgun.net for the EU region
 *   LEAD_BCC          optional — keep a copy for the lead log (see HANDOFF-TENANT)
 *
 * `console.error` from this file surfaces in the dashboard's Worker logs and in
 * `npx wrangler tail`. It is the only observability this has.
 */

import { SITE_NAME, SITE_URL } from '../src/lib/constants';

/**
 * Minimal local typings for the Workers runtime.
 *
 * Declared here rather than pulling in `@cloudflare/workers-types` on purpose:
 * `tsconfig.json` includes every .ts file in the repo, so `astro check` type-checks
 * this one, and a hand-written interface keeps the build gate honest without adding
 * a dependency whose only job is to describe two properties.
 *
 * (Do not write a glob containing a star followed by a slash inside a block comment
 * here — it terminates the comment and TypeScript then parses the prose as code.
 * That mistake produced 96 errors on the first build of this file.)
 */
interface LeadEnv {
  MAILGUN_API_KEY?: string;
  MAILGUN_DOMAIN?: string;
  LEAD_TO_EMAIL?: string;
  MAILGUN_BASE_URL?: string;
  LEAD_BCC?: string;
}

interface LeadRequestContext {
  request: Request;
  env: LeadEnv;
}

/**
 * ⚠ AN EMPTY STRING IS NOT AN UNSET VARIABLE. This cost a full debugging session
 * on the previous (Docker) deploy and the hazard survives the move: the Cloudflare
 * variables UI happily stores an empty value, and a value pasted from a password
 * manager often carries a trailing newline.
 *
 * `??` only falls back on null/undefined, so `MAILGUN_BASE_URL ?? 'https://…'`
 * evaluated to `''`, the request URL collapsed to the relative path
 * `/v3/<domain>/messages`, and `fetch()` threw `Failed to parse URL` before any
 * network call. Every lead died in the catch block while the credentials, the DNS
 * and the Mailgun domain were all perfectly fine.
 *
 * `normalize()` collapses "" and whitespace-only to undefined so `??` means what it
 * looks like it means. It also trims: a trailing newline silently breaks Basic auth
 * and produces an indistinguishable 401.
 */
function normalize(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

/**
 * Secrets are per-request bindings on Cloudflare, not `process.env`, so they are
 * read inside the handler rather than at module scope.
 */
function readEnv(env: LeadEnv) {
  return {
    MAILGUN_API_KEY: normalize(env.MAILGUN_API_KEY) ?? '',
    MAILGUN_DOMAIN: normalize(env.MAILGUN_DOMAIN) ?? '',
    LEAD_TO_EMAIL: normalize(env.LEAD_TO_EMAIL) ?? '',
    MAILGUN_BASE_URL: normalize(env.MAILGUN_BASE_URL),
    LEAD_BCC: normalize(env.LEAD_BCC),
  };
}

/** Max photo we will forward. Mailgun accepts far more; this keeps a bad upload from stalling the request. */
const MAX_ATTACHMENT_BYTES = 5 * 1024 * 1024;

const FIELD_LABELS: Record<string, { fr: string; en: string }> = {
  name: { fr: 'Nom', en: 'Name' },
  email: { fr: 'Courriel', en: 'Email' },
  phone: { fr: 'Téléphone', en: 'Phone' },
  sector: { fr: 'Secteur', en: 'Sector' },
  // `service`, PAS `pest` : ce fichier vient du site antiparasitaire et nommait
  // encore le ravageur. Ces clés sont le CONTRAT que le formulaire de
  // /soumission/ devra respecter — les corriger avant de l'écrire évite que la
  // contamination se propage dans le HTML (phase 7).
  service: { fr: 'Intervention', en: 'Service' },
  building: { fr: 'Type de bâtiment', en: 'Building type' },
  urgency: { fr: 'Urgence', en: 'Urgency' },
  message: { fr: 'Description', en: 'Description' },
  description: { fr: 'Description', en: 'Description' },
};

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string,
  );
}

/**
 * The canonical public hosts. Cloudflare may serve either apex or www, and both
 * must be accepted or a submission from the www variant is silently refused.
 */
const CANONICAL_HOSTS = new Set([new URL(SITE_URL).host, `www.${new URL(SITE_URL).host}`]);

/**
 * CSRF check. Astro's `security.checkOrigin` does not apply here — this runs in the
 * Worker, outside the Astro request pipeline entirely — so the endpoint guards itself.
 *
 * We compare the HOSTNAME only. That is the part an attacker cannot forge: a
 * browser sets `Origin` itself and a page on evil.example cannot make it read
 * le domaine canonique du site.
 *
 * A MISSING `Origin` is accepted. This endpoint has no session, no cookie and no
 * authenticated state: the worst a forged POST achieves is an unwanted lead email,
 * which the honeypot below already filters. Weighed against silently dropping leads
 * from privacy tools and proxies that strip the header, accepting it is the right
 * trade for a form whose entire purpose is to capture leads.
 *
 * ⚠ WHY THE REQUEST'S OWN HOST IS ACCEPTED, not just the canonical ones.
 * An earlier version compared against a hardcoded list built from `SITE_URL` alone.
 * That list is correct in production and wrong everywhere else: submitting the form
 * on the deployment's own `*.workers.dev` URL — the one place you can test BEFORE
 * pointing the domain at it — returned `403 Cross-site POST form submissions are
 * forbidden`. The pre-cutover smoke test was therefore impossible to run, which is
 * the single test that matters most.
 *
 * Accepting `Origin === the host this request was sent to` is the textbook
 * same-origin check and is strictly more correct: a page can only set `Origin` to
 * the host that served it, so evil.example still cannot forge one. The canonical
 * set stays as an addition, so apex↔www cross-posting keeps working.
 */
function isSameSite(request: Request): boolean {
  const origin = request.headers.get('origin');
  if (origin === null) return true;

  let originHost: string;
  try {
    originHost = new URL(origin).host;
  } catch {
    return false;
  }

  // Same-origin: the form was served by the very host it is posting to.
  if (originHost === new URL(request.url).host) return true;

  return CANONICAL_HOSTS.has(originHost);
}

/**
 * `Location` is a ROOT-RELATIVE path, never absolute — valid per RFC 7231 §7.1.2
 * and it lets the browser keep the scheme it already has.
 */
function redirect(path: string): Response {
  return new Response(null, {
    status: 303,
    headers: { Location: path },
  });
}

/**
 * Server-rendered fallback. No JS, so a failure cannot be shown inline on the
 * static form.
 *
 * ⚠ THE STATUS CODE IS DELIBERATE AND MUST NOT GO BACK TO 5xx.
 * This page originally returned 502. Verified in production: Cloudflare
 * SUBSTITUTES ITS OWN "Bad gateway" interstitial for a 502, so the visitor saw a
 * Cloudflare error page instead of this one — losing both the explanation and the
 * mailto fallback, which is the only reason the page exists.
 *
 * So: 400 when the submitter sent something invalid, and 200 when the failure is
 * on our side. A 200 carrying an error page is ordinary form practice and it is the
 * only status guaranteed to reach the visitor intact. Observability does not depend
 * on it — every branch that lands here already logs via `console.error`.
 *
 * ⚠ `to` CAN BE EMPTY, and the worst case is exactly when it is.
 * The page is reached when `LEAD_TO_EMAIL` is unset, and it used to render
 * "Écrivez-nous directement à <a href="mailto:"></a> — c'est la voie la plus
 * rapide", i.e. a dangling sentence with no address and a dead link. Seen in
 * production. So the fallback paragraph is omitted entirely when there is no
 * address to offer, rather than advertising a mailto that goes nowhere.
 */
function errorPage(locale: 'fr' | 'en', to: string, status: 200 | 400 = 200): Response {
  const fr = locale === 'fr';
  const contact = to
    ? `<p>${
        fr
          ? `Écrivez-nous directement à <a href="mailto:${to}">${to}</a> — c'est la voie la plus rapide en attendant.`
          : `Please email us directly at <a href="mailto:${to}">${to}</a> — that is the fastest route in the meantime.`
      }</p>`
    : `<p>${
        fr
          ? 'Réessayez dans quelques minutes. Si le problème persiste, revenez un peu plus tard — le formulaire sera rétabli.'
          : 'Please try again in a few minutes. If it keeps failing, come back a little later — the form will be restored.'
      }</p>`;
  const body = `<!doctype html><html lang="${fr ? 'fr-CA' : 'en-CA'}"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex">
<title>${fr ? "L'envoi n'a pas fonctionné" : 'Your message did not go through'}</title>
<style>body{font-family:system-ui,sans-serif;max-width:38rem;margin:4rem auto;padding:0 1rem;line-height:1.7;color:#1f2430}
a{color:#1f4b7a}</style></head><body>
<h1>${fr ? "L'envoi n'a pas fonctionné" : 'Your message did not go through'}</h1>
<p>${
    fr
      ? "Un problème technique de notre côté a empêché l'envoi de votre demande. Rien n'a été perdu de votre côté, mais nous ne l'avons pas reçue."
      : 'A technical problem on our end stopped your request from being sent. Nothing is wrong on your side, but we did not receive it.'
  }</p>
${contact}
<p><a href="${fr ? '/soumission/' : '/en/quote/'}">${fr ? 'Revenir au formulaire' : 'Back to the form'}</a></p>
</body></html>`;
  return new Response(body, {
    status,
    headers: { 'content-type': 'text/html; charset=utf-8', 'x-robots-tag': 'noindex' },
  });
}

export const handleLeadForm = async (context: LeadRequestContext): Promise<Response> => {
  const { request } = context;
  const env = readEnv(context.env);

  if (!isSameSite(request)) {
    return new Response('Cross-site POST form submissions are forbidden', { status: 403 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return errorPage('fr', env.LEAD_TO_EMAIL, 400);
  }

  const locale = form.get('locale') === 'en' ? 'en' : 'fr';
  const thankYou = locale === 'en' ? '/en/thank-you/' : '/merci/';

  // Honeypot: a real person never sees or fills this. Bots fill every input they
  // find. Redirect exactly like a success so the bot learns nothing, and drop it.
  if (String(form.get('website') ?? '').trim() !== '') {
    return redirect(thankYou);
  }

  const get = (k: string) => String(form.get(k) ?? '').trim();
  const email = get('email');
  const name = get('name');

  // Server-side validation. The HTML `required` attributes are a convenience for
  // people, not a guarantee — anything can POST here directly.
  if (!name || !email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return errorPage(locale, env.LEAD_TO_EMAIL, 400);
  }

  // Name the missing variables. The function log is the only place this surfaces,
  // and "missing environment variables" without saying WHICH one costs a debugging
  // round-trip every time. Names only — never log the key's value.
  const missing = (['MAILGUN_API_KEY', 'MAILGUN_DOMAIN', 'LEAD_TO_EMAIL'] as const).filter(
    (k) => !env[k],
  );
  if (missing.length > 0) {
    console.error(`[lead] missing environment variables: ${missing.join(', ')} — lead NOT sent`);
    return errorPage(locale, env.LEAD_TO_EMAIL);
  }

  const lines: string[] = [];
  for (const [key, label] of Object.entries(FIELD_LABELS)) {
    const v = get(key);
    if (v) lines.push(`${label[locale]}: ${v}`);
  }
  // `page_url` is the pathname of the form page. Resolve it against the canonical
  // SITE_URL rather than the request URL so the tenant always gets a clickable
  // https link to the exact page the lead came from.
  const sentFrom = new URL(get('page_url') || '/', SITE_URL).toString();
  lines.push(`\n— ${locale === 'fr' ? 'Envoyé depuis' : 'Sent from'}: ${sentFrom}`);
  lines.push(`${locale === 'fr' ? 'Langue' : 'Language'}: ${locale}`);

  const subject =
    locale === 'fr'
      ? `Nouvelle soumission — ${get('service') || 'intervention non précisée'} — ${get('sector') || 'secteur non précisé'}`
      : `New quote request — ${get('service') || 'service not specified'} — ${get('sector') || 'sector not specified'}`;

  const payload = new FormData();
  // Le nom d'expéditeur vient de la constante, jamais d'un domaine en dur : le
  // fichier annonçait encore le domaine canonique, ce qui aurait envoyé les
  // prospects de ce site sous la marque d'un autre.
  payload.append('from', `${SITE_NAME} <noreply@${env.MAILGUN_DOMAIN}>`);
  payload.append('to', env.LEAD_TO_EMAIL);
  if (env.LEAD_BCC) payload.append('bcc', env.LEAD_BCC);
  // Reply-To, not From: see the deliverability note at the top of this file.
  payload.append('h:Reply-To', name ? `${name} <${email}>` : email);
  payload.append('subject', subject);
  payload.append('text', lines.join('\n'));
  payload.append('html', `<pre style="font:14px/1.6 system-ui,sans-serif">${escapeHtml(lines.join('\n'))}</pre>`);

  const photo = form.get('photo');
  if (photo instanceof File && photo.size > 0 && photo.size <= MAX_ATTACHMENT_BYTES) {
    payload.append('attachment', photo, photo.name || 'photo');
  }

  // Built with `new URL()` rather than string concatenation: it tolerates a
  // trailing slash on the base and, more importantly, throws HERE with a legible
  // message if the base is ever malformed again — instead of failing inside
  // `fetch()` where the error reads as a transport problem and sends the next
  // person hunting DNS and firewalls.
  const base = env.MAILGUN_BASE_URL ?? 'https://api.mailgun.net';
  const endpoint = new URL(`/v3/${env.MAILGUN_DOMAIN}/messages`, base).toString();
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { Authorization: `Basic ${btoa(`api:${env.MAILGUN_API_KEY}`)}` },
      body: payload,
    });
    if (!res.ok) {
      console.error('[lead] mailgun rejected', res.status, await res.text());
      return errorPage(locale, env.LEAD_TO_EMAIL);
    }
  } catch (err) {
    console.error('[lead] mailgun request failed', err);
    return errorPage(locale, env.LEAD_TO_EMAIL);
  }

  // 303 so a refresh on the thank-you page does not re-submit the form.
  return redirect(thankYou);
};
