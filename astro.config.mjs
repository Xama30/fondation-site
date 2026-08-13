// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

/**
 * No adapter, on purpose. Every page prerenders; the one route that executes
 * (the lead form) lives in worker/index.ts, outside Astro. Adding an adapter
 * drags in a Node origin, and a Node origin serving prerendered pages emits
 * `cache-control: max-age=0` -- a month of zero edge caching on the previous
 * project. See docs/PLAYBOOK.md §2 and §10.
 *
 * `site` : le domaine par défaut est `https://solagecapitale.ca` depuis le
 * 2026-08-12, et c'est un DURCISSEMENT, pas un relâchement.
 *
 * Le défaut était `http://localhost:4321`. C'était juste tant que le domaine
 * n'était pas acheté : il rendait l'inconnue comptable. Depuis qu'il l'est, ce
 * défaut n'est plus une protection, c'est LE mode de panne — un build lancé
 * sans `SITE_URL` sort 190 canoniques vers une machine locale, et il sort vert.
 * Vérifié le 2026-08-12 : `<link rel="canonical" href="http://localhost:4321/">`.
 * Le risque est devenu concret au passage à Workers Builds, où le build tourne
 * dans un CI et où la variable s'oublie en silence.
 *
 * Un défaut correct fait qu'un oubli ne casse plus rien. La variable
 * d'environnement reste prioritaire : `SITE_URL=http://localhost:4321 npm run build`
 * fonctionne toujours pour travailler en local, et c'est le seul cas qui en a
 * besoin.
 *
 * ⚠ Ce domaine apparaît maintenant dans TROIS fichiers — ici, `src/lib/constants.ts`
 * et `wrangler.jsonc`. Aucun n'est du contenu : ce sont la config du build, la
 * config du runtime et la cible de déploiement. Au handoff, ce sont les trois à
 * changer, et `docs/HANDOFF-TENANT.md` les liste.
 */
export default defineConfig({
  site: process.env.SITE_URL || 'https://solagecapitale.ca',
  trailingSlash: 'always',
  build: { format: 'directory' },
  // A POST to a non-slashed URL 301s, and a browser turns POST into GET on a
  // 301 -- which silently loses every form submission.
  vite: { plugins: [tailwindcss()] },
});
