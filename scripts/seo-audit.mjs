#!/usr/bin/env node
/**
 * Per-page SEO invariants, checked against the built HTML.
 *
 * Blocking (build fails):
 *   - missing/duplicate <title> or meta description
 *   - missing or non-self-referencing canonical
 *   - zero or multiple <h1>
 *   - broken hreflang reciprocity, a missing x-default, or an alternate that is
 *     neither built nor planned
 *   - a PLACEHOLDER_ value leaking into a page
 *   - images without alt
 *   - ui.fr.json / ui.en.json key drift
 *
 * Advisory (warn only):
 *   - title / description length outside the target window
 *   - an hreflang alternate that is planned but not built yet (the EN mirror is
 *     session 9; this must reach 0 before launch)
 *
 * Run: node scripts/seo-audit.mjs
 */

import { readFile } from 'node:fs/promises';
import {
  allMatches,
  createReport,
  hreflangMap,
  linkHref,
  loadPages,
  metaContent,
  tagContent,
} from './lib/crawl.mjs';
import { plannedUrls } from './lib/planned.mjs';

const TITLE_MAX = 60;
const DESC_MIN = 140;
const DESC_MAX = 158;

const report = createReport('seo-audit');
const pages = await loadPages();

/* --- UI dictionary parity ------------------------------------------------- */

function keyPaths(obj, prefix = '') {
  return Object.entries(obj).flatMap(([k, v]) => {
    if (k.startsWith('$')) return [];
    const path = prefix ? `${prefix}.${k}` : k;
    return v && typeof v === 'object' && !Array.isArray(v) ? keyPaths(v, path) : [path];
  });
}

const uiFr = JSON.parse(await readFile('src/data/ui.fr.json', 'utf8'));
const uiEn = JSON.parse(await readFile('src/data/ui.en.json', 'utf8'));
const frKeys = new Set(keyPaths(uiFr));
const enKeys = new Set(keyPaths(uiEn));

for (const k of frKeys) {
  if (!enKeys.has(k)) report.error('src/data/ui.en.json', `missing key "${k}" present in FR`);
}
for (const k of enKeys) {
  if (!frKeys.has(k)) report.error('src/data/ui.fr.json', `missing key "${k}" present in EN`);
}

/* --- per-page checks ------------------------------------------------------ */

const titles = new Map();
const descriptions = new Map();
const canonicals = new Map();

for (const page of pages) {
  const { url, html } = page;
  const isNoindex = /<meta[^>]+name=["']robots["'][^>]*noindex/i.test(html);

  // Placeholders must never ship.
  if (html.includes('PLACEHOLDER_')) {
    report.error(url, 'contains a PLACEHOLDER_ value — see docs/HANDOFF-TENANT.md');
  }

  const title = tagContent(html, 'title');
  if (!title) report.error(url, 'missing <title>');
  else {
    if (titles.has(title)) report.error(url, `duplicate <title>, also on ${titles.get(title)}`);
    else titles.set(title, url);
    if (title.length > TITLE_MAX) report.warn(url, `title is ${title.length} chars (max ${TITLE_MAX})`);
  }

  const desc = metaContent(html, 'description');
  if (!desc) report.error(url, 'missing meta description');
  else {
    if (descriptions.has(desc)) {
      report.error(url, `duplicate meta description, also on ${descriptions.get(desc)}`);
    } else descriptions.set(desc, url);
    // Length only matters where a snippet can be shown, so noindex pages skip it.
    if (!isNoindex && (desc.length < DESC_MIN || desc.length > DESC_MAX)) {
      report.warn(url, `description is ${desc.length} chars (target ${DESC_MIN}-${DESC_MAX})`);
    }
  }

  const h1s = allMatches(html, /<h1[^>]*>([\s\S]*?)<\/h1>/gi);
  if (h1s.length === 0) report.error(url, 'no <h1>');
  if (h1s.length > 1) report.error(url, `${h1s.length} <h1> tags, expected exactly 1`);

  // JSON-LD. Ce contrôle N'EXISTAIT PAS, et son absence a coûté cher : `BaseLayout`
  // écrivait `<set:html>…</set:html>`, qui n'est pas une balise mais une directive.
  // Astro rendait un élément inconnu, le navigateur fermait <head>, et le script
  // partait ÉCHAPPÉ en haut du <body>. Résultat : zéro donnée structurée sur les
  // 158 pages, la chaîne visible à l'écran — et `[seo-audit] 0 errors`.
  //
  // On valide donc la SORTIE, pas l'intention : le script existe, il parse, et il
  // porte les nœuds attendus. Un helper qui compile ne prouve pas qu'une page émet
  // (même leçon que `src/lib/data.ts`, PROGRESS.md session 2).
  const ld = html.match(
    /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/i,
  );
  if (!ld) {
    report.error(url, 'no <script type="application/ld+json"> — structured data is missing');
  } else {
    let parsed = null;
    try {
      parsed = JSON.parse(ld[1]);
    } catch (e) {
      report.error(url, `JSON-LD does not parse: ${e.message}`);
    }
    if (parsed) {
      if (parsed['@context'] !== 'https://schema.org') {
        report.error(url, 'JSON-LD is missing @context https://schema.org');
      }
      const nodes = Array.isArray(parsed['@graph']) ? parsed['@graph'] : [];
      if (nodes.length === 0) {
        report.error(url, 'JSON-LD @graph is empty');
      }
      // Organization + WebSite sont posés par le layout sur CHAQUE page. Leur
      // absence veut dire que le graphe n'est plus assemblé par le layout.
      for (const required of ['Organization', 'WebSite']) {
        if (!nodes.some((n) => n && n['@type'] === required)) {
          report.error(url, `JSON-LD @graph has no ${required} node`);
        }
      }
      // Règle 1, rendue mécanique : ces deux types exigent une adresse vérifiée et
      // de vrais avis, et il n'y a aucune entreprise derrière ce site (CLAUDE.md).
      for (const banned of ['LocalBusiness', 'AggregateRating']) {
        if (nodes.some((n) => n && n['@type'] === banned)) {
          report.error(url, `JSON-LD emits ${banned} — forbidden until the tenant handoff`);
        }
      }
    }
  }

  // Une directive Astro rendue en toutes lettres est toujours un bug de gabarit,
  // jamais du contenu. `set:html` est celle qui a mordu ; les autres suivent la
  // même forme d'échec — silencieuse, et visible seulement à l'écran.
  const leaked = html.match(/<\/?(set|is|client|define):[a-z]+/i);
  if (leaked) {
    report.error(url, `Astro directive "${leaked[0]}" rendered as literal markup`);
  }

  // Une page `noindex` n'a pas de devoir de canonique ni de hreflang : elle demande
  // explicitement à ne pas être indexée, donc il n'y a rien à canoniser et aucune paire
  // de langue à réconcilier. Le 404 localisé est le seul cas ici. Lui faire déclarer une
  // canonique la ferait entrer en collision avec la page dont il emprunte le `ref`.
  const noindex = /<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(html);

  const canonical = linkHref(html, 'canonical');
  if (!canonical) {
    if (!noindex) report.error(url, 'missing canonical');
  } else {
    const canonicalPath = new URL(canonical).pathname;
    if (canonicalPath !== url) {
      report.error(url, `canonical points at ${canonicalPath}, not self`);
    }
    if (!isNoindex) {
      if (canonicals.has(canonical)) {
        report.error(url, `canonical collides with ${canonicals.get(canonical)}`);
      } else canonicals.set(canonical, url);
    }
  }

  // hreflang: noindex pages (404s) intentionally emit none.
  const alternates = hreflangMap(html);
  const codes = Object.keys(alternates);
  if (!isNoindex) {
    for (const required of ['fr-ca', 'en-ca', 'x-default']) {
      if (!codes.includes(required)) report.error(url, `missing hreflang "${required}"`);
    }
    if (alternates['x-default'] && alternates['fr-ca'] && alternates['x-default'] !== alternates['fr-ca']) {
      report.error(url, 'x-default must point at the French URL');
    }
  } else if (codes.length) {
    report.error(url, 'noindex page should not emit hreflang alternates');
  }

  // Images need alt (empty alt is valid for decorative, missing is not).
  for (const tag of html.match(/<img\b[^>]*>/gi) ?? []) {
    if (!/\balt=/.test(tag)) report.error(url, `<img> without alt: ${tag.slice(0, 90)}`);
  }

  if (!/<html[^>]+lang=/.test(html)) report.error(url, 'missing lang attribute on <html>');
}

/* --- hreflang reciprocity across the whole build --------------------------- */

const byPath = new Map(pages.map((p) => [p.url, p]));
const planned = plannedUrls();
const pendingTwins = new Set();

for (const page of pages) {
  const alternates = hreflangMap(page.html);
  for (const [code, href] of Object.entries(alternates)) {
    if (code === 'x-default') continue;
    const targetPath = new URL(href).pathname;
    const target = byPath.get(targetPath);
    if (!target) {
      // The FR content lands in sessions 4-8; the EN mirror is session 9. Between
      // those, every FR page legitimately points at an EN twin that does not exist
      // yet, so a hard error here would block the entire content buildout.
      //
      // This mirrors the carve-out link-audit already makes via planned.mjs, and
      // it is NOT a weakened gate: an alternate that is neither built nor planned
      // is still a hard error, which is what catches a typo'd or orphaned slug.
      // CLAUDE.md rule 6 explicitly allows an FR page to ship ahead of its twin
      // provided the gap is tracked. Before launch the twins must exist -- session
      // 9's definition of done is this warning count reaching zero.
      if (planned.has(targetPath)) {
        pendingTwins.add(targetPath);
        report.warn(page.url, `hreflang ${code} -> ${targetPath} is planned but not built yet`);
      } else {
        report.error(page.url, `hreflang ${code} points at ${targetPath}, which was not built`);
      }
      continue;
    }
    const back = hreflangMap(target.html);
    const pointsBack = Object.values(back).some((h) => new URL(h).pathname === page.url);
    if (!pointsBack) {
      report.error(page.url, `hreflang ${code} -> ${targetPath} is not reciprocated`);
    }
  }
}

if (pendingTwins.size) {
  console.log(
    `[seo-audit] NOTE  ${pendingTwins.size} hreflang target(s) planned but not built yet — ` +
      `the EN mirror is session 9. This must reach 0 before launch.`,
  );
}

report.finish(pages.length);
