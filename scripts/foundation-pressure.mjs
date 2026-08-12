#!/usr/bin/env node
// foundationPressure — outillage de phase 2.
//
//   show <slug>   les seuls champs dont un sous-agent a besoin (contexte minimal)
//   status        ce qui est fait / ce qui reste — dérivé du disque, pas d'un registre
//   merge         fusionne les fichiers par secteur dans cities.json, puis coupe à 30
//
// Le registre de reprise, c'est le contenu de src/data/foundation-pressure/.
// Pas de second fichier d'état : deux sources de vérité finissent toujours par diverger.

import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// Résolu depuis le fichier, pas depuis le cwd : un sous-agent n'est pas forcément à la racine.
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CITIES = join(ROOT, 'src/data/cities.json');
const OUT_DIR = join(ROOT, 'src/data/foundation-pressure');
const MATRIX_SERVICES = ['drain-francais', 'fissure-de-fondation'];
const MATRIX_CAP = 30; // SEO-PLAN §5 — plafond dur, approuvées FR
const LEVELS = ['high', 'moderate', 'low'];
// Version de la règle de classement. À incrémenter à CHAQUE changement de critère :
// c'est ce qui rend une reprise détectable quand la règle bouge en cours de route.
const CRITERION = '2026-08-04-drain-facteur-nomme';

const cities = JSON.parse(readFileSync(CITIES, 'utf8'));
const slugs = Object.keys(cities).filter((k) => !k.startsWith('$'));

const done = () =>
  existsSync(OUT_DIR)
    ? readdirSync(OUT_DIR).filter((f) => f.endsWith('.json')).map((f) => f.slice(0, -5))
    : [];

const die = (msg) => {
  console.error(msg);
  process.exit(1);
};

function show(slug) {
  const c = cities[slug] || die(`secteur inconnu : ${slug}`);
  const keep = [
    'tier', 'type', 'name', 'municipality', 'population',
    'neighbourhoods', 'localTerms', 'housingStock', 'neighbours',
  ];
  console.log(JSON.stringify(Object.fromEntries(keep.map((k) => [k, c[k]])), null, 1));
}

function status() {
  const have = new Set(done());
  const missing = slugs.filter((s) => !have.has(s));
  console.log(`${have.size}/${slugs.length} secteurs écrits · ${missing.length} restants`);
  if (missing.length) console.log(`\nÀ FAIRE:\n${missing.join(' ')}`);

  // Un fichier existant mais vide de substance est pire qu'un fichier absent :
  // il fait croire à une reprise propre.
  const suspect = [...have].filter((s) => {
    try {
      const e = JSON.parse(readFileSync(join(OUT_DIR, `${s}.json`), 'utf8'));
      return !e.services || !e.whyHere?.fr || !e.whyHere?.en;
    } catch {
      return true;
    }
  });
  if (suspect.length) console.log(`\nINCOMPLETS (à refaire):\n${suspect.join(' ')}`);

  // Un changement de critère en cours de route rend « fichier présent » insuffisant : un agent
  // qui évalue un secteur sans le modifier ne laisse aucune trace, donc l'horodatage ne
  // distingue pas « non traité » de « traité, inchangé ». Seule l'estampille le dit.
  const stale = [...have].filter((s) => {
    try {
      return JSON.parse(readFileSync(join(OUT_DIR, `${s}.json`), 'utf8')).criterion !== CRITERION;
    } catch {
      return false;
    }
  });
  if (stale.length) {
    console.log(`\nCRITÈRE PÉRIMÉ (${stale.length}) — classés sous une règle antérieure à « ${CRITERION} » :`);
    console.log(`  ${stale.join(' ')}`);
  }

  // Des agents parallèles ne se lisent pas. Deux secteurs de la même époque tendent donc
  // vers la même phrase — vraie, et fatale répétée 20 fois. Seul un contrôle global la voit.
  const shingles = new Map();
  for (const s of [...have].filter((x) => !suspect.includes(x))) {
    const e = JSON.parse(readFileSync(join(OUT_DIR, `${s}.json`), 'utf8'));
    for (const lang of ['fr', 'en']) {
      const w = (e.whyHere?.[lang] ?? '')
        .toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);
      for (let i = 0; i + 8 <= w.length; i++) {
        const k = w.slice(i, i + 8).join(' ');
        (shingles.get(k) ?? shingles.set(k, new Set()).get(k)).add(s);
      }
    }
  }
  const dupes = [...shingles].filter(([, v]) => v.size >= 3).sort((a, b) => b[1].size - a[1].size);
  if (dupes.length) {
    console.log(`\nPHRASES RECYCLÉES — ${dupes.length} suite(s) de 8 mots partagée(s) par ≥3 secteurs :`);
    for (const [k, v] of dupes.slice(0, 8)) console.log(`  «${k}»\n    → ${[...v].join(' ')}`);
    if (dupes.length > 8) console.log(`  … et ${dupes.length - 8} autre(s)`);
    console.log('  Réécrire ces secteurs : mécanisme au niveau de la matière et du lieu, pas de l\'époque.');
  }
  return { missing, suspect, dupes, stale };
}

function merge() {
  const { missing, suspect, dupes, stale } = status();
  if (stale.length) die('\nFusion refusée : secteurs classés sous un critère périmé.');
  if (missing.length || suspect.length) die('\nFusion refusée : termine les secteurs ci-dessus.');
  if (dupes.length) die('\nFusion refusée : phrases recyclées. Ne pas baisser le seuil — réécrire (règle 3).');

  const combos = [];
  for (const slug of slugs) {
    const e = JSON.parse(readFileSync(join(OUT_DIR, `${slug}.json`), 'utf8'));

    for (const [svc, v] of Object.entries(e.services)) {
      if (!MATRIX_SERVICES.includes(svc)) die(`${slug}: service hors matrice « ${svc} »`);
      if (!LEVELS.includes(v.level)) die(`${slug}/${svc}: niveau invalide « ${v.level} »`);
      // Les 26 secteurs de strate C ont tous un `parentSector` : Giffard est DANS Beauport,
      // Limoilou DANS La Cité-Limoilou. Leur donner une page matrice en plus de celle du parent
      // cannibalise la même intention sur une géographie imbriquée. Leur foundationPressure
      // reste utile — il nourrit le hub du parent — mais il ne gagne pas de page à lui.
      const nested = Boolean(cities[slug].parentSector);
      if (v.level !== 'low' && !nested) combos.push({ slug, svc, ...v, tier: cities[slug].tier });
    }

    const c = cities[slug];
    delete c.pestPressure; // écrit pour la lutte antiparasitaire — ne survit pas à la phase 2
    c.foundationPressure = {
      eras: e.eras, services: e.services, ocre: e.ocre ?? null, pyrite: e.pyrite ?? null,
      ...(e.sources?.length ? { sources: e.sources } : {}),
      ...(e.todo ? { todo: e.todo } : {}),
    };
    c.whyHere = e.whyHere;
  }

  // Le plafond se règle ici, en un seul fil. Des agents parallèles ne peuvent pas
  // s'entendre sur un budget global : ils classent en absolu, on range et on coupe ensuite.
  // `population` est null pour les sous-secteurs sans recensement propre (Giffard, Charny…).
  // Sans ce garde, `null / 1e6` vaut 0 et les relègue silencieusement au dernier rang :
  // une coercition muette qui décidait de la coupe à 30 sans que personne ne la voie.
  const rank = (x) =>
    (x.level === 'high' ? 0 : 1000) +
    { A: 0, B: 10, C: 20 }[x.tier] -
    (cities[x.slug].population ?? 0) / 1e6;
  combos.sort((a, b) => rank(a) - rank(b));

  // Décision du 2026-08-04 : seules les combinaisons `high` sont approuvées. Un `moderate` dit
  // « le bâti est vieux, mais rien de propre à ce lieu » — donc pas de matière pour une page
  // distincte, et 17 pages de ce type se ressembleraient. Elles deviennent des sections du hub
  // de secteur (PLAYBOOK §7.3). Le plafond de 30 reste un plafond dur, pas un quota à remplir.
  const eligible = combos.filter((x) => x.level === 'high');
  const approved = eligible.slice(0, MATRIX_CAP);
  const demoted = combos.filter((x) => !approved.includes(x));

  writeFileSync(CITIES, `${JSON.stringify(cities, null, 2)}\n`);
  writeFileSync(
    join(OUT_DIR, '_matrice.txt'),
    `# approuvées (${approved.length}/${MATRIX_CAP}) — lignes à passer en « planifié » dans KEYWORD-MAP\n` +
      approved.map((x) => `/fondation/${x.svc}/${x.slug}/\t${x.level}\t${x.why}`).join('\n') +
      `\n\n# rétrogradées (${demoted.length}) — sections du hub de secteur, en texte brut, jamais en lien\n` +
      demoted.map((x) => `${x.slug}\t${x.svc}\t${x.level}`).join('\n') + '\n',
  );

  const nulls = slugs.filter((s) => cities[s].foundationPressure.ocre === null).length;
  console.log(`\ncities.json fusionné · ${approved.length} approuvées · ${demoted.length} rétrogradées`);
  console.log(`ocre en null assumé : ${nulls}/${slugs.length}`);
  console.log(`détail → ${join(OUT_DIR, '_matrice.txt')}`);
  if (approved.length < 12)
    console.log('\nATTENTION : trop peu d\'approuvées. Relire SEO-PLAN §5 — la matrice n\'a peut-être pas lieu d\'être.');
}

mkdirSync(OUT_DIR, { recursive: true });
const [cmd, arg] = process.argv.slice(2);
if (cmd === 'show') arg ? show(arg) : die('usage: show <slug>');
else if (cmd === 'status') status();
else if (cmd === 'merge') merge();
else die('usage: foundation-pressure.mjs show <slug> | status | merge');
