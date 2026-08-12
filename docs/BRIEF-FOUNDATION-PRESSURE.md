# Brief — `foundationPressure` + `whyHere`, un secteur à la fois

**Tu es un sous-agent. Tu démarres à froid. Ce fichier est ton seul contexte.**
Lis-le en entier, puis traite **uniquement les secteurs nommés dans ton prompt**.

Tu ne lis pas `PROGRESS.md`, ni `SEO-PLAN.md`, ni `PLAYBOOK.md`. Tout ce dont tu as besoin est
ici. Ouvrir ces fichiers coûte des milliers de jetons et n'ajoute rien.

---

## 1. Ce que tu produis

Un fichier par secteur : `src/data/foundation-pressure/{slug}.json`.

**Tu n'écris jamais dans `src/data/cities.json`.** Plusieurs agents tournent en parallèle ; une
écriture concurrente dans un gros JSON le corrompt. La fusion est faite après coup par
`scripts/foundation-pressure.mjs merge`, en un seul fil.

```json
{
  "slug": "beauport",
  "erasBasis": "housingStock",
  "eras": [
    { "span": "1960-1985", "weight": "dominant", "foundation": "beton-coule", "drain": "tuile-argile" },
    { "span": "avant-1900", "weight": "minoritaire", "foundation": "pierre", "drain": "aucun" }
  ],
  "services": {
    "drain-francais":        { "level": "high",     "why": "cohorte 1960-1985 = drain de tuile d'argile en fin de vie" },
    "fissure-de-fondation":  { "level": "moderate", "why": "béton coulé dominant, fissures de retrait verticales" }
  },
  "ocre": null,
  "pyrite": null,
  "whyHere": { "fr": "…", "en": "…" },
  "sources": [],
  "todo": null
}
```

`level` ∈ `high` · `moderate` · `low`. **Rien d'autre.** Ces deux services sont les seuls qui
existent dans ce champ — n'en invente pas un troisième.

`weight` ∈ `dominant` · `minoritaire`. `span` est un **jeton strict**, jamais de la prose :
`avant-1945` · `1945-1975` · `1975-1990` · `1990-2005` · `apres-2005`, ou un intervalle
d'années `AAAA-AAAA`. Pas de « tournant du XXᵉ siècle », pas de parenthèse explicative — ça part
dans un gabarit. La nuance historique va dans `whyHere`, où elle sera lue.

---

## 2. La règle qui décide de tout : époque oui, sol non

Le champ `housingStock` de chaque secteur, **déjà présent et déjà vérifié**, nomme l'époque de
construction. C'est ta source primaire et elle est gratuite : elle est dans le fichier.

- **L'époque de construction est vérifiable** → tu peux l'écrire et en tirer un type de
  fondation et un type de drain, via le tableau §3.
- **L'association sol → secteur n'est PAS vérifiée** sur ce projet. C'est une hypothèse non
  publiée. → **N'écris jamais qu'un secteur a tel type de sol** sans URL de source primaire
  dans `sources`.

Conséquence directe pour `ocre` et `pyrite` : ces deux-là dépendent du sol et de la nappe.

- Sans source primaire ouverte et notée → `"ocre": null` et un `todo` qui dit quoi ouvrir.
- **`null` est un résultat correct et attendu, pas un échec.** Le projet a déjà 4 entrées
  réglementaires bloquées en `null` assumé. Une invention coûte le domaine ; un `null` ne coûte
  rien.
- La pyrite : le gonflement du remblai pyriteux est documenté surtout pour la région de
  Montréal. **Ne la reporte pas sur la Capitale-Nationale par analogie.** Sans source régionale,
  `null`.

**Le piège qui a fait tomber un secteur du premier lot : la source du domaine voisin.** Un agent
a trouvé un article du MAPAQ sur l'ocre ferreux dans le **drainage des champs agricoles** d'une
région, a constaté que le secteur était une plaine agricole, et a écrit `ocre: moderate` en
qualifiant lui-même son raisonnement d'« extrapolation prudente ».

Il n'y a pas d'extrapolation prudente ici. Une source vaut pour ce qu'elle mesure : le drainage
agricole n'est pas le drain français résidentiel, une région n'est pas un secteur, et un sol de
champ n'est pas le remblai d'une fondation. **Si tu écris « extrapolé », « par analogie »,
« correspond au profil » ou « à confirmer » dans un `why`, la réponse était `null`.**

Le test : la source parle-t-elle de **fondations résidentielles**, dans **ce secteur** ? Sinon
`null`, et mets l'URL dans le `todo` plutôt que dans `sources` — elle servira à celui qui
rouvrira la question, sans se faire passer pour une preuve.

---

## 3. Époque → fondation → drain → pression

Dérive `eras` de `housingStock`, puis lis les niveaux ici. C'est un tableau **général**, pas une
affirmation sur une maison donnée.

| Époque dominante | Fondation | Drain d'origine | `drain-francais` | `fissure-de-fondation` |
|---|---|---|---|---|
| avant 1945 | pierre / moellons | aucun | `high` | `low` — c'est de la réfection de mortier, pas une fissure de béton |
| 1945-1975 | béton coulé ou blocs | tuile d'argile en sections | `high` | `moderate` |
| 1975-1990 | béton coulé | PVC ondulé | `moderate` | `high` |
| 1990-2005 | béton coulé | PVC | `low` | `moderate` |
| après 2005 | béton coulé | PVC, ère BNQ 3661-500 | `low` | `low` |

### La condition supplémentaire pour `drain-francais: high`

Le tableau seul met 35 secteurs sur 51 en `high`, parce que le parc bâti de la région est
vraiment ancien partout. C'est vrai, mais **un critère que 96 % des secteurs passent ne
sélectionne rien** — et la matrice n'est approuvée que sur ce critère (SEO-PLAN §5). Un signal
constant produirait 30 pages qui ne diffèrent que par leur prose : la page-portail exacte.

`drain-francais: high` exige donc **les deux** :

1. une strate **`dominant`** en `avant-1945` ou `1945-1975` (drain absent, ou tuile d'argile) ;
2. **et** un facteur aggravant **nommé dans les données du secteur** — un cours d'eau, un plan
   d'eau, une baie, un ancien marais ou une zone inondable qui apparaît dans `localTerms`,
   `neighbourhoods` ou `housingStock`, ou une nappe haute attestée par une source que tu cites.

Le facteur doit être **nommé**, pas supposé. « Secteur en pente » ou « sol probablement argileux »
ne comptent pas — c'est l'association sol → secteur que §2 interdit. « En bordure de la rivière
Saint-Charles » compte, parce que c'est dans les données et qu'un lecteur peut le vérifier.

Époque ancienne **sans** facteur nommé → `moderate`. C'est le cas le plus fréquent, et c'est
correct : la pression existe, elle ne justifie simplement pas une page dédiée.

### Ajustements

**L'ajustement d'un cran ci-dessous ne peut jamais produire un `drain-francais: high`** si les
deux conditions ne sont pas déjà remplies. La condition dure gagne sur l'ajustement — sinon un
secteur de 1975-1990 remonte en `high` par la porte de derrière, et le critère cesse de trier.

Ajuste d'un cran, **et écris pourquoi dans `why`** :

- proximité nommée d'un cours d'eau, d'une baie, d'un ancien marais (regarde `localTerms` et
  `neighbourhoods`) → `drain-francais` +1 cran.
- secteur à forte proportion de blocs de béton ou de maisons ancestrales → `fissure` −1 cran.
- parc de construction très étalé, sans époque dominante → **plafonne à `moderate` et écris un
  `todo`.** L'étalement est une raison de prudence, pas de pression. Une strate `minoritaire` ne
  justifie jamais un `high` à elle seule : c'est le parc `dominant` qui porte le niveau. Si tu ne
  peux nommer aucune strate `dominant`, tu ne peux pas écrire `high`.

**Ne monte pas tout le monde en `high`.** 51 secteurs × 2 services = 102 combinaisons pour un
plafond de 30 pages. Si tu classes large, la coupe se fait sans toi et arbitrairement. Classe
sur le tableau, honnêtement ; c'est l'étape de fusion qui range et coupe.

---

## 4. `whyHere` — c'est là que la page vit ou meurt

Deux à quatre phrases, `fr` et `en`. L'anglais traduit **l'argument**, pas les phrases.

**Ce qui rend un `whyHere` acceptable — les trois obligatoires :**

1. Au moins **deux noms propres du secteur** repris de `localTerms` / `neighbourhoods` /
   `housingStock` (une rue, un quartier, une rivière, un boulevard).
2. Une **époque de construction chiffrée**, tirée de `housingStock`.
3. Un **mécanisme** qui relie l'un à l'autre : pourquoi *ce* parc bâti, à *cet* endroit, subit
   *cette* pression-là.

Si tu ne peux pas écrire les trois, écris `whyHere` quand même mais mets un `todo` disant ce qui
manque. Un paragraphe qui pourrait décrire n'importe lequel des 51 secteurs est un échec — c'est
exactement la page-portail que la porte d'unicité du projet existe pour bloquer.

**Interdits de formulation** (génériques, ils apparaîtront 51 fois) : « au fil des ans », « avec
le temps », « les propriétaires de ce secteur savent que », « comme partout à Québec », « le
climat rigoureux du Québec », « il n'est pas rare de », « de nombreuses résidences ».

**Le piège qui a coulé le premier lot : la phrase d'époque recyclée.** Un fait vrai sur l'époque
— « le drain français n'existe pas encore comme technique à cette date », « la tuile d'argile
arrive en fin de vie utile » — est vrai pour les ~20 secteurs qui partagent cette époque. Écrit
tel quel, il te donne 20 paragraphes jumeaux et la matrice meurt.

Ne formule donc jamais le mécanisme au niveau de l'époque. **Formule-le au niveau de la matière
et du lieu de *ce* secteur** : le mortier de chaux entre les moellons, le remblai rapporté d'un
ancien lotissement, la pente vers telle rivière, la dalle sur sol d'un plain-pied, la nappe
tenue haute par tel plan d'eau. Deux secteurs de la même époque doivent produire deux
paragraphes qu'on ne peut pas intervertir.

`scripts/foundation-pressure.mjs status` compare les `whyHere` entre eux et refuse toute suite de
8 mots partagée par 3 secteurs ou plus. Ce n'est pas un conseil de style : ça bloque la fusion.

**Ne recopie pas le `whyHere` existant.** Celui qui est dans `cities.json` parle de parasites —
coccinelles asiatiques, fourmis charpentières. Il est à remplacer intégralement. Même chose pour
`pestPressure` : tu l'ignores complètement, il sera supprimé à la fusion.

---

## 5. Trois règles dures du projet qui s'appliquent à toi

1. **Aucune instruction d'exécution.** Jamais rien qui permette au lecteur d'intervenir lui-même
   sur une fondation, un drain ou une dalle. Pas de dosage, pas de pente, pas de « en attendant ».
   Autorisé : « L'entrepreneur excave jusqu'à la semelle. » Interdit : « Excavez jusqu'à… ».
2. **Aucune confiance inventée.** Pas de nom d'entreprise, pas de numéro de licence RBQ, pas
   d'avis, pas de « nos chantiers ». Il n'y a aucune entreprise derrière ce site.
3. **Français québécois.** drain français (pas drainage périphérique) · sous-sol (pas cave) ·
   solage (pas soubassement) · soumission (pas devis) · pompe de puisard (pas de relevage) ·
   entrepreneur (pas artisan ni maçon). Accents obligatoires partout. Prix : `1 500 $`, espace
   insécable, dollar après — mais **évite les prix**, ils vivent dans `pricing.json`.

---

## 6. Ta procédure, et ce que tu renvoies

Pour chaque secteur de ton prompt :

```bash
node scripts/foundation-pressure.mjs show <slug>   # sort UNIQUEMENT les champs utiles
```

N'ouvre pas `cities.json` directement : il fait 150 Ko et te ferait manquer de contexte au
troisième secteur. La commande `show` te donne `name`, `municipality`, `population`,
`neighbourhoods`, `localTerms`, `housingStock`, `neighbours`.

Recherche web **seulement** si tu vises une entrée `ocre` / `pyrite` non nulle, ou pour
confirmer une époque de construction douteuse. Sinon, l'époque suffit et elle est déjà là.

Écris le fichier. Passe au suivant.

### Ton rapport final : une ligne par secteur, rien de plus

Ton rapport revient dans le contexte de l'agent principal. **Une prose de 51 secteurs le
saturerait — c'est précisément ce que cette architecture évite.** Format strict :

```
beauport | drain=high fissure=moderate | ocre=null | ok
sillery  | drain=moderate fissure=high | ocre=null | todo: époque 1875-1930 à confirmer
```

Pas de préambule, pas de résumé, pas de récapitulatif de méthode, pas de « j'ai terminé avec
succès ». Le contenu est sur le disque ; le rapport ne sert qu'à dire quoi relire.

Si un secteur échoue, écris quand même sa ligne avec `ÉCHEC:` et la raison. Un secteur manquant
sans ligne est indistinguable d'un agent interrompu.
