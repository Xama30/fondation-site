#!/usr/bin/env node
/**
 * Post-build fixups that the static output cannot express on its own.
 *
 * 1. Localized 404. The platform serves the nearest `404.html` walking up the
 *    request path, so `/en/...` needs its own copy beside the root one.
 *
 *    ⚠ Ce commentaire décrivait un déploiement Dokploy avec adaptateur Node,
 *    hérité du projet précédent. **Ce projet-ci est du statique pur, sans
 *    adaptateur, servi par un Cloudflare Worker avec assets statiques**
 *    (CLAUDE.md). La copie n'est donc pas inerte : elle est ce qui donne un 404
 *    anglais.
 *
 * 2. Le sitemap, GÉNÉRÉ DEPUIS LE HTML RENDU — pas produit par une intégration
 *    puis rafistolé.
 *
 *    `@astrojs/sitemap` apparie les langues en échangeant le préfixe de chemin et
 *    en supposant que le reste de l'URL correspond. Nos slugs sont réellement
 *    localisés (`/soumission/` <-> `/en/quote/`, `/fondation/drain-francais/` <->
 *    `/en/foundation/french-drain/`), donc cette supposition ne tient que pour la
 *    poignée de pages dont les slugs FR et EN coïncident — les hubs de secteur,
 *    dont les slugs sont des noms propres.
 *
 *    On lit donc les `<link rel="canonical">` et `<link rel="alternate">` de la
 *    sortie, que `seo-audit.mjs` a déjà vérifiés pour la réciprocité et les
 *    cibles mortes. **Le sitemap ne peut pas contredire le HTML : il en est
 *    dérivé.** Et une page `noindex` (les 404) n'a pas de canonique, donc elle
 *    s'exclut d'elle-même, sans liste à tenir.
 *
 *    Pas de `lastmod`. Nous n'avons pas de date de modification fiable par page,
 *    et un `lastmod` inventé est pire qu'absent : les moteurs s'en servent pour
 *    prioriser le recrawl, donc mentir dessus coûte du budget de crawl.
 *
 *    AUCUNE DÉPENDANCE AJOUTÉE (règle 7). L'origine vient des canoniques
 *    elles-mêmes, jamais de l'environnement : si `SITE_URL` est faux, le HTML est
 *    déjà faux et `seo-audit` l'arrête — il n'y a pas deux sources à désaccorder.
 *
 * 3. `robots.txt` et `llms.txt`, pour la même raison et depuis les mêmes données.
 */

import { copyFile, access, readFile, writeFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

// Same client/ split as scripts/lib/crawl.mjs — see the note there.
const DIST = existsSync('dist/client') ? 'dist/client' : 'dist';

const copies = [[join(DIST, 'en', '404', 'index.html'), join(DIST, 'en', '404.html')]];

for (const [from, to] of copies) {
  try {
    await access(from);
  } catch {
    console.warn(`[post-build] skip: ${from} not found`);
    continue;
  }
  await copyFile(from, to);
  console.log(`[post-build] ${from} -> ${to}`);
}

/* --- 2. sitemap.xml, robots.txt, llms.txt -------------------------------- */

const xmlEscape = (s) => s.replace(/[&<>"']/g, (c) =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[c]);

const attr = (html, re) => html.match(re)?.[1] ?? null;

/** Chaque page indexable de la sortie : canonique, alternates, titre, description. */
async function collectPages(dir, out = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      await collectPages(full, out);
      continue;
    }
    if (entry.name !== 'index.html') continue;
    const html = await readFile(full, 'utf8');
    // Pas de canonique = page `noindex` (les 404). Elle s'exclut d'elle-même.
    const canonical = attr(html, /<link[^>]+rel="canonical"[^>]+href="([^"]+)"/);
    if (!canonical) continue;
    out.push({
      canonical,
      alternates: [
        ...html.matchAll(/<link[^>]+rel="alternate"[^>]+hreflang="([^"]+)"[^>]+href="([^"]+)"/g),
      ].map(([, hreflang, href]) => ({ hreflang, href })),
      title: attr(html, /<title>([^<]*)<\/title>/),
      description: attr(html, /<meta name="description" content="([^"]*)"/),
    });
  }
  return out;
}

const pages = (await collectPages(DIST)).sort((a, b) => a.canonical.localeCompare(b.canonical));

if (pages.length === 0) {
  // Un sitemap vide qui s'écrit proprement est le pire des résultats : il
  // annonce à un moteur que le site n'a aucune page.
  console.error('[post-build] ERREUR : aucune page avec canonique — sitemap NON écrit');
  process.exitCode = 1;
} else {
  const origin = new URL(pages[0].canonical).origin;

  const urls = pages
    .map((p) => {
      const alts = p.alternates
        .map((a) => `\n    <xhtml:link rel="alternate" hreflang="${xmlEscape(a.hreflang)}" href="${xmlEscape(a.href)}"/>`)
        .join('');
      return `  <url>\n    <loc>${xmlEscape(p.canonical)}</loc>${alts}\n  </url>`;
    })
    .join('\n');

  await writeFile(
    join(DIST, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
      `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" ` +
      `xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>\n`,
  );
  console.log(`[post-build] sitemap.xml : ${pages.length} URL(s), alternates inclus`);

  // robots.txt — rien à interdire : chaque page construite est destinée à être
  // indexée, et les 404 portent déjà `noindex` dans leur en-tête.
  await writeFile(
    join(DIST, 'robots.txt'),
    `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`,
  );
  console.log('[post-build] robots.txt écrit');

  // llms.txt — la convention llmstxt.org : un index markdown du site, pour qu'un
  // agent lise la structure au lieu de la deviner. Généré depuis les mêmes
  // pages, donc il ne peut pas dériver du site réel.
  const SECTIONS = [
    { title: 'Pages principales', test: (u) => /^\/(en\/)?$/.test(u) || /^\/(en\/)?[^/]+\/$/.test(u) && !/^\/(fondation|secteurs|blogue|en\/(foundation|areas|blog))\/$/.test(u) },
    { title: 'Interventions sur une fondation', test: (u) => /^\/(fondation|en\/foundation)\/[^/]*\/?$/.test(u) },
    { title: 'Intervention par secteur', test: (u) => /^\/(fondation|en\/foundation)\/[^/]+\/[^/]+\/$/.test(u) },
    { title: 'Secteurs desservis', test: (u) => /^\/(secteurs|en\/areas)\/[^/]+\/$/.test(u) },
    { title: 'Blogue', test: (u) => /^\/(blogue|en\/blog)\//.test(u) },
  ];
  const seen = new Set();
  const blocks = [];
  for (const s of SECTIONS) {
    const items = pages.filter((p) => {
      const path = new URL(p.canonical).pathname;
      return !seen.has(p.canonical) && s.test(path) && seen.add(p.canonical);
    });
    if (!items.length) continue;
    blocks.push(
      `## ${s.title}\n\n` +
        items
          .map((p) => `- [${p.title ?? p.canonical}](${p.canonical})${p.description ? `: ${p.description}` : ''}`)
          .join('\n'),
    );
  }
  await writeFile(
    join(DIST, 'llms.txt'),
    `# Solage Capitale\n\n` +
      `> Information sur la réparation de fondation résidentielle dans la région de Québec, ` +
      `et mise en relation avec un entrepreneur licencié. Service publicitaire et de mise en ` +
      `relation : le site n'exécute aucun travail et ne fournit aucun avis technique.\n\n` +
      `Site bilingue français (racine) et anglais (préfixe /en/). Chaque fait réglementaire ` +
      `cité est rattaché à sa source publique.\n\n` +
      `${blocks.join('\n\n')}\n`,
  );
  console.log(`[post-build] llms.txt écrit (${seen.size} page(s) indexées)`);
}
