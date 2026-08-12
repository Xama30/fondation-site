# Brief — écrire un hub de secteur (FR + EN)

**Tu es un sous-agent. Tu démarres à froid. Ce fichier est ton seul contexte.**
Ne lis ni `CLAUDE.md`, ni `PROGRESS.md`, ni `SEO-PLAN.md`.

**Gabarit de référence, déjà écrit et validé — lis-le avant d'écrire :**
`src/content/sectors/fr/beauport.md` et `src/content/sectors/en/beauport.md`.

---

## 1. Ce que tu produis

Pour chaque secteur de ton prompt : `src/content/sectors/fr/{slug}.md` et
`src/content/sectors/en/{slug}.md`. **Le slug est identique dans les deux langues** — ce sont des
noms propres, Beauport reste Beauport.

**Écris les DEUX langues d'un secteur avant de passer au suivant.** N'écris pas tous les FR puis
tous les EN : si tu es interrompu en cours de route, ça laisse des pages françaises sans jumelle
anglaise, ce qui viole la règle 6 du projet et oblige quelqu'un à les rattraper à la main. C'est
déjà arrivé une fois. Un secteur terminé est un secteur livré dans les deux langues.

Ta matière première :

```bash
node scripts/foundation-pressure.mjs show <slug>
```

N'ouvre **jamais** `src/data/cities.json` directement : il fait 200 Ko et te ferait manquer de
contexte. Pour le `whyHere` et le `foundationPressure` du secteur, lis son fichier
`src/data/foundation-pressure/{slug}.json`, qui est court.

---

## 2. Ce que la page affiche déjà sans toi

Le gabarit `src/pages/secteurs/[sector].astro` rend automatiquement, depuis les données :

- le `whyHere` du secteur (déjà rédigé, souvent 3-4 phrases) ;
- les strates d'époque (`eras`) et le niveau de pression des deux services de la matrice ;
- la liste des quartiers ;
- les liens vers les services et vers les secteurs voisins.

**Ne les recopie pas.** Ton `localAngle` et ton corps de texte doivent dire ce que le `whyHere`
ne dit pas : la superposition de deux parcs bâtis, ce que la géographie ajoute, ce qui distingue
un bout du secteur d'un autre.

---

## 3. Le frontmatter, et ses bornes exactes

Le schéma **fait échouer le build** hors de ces bornes. Compte les caractères.

| Champ | Contrainte |
|---|---|
| `locale` | `fr` ou `en` |
| `sector` | le slug, identique dans les deux fichiers |
| `title` | **10 à 60 caractères** |
| `h1` | ≥ 6 caractères, **différent du `title`** |
| `metaDescription` | **140 à 158 caractères** — c'est la borne la plus souvent ratée |
| `localAngle` | ≥ 120 caractères |
| `publicReference` | ≥ 20 caractères |
| `faq` | **≥ 4 entrées**, `q` ≥ 8 car., `a` ≥ 40 car. |
| `heroImage: null`, `heroAlt: null` | toujours |

**Corps du texte : ≥ 300 mots**, deux ou trois sous-titres `##`, pas de `#`.

---

## 4. La règle qui bloque le build : ≥ 5 faits locaux

`uniqueness-check.mjs` exige que **≥ 5 termes de la liste `localTerms` du secteur** apparaissent
dans le texte rendu. Ce sont des rues, des rivières, des quartiers, des repères.

La page anglaise est vérifiée contre la **même liste française** : les noms propres restent en
français dans un texte anglais (« along avenue Royale », « toward baie de Beauport »), ce qui est
correct et suffit à passer. N'invente pas de traduction pour un nom propre.

Le `whyHere` rendu en contient déjà quelques-uns, mais **ne compte pas dessus** : nomme-en
plusieurs toi-même, naturellement, dans ton corps de texte et tes FAQ.

Deuxième règle : **≤ 35 % de similarité** avec les autres hubs de secteur. Avec 51 secteurs qui
parlent tous de drain et de sous-sol, c'est là que tout se joue — voir §6.

---

## 5. Les règles dures — non négociables

**1. Aucune instruction d'exécution.** Rien qui permette au lecteur d'intervenir lui-même sur une
fondation, un drain, une dalle ou une membrane. Pas de dosage, pas de pente, pas de séquence,
pas de « en attendant ». Le seul geste admis : observer, photographier avec une règle, dater,
appeler le 311, vérifier une licence au registre RBQ, exiger un rapport d'inspection.

**2. Aucune confiance inventée.** Il n'y a **aucune entreprise derrière ce site**. Pas de
« nous », pas de « nos chantiers », pas d'avis, pas de licence, pas d'années d'expérience.

**3. Aucun prix.** Ordres de grandeur relatifs seulement (« une inspection coûte une fraction
d'une excavation »), jamais un chiffre.

**4. Aucune affirmation sur le type de sol.** C'est la règle propre à ce projet : les
associations sol → secteur ne sont **pas vérifiées**, et `ocre` est `null` sur les 51 secteurs.
Tu peux écrire l'**époque de construction** (elle est dans les données, elle est vérifiable) et
la **géographie nommée** (une rivière, une baie, une pente vers un plan d'eau). Tu ne peux pas
écrire qu'un secteur a un sol argileux, sablonneux, ou sujet à l'ocre.

**5. Français québécois.** drain français · sous-sol · solage · soumission · pompe de puisard ·
entrepreneur. Accents partout, titres et meta compris.

**6. L'anglais traduit l'argument.** `french drain`, `foundation crack`, `wet basement`,
`water table`, `clay tile drain`. Jamais de calque.

---

## 6. Le piège : 51 secteurs qui se ressemblent

Deux secteurs de la même époque écriront spontanément la même phrase — « les bungalows des
années 1960-1985 ont tous le même drain de tuile d'argile ». Vraie, et fatale répétée quarante
fois : la porte bloque, et le domaine paie.

**Ancre chaque page dans ce qui n'existe que là** : le nom de la rivière, la rue qui traverse le
secteur, le hameau, la pente vers tel plan d'eau, la superposition d'un noyau ancien et d'un
lotissement récent, le fait qu'un secteur soit un quartier *dans* un arrondissement plus grand.

Tu traites plusieurs secteurs d'un coup **précisément pour les voir côte à côte**. Relis-les
ensemble avant de finir : si tu peux échanger deux paragraphes sans que ça se remarque, réécris.

N'ouvre pas deux pages de la même façon. Ne réutilise pas la même structure de sous-titres
partout. Ne pose pas les mêmes questions de FAQ d'un secteur à l'autre — varie l'angle selon ce
que le secteur a de particulier.

---

## 7. Vérifie avant de finir

**Ne lance pas `npm run build`** : d'autres agents écrivent en parallèle et un fichier réécrit
en cours de scan fait apparaître un faux `Duplicate id`.

```bash
cd /home/xama/repos/fondation-site && npx astro check
```

0 erreur. Compte toi-même tes caractères de `metaDescription` et tes mots de corps.

### Ton rapport final

Une ligne par secteur, rien d'autre.

```
charlesbourg | fr+en écrits | 341/329 mots | 7 termes locaux | ok
```
