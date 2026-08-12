# fondation-site — instructions de projet

**Lis ce fichier, puis `docs/PROGRESS.md`, avant de faire quoi que ce soit.**
`docs/PROGRESS.md` est la mémoire entre les sessions. `docs/SEO-PLAN.md` est la stratégie
complète. Le raisonnement derrière chaque règle est dans `docs/PLAYBOOK.md` — à lire une fois.

---

## Ce qu'est ce projet

Un site bilingue (**français primaire, anglais secondaire**) sur la **réparation de fondation
résidentielle** — fissures, drain français, imperméabilisation, ocre ferreuse, pyrite,
affaissement — pour la **Communauté métropolitaine de Québec**, construit pour ranker en
recherche locale organique puis être **loué à un entrepreneur en fondation / excavation en
exploitation**.

**Il n'y a aucune entreprise réelle derrière ce site.** C'est ce seul fait qui dicte les
règles dures ci-dessous.

- Marque : **Solage Capitale** (`Organization.name`). Pas « Fondation … » — en français, ça
  désigne un organisme de bienfaisance, et *Fondation Cap-Diamant* existe déjà à Québec. Voir
  `docs/DESIGN.md`.
- Domaine : **`solagecapitale.ca`** (2026-08-11). Aucun fichier de contenu ne contient de domaine
  en dur ; tout passe par `SITE_URL`. Voir §« Le domaine » plus bas.
- Cible : ~240 pages indexables à terme (≈150 au lancement). Détail dans `docs/SEO-PLAN.md`.
- Stack : Astro statique (aucun adaptateur) → Cloudflare Worker avec assets statiques.
- La seule route qui s'exécute est le formulaire de contact, dans `worker/index.ts` — **jamais**
  sous `functions/`, une convention que seul Cloudflare Pages lit. Voir `docs/PLAYBOOK.md` §10.
- Le design visuel (palette, typographie) doit être **différent** de `exterminateur-qc.ca` :
  les deux sites seront loués à des entreprises distinctes et ne doivent pas se ressembler.

### Ce que le site est, juridiquement

Un service **publicitaire et de mise en relation**. La page `/conditions-utilisation/` doit
l'énoncer explicitement : le prestataire qui rappelle est une **entreprise indépendante**, et
rien sur le site ne constitue un avis technique, un diagnostic ou une opinion d'ingénierie.

---

## Les 8 règles dures

### 1. Ne jamais inventer de la confiance
Pas d'adresse. Pas de numéro de téléphone impliquant un local qu'on n'a pas. Pas d'avis
inventé, d'étoiles, de témoignage, de **numéro de licence RBQ**, de « depuis 19XX », de bio
d'équipe, ni de photo de chantier présentée comme la nôtre.

**Pourquoi :** violations des politiques anti-spam des moteurs *et* problème de protection du
consommateur. Ça empoisonnerait l'actif pour le futur locataire, ce qui annule l'intérêt du
projet.

**À la place :** le site parle à la deuxième personne du *problème* et du *service*, cite des
faits publics vérifiables (RBQ, BNQ 3661-500, protocole CTQ-M200, GCR, règlements municipaux,
fourchettes de prix réelles avec source) et utilise un formulaire + un numéro de suivi
d'appel. Les marqueurs de confiance seront remplis par le locataire — voir
`docs/HANDOFF-TENANT.md`.

**La version subtile de la violation :** rattacher une accréditation au service vendu
(« le prix d'une réparation *certifiée* ») laisse entendre qu'on détient la licence. Formuler
la réglementation comme un fait public que le lecteur peut exiger : « demandez le numéro de
licence RBQ et vérifiez-le au registre avant de signer. » **L'accréditation pertinente ici est
la licence RBQ.** Le certificat CD5 concerne les pesticides et n'a rien à faire sur ce site.

### 1bis. Aucune instruction d'exécution — règle propre à cette niche
**Ne jamais écrire quoi que ce soit qui permette à un lecteur d'intervenir lui-même** sur une
fondation, un drain, une dalle ou une membrane. Pas de dosage, pas de pression d'injection,
pas de séquence d'excavation, pas de « comment faire », pas de liste de matériel, pas de vidéo
tutoriel, pas de « solution temporaire en attendant ».

Le site explique **le problème**, **la réglementation** et **ce qu'un professionnel fait et
pourquoi**. Il ne dit jamais comment le faire. C'est de la responsabilité civile : une
excavation contre une fondation ou une injection mal faite blesse ou détruit un bâtiment.

Formulation autorisée : « L'entrepreneur excave jusqu'à la semelle pour exposer le mur. »
Formulation interdite : « Excavez jusqu'à la semelle en respectant une pente de… ».

Seul « geste » admis côté lecteur : **observer, documenter, et faire venir un professionnel**
(photographier une fissure avec une règle, noter la date, appeler le 311, vérifier une licence
au registre RBQ).

### 2. Aucune page sans une ligne dans `docs/KEYWORD-MAP.md`
Une ligne par URL : URL · langue · type de page · mot-clé principal · secondaires · statut.
Si la ligne n'existe pas, la page ne se construit pas. C'est ce qui empêche la cannibalisation
et la prolifération de pages minces. Une ligne peut exister en statut « planifié » — c'est le
seul moyen légitime de tenir une page en attente.

### 3. Aucune page qui échoue à la porte d'unicité
`scripts/uniqueness-check.mjs` bloque le build. Une page `service × secteur` qui n'y arrive pas
devient une **section** du hub de secteur, pas une page de plus.
**Mieux vaut 40 vraies pages que 49 dont 9 tirent le domaine vers le bas.**

Ne jamais baisser un seuil pour faire passer une page. On améliore la page ou on la rétrograde,
et on écrit laquelle et pourquoi dans `docs/PROGRESS.md`.

### 4. Les URL sont gelées après le lancement
Ajouts seulement. Un changement de slug coûte des semaines de classement. On règle ça dans
`docs/KEYWORD-MAP.md` avant de créer le fichier.

### 5. Écrire le français **québécois**, pas celui de France

| Utiliser | Ne pas utiliser |
|---|---|
| drain français | drainage périphérique |
| sous-sol | cave |
| solage (registre courant, en appui de « fondation ») | soubassement |
| soumission | devis |
| pompe de puisard | pompe de relevage |
| inspection en bâtiment | diagnostic immobilier |
| gouttière, margelle | chéneau |
| entrepreneur (détenteur d'une licence RBQ) | artisan, maçon |
| 1 500 $ (espace insécable, dollar après) | 1500 € · $1,500 |

Espace insécable dans les prix et les unités. **Accents obligatoires partout**, y compris dans
les titres et les meta descriptions.

**Vérifier l'insécable au niveau octet (`c2 a0`), jamais à l'œil** — les outils d'écriture de
fichiers le normalisent silencieusement. Mieux : garder les prix littéraux hors du corps de
texte et pointer vers `/prix/`.

### 6. Chaque page FR sort avec sa jumelle EN
Ou une ligne TODO explicite dans `docs/PROGRESS.md`. L'anglais est une traduction **de
l'argument**, pas des phrases — on réécrit là où la formulation de recherche anglaise diffère
(`french drain` et non `drain français`, `foundation crack` et non `crack in solage`). Jamais
de dump machine, jamais de slug translittéré.

### 7. Aucune nouvelle dépendance JS sans justification
Astro sort 0 Ko de JS par défaut et c'est l'avantage compétitif du site. Tout JS client exige
une ligne dans `docs/PROGRESS.md` chiffrant le coût Core Web Vitals. Les composants interactifs
utilisent `<details>`, du CSS, ou `client:visible` au pire.

### 8. Mettre à jour `docs/PROGRESS.md` à la fin de chaque session
Ce qui a été livré · ce qui vient · les questions ouvertes · tout ce qu'une prochaine session
redécouvrirait autrement. **Écrire au fur et à mesure, pas à la fin.**

---

## Avant de construire un nouveau type de page

Dans cet ordre, dans le même commit :

1. Ajouter la ou les lignes à `docs/KEYWORD-MAP.md`.
2. Construire la route et confirmer qu'elle rend **une vraie page**.
3. **Enregistrer la famille dans `FAMILIES` de `scripts/uniqueness-check.mjs`.**
4. Ensuite seulement, écrire le contenu.

Sauter l'étape 3 fait passer la famille sans contrôle **et la porte annonce un succès propre**.
C'est arrivé deux fois sur le projet précédent. Une porte verte qui ne vérifie rien est pire
que pas de porte.

**Contrainte de forme imposée par le script :** `sectorFromUrl()` prend le **dernier segment**
de l'URL comme secteur pour les familles `matrix-*` et `sector-*`. Les URL matrice doivent donc
finir par le secteur : `/fondation/{service}/{secteur}/`. Ne pas inverser.

---

## Le domaine

**`solagecapitale.ca`**, acheté le 2026-08-11. La discipline qui a permis de le brancher sans
toucher un seul fichier de contenu reste en vigueur :

- `SITE_URL` est la **constante unique**. Canonicals, hreflang, sitemap, JSON-LD et courriels
  sortants en dérivent tous. `PLACEHOLDER_` reste une **erreur dure** de `seo-audit.mjs`.
- Build de production : `SITE_URL=https://solagecapitale.ca npm run build`.
  En local : `SITE_URL=http://localhost:4321 npm run build`.
- **Le seul endroit du dépôt où le domaine est écrit est la route de `wrangler.jsonc`**, et ce
  n'est pas du contenu — c'est la cible de déploiement. Ne jamais en écrire un ailleurs.
- L'endpoint du formulaire suit la même règle : `LEAD_ENDPOINT` dans `src/lib/constants.ts`,
  d'où `worker/index.ts` **et** les deux formulaires le dérivent.
- ⚠ **Aucun attribut `style=` dans un gabarit.** La CSP de `public/_headers` pose
  `style-src 'self'`, qui bloque aussi les attributs `style` — ça a annulé la mise en page des
  188 pages jusqu'à la session 5. Contrôle : `grep -roh 'style="[^"]*"' dist/` doit être vide.

---

## Pièges qui ont déjà coûté du temps

- **Une collection qui utilise un champ `slug` en frontmatter exige un `generateId` explicite** —
  `generateId: ({ entry }) => entry.replace(/\.md$/, '')`. Sans ça, les fichiers FR/EN entrent
  en collision d'id et **l'un est silencieusement jeté** : les fichiers existent, le schéma
  valide, zéro page se rend, les audits annoncent 0 erreur. Le correctif est déjà dans
  `src/content.config.ts` — ne pas le retirer.
- **Hisser les casts typés dans le frontmatter.** Un cast générique dans le corps du template
  est lu comme du JSX.
- **Résoudre les images par un `import.meta.glob` eager clé sur le stem, et lever une erreur
  si aucune correspondance.** Un repli silencieux fait partir une page sans sa photo.
- **Guillemets doubles pour toute copie contenant une apostrophe** — une apostrophe française
  dans une chaîne TS en guillemets simples casse le parse du frontmatter.
- **`locale === 'fr'` échoue au type-check dans la jumelle EN** d'un template généré. Utiliser
  des clés calculées.
- **Piloter les grilles de liens depuis `getCollection(...)`, jamais depuis le JSON brut** —
  les entités rétrogradées restent dans les données et deviennent des liens morts permanents
  que l'audit ne voit pas (la dérogation « planifié » les couvre à vie).
- **Ne jamais renvoyer 502/504 depuis l'origine pour une page qu'un humain lit** — le CDN la
  remplace par la sienne. 400 pour une entrée invalide, 200 pour une page « c'est nous qui
  avons échoué ».
- **Une chaîne vide n'est pas une variable non définie.** `??` ne retombe pas sur `''`.
  Normaliser et trimmer l'environnement à la frontière.
- **Astro exclut silencieusement `src/pages/_*.astro` du routage.** Une page de vérification
  nommée avec un underscore initial ne se construit jamais : ce qu'elle devait exercer ne tourne
  pas, et le build annonce un succès propre. Même forme d'échec que la collision `generateId`.
- **Un module de validation que personne n'importe ne s'exécute jamais.** `astro check` prouve
  que `src/lib/data.ts` compile, pas que les données le satisfont. **La validation ne tourne
  qu'à partir du moment où une page importe `src/lib/data.ts`** — aucune ne le fait encore.
- **`null` devient `0` en arithmétique, sans bruit.** `population` est `null` pour les
  sous-secteurs sans recensement propre ; un classement en `population / 1e6` les reléguait tous
  au dernier rang et décidait la coupe à 30 en silence.
- **Les données héritées du site précédent se cachent ailleurs que dans les champs évidents.**
  Au-delà de `pestPressure` et `whyHere`, les descriptions `imagePending` de `cities.json` sont
  écrites pour la lutte antiparasitaire (« façade sud », « soffite ») — à réécrire en phase 3.
- **`src/data/cities.json` vient du projet précédent.** Les champs géographiques
  (`tier`, `type`, `name`, `municipality`, `population`, `neighbourhoods`, `localTerms`,
  `neighbours`) sont réutilisables tels quels. Mais `pestPressure`, `whyHere` et la partie
  « pression » de `housingStock` sont écrits pour la lutte antiparasitaire : **ils doivent être
  remplacés par `foundationPressure` et un `whyHere` réécrit** en phase 2. Ne pas laisser un
  `whyHere` parlant de coccinelles se rendre sur une page de drain français.

---

## Astro

- Le **compilateur Rust est par défaut** et refuse le HTML mal formé ou sémantiquement invalide.
  Pas de `<p>` enveloppant un `<div>`, pas de balise non fermée.
- `compressHTML` vaut `'jsx'` : l'espace entre éléments inline est supprimé. Vérifier l'espace
  autour des liens inline dans les paragraphes.
- Les collections vivent dans `src/content.config.ts` avec les loaders `glob()` / `file()`
  d'`astro/loaders`, schémas via `z` d'`astro/zod`.
- **Node 24. TypeScript épinglé en 5.9.** Et les `overrides` `@emnapi` dans `package.json` dès
  le premier commit (`@emnapi/core` 1.11.3, `@emnapi/runtime` 1.11.3,
  `@emnapi/wasi-threads` 1.2.3) — sans eux, `npm ci` casse sur Cloudflare. Voir PLAYBOOK §2.

## Commandes

```bash
npm run dev        # serveur de développement
npm run build      # inclut astro check + les trois audits (bloquants)
npm run preview    # sert le site construit
npm run audit      # uniqueness-check + link-audit + seo-audit contre dist/
PENDING_IMAGES=strict npm run audit   # porte image avant lancement

node scripts/foundation-pressure.mjs status   # reprise phase 2 : ce qui reste des 51 secteurs
node scripts/foundation-pressure.mjs merge    # fusion + coupe à 30 (refuse si incomplet)
```

---

## Travail en lot par sous-agents

Les tâches à 51 entités (`foundationPressure` aujourd'hui, le contenu de secteur plus tard) se
font par sous-agents parallèles. Trois règles, apprises en concevant la première :

1. **Le sous-agent écrit sur le disque et renvoie ≤ 1 ligne par entité.** Son rapport final
   revient dans le contexte du parent : y renvoyer de la prose ne fait que déplacer le coût.
2. **Un fichier par entité, jamais d'écriture concurrente dans un gros JSON.** Une étape de
   fusion mono-fil recombine ensuite. C'est aussi ce qui rend le travail reprenable : l'état
   durable est sur le disque, et le registre de reprise est le contenu du dossier — **pas un
   second fichier d'état**, qui divergerait.
3. **Un brief autonome, lu à froid.** L'agent ne lit ni ce fichier, ni `PROGRESS.md`, ni
   `SEO-PLAN.md` — le brief contient les règles dures qui le concernent. Le prompt tient alors
   en deux lignes, et le brief est un coût fixe qu'on amortit en groupant 4-6 entités par agent.
4. **Estampiller chaque fichier de la version de la règle appliquée** (`criterion`). Dès qu'un
   critère change en cours de route, « fichier présent » ne suffit plus : un agent qui évalue
   une entité sans la modifier n'écrit rien, donc « non modifié » et « non traité » deviennent
   indistinguables — et l'horodatage ne les sépare pas non plus.
5. **Grouper les lots par ce qui rend les entités semblables** (époque, catégorie), jamais par
   ordre alphabétique. Les agents ne se voient pas : deux entités proches placées dans deux lots
   différents convergent *indépendamment* sur la même formulation naturelle.
6. **Piloter 5 entités avant d'ouvrir les vannes.** Ça coûte peu et ça a révélé ici trois
   défauts réels, tous invisibles sur une entité isolée.

Un plafond global (les 30 pages matrice) ne peut pas être respecté par des agents parallèles :
ils classent sur **critères absolus**, la fusion range et coupe.

**Et vérifier qu'un critère de sélection sélectionne vraiment.** Un critère que 96 % des entités
passent est vrai et inutile : il ne trie plus rien, le plafond se remplit par population, et les
pages ne diffèrent que par leur prose. Sortir la distribution avant de faire confiance à une
porte. Détail et version généralisée dans `docs/CLAUDE.template.md`.

## Conventions

- **Fichiers :** kebab-case, slugs français sous les routes françaises, slugs anglais sous
  les routes anglaises.
- **Contenu :** les parties réutilisables/templatées vont dans `src/data/*.json` ; la prose
  *unique* de chaque page va dans `src/content/**/*.md`. Jamais de copie en dur dans un
  `.astro`.
- **Chaînes :** chaque chaîne d'interface va dans `src/data/ui.fr.json` / `ui.en.json`.
- **Images :** `src/assets/img/` uniquement. Alt bilingue, descriptif, mot-clé local au plus
  une fois. Jamais présentées comme « nos travaux ».
- **Schema.org :** via les helpers de `src/lib/schema.ts`, jamais de JSON-LD écrit à la main.
  **Pas de `LocalBusiness`, pas d'`aggregateRating`** — les deux exigent une adresse vérifiée
  et de vrais avis. On utilise `Organization` + `WebSite` + `Service` + `BreadcrumbList` +
  `FAQPage` + `BlogPosting`. Le handoff locataire renverse ça.
- **URL :** chaque lien et chaque alternate dérive d'un `PageRef` via `src/lib/routes.ts`.
  Jamais d'URL interne écrite à la main.

## Où sont les choses

| Besoin | Fichier |
|---|---|
| La méthode, et pourquoi chaque règle existe | `docs/PLAYBOOK.md` |
| Stratégie complète | `docs/SEO-PLAN.md` |
| Reconnaissance de la concurrence + **texte officiel des licences RBQ** | `docs/COMPETITION.md` |
| Marque, palette, typographie, stratégie d'images | `docs/DESIGN.md` |
| Ce qui est fait / ce qui vient | `docs/PROGRESS.md` |
| Registre URL ↔ mot-clé | `docs/KEYWORD-MAP.md` |
| Comment écrire chaque type de page | `docs/BRIEF-HUB-SERVICE.md` · `docs/BRIEF-HUB-SECTEUR.md` |
| Brief sous-agent — `foundationPressure` par secteur | `docs/BRIEF-FOUNDATION-PRESSURE.md` |
| Chargement + validation Zod de `src/data/*.json` | `src/lib/data.ts` |
| Modèle réutilisable pour le prochain site | `docs/CLAUDE.template.md` |
| Checklist de transfert au locataire | `docs/HANDOFF-TENANT.md` *(phase 1)* |
| Déploiement + liste des pièges | `docs/DEPLOY.md` *(phase 7)* |
| Ce qu'il faut trouver comme images, et sous quelle licence | `docs/IMAGE-NEEDS.md` |
| Licences et crédits d'images | `docs/IMAGE-CREDITS.md` *(phase 3)* |
