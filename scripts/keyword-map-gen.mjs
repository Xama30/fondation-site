#!/usr/bin/env node
/**
 * Génère les blocs répétitifs de docs/KEYWORD-MAP.md depuis src/data/cities.json.
 *
 * Pourquoi un script plutôt que 150 lignes écrites à la main : PLAYBOOK §0.2 —
 * une liste de 230 URL maintenue à la main est périmée au commit suivant, et un
 * index périmé est pire que pas d'index. Les hubs de service, les utilitaires et
 * le blogue restent écrits à la main dans le fichier : ils sont peu nombreux et
 * chacun porte un mot-clé qui ne se dérive de rien.
 *
 * Réécrit uniquement ce qui est entre les marqueurs GEN. Idempotent.
 *   node scripts/keyword-map-gen.mjs
 */
import { readFile, writeFile } from 'node:fs/promises';

const MAP = 'docs/KEYWORD-MAP.md';
const cities = JSON.parse(await readFile('src/data/cities.json', 'utf8'));

/**
 * Le statut des lignes matrice est DÉRIVÉ, jamais édité à la main : ce script réécrit le bloc
 * à chaque exécution, donc toute curation manuelle serait silencieusement reversée — ça s'est
 * produit une fois. La décision d'approbation appartient à `foundation-pressure.mjs merge`,
 * qui applique le plafond de 30 et écrit `_matrice.txt`. Ici on ne fait que la lire.
 */
const APPROVED = new Set(
  await readFile('src/data/foundation-pressure/_matrice.txt', 'utf8')
    .then((t) => t.split('\n').filter((l) => l.startsWith('/')).map((l) => l.split('\t')[0]))
    .catch(() => []),
);

const entries = Object.entries(cities)
  .filter(([k]) => !k.startsWith('$'))
  .map(([slug, v]) => ({ slug, ...v }));

const TIER_ORDER = { A: 0, B: 1, C: 2 };
entries.sort((a, b) => TIER_ORDER[a.tier] - TIER_ORDER[b.tier] || a.slug.localeCompare(b.slug, 'fr'));

// Les deux seuls services qui portent une intention "service + lieu" (SEO-PLAN §5).
const MATRIX_SERVICES = [
  { fr: 'drain-francais', en: 'french-drain', kwFr: 'drain français', kwEn: 'french drain' },
  { fr: 'fissure-de-fondation', en: 'foundation-crack-repair', kwFr: 'fissure de fondation', kwEn: 'foundation crack repair' },
];

// La matrice ne se tente que sur les strates A et B : les 26 quartiers de la
// strate C n'ont pas assez de matière distincte pour 2 pages chacun en plus de
// leur hub, et les tenter fabriquerait exactement les pages-portails décrites
// dans COMPETITION §2.
const MATRIX_TIERS = new Set(['A', 'B']);

const nameFr = (e) => e.name.fr;
const nameEn = (e) => e.name.en ?? e.name.fr;

const sectorRows = entries.flatMap((e) => [
  `| \`/secteurs/${e.slug}/\` | fr | hub-secteur | réparation de fondation ${nameFr(e)} | drain français ${nameFr(e)} · fissure fondation ${nameFr(e)} · infiltration d'eau sous-sol ${nameFr(e)} · entrepreneur fondation ${nameFr(e)} | ${e.tier} | planifié |`,
  `| \`/en/areas/${e.slug}/\` | en | area-hub | foundation repair ${nameEn(e)} | french drain ${nameEn(e)} · foundation crack ${nameEn(e)} · basement water infiltration ${nameEn(e)} | ${e.tier} | planifié |`,
]);

const matrixRows = entries
  .filter((e) => MATRIX_TIERS.has(e.tier))
  .flatMap((e) =>
    MATRIX_SERVICES.flatMap((s) => {
      const status = APPROVED.has(`/fondation/${s.fr}/${e.slug}/`) ? 'planifié' : 'candidat';
      return [
        `| \`/fondation/${s.fr}/${e.slug}/\` | fr | matrice | ${s.kwFr} ${nameFr(e)} | ${s.kwFr} prix ${nameFr(e)} · entrepreneur ${s.kwFr} ${nameFr(e)} | ${e.tier} | ${status} |`,
        `| \`/en/foundation/${s.en}/${e.slug}/\` | en | matrix | ${s.kwEn} ${nameEn(e)} | ${s.kwEn} cost ${nameEn(e)} · ${s.kwEn} contractor ${nameEn(e)} | ${e.tier} | ${status} |`,
      ];
    }),
  );

const header = '| URL | Lang | Type | Mot-clé principal | Secondaires | Strate | Statut |\n|---|---|---|---|---|---|---|';

const blocks = {
  sectors: [
    `_${sectorRows.length} lignes générées depuis \`src/data/cities.json\` par \`scripts/keyword-map-gen.mjs\`. Ne pas éditer à la main._`,
    '',
    header,
    ...sectorRows,
  ].join('\n'),
  matrix: [
    `_${matrixRows.length} lignes générées, dont ${matrixRows.filter((r) => r.endsWith('| planifié |')).length} en **planifié**. Le statut est **dérivé** de \`src/data/foundation-pressure/_matrice.txt\`, écrit par \`foundation-pressure.mjs merge\` qui applique le plafond de 30 et exclut les secteurs imbriqués (\`parentSector\`). **Ne pas éditer un statut à la main : ce bloc est réécrit à chaque exécution.** Le reste devient une **section** du hub de secteur, en texte brut, sans lien (PLAYBOOK §7.3)._`,
    '',
    header,
    ...matrixRows,
  ].join('\n'),
};

let md = await readFile(MAP, 'utf8');
for (const [name, body] of Object.entries(blocks)) {
  const re = new RegExp(`(<!-- GEN:${name} -->)[\\s\\S]*?(<!-- /GEN:${name} -->)`);
  if (!re.test(md)) throw new Error(`Marqueur GEN:${name} absent de ${MAP}`);
  md = md.replace(re, `$1\n${body}\n$2`);
}
await writeFile(MAP, md);

const planned = matrixRows.filter((r) => r.endsWith('| planifié |')).length;
console.log(
  `KEYWORD-MAP: ${sectorRows.length} lignes secteur, ${matrixRows.length} lignes matrice ` +
    `(${planned} planifié, ${matrixRows.length - planned} candidat).`,
);
