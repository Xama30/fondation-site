/**
 * Worker entry point — the only executable code deployed with the site.
 *
 * WHAT THIS IS FOR
 * The site is ~287 prerendered HTML files plus exactly one dynamic endpoint (the
 * lead form). Cloudflare serves the static assets itself; this Worker exists to
 * handle the one request that has to run code, and to serve the right localized
 * 404 for everything else.
 *
 * ROUTING ORDER, and why it matters
 * `wrangler.jsonc` sets `main` alongside an `assets` binding. In that setup
 * Cloudflare tries the static assets FIRST and only invokes this Worker when no
 * asset matches the request. So this `fetch` never sees a request for a real page —
 * it sees `/api/soumission/` and genuine misses, nothing else.
 *
 * ⚠ THE FAILURE THIS FILE EXISTS TO PREVENT
 * The project was first written for Cloudflare Pages, where a file at
 * `functions/api/soumission.ts` is auto-routed to `/api/soumission`. Deployed as a
 * Worker instead, that directory is never read: the handler was silently ignored,
 * every POST fell through to the placeholder script, and the form answered
 * `200 Hello world` while discarding the lead. Verified in production before the
 * domain was pointed at it. Routing is explicit here so it cannot happen again.
 *
 * Rule 7 is intact: this runs at the edge, never in the browser. `find dist -name
 * '*.js'` stays empty.
 */

import { LEAD_ENDPOINT } from '../src/lib/constants';
import { handleLeadForm } from './lead-form';

/**
 * Minimal local typings, deliberately not `@cloudflare/workers-types`:
 * `tsconfig.json` type-checks every .ts file in the repo, and hand-writing the two
 * shapes we actually use keeps `astro check` meaningful without a dependency.
 */
interface Env {
  /** Static asset binding — `dist/`, served by Cloudflare. */
  ASSETS: { fetch(request: Request): Promise<Response> };
  MAILGUN_API_KEY?: string;
  MAILGUN_DOMAIN?: string;
  LEAD_TO_EMAIL?: string;
  MAILGUN_BASE_URL?: string;
  LEAD_BCC?: string;
}

/**
 * The form posts to `/api/soumission/` WITH the trailing slash
 * (`trailingSlash: 'always'` in astro.config.mjs). Both spellings are accepted
 * here rather than redirected: a browser downgrades a POST to a GET when it
 * follows a 301, which would drop the submission and show the visitor an empty
 * page. Never "clean this up" into a redirect.
 *
 * DERIVED from the same constant the two form pages use for their `action`, so
 * the HTML and the routing table cannot drift apart. The path was written out
 * twice here and once more in each form before 2026-08-11; a typo in any one of
 * them produces a 404 on POST, which is the failure this file already exists to
 * prevent.
 */
const LEAD_ENDPOINTS = new Set([LEAD_ENDPOINT, LEAD_ENDPOINT.replace(/\/$/, '')]);

/**
 * Localized 404. Pages walks up the request path to find the nearest `404.html`;
 * Workers does not, so the choice is made here. `scripts/post-build.mjs` emits
 * `dist/en/404.html` for exactly this purpose.
 */
async function notFound(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const page = url.pathname.startsWith('/en/') ? '/en/404.html' : '/404.html';
  const asset = await env.ASSETS.fetch(new Request(new URL(page, url.origin), { method: 'GET' }));

  // Re-wrap rather than return as-is: the asset itself is a 200, and a soft 404
  // (error page served with a success status) makes Google index the error page.
  return new Response(asset.body, {
    status: 404,
    headers: {
      'content-type': asset.headers.get('content-type') ?? 'text/html; charset=utf-8',
    },
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (LEAD_ENDPOINTS.has(url.pathname)) {
      if (request.method !== 'POST') {
        // The endpoint is write-only. A GET here is a crawler or a stray link, and
        // it must not be indexable.
        return new Response('Method not allowed', {
          status: 405,
          headers: { Allow: 'POST', 'x-robots-tag': 'noindex' },
        });
      }
      return handleLeadForm({ request, env });
    }

    return notFound(request, env);
  },
};
