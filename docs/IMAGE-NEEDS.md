# IMAGE-NEEDS — ce qu'il faut trouver, et sous quelle licence

> **STATUT AU 2026-08-06 — la phase 3 est fermée, ce document n'est plus un bloqueur.**
> `PENDING_IMAGES=strict npm run audit` est **vert** : `[uniqueness] 150 pages · 0 erreur ·
> 0 avertissement`. Les 102 avertissements « no hero image with alt text » sont tombés.
>
> **Pas parce que les 51 photos ont été trouvées** — elles n'existent pas sous licence libre.
> Le hero par défaut d'un hub de secteur est désormais un **schéma bâti sur les données du
> secteur** (`src/components/EraDiagram.astro`), sans licence à transmettre au locataire et
> distinct 51 fois. Deux secteurs seulement portent une photo : `beauport` et `ile-dorleans`.
> Le raisonnement complet est dans `docs/PROGRESS.md` § Session 4.
>
> **Le tableau ci-dessous reste utile**, mais comme liste de souhaits, pas comme dette :
> il dit ce qu'on prendrait si une image libre et honnête se présentait.

**Pourquoi la stratégie « photo de sujet réutilisée » ne tient pas.** La porte d'unicité exige un
`alt` de hero **distinct de toutes les pages sœurs**. Poser la même photo de moellons sur vingt
secteurs ne laisse que deux issues, toutes deux fermées : un `alt` identique vingt fois (erreur
dure de `uniqueness-check.mjs`), ou un `alt` qui nomme un lieu où la photo n'a pas été prise
(règle 1). Un schéma, lui, peut nommer le secteur sans mentir — il décrit réellement ses données.

**Ce que Wikimedia Commons contient réellement pour cette région** (balayage des 51 secteurs,
2026-08-06) : 46 secteurs ont au moins un candidat DP/CC0, mais ce sont des basiliques, des
églises paroissiales, des gravures du XVIIIᵉ siècle, des fonds BAnQ et des panoramas. **Presque
rien de résidentiel, et rien qui montre une fondation.** Les ~12 exceptions réellement
utilisables sont listées dans `PROGRESS.md` § Session 4.

Les 51 descriptions ci-dessous viennent du champ `imagePending` de `src/data/cities.json`, qui
renvoie ici. **Ce fichier est généré depuis ces données** : pour changer un besoin d'image, on
modifie `cities.json`, pas ce tableau. Les entrées dont `imagePending` est passé à `null`
(`beauport`, `ile-dorleans`) sont servies et n'attendent plus rien.

---

## Les règles, avant de chercher

1. **La licence est un bloqueur, et elle suit l'actif jusqu'au locataire** (PLAYBOOK §9). Une
   image dont la licence n'est pas notée ne se met pas en ligne. Le crédit va dans
   `docs/IMAGE-CREDITS.md`.
2. **Sources, dans l'ordre** (DESIGN.md §4) : Wikimedia Commons (domaine public ou CC0) →
   archives publiques canadiennes et québécoises, licences à vérifier une par une → illustration
   générée en dernier recours, avec un alt honnête.
3. **Jamais présentée comme « nos travaux ».** Il n'y a aucune entreprise derrière ce site
   (règle 1). Une photo de chantier est une illustration du *sujet*, pas une réalisation.
4. **Le sujet plutôt que le lieu.** Trouver une photo libre de l'avenue Royale à Château-Richer
   est improbable ; trouver une photo libre d'un mur de fondation en moellons de pierre ne l'est
   pas. Le sujet est ce qui porte le sens de la page.
5. **Alt bilingue, descriptif**, mot-clé local au plus une fois. `heroAlt` prend `{ fr, en }`.
6. **Les 11 hubs de service et les 13 pages matrice n'ont pas de besoin listé ici** — leur
   `heroImage` est aussi à `null`, mais leur sujet est générique (une fissure, un drain excavé,
   un dépôt d'ocre) et se trouve directement dans les catégories techniques de Commons.

## Catégories Commons déjà repérées

`Construction excavations` · `Elements cast into concrete` · `Concrete columns` · `Manholes`,
plus les catégories géographiques du Québec pour le bâti de secteur.

---

## Les 51 besoins, par strate

| Secteur | Strate | Nom | Image recherchée |
|---|---|---|---|
| `beauport` | A | Beauport | Bungalow des années 1960-1970 avec margelle de fenêtre de sous-sol visible, secteur Giffard, Beauport |
| `charlesbourg` | A | Charlesbourg | Bungalow d'après-guerre avec pente de terrain vers la rue, secteur Bourg-Royal, Charlesbourg |
| `la-cite-limoilou` | A | La Cité-Limoilou | Triplex à escalier extérieur, 3e Avenue, Vieux-Limoilou |
| `la-haute-saint-charles` | A | La Haute-Saint-Charles | Maison sur terrain boisé, Val-Bélair ou Lac-Saint-Charles |
| `les-rivieres` | A | Les Rivières | Immeuble à logements ancien, boulevard Wilfrid-Hamel, Vanier |
| `levis` | A | Lévis | Bungalow avec garage attenant, secteur Saint-Nicolas ou Charny, Lévis |
| `sainte-foy-sillery-cap-rouge` | A | Sainte-Foy–Sillery–Cap-Rouge | Maison ancestrale en pierre, chemin Saint-Louis, Sillery |
| `beaupre` | B | Beaupré | Condo de montagne ou chalet, secteur du Mont-Sainte-Anne |
| `boischatel` | B | Boischatel | Maison ancienne, avenue Royale près du parc de la Chute-Montmorency |
| `chateau-richer` | B | Château-Richer | Bâtiment patrimonial en bois, secteur du Moulin du Petit-Pré, avenue Royale |
| `fossambault-sur-le-lac` | B | Fossambault-sur-le-Lac | Chalet riverain avec quai, lac Saint-Joseph |
| `ile-dorleans` | B | Île d'Orléans | Maison ancestrale aux murs de pierre, chemin Royal, secteur Sainte-Famille ou Saint-Jean |
| `lac-beauport` | B | Lac-Beauport | Chalet en bordure du lac Beauport avec quai et remise |
| `lac-delage` | B | Lac-Delage | Condo ou chalet quatre-saisons entouré de forêt, bord du lac Delage |
| `lancienne-lorette` | B | L'Ancienne-Lorette | Bungalow d'après-guerre avec haie de cèdres, secteur rue Notre-Dame |
| `lange-gardien` | B | L'Ange-Gardien | Maison ancienne face au fleuve, avenue Royale entre champs cultivés |
| `saint-augustin-de-desmaures` | B | Saint-Augustin-de-Desmaures | Maison unifamiliale récente, secteur Les Bocages ou lac Saint-Augustin |
| `saint-ferreol-les-neiges` | B | Saint-Ferréol-les-Neiges | Chalet en bordure de forêt, secteur du lac des Trois Castors |
| `saint-gabriel-de-valcartier` | B | Saint-Gabriel-de-Valcartier | Maison rurale entre champ et boisé, secteur route 371 |
| `sainte-anne-de-beaupre` | B | Sainte-Anne-de-Beaupré | Auberge ou motel patrimonial, avenue Royale près de la basilique |
| `sainte-brigitte-de-laval` | B | Sainte-Brigitte-de-Laval | Résidence en bordure de boisé, vallée de la rivière Montmorency |
| `sainte-catherine-de-la-jacques-cartier` | B | Sainte-Catherine-de-la-Jacques-Cartier | Résidence riveraine, chemin de la Liseuse le long de la rivière Jacques-Cartier |
| `shannon` | B | Shannon | Maison sur grand terrain rural en bordure de boisé, secteur boulevard Jacques-Cartier |
| `stoneham-et-tewkesbury` | B | Stoneham-et-Tewkesbury | Chalet quatre-saisons entouré de forêt, secteur Stoneham ou Tewkesbury |
| `wendake` | B | Wendake | Résidence du Vieux-Wendake en bordure de la rivière Saint-Charles |
| `breakeyville` | C | Breakeyville | Ruines du moulin Breakey, Éco-Parc de la Chaudière, Breakeyville |
| `cap-rouge` | C | Cap-Rouge | Maison du noyau villageois, chemin du Roy, sous le Tracel, Cap-Rouge |
| `charny` | C | Charny | Bâtiment ancien, avenue des Églises, Vieux-Charny |
| `duberger-les-saules` | C | Duberger–Les Saules | Entrepôt du parc industriel Duberger, avenue Saint-Sacrement |
| `giffard` | C | Giffard | Maison split-level des années 1970, boulevard des Chutes, Giffard |
| `lac-saint-charles` | C | Lac-Saint-Charles | Chalet riverain, bord du lac Saint-Charles |
| `lebourgneuf` | C | Lebourgneuf | Tour à condos en construction, boulevard Lebourgneuf |
| `limoilou` | C | Limoilou | Triplex rénové avec escalier extérieur, 3e Avenue, Limoilou |
| `loretteville` | C | Loretteville | Maison à toit mansardé, rue Racine, noyau villageois de Loretteville |
| `montcalm` | C | Montcalm | Grande demeure convertie en appartements, avenue Cartier, Montcalm |
| `neufchatel` | C | Neufchâtel | Bungalow des années 1960-1970, secteur Des Châtels (Neufchâtel), avenue Chauveau |
| `pintendre` | C | Pintendre | Maison rurale, avenue des Ruisseaux, Pintendre |
| `saint-emile` | C | Saint-Émile | Maison unifamiliale en bordure de forêt, avenue Lapierre, Saint-Émile |
| `saint-etienne-de-lauzon` | C | Saint-Étienne-de-Lauzon | Développement résidentiel récent près de la jonction autoroute 73/route 175, Saint-Étienne-de-Lauzon |
| `saint-jean-baptiste` | C | Saint-Jean-Baptiste | Immeuble locatif dense, rue Saint-Jean, Saint-Jean-Baptiste |
| `saint-jean-chrysostome` | C | Saint-Jean-Chrysostome | Maison unifamiliale récente, rue du Rucher, Saint-Jean-Chrysostome |
| `saint-nicolas` | C | Saint-Nicolas | Ancien magasin général, Village Saint-Nicolas |
| `saint-redempteur` | C | Saint-Rédempteur | Commerce de la route des Rivières, Saint-Rédempteur |
| `saint-roch` | C | Saint-Roch | Ancien entrepôt converti en loft, rue Saint-Joseph, Saint-Roch |
| `saint-romuald` | C | Saint-Romuald | Maison ancienne, chemin du Fleuve, secteur Etchemin, Saint-Romuald |
| `saint-sauveur` | C | Saint-Sauveur | Maison ouvrière du XIXe siècle, rue Saint-Vallier Ouest, Saint-Sauveur |
| `sainte-foy` | C | Sainte-Foy | Tour à condos, boulevard Laurier, Sainte-Foy |
| `sillery` | C | Sillery | Villa centenaire, chemin Saint-Louis, Sillery |
| `val-belair` | C | Val-Bélair | Maison en bordure du boisé de la base Valcartier, boulevard Pie-XI, Val-Bélair |
| `vanier` | C | Vanier | Boulevard Père-Lelièvre en bordure de la rivière Saint-Charles, Vanier |
| `vieux-quebec` | C | Vieux-Québec | Maison de pierre avec auberge, rue du Petit-Champlain, Vieux-Québec |

---

## Quand une image est trouvée

1. Fichier dans `src/assets/img/`, nom en kebab-case correspondant au stem attendu.
   `src/lib/images.ts` résout par `import.meta.glob` eager et **lève une erreur** si aucune
   correspondance — un repli silencieux ferait partir une page sans sa photo.
2. `heroImage` prend le stem, `heroAlt` prend `{ fr, en }`, **dans les deux jumelles FR et EN**
   (`src/content/sectors/{fr,en}/<slug>.md`) ; `imagePending` passe à `null` dans `cities.json`.
   Un `heroImage` sans `heroAlt` dans une langue **lève au build** plutôt que de retomber
   silencieusement sur le schéma.
3. Le crédit et la licence vont dans `docs/IMAGE-CREDITS.md`.
4. `PENDING_IMAGES=strict npm run audit` doit rester vert.
5. **Vérifier ce qu'il y a réellement sur la photo, et le dire dans l'`alt`.** `ile-dorleans`
   montre une maison **abandonnée** ; le taire aurait laissé croire à du bâti courant.

**Rappel d'outillage :** l'API Commons rend un **429 au-delà de ~10 requêtes rapprochées**.
Prévoir 2,5 s entre les appels et un backoff — `scripts/fetch-images.mjs` n'en a pas, il est fait
pour des recherches à la main.
