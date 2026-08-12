/**
 * Quels services un hub de secteur met en avant, DÉRIVÉ DES DONNÉES DU SECTEUR.
 *
 * Ce que ça remplace, et pourquoi. La grille venait de
 * `services.json[lead].related` — une relation **globale** entre sujets. Comme
 * `drain-francais` est le service sous la plus forte pression presque partout,
 * les 51 secteurs surfaçaient le même jeu de liens. Deux conséquences mesurées
 * en session 4 :
 *
 *   1. `ocre-ferreuse` était lié depuis **48 secteurs** alors que `ocre` vaut
 *      `null` sur les 51 (session 2 a fermé la question par la négative). Un
 *      lien que rien dans les données ne justifie.
 *   2. Deux secteurs de parcs bâtis opposés — moellons de 1850 sans drain, et
 *      bungalows de 1975 sur tuile d'argile — proposaient les mêmes sujets.
 *
 * Ici, chaque lien remonte à un fait du secteur : une strate d'époque, un type
 * de drain d'origine, un niveau de pression, ou une mention explicite dans ses
 * propres `localTerms` / `housingStock`. **Aucune règle ne repose sur la
 * géographie ou l'intuition** : si la donnée ne le dit pas, le lien n'existe pas.
 *
 * Conséquence assumée : `drain` reste lié depuis ~50 secteurs. Ce n'est pas un
 * défaut de la dérivation, c'est le parc bâti régional — « le signal est vrai
 * mais constant » (PROGRESS, session 2). On ne fabrique pas de la diversité que
 * les données n'ont pas.
 */

import type { ServiceKey } from '../data/slugs.ts';
import type { cities } from './data.ts';

type City = (typeof cities)[string];

/** Au-delà, la grille cesse d'être un choix et redevient une liste plate. */
const MAX_LINKS = 5;

export function sectorServices(city: City): ServiceKey[] {
  const out: ServiceKey[] = [];
  const push = (k: ServiceKey) => {
    if (!out.includes(k)) out.push(k);
  };

  const fp = city.foundationPressure;
  // Strate dominante d'abord : c'est elle qui décide de ce que le lecteur a
  // le plus de chances d'avoir sous les pieds.
  const eras = [...fp.eras].sort(
    (a, b) => Number(b.weight === 'dominant') - Number(a.weight === 'dominant'),
  );

  // 1. Les deux services de la matrice, dans l'ordre de la pression ICI.
  //    `low` ne remonte pas : la donnée dit que le sujet n'est pas celui du coin.
  const RANK = { high: 0, moderate: 1, low: 2 } as const;
  const matrix = [
    ['drain', 'drain-francais'],
    ['fissure', 'fissure-de-fondation'],
  ] as const;
  for (const [key, slug] of [...matrix].sort(
    (a, b) => RANK[fp.services[a[1]].level] - RANK[fp.services[b[1]].level],
  )) {
    if (fp.services[slug].level !== 'low') push(key);
  }

  // 2. Ce que le parc bâti implique, strate par strate.
  for (const era of eras) {
    // Un drain de tuile d'argile arrive en fin de vie : le remplacer, et le
    // diagnostiquer avant de creuser.
    if (era.drain === 'tuile-argile') {
      push('drain');
      push('inspection');
    }
    // Un mur qui n'a jamais eu de drain ne « perd » rien : ce qui se joue chez
    // lui est l'eau qui traverse la maçonnerie.
    if (era.drain === 'aucun') push('impermeabilisation');
    // Le PVC ondulé retient le sédiment ; la caméra est ce qui le montre.
    if (era.drain === 'pvc-ondule') push('inspection');
    if (era.foundation === 'pierre') push('impermeabilisation');
    if (era.foundation === 'beton-coule' || era.foundation === 'blocs-beton') push('fissure');
  }

  // 3. Le symptôme, seulement là où un drain absent ou compromis l'explique.
  //    Un secteur bâti après 2005 sur drain conforme ne le reçoit pas.
  if (eras.some((e) => e.drain === 'tuile-argile' || e.drain === 'aucun')) push('infiltration');

  // 4. Ce qui exige une preuve dans les données, faute de quoi le lien ment.
  //    `ocre` et `pyrite` sont `null` sur les 51 secteurs : ces deux lignes ne
  //    déclenchent aujourd'hui jamais, et c'est exactement le résultat voulu.
  if (fp.ocre) push('ocre');
  if (fp.pyrite) push('pyrite');

  // 5. Ce que le secteur nomme lui-même. `localTerms` et `housingStock` sont de
  //    la donnée relue, pas de la prose libre : une mention y est une preuve.
  const own = [...city.localTerms, city.housingStock.fr].join(' ').toLowerCase();
  if (own.includes('vide sanitaire')) push('videSanitaire');
  if (own.includes('puisard')) push('puisard');
  if (/moisissure|humidit/.test(own)) push('humidite');

  return out.slice(0, MAX_LINKS);
}
