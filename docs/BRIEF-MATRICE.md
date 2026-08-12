# Brief — écrire une page matrice (service × secteur), FR + EN

**Tu es un sous-agent. Tu démarres à froid. Ce fichier est ton seul contexte.**
Ne lis ni `CLAUDE.md`, ni `PROGRESS.md`, ni `SEO-PLAN.md`.

**Gabarit de référence, écrit et validé — lis-le avant d'écrire :**
`src/content/matrix/fr/drain-francais-beauport.md` et `en/french-drain-beauport.md`.

---

## 1. Ce que tu produis

Pour chaque combinaison de ton prompt, deux fichiers :

- `src/content/matrix/fr/{slug-service-fr}-{secteur}.md`
- `src/content/matrix/en/{slug-service-en}-{secteur}.md`

Slugs de service : `drain` → `drain-francais` / `french-drain` ·
`fissure` → `fissure-de-fondation` / `foundation-crack-repair`.
Dans le frontmatter, `service:` prend la **clé** (`drain` ou `fissure`), pas le slug.

**Écris les DEUX langues d'une combinaison avant de passer à la suivante.** Une coupure doit
laisser des paires complètes, jamais une page FR sans jumelle anglaise.

Matière première :

```bash
node scripts/foundation-pressure.mjs show <secteur>
cat src/data/foundation-pressure/<secteur>.json
```

N'ouvre pas `src/data/cities.json` : 200 Ko, il te ferait manquer de contexte.

---

## 2. Ce qui existe déjà, et que tu ne dois PAS redire

Trois pages couvrent déjà une partie du sujet. **Lis les trois avant d'écrire**, ta page doit
vivre dans l'espace qu'elles laissent :

- `src/content/services/fr/{service}.md` — le hub de service : ce qu'est le problème en général,
  ce que fait l'entrepreneur, la réglementation.
- `src/content/sectors/fr/{secteur}.md` — le hub de secteur : le bâti du secteur, sa géographie,
  ses époques.
- Le gabarit `beauport` ci-dessus.

Le gabarit rend aussi automatiquement, depuis les données : le `why` de la pression pour cette
combinaison, les strates d'époque, et le `whatProDoes` du service. **Ne les recopie pas.**

**L'angle propre d'une page matrice**, c'est ce que ni le hub de service ni le hub de secteur ne
peuvent dire : **comment ce service se pratique concrètement DANS ce secteur**. L'accès au
terrain, la largeur des lots, ce que la géographie locale oblige à exiger de l'installation, ce
qui change entre deux rues du même secteur, à qui s'adresser à la municipalité. Du concret
d'exécution côté *décision du propriétaire* — jamais côté méthode de travaux (voir §4).

---

## 3. Le frontmatter, et ses bornes exactes

| Champ | Contrainte |
|---|---|
| `locale` | `fr` ou `en` |
| `service` | `drain` ou `fissure` |
| `sector` | le slug du secteur |
| `title` | **10 à 60 caractères** |
| `h1` | ≥ 6 caractères, **différent du `title`** |
| `metaDescription` | **140 à 158 caractères — compte-les.** C'est la borne la plus souvent ratée, dans les deux sens : trop courte échoue autant que trop longue. |
| `localAngle` | ≥ 120 caractères |
| `publicReference` | ≥ 20 caractères |
| `faq` | **≥ 4 entrées**, `q` ≥ 8 car., `a` ≥ 40 car. |
| `heroImage: null`, `heroAlt: null` | toujours |

**Corps : ≥ 300 mots**, deux ou trois sous-titres `##`, pas de `#`.

---

## 4. Les règles dures

**1. Aucune instruction d'exécution.** Rien qui permette au lecteur d'intervenir lui-même sur une
fondation, un drain, une dalle ou une membrane. Pas de dosage, pas de pente, pas de séquence.
Autorisé : « L'entrepreneur excave jusqu'à la semelle. » Interdit : « Excavez jusqu'à… ».
Les seuls gestes admis côté lecteur : observer, photographier avec une règle, dater, appeler le
311, vérifier une licence au registre RBQ, exiger un rapport d'inspection.

**2. Aucune confiance inventée.** Aucune entreprise n'existe derrière ce site. Pas de « nous »,
pas d'avis, pas de licence, pas d'années d'expérience.

**3. Aucun prix.** Ordres de grandeur relatifs seulement, jamais un chiffre.

**4. Aucune affirmation sur le type de sol.** Les associations sol → secteur ne sont pas
vérifiées sur ce projet. Tu peux écrire l'époque de construction et la géographie **nommée** (une
rivière, une baie, une pente) ; jamais « sol argileux » ni « secteur sujet à l'ocre ».

**5. Français québécois.** drain français · sous-sol · solage · soumission · entrepreneur.
Accents partout. **6. L'anglais traduit l'argument**, pas les phrases.

**Sources autorisées, les trois seules vérifiées :** BNQ 3661-500 (norme en deux parties ;
BNQ 3624-130 vise les tuyaux perforés) · licence RBQ (2.5 excavation, 3.2 petits ouvrages de
béton, 7 étanchéité) · garantie GCR (5 ans vices de conception, de construction et du sol ;
dénonciation dans un délai raisonnable, 6 mois en jurisprudence). **Aucune recherche web.**

---

## 5. Le piège : 13 pages qui parlent du même service

Onze des treize combinaisons portent sur `drain-francais`. Elles diront toutes que la tuile
d'argile vieillit et qu'il faut une inspection par caméra avant d'excaver. Écrit pareil onze
fois, `uniqueness-check.mjs` bloque le build à **35 % de similarité**.

Ancre chaque page dans ce qui n'existe que là : la forme des lots, le nom de la rue, la
municipalité à appeler (toutes ne relèvent pas du 311 de Québec — L'Ancienne-Lorette,
Saint-Augustin et Wendake ont leurs propres autorités), la contrainte d'accès, le plan d'eau
nommé, la cohorte de chalets convertis, le noyau ancien coincé entre deux voisins.

**Deuxième règle mécanique : ≥ 5 termes de la liste `localTerms` du secteur** dans le texte
rendu. La page EN est vérifiée contre `localTermsEn` s'il existe, sinon contre la liste
française — les noms propres restent en français dans un texte anglais, c'est correct.
**Si tu n'arrives pas à 5 sur la page EN, signale-le dans ton rapport** ; n'insère jamais de
français glosé pour faire passer le compteur.

---

## 6. Vérifie avant de finir

**Ne lance pas `npm run build`** — d'autres agents écrivent en parallèle.

```bash
cd /home/xama/repos/fondation-site && npx astro check
```

0 erreur. Compte toi-même caractères et mots.

### Rapport final — une ligne par combinaison, rien d'autre

```
drain-francais × charlesbourg | fr+en écrits | 341/329 mots | 7 termes locaux | ok
```
