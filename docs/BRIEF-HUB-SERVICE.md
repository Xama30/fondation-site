# Brief — écrire un hub de service (FR + EN)

**Tu es un sous-agent. Tu démarres à froid. Ce fichier est ton seul contexte.**
Ne lis ni `CLAUDE.md`, ni `PROGRESS.md`, ni `SEO-PLAN.md` : tout est ici.

Modèle de référence déjà écrit et validé — **lis-le avant d'écrire, c'est le gabarit** :
`src/content/services/fr/drain-francais.md` et `src/content/services/en/french-drain.md`.

---

## 1. Ce que tu produis

Pour chaque service de ton prompt, **deux fichiers** :

- `src/content/services/fr/{slug-fr}.md`
- `src/content/services/en/{slug-en}.md`

Les slugs sont dans `src/data/slugs.ts` (`SERVICE_SLUGS`). Le `service:` du frontmatter est la
**clé** de cet objet (`fissure`, `ocre`, `videSanitaire`…), pas le slug.

La matière factuelle de chaque service — nom, description, signes observables, ce que fait
l'entrepreneur, services liés — est déjà écrite dans `src/data/services.fr.json` et
`services.en.json`. **Lis l'entrée de ton service et ne la recopie pas** : la page l'affiche
déjà. Ton corps de texte doit dire autre chose.

---

## 2. Le frontmatter, et ses bornes exactes

Le schéma `src/content.config.ts` **fait échouer le build** hors de ces bornes. Vérifie-les
avant de finir.

| Champ | Contrainte |
|---|---|
| `locale` | `fr` ou `en` |
| `service` | la clé de `SERVICE_SLUGS` |
| `title` | **10 à 60 caractères**. C'est le `<title>`. |
| `h1` | ≥ 6 caractères, et **différent du `title`** — sinon erreur de schéma |
| `metaDescription` | **140 à 158 caractères**. Compte-les. |
| `regulation` | ≥ 60 caractères |
| `sources` | ≥ 1, chacune `{ label, url }`, URL valide |
| `faq` | **≥ 4 entrées**, `q` ≥ 8 car., `a` ≥ 40 car. |
| `order`, `heroImage: null`, `heroAlt: null` | reprends l'`order` de `services.fr.json` |

**Corps du texte : ≥ 350 mots**, sans quoi la page échoue au seuil de 400 mots une fois montée.
Deux ou trois sous-titres `##`. Pas de `#` dans le corps — le `h1` vient du frontmatter.

---

## 3. Les sources : trois seulement

**N'utilise que ces trois-là.** Ce sont les seules vérifiées à la source primaire sur ce projet.

- BNQ 3661-500 (drains de fondation, ocre) — `https://www.bnq.qc.ca/fr/`
- Licence RBQ, sous-catégories — `https://www.rbq.gouv.qc.ca/sous-categories`
- Garantie GCR — `https://www.garantiegcr.com/`

**Interdits comme sources :** CTQ-M200, programme d'aide pyrite, profondeur de gel, permis
d'excavation. Ils existent mais ne sont **pas vérifiés**, et rien de non vérifié ne se rend sur
une page. Tu peux dire qu'un protocole reconnu existe ; tu ne peux ni le nommer comme une
autorité établie, ni le citer en source.

**Aucune recherche web.** Si un fait ne tient pas avec ces trois sources, ne l'écris pas.

### Faits vérifiés que tu peux utiliser

- **BNQ 3661-500 est en deux parties** — partie I : évaluation du risque d'ocre (neuf) et
  diagnostic (existant) ; partie II : méthodes d'installation. **BNQ 3624-130** vise les tuyaux
  perforés. Angle : exiger que la soumission nomme la norme, la partie et le type de tuyau.
- **GCR** — 1 an malfaçons non apparentes · 3 ans vices cachés · **5 ans vices de conception, de
  construction ou de réalisation et vices du sol** · dénonciation dans un délai raisonnable, que
  la jurisprudence fixe à **6 mois** après la découverte · garantie transférable.
  Angle fort : sur une maison de moins de 5 ans, **faire réparer soi-même un vice couvert peut
  compromettre la réclamation**.
- **RBQ** — 2.5 excavation et terrassement · 2.6 pieux et fondations spéciales (nomme
  textuellement « la reprise en sous-œuvre ») · 3.2 petits ouvrages de béton (nomme « les murs de
  fondation de bâtiments visés à la partie 9 du CNB ») · 7 isolation et étanchéité.
- **Le meilleur fait du projet** : la 2.5 relève de l'**annexe III**, dont la RBQ écrit qu'elle
  « ne nécessite pas une évaluation de la compétence en exécution de travaux de construction ».
  La 2.6 est en annexe II et l'exige. **Détenir une licence d'excavation n'atteste donc d'aucune
  compétence évaluée.** Utilisable sur les services touchant à l'excavation — mais **une fois**,
  et pas sur les dix pages, sinon les pages se ressemblent.

---

## 4. Les règles dures — non négociables

**1. Aucune instruction d'exécution.** Ne jamais écrire ce qui permettrait à un lecteur
d'intervenir lui-même sur une fondation, un drain, une dalle ou une membrane. Pas de dosage, pas
de pente, pas de séquence, pas de matériel, pas de « solution temporaire en attendant ».
Autorisé : « L'entrepreneur excave jusqu'à la semelle. » Interdit : « Excavez jusqu'à… ».
Le seul geste admis côté lecteur : observer, photographier, dater, appeler un professionnel,
vérifier une licence au registre.

**2. Aucune confiance inventée.** Il n'y a **aucune entreprise derrière ce site** — c'est un
service de mise en relation. Pas de « nous », pas de « nos chantiers », pas d'avis, pas de
numéro de licence, pas d'années d'expérience, pas d'équipe. Le site parle du *problème* et du
*service* à la deuxième personne.

**3. Aucun prix.** Les fourchettes vivent dans `/prix/` et sont toutes nulles faute de source.
Tu peux parler d'**ordres de grandeur relatifs** (« une inspection coûte une fraction d'une
excavation ») ; jamais un chiffre.

**4. Français québécois.** drain français (pas drainage périphérique) · sous-sol (pas cave) ·
solage (pas soubassement) · soumission (pas devis) · pompe de puisard (pas de relevage) ·
inspection en bâtiment (pas diagnostic immobilier) · entrepreneur (pas artisan ni maçon).
Accents obligatoires partout, y compris dans les titres et les meta descriptions.

**5. L'anglais traduit l'argument, pas les phrases.** Le vocabulaire de recherche anglais gagne :
`french drain`, `foundation crack`, `iron ochre`, `sump pump`, `crawl space`, `basement water
infiltration`. Jamais de calque, jamais de slug translittéré.

---

## 5. Le piège qui décide de tout : la ressemblance entre sœurs

`scripts/uniqueness-check.mjs` **bloque le build** si deux pages de la même famille dépassent
**35 % de similarité** (shingles de 5 mots). Onze hubs qui parlent tous d'eau, de fondation et
de licence RBQ y arrivent très vite.

Ce qui rend une page distincte, ce n'est pas le vocabulaire — c'est **l'argument**. Chaque hub
doit défendre une idée que les dix autres ne défendent pas :

- `fissure` — toutes les fissures ne se valent pas ; c'est la lecture qui décide, pas le
  colmatage.
- `impermeabilisation` — elle se décide pendant l'excavation du drain, sinon la tranchée
  s'ouvre deux fois.
- `infiltration` — c'est un symptôme ; traiter sans avoir trouvé le chemin de l'eau déplace le
  problème.
- `ocre` — ça ne se répare pas, ça se gère ; ça change ce qu'on exige d'une installation neuve.
- `affaissement` — la cause est dans le sol ; c'est le seul sujet où l'ingénieur précède
  l'entrepreneur.
- `humidite` — vapeur ou eau liquide, deux problèmes distincts qu'on confond et qui font
  dépenser au mauvais endroit.
- `puisard` — c'est une gestion permanente qui dépend de l'électricité, pas une réparation.
- `videSanitaire` — l'air du vide sanitaire monte dans la maison ; refermer sans régler
  enferme le problème.
- `inspection` — c'est l'étape qui sépare un nettoyage d'une excavation.
- `pyrite` — ça ne se diagnostique pas à l'œil ; et la première question est de savoir si la
  région est même concernée.

**N'ouvre pas deux pages de la même façon.** Ne réutilise pas la structure de sous-titres du
gabarit à l'identique sur les dix. Ne répète pas le fait « annexe III » sur plus d'une page.

---

## 6. Vérifie avant de finir

```bash
SITE_URL=http://localhost:4321 npm run build 2>&1 | grep -E "uniqueness\]|error|ts\("
```

`[uniqueness] N pages · 0 errors` avec N qui a augmenté. Si une page dépasse 35 % de similarité,
**réécris-la** — ne touche jamais au seuil.

### Ton rapport final

Une ligne par service, rien d'autre. Pas de préambule, pas de résumé, pas de récapitulatif.

```
fissure | fr+en écrits | 412/389 mots | ok
ocre    | fr+en écrits | 371/364 mots | ok
```
