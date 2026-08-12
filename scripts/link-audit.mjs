#!/usr/bin/env node
/**
 * Internal link graph health.
 *
 * Blocking:
 *   - internal link pointing at a path that was not built (404 in waiting)
 *   - a money page with 0 inbound internal links (orphan)
 *
 * Advisory:
 *   - money page below MIN_INBOUND / MIN_OUTBOUND contextual links
 *   - an anchor text reused for one destination more than ANCHOR_MAX times,
 *     which reads as templated linking rather than editorial linking
 *
 * "Money pages" are the service hubs, the sector hubs and the service x sector
 * matrix -- see MONEY below. Utility pages and 404s are exempt. Thresholds come
 * from docs/SEO-PLAN.md section 10.
 *
 * (This comment said "pest, sector, matrix and commercial" until session 4: it
 * described the PREVIOUS project, like post-build.mjs did. A comment that names
 * families this repo does not have sends the next reader looking for them.)
 *
 * Run: node scripts/link-audit.mjs
 */

import { anchorPairs, bodyText, createReport, internalLinks, loadPages, words } from './lib/crawl.mjs';
import { plannedUrls } from './lib/planned.mjs';

const MIN_INBOUND = 3;
const MIN_OUTBOUND = 5;
const ANCHOR_MAX = 25;

const MONEY = [
  /^\/fondation\//,
  /^\/en\/foundation\//,
  /^\/secteurs\//,
  /^\/en\/areas\//,
];

const isMoneyPage = (url) => MONEY.some((re) => re.test(url));

const report = createReport('link-audit');
const pages = await loadPages();
const built = new Set(pages.map((p) => p.url));
const planned = plannedUrls();

const inbound = new Map(pages.map((p) => [p.url, new Set()]));
const anchorUse = new Map();
const pending = new Set();

for (const page of pages) {
  const links = internalLinks(page.html);
  const unique = new Set(links);

  for (const href of unique) {
    const target = href.endsWith('/') ? href : `${href}/`;
    if (!built.has(target)) {
      // Planned-but-not-yet-built is the normal mid-buildout state; anything
      // else is a typo or a slug that never went through docs/KEYWORD-MAP.md.
      if (planned.has(target)) pending.add(target);
      else report.error(page.url, `links to ${href}, which is neither built nor planned`);
      continue;
    }
    if (target !== page.url) inbound.get(target)?.add(page.url);
  }

  if (isMoneyPage(page.url)) {
    // Count only links inside the body copy: header/footer links are sitewide
    // furniture and say nothing about topical relevance.
    const contextual = new Set(
      internalLinks(stripChrome(page.html)).map((h) => (h.endsWith('/') ? h : `${h}/`)),
    );
    contextual.delete(page.url);
    if (contextual.size < MIN_OUTBOUND) {
      report.warn(page.url, `${contextual.size} contextual outbound links (target >= ${MIN_OUTBOUND})`);
    }

    const bodyWords = words(bodyText(page.html)).length;
    if (bodyWords < 300) {
      report.warn(page.url, `only ${bodyWords} words of body copy`);
    }
  }

  // Same reasoning as the contextual-outbound count above: strip the chrome.
  // The header and footer link to /tarifs/ and /secteurs/ from all 284 pages with
  // deliberately identical wording -- that is correct navigation, not templated
  // editorial linking, and varying it per page would be an accessibility problem,
  // not an improvement. Counting it made 69 of 87 warnings unactionable noise and
  // buried the real ones. Threshold unchanged.
  for (const { href, text } of anchorPairs(stripChrome(page.html))) {
    const key = `${href}||${text.toLowerCase()}`;
    anchorUse.set(key, (anchorUse.get(key) ?? 0) + 1);
  }
}

for (const [url, sources] of inbound) {
  if (!isMoneyPage(url)) continue;
  if (sources.size === 0) {
    report.error(url, 'orphan page — no internal links point at it');
  } else if (sources.size < MIN_INBOUND) {
    report.warn(url, `${sources.size} inbound internal links (target >= ${MIN_INBOUND})`);
  }
}

for (const [key, count] of anchorUse) {
  if (count > ANCHOR_MAX) {
    const [href, text] = key.split('||');
    report.warn(href, `anchor "${text}" reused ${count}x — vary the anchor text`);
  }
}

function stripChrome(html) {
  return html
    .replace(/<header[\s\S]*?<\/header>/gi, ' ')
    .replace(/<footer[\s\S]*?<\/footer>/gi, ' ')
    .replace(/<nav[\s\S]*?<\/nav>/gi, ' ');
}

if (pending.size) {
  console.log(
    `[link-audit] NOTE  ${pending.size} planned page(s) linked but not built yet — see docs/PROGRESS.md for the session that creates them`,
  );
}

report.finish(pages.length);
