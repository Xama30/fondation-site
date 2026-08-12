/**
 * THE URL SYSTEM. Every slug on the site, both locales, in one place.
 *
 * Pages declare a locale-independent `PageRef`; the canonical, both hreflang
 * alternates and the language switcher are all derived from it through
 * `src/lib/routes.ts`. This is the single mechanism that keeps FR/EN pairs
 * correct across a dozen sessions -- and it is why the audit scripts import
 * this exact file rather than keeping a second list.
 *
 * Relative `.ts` specifiers, not path aliases: aliases would break the scripts.
 *
 * Rule 4: URLs are frozen after launch. Additions only.
 */

import type { Locale } from '../lib/constants.ts';

export type LocalizedSlug = Record<Locale, string>;

/* -------------------------------------------------------------- sections -- */

/** The verticals' URL roots. `/fondation/` carries the niche keyword. */
export const SECTION_ROOTS = {
  service: { fr: 'fondation', en: 'foundation' },
  sector: { fr: 'secteurs', en: 'areas' },
  blog: { fr: 'blogue', en: 'blog' },
} as const satisfies Record<string, LocalizedSlug>;

/* -------------------------------------------------------------- services -- */

/**
 * The 11 service hubs. Keys are locale-independent identifiers; the values are
 * the slugs that appear in the URL for each locale.
 *
 * Only `drain-francais` and `fissure` carry a geo matrix -- the other nine do
 * not hold enough `service + place` intent to survive MAX_SIMILARITY across 25
 * siblings. See docs/SEO-PLAN.md §5.
 */
export const SERVICE_SLUGS = {
  fissure: { fr: 'fissure-de-fondation', en: 'foundation-crack-repair' },
  drain: { fr: 'drain-francais', en: 'french-drain' },
  impermeabilisation: { fr: 'impermeabilisation-de-fondation', en: 'foundation-waterproofing' },
  infiltration: { fr: 'infiltration-eau-sous-sol', en: 'basement-water-infiltration' },
  ocre: { fr: 'ocre-ferreuse', en: 'iron-ochre' },
  affaissement: { fr: 'affaissement-de-fondation', en: 'foundation-settlement' },
  humidite: { fr: 'humidite-et-moisissure-sous-sol', en: 'basement-humidity-and-mould' },
  puisard: { fr: 'pompe-de-puisard-et-drain-interieur', en: 'sump-pump-and-interior-drain' },
  videSanitaire: { fr: 'vide-sanitaire', en: 'crawl-space' },
  inspection: { fr: 'inspection-de-drain-par-camera', en: 'drain-camera-inspection' },
  pyrite: { fr: 'pyrite', en: 'pyrite' },
} as const satisfies Record<string, LocalizedSlug>;

export type ServiceKey = keyof typeof SERVICE_SLUGS;

/** The only services that get `service × sector` pages. */
export const MATRIX_SERVICES = ['drain', 'fissure'] as const satisfies readonly ServiceKey[];

/* --------------------------------------------------------------- sectors -- */

/**
 * Sector slugs are identical in both locales: they are proper nouns. Beauport
 * is Beauport in English. The keys live in `src/data/cities.json` (51 entries,
 * tiers A/B/C) and are read from there rather than duplicated here.
 *
 * Tier A is typed because the matrix depends on these keys existing.
 */
export const TIER_A_SECTORS = [
  'beauport',
  'charlesbourg',
  'la-cite-limoilou',
  'la-haute-saint-charles',
  'les-rivieres',
  'sainte-foy-sillery-cap-rouge',
  'levis',
] as const;

export type TierASector = (typeof TIER_A_SECTORS)[number];

/* ---------------------------------------------------------- static pages -- */

export const STATIC_PAGES = {
  quote: { fr: 'soumission', en: 'quote' },
  /**
   * La page de retour du formulaire. `worker/lead-form.ts` y renvoie en 303
   * après un envoi réussi.
   *
   * ⚠ ELLE MANQUAIT JUSQU'AU 2026-08-11, et c'était un vrai bug : le Worker
   * redirigeait vers `/merci/` et `/en/thank-you/`, deux URL qu'aucun fichier ne
   * construisait. Une soumission qui PARTAIT correctement se terminait donc sur
   * un 404 — le visiteur ne pouvait pas savoir si sa demande avait été reçue.
   * Aucune porte ne pouvait l'attraper : la cible d'un 303 émis par le Worker
   * n'est pas un lien dans le HTML, donc `link-audit` ne la voit pas.
   *
   * `noindex` : c'est une page de confirmation, elle n'a rien à faire dans un
   * index et elle est exclue de `/plan-du-site/` pour la même raison.
   */
  thankYou: { fr: 'merci', en: 'thank-you' },
  pricing: { fr: 'prix', en: 'pricing' },
  emergency: { fr: 'urgence', en: 'emergency' },
  process: { fr: 'processus', en: 'process' },
  serviceArea: { fr: 'territoire', en: 'service-area' },
  faq: { fr: 'faq', en: 'faq' },
  about: { fr: 'a-propos', en: 'about' },
  contact: { fr: 'contact', en: 'contact' },
  terms: { fr: 'conditions-utilisation', en: 'terms' },
  privacy: { fr: 'confidentialite', en: 'privacy' },
  sitemap: { fr: 'plan-du-site', en: 'sitemap' },
} as const satisfies Record<string, LocalizedSlug>;

export type StaticPageKey = keyof typeof STATIC_PAGES;
