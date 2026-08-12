# DESIGN — marque, palette, typographie, images

Décisions de la session 0b. Elles alimentent la phase 1 (tokens, layout) et la phase 3
(images). **Le design doit être visiblement différent d'`exterminateur-qc.ca`** : les deux
sites seront loués à des entreprises distinctes.

---

## 1. Nom de marque : **Solage Capitale**

`Organization.name = "Solage Capitale"`. Le domaine reste à choisir.

**Pourquoi ce nom**

- **« Solage »** est le mot québécois pour la fondation d'une maison, et c'est un **terme que
  les gens tapent réellement** : « solage fissuré », « craque dans le solage ». Le nom de
  marque porte donc un mot-clé vernaculaire, ce qu'un nom abstrait ne ferait pas.
- **« Capitale »** ancre la région (Capitale-Nationale) sans se limiter à un secteur — Lévis et
  la Rive-Sud restent couverts, contrairement à un nom en « Beauport » ou « Cap-Rouge ».
- Vérifié : aucune entreprise québécoise de ce nom. Les seules collisions sont
  *Solage Capital LLC* (immobilier, New York) et *Solage Solide* (fissures, Pierrefonds-Roxboro,
  région de Montréal) — ni le même nom, ni le même marché. *La Capitale* est un assureur, pas
  un homonyme.

**Pourquoi PAS « Fondation … »** — piège trouvé en vérifiant : en français, **« Fondation X »
désigne un organisme de bienfaisance**. *Fondation Cap-Diamant* existe déjà à Québec et est
une fondation caritative pour aînés, sur exactement notre territoire (CMQ + Île d'Orléans +
Côte-de-Beaupré). Un nom commençant par « Fondation » nous ferait concurrencer des œuvres de
charité dans la SERP et brouillerait l'intention de recherche. **Ne pas revenir sur ce point.**

*Solution de repli si un locataire trouve « solage » trop familier :* **Assise Capitale**
(« assise » = la semelle, la base) — zéro collision sur le web, plus corporatif, mais aucune
valeur de mot-clé. Décision réversible tant que le domaine n'est pas acheté.

---

## 2. Palette — « ardoise et rouille »

Le sujet, c'est la roche, le béton et l'oxydation du fer (ocre ferreuse). La palette le dit
littéralement. Aucun bleu de service, aucun vert « éco », aucun jaune de chantier — ce sont
les trois clichés de la niche.

**Tous les ratios ci-dessous ont été calculés, pas estimés.** AA = ≥ 4.5:1.

### Clair

| Token | Hex | Usage | Contraste |
|---|---|---|---|
| `--fond` | `#F6F5F2` | fond de page (calcaire, pas blanc) | — |
| `--surface` | `#FFFFFF` | cartes, encadrés | — |
| `--encre` | `#1B2127` | texte principal, titres | **14.9:1** sur fond |
| `--encre-2` | `#4A555F` | texte secondaire, légendes | **6.99:1** |
| `--bordure` | `#D8D5CE` | filets, séparateurs | — |
| `--primaire` | `#22333F` | barre de navigation, pied de page, boutons secondaires | blanc dessus : **13.0:1** |
| `--accent` | `#9C3D26` | liens, CTA, chiffres clés (rouille / ocre ferreuse) | **6.20:1** · blanc dessus **6.75:1** |
| `--accent-voile` | `#F2E6DF` | fond de bandeau d'accent | — |
| `--alerte` | `#8A5A00` | encadrés « à vérifier », mentions réglementaires | **5.44:1** |
| `--valide` | `#1F5D3C` | confirmations de formulaire | **7.16:1** |

### Sombre (`prefers-color-scheme` + `:root[data-theme]`)

| Token | Hex | Contraste |
|---|---|---|
| `--fond` | `#131A1F` | — |
| `--surface` | `#1B242B` | — |
| `--encre` | `#E8E9E6` | **14.4:1** sur fond · **12.9:1** sur surface |
| `--encre-2` | `#A9B4BC` | **8.32:1** |
| `--accent` | `#E08256` | **6.27:1** sur fond · **5.62:1** sur surface |
| `--alerte` | `#E0A73C` | **8.17:1** |
| `--valide` | `#6FBF8F` | **7.97:1** |

⚠ Rappel PLAYBOOK §8 : **les titres héritent la couleur** (`color: inherit`), jamais une
couleur figée — sinon le contraste casse dans les sections sombres.

---

## 3. Typographie

| Rôle | Police | Pourquoi | Poids fichier |
|---|---|---|---|
| Titres | **Bitter** (slab serif variable) | Un slab serif lit « document technique », pas « agence ». C'est le registre du site : des faits vérifiables, pas de la persuasion. Visuellement à l'opposé d'un sans friendly. | ~30 Ko woff2, sous-ensemble latin |
| Corps | **Public Sans** (variable) | Conçue pour la lisibilité de texte administratif long ; excellente en petites tailles ; accents complets. | ~28 Ko woff2, sous-ensemble latin |

Les deux sont sous licence SIL OFL, auto-hébergées, **sous-ensemble latin uniquement** (il
couvre é à è ç ô û). ~58 Ko au total, `font-display: swap`, préchargement du seul fichier de
corps.

**Justification du deuxième fichier** (PLAYBOOK §2 recommande un seul) : le contraste
slab/sans est ce qui distingue visuellement ce site du précédent, et 28 Ko supplémentaires en
`preload`-off ne bougent pas le LCP. À réévaluer si Lighthouse descend sous 100.

Mesure de lecture : **42rem, centrée (`mx-auto`)**. Le piège du PLAYBOOK §8 — une colonne de
42rem dans une section de 75rem sans `mx-auto` colle à gauche sur bureau et survit à la revue
parce que le mobile est correct.

---

## 4. Images — stratégie, aucune photo fournie

Aucun original n'est fourni. Tout vient d'archives libres. **Licence = bloqueur de lancement,
et elle suit l'actif jusqu'au locataire** (PLAYBOOK §9).

**Sources retenues, dans l'ordre :**

1. **Wikimedia Commons** — 6,2 M+ fichiers domaine public ou CC0. Catégories utiles repérées :
   `Construction excavations`, `Elements cast into concrete`, `Concrete columns`, `Manholes`,
   plus les catégories géographiques du Québec pour les photos de secteur.
2. **Archives publiques canadiennes et québécoises** (BAnQ, Ville de Québec) pour le bâti
   ancien — attention aux licences, qui ne sont pas toutes ouvertes.
3. **Illustration générée** en dernier recours, avec un alt honnête. **Jamais présentée comme
   « nos travaux »** (règle 1).

**Interdits sans appel :** Getty, iStock, Adobe Stock et tout site de banque « gratuite » sans
licence nommée et auteur nommé. Une licence exigeant l'attribution mais sans auteur nommé est
inutilisable — on la rejette (PLAYBOOK §9).

**Règles de recherche qui ont déjà payé (PLAYBOOK §9) :**

- Chercher **par sujet**, pas par nom de lieu. « fissure de retrait dans un mur de béton »
  donne des résultats ; « Charlesbourg » n'en donne aucun.
- **Piège toponymique :** exiger un marqueur régional (`Québec`, `Canada`) dans le titre pour
  toute photo de *lieu*. Pour une photo de *sujet* (une fissure, un tuyau de drain, de l'ocre),
  le lieu de prise de vue est sans importance.
- **Vérifier ce qu'il y a réellement sur la photo.** Le projet précédent a attrapé une « rue
  résidentielle » qui était un village allemand avec une enseigne lisible. Ici le risque
  équivalent : un « drain français » qui est un drain agricole, ou une « fissure de fondation »
  qui est un mur de soutènement.
- Réduire à ≤ 2400 px avant d'entrer dans `src/assets/`.

**Ce que le site n'aura pas, et c'est correct :** des photos de chantier. Chaque hub peut vivre
avec une photo de *sujet* (matériau, phénomène, sol) et un schéma. Une illustration honnête bat
une photo volée.

`PENDING_IMAGES=strict npm run audit` réarme la distinction des héros avant le lancement : ça
transforme « des placeholders partout » d'un état invisible en un nombre.
