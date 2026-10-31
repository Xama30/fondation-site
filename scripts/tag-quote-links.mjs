// Ajoute `?depuis=<chemin de la page>` à chaque lien vers la soumission dans dist/.
// Le Worker lit ce paramètre dans le Referer du POST du formulaire (worker/lead-form.ts,
// depuisFrom) et l'enregistre dans le registre anonyme rr_leads : on sait ainsi quelle
// page a mené à une demande, même quand le formulaire est sur /soumission/.
// Ajouté le 2026-10-30. Rien n'est ajouté au courriel envoyé à l'acheteur.
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const DIST = 'dist';
const QUOTE = /href="(\/soumission\/(?:[a-z0-9-]+\/)?|\/en\/quote\/(?:[a-z0-9-]+\/)?)"/g;

const walk = (dir) => readdirSync(dir).flatMap((f) => {
  const p = join(dir, f);
  return statSync(p).isDirectory() ? walk(p) : p.endsWith('.html') ? [p] : [];
});

let pages = 0, links = 0;
for (const file of walk(DIST)) {
  const rel = relative(DIST, file).split(sep).join('/');
  if (!rel.endsWith('index.html')) continue; // 404.html et autres : pas de chemin canonique
  const path = '/' + rel.replace(/index\.html$/, '');
  if (path.startsWith('/soumission/') || path.startsWith('/en/quote/')) continue;
  const html = readFileSync(file, 'utf8');
  let n = 0;
  const out = html.replace(QUOTE, (_, href) => { n++; return `href="${href}?depuis=${encodeURIComponent(path).replace(/%2F/g, '/')}"`; });
  if (n) { writeFileSync(file, out); pages++; links += n; }
}
console.log(`[tag-quote-links] ${links} lien(s) de soumission étiqueté(s) sur ${pages} page(s)`);
