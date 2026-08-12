/**
 * Shared helpers for the audit scripts. Parses the built `dist/` tree with
 * regexes rather than a DOM library: the output is static HTML we generate
 * ourselves, so there is no need to pull in a parser dependency.
 */

import { readdir, readFile } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';

/**
 * Where the built HTML lives.
 *
 * A pure static build emits `dist/`. With an adapter (we use @astrojs/node for
 * self-hosting) Astro splits the output into `dist/client` and `dist/server`, and
 * the pages are under `client`. Resolving this rather than hardcoding `dist`
 * matters: when the adapter was added, every audit script silently started
 * reading the wrong tree and reported 346 phantom errors.
 */
import { existsSync } from 'node:fs';

export const DIST = existsSync('dist/client') ? 'dist/client' : 'dist';

/** Every .html file in dist/, as { file, url, html }. */
export async function loadPages(dist = DIST) {
  const files = [];

  async function walk(dir) {
    let entries;
    try {
      entries = await readdir(dir, { withFileTypes: true });
    } catch {
      throw new Error(`No build output at "${dir}". Run \`npm run build:fast\` first.`);
    }
    for (const entry of entries) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) await walk(full);
      else if (entry.name.endsWith('.html')) files.push(full);
    }
  }

  await walk(dist);

  const pages = await Promise.all(
    files.map(async (file) => {
      const html = await readFile(file, 'utf8');
      const rel = relative(dist, file).split(sep).join('/');
      const url = '/' + rel.replace(/index\.html$/, '').replace(/\.html$/, '/');
      return { file, url, html };
    }),
  );

  // Several files can resolve to the same URL -- notably the localized 404 that
  // post-build.mjs copies to `en/404.html` alongside `en/404/index.html`. Audit
  // each URL once, preferring the directory form Astro generated.
  const byUrl = new Map();
  for (const page of pages) {
    const existing = byUrl.get(page.url);
    if (!existing || page.file.endsWith(`index.html`)) byUrl.set(page.url, page);
  }
  return [...byUrl.values()];
}

export function tagContent(html, tag) {
  const m = html.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'i'));
  return m ? decode(m[1].replace(/<[^>]+>/g, '').trim()) : null;
}

export function metaContent(html, name) {
  // The content group must be delimited by the *matching* quote character, not by
  // "either quote": a French description legitimately contains apostrophes
  // ("signes d'infestation"), and a [^"']* class truncates it at the first one --
  // which made every FR page look ~100 chars short of the description target.
  const m = html.match(
    new RegExp(`<meta[^>]+name=["']${name}["'][^>]*content=(["'])([\\s\\S]*?)\\1`, 'i'),
  );
  return m ? decode(m[2]) : null;
}

export function linkHref(html, rel) {
  const m = html.match(new RegExp(`<link[^>]+rel=["']${rel}["'][^>]*href=["']([^"']*)["']`, 'i'));
  return m ? m[1] : null;
}

export function allMatches(html, regex) {
  return [...html.matchAll(regex)].map((m) => m[1]);
}

/** hreflang -> href, from the <link rel="alternate"> tags. */
export function hreflangMap(html) {
  const out = {};
  for (const m of html.matchAll(
    /<link[^>]+rel=["']alternate["'][^>]*hreflang=["']([^"']+)["'][^>]*href=["']([^"']+)["']/gi,
  )) {
    // Language tags are case-insensitive per BCP 47, and the conventional
    // rendering is `fr-CA`. Normalizing here rather than demanding lowercase in
    // the page keeps the gate's meaning intact -- it was a parser bug, not a
    // threshold. Callers compare against lowercase codes.
    out[m[1].toLowerCase()] = m[2];
  }
  return out;
}

/** Internal hrefs found in <a> tags, normalized to paths without hash/query. */
export function internalLinks(html) {
  const hrefs = allMatches(html, /<a[^>]+href=["']([^"']+)["']/gi);
  return hrefs
    .filter((h) => h.startsWith('/') && !h.startsWith('//'))
    .map((h) => h.split('#')[0].split('?')[0])
    .filter(Boolean);
}

/** Anchor text keyed by destination, for anchor-diversity checks. */
export function anchorPairs(html) {
  const out = [];
  for (const m of html.matchAll(/<a[^>]+href=["'](\/[^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
    const text = decode(m[2].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim());
    if (text) out.push({ href: m[1].split('#')[0].split('?')[0], text });
  }
  return out;
}

/**
 * Visible body text with the shared chrome stripped out. Header, footer, nav and
 * script/style are removed so uniqueness is measured on the copy that actually
 * differs between pages rather than on the site furniture every page shares.
 */
export function bodyText(html) {
  let s = html;
  s = s.replace(/<(script|style|svg)[\s\S]*?<\/\1>/gi, ' ');
  s = s.replace(/<header[\s\S]*?<\/header>/gi, ' ');
  s = s.replace(/<footer[\s\S]*?<\/footer>/gi, ' ');
  s = s.replace(/<nav[\s\S]*?<\/nav>/gi, ' ');
  s = s.replace(/<!--[\s\S]*?-->/g, ' ');
  s = s.replace(/<[^>]+>/g, ' ');
  return decode(s).replace(/\s+/g, ' ').trim();
}

export function words(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s'-]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

/** Overlapping n-gram set, used for the Jaccard similarity in uniqueness-check. */
export function shingles(text, n = 5) {
  const w = words(text);
  const set = new Set();
  for (let i = 0; i + n <= w.length; i++) set.add(w.slice(i, i + n).join(' '));
  return set;
}

export function jaccard(a, b) {
  if (!a.size || !b.size) return 0;
  let shared = 0;
  const [small, large] = a.size < b.size ? [a, b] : [b, a];
  for (const item of small) if (large.has(item)) shared++;
  return shared / (a.size + b.size - shared);
}

function decode(s) {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)));
}

/* --- reporting ------------------------------------------------------------ */

export function createReport(name) {
  const errors = [];
  const warnings = [];
  return {
    error: (url, msg) => errors.push({ url, msg }),
    warn: (url, msg) => warnings.push({ url, msg }),
    finish(pageCount) {
      const label = `[${name}]`;
      for (const w of warnings) console.warn(`${label} WARN  ${w.url} — ${w.msg}`);
      for (const e of errors) console.error(`${label} ERROR ${e.url} — ${e.msg}`);

      const summary = `${label} ${pageCount} pages · ${errors.length} errors · ${warnings.length} warnings`;
      if (errors.length) {
        console.error(summary);
        process.exitCode = 1;
      } else {
        console.log(summary);
      }
      return errors.length === 0;
    },
  };
}
