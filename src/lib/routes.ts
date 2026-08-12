/**
 * PageRef -> URL, in every locale.
 *
 * Never hand-write an internal URL. A page declares what it *is* (a service hub
 * for `drain`, a sector hub for `beauport`), and this module answers what its
 * path is in FR, in EN, and therefore what its canonical, its hreflang
 * alternates and its language-switch target are. One source of truth, enforced
 * by derivation (PLAYBOOK §0.4).
 */

import { LOCALES, SITE_URL, type Locale } from './constants.ts';
import {
  SECTION_ROOTS,
  SERVICE_SLUGS,
  STATIC_PAGES,
  type ServiceKey,
  type StaticPageKey,
} from '../data/slugs.ts';

export type PageRef =
  | { type: 'home' }
  | { type: 'static'; page: StaticPageKey }
  | { type: 'serviceIndex' }
  | { type: 'service'; service: ServiceKey }
  | { type: 'serviceSector'; service: ServiceKey; sector: string }
  | { type: 'sectorIndex' }
  | { type: 'sector'; sector: string }
  | { type: 'blogIndex' }
  | { type: 'blogPost'; slug: LocalizedSlugLike };

/** Blog slugs genuinely differ per locale, so a post carries both. */
export type LocalizedSlugLike = Record<Locale, string>;

/** Always leading and trailing slash; `trailingSlash: 'always'` depends on it. */
const join = (locale: Locale, ...parts: string[]): string => {
  const prefix = locale === 'fr' ? [] : [locale];
  const segments = [...prefix, ...parts].filter(Boolean);
  return `/${segments.join('/')}/`.replace(/\/{2,}/g, '/');
};

export function pathFor(ref: PageRef, locale: Locale): string {
  switch (ref.type) {
    case 'home':
      return join(locale);
    case 'static':
      return join(locale, STATIC_PAGES[ref.page][locale]);
    case 'serviceIndex':
      return join(locale, SECTION_ROOTS.service[locale]);
    case 'service':
      return join(locale, SECTION_ROOTS.service[locale], SERVICE_SLUGS[ref.service][locale]);
    case 'serviceSector':
      // The sector is the LAST segment. scripts/uniqueness-check.mjs reads
      // parts.at(-1) as the sector; inverting this makes the local-facts rule
      // check nothing and report a clean pass. Do not reorder.
      return join(
        locale,
        SECTION_ROOTS.service[locale],
        SERVICE_SLUGS[ref.service][locale],
        ref.sector,
      );
    case 'sectorIndex':
      return join(locale, SECTION_ROOTS.sector[locale]);
    case 'sector':
      return join(locale, SECTION_ROOTS.sector[locale], ref.sector);
    case 'blogIndex':
      return join(locale, SECTION_ROOTS.blog[locale]);
    case 'blogPost':
      return join(locale, SECTION_ROOTS.blog[locale], ref.slug[locale]);
  }
}

/** Absolute URL, built with `new URL()` so a malformed base fails legibly. */
export const urlFor = (ref: PageRef, locale: Locale): string =>
  new URL(pathFor(ref, locale), SITE_URL + '/').toString();

/** { fr: '/…/', en: '/en/…/' } — feeds hreflang, the sitemap and the switcher. */
export function alternatesFor(ref: PageRef): Record<Locale, string> {
  return Object.fromEntries(LOCALES.map((l) => [l, pathFor(ref, l)])) as Record<Locale, string>;
}
