# PROGRESS — mémoire entre les sessions

Règle 8. Mis à jour à la fin de chaque session. Ce qui est ici évite à la session suivante de
redécouvrir à froid.

---

## Session 0 — 3-4 août 2026 · Cadrage stratégique

**Livré**

- `docs/CLAUDE.md` — les 8 règles dures adaptées à la niche, **plus une règle 1bis propre à ce
  projet** : aucune instruction permettant à un lecteur d'intervenir lui-même sur une fondation.
- `docs/SEO-PLAN.md` — plafond du modèle, mécanisme physique régional, moat réglementaire,
  11 intentions de recherche, architecture d'URL, 11 hubs de service, cible ~232 pages,
  plan de phases 0→9.
- `docs/KEYWORD-MAP.md` — 262 lignes URL. Utilitaires, hubs de service et blogue écrits à la
  main ; **102 lignes secteur et 100 lignes matrice générées** par
  `scripts/keyword-map-gen.mjs` depuis `cities.json`. Garde anti-cannibalisation en bas.
- `docs/COMPETITION.md` — reconnaissance réelle, 5 couches de SERP, analyse en profondeur d'un
  concurrent structurellement identique, 8 trous classés, 4 sujets à ne pas attaquer.
- `scripts/keyword-map-gen.mjs` — régénère les blocs `<!-- GEN:… -->`. Idempotent.

**Aucune page créée. Aucun code applicatif écrit.** C'est la règle 2.

## Session 0b — 4 août 2026 · Marque, palette, licences, images

**Livré**

- [`docs/DESIGN.md`](DESIGN.md) — nom de marque, palette complète avec **ratios de contraste
  calculés** (clair + sombre), typographie, stratégie d'images.
- [`docs/COMPETITION.md`](COMPETITION.md) §7 — **licences RBQ vérifiées à la source**, texte
  officiel des annexes I à III.

**Décisions prises**

| Sujet | Décision |
|---|---|
| Nom | **Solage Capitale** (`Organization.name`) |
| Palette | « ardoise et rouille » — `#22333F` primaire, `#9C3D26` accent, `#F6F5F2` fond. Thème sombre complet. Tous les ratios ≥ 4.5:1, la plupart ≥ 7:1. |
| Typographie | **Bitter** (slab, titres) + **Public Sans** (corps), OFL, auto-hébergées, latin, ~58 Ko |
| Images | Aucune fournie → Wikimedia Commons (DP/CC0) en priorité, sujet plutôt que lieu, illustration honnête en dernier recours |

**Découvertes de cette session**

1. **« Fondation X » désigne un organisme de bienfaisance en français.** *Fondation
   Cap-Diamant* existe déjà à Québec — une fondation caritative pour aînés, sur exactement
   notre territoire. Tout nom commençant par « Fondation » nous ferait concurrencer des œuvres
   de charité dans la SERP. **C'est pour ça que la marque est « Solage Capitale ».** Ne pas
   revenir dessus.
2. **Le brief se trompait sur les licences, et l'erreur va dans les deux sens.** Vérifié dans
   l'Annexe I officielle de la RBQ :
   - Pour un mur de fondation résidentiel, c'est la **3.2 (Petits ouvrages de béton)**, pas la
     3.1 — la 3.2 nomme explicitement « les murs de fondation de bâtiments visés à la partie 9
     du Code national du bâtiment ».
   - L'imperméabilisation relève de la **sous-catégorie 7 (Isolation, étanchéité…)**, que
     personne ne cite dans la niche.
   - La **2.6** nomme textuellement « la reprise en sous-œuvre » — c'est le vocabulaire
     officiel à employer dans le hub affaissement.
3. **Le meilleur fait du site est structurel, pas technique.** La 2.5 (excavation) relève de
   l'annexe III, dont la RBQ écrit : *« Ces sous-catégories ne nécessitent pas une évaluation
   de la compétence en exécution de travaux de construction. »* La 2.6, elle, est en annexe II
   et l'exige. **Détenir une licence d'excavation n'atteste donc d'aucune compétence évaluée en
   exécution.** Vérifiable, public, directement utile — et absent de tout site concurrent.
4. Un chantier de fondation ordinaire touche **trois sous-catégories** (2.5 + 3.2 + 7). Un
   entrepreneur peut être licencié pour creuser et pas du tout pour la membrane.

**Ce que ça change au plan** — la question ouverte n° 4 est fermée, et le pilier
`/blogue/verifier-licence-rbq-entrepreneur/` passe de « article réglementaire de plus » à
**contenu d'ancrage du moat**. Les questions 2 (palette), 3 (nom) et 8 (photos) sont fermées.

## Session 1 — 4 août 2026 · Fondations techniques

`npm run build` : **0 erreur, 0 avertissement sur les trois portes.** `astro check` : 0 erreur.
`find dist -name '*.js'` : **0**. Aucun `PLACEHOLDER_` dans la sortie rendue.

**Livré**

- `package.json` — overrides `@emnapi` dès le premier commit, Node ≥ 24, TS épinglé 5.9.2,
  build enchaînant `astro check` → build → `post-build` → les trois audits.
- `astro.config.mjs` — statique, **aucun adaptateur**, `trailingSlash: 'always'`,
  `build.format: 'directory'`. `site` lu depuis `SITE_URL`.
- `src/lib/constants.ts` · `src/data/slugs.ts` · `src/lib/routes.ts` — le système d'URL.
  Les 11 services, les 11 pages statiques, les racines de section, Tier A typé.
- `src/lib/schema.ts` — `Organization` + `WebSite` + `Service` + `BreadcrumbList` + `FAQPage`
  + `BlogPosting`. **Pas de `LocalBusiness`, pas d'`aggregateRating`, pas d'adresse.**
- `src/lib/images.ts` — `import.meta.glob` eager, clé sur le stem, **lève une erreur** si aucune
  correspondance.
- `src/lib/i18n.ts` + `ui.fr.json` / `ui.en.json` — 32 clés, parité vérifiée. `t()` lève sur une
  clé manquante.
- `src/data/site.json` — `phone`, `address`, `rbqLicence` à `null` avec la note qui dit pourquoi.
- `src/styles/global.css` — palette « ardoise et rouille », thème sombre, `data-theme` gagnant
  dans les deux sens, `.mesure` centrée.
- `src/layouts/BaseLayout.astro` + `Header.astro` (menu mobile CSS pur) + `Footer.astro`
  (l'avertissement « service de mise en relation » sur chaque page).
- `src/content.config.ts` — réécrit pour la niche : collections `services`, `sectors`, `matrix`,
  `blog`. **`generateId` conservé.**
- `scripts/lib/planned.mjs` — réécrit sur le nouveau registre.
- `scripts/uniqueness-check.mjs` `FAMILIES` et `scripts/link-audit.mjs` `MONEY` — réécrits.
  Les familles héritées (`pest-*`, `wildlife-*`, `commercial-*`) sont **supprimées**.
- `wrangler.jsonc` — `name: "solage-capitale"`.
- Pages : `/` et `/en/`.

**⚠ CE QUE LA SESSION 1 N'A PAS FAIT, ET C'EST LE PIÈGE À CONNAÎTRE**

`[uniqueness] 0 pages` — la porte tourne, mais **elle ne compte aucune page**, parce qu'aucune
page de service, de secteur ou de matrice n'existe encore. **C'est exactement le faux succès du
PLAYBOOK §0.1.** Le critère de fin que je m'étais donné (« une page réelle par famille ») n'est
donc **pas atteint** : je l'ai réduit à « le squelette compile et les portes tournent » parce
qu'une vraie page de secteur exige ≥ 400 mots, ≥ 5 faits locaux et ≥ 4 questions, ce qui est du
travail de phase 4-6 et non de phase 1.

**Conséquence obligatoire pour la phase 4 :** la première page de service se crée **dans le
même commit que sa route**, et on vérifie que la porte affiche `[uniqueness] N pages` avec
N ≥ 1 **avant** d'en écrire une deuxième. Tant que le compteur est à 0, un vert ne prouve rien.

**Découvertes techniques de cette session**

1. **`hreflangMap()` dans `scripts/lib/crawl.mjs` comparait des codes sensibles à la casse.**
   La page émet `fr-CA` (la forme conventionnelle), l'audit exigeait `fr-ca` → 4 erreurs sur
   2 pages. Corrigé en normalisant la clé en minuscules **dans le parseur**. Ce n'est pas un
   affaiblissement de porte : BCP 47 est insensible à la casse, c'était un bug de lecture.
2. **Deux copies de Vite.** `@tailwindcss/vite` tire Vite 8, Astro embarque Vite 6.4.3 →
   `astro check` échoue sur `Plugin<any>[]` non assignable à `PluginOption`. Corrigé par un
   override `"vite": "6.4.3"` dans `package.json`, à côté des overrides `@emnapi`.
   **À revérifier à chaque montée de version d'Astro.**
3. `post-build.mjs` annonce `skip:` pour le 404 localisé et le sitemap tant que ces pages
   n'existent pas. Normal en phase 1 ; ça doit disparaître en phase 9.
4. `[link-audit] NOTE 24 planned page(s) linked but not built` — c'est la dérogation
   « planifié » qui fonctionne comme prévu. **Elle doit tomber à 0 avant le lancement**, sinon
   ce sont des liens morts permanents que la porte ne voit pas (PLAYBOOK §7.3).

**Reste dû de la phase 1, à faire au début de la phase 2**

- `docs/CONTENT-BRIEF.md` et `docs/HANDOFF-TENANT.md` — pas encore écrits.
- Les fichiers de police **Bitter** et **Public Sans** ne sont pas installés : le CSS déclare
  les familles et retombe sur Georgia / system-ui. À télécharger, sous-ensemble latin, avec
  `@font-face` et `font-display: swap`.
- `robots.txt`, `llms.txt`, sitemap, en-têtes de sécurité : phase 9.

---

## Session 2 (partielle) — 4 août 2026 · Le corpus réglementaire

Build toujours vert. **`src/data/regulations.json` livré : 3 entrées vérifiées, 4 explicitement
bloquées.** C'est le cœur du moat, et c'est la partie de la phase 2 qui devait passer en premier.

### Vérifié à la source — publiable

**BNQ 3661-500** (bnq.qc.ca) — et c'est plus précis que ce que quiconque écrit dans la niche :
la norme est **en deux parties** — partie I : évaluation du risque de dépôts d'ocre pour un
bâtiment neuf et **diagnostic** pour un bâtiment existant ; partie II : **méthodes
d'installation**, neuf et existant. Une norme distincte, **BNQ 3624-130**, vise les **tuyaux
perforés** utilisés pour le drainage des bâtiments afin de réduire le risque d'ocre.
→ Le droit du lecteur : « un drain BNQ » sans numéro ni partie ne veut rien dire. Exiger que la
soumission nomme la norme, la partie et le type de tuyau.

**GCR** (garantiegcr.com + RBQ) — 1 an malfaçons non apparentes · 3 ans vices cachés · **5 ans
vices de conception, de construction ou de réalisation et vices du sol** (c'est la fenêtre qui
vise une fondation) · dénonciation dans un « délai raisonnable », que **la jurisprudence** fixe
à 6 mois suivant la découverte · garantie transférable.
→ Angle que personne n'écrit : sur une maison de moins de 5 ans, **faire réparer soi-même un
vice couvert peut compromettre la réclamation.**

**Licence RBQ** — les 6 sous-catégories pertinentes avec leur texte officiel et leur annexe,
plus le mappage sous-catégorie → service.

### Bloqué, avec la raison écrite dans le fichier

`ctq-m200` · `programme-aide-pyrite` · `profondeur-de-gel` · `permis-excavation` — statut
`unverified`, `sourceUrl: null`, et un `todo` qui dit quoi ouvrir. **Aucun ne se rend sur une
page tant qu'il n'est pas vérifié.** Le permis d'excavation ne sera d'ailleurs jamais un
chiffre unique : il varie par municipalité, et la CMQ en compte plusieurs.

### `services.{fr,en}.json` et `pricing.json` — livrés

**`services.{fr,en}.json`** : les 11 entités, clés alignées sur `SERVICE_SLUGS`. Le mappage
sous-catégorie RBQ → service **n'y est pas dupliqué** — il vit déjà dans
`regulations.json['rbq-licence'].subcategories[*].covers`. Deux champs distincts : `regulations`
ne contient que des entrées `status: verified` (`bnq-3661-500`, `gcr`, `rbq-licence`), et
`regulationsPending` garde la trace des non vérifiées sans risquer un rendu. `signs` décrit ce
que le lecteur **observe**, `whatProDoes` ce qu'un professionnel **fait**, à la 3ᵉ personne —
jamais d'impératif, jamais de méthode (règle 1bis).

**`pricing.json`** : les 11 entrées à `range: null`, chacune avec son `todo`.
**Aucune source primaire de prix n'existe en accès libre pour cette niche.** Les requêtes ne
ramènent que des sites de génération de prospects et des blogues d'entrepreneurs — la couche C
de `COMPETITION.md`. Les citer violerait le standard de source primaire *et* citerait des
concurrents. La recherche du 2026-08-04 est consignée dans le fichier (`$research_note`,
`$leads`) pour que personne ne la refasse à l'identique.

**Trouvaille annexe, à rouvrir le 2026-10-01 :** plusieurs concurrents affirment que le drain
français est « explicitement admissible » à une enveloppe de 425 M$ du programme
Rénoclimat–Adaptation. **La source gouvernementale ne le confirme pas** : au 2026-08-04 le volet
Adaptation n'entre en vigueur que le 1ᵉʳ octobre 2026, et la seule aide « drainage » listée vise
la *récupération de chaleur des eaux de drainage*, sans rapport. Consigné dans
`pricing.json['$aid_programs']`. Si le volet rend le drainage périphérique admissible, c'est un
fait public de première valeur — et il corrige une affirmation que la concurrence publie déjà à
tort.

### `KEYWORD-MAP.md` — statuts dérivés, et la contrainte d'imbrication

**30 lignes matrice en `planifié`, 20 en `candidat`, par langue.** Généré, idempotent, chaîne
`npm run build` verte (uniqueness + link-audit + seo-audit, 0 erreur).

**Deux erreurs commises et corrigées ici — les deux valent d'être retenues.**

**1. Ne jamais lancer un générateur sans lire ce qu'il écrit.** `keyword-map-gen.mjs` réécrit le
bloc matrice entre ses marqueurs `GEN` à chaque exécution. Une première réconciliation faite à
la main a donc été silencieusement reversée au premier `node scripts/keyword-map-gen.mjs`.
**Corrigé à la racine plutôt qu'en refaisant l'édition :** le statut est maintenant *dérivé* —
`merge` décide et écrit `_matrice.txt`, le générateur le lit. Un propriétaire par décision, et
la curation manuelle devient impossible plutôt qu'éphémère.

**2. Les secteurs imbriqués ne peuvent pas porter de page matrice.** Les 26 secteurs de strate C
ont **tous** un `parentSector` : Giffard est dans Beauport, Limoilou dans La Cité-Limoilou,
Charny et Saint-Romuald dans Lévis. Leur donner une page en plus de celle du parent cannibalise
la même intention sur une géographie imbriquée. `keyword-map-gen.mjs` le savait déjà
(`MATRIX_TIERS = {A, B}`) ; c'est `foundation-pressure.mjs merge` qui l'ignorait. Le filtre
`parentSector` y est maintenant explicite.

### Décision tranchée le 2026-08-04 : la matrice fait 13 pages, pas 30

Une fois les secteurs imbriqués exclus, il ne restait que **13 combinaisons `high`** sur les 25
secteurs éligibles ; les 17 autres places du plafond n'auraient été remplies que par des
`moderate`.

**Décision : on n'approuve que les `high`.** Un `moderate` dit « le bâti est vieux, donc le
problème existe, mais rien n'est propre à ce lieu » — pas d'époque dominante, pas de cours d'eau
nommé. Sans matière propre, ces 17 pages se seraient écrites de la même façon : soit
`uniqueness-check.mjs` les bloque au build et la rédaction est perdue, soit elles passent et
tirent le domaine vers le bas. C'est la lecture stricte de la règle 3.

Les 29 combinaisons écartées ne disparaissent pas : elles deviennent des **sections** du hub de
secteur, en texte brut, jamais en lien (PLAYBOOK §7.3).

**Les 13 approuvées** — 11 en `drain-francais` (Beauport, Boischatel, Charlesbourg,
Château-Richer, Fossambault, Île d'Orléans, Lac-Delage, La Cité-Limoilou, Sainte-Anne-de-Beaupré,
Saint-Ferréol-les-Neiges, Shannon) et 2 en `fissure-de-fondation` (Lévis, Stoneham-et-Tewkesbury).

**Cible de pages révisée : ~198 au lieu de ~232.** 26 pages matrice (13 × 2 langues) au lieu de
60. Le plafond de 30 reste dans le script comme plafond dur, pas comme quota.

La règle vit dans `foundation-pressure.mjs` (`eligible = combos.filter(level === 'high')`).
Pour revenir à 30, il suffit de rouvrir aux `moderate` à cet endroit : `merge` et
`keyword-map-gen.mjs` suivent automatiquement.

### `src/lib/data.ts` — les règles d'honnêteté rendues mécaniques

Les collections markdown de `src/content.config.ts` étaient déjà bonnes ; ce qui n'était validé
par **rien**, c'étaient les `src/data/*.json`. `src/lib/data.ts` est désormais le seul endroit
où le JSON brut est touché, et il encode les règles du projet en erreurs de build :

- une fourchette de prix non nulle **exige** un `sourceUrl` primaire ; une fourchette nulle
  **exige** un `todo` disant quoi ouvrir ;
- une entrée réglementaire `verified` **exige** un `sourceUrl` ;
- une clé non vérifiée ne peut pas figurer dans `regulations` — seulement dans
  `regulationsPending`, et inversement ;
- un `ocre` / `pyrite` non nul **exige** un `sources` non vide ;
- `drain-francais: high` **exige** une strate dominante d'avant 1975 ;
- `eras.span` doit être un jeton, pas de la prose.

**Ce que ça a trouvé du premier coup :** trois entrées réglementaires sans `title`,
`imagePending` typé booléen alors que c'est une description, `population` nul sur les
sous-secteurs — et par là **un bug réel du script de fusion**, où `population / 1e6` transformait
ces nuls en 0 et décidait la coupe à 30 en silence. Corrigé avec un `?? 0` explicite.

⚠ **La validation ne s'exécute que si une page importe `src/lib/data.ts`.** Aucune ne le fait
encore : `astro check` prouve que le module compile, pas que les données le satisfont. La
première vraie page qui l'importe referme ce trou. Vérifié ici via une page temporaire — et
attention, une page nommée `_*.astro` est silencieusement exclue du routage, donc ne s'exécute
jamais tout en laissant le build vert.

### Reste de la phase 2
La phase 2 « données » est livrée : `regulations.json`, `services.{fr,en}.json`, `pricing.json`,
et `foundationPressure` + `whyHere` sur les 51 secteurs (détail dans les sections ci-dessous).

### `foundationPressure` — se fait par sous-agents, et survit à une coupure

C'est de la recherche secteur par secteur, pas du remplissage. Bâclé, il produit 51 paragraphes
interchangeables — exactement les pages-portails que la porte d'unicité (règle 3) existe pour
bloquer. Mais il **n'a plus besoin d'une session dédiée** : il est découpé pour tourner en
parallèle, un fichier par secteur.

**Deux constats qui ont défini le découpage :**

1. La matrice est limitée à **2 services** (SEO-PLAN §5) — `drain-francais` et
   `fissure-de-fondation`. `foundationPressure` répond donc à 2 questions par secteur, pas 11.
   **Il ne dépend pas de `services.json`** et peut partir en premier.
2. Des agents parallèles ne voient pas les classements des autres, donc **ne peuvent pas
   respecter collectivement le plafond de 30**. Ils classent en absolu (époque + géographie
   nommée) selon le tableau du brief ; `merge` range et coupe ensuite, en un seul fil.

**Le protocole**

| | |
|---|---|
| Brief lu à froid par chaque agent | `docs/BRIEF-FOUNDATION-PRESSURE.md` |
| Sortie | `src/data/foundation-pressure/{slug}.json`, **un fichier par secteur** |
| Reprise / fusion / contexte agent | `node scripts/foundation-pressure.mjs status \| merge \| show <slug>` |

Lancer par lots de 4-6 secteurs par agent : le brief est un coût fixe par agent, le grouper
l'amortit. Le prompt d'un agent tient en deux lignes — « Lis
`docs/BRIEF-FOUNDATION-PRESSURE.md`. Traite : `<slugs>`. » — parce que tout le reste est dans
le brief.

**Grouper les lots par cohorte d'époque, jamais alphabétiquement.** Un lot pilote de 5 secteurs
l'a montré : deux secteurs d'avant 1945 traités par deux agents différents écrivent la même
phrase vraie — « le drain français n'existe pas encore comme technique à cette date » — parce
qu'aucun ne voit l'autre. Sur les ~20 secteurs anciens, ça donne 20 paragraphes jumeaux. Mis
dans **le même** agent, ils se voient et se différencient. C'est gratuit et ça règle le problème
à la source.

`status` compare malgré tout les `whyHere` entre eux et refuse toute suite de 8 mots partagée
par ≥ 3 secteurs ; `merge` s'y arrête. Un brief s'ignore, un script non — et la règle 3 vaut ici
comme ailleurs : on réécrit le secteur, on ne baisse pas le seuil.

**Le trou du protocole, découvert en le vivant.** La session a été coupée par sa limite en plein
reclassement, et le registre de reprise s'est révélé insuffisant : **il suit l'existence des
fichiers, pas la version du critère sous lequel ils ont été classés.** `status` annonçait
« 51/51 · 0 restants » alors qu'un tiers des secteurs n'avait pas vu le critère resserré. Pire,
l'horodatage ne rattrape pas le coup : un agent qui évalue un secteur et le laisse inchangé ne
le réécrit pas, si bien que « non modifié » et « non traité » deviennent indistinguables.

Ce qui a sauvé la reprise, c'est que le critère était **vérifiable mécaniquement** a posteriori
— un script a rejoué la condition sur les 51 fichiers et n'a trouvé que 3 secteurs non
conformes, corrigés à la main.

**Corrigé :** chaque fichier porte un champ `criterion`, et `status` signale « CRITÈRE PÉRIMÉ »
pour tout fichier dont l'estampille n'est pas la constante `CRITERION` du script ; `merge` refuse
alors de fusionner. **Incrémenter cette constante à chaque changement de règle de classement** —
c'est ce qui rend une reprise détectable quand le critère bouge en cours de route.

**Si la session est coupée en plein travail, rien n'est perdu.** L'état durable est sur le
disque, jamais dans un contexte. Le registre de reprise *est* le contenu du dossier — pas de
second fichier d'état, deux sources de vérité divergent toujours.

```bash
node scripts/foundation-pressure.mjs status   # → « 34/51 · À FAIRE: sillery vanier … »
```

Relancer des agents sur la liste `À FAIRE`. La ligne `INCOMPLETS` attrape le cas vicieux : un
agent tué à mi-écriture laisse un fichier présent mais creux, qui ferait croire à une reprise
propre. Ces secteurs sont à refaire, pas à garder.

`merge` refuse tant qu'il reste un manquant ou un incomplet — donc aucune fusion partielle ne
peut passer inaperçue. Il écrit `_matrice.txt` : les URL approuvées à basculer en « planifié »
dans `KEYWORD-MAP.md`, et les rétrogradées, qui deviennent des sections de hub de secteur en
texte brut, jamais en lien (PLAYBOOK §7.3).

**Le verdict tombe tout seul.** Si `merge` sort moins de ~12 approuvées, la matrice n'a pas lieu
d'être et on tombe à ~172 pages — résultat acceptable, écrit plus bas. Le nombre décide, pas
l'envie d'avoir 30 pages.

#### Le critère `drain-francais` a dû être resserré — question 6 refermée

Premier passage sur les 51 secteurs, avec le seul tableau époque → pression :

```
drain-francais         high=35  moderate=14  low= 2
fissure-de-fondation   high= 3  moderate=27  low=21
```

`fissure` discrimine. **`drain-francais` non** : 49 secteurs sur 51 en high/moderate. Ce n'est
pas une erreur de données — le parc bâti régional est réellement ancien et les drains de tuile
d'argile sont réellement en fin de vie à peu près partout. Le signal est **vrai mais constant**,
et un critère d'approbation que 96 % des secteurs passent ne sélectionne rien : les 30 pages
auraient été choisies de fait par population, et n'auraient différé que par leur prose. C'est la
définition de la page-portail.

**Décision : `drain-francais: high` exige désormais l'époque ET un facteur aggravant nommé** dans
les données du secteur (cours d'eau, plan d'eau, ancien marais, zone inondable présents dans
`localTerms` / `neighbourhoods` / `housingStock`, ou nappe haute attestée par une source citée).
Époque ancienne sans facteur nommé → `moderate`. Détail dans le brief §3.

#### Résultat après resserrement — la matrice existe

```
drain-francais         high=21  moderate=28  low= 2      (était high=35)
fissure-de-fondation   high= 3  moderate=27  low=21
```

Ce premier `merge` sortait 30 approuvées (24 `high` + 6 `moderate`), **avant** que la contrainte
`parentSector` et la règle « `high` seulement » ne soient appliquées. Chiffres finaux plus bas.

**Tranché** — voir « Décision tranchée le 2026-08-04 » plus bas : seules les 13 `high` sont
approuvées ; les `moderate` deviennent des sections.

**Question 6 (associations sol → secteur) se referme par la négative, et c'est un résultat.**
Sur 51 secteurs, `ocre` est `null` partout. Un seul agent avait produit un `ocre: moderate`, à
partir d'un article du MAPAQ sur le **drainage des champs agricoles** — donc une extrapolation
d'un domaine voisin, ramenée à `null`. Aucune page n'écrira de type de sol. Les `todo` nomment
les sources à ouvrir si quelqu'un veut rouvrir la question plus tard.

`services.{fr,en}.json` et `pricing.json` sont indépendants et peuvent se faire à côté.

---

## Ce qui vient — fin de la phase 2 : données

Schémas Zod peuplés, `services.{fr,en}.json` (11 entrées), **`foundationPressure` +
`whyHere` réécrits dans `cities.json`**, `pricing.json` avec sources (ou `null` + TODO),
`regulations.json` (BNQ 3661-500, RBQ, GCR, CTQ-M200) **vérifiés à la source primaire**.

**Critère de fin :** chaque fait réglementaire a une URL source ouverte et notée. Aucun chiffre
sans source ou sans `null` assumé.

---

---

## Session 3 — 4 août 2026 · Phase 4 : les premières vraies pages

**Le jalon que la session 1 n'avait pas atteint est franchi : `[uniqueness] N pages` avec
N ≥ 1.** Tant que le compteur était à 0, aucun vert ne prouvait quoi que ce soit.

**Livré**

- `src/pages/fondation/[service].astro` + `src/pages/en/foundation/[service].astro` — les routes
  de hub de service. La famille `service-fr` / `service-en` était **déjà** déclarée dans
  `FAMILIES` : l'étape la plus souvent oubliée était faite, vérifiée avant d'écrire.
- `src/pages/fondation/index.astro` + jumelle EN — l'index de section. C'est lui qui donne aux
  11 hubs leurs liens entrants ; sans lui `link-audit` signale « 1 inbound internal link »
  partout. Deux lignes ajoutées dans `KEYWORD-MAP.md` **avant** de créer les fichiers (règle 2).
- `src/content/services/{fr,en}/` — les 11 hubs de service, FR + EN.
- `docs/BRIEF-HUB-SERVICE.md` — le brief autonome utilisé par les sous-agents.
- Lien depuis les deux pages d'accueil vers l'index de section.

**Décisions d'implémentation**

- **Les grilles de liens sont pilotées par `getCollection`, jamais par `services.*.json`.** Un
  service dont la page n'est pas écrite reste dans le JSON et deviendrait un lien mort permanent
  que la dérogation « planifié » couvre à vie. Les « sujets liés » d'un hub sont donc filtrés
  contre les pages réellement écrites.
- **Seules les 3 réglementations `verified` s'affichent** — le template lit
  `verifiedRegulations`, pas `regulations`. Une entrée non vérifiée ne peut pas atteindre le
  rendu, même par erreur de rédaction.
- **Toutes les chaînes d'interface des routes sont dans `ui.{fr,en}.json`** (36 clés, parité
  vérifiée). Les titres de section écrits en dur dans un `.astro` sont une violation de la
  convention et rendent la jumelle EN impossible à tenir alignée — corrigé dès la première route.
- `z.record` infère un `Partial<Record<…>>`, donc chaque lecture serait « possiblement
  undefined ». Le helper `total()` de `src/lib/data.ts` prouve la complétude par un refinement
  **puis** type le résultat en Record complet : c'est le contrôle qui justifie le cast.

**Résultat mesuré**

`[uniqueness] 22 pages · 0 errors` — les 11 hubs × 2 langues passent le seuil de 400 mots ET le
seuil de similarité de 35 % entre sœurs. `seo-audit` : 0 erreur, 0 avertissement.

**Ce que la porte et le schéma ont attrapé sur le travail des sous-agents** — 6 `metaDescription`
ou `title` hors bornes, corrigés. Le schéma Zod fait échouer le build sur une `metaDescription`
à 164 caractères : la borne 140-158 n'est pas un conseil, c'est un mur. À noter pour la suite :
un seuil de 350 mots de *corps* est un proxy trop strict, parce que le gabarit ajoute les
`signs`, le `whatProDoes`, la réglementation et la FAQ. Mesurer sur le rendu, pas sur le
markdown.

**Ne jamais lancer le build pendant que des sous-agents écrivent.** Un fichier réécrit en cours
de scan est compté deux fois et le loader annonce `Duplicate id "…"` — le même message que le
bug de collision `generateId`, mais causé par une course. J'ai cherché un doublon qui n'existait
pas. Les agents vérifient avec `astro check` (qui n'écrit pas dans `dist/`), le parent lance le
build une fois tout le monde rendu.

**Ce qui reste visible dans les audits**

`link-audit` : **2 avertissements**, tous deux sur `/fondation/pyrite/` et sa jumelle — 4 liens
sortants contextuels pour une cible de 5. J'ai **refusé de forcer un lien** : les seuls sujets
honnêtement liés à la pyrite sont l'affaissement et la fissure, et fabriquer un troisième lien
pour satisfaire un compteur est exactement le genre de maillage artificiel que le projet évite.
Ça se résoudra en phase 5, quand les hubs de secteur pointeront vers les services.

**Deux messages de build attendus, à ne pas confondre avec des pannes :**

- `[glob-loader] No files found matching "**/*.md" in directory "src/content/{sectors,matrix,blog}"`
  — normal tant que ces collections sont vides.
- `The collection "sectors" does not exist or is empty. Please check your content config file for
  errors.` — émis deux fois, par les deux routes de hub de secteur qui appellent `getCollection`
  sur une collection vide. **Le message suggère une erreur de config alors qu'il n'y en a pas.**
  Il disparaîtra à la première page de secteur écrite. Si quelqu'un le voit en phase 5 après
  avoir écrit du contenu, alors là c'est un vrai problème.

**Routes déjà construites pour la phase 5** — `src/pages/secteurs/[sector].astro` et
`src/pages/en/areas/[sector].astro` existent et compilent. Elles consomment directement
`whyHere` et `foundationPressure` de `cities.json`, et posent un lien vers une page matrice
**uniquement si elle est réellement construite** ; sinon le service apparaît en texte brut
(PLAYBOOK §7.3). Il ne manque que le contenu markdown des 51 secteurs × 2 langues.


---

## Session 3b — 4-5 août 2026 · Phase 5 : les hubs de secteur (INTERROMPUE)

## Le 404 localisé, et deux scories héritées

**`src/pages/404.astro` + `en/404.astro` existent.** `post-build.mjs` n'annonce plus qu'un seul
`skip:` — le sitemap, qui relève de la phase 9 et dépend du domaine. **158 pages, 0 erreur.**

**Ce que leur construction a révélé, et qui valait plus que les pages elles-mêmes :**

1. **`post-build.mjs` documentait un autre projet.** Ses commentaires décrivaient un déploiement
   **Dokploy avec adaptateur Node** et des URL `/extermination/souris/` ↔ `/en/pest-control/mice/`.
   Or ce projet est du **statique pur, sans adaptateur, servi par un Cloudflare Worker**
   (CLAUDE.md). Le commentaire affirmait même que la copie du 404 anglais était « inerte » — elle
   est au contraire ce qui donne un 404 anglais. Corrigé.

2. **Un `noindex` n'a pas de devoir de canonique.** Le 404 empruntait le `ref` de l'accueil, donc
   sa canonique pointait vers `/` et entrait en collision ; ses hreflang pointaient vers des URL
   qui ne les réciproquaient pas. `seo-audit` avait raison sur les 8 erreurs. Le correctif est
   dans la règle, pas dans la page : `BaseLayout` accepte `noindex`, qui remplace la canonique
   par `<meta name="robots">` et supprime les hreflang, et `seo-audit` exempte les pages
   `noindex` de l'obligation de canonique. **Aucun seuil n'a bougé** — c'est une règle qui ne
   s'appliquait pas au cas, pas une règle assouplie.

---

## Phase 3 — les images : débloquée, pas faite

`docs/IMAGE-NEEDS.md` **existe maintenant**. Les 51 descriptions `imagePending` de `cities.json`
y renvoyaient toutes — **et le fichier n'existait pas.** Une référence pendante dans les données,
sur le seul document qui débloque la phase 3.

Il est **généré depuis `cities.json`** : pour changer un besoin d'image, on modifie le champ
`imagePending`, pas le tableau. Il porte les 51 besoins par strate, les règles de licence
(bloqueur de lancement, le crédit suit l'actif jusqu'au locataire), l'ordre des sources et les
catégories Wikimedia Commons déjà repérées.

**Correction d'une affirmation que j'avais faite trop vite.** J'avais écrit que les descriptions
`imagePending` parlaient « encore de soffites et de façades sud », héritage du site
antiparasitaire. Vérification faite : **2 sur 51**, pas la majorité — j'avais généralisé depuis
les deux premiers exemples. Les 49 autres décrivent des types de bâti (« triplex à escalier
extérieur », « maison sur terrain boisé ») parfaitement valides ici. Les 2 sont corrigées.

**Ce qui reste pour fermer la phase 3 :** trouver les images, remplir `heroImage` / `heroAlt`,
créer `docs/IMAGE-CREDITS.md`, et faire passer `PENDING_IMAGES=strict npm run audit`. Les 102
avertissements tombent alors d'un coup.

---

## Session 4 — 6 août 2026 · Phase 3 : les images — TERMINÉE

`PENDING_IMAGES=strict npm run audit` : **`[uniqueness] 150 pages · 0 erreur · 0 avertissement`.**
Les **102 avertissements « no hero image with alt text » sont tombés**, et la porte stricte —
celle qui devait passer avant le lancement — est verte. `npm run build` : 158 pages, 0 erreur sur
les trois portes.

### Le résultat qui a décidé de l'architecture

J'ai balayé Wikimedia Commons pour les 51 secteurs avant d'écrire une ligne (script jetable,
`name.fr + " Quebec"`, filtre DP/CC0 du projet). **46 secteurs sur 51 ont au moins un candidat
libre — et c'est un chiffre trompeur.** Ce que les résultats contiennent réellement :
basiliques, églises paroissiales, gravures de 1787, fonds photographiques BAnQ, panoramas.
**Presque rien de résidentiel, et rien du tout qui montre une fondation.**

Le vrai blocage n'est pas la rareté, c'est **la porte d'unicité**. Elle exige un `alt` de hero
distinct de toutes les pages sœurs. Poser la même photo de moellons sur vingt secteurs ne laisse
que deux issues, toutes deux fermées :

- un `alt` identique vingt fois → **erreur dure** de `uniqueness-check.mjs` ;
- un `alt` qui nomme un lieu où la photo n'a pas été prise → **règle 1**, inventer de la confiance.

**Donc la stratégie « photo de sujet réutilisée », écrite dans `DESIGN.md` §4 et dans le brief de
cette session, ne survit pas au contact de la porte.** Ce n'est pas une faiblesse de la porte :
elle a exactement raison. Une même image sur vingt pages est un signe de page-portail.

### Ce qui a été livré à la place — et pourquoi c'est mieux

**Le hero par défaut d'un hub de secteur est un schéma bâti sur les données du secteur lui-même**
(`src/components/EraDiagram.astro`) : une coupe stratigraphique du parc bâti, dessinée depuis
`foundationPressure.eras`, la plus récente en haut. Chaque strate porte son époque, son type de
fondation et son drain d'origine.

Il coche tout ce qu'une photo ne cochait pas :

1. **Aucune licence à transmettre au locataire** — c'était la contrainte qui décidait de tout.
2. **Honnête** : il ne prétend rien sur un lieu. Il *décrit* les données de ce secteur, donc son
   `alt` peut nommer le secteur sans mentir — et c'est ce qui le rend distinct 51 fois.
3. **Sur le sujet** : il montre la chaîne époque → fondation → drain, exactement l'argument de la
   page. Une basilique n'apprend rien à quelqu'un dont le drain de tuile d'argile lâche.
4. **`DESIGN.md` §4 le sanctionne déjà** — « chaque hub peut vivre avec une photo de sujet et un
   schéma », « une illustration honnête bat une photo volée ».

**Et `uniqueness-check.mjs` l'attendait.** Son `heroAlt()` lit déjà `<svg role="img" aria-label>`
au même titre que `<img alt>`, avec un commentaire décrivant « un graphique piloté par les
données » — un chemin de code que **rien n'utilisait**. Il n'a pas fallu toucher au script.

**Les 2 photos CC0 déjà téléchargées sont branchées** — `beauport` et `ile-dorleans`. La seconde
est excellente et pile sur le sujet : une façade de moellons dont le crépi tombé expose la pierre
et les joints de mortier érodés. Son `alt` dit que la maison est **abandonnée** : la taire aurait
laissé croire à du bâti courant.

### Le piège que j'ai vérifié avant de dessiner, pas après

Ajouter ~15 mots d'étiquettes identiques sur 51 pages sœurs aurait pu faire monter la similarité
de Jaccard et faire sauter la porte à 35 %. **`bodyText()` de `scripts/lib/crawl.mjs` retire
`<svg>…</svg>` avant de mesurer** (ligne 129), donc le texte du schéma ne compte ni dans les
400 mots ni dans la similarité. `heroAlt()`, lui, lit le HTML brut et le voit. Les deux
comportements sont exactement ceux qu'il fallait — mais c'était à vérifier, pas à supposer.

**Deuxième vérification qui a servi :** les époques ne suffisent pas à distinguer les secteurs.
**37 signatures `(span, weight, foundation, drain)` distinctes sur 51.** Un `alt` dérivé des
seules données aurait donné 14 collisions, donc 14 erreurs dures. C'est pour ça que l'`alt`
**nomme le secteur** — et c'est honnête précisément parce que c'est un schéma et non une photo.

### Détails d'implémentation

- `src/components/SectorHero.astro` tranche : `heroImage` renseigné → photo optimisée par
  `astro:assets` (srcset, `width`/`height` pour le CLS, `loading="eager"` + `fetchpriority="high"`
  pour le LCP) ; sinon → schéma. **Un `heroImage` sans `heroAlt` dans cette langue LÈVE** au lieu
  de retomber sur le schéma, même raison que `resolveImage`.
- 13 clés d'interface ajoutées dans `ui.{fr,en}.json` (55 clés, parité vérifiée) : les libellés
  des jetons `foundation`, `drain`, `weight`, `span`.
- **L'`alt` est ponctué de virgules et de points uniquement.** « ; » et « : » exigent une espace
  insécable en français et pas en anglais ; une phrase par cohorte évite le piège des deux côtés
  au lieu de le gérer. La première version émettait le « ; » français sur les pages anglaises.
- Aucun JS client ajouté (règle 7) : le schéma est du SVG inline, `astro:assets` ne sort rien.

### ⚠ Le bug le plus grave du projet à ce jour, trouvé à l'œil et non par une porte

**Le JSON-LD n'était émis sur AUCUNE des 158 pages, et la chaîne du script s'affichait en texte
visible en haut de chaque page.** Repéré parce que le propriétaire a *regardé le site*, pas parce
qu'un audit l'a signalé — `[seo-audit] 158 pages · 0 errors` depuis la session 1.

**La cause.** `BaseLayout.astro` écrivait :

```astro
<set:html>{`<script type="application/ld+json">${jsonld}</script>`}</set:html>
```

`set:html` est une **directive posée sur un élément**, pas une balise. Astro a donc rendu un
élément inconnu `<set:html>`, le navigateur a fermé `<head>` en le rencontrant, et le script est
parti **HTML-échappé** au début du `<body>`. Conséquences, sur tout le site :

- **zéro donnée structurée** — `Organization`, `WebSite`, `Service`, `BreadcrumbList`, `FAQPage`
  étaient tous construits correctement par `src/lib/schema.ts` et **aucun n'atteignait la page** ;
- la chaîne JSON complète **visible à l'écran**, avant l'en-tête, sur les 158 pages.

**Corrigé** — `<script type="application/ld+json" is:inline set:html={jsonld} />`. Vérifié :
le script est dans le `<head>`, il parse, et il porte `Organization, WebSite, BreadcrumbList,
FAQPage`.

**Le vrai défaut n'est pas la coquille, c'est la porte.** `seo-audit.mjs` ne regardait pas le
JSON-LD **du tout**. C'est mot pour mot le mode d'échec que `CLAUDE.md` décrit — *« une porte
verte qui ne vérifie rien est pire que pas de porte »* — et c'est la troisième fois qu'il se
produit sur ce projet, après la collision `generateId` et les familles non enregistrées dans
`FAMILIES`. **La leçon qui se répète : on valide la SORTIE, jamais l'intention.** `astro check`
prouvait que `schema.ts` compile ; il ne prouvait pas qu'une page émet quoi que ce soit.

**Contrôles ajoutés à `seo-audit.mjs`** (erreurs dures, sur chaque page) :

1. un `<script type="application/ld+json">` existe, et son contenu **parse** ;
2. `@context` vaut `https://schema.org` et `@graph` n'est pas vide ;
3. les nœuds `Organization` **et** `WebSite` sont présents — le layout les pose partout, leur
   absence signifie que le graphe n'est plus assemblé ;
4. **`LocalBusiness` et `AggregateRating` sont interdits** — la règle 1 devient mécanique au lieu
   de reposer sur la vigilance ; le handoff locataire les rouvrira ;
5. **toute directive Astro rendue en toutes lettres** (`<set:html`, `<is:`, `<client:`,
   `<define:`) est une erreur : c'est toujours un bug de gabarit, jamais du contenu.

**La porte a été testée en réintroduisant le bug** : 2 erreurs dures, build arrêté. Une porte
qu'on n'a pas vue échouer ne prouve rien — c'est la même exigence que le `[uniqueness] 0 pages`
de la session 1.

**Durcissement au passage :** `graph()` échappe désormais `<` en `<`. Le JSON est injecté
brut dans un `<script>` ; une séquence `</script>` dans une valeur de chaîne fermerait la balise
et déverserait le reste du graphe dans la page. Le JSON reste identique pour tout parseur.

### Ce qui reste ouvert sur les images, et c'est une décision du propriétaire

**49 secteurs sur 51 portent le schéma, 2 portent une photo.** Le site est complet et la porte est
verte ainsi. Reste la question esthétique : faut-il chasser des photos pour les ~12 secteurs où
Commons en a de réellement résidentielles (`House in Charlesbourg 02/03`, `Streets in Les
Rivières`, `Limoilou, Quebec city`, `Maison Jean Vezina` à Boischatel, `Sainte-Foy (Québec) 01-04`) ?

**Mon avis : non, ou pas tout de suite.** Un site où 12 secteurs ont une photo de maison et 39 un
schéma est moins cohérent qu'un site où les 51 ont le même mobilier informatif. Et le schéma
*informe*, là où une photo de rue décore. Si on le fait quand même, le mécanisme est déjà là :
remplir `heroImage` + `heroAlt` dans les deux jumelles, `imagePending` à `null`, rien d'autre.
Le balayage complet est reproductible en ~3 min (Commons rend un **429 au-delà de ~10 requêtes
rapprochées** — il faut 2,5 s entre les appels et un backoff).

---

## Les 10 avertissements « vary the anchor text » — la recommandation écrite est fausse

**Mesuré avant de toucher au code, et le résultat contredit ce que ce fichier affirmait depuis la
session 3b.** La note disait que les 10 avertissements venaient de l'appel à l'action en fin de
corps, et qu'il suffisait de le déplacer dans le chrome du layout. **C'est vrai pour 2 sur 10.**

| Cible | Total | D'où ça vient vraiment |
|---|---|---|
| `/soumission/` · `/en/quote/` | 78 × 2 | l'appel à l'action : 51 hubs de secteur + 13 matrice + 11 hubs de service + 3 |
| `drain-francais` · `french-drain` | 65 × 2 | **48 depuis les hubs de secteur**, 11 matrice, 5 hubs de service, 1 index |
| `infiltration-eau-sous-sol` (+ EN) | 59 × 2 | **51 depuis les hubs de secteur** |
| `ocre-ferreuse` (+ EN) | 52 × 2 | **48 depuis les hubs de secteur** |
| `inspection-de-drain-par-camera` (+ EN) | 51 × 2 | **48 depuis les hubs de secteur** |

**8 des 10 viennent de la grille « sujets liés » des 51 hubs de secteur**, pas du CTA. Déplacer
l'appel à l'action ne les touche pas.

### Et déplacer le CTA, seul, dégrade l'audit

`MIN_OUTBOUND` vaut 5, et **20 pages sont à exactement 5 liens contextuels sortants** ; elles n'y
sont que grâce au CTA. Le retirer du corps les fait tomber à 4, et les 2 pages pyrite de 4 à 3.

```
distribution des liens contextuels sortants (pages « money ») :
  4 → 2 pages      5 → 20 pages     6 → 22     7 → 22     8 → 52     9 → 22    10+ → 12
```

**Bilan du déplacement seul : −2 avertissements d'ancre, +22 avertissements de maillage.**
L'audit passerait de 12 à 32.

### Ce que ça révèle, et qui est le vrai sujet

Ces 22 avertissements ne seraient pas du bruit : **ils seraient vrais.** Le compte de liens
sortants est gonflé par du mobilier sur les hubs de service aussi. Exemple mesuré,
`/fondation/ocre-ferreuse/` — 5 liens « contextuels », dont **2 de mobilier** :

```
/fondation/drain-francais/                    « drain français »              éditorial
/fondation/inspection-de-drain-par-camera/    « inspection de drain… »        éditorial
/fondation/pompe-de-puisard-et-drain-interieur/ « pompe de puisard… »         éditorial
/prix/                                        « Fourchettes de prix »         MOBILIER
/soumission/                                  « Demander une soumission »     MOBILIER
```

**Le hub n'a réellement que 3 liens topiques, l'audit en lit 5.** Autrement dit le seuil de 5 est
tenu par du gabarit sur une bonne partie du site, et personne ne le savait.

### Ce que je recommande, dans l'ordre

1. **Rendre la grille de services des hubs de secteur réellement dérivée du secteur.** Elle vient
   aujourd'hui de `services.json[lead].related`, une relation **globale** : comme `drain-francais`
   est le service de tête presque partout, les 51 secteurs surfacent le même jeu. La dériver des
   `eras` du secteur (`drain: tuile-argile` → drain + inspection caméra ; `drain: aucun` +
   `foundation: pierre` → imperméabilisation ; `beton-coule` → fissure) donne des jeux différents
   selon les profils d'époque. **Et ça retire au passage les liens « ocre ferreuse » de 48
   secteurs dont les données disent `ocre: null`** — un lien que rien ne justifie aujourd'hui.
   C'est une amélioration de contenu réelle, pas un contournement de porte.
2. **Le CTA, seulement en paquet** avec l'écriture d'un 5ᵉ lien éditorial honnête sur les ~22
   pages que ça découvre. Le déplacer seul rend l'audit plus vrai *et* plus bruyant, ce qui est
   la pire des deux positions si personne n'enchaîne.
3. **Ne pas monter `ANCHOR_MAX`, et ne pas envelopper ces grilles dans un `<nav>`** pour les faire
   sortir du compte. La deuxième tentation est la plus dangereuse : c'est sémantiquement
   défendable, ça ferait tomber 8 avertissements d'un coup — et ça ne changerait **rien** à ce que
   voit un moteur. Ce serait baisser la porte en ayant l'air de corriger le HTML.

### Appliqué : la grille de services est maintenant dérivée du secteur

`src/lib/sector-services.ts`, consommé par les deux jumelles. Chaque lien remonte à un fait du
secteur — strate d'époque, drain d'origine, niveau de pression, ou mention explicite dans ses
propres `localTerms` / `housingStock`. **Si la donnée ne le dit pas, le lien n'existe pas.**

| | Avant (`related` global) | Après (dérivé) |
|---|---|---|
| Jeux de liens distincts | ~2 sur 51 | **15 sur 51** |
| `ocre-ferreuse` depuis les secteurs | **48** | **0** |
| `vide-sanitaire` depuis les secteurs | 0 | 15 |
| `inspection` depuis les secteurs | 48 | 28 |

**Le gain qui compte : les 96 liens « ocre ferreuse » ont disparu.** `ocre` vaut `null` sur les
51 secteurs — la question 6 s'était fermée par la négative en session 2 — et pourtant 48 hubs
pointaient vers ce service. Rien dans les données ne le justifiait.

**Vérifié avant et après :** aucun hub de service ne tombe sous `MIN_INBOUND` (le plus bas est à
3, hors liens de secteur), et aucun hub de secteur ne tombe sous `MIN_OUTBOUND` (distribution
5→11, deux pages à 5).

**Ce que ça ne règle pas, et il faut le dire :** l'audit passe de 12 à **14** avertissements.
`ocre` sort de la liste, mais `fissure` (45×) et `impermeabilisation` (39×) y entrent, parce que
ces liens-là sont maintenant *justifiés* sur beaucoup de secteurs. **La concentration résiduelle
est un fait régional, pas un défaut à contourner** : le parc bâti de la CMQ est réellement
homogène — « le signal est vrai mais constant » (session 2). Fabriquer de la diversité d'ancres
que les données n'ont pas serait exactement le maquillage que la règle 3 interdit.

**Piste écartée, et pourquoi — à ne pas retenter.** Envelopper ces grilles dans un `<nav>` les
ferait sortir du compte d'ancres (`stripChrome`) et ferait tomber 8 avertissements d'un coup.
C'est défendable sémantiquement et **ça ne marche pas** : `stripChrome` sert aussi au compte des
liens *sortants*, donc les 102 hubs de secteur perdraient d'un coup 7 à 8 liens contextuels et
passeraient tous sous `MIN_OUTBOUND`. On échangerait 8 avertissements contre ~102.

---

## Le style : la couche typographique n'existait pas

**Signalé par le propriétaire en regardant le site, pas par une porte.** Titres à la taille d'un
paragraphe, aucune séparation de section, FAQ collée, listes de liens sans forme.

**La cause.** `global.css` faisait 100 lignes et s'arrêtait à la palette. Il déclarait
`font-family` sur `h1`-`h4` **et rien d'autre** — pas de `font-size`, pas de marges, pas de
`list-style`. Or Tailwind v4 applique un preflight qui remet à zéro la taille et le poids des
titres, les marges, et les puces des listes. **Le CSS ne rétablissait rien de ce que le reset
enlève.** Résultat : 158 pages en mur de texte.

**Aucune porte ne mesure l'apparence**, et c'est structurel : `uniqueness`, `link-audit` et
`seo-audit` lisent le texte, les liens et les métadonnées. Un site parfaitement audité peut être
illisible. À garder en tête — la vérification visuelle n'a pas de substitut automatisé ici.

**Livré** — une couche de typographie de contenu scopée à `.mesure` (la colonne de lecture, que
les 14 gabarits utilisent tous ; l'en-tête et le pied de page ont leurs propres classes) :

- échelle fluide `clamp()` pour `h1`/`h2`/`h3` ;
- **séparation des sections** : filet + air au-dessus des `h2`, beaucoup plus qu'en dessous ;
- rythme des paragraphes, puces et retraits rétablis sur les listes ;
- **FAQ** : `<details>` séparés par des filets, `<summary>` avec une vraie zone cliquable, marqueur
  à l'accent, réponse en retrait ;
- `.liens-liste` — les grilles de fin de page en deux colonnes, liens soulignés, plus la liste
  brute d'avant ;
- `.cta-fin` — l'appel à l'action rendu comme un bouton, pas comme un lien de plus.

**Retiré au passage :** la liste des époques sur les hubs de secteur affichait les **jetons bruts**
de `cities.json` au lecteur (« avant-1945 (dominant) — fondation : pierre, drain d'origine :
aucun »). Le hero `EraDiagram` rend exactement la même donnée, libellée. Marge vérifiée avant de
couper : la page de secteur la plus courte fait **805 mots** pour un seuil de 400.

**Ce qui reste sur le visuel :** les polices **Bitter** et **Public Sans** ne sont toujours pas
installées (dette de la phase 1, déjà notée). Le CSS déclare les familles et retombe sur Georgia
et system-ui. C'est lisible, mais ce n'est pas la typographie décidée dans `DESIGN.md`.

---

## ⚠ LE VRAI BLOCAGE RESTANT : 20 pages statiques n'existent pas

**C'est ce que le propriétaire voit comme « la majorité des pages sont manquantes », et il a
raison.** Sur les 11 pages statiques de `STATIC_PAGES`, **une seule est construite** —
`serviceArea` (`/territoire/`, `/en/service-area/`). Les 10 autres × 2 langues = **20 pages**, et
ce sont exactement les « 20 planned page(s) linked but not built » de `link-audit`.

**Elles sont liées depuis l'en-tête et le pied de page de chacune des 158 pages.** Donc presque
tous les liens de navigation du site mènent au 404.

| Page | FR | Bloquée par |
|---|---|---|
| `quote` | `/soumission/` | **le domaine + le Worker** (formulaire, CSRF) — phase 7 |
| `contact` | `/contact/` | idem si elle porte un formulaire |
| `pricing` | `/prix/` | rien — `pricing.json` est prêt, `range: null` assumé partout |
| `faq` | `/faq/` | rien |
| `process` | `/processus/` | rien |
| `emergency` | `/urgence/` | rien |
| `about` | `/a-propos/` | rien |
| `terms` | `/conditions-utilisation/` | rien — **exigée par `CLAUDE.md`** (service de mise en relation) |
| `privacy` | `/confidentialite/` | rien |
| `sitemap` | `/plan-du-site/` | rien — dérivable de `routes.ts` |

**8 des 10 ne dépendent d'aucune décision ouverte** et peuvent s'écrire tout de suite. Leurs
lignes existent déjà dans `KEYWORD-MAP.md` au statut « planifié », donc **la règle 2 est déjà
satisfaite** : il n'y a pas de registre à modifier avant de créer les fichiers.

**Et c'est ce qui fait tomber la NOTE `20 planned` de `link-audit`**, qui doit être à 0 avant le
lancement sous peine de liens morts permanents (PLAYBOOK §7.3).

### Livré : les 8 pages non bloquées, FR + EN

**`npm run build` : 174 pages · 0 erreur.** `[seo-audit] 174 pages · 0 erreur · 0 avertissement`.
La NOTE `link-audit` **passe de 20 à 4** : il ne reste que `/soumission/` et `/contact/`, dans les
deux langues, qui attendent réellement le domaine et le Worker.

| Page | Ce qu'elle porte |
|---|---|
| `/conditions-utilisation/` · `/en/terms/` | L'énoncé obligatoire de `CLAUDE.md` : service publicitaire et de mise en relation, prestataire indépendant licencié, aucun avis technique ni d'ingénierie. Dit aussi que le contrat se forme entre le lecteur et l'entrepreneur, jamais avec le site. |
| `/confidentialite/` · `/en/privacy/` | Les champs réellement collectés, la finalité unique, les droits québécois (accès, rectification, retrait du consentement, suppression) et la CAI comme autorité. **Affirme que le site ne dépose aucun témoin de suivi — c'est vrai et vérifiable** : 0 octet de JS, contrôlé à chaque build. |
| `/a-propos/` · `/en/about/` | **Le piège de la page :** un « à propos » appelle une histoire d'entreprise, une équipe, une date de fondation — il n'y en a aucune (règle 1). Elle décrit donc le *service* et la *méthode éditoriale*, qui sont vrais : pas de chiffre sans source, pas de marque de confiance inventée, pas d'instruction d'exécution. |
| `/prix/` · `/en/pricing/` | **Pilotée par `pricing.json`**, pas par de la prose : elle affiche une fourchette si `range` existe, et « aucune fourchette publiée » sinon. Aujourd'hui aucune des 11 n'en a. Le jour où une source primaire s'ouvre, on remplit le JSON et la page suit. Le reste de la page donne ce qui sert vraiment : ce qui fait varier la facture, et les 5 points qu'une soumission doit nommer pour être comparable. |
| `/faq/` · `/en/faq/` | 9 questions, toutes adossées aux entrées `verified` de `regulations.json`. C'est ici que vit le meilleur fait du site : la 2.5 (excavation) relève de l'annexe III, que la RBQ décrit comme ne nécessitant pas « une évaluation de la compétence en exécution de travaux de construction ». Émet `FAQPage`. |
| `/processus/` · `/en/process/` | Les 6 étapes, à la 3ᵉ personne pour tout ce qu'un professionnel fait (règle 1bis). Le message central : le diagnostic **avant** le devis, et un prix ferme donné au téléphone sans inspection est un signal d'alarme. |
| `/urgence/` · `/en/emergency/` | **La page la plus exposée à la règle 1bis du site.** Quelqu'un qui a de l'eau au sous-sol cherche quoi faire, et c'est exactement ce qu'on ne peut pas lui dire — `CLAUDE.md` interdit nommément la « solution temporaire en attendant ». Elle fait donc ce qui est à la fois permis et réellement utile : nommer le danger électrique, trier la cause (refoulement d'égout → 311 et non un entrepreneur ; fondation ; plomberie), rappeler d'appeler l'assureur tôt, et documenter pendant que c'est visible. **Tous les gestes proposés sont observer, documenter, téléphoner.** |
| `/plan-du-site/` · `/en/sitemap/` | **Dérivé de `getCollection` et de `STATIC_PAGES`**, jamais tenu à la main : une page écrite y apparaît, une page non écrite n'y figure pas. À ne pas confondre avec `/sitemap.xml`, qui est de la phase 9 et destiné aux moteurs. |

**Écart de convention assumé.** `CLAUDE.md` dit « jamais de copie en dur dans un `.astro` ». Ces
8 pages sont pourtant écrites en `.astro`, comme `territoire.astro` avant elles : ce sont des
**singletons**, pas une famille templatée. Une collection markdown pour 8 pages sans schéma commun
ajouterait de la machinerie qui ne contraint rien, et deux d'entre elles (`/prix/`,
`/plan-du-site/`) doivent lire des données que le markdown ne peut pas atteindre.

### ⚠ Le bug attrapé en chemin : le menu « Secteurs » pointait dans le vide

`Header.astro` liait `nav.sectors` vers `pathFor({ type: 'sectorIndex' })`, c'est-à-dire
**`/secteurs/`** — l'URL dont la session 3b a explicitement décidé qu'elle **resterait un préfixe
sans page**, pour ne pas concurrencer `/territoire/` sur « secteurs desservis ».

Les fils d'Ariane avaient bien été corrigés à ce moment-là. **Ce lien-ci avait été oublié**, et il
partait de l'en-tête, donc **des 87 pages du site**, vers une page qui ne sera jamais construite.
`link-audit` ne le signalait pas comme une erreur parce que `/secteurs/` figure en « planifié »
dans `KEYWORD-MAP` — **la dérogation « planifié » couvrait un lien mort permanent, exactement le
risque que PLAYBOOK §7.3 décrit.** Corrigé vers `serviceArea`.

**Leçon à retenir :** quand on décide qu'une URL n'aura jamais de page, il faut *aussi* retirer sa
ligne « planifié » du registre, sinon la porte ne rattrapera jamais l'oubli.

### `KEYWORD-MAP.md` mis à jour

22 lignes passées de `planifié` à `écrit`, dérivées de ce qui est réellement dans `dist/` — les
8 nouvelles paires, plus les pages construites lors des sessions précédentes qui étaient restées
marquées `planifié` (`/`, `/en/`, `/fondation/`, `/territoire/` et leurs jumelles).

---

## Les polices : dette de la phase 1 réglée

`DESIGN.md` décidait **Bitter** (slab, titres) et **Public Sans** (corps) dès la session 0b, et
le CSS déclarait les familles **sans jamais charger un seul fichier** : le site tournait sur
Georgia et system-ui depuis le début.

**Livré** — deux fichiers **variables**, sous-ensemble latin, auto-hébergés dans `public/fonts/` :

| | |
|---|---|
| `bitter-latin.woff2` | 33,3 Ko |
| `public-sans-latin.woff2` | 26,2 Ko |
| **Total** | **~59 Ko**, pile le budget de `CLAUDE.md` |

Une police variable couvre toute la plage 400-700 en un fichier, là où il aurait fallu cinq
fichiers statiques pour le même résultat. `font-display: swap`, et les deux sont **préchargées**
depuis `BaseLayout` — elles servent toutes les deux au-dessus de la ligne de flottaison (le corps
et le h1). **`crossorigin` est obligatoire sur un `preload` de police même en même origine** :
sans lui le navigateur télécharge le fichier deux fois et le préchargement ne sert à rien.

`unicode-range` est conservé tel que Google le publie. Vérifié qu'il couvre ce dont le français a
besoin : les accents (U+0000-00FF), **`œ` (U+0152-0153)** — nécessaire pour « reprise en
sous-œuvre », le vocabulaire officiel de la sous-catégorie 2.6 — l'espace insécable et les tirets
cadratins.

**Licences OFL déposées à côté des fichiers** (`public/fonts/OFL-Bitter.txt`,
`OFL-PublicSans.txt`), comme la licence l'exige. Même principe que `IMAGE-CREDITS.md` : la
licence suit l'actif jusqu'au locataire.

---

## La verticale héritée : dernier passage, et deux commentaires qui mentaient

**`worker/lead-form.ts` était encore le fichier du site antiparasitaire.** Trois défauts, dont un
sérieux :

1. `FIELD_LABELS` contenait `pest: { fr: 'Ravageur' }` et `rental: { fr: 'Logement loué' }` —
   remplacés par `service` (Intervention) et `building` (Type de bâtiment). **Ces clés sont le
   contrat que le formulaire de `/soumission/` devra respecter** : les corriger *avant* d'écrire
   le formulaire évite que la contamination passe dans le HTML.
2. Les sujets de courriel annonçaient `— ${get('pest') || 'ravageur non précisé'} —`.
3. **Le plus grave :** l'expéditeur était écrit en dur
   `payload.append('from', 'exterminateur-qc.ca <noreply@…>')`. Les prospects de ce site
   seraient partis **sous la marque d'un autre site**. Remplacé par la constante `SITE_NAME`.

**Puis un grep de l'ancienne verticale sur tout le dépôt**, la leçon de la session 3b appliquée
au-delà de `src/`. Il restait deux commentaires qui **décrivaient le projet précédent** — la même
forme d'erreur que `post-build.mjs`, qui documentait un déploiement Dokploy :

- `link-audit.mjs` : « "Money pages" are pest, sector, matrix and **commercial** pages » — il n'y
  a aucune famille commerciale ici, et `MONEY` ne contient que services, secteurs et matrice ;
- `uniqueness-check.mjs` et le `$schema_note` de `cities.json` : « pest x sector matrix ».

Corrigés. **Un commentaire qui nomme des familles que le dépôt n'a pas envoie le lecteur suivant
les chercher** — et sur ce projet, les commentaires sont la mémoire.

Restent des mentions de l'ancien site qui sont de l'**histoire exacte** et doivent rester
(`data.ts` « written for the previous (pest-control) site », `foundation-pressure.mjs`
`delete c.pestPressure`). Et « Laurentides Wildlife Reserve » dans `cities.json` est le nom réel
de la réserve faunique — pas une scorie.

---

## Le blogue existe — le moat a son contenu d'ancrage

**`npm run build` : 180 pages · 0 erreur.** `[uniqueness]` **passe de 150 à 154** — c'est le
chiffre qui compte : il prouve que la famille blogue est **réellement contrôlée**, et non sautée
en silence comme le PLAYBOOK §0.1 le décrit.

**L'ordre de `CLAUDE.md` a été suivi, y compris l'étape 3.**

1. Lignes déjà présentes dans `KEYWORD-MAP.md` (section 5) ✓
2. Routes construites : `blogue/[slug]`, `blogue/index`, et les deux jumelles EN
3. **`FAMILIES` de `uniqueness-check.mjs` : `blog-fr` et `blog-en` enregistrées AVANT
   d'écrire le premier article.** `sectorFromUrl()` renvoie `null` pour ces noms, donc la règle
   des faits locaux ne s'y applique pas — seuls la similarité et le seuil de 400 mots comptent,
   ce qui est le bon contrôle pour des articles sur des sujets distincts.
4. Contenu ensuite.

### Les deux articles

| Article | Ce qu'il apporte |
|---|---|
| `verifier-licence-rbq-entrepreneur` / `check-rbq-contractor-licence` | **Le contenu d'ancrage du moat**, désigné depuis la session 0b. Il sort le fait de l'annexe III de la FAQ et lui donne sa page : la 2.5 (excavation) ne nécessite pas « une évaluation de la compétence en exécution de travaux de construction », la 2.6 si. Plus le trio 2.5 / 3.2 / 7, et les 4 gestes de vérification au registre. |
| `norme-bnq-3661-500-drain-francais` / `bnq-3661-500-french-drain-standard` | Le **pilier du moat** selon `KEYWORD-MAP`. La norme est en deux parties (I = évaluation du risque et diagnostic, II = méthodes d'installation) et une **seconde** norme, BNQ 3624-130, vise le tuyau. D'où : « un drain BNQ » sans numéro ni partie ne prouve rien. |
| `garantie-gcr-fondation-maison-neuve` / `new-home-warranty-foundation-coverage` | **L'angle que la concurrence n'écrit pas**, repéré en session 2 : sur une maison de moins de 5 ans, faire réparer soi-même un vice couvert **peut compromettre la réclamation**, parce que la preuve disparaît avec le mur. Les trois fenêtres (1 / 3 / **5 ans**) et laquelle vise une fondation, la transférabilité, et l'ordre qui protège — dénoncer, faire constater, puis décider. |

Les deux se terminent sur ce que le lecteur **exige par écrit**, jamais sur un geste technique
(règle 1bis). `sources` est obligatoire au schéma et rendu en bas de page — c'est ce qui les
sépare du contenu de la couche C, qui ne cite jamais.

### L'appariement de blogue, et pourquoi il ne peut pas dériver

**Les slugs de blogue diffèrent réellement d'une langue à l'autre** —
`verifier-licence-rbq-entrepreneur` ↔ `check-rbq-contractor-licence`. Un article ne peut donc pas
déduire le slug de sa jumelle du sien, et le `PageRef` `blogPost` exige les deux. L'appariement se
fait sur **`translationKey`** (PLAYBOOK §7.2), et **les routes LÈVENT si la jumelle manque** —
la règle 6 devient mécanique au lieu de reposer sur la vigilance. Les deux index ne listent que
les articles appariés, pour la même raison.

Blogue branché dans le pied de page (clé `footer.blog`, 56 clés, parité vérifiée) et dans le plan
du site, sinon les articles seraient orphelins.

### ⚠ Une date seule se lit en UTC, ou elle recule d'un jour

Le premier rendu affichait **« Mis à jour le 6 août 2026 »** sur un article dont `published`
vaut `2026-08-07`. Ce n'est pas une faute de frappe : `published: 2026-08-07` en frontmatter
devient `2026-08-07T00:00:00Z`, et `Intl.DateTimeFormat` sans `timeZone` formate dans le fuseau
local — America/Toronto, UTC-4 — donc le 6 à 20 h.

**Chaque article aurait porté la veille de sa date**, et le `BlogPosting` — qui sort en
`.toISOString()`, donc juste — aurait contredit la page qui l'entoure. Un désaccord entre le
texte visible et la donnée structurée est exactement ce qu'un moteur relève.

Corrigé par `timeZone: 'UTC'` dans les quatre routes de blogue. **À reproduire partout où une
date seule s'affiche** — c'est le même piège que « une chaîne vide n'est pas une variable non
définie » : la valeur est juste, c'est la lecture qui la déplace.

### ⚠ Deuxième découverte : `/secteurs/` était « planifié à vie »

`scripts/lib/planned.mjs` porte en tête un avertissement explicite : *« a URL that will never be
built counts as planned forever, so four dead links hid for six sessions on the previous
project. Anything demoted must be REMOVED from here. »*

Il appelait pourtant `add({ type: 'sectorIndex' })`, c'est-à-dire **`/secteurs/`** — l'URL dont la
session 3b a décidé qu'elle n'aurait jamais de page. **C'est ce qui a permis au lien mort de
l'en-tête de survivre :** `link-audit` le voyait comme « planifié », donc une NOTE, jamais une
erreur. Le fichier décrivait son propre bug et personne ne l'avait relu.

Retiré. **Tout lien vers `/secteurs/` est désormais une erreur dure.** Les deux moitiés du
problème sont maintenant fermées : le lien (en-tête) et la dérogation qui le couvrait.

### `KEYWORD-MAP.md`

Les 2 lignes FR passent à `écrit`, et **la section 5 gagne un tableau de jumelles EN** — il
n'existait pas, la note disait « elles seront listées ici en phase 9 ». Écrire les pages EN sans
leur ligne aurait été une violation de la règle 2 le temps d'une session.

---

## Phase 9 : sitemap, robots.txt, llms.txt — livrés, et sans dépendance

**Ils n'attendaient pas que le domaine soit *choisi*, seulement qu'il soit *fourni au build*.**
C'est une distinction qui valait plusieurs sessions d'attente : tout est paramétré par
`SITE_URL`, donc rien n'empêchait de les écrire.

### Le sitemap est GÉNÉRÉ depuis le HTML rendu, pas produit puis rafistolé

`post-build.mjs` attendait un `dist/sitemap-0.xml` produit par `@astrojs/sitemap` — **une
intégration qui n'a jamais été installée**. Il annonçait donc `skip:` à chaque build depuis la
session 1, et le sitemap n'existait pas.

Plutôt que d'ajouter la dépendance, il est maintenant **dérivé de la sortie** : le script lit les
`<link rel="canonical">` et `<link rel="alternate">` des pages construites. C'était déjà
l'argument que le fichier défendait dans son propre commentaire — `@astrojs/sitemap` apparie les
langues en échangeant le préfixe de chemin, ce qui est faux ici parce que nos slugs sont
réellement localisés (`/soumission/` ↔ `/en/quote/`).

Trois propriétés que ça donne gratuitement :

- **Le sitemap ne peut pas contredire le HTML** — il en est extrait, et `seo-audit` a déjà
  vérifié la réciprocité des hreflang et l'absence de cibles mortes.
- **Les pages `noindex` s'excluent d'elles-mêmes.** Un 404 n'a pas de canonique, donc il ne
  rentre pas. Aucune liste d'exclusion à tenir, donc aucune à laisser dériver.
- **Aucune dépendance ajoutée** (règle 7). L'origine vient des canoniques elles-mêmes, jamais de
  l'environnement : il n'y a pas deux sources qui peuvent se désaccorder.

**Résultat : `178 URL(s)`** — les 180 pages moins les deux 404. XML validé, 3 alternates par URL
(`fr-CA`, `en-CA`, `x-default`), aucun doublon.

**Pas de `lastmod`, volontairement.** Nous n'avons pas de date de modification fiable par page,
et un `lastmod` inventé est pire qu'absent : les moteurs s'en servent pour prioriser le recrawl,
donc mentir dessus coûte du budget de crawl. C'est la règle des `null` honnêtes appliquée à un
fichier machine.

**Un sitemap vide est traité comme une erreur dure**, pas comme un fichier à écrire quand même :
annoncer à un moteur que le site n'a aucune page est le pire résultat possible.

### `robots.txt` et `llms.txt`

`robots.txt` : `Allow: /` et la ligne `Sitemap:`. **Rien à interdire** — chaque page construite
est destinée à l'index, et les 404 portent déjà `noindex` dans leur en-tête.

`llms.txt` : la convention llmstxt.org, générée depuis les mêmes pages et donc incapable de
dériver du site réel. 178 entrées en 5 sections, chacune avec son titre et sa description.
L'en-tête énonce ce que le site est — service publicitaire et de mise en relation, aucun avis
technique — parce qu'un agent qui résume le site doit lire ça en premier, comme un humain.

### Encore un fichier hérité qui documentait l'autre site

`wrangler.jsonc` expliquait que `name` « produit `https://exterminateur-qc.<account>.workers.dev` »
— **deux lignes au-dessus de `"name": "solage-capitale"`**. Corrigé. C'est la quatrième
occurrence de ce défaut cette session (`post-build.mjs`, `link-audit.mjs`, `uniqueness-check.mjs`,
`wrangler.jsonc`) et la leçon se confirme : **sur ce projet, les commentaires sont la mémoire, et
un commentaire hérité est une fausse mémoire.**

À noter pour la phase 7 : `wrangler` n'est pas dans les dépendances, donc le `$schema` de
`wrangler.jsonc` pointe vers un fichier absent et l'éditeur le signale. Sans effet sur le build ni
sur `npx wrangler deploy`, mais à régler en installant wrangler en `devDependency` au moment du
déploiement.

---

## En-têtes de sécurité : ils ne pouvaient PAS aller dans le Worker

**La découverte qui a décidé de l'implémentation.** Avec `main` + un binding `assets`, Cloudflare
sert l'asset statique **en premier** et n'invoque le Worker que lorsqu'aucun asset ne correspond —
c'est écrit noir sur blanc en tête de `worker/index.ts`. **Le Worker ne voit donc jamais passer
une vraie page.** Y poser des en-têtes de sécurité n'en aurait mis sur aucune des 182.

C'est le genre d'erreur qui se déploie proprement et ne se voit qu'au `curl -I`.

**Livré : `public/_headers`**, appliqué par la plateforme sans invocation de code.

- **CSP stricte, jusqu'à `script-src 'none'`.** Le site sort 0 octet de JS client, donc la
  politique peut interdire le script tout court — c'est le bénéfice concret de la règle 7.
- `frame-ancestors 'none'`, `base-uri 'none'`, `object-src 'none'`, `form-action 'self'`,
  `upgrade-insecure-requests`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`.
- **HSTS sans `preload`, délibérément.** La liste de préchargement est un engagement long et
  pénible à défaire, et **cet actif est destiné à être loué** : le locataire doit pouvoir déplacer
  le domaine sans hériter d'une contrainte qu'il n'a pas prise. `max-age=31536000` donne
  l'essentiel.
- Cache : `/_astro/*` en `immutable` (les noms portent un hash de contenu), `/fonts/*` en un an
  **sans** `immutable` — les polices viennent de `public/` et n'ont pas de hash, donc un
  remplacement doit pouvoir se propager.

**La CSP a été vérifiée en vrai, pas supposée.** Un serveur local qui pose l'en-tête, la page
chargée dans Chrome headless : **le JSON-LD survit dans le DOM** (c'est un bloc de données, pas un
script exécuté), et **aucune ressource n'est bloquée, aucune violation console**. Sans ce test,
`script-src 'none'` était un pari sur le comportement du navigateur face à `application/ld+json`.

⚠ **Un point reste à vérifier en production, et il est écrit dans `DEPLOY.md` §4b :** que la
plateforme lise bien `_headers` pour un Worker à assets statiques. Si elle ne le fait pas, le
repli est `run_worker_first` — qui marche, mais coûte une invocation par requête. **Ne pas
supposer que c'est en place : le `curl -sI` est dans la checklist.**

---

## `docs/DEPLOY.md` et `docs/HANDOFF-TENANT.md` — les deux documents qui manquaient

Tous deux étaient annoncés dans `CLAUDE.md` depuis la phase 1 et n'existaient pas.

**`DEPLOY.md`** — prérequis, `SITE_URL`, les 5 variables du Worker, la commande, **5 vérifications
qui ne peuvent se faire qu'après déploiement** (le formulaire envoie vraiment ; les en-têtes sont
appliqués ; le 404 est un vrai 404 dans la bonne langue ; 0 JS ; les artefacts portent le bon
domaine), puis la liste des pièges — `@emnapi`, les deux Vite, le POST dégradé en GET par un 301,
`not_found_handling`, le renommage qui crée un second Worker.

**`HANDOFF-TENANT.md`** — et c'est le document qui rend l'actif louable. Il sépare trois choses
qu'on confondrait autrement :

1. **Ce qui s'inverse** : `phone`, `address`, `rbqLicence` passent de `null` à réel ; le
   `LocalBusiness` s'ouvre. **Et comme j'ai rendu cette interdiction mécanique dans `seo-audit`
   cette session, le document dit précisément comment la desserrer** — ajouter le helper et
   retirer le type de la liste des interdits *dans le même commit*, avec le motif.
2. **Ce qui ne s'inverse pas** : pas d'avis inventé, pas d'instruction d'exécution, pas de chiffre
   sans source, URL gelées, portes bloquantes, français québécois.
3. **Le piège du territoire** : si le locataire dessert moins que la CMQ, **les hubs de secteur
   hors territoire doivent être retirés, pas laissés**. Une page qui capte une demande qu'on ne
   peut pas servir empoisonne l'actif — c'est exactement ce que le projet existe pour éviter.

Il pose aussi la question de `LEAD_BCC` explicitement : une copie non annoncée d'un courriel
contenant des renseignements personnels n'est pas acceptable, ça se convient par écrit.

**`docs/CONTENT-BRIEF.md` n'a pas été écrit, et ne devrait pas l'être.** Sa raison d'être était
« comment écrire chaque type de page » avant la rédaction. Le corpus est terminé, et les trois
briefs réellement utilisés existent (`BRIEF-HUB-SERVICE.md`, `BRIEF-HUB-SECTEUR.md`,
`BRIEF-FOUNDATION-PRESSURE.md`). L'écrire maintenant produirait un quatrième document redondant
que personne ne lirait. **La ligne de `CLAUDE.md` qui l'annonce est à retirer, pas à honorer.**

---

## Outillage

**`wrangler` est passé en `devDependency`** (4.120.0). Il était appelé par `npx`, donc sa version
bougeait entre deux déploiements, et le `$schema` de `wrangler.jsonc` pointait vers un fichier
absent — l'éditeur le signalait à chaque ouverture.

**`npx wrangler deploy --dry-run` passe** : 384 fichiers lus depuis `dist/`, binding `ASSETS`
présent, Worker à 8,25 Ko. Toute la configuration de déploiement est donc validée **avant** que le
domaine existe — il ne restera que la commande à lancer.

---

## La garde anti-cannibalisation exécutée pour de vrai — 2 des 9 articles restants ne tiennent pas

Avant d'écrire le quatrième article, j'ai exécuté le **contrôle n°1** que `KEYWORD-MAP.md` décrit
depuis la session 0 et que personne n'avait jamais lancé : chercher le mot-clé principal de chaque
ligne planifiée parmi les principaux **et les secondaires** déjà attribués aux 250 autres URL.

**Il fallait l'automatiser pour qu'il serve.** Fait à l'œil sur 262 lignes, ce contrôle ne se fait
pas — et c'est précisément pour ça que les deux conflits ci-dessous ont survécu depuis le cadrage.

### `durée de vie drain français` — RÉTROGRADÉ

Le mot-clé figure **déjà comme secondaire de `/fondation/drain-francais/`** (ligne 58 du registre).
C'est le cas exact du contrôle : un article de blogue qui vise le secondaire de son propre hub ne
concurrence pas un inconnu, **il concurrence la page qu'il devrait renforcer.** Devient une section
du hub, en texte, jamais une page. Ne pas rouvrir sans retirer d'abord le secondaire de la ligne 58.

### `eau au sous-sol fonte des neiges` — à recadrer avant d'écrire

La ligne porte l'intention **#1**, et `/urgence/` porte déjà #1. La table de conflits dit
elle-même que `/urgence/` « ne doit pas devenir un deuxième article sur l'infiltration » — deux URL
sur la même intention est une cannibalisation par construction.

L'article n'est écrivable qu'en **changeant d'intention** : expliquer le mécanisme saisonnier — sol
encore gelé, l'eau de fonte ne s'infiltre pas et suit la couche gelée jusqu'à la fondation — ce qui
est **#7, le mécanisme régional**, pas #1. Reclasser la ligne *avant* d'écrire, sinon c'est une
section de `/urgence/`.

### Deux points de surveillance, pages conservées

`assurance-habitation-infiltration-eau` et `inspection-fondation-avant-achat` recoupent fortement
des hubs existants, mais sur le **vocabulaire**, pas sur l'intention. Conservées, avec la même
discipline que le point de surveillance n°1 : le H1 et la première phrase doivent mener avec ce qui
les distingue — l'assurance, l'acheteur — jamais avec l'infiltration ou l'inspection.

### `vice-cache-fondation-quebec` — bloqué sur sa source, et c'est un résultat

C'était le meilleur candidat restant : intention #9, aucun recoupement, et il complète l'article
GCR — **maison neuve → plan de garantie ; revente → vice caché**. Personne dans la niche ne fait ce
couple.

**Il n'a pas été écrit parce que LégisQuébec répond 403 aux requêtes automatisées.** Le fond est le
Code civil du Québec et je le connais approximativement — ce qui est exactement la raison de ne pas
l'écrire. La règle du projet ne fait pas d'exception pour un texte de loi : **un fait sans source
ouverte et notée ne se publie pas.** À ouvrir à la main, puis écrire.

C'est la même décision qu'en session 2 pour `ctq-m200` et `profondeur-de-gel` : bloqué, avec la
raison écrite, plutôt que publié à peu près.

---

## Le modèle du propriétaire, clarifié le 2026-08-08 — et ce que ça change

**Le propriétaire n'est pas une entreprise.** Il construit des sites pour les louer, et facture la
location **à son nom personnel**. C'est la pièce de contexte qui manquait à toutes les sessions
précédentes.

**Ce que ça ne change pas.** L'immatriculation au Registraire des entreprises vise le nom sous
lequel on exploite ; une personne physique qui exploite sous ses propres prénom et nom en est
dispensée. Facturer la location à son nom est exactement ce cas. **Question fermée, ne pas la
rouvrir.**

Le `.ca` non plus : les exigences de présence canadienne de CIRA sont satisfaites par un
**particulier** citoyen ou résident permanent. La société canadienne est une des catégories
admissibles, pas la condition — j'avais mal formulé ça en proposant les domaines.

**Ce que ça change, et qui était invisible jusqu'ici.** La loi québécoise sur la protection des
renseignements personnels **ne dépend ni d'une immatriculation ni d'une forme juridique** : elle
s'applique à quiconque recueille, personne physique comprise, et exige un **responsable
identifiable**.

`/confidentialite/`, écrite en session 4, promet un droit d'accès et renvoie vers `/contact/`.
**Tant que `/contact/` ne porte pas un nom réel et un canal joignable, la promesse est creuse.**

J'avais classé `/contact/` comme « bloquée par le domaine ». **C'est faux : elle est bloquée par
une décision du propriétaire** — qui est nommé responsable. La règle est écrite dans
`HANDOFF-TENANT.md` §4.1 :

> **Ne pas mettre le formulaire en ligne avant qu'un responsable soit nommé sur `/contact/`.**

Le cas nominal est propre : **une fois le site loué, le responsable est le locataire**, puisque
c'est lui qui reçoit les demandes à `LEAD_TO_EMAIL` et les exploite. Le cas sale est de publier un
formulaire actif pendant la recherche d'un locataire — **inutile de toute façon** : les 182 pages
peuvent partir et s'indexer sans formulaire, ce qui est même la bonne séquence.

**Le cadrage général tient sans retouche.** La règle « aucune entreprise réelle derrière ce site »
a toujours visé **l'entrepreneur en fondation**, pas l'éditeur. Le site n'a jamais prétendu
exécuter des travaux, et un éditeur identifié est précisément ce qu'il faut.

---

## Ce qui reste avant le lancement

> ⚠ **Les points 1 et 2 sont FAITS depuis la session 5 (2026-08-11)** — domaine
> `solagecapitale.ca` câblé, les 4 pages écrites, la NOTE `link-audit` à **0**. Voir la section
> « Session 5 » en fin de fichier. Le reste de cette liste tient toujours.

1. ~~**`/soumission/` et `/contact/`, FR + EN**~~ — **écrites.** Le responsable nommé est
   **Xavier Breton** (`PRIVACY_OFFICER` dans `src/lib/constants.ts`), donc la règle dure de
   `HANDOFF-TENANT.md` §4.1 est satisfaite et le formulaire est actif. Deux pages de plus ont
   été créées au passage, `/merci/` et `/en/thank-you/` : le Worker y redirigeait déjà sans
   qu'elles existent.
2. ~~**Le domaine.**~~ — **`solagecapitale.ca`.** Reste à lancer `npx wrangler deploy` et à
   dérouler les 5 vérifications de `DEPLOY.md` §4, plus la configuration Mailgun.
3. ~~**Phases 7 à 9**~~ — **tout ce qui ne dépendait pas du domaine est fait** : `sitemap.xml`,
   `robots.txt`, `llms.txt`, en-têtes de sécurité et de cache, `DEPLOY.md`, `HANDOFF-TENANT.md`,
   `wrangler` épinglé, `deploy --dry-run` vert. **Il ne reste que la commande à lancer**, une fois
   le domaine choisi et le formulaire écrit.
4. **Le blogue : 3 articles écrits, 8 restants** (un rétrogradé). Ils sont listés dans
   `KEYWORD-MAP.md` §5. Les deux saisonniers sont à publier **en avance de leur saison** :
   `eau-sous-sol-fonte-des-neiges` (mars) et `gel-degel-fondation-region-quebec` (novembre).
   Chaque nouvel article ajoute sa ligne EN au tableau de jumelles **avant** le fichier.

   ⚠ **`argile-mer-de-champlain-fondation` est le plus risqué, pas le plus facile.** Le registre
   le marque « différenciateur géologique », mais la question 6 s'est fermée **par la négative** en
   session 2 : les associations sol → secteur sont une hypothèse, pas un fait publié, et `ocre`
   vaut `null` sur les 51 secteurs. L'article n'est écrivable que s'il traite la géologie
   **régionale** avec une source primaire (Commission géologique du Canada, MERN) **et qu'il dit
   explicitement que le sol d'un lot donné ne se déduit pas d'une carte régionale.** Écrit
   autrement, il devient la seule page du site à affirmer ce que le projet a refusé d'affirmer
   partout ailleurs.
5. Les **14 avertissements de maillage** consultatifs, arbitrage documenté plus haut.

---

## Phase 6 — les 13 pages matrice : TERMINÉE

**Le corpus de contenu du site est complet.** `npm run build` : **156 pages · 0 erreur** sur les
trois portes (`[uniqueness] 150 pages`, `[link-audit] 156 pages · 12 warnings`,
`[seo-audit] 156 pages · 0 warning`). **Le maillage est passé de 64 à 12 avertissements** en
deux correctifs : la grille par secteur sur les hubs de service, et les liens croisés sur les
pages matrice.

| Famille | Pages |
|---|---|
| Hubs de service | 11 × 2 langues |
| Hubs de secteur | 51 × 2 langues |
| Matrice service × secteur | 13 × 2 langues |
| Index de section, index géographique, accueil | 6 |

**La grille « par secteur » sur les hubs de service était manquante.** `link-audit` signalait
26 avertissements de liens entrants : **rien ne pointait vers les pages matrice**. Or
`SEO-PLAN` §6 le prévoit — « chaque hub de service : grille de liens vers ses secteurs
approuvés ». Implémentée, pilotée par `getCollection` et non par `_matrice.txt`, pour qu'une
combinaison approuvée mais non écrite ne devienne pas un lien mort. Les 26 avertissements sont
tombés d'un coup.

**Avertissements restants, tous connus et documentés :**

- **102 « no hero image with alt text »** — phase 3, les images. C'est le plus gros bloc restant
  du projet.
- ~~28 « contextual outbound links »~~ — **réglé.** Une page matrice était un cul-de-sac à trois
  liens. Elle pointe maintenant vers l'autre service approuvé pour ce secteur quand il existe, et
  vers trois secteurs voisins — toujours filtré contre les pages réellement construites. Il n'en
  reste que 2.
- **10 « vary the anchor text »** — ~~l'appel à l'action en fin de corps de chaque gabarit~~.
  **FAUX, mesuré en session 4 : 2 sur 10 seulement.** Les 8 autres viennent de la grille
  « sujets liés » des hubs de secteur. Voir § « Les 10 avertissements — la recommandation écrite
  est fausse ». **Ne pas monter le seuil `ANCHOR_MAX`.**

**Ce que les sous-agents ont trouvé et que le brief n'avait pas prévu :** les pages matrice de
Château-Richer, Sainte-Anne-de-Beaupré et l'Île d'Orléans ne parlent pas de *remplacer* un drain
usé mais d'en **installer un premier** contre un mur de pierre qui n'en a jamais eu. C'est un
angle structurellement différent de celui de Beauport, et il distingue naturellement ces pages
des huit autres pages `drain`.

---

**ÉTAT — PHASES 4 ET 5 TERMINÉES.** `npm run build` vert : **130 pages · 0 erreur** sur les trois
portes (`[uniqueness] 124 pages`, `[link-audit] 130 pages`, `[seo-audit] 130 pages · 0 warning`).

- **11 hubs de service**, FR + EN.
- **51 hubs de secteur**, FR + EN. Parité complète, aucune orpheline.
- Index de section `/fondation/` et index géographique `/territoire/`, avec leurs jumelles EN.

**Avertissements restants, tous attendus :** 102 « no hero image with alt text » (phase 3, images),
10 « vary the anchor text » et 2 de maillage. **Aucune erreur.**

**Quatre secteurs passent à exactement 5 termes locaux sur leur page EN** — `boischatel`,
`charny`, `giffard`, `ile-dorleans`. Ils passent, mais sans marge : une reformulation anodine les
ferait tomber sous le seuil. Remède connu et sans risque : leur ajouter un `localTermsEn`.
Commande pour réauditer les marges à tout moment :

```bash
python3 - <<'EOF'
import json
c=json.load(open('src/data/cities.json'))
m=[]
for k in [x for x in c if not x.startswith('$')]:
    t=open(f'src/content/sectors/en/{k}.md').read().lower()
    terms=c[k].get('localTermsEn') or c[k]['localTerms']
    m.append((len([x for x in terms if x.lower() in t]),k))
print(sorted(m)[:8])
EOF
```

**`localTermsEn` a été nécessaire pour 10 secteurs** : `saint-sauveur`, `saint-gabriel-de-valcartier`,
`sainte-brigitte-de-laval`, `shannon`, `sainte-catherine-de-la-jacques-cartier`, `pintendre`,
`chateau-richer`, `lange-gardien`, `sainte-anne-de-beaupre`. Tous ont le même profil : une liste
`localTerms` faite surtout de vocabulaire générique (`boisé`, `grange`, `cabanon`, `vide sanitaire`,
`verger`) que l'anglais traduit naturellement, donc la page EN ne peut pas atteindre 5
correspondances littérales. **C'est le cas exact que `uniqueness-check.mjs` documente**, et son
champ prévu le règle sans toucher au seuil.

**Le brief a été corrigé pour que l'agent signale au lieu de bricoler.** Un agent avait d'abord
atteint le compteur en insérant des expressions françaises glosées dans une page anglaise. Le
problème n'était pas l'agent : le brief ne lui offrait aucune issue honnête. Depuis qu'il demande
explicitement de **signaler** le cas, les agents le signalent — et un l'a fait spontanément pour
`pintendre`.

**Trois corrections factuelles apportées par un agent, que le brief n'anticipait pas.**
L'Ancienne-Lorette et Saint-Augustin-de-Desmaures sont des **villes indépendantes** ayant refusé la
fusion de 2002 : leur `publicReference` pointe vers leur propre hôtel de ville, pas vers le 311 de
Québec. Wendake est une **réserve**, pas une municipalité : les permis y relèvent du Conseil de la
Nation huronne-wendat. Renvoyer ces trois secteurs au 311 aurait été faux.

### Le maillage : un problème réel, à moitié réglé

`link-audit` signalait **24 avertissements « vary the anchor text »** : chaque hub de secteur
liait les **11 services** dans une grille plate, donc chaque service recevait ~43 ancres
identiques — un chiffre qui grandit avec le nombre de secteurs. C'est une empreinte de
sur-optimisation, pas un détail cosmétique.

**Corrigé à moitié :** le hub de secteur ne lie plus les 11 services. Il dérive un petit ensemble
**pertinent pour ce secteur** — le service de matrice dont la pression est la plus forte ici, plus
ses sujets liés. Deux secteurs de profils différents surfacent donc des services différents, sans
rien inventer. Le nombre de liens par page passe de 11 à 4.

**Ce qui reste, et pourquoi je ne l'ai pas forcé :** la concentration s'est déplacée sans
disparaître, parce que la plupart des secteurs ont `drain-francais` en tête et surfacent donc les
mêmes sujets liés. Et surtout, `/soumission/` est signalé 51× pour « demander une soumission » :
c'est l'appel à l'action en fin de corps de chaque gabarit. `link-audit` dépouille déjà l'en-tête
et le pied de page (voir son commentaire), donc il a raison de compter celui-ci comme du lien
éditorial templatisé.

**Deux options pour la suite, à trancher :** déplacer cet appel à l'action dans le chrome du
layout (c'est du mobilier de conversion, pas de l'éditorial), ou faire varier son libellé selon
le type de page. La première est la plus propre. **Ne pas monter le seuil `ANCHOR_MAX`** — la
règle 3 vaut ici comme ailleurs.

> ⚠ **Corrigé en session 4, chiffres à l'appui.** Déplacer le CTA ne règle que **2 des 10**
> avertissements, et fait tomber 20 pages sous `MIN_OUTBOUND` parce qu'elles ne tenaient le seuil
> de 5 que grâce à lui. Ne pas appliquer cette recommandation telle quelle — lire le §
> « Les 10 avertissements « vary the anchor text » — la recommandation écrite est fausse ».

**⚠ REPRISE — lire en premier.** La session a été coupée par sa limite alors que 9 sous-agents
écrivaient les 50 secteurs restants. Ils sont **tous morts sans rendre**. État réel sur le
disque :

```bash
ls src/content/sectors/fr/ ; ls src/content/sectors/en/    # le registre, c'est le disque
```

- **4 secteurs complets, FR + EN** : `beauport` `breakeyville` `charlesbourg` `la-cite-limoilou`
- **47 secteurs restants**, FR + EN.

Les agents avaient écrit 4 fichiers FR et 1 seul EN avant de mourir. Les 4 FR étaient
**complets et valides** — ils ont fini chaque fichier avant de tomber. Les 3 jumelles EN
manquantes ont été écrites à la main dans la foulée, donc **la règle 6 n'est pas en dérogation** :
il n'y a aucune page FR orpheline. Ne pas réécrire ces 4 secteurs.

Deux scories laissées par les agents et corrigées : une coquille (« avant d'signer ») dans
`charlesbourg`, et un champ parasite `a_note: ""` dans une entrée FAQ de `la-cite-limoilou`.
Zod ignore silencieusement les clés inconnues d'un objet — **le schéma ne les attrape pas**,
il faut les chercher à l'œil.

**État des portes après ces 4 secteurs :** `[uniqueness] 30 pages · 0 errors`,
`[link-audit] 36 pages · 0 errors`, `[seo-audit] 36 pages · 0 errors · 0 warnings`.

**Pour reprendre :** relancer des sous-agents sur `docs/BRIEF-HUB-SECTEUR.md`, par lots de 5-6
secteurs groupés géographiquement (les secteurs voisins se ressemblent le plus, donc il faut
qu'un même agent les voie côte à côte — §6 du brief).

**Livré avant la coupure**

- `src/pages/secteurs/[sector].astro` + `src/pages/en/areas/[sector].astro` — routes validées.
- `src/pages/territoire.astro` + `src/pages/en/service-area.astro` — l'index géographique.
- `docs/BRIEF-HUB-SECTEUR.md`.
- Pilote `beauport` FR + EN validé **avant** tout déploiement : `[uniqueness] 24 pages · 0 errors`,
  la règle des ≥ 5 faits locaux passe.
- Liens depuis les deux accueils vers l'index géographique et l'index de service.

**`localTermsEn` : le premier usage réel, et la façon de ne pas tricher avec la porte.**
`saint-sauveur` a une liste `localTerms` faite surtout de descripteurs génériques
(`maison ouvrière`, `solage perméable`, `lot étroit`) plutôt que de noms propres. Un agent a
atteint le seuil de 5 termes sur la page **anglaise** en y insérant ces expressions françaises
glosées — le compteur passait, l'intention non. `uniqueness-check.mjs` prévoit exactement ce cas
et sa solution : un champ **`localTermsEn`** dans l'entrée de `cities.json`, qui déclare la
preuve anglaise équivalente. Ajouté pour `saint-sauveur`, prose anglaise renaturalisée, 7 termes
reconnus. **Ce n'est pas un assouplissement** : le seuil et le compte sont inchangés. À rouvrir
pour tout autre secteur dont la jumelle EN peine — ne jamais insérer de français dans une page
anglaise pour satisfaire un compteur.

**Deux découvertes qui auraient coûté cher**

**1. `publicReferences` de `cities.json` était encore infecté par le site antiparasitaire.**
39 secteurs sur 51 portaient « MELCCFP — certificat CD5 requis pour l'application de pesticides ».
`CLAUDE.md` dit explicitement que le CD5 n'a rien à faire ici. Le champ n'était dans **aucune**
liste de nettoyage — ni celle de la phase 2, ni les pièges connus. Les 39 sont retirées, aucun
secteur ne se retrouve sans référence. **Leçon : après une reprise de données, greper les termes
de l'ancienne verticale sur TOUT le fichier, pas seulement sur les champs qu'on prévoit de
réécrire.**

**2. `/secteurs/` et `/territoire/` se concurrençaient sur la même intention.**
`routes.ts` expose un `PageRef` `sectorIndex` qui résout vers `/secteurs/` (racine de section),
alors que `KEYWORD-MAP.md` et `SEO-PLAN.md` désignent `/territoire/` comme l'index géographique.
Le fil d'Ariane des hubs de secteur pointait donc vers `/secteurs/` — **une URL sans page et sans
ligne dans la KEYWORD-MAP**. Corrigé : les fils d'Ariane pointent vers `serviceArea`
(`/territoire/`, `/en/service-area/`), et `/secteurs/` reste un préfixe d'URL, sans page.
**Ne pas créer de page à `/secteurs/`** : ce serait deux pages pour « secteurs desservis ».

---

## Découvertes de cette session — à ne pas redécouvrir

1. **`src/data/cities.json` n'est réutilisable qu'à moitié.** Les champs géographiques
   (`tier`, `type`, `name`, `municipality`, `population`, `neighbourhoods`, `localTerms`,
   `neighbours`) transfèrent tels quels. Mais **`pestPressure`, `whyHere` et la partie
   « pression » de `housingStock` sont écrits pour la lutte antiparasitaire** : le `whyHere` de
   Beauport parle de coccinelles asiatiques. Ils doivent être remplacés en phase 2 par
   `foundationPressure` + un `whyHere` réécrit. `publicReferences` cite aussi le certificat CD5
   (pesticides) — à purger.
   Répartition : **strate A = 7** (6 arrondissements + Lévis), **B = 18**, **C = 26**. Total 51.
2. **`sectorFromUrl()` prend le dernier segment de l'URL.** D'où `/fondation/{service}/{secteur}/`
   et non l'inverse. Inverser ferait passer la porte au vert sans rien vérifier.
3. **Les familles héritées dans `scripts/uniqueness-check.mjs` (`pest-*`, `wildlife-*`,
   `commercial-*`, `matrix-*` en `/extermination/`) ne correspondent à aucune URL de ce site.**
   Elles doivent être **retirées et remplacées** en phase 1, pas laissées « au cas où » : une
   famille sans membre est ignorée silencieusement et donne l'illusion d'une couverture.
4. **Correction factuelle au brief : le protocole pyrite est CTQ-M200, pas IRSST.** CTQ-M200
   est le protocole du Comité technique québécois, qui établit l'IPPG sur bâtiment existant.
   L'IRSST est l'institut en santé et sécurité du travail. Écrire « protocole de l'IRSST » sur
   une page pyrite serait une erreur vérifiable et citable contre nous.
5. **La pyrite n'est pas un sujet de volume sur la CMQ.** Le gonflement du remblai est
   massivement un problème de la Montérégie et de la couronne de Montréal. Ici c'est un sujet de
   **transaction immobilière**. → page informative, **aucune page pyrite × secteur**.
   Et la **pyrrhotite** (Mauricie, dans le béton et non dans le remblai) n'a rien à faire ici.
6. **Le vrai moat régional est l'ocre ferreuse + la norme BNQ 3661-500** (drains de fondation,
   parois lisses, cheminées d'accès). Presque personne ne relie cause → norme → ouvrage →
   entretien. C'est le sujet le moins bien couvert de la niche.
7. **Le concurrent structurellement identique est faible.** `drainquebec.com/drain-francais-sainte-foy/`
   fait 350-400 mots, ne mentionne Sainte-Foy que dans le titre et la première ligne, n'a aucun
   maillage entre ses pages-secteurs et ne cite aucune norme. Il échouerait à nos trois portes.
   **Notre avantage n'est pas d'écrire mieux, c'est d'écrire une chose différente par secteur.**
8. **La matrice géo est limitée à 2 services** (`drain-francais`, `fissure-de-fondation`). Les
   9 autres ne portent pas assez d'intention `service + lieu` pour survivre à
   `MAX_SIMILARITY 0.35` entre 25 sœurs.

---

## Questions ouvertes

| # | Question | Bloque |
|---|---|---|
| 1 | ~~**Le domaine.**~~ — **fermée le 2026-08-11 : `solagecapitale.ca`.** Build de production vert, route posée dans `wrangler.jsonc`. | — |
| 2 | ~~Palette et typographie~~ — **fermée** : « ardoise et rouille » + Bitter/Public Sans, voir `DESIGN.md`. | — |
| 3 | ~~Nom du site~~ — **fermée** : **Solage Capitale**. | — |
| 4 | ~~Sous-catégories RBQ~~ — **fermée**, vérifiées à la source : 2.5, 2.6, 3.2, 7, 4.2. Voir `COMPETITION.md` §7. | — |
| 5 | **Le programme d'aide pyrite (SHQ) est-il encore actif en 2026 ?** | Phase 2 |
| 6 | **Les associations sol → secteur de SEO-PLAN §2.1 sont une hypothèse**, pas un fait publié. À confirmer contre les cartes de dépôts meubles / données municipales. Sans confirmation : écrire l'époque de construction (vérifiable), pas le sol. | Phase 2 |
| 7 | **Numéro de suivi d'appel** : en prend-on un dès le lancement, ou formulaire seul ? | Phase 7 |
| 8 | ~~Photos fournies~~ — **fermée** : aucune. Tout vient d'archives libres, stratégie dans `DESIGN.md` §4. | — |

---

## Risque principal du projet

Si les sources réglementaires (§ questions 4-6) ne se confirment pas, le moat rétrécit et le
site redevient un concurrent ordinaire de la couche C. **La phase 2 est une phase de
vérification, pas de rédaction.** Un chiffre sans source primaire vaut `null` et la page écrit
« aucune fourchette publiée » (PLAYBOOK §2, honest nulls).

Et si `foundationPressure` ne se laisse pas remplir honnêtement, la matrice n'a pas lieu d'être
et on tombe à ~172 pages au lieu de 232. C'est un résultat acceptable, pas un échec.

---

## Session 5 — 11 août 2026 · Le domaine, les 4 dernières pages, et un défaut de CSP

**LE CRITÈRE DE FIN EST ATTEINT.** La NOTE `link-audit` « planned page(s) linked but not
built » **est passée de 4 à 0** — la ligne ne s'affiche plus du tout. Il n'y a plus un seul
lien du site qui pointe vers une page non construite.

```
SITE_URL=https://solagecapitale.ca npm run build
  astro check   : 0 erreur
  188 pages construites
  [uniqueness] 156 pages · 0 erreur · 0 avertissement
  [link-audit] 188 pages · 0 erreur · 14 avertissements   ← plus de NOTE
  [seo-audit]  188 pages · 0 erreur · 0 avertissement
  PENDING_IMAGES=strict npm run audit : vert
  find dist -name '*.js' | wc -l : 0
  grep -rl 'PLACEHOLDER_' dist/ | wc -l : 0
  npx wrangler deploy --dry-run : 396 fichiers, binding ASSETS, Worker 8,30 Ko
```

182 → 188 pages : les 4 attendues (`/contact/`, `/soumission/` et leurs jumelles) **plus 2 que
personne n'avait vues manquer** (voir plus bas).

---

### 1. Le domaine : `solagecapitale.ca`

Acheté le 2026-08-11. Le build de production passe du premier coup — c'est le résultat direct
de la discipline `SITE_URL` : **aucun fichier de contenu n'a eu à être touché.**

`wrangler.jsonc` gagne sa route, en `custom_domain` sur l'apex seul. **`www` n'est
volontairement pas déclaré** : deux domaines personnalisés serviraient les 188 pages sous deux
hôtes. `www` se règle par une Redirect Rule Cloudflare vers l'apex ; `CANONICAL_HOSTS` dans
`worker/lead-form.ts` accepte déjà l'origine `www` au cas où.

**Nettoyage au passage — `src/data/site.json` portait deux valeurs mortes.** `domain` et
`formEndpoint` valaient `PLACEHOLDER_*` et **aucun module n'importait ce fichier** : les deux
étaient inertes, et `domain` était surtout un second endroit où un domaine pouvait s'écrire en
dur, ce que `CLAUDE.md` interdit. Retirés. Le domaine vit dans `SITE_URL`, l'endpoint dans la
nouvelle constante `LEAD_ENDPOINT`. Les champs de marqueurs de confiance (`phone`, `address`,
`rbqLicence`) restent : `HANDOFF-TENANT.md` §2.1 s'appuie dessus.

### 2. `/contact/` — le responsable est nommé

**Xavier Breton · contact@solagecapitale.ca**, dans la constante `PRIVACY_OFFICER` de
`src/lib/constants.ts`. Les deux jumelles la lisent, donc elles ne peuvent pas diverger, et
**au handoff on ne change qu'un seul endroit** (`HANDOFF-TENANT.md` §4.1).

La règle dure de §4.1 est donc satisfaite : le formulaire pouvait être écrit.

**La page a été reclassée de `conversion` à `légal` dans `KEYWORD-MAP.md`**, et c'est le point
important. Un « contact » appelle naturellement un formulaire et un appel à l'action ; ici ce
serait une erreur. Elle existe parce que `/confidentialite/` promet un droit d'accès, de
rectification, de retrait du consentement et de suppression, et qu'une promesse pareille exige
un responsable identifiable. Elle porte donc le nom, le courriel, comment formuler une demande
pour qu'elle **puisse aboutir** (l'adresse utilisée + la date approximative — sans ça il n'y a
rien à retrouver, le site ne créant aucun compte), la CAI comme recours, et trois choses
qu'elle **n'est pas** : pas une ligne d'urgence, pas un diagnostic par courriel (règle 1bis),
pas l'entrepreneur.

### 3. `/soumission/` et `/en/quote/` — le formulaire

Le contrat des champs de `FIELD_LABELS` est respecté à la lettre, **vérifié sur le HTML rendu
et non sur l'intention** : `name`, `email`, `phone`, `sector`, `service`, `building`,
`urgency`, `message`, `website` (pot de miel), `locale`, plus `page_url` et `photo`.

- `action="/api/soumission/"`, **barre oblique finale**, dérivée de `LEAD_ENDPOINT`.
- Les listes de secteurs et d'interventions viennent de `getCollection`, jamais du JSON brut :
  on n'offre pas dans un menu un secteur dont la page n'existe pas.
- « Intervention » est **facultatif et par défaut « Je ne sais pas encore »**. Obliger un
  visiteur à qualifier lui-même son problème, c'est lui demander le diagnostic qu'il vient
  chercher.
- Aucun JS (règle 7) — la CSP interdit le script tout court, donc un formulaire qui en aurait
  besoin ne fonctionnerait pas.
- Vérifié en Chrome sans tête sous la vraie CSP : pot de miel hors écran et `tabindex="-1"`,
  aucun champ sans `<label>`, champs à 16 px (sous 16 px, iOS zoome au focus et décale la
  page), styles appliqués.

**`LEAD_ENDPOINT` est nouveau et vaut la peine :** le chemin était écrit deux fois dans
`worker/index.ts` et l'aurait été une troisième fois dans chaque formulaire. Une coquille dans
n'importe laquelle donne un 404 sur le POST — l'échec que `worker/index.ts` existe déjà pour
empêcher. Les deux orthographes restent acceptées côté Worker, dérivées de la même constante.

### 4. ⚠ Les deux pages que personne n'avait vues manquer : `/merci/` et `/en/thank-you/`

**`worker/lead-form.ts` renvoie un 303 vers `/merci/` depuis toujours, et cette URL n'était
construite par aucun fichier.** Une soumission qui partait correctement, dont le courriel
arrivait chez l'entrepreneur, **se terminait sur un 404.** Le visiteur n'avait aucun moyen de
savoir si sa demande avait été reçue — et le réflexe naturel est de la renvoyer, ou de partir.

**Aucune porte ne pouvait l'attraper.** `link-audit` suit les liens du HTML ; la cible d'une
redirection émise par le Worker n'est pas un lien. C'est la même famille d'échec que la
collision `generateId`, que les familles absentes de `FAMILIES` et que le `<set:html>` : ça se
déploie proprement et **ça ne se voit qu'en le faisant pour de vrai**.

Les deux pages existent, en `noindex`. Elles s'excluent donc d'elles-mêmes de `sitemap.xml` et
de `llms.txt` (dérivés des canoniques), et elles sont **explicitement retirées de
`/plan-du-site/`** : les lister en ferait des pages atteignables par curiosité, qui
annonceraient à quelqu'un n'ayant rien envoyé que sa demande est partie. Ajoutées à
`STATIC_PAGES` sous la clé `thankYou`, donc `LABELS` des deux plans du site a échoué au
type-check tant qu'elles n'y étaient pas — la contrainte a fait son travail.

### 5. ⚠ LE DÉFAUT LE PLUS GRAVE DE LA SESSION : la CSP annulait la mise en page des 188 pages

**Trouvé en préparant le déploiement, mesuré avant d'y toucher.**

Les 34 gabarits portaient `<section class="contenant" style="padding-block:3rem">`. Or
`public/_headers` pose `style-src 'self'` **sans `'unsafe-inline'`**, et un attribut `style`
relève de `style-src-attr`, qui retombe sur `style-src`. Chrome sans tête, la vraie CSP posée
par un serveur local, les vraies pages de `dist/` :

```
attr: "padding-block:3rem"  ->  paddingTop: 0px, paddingBottom: 0px
error: Applying inline style violates the following Content Security Policy
       directive 'style-src 'self''. The action has been blocked.
```

**Les 188 pages auraient perdu leur air vertical à l'instant où `_headers` est réellement
appliqué** — c'est-à-dire au moment exact où la vérification §4b de `DEPLOY.md` annonce un
succès. Le contenu collé sous l'en-tête, en production, sur tout le site.

Deux choses à retenir, et la seconde est la plus désagréable :

1. **La note de la session 4 était fausse.** Elle affirmait « aucune ressource bloquée, aucune
   violation console » après un test en Chrome headless. La violation était là ; le test ne la
   regardait pas au bon endroit.
2. **C'est encore un défaut d'apparence, et aucune porte ne mesure l'apparence.** `uniqueness`,
   `link-audit` et `seo-audit` lisent le texte, les liens et les métadonnées. La session 3b
   l'avait déjà écrit après le mur de texte ; ça se confirme une deuxième fois, sur un défaut
   qui ne se serait vu qu'après la mise en ligne.

**Corrigé** : deux classes dans `global.css` (`.bloc-page`, `.bloc-page-ample`), les 34
gabarits convertis, **zéro attribut `style=` dans `dist/`** (vérifié). Re-mesuré sous la même
CSP : `paddingTop: 48px`, plus aucune violation.

⚠ **Ne jamais réintroduire d'attribut `style=` dans un gabarit.** Un `<style>` de composant
Astro est extrait dans une feuille externe et passe la CSP ; un attribut `style`, non. La page
d'erreur de `worker/lead-form.ts` garde le sien sans risque : elle est servie **par le
Worker**, donc `_headers` ne s'y applique pas.

### 6. Ce qui reste, et qui n'est pas de mon ressort

- **Mailgun n'est pas configuré.** Tant que `MAILGUN_API_KEY`, `MAILGUN_DOMAIN` et
  `LEAD_TO_EMAIL` ne sont pas posées sur le Worker, **toute soumission tombe sur la page
  d'erreur** de `lead-form.ts`. Et si `LEAD_TO_EMAIL` est vide, cette page n'offre même pas de
  repli par courriel — le code omet le paragraphe plutôt que d'afficher un `mailto:` vide,
  ce qui est le bon comportement mais laisse le visiteur sans issue. **Poser au minimum
  `LEAD_TO_EMAIL=contact@solagecapitale.ca` en même temps que le reste.** Les deux pages de
  formulaire affichent en clair l'adresse de repli, donc le visiteur a une voie même dans ce cas.
- **Le déploiement lui-même**, `npx wrangler deploy`, exige une session Cloudflare
  authentifiée. Fait par le propriétaire.
- **Pas de favicon.** Le site n'en déclare aucun et aucun fichier n'existe : le navigateur
  sonde `/favicon.ico` et prend un 404 sur chaque page. Sans effet sur les portes, visible
  dans l'onglet.

### 7. Rappels de vérification post-déploiement

Les 5 contrôles de `DEPLOY.md` §4 restent à faire **contre le domaine réel**. Le plus
important, et le seul qui décide d'un repli :

```bash
curl -sI https://solagecapitale.ca/ | grep -i content-security
```

Si l'en-tête est absent, `_headers` n'est pas lu et **aucune des 188 pages n'a de CSP** ; le
repli est `run_worker_first` dans `wrangler.jsonc`. Corollaire nouveau de cette session : tant
que `_headers` n'est pas appliqué, le défaut d'attribut `style` n'aurait de toute façon rien
cassé — c'est précisément pour ça qu'il pouvait dormir aussi longtemps.

---

## Session 6 — 11 août 2026 · Favicon, et le blogue rattrapé par sa règle de sources

```
SITE_URL=https://solagecapitale.ca npm run build
  astro check : 0 erreur · 190 pages
  [uniqueness] 158 pages · 0 erreur · 0 avertissement      ← 156 → 158
  [link-audit] 190 pages · 0 erreur · 14 avertissements    ← toujours pas de NOTE
  [seo-audit]  190 pages · 0 erreur · 0 avertissement
  0 JS · 0 attribut style · 0 PLACEHOLDER_
```

**`[uniqueness]` passe de 156 à 158**, et c'est le chiffre qui prouve que la famille blogue est
réellement contrôlée plutôt que sautée en silence (PLAYBOOK §0.1).

### Le favicon — il n'y en avait aucun

Chaque page prenait un 404 sur la sonde `/favicon.ico` du navigateur. Aucune porte ne regarde
l'onglet, donc rien ne le signalait.

**Livré**, dessiné depuis la palette de `DESIGN.md` : une **coupe de fondation** — semelle
rouille, mur crème, sol ardoise. C'est le même vocabulaire visuel que `EraDiagram.astro`, qui
sert de hero aux 49 hubs de secteur : la marque et le contenu disent la même chose. Trois formes,
aucun détail sous 6 px, aucun texte — des initiales seraient illisibles à 16 px.

| Fichier | Rôle |
|---|---|
| `favicon.ico` (16/32/48, PNG embarqué, 1,0 Ko) | ce que **Google lit** pour l'icône du résultat de recherche, et le seul chemin que sondent les vieux navigateurs même sans balise |
| `favicon.svg` (1,1 Ko) | net à toutes les tailles ; les navigateurs modernes le préfèrent quand les deux sont déclarés |
| `apple-touch-icon.png` (180×180, 827 o) | iOS. **Bords francs** : le système arrondit lui-même, un coin déjà arrondi se verrait deux fois |

Plus `theme-color` en deux déclarations, clair et sombre — sans les deux, une des combinaisons
donne une barre d'adresse qui jure avec la page. Généré avec `sharp`, déjà présent (règle 7 : pas
de dépendance ajoutée).

### Le blogue : 1 article écrit, 7 bloqués — et les blocages sont le résultat

**L'article livré : `permis-excavation-pres-fondation-quebec` / `foundation-drain-connection-rules-quebec-city`.**

Il est entièrement sourcé sur le portail des règlements de la Ville de Québec, cité article par
article, et **il corrige une affirmation que la niche répète** :

- **R.V.Q. 102, art. 54(9)** — le certificat d'autorisation vise les travaux de déblai, remblai ou
  excavation **« sur la rive d'un cours d'eau ou d'un lac »**. Le déclencheur n'est pas
  l'excavation, c'est la proximité d'une rive.
- **R.V.Q. 102, art. 57** — exemption sous **100 mètres cubes**.
- → **Une excavation de fondation ordinaire à Québec ne déclenche généralement aucun certificat.**

Et surtout, le vrai gisement, que personne n'écrit — **R.V.Q. 2978** :

- **art. 33-34** : un drain de fondation ne se raccorde **jamais** au sanitaire ;
- **art. 36** : sur du neuf, raccordement **à l'intérieur**, siphon à garde d'eau profonde, regard
  de nettoyage **≥ 100 mm**, clapet en aval sur le collecteur pluvial ;
- **art. 36** : sur de l'existant raccordé dehors, il peut le rester, mais exige **une cheminée
  d'accès de 100 mm près de la fondation** ;
- **art. 37-38** : sans gravité → bassin + pompage à l'intérieur ; sans collecteur → ouvrage de
  gestion des eaux pluviales ou fossé.

**Pourquoi ça vaut mieux qu'un article sur le permis :** sans cheminée d'accès, un drain colmaté
ne peut être ni inspecté à la caméra ni nettoyé — il faut réexcaver. Le règlement municipal
rejoint donc exactement l'argument de l'article BNQ sur les accès d'entretien. Deux piliers du
moat qui se répondent.

**Le slug EN mène avec le raccordement, pas avec le permis.** « Excavation permit » en anglais
attire des requêtes commerciales et municipales sans rapport. Règle 6 : on traduit l'argument,
pas les phrases. La ligne EN a été ajoutée à `KEYWORD-MAP.md` **avant** le fichier.

#### `eau-sous-sol-fonte-des-neiges` — reclassé, pas écrit

La ligne portait l'intention **#1**, déjà tenue par `/urgence/`. Elle est passée à **#7 (mécanisme
régional)** dans le registre, ce que la garde anti-cannibalisation exigeait **avant** toute
rédaction. L'article est maintenant écrivable ; il ne l'est pas encore.

#### Les 7 restants, et sur quoi chacun bute exactement

| Article | Blocage réel |
|---|---|
| `vice-cache-fondation-quebec` | **LégisQuébec répond toujours 403** — revérifié cette session. Le fond est le Code civil ; on ne publie pas un texte de loi de mémoire. Inchangé depuis la session 4. |
| `argile-mer-de-champlain-fondation` | **Les deux sources géologiques gouvernementales sont des PDF scannés** (DP 249, MB 2014-03) : image, pas de texte extractible. Impossible de citer un document qu'on n'a pas lu. La RBQ documente bien le **comportement** des sols argileux et dit de faire établir la capacité portante par un **ingénieur géotechnicien** — ce qui appuie la mise en garde, pas la géologie régionale que le titre promet. |
| `inspection-fondation-avant-achat` | **OACIQ répond 403.** C'était la bonne source primaire, propre au Québec. |
| `assurance-habitation-infiltration-eau` | **L'Autorité des marchés financiers répond 403.** Même problème. |
| `gel-degel-fondation-region-quebec` | Profondeur hors gel : toujours pas de chiffre à une source primaire ouverte, comme en session 2 (`profondeur-de-gel` reste `unverified`). |
| `eau-sous-sol-fonte-des-neiges` | Reclassé #7, écrivable, pas écrit. |
| `fissure-grave-ou-benigne` | Pas de blocage de source, mais **c'est l'article le plus exposé à la règle 1bis du site** : « ma fissure est-elle grave » appelle exactement l'auto-diagnostic qu'on refuse. Écrivable seulement en disant *pourquoi la largeur seule ne dit rien* et *quoi documenter*, jamais en donnant une grille de lecture. |

**Quatre sources primaires sur cinq ont répondu 403 à une requête automatisée** (LégisQuébec,
OACIQ, AMF, plus la version FR des pages RBQ en 404). Le portail des règlements de la Ville de
Québec, lui, est ouvert — d'où le seul article écrit. **Ce n'est pas une limite de rédaction,
c'est une limite d'accès**, et le remède est écrit depuis la session 4 : ouvrir la page à la main
et coller le texte. Une session avec ces textes sous la main en écrit plusieurs d'affilée.

**Décision assumée : 1 article vrai plutôt que 7 approximatifs.** C'est la même règle qui a bloqué
`ctq-m200`, `profondeur-de-gel` et `vice-cache` avant — et c'est elle qui fait la valeur du
domaine. Le relâcher ici pour remplir un compteur reviendrait à baisser un seuil pour faire passer
une page (règle 3).

### Ce que cette session n'a PAS réglé, et qui est le vrai sujet visuel

Le propriétaire a demandé pourquoi les pages n'ont pas de photos. **Inventaire réel :** le dépôt
contient **2 photographies** (`beauport`, `ile-dorleans`), donc 4 pages portent un `<img>` ;
98 pages portent le schéma SVG `EraDiagram` ; **88 pages n'ont aucun visuel** — dont les
2 accueils, les 11 hubs de service ×2 et les 13 pages matrice ×2.

⚠ **`PENDING_IMAGES=strict` est vert et ne dit PAS que le site a des images.** Le contrôle du
hero est enfermé dans `if (family.name.startsWith('sector'))`
(`uniqueness-check.mjs`) : il ne regarde que les hubs de secteur, et le commentaire assume que les
pages matrice n'en portent pas. **Le vert signifie « chaque hub de secteur a un hero distinct »**,
rien de plus. Ma formulation « porte image : verte » en session 5 était trop généreuse — c'est la
lecture qui était fausse, pas le script.

Le propriétaire ajoutera des images au dépôt. **Le mécanisme est déjà là** : déposer le fichier
dans `src/assets/img/`, remplir `heroImage` + `heroAlt` dans les **deux** langues, passer
`imagePending` à `null`, et ajouter la ligne de licence dans `IMAGE-CREDITS.md`. Trois rappels qui
coûteraient une session s'ils étaient redécouverts :

1. **`heroImage` sans `heroAlt` dans une langue LÈVE** au lieu de retomber sur le schéma
   (`SectorHero.astro`) — c'est voulu, un repli silencieux fait partir une page sans son image.
2. **Deux secteurs ne peuvent pas partager le même `heroAlt`** : c'est une erreur dure. Et un
   `alt` qui nomme un lieu où la photo n'a pas été prise viole la règle 1. C'est ce double mur qui
   a fait choisir le schéma en session 4.
3. **Licences DP ou CC0 uniquement.** Une CC BY-SA imposerait le partage à l'identique **au
   locataire**, qui n'a rien demandé (`HANDOFF-TENANT.md` §1).

Les hubs de service, eux, n'ont **aucune** de ces contraintes : une photo de *sujet* (une fissure,
une tranchée, une pompe) ne prétend rien sur un lieu, et la règle d'unicité des `alt` ne s'applique
pas à cette famille. **C'est là que des photos ajouteraient le plus, pour le moins de risque.**

---

## Session 6b — 11 août 2026 · Le paquet de 49 photos : 4 branchées, 45 écartées

Le propriétaire a déposé `photos-secteurs-quebec/` — 49 photos exportées du dépôt
`exterminateur-qc`, avec `CREDITS.md`, `alt-text.json` et un `LISEZ-MOI.md` sérieux. Le paquet
est bien fait. **Il n'est pas utilisable tel quel, et son propre LISEZ-MOI dit pourquoi :
« Le nom de fichier ne prouve rien. Seul le contenu de l'image compte. »**

`npm run build` : **190 pages · 0 erreur** sur les trois portes. `PENDING_IMAGES=strict` : vert.
Pages portant un `<img>` : **4 → 12** (6 secteurs × 2 langues).

### Les 4 branchées, vérifiées à l'œil une par une

| Secteur | Ce que montre réellement la photo |
|---|---|
| `charlesbourg` | Maison québécoise blanche à deux lucarnes, toit chargé de neige, bancs de neige contre le mur de fondation |
| `la-cite-limoilou` | Immeuble de brique à balcons, entrée surélevée au-dessus du niveau de la rue |
| `limoilou` | Rue résidentielle sous la neige, duplex de brique à escaliers extérieurs |
| `les-rivieres` | Rue de bungalows d'après-guerre, bancs de neige au pied des façades |

Toutes **CC0, auteur Wilfredor**, donc conformes à la contrainte de licence qui protège le
locataire. Crédits ajoutés à `IMAGE-CREDITS.md`.

**Les `alt` fournis dans `alt-text.json` n'ont pas été repris.** Ils sont tous du gabarit —
« Vue du secteur X, région de Québec » — ce qui ne décrit rien pour un lecteur d'écran, n'apporte
rien en recherche, et ne fait que passer la porte d'unicité par le seul changement de nom. Les
`alt` ont été **réécrits depuis ce que la photo montre**, et chacun ramène au sujet du site : la
neige contre le mur de fondation, l'entrée surélevée, l'escalier extérieur.

### Pourquoi 45 sont écartées — trois motifs distincts

**1. Licence — 20 fichiers.** CC BY ou CC BY-SA. `HANDOFF-TENANT.md` §1 l'interdit
nommément : *« une CC BY-SA aurait imposé le partage à l'identique au locataire, qui n'a rien
demandé. Ne pas desserrer cette contrainte en ajoutant des images plus tard. »* Ce n'est pas un
défaut des fichiers — c'est une règle du projet, et c'est une décision du propriétaire de la
lever, pas la mienne. Concernés, entre autres : `ile-dorleans` (une CC BY-SA, alors que le dépôt
porte déjà une version CC0 du même secteur), `wendake`, `saint-sauveur`, `vanier`,
`stoneham-et-tewkesbury`, `charny`.

**2. Contenu faux — 3 fichiers vérifiés, et c'est le résultat qui compte.**

| Fichier | Ce que c'est réellement |
|---|---|
| `secteur-giffard.jpg` | **Un tableau encadré du peintre britannique Giffard Hocart Lenfestey.** Un paysage à l'huile dans un cadre doré. Aucun rapport avec le quartier Giffard. C'est exactement le piège « Vanier Cup » que le LISEZ-MOI décrit — et il a traversé leur propre export. |
| `secteur-lac-saint-charles.jpg` | **Un livre ancien ouvert**, page 46 de *Salmon and Trout Rivers*, avec une vignette Notman « Lake St. Charles, near Quebec ». |
| `secteur-beaupre.jpg` | **L'intérieur de la basilique de Sainte-Anne-de-Beaupré** — et donc la mauvaise municipalité : Beaupré et Sainte-Anne-de-Beaupré sont deux villes distinctes, toutes deux dans nos 51 secteurs. |

**3. Hors sujet — le reste.** Le paquet penche massivement vers le monument et l'archive :
églises (`saint-roch`, `saint-romuald`, `saint-nicolas`, `saint-jean-chrysostome`), remparts
(`montcalm`), lacs (`lac-beauport`, `lac-delage`), panneau routier (`boischatel`), photo
d'archives d'anse à bois (`sillery`). Aucune ne dit quoi que ce soit d'un parc bâti résidentiel,
et plusieurs ne peuvent pas porter un `alt` honnête qui serve la page.

**17 fichiers DP/CC0 n'ont pas encore été regardés** — l'inspection visuelle est le coût réel de
ce travail, et elle ne se délègue pas à un nom de fichier. Liste dans le paquet ; verdicts à
compléter secteur par secteur.

### Ce que ça confirme, et qui vaut pour la suite

La session 4 avait conclu que Commons ne donne presque rien de résidentiel sur cette région. **Ce
paquet, constitué indépendamment, arrive au même résultat** — 4 photos de bâti courant sur
49 fichiers. Ce n'est pas un défaut de méthode : c'est ce que contient Commons pour la CMQ.

**Le schéma `EraDiagram` reste donc le bon défaut pour les 45 secteurs restants**, et le site est
maintenant dans un état mixte assumé : 6 secteurs portent une photo, 45 portent le schéma.

⚠ **`photos-secteurs-quebec/` est dans le dépôt et n'a pas à y rester.** ~30 Mo de source qui ne
servent pas au build. À déplacer hors du dépôt ou à mettre dans `.gitignore` avant le premier
commit — mais **garder `CREDITS.md`** quelque part : c'est lui qui rend les fichiers publiables.

---

## Session 6c — 11 août 2026 · Le maillage du blogue, et l'accueil réécrit

Consigne du propriétaire : « fais ce que tu crois qui est le mieux pour le SEO ». Ce n'était pas
les images — c'était le maillage interne et l'accueil. Les deux se mesuraient, les deux étaient
invisibles aux portes.

```
[uniqueness] 158 pages · 0 erreur · 0 avertissement
[link-audit] 190 pages · 0 erreur · 12 avertissements   ← 14 → 12
[seo-audit]  190 pages · 0 erreur · 0 avertissement
```

### 1. Les 8 pages de blogue étaient des culs-de-sac — mesuré, pas supposé

Un article n'avait qu'**UN seul lien éditorial sortant** : `/soumission/`. (Un premier comptage
en annonçait 7 — c'étaient les `href` des CSS, polices et favicons. **Compter les `href` sans
distinguer les assets donne un chiffre faux et rassurant.**)

Conséquence : les 4 articles, qui portent le moat réglementaire, ne transmettaient rien aux pages
de tête, et ne recevaient eux-mêmes que le lien de l'index et du pied de page.

**Aucune porte ne pouvait le voir.** `link-audit` n'applique `MIN_OUTBOUND` et `MIN_INBOUND`
qu'aux pages « money » (`/fondation/`, `/secteurs/`) — le blogue n'en est pas une. Même angle
mort que la couche typographique (session 3b) et que la CSP (session 5) : la porte est verte
parce que la règle ne s'applique pas, pas parce que la page va bien.

**Livré : `src/lib/service-articles.ts`**, une carte unique lue **dans les deux sens** —
hub → article et article → hub. Une seule source, sinon les deux directions divergent au premier
ajout. Les clés sont des `translationKey`, jamais des slugs, parce que les slugs diffèrent d'une
langue à l'autre.

⚠ **Chaque paire est éditoriale, pas automatique.** Lier les 4 articles depuis les 11 hubs
donnerait 44 liens et transformerait un vrai signal topique en mobilier — exactement ce que la
grille « sujets liés » des hubs de secteur avait produit avant d'être dérivée des données.

**Effet mesuré : les 2 avertissements `pyrite` sont tombés.** Le hub passe de 4 à 5 liens
contextuels sortants grâce au lien vers l'article GCR — et ce lien est **honnête** : le plan de
garantie couvre les vices du sol pendant 5 ans, ce qui vise précisément le gonflement d'un
remblai de pyrite sur une maison récente. La session 3 avait refusé de forcer un cinquième lien
et écrit qu'il faudrait attendre une raison réelle ; c'est celle-là. **Aucun seuil n'a bougé.**

C'était le dernier avertissement non-ancre du site. Les 12 restants sont tous des ancres, et
l'arbitrage est documenté depuis la session 4 : la concentration est un fait régional, pas un
défaut à maquiller.

### 2. L'accueil faisait 115 mots

| | Avant | Après |
|---|---|---|
| Mots rendus, FR | **115** | **626** |
| Mots rendus, EN | 106 | 598 |
| Liens internes éditoriaux | **2** | **20** |
| Image | aucune | photo CC0 de la région |

Un hub de service en fait 1 191. **L'accueil était la page la plus faible du site sur la requête
la plus concurrentielle du domaine** — « réparation de fondation Québec » — et il ne transmettait
presque rien, alors que c'est la page qui reçoit le plus d'autorité. Là encore : `link-audit`
n'impose ses seuils qu'aux pages money, et l'accueil n'en est pas une.

Ce que la page porte maintenant :

- **six portes d'entrée par symptôme**, pas par ordre alphabétique — l'infiltration et la fissure
  d'abord (ce que le visiteur observe), l'ouvrage ensuite, puis les deux sujets régionaux ;
- **le mécanisme régional** : parc bâti antérieur au drain français, drains de tuile d'argile
  1950-1970 en fin de vie, gel-dégel, ocre ferreuse. C'est ce qui justifie 51 pages de secteur
  plutôt qu'un texte unique, et ça se dit enfin sur l'accueil ;
- une grille de **6 secteurs** + le territoire, une grille des **4 articles**, et l'énoncé de mise
  en relation.

**Règle 1 tenue :** aucun chiffre d'entreprise, aucune ancienneté, aucun avis. Tout ce qui est
avancé sur le parc bâti vient de `cities.json`. **Règle 1bis tenue :** la page nomme des
symptômes pour orienter et dit explicitement qu'elle n'expliquera jamais comment intervenir
soi-même.

L'image est `limoilou.jpg` (CC0, Wilfredor) et son `alt` **nomme le lieu réel de la prise de
vue** — c'est ce qui la rend honnête. Elle n'est jamais présentée comme un chantier à nous.

**Vérifié au rendu**, pas seulement au build : capture en Chrome sans tête sous la vraie CSP.
Structure lisible, filets de section, photo, grilles, bouton d'appel à l'action. Aucune porte ne
mesure l'apparence — c'est la troisième fois que ce projet le paie, donc la capture fait
maintenant partie du travail.

### Ce qui reste vrai après cette session

Les images ne sont **pas** le levier SEO de ce site, et le propriétaire avait raison de sentir un
problème sur l'accueil sans que ce soit un problème d'image. Le classement se joue sur du contenu
unique par secteur, des sources primaires et un maillage qui transmet — les trois ont avancé ici.
Une photo améliore la confiance et le partage, pas la position.

⚠ **`og:image` reste absent des 190 pages.** Maintenant que l'accueil porte une image, c'est le
prochain gain de distribution : un lien partagé donne encore une carte sans visuel.

---

## Session 6d — 11 août 2026 · ⚠ LE WORKER NE DÉMARRAIT PAS

**Trouvé en lançant `npx wrangler dev` pour la première fois du projet**, pendant que le
propriétaire configurait Mailgun. Le Worker levait à l'exécution :

```
✘ [ERROR] service core:user:solage-capitale:
          Uncaught ReferenceError: process is not defined
```

### Ce que ça aurait cassé en production

`src/lib/constants.ts` évaluait `process.env.SITE_URL` au niveau du module. **`process` n'existe
pas dans le runtime des Workers**, et ce fichier est importé par `worker/lead-form.ts`
(`SITE_NAME`) et par `worker/index.ts` (`LEAD_ENDPOINT`). L'erreur se produit donc **au
chargement du module, sur chaque requête que le Worker traite** :

- **le formulaire** — toute soumission perdue ;
- **tous les 404** — c'est le Worker qui les sert (`not_found_handling: "none"`).

Et le site aurait eu l'air parfaitement sain : Cloudflare sert les assets statiques **sans
invoquer le code**, donc les 190 pages auraient répondu 200 normalement. Seuls le formulaire et
les 404 étaient morts.

**⚠ `npx wrangler deploy --dry-run` ne l'attrape pas.** Il bundle, il ne fait jamais tourner le
code. Il était vert depuis la session 4 et n'a jamais rien prouvé sur l'exécution — exactement le
`[uniqueness] 0 pages` de la session 1 et le `<set:html>` de la session 4. **On valide la SORTIE,
jamais l'intention**, et pour du code la sortie c'est l'exécution, pas le bundle.

Le bug est **antérieur à cette session** : `lead-form.ts` importait déjà `constants.ts` depuis la
session 4. Personne n'avait jamais lancé le Worker.

**Corrigé** par une garde `typeof process !== 'undefined'` (et la même pour `import.meta`).

### Deuxième bug, révélé par le premier : le Worker n'a jamais vu `SITE_URL`

Une fois la garde posée, `SITE_URL` retombait sur son défaut de développement,
`http://localhost:4321` — parce que **`wrangler deploy` est une commande distincte de
`npm run build` et n'hérite pas de la variable d'environnement**. Conséquence : chaque courriel
de prospect aurait porté « Envoyé depuis : `http://localhost:4321/soumission/` », un lien
sur lequel le locataire ne peut pas cliquer.

**Corrigé** : `SITE_URL` est maintenant une `vars` de `wrangler.jsonc` — c'est une variable de
déploiement, pas du contenu, donc sa place est à côté de la route. `lead-form.ts` la lit dans
`env`, avec la constante en repli, et `CANONICAL_HOSTS` est calculé par requête au lieu du niveau
module. Vérifié au `--dry-run` : `env.SITE_URL ("https://solagecapitale.ca")`.

### Le test de bout en bout, désormais fait avant de déployer

`wrangler dev` + `curl`, les 8 contrôles :

| | Résultat |
|---|---|
| Page statique (Worker non invoqué) | 200 |
| `GET /api/soumission/` | **405** + `Allow: POST` + `x-robots-tag: noindex` |
| `POST /api/soumission/` | 200 (page d'erreur, Mailgun non configuré — attendu) |
| `POST /api/soumission` **sans** barre oblique | 200, **aucune redirection** — le POST n'est pas dégradé |
| Pot de miel rempli | **303 → `/merci/`**, indistinguable d'un succès |
| Courriel invalide | **400** |
| `/merci/` et `/en/thank-you/` | **200 tous les deux** — la cible du 303 existe enfin |
| `/nexiste-pas/` · `/en/nexiste-pas/` | **404** réel, et `lang="en-CA"` du bon côté |

Et le journal annonce bien
`[lead] missing environment variables: MAILGUN_API_KEY, MAILGUN_DOMAIN, LEAD_TO_EMAIL — lead NOT sent`,
ce qui est la seule observabilité du formulaire en production.

**`wrangler dev` doit faire partie de la routine avant tout déploiement.** Ajouté à
`docs/DEPLOY.md`. Le coût est de trente secondes ; il vient d'éviter une mise en ligne où le
formulaire et les 404 étaient morts sans que rien ne le dise.
