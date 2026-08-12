#!/usr/bin/env node
/**
 * Cherche et télécharge des images depuis Wikimedia Commons, en ne retenant que
 * les licences utilisables sans condition de partage.
 *
 *   node scripts/fetch-images.mjs search "<requête>"     → liste les candidats
 *   node scripts/fetch-images.mjs get <fichier> <stem>   → télécharge + crédite
 *
 * POURQUOI un filtre de licence dur : la licence suit l'actif jusqu'au locataire
 * (PLAYBOOK §9). Une CC BY-SA impose le partage à l'identique à quiconque
 * réutilisera le site — c'est un passif transmis, pas un détail. On ne retient
 * que le domaine public et CC0, où il n'y a rien à transmettre.
 *
 * Le crédit est écrit dans docs/IMAGE-CREDITS.md à chaque téléchargement : une
 * image sans provenance notée est inutilisable, et la noter « plus tard » ne
 * se produit jamais.
 */
import { writeFile, appendFile, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const IMG_DIR = join(ROOT, 'src/assets/img');
const CREDITS = join(ROOT, 'docs/IMAGE-CREDITS.md');
const API = 'https://commons.wikimedia.org/w/api.php';

/** Les seules licences sans condition transmise au locataire. */
const OK = /^(public domain|cc0|pd-)/i;

const strip = (h) => (h ?? '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();

const call = async (params) => {
  const u = new URL(API);
  for (const [k, v] of Object.entries({ format: 'json', ...params })) u.searchParams.set(k, v);
  const r = await fetch(u, { headers: { 'User-Agent': 'solage-capitale/0.1 (image sourcing)' } });
  if (!r.ok) throw new Error(`API ${r.status}`);
  return r.json();
};

async function search(query) {
  const d = await call({
    action: 'query', generator: 'search', gsrnamespace: 6,
    gsrsearch: `filetype:bitmap ${query}`, gsrlimit: 20,
    prop: 'imageinfo', iiprop: 'url|extmetadata', iiurlwidth: 1600,
  });
  const pages = Object.values(d?.query?.pages ?? {});
  const usable = pages.filter((p) => OK.test(strip(p.imageinfo?.[0]?.extmetadata?.LicenseShortName?.value)));
  console.log(`${pages.length} résultats · ${usable.length} utilisables (domaine public / CC0)\n`);
  for (const p of usable) {
    const m = p.imageinfo[0].extmetadata ?? {};
    console.log(`FILE  ${p.title.replace(/^File:/, '')}`);
    console.log(`      ${strip(m.LicenseShortName?.value)} · ${strip(m.Artist?.value) || 'auteur non indiqué'}`);
    console.log(`      ${p.imageinfo[0].thumburl}\n`);
  }
  if (!usable.length && pages.length) {
    console.log('Aucune licence libre de condition. Les résultats existants sont en CC BY-SA ou');
    console.log('CC BY — utilisables en théorie, mais le partage à l\'identique suivrait l\'actif.');
  }
}

async function get(file, stem) {
  const d = await call({
    action: 'query', titles: `File:${file}`,
    prop: 'imageinfo', iiprop: 'url|extmetadata', iiurlwidth: 1600,
  });
  const page = Object.values(d?.query?.pages ?? {})[0];
  const ii = page?.imageinfo?.[0];
  if (!ii) throw new Error(`introuvable : ${file}`);

  const m = ii.extmetadata ?? {};
  const licence = strip(m.LicenseShortName?.value);
  if (!OK.test(licence)) throw new Error(`licence refusée (${licence}) — seuls PD et CC0 passent`);

  const url = ii.thumburl ?? ii.url;
  // L'extension vient du NOM Commons, jamais de l'URL : les URL de vignette portent
  // des paramètres de suivi et produisent une extension absurde.
  const ext = (file.match(/\.([a-z0-9]+)$/i)?.[1] ?? 'jpg').toLowerCase();
  const dest = join(IMG_DIR, `${stem}.${ext}`);
  const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
  await writeFile(dest, buf);

  if (!existsSync(CREDITS)) {
    await writeFile(CREDITS, `# IMAGE-CREDITS — provenance et licence de chaque image\n\n` +
      `Généré au fil des téléchargements par \`scripts/fetch-images.mjs\`. **Une image sans ligne\n` +
      `ici ne se met pas en ligne** : la licence suit l'actif jusqu'au locataire (PLAYBOOK §9).\n\n` +
      `| Fichier | Source Commons | Licence | Auteur |\n|---|---|---|---|\n`);
  }
  const existing = await readFile(CREDITS, 'utf8');
  const row = `| \`${stem}.${ext}\` | [${file}](https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file)}) | ${licence} | ${strip(m.Artist?.value) || 'non indiqué'} |\n`;
  if (!existing.includes(`\`${stem}.${ext}\``)) await appendFile(CREDITS, row);

  console.log(`${dest} · ${(buf.length / 1024).toFixed(0)} Ko · ${licence}`);
  console.log(`crédit ajouté à docs/IMAGE-CREDITS.md`);
}

const [cmd, a, b] = process.argv.slice(2);
if (cmd === 'search' && a) await search(a);
else if (cmd === 'get' && a && b) await get(a, b);
else {
  console.error('usage: fetch-images.mjs search "<requête>" | get <fichier Commons> <stem>');
  process.exit(1);
}
