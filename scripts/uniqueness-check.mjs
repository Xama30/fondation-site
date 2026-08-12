#!/usr/bin/env node
/**
 * THE ANTI-DOORWAY GATE. This is the most important script in the repo.
 *
 * A service x sector matrix is exactly the shape Google classifies as doorway
 * pages when the pages are near-identical. This script measures how much each
 * page actually differs from its siblings and fails the build when it does not.
 *
 * Rules (docs/SEO-PLAN.md section 6):
 *   1. Jaccard similarity of 5-word shingles vs. any sibling <= MAX_SIMILARITY,
 *      measured on body copy with header/footer/nav stripped.
 *   2. >= MIN_LOCAL_FACTS sector-specific terms present, drawn from the page's
 *      own entry in src/data/cities.json (`localTerms`).
 *   3. >= MIN_FAQ FAQ entries.
 *   4. A hero image with alt text distinct from every sibling.
 *   5. >= MIN_WORDS of body copy.
 *
 * A combination that cannot clear this bar must be demoted to a section on the
 * sector hub and marked `demoted` in docs/KEYWORD-MAP.md. Publishing it thin
 * costs more than not publishing it at all.
 *
 * Run: node scripts/uniqueness-check.mjs
 */

import { readFile } from 'node:fs/promises';
import { bodyText, createReport, jaccard, loadPages, shingles, words } from './lib/crawl.mjs';

const MAX_SIMILARITY = 0.35;
const MIN_LOCAL_FACTS = 5;
const MIN_FAQ = 4;
const MIN_WORDS = 400;

/** Set PENDING_IMAGES=strict before launch to fail on any remaining placeholder. */
const STRICT_IMAGES = process.env.PENDING_IMAGES === 'strict';
const pendingImages = new Set();

/** Page families that must be internally distinct. */
const FAMILIES = [
  // Registering a family is part of building its route, not a later step: a
  // family that is not listed here ships UNCHECKED and the gate reports a clean
  // pass. That happened twice on the previous project (PLAYBOOK §6.1).
  { name: 'service-fr', test: (u) => /^\/fondation\/[^/]+\/$/.test(u) },
  { name: 'service-en', test: (u) => /^\/en\/foundation\/[^/]+\/$/.test(u) },
  // Sector LAST -- sectorFromUrl() reads parts.at(-1).
  { name: 'matrix-fr', test: (u) => /^\/fondation\/[^/]+\/[^/]+\/$/.test(u) },
  { name: 'matrix-en', test: (u) => /^\/en\/foundation\/[^/]+\/[^/]+\/$/.test(u) },
  { name: 'sector-fr', test: (u) => /^\/secteurs\/[^/]+\/$/.test(u) },
  { name: 'sector-en', test: (u) => /^\/en\/areas\/[^/]+\/$/.test(u) },
  // Enregistrée AVANT d'écrire le premier article, pas après : une famille
  // absente d'ici passe sans contrôle et la porte annonce un succès propre.
  // `sectorFromUrl()` renvoie null pour ces noms, donc la règle des faits locaux
  // ne s'y applique pas — seuls la similarité et le seuil de mots comptent, ce
  // qui est le bon contrôle pour des articles sur des sujets distincts.
  { name: 'blog-fr', test: (u) => /^\/blogue\/[^/]+\/$/.test(u) },
  { name: 'blog-en', test: (u) => /^\/en\/blog\/[^/]+\/$/.test(u) },
];

const report = createReport('uniqueness');
const pages = await loadPages();

// cities.json arrives in session 2; until then the local-facts rule is skipped
// with a notice rather than silently passing.
let cities = null;
try {
  cities = JSON.parse(await readFile('src/data/cities.json', 'utf8'));
} catch {
  cities = null;
}

let checked = 0;

for (const family of FAMILIES) {
  const members = pages.filter((p) => family.test(p.url));
  if (members.length === 0) continue;

  const prepared = members.map((page) => {
    const text = bodyText(page.html);
    return {
      url: page.url,
      html: page.html,
      text,
      wordCount: words(text).length,
      grams: shingles(text, 5),
      sector: sectorFromUrl(page.url, family.name),
      heroAlt: heroAlt(page.html),
      isPlaceholder: page.html.includes('data-image-pending'),
    };
  });

  // 1. pairwise similarity
  for (let i = 0; i < prepared.length; i++) {
    for (let j = i + 1; j < prepared.length; j++) {
      const score = jaccard(prepared[i].grams, prepared[j].grams);
      if (score > MAX_SIMILARITY) {
        report.error(
          prepared[i].url,
          `${(score * 100).toFixed(0)}% similar to ${prepared[j].url} (max ${MAX_SIMILARITY * 100}%) — rewrite or demote`,
        );
      }
    }
  }

  for (const page of prepared) {
    checked++;

    // 5. depth
    if (page.wordCount < MIN_WORDS) {
      report.error(page.url, `${page.wordCount} words of body copy (min ${MIN_WORDS})`);
    }

    // 3. FAQ depth
    const faqCount = (page.html.match(/<summary\b/gi) ?? []).length;
    if (family.name.startsWith('matrix') || family.name.startsWith('sector')) {
      if (faqCount < MIN_FAQ) {
        report.error(page.url, `${faqCount} FAQ entries (min ${MIN_FAQ})`);
      }
    }

    // 2. local specificity
    if (cities && page.sector) {
      const entry = cities[page.sector];
      if (!entry) {
        report.error(page.url, `no entry for sector "${page.sector}" in src/data/cities.json`);
      } else {
        // EN pages are checked against `localTermsEn` when the entry supplies it,
        // falling back to `localTerms`.
        //
        // Why: `localTerms` mixes proper nouns (avenue Royale, rivière
        // Saint-Charles) with generic French vocabulary (solage, grange, boisé).
        // Proper nouns correctly stay French in English prose, but the generic
        // terms do not -- "grange" becomes "barn" -- so matching French literals
        // on an EN page penalises an accurate translation. `/en/areas/lange-gardien/`
        // failed at 3/5 in session 9 for exactly that reason, with nothing wrong
        // with the page.
        //
        // This is NOT a relaxed rule: the count and the threshold are unchanged,
        // and an entry without `localTermsEn` is still held to the French list.
        // It only lets an entry declare the English evidence that proves the same
        // thing. Populate `localTermsEn` lazily, for entries whose EN twin fails.
        const isEn = family.name.endsWith('-en');
        const terms = (isEn ? (entry.localTermsEn ?? entry.localTerms) : entry.localTerms) ?? [];
        const haystack = page.text.toLowerCase();
        const hits = terms.filter((term) => haystack.includes(String(term).toLowerCase()));
        if (hits.length < MIN_LOCAL_FACTS) {
          report.error(
            page.url,
            `${hits.length} local reference(s) from cities.json localTerms (min ${MIN_LOCAL_FACTS}) — the page is not actually about ${page.sector}`,
          );
        }
      }
    }

    // 4. distinct hero
    //
    // Photography arrives after the pages are written, so a page still on the
    // branded placeholder is counted, not failed -- otherwise the whole content
    // buildout would be blocked on a photo shoot. The rule re-arms on its own:
    // once a page carries a real image, a duplicate hero alt is a hard error
    // again. `PENDING_IMAGES=strict` fails the build on any remaining
    // placeholder, which is the pre-launch check.
    // Sector pages only. Matrix pages deliberately carry no hero (they lead with
    // the localAngle standfirst instead), so neither the placeholder count nor the
    // distinct-alt rule applies to them. This is a change in what the pages ARE,
    // not a relaxed threshold: the rule is unchanged for every family that has one.
    if (family.name.startsWith('sector')) {
      if (page.isPlaceholder) {
        pendingImages.add(page.url);
        if (STRICT_IMAGES) {
          report.error(page.url, 'still on placeholder imagery — see docs/IMAGE-NEEDS.md');
        }
      } else if (!page.heroAlt) {
        report.warn(page.url, 'no hero image with alt text');
      } else {
        const clash = prepared.find(
          (o) => o !== page && !o.isPlaceholder && o.heroAlt && o.heroAlt === page.heroAlt,
        );
        if (clash) report.error(page.url, `hero alt text identical to ${clash.url}`);
      }
    }
  }
}

if (!cities) {
  console.log('[uniqueness] NOTE  src/data/cities.json not found — local-facts rule skipped (session 2 creates it)');
}

if (pendingImages.size) {
  console.log(
    `[uniqueness] NOTE  ${pendingImages.size} page(s) awaiting real photography — hero-distinctness deferred.\n` +
      `                  Run with PENDING_IMAGES=strict before launch. Shot list: docs/IMAGE-NEEDS.md`,
  );
}

function sectorFromUrl(url, family) {
  const parts = url.split('/').filter(Boolean);
  if (family.startsWith('matrix')) return parts.at(-1) ?? null;
  if (family.startsWith('sector')) return parts.at(-1) ?? null;
  return null;
}

function heroAlt(html) {
  // Match on the DELIMITING quote, not "either quote". A French alt legitimately
  // contains apostrophes ("Vue du secteur L'Ancienne-Lorette"), and a [^"']+ class
  // truncates it at the first one -- which made L'Ancienne-Lorette and L'Ange-Gardien
  // both read as "Vue du secteur L" and collide as duplicate hero alts. Same bug as
  // metaContent() in scripts/lib/crawl.mjs, fixed in session 4.
  const img = html.match(/<img\b[^>]*\balt=(["'])([\s\S]*?)\1/i);
  if (img) return img[2].trim().toLowerCase();
  // An inline SVG with role="img" and an aria-label IS a hero with alt text --
  // the sector pages use a data-driven graphic rather than a photo. Reading only
  // <img> here would have reported "no hero image" on 98 pages that have one.
  const svg = html.match(/<svg\b[^>]*\brole=["']img["'][^>]*\baria-label=(["'])([\s\S]*?)\1/i);
  return svg ? svg[2].trim().toLowerCase() : null;
}

report.finish(checked);
