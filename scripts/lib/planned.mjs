/**
 * Enumerates every URL the finished site will contain, derived from the same
 * slug registry the pages themselves use (`src/data/slugs.ts` + `routes.ts`).
 *
 * Why this exists: during the multi-session buildout, the home page legitimately
 * links to service and sector pages that a later session will create. Without
 * this list, `link-audit.mjs` cannot tell that case apart from a typo. With it:
 *
 *   built            -> ok
 *   planned, unbuilt -> warning (expected during buildout)
 *   neither          -> ERROR (a typo, or a slug that skipped KEYWORD-MAP)
 *
 * ⚠ The carve-out has a failure mode (PLAYBOOK §7.3): a URL that will never be
 * built counts as planned forever, so four dead links hid for six sessions on
 * the previous project. Anything demoted must be REMOVED from here, and link
 * grids must be driven by getCollection(), not by the raw data file.
 *
 * Node 24 strips TypeScript types natively, so these .ts modules import directly
 * -- which is the point: there is no second copy of the slug list to drift.
 */

import { readFileSync } from 'node:fs';
import { pathFor } from '../../src/lib/routes.ts';
import { LOCALES } from '../../src/lib/constants.ts';
import {
  MATRIX_SERVICES,
  SERVICE_SLUGS,
  STATIC_PAGES,
  TIER_A_SECTORS,
} from '../../src/data/slugs.ts';

/** Every sector key in cities.json, ignoring the `$`-prefixed metadata keys. */
function sectorKeysFromCities() {
  const cities = JSON.parse(readFileSync('src/data/cities.json', 'utf8'));
  return Object.keys(cities).filter((k) => !k.startsWith('$'));
}

export function plannedUrls() {
  const urls = new Set();
  const add = (ref) => {
    for (const locale of LOCALES) urls.add(pathFor(ref, locale));
  };

  add({ type: 'home' });
  add({ type: 'blogIndex' });
  add({ type: 'serviceIndex' });
  // `sectorIndex` (/secteurs/) est VOLONTAIREMENT absent. La session 3b a décidé
  // qu'il resterait un préfixe d'URL sans page, pour ne pas concurrencer
  // /territoire/ sur « secteurs desservis ». Le laisser ici en faisait un
  // « planifié à vie » — précisément le mode d'échec décrit en tête de ce
  // fichier, et il couvrait un lien mort réel dans l'en-tête pendant plusieurs
  // sessions. Retiré : tout lien vers /secteurs/ est désormais une ERREUR dure.

  for (const page of Object.keys(STATIC_PAGES)) add({ type: 'static', page });
  for (const service of Object.keys(SERVICE_SLUGS)) add({ type: 'service', service });

  // 51 sectors, tiers A/B/C. They live only in cities.json; reading them here is
  // what lets /territoire/ link them without link-audit flagging "neither built
  // nor planned".
  for (const sector of sectorKeysFromCities()) add({ type: 'sector', sector });

  // The service x sector matrix. Every combination is a CANDIDATE until phase 3
  // derives the approved set from `foundationPressure` in cities.json; until
  // then only Tier A is planned, and the cap is 30 approved per locale.
  for (const service of MATRIX_SERVICES) {
    for (const sector of TIER_A_SECTORS) add({ type: 'serviceSector', service, sector });
  }

  return urls;
}
