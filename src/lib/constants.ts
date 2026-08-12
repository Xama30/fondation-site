/**
 * Values every layer shares: the audit scripts import this file directly
 * (Node 24 strips TS types natively), so there is exactly one copy.
 */

export const LOCALES = ['fr', 'en'] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'fr';

export const otherLocale = (locale: Locale): Locale => (locale === 'fr' ? 'en' : 'fr');

/** Brand name. Not a legal entity — there is no company yet. See docs/DESIGN.md. */
export const SITE_NAME = 'Solage Capitale';

/**
 * LE RESPONSABLE DE LA PROTECTION DES RENSEIGNEMENTS PERSONNELS.
 *
 * Ce n'est pas un marqueur de confiance et ce n'est pas décoratif : la loi
 * québécoise sur la protection des renseignements personnels dans le secteur
 * privé s'applique à quiconque recueille, **personne physique comprise**, et
 * elle exige que la personne responsable soit IDENTIFIABLE par la personne
 * concernée. `/confidentialite/` promet un droit d'accès, de rectification et
 * de suppression, et renvoie à `/contact/` pour l'exercer — sans un nom réel et
 * un canal joignable à cette page, la promesse est creuse.
 *
 * ⚠ **Le formulaire ne s'active pas tant que ces deux valeurs sont vides.**
 * C'est la règle de `docs/HANDOFF-TENANT.md` §4.1.
 *
 * Une constante et non `src/data/site.json` parce que rien n'importe ce fichier
 * — les valeurs y seraient mortes. Ici, elles sont lues par les deux pages
 * `/contact/` et par le pied du formulaire, donc les trois ne peuvent pas
 * diverger. **Au handoff, le responsable devient le locataire** (§4.1) : c'est
 * cette constante qu'on change, et rien d'autre.
 */
export const PRIVACY_OFFICER = {
  name: 'Xavier Breton',
  email: 'contact@solagecapitale.ca',
} as const;

/**
 * Canonical origin. Read from the environment because the domain is not chosen.
 * Normalized at the boundary: an empty string is not an unset variable, and `??`
 * does not fall back on `''` (PLAYBOOK §10.4).
 */
const rawSite = (import.meta.env?.SITE_URL ?? process.env.SITE_URL ?? '').trim();
export const SITE_URL = (rawSite || 'http://localhost:4321').replace(/\/$/, '');

/**
 * L'URL du seul endpoint exécutable du site. Le `action` des deux formulaires
 * et la table de routage de `worker/index.ts` en dérivent tous les deux, donc
 * ils ne peuvent pas diverger — c'est le même principe que `src/data/slugs.ts`
 * pour les pages.
 *
 * ⚠ LA BARRE OBLIQUE FINALE EST SIGNIFICATIVE. `astro.config.mjs` impose
 * `trailingSlash: 'always'`, et le Worker accepte les DEUX orthographes plutôt
 * que d'en rediriger une vers l'autre : un navigateur dégrade un POST en GET
 * quand il suit un 301, ce qui perd la soumission en silence. Ne jamais
 * « nettoyer » ça en redirection (`docs/DEPLOY.md` §5).
 */
export const LEAD_ENDPOINT = '/api/soumission/';
