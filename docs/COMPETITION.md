# Reconnaissance de la concurrence — réparation de fondation, région de Québec

Relevé du 3 août 2026. Recherche organique en français, requêtes ciblant la ville de Québec et
la CMQ. **À revérifier avant le lancement** : ce marché bouge par acquisition d'entrepreneurs,
pas par publication de contenu, donc la structure ci-dessous est stable mais les noms peuvent
changer.

> ⚠ Aucune donnée de volume de recherche n'a été achetée. Tout ce qui suit décrit la
> **structure et la qualité** des sites en place, ce qui est observable directement. Les
> estimations de volume dans `SEO-PLAN.md` sont marquées comme telles et ne doivent pas être
> présentées comme mesurées.

---

## 1. Les quatre couches de la SERP

Sur presque toutes les requêtes commerciales de cette niche à Québec, la page 1 se décompose
ainsi :

| Couche | Qui | Ce qu'ils possèdent | Peut-on les battre ? |
|---|---|---|---|
| **A. Pack local / Maps** | entrepreneurs avec fiche Google Business vérifiée | 3 places + les étoiles | **Non.** Pas de fiche → pas de pack. Plafond structurel connu du modèle (PLAYBOOK §1). |
| **B. Agrégateurs de soumissions** | soumissionrenovation.ca, soumissionsquebec.ca, trouveunpro.ca, xpertsource.com, constructionrenovation.com, soumissionspaysagistes.com | les requêtes **prix / coût** au national | Pas au national. **Oui au niveau régional et sectoriel** — ils n'écrivent jamais « prix drain français Charlesbourg ». |
| **C. Entrepreneurs réels de Québec** | Drainage Québec (Excavation René Morency), Drain Québec, Excavation Construction LR, Excavation JF Caron, Isolation Nouvelle-France, SNV Constructions, Expert Drainage Québec, G Solutions Fissures | les requêtes de marque + un peu de longue traîne géo | **Oui.** C'est la cible. Détail en §2. |
| **D. Réseaux nationaux de fissures** | fissuredefondation.ca, reparationfissurefondation.ca, fissuredebeton.ca (Groupe Fissure Provincial), Systèmes Sous-sols Québec | les requêtes « fissure » génériques via des réseaux de pages-villes | Partiellement. Ils ont l'antériorité mais leurs pages-villes sont des pages-portails. |
| **E. Institutionnel / sans intention commerciale** | ACQC, RBQ, BNQ, SHQ, Éducaloi, CAA-Québec | les requêtes réglementaires | Non, et **il ne faut pas essayer** : ce sont nos sources à citer, pas nos concurrents. |

---

## 2. Qualité réelle des concurrents directs — ce qui a été vérifié

**Échantillon vérifié en profondeur : `drainquebec.com/drain-francais-sainte-foy/`.** C'est le
concurrent le plus proche structurellement, parce que c'est exactement le patron qu'on va
construire : un entrepreneur de Québec avec des pages `service × secteur`.

Constat :

- **350 à 400 mots** de corps de texte.
- **Le nom du secteur apparaît dans le titre et la première ligne. C'est tout.** Aucune rue,
  aucun type de sol, aucune époque de construction, aucune référence municipale. Le reste est
  du texte générique applicable à n'importe quelle municipalité du Québec.
- FAQ présente : 4 questions, toutes commerciales (délais, gratuité, urgence). Aucune question
  technique ou réglementaire.
- Une seule référence réglementaire sur toute la page : le numéro de licence RBQ en pied de
  page. **Aucune mention de la norme BNQ 3661-500**, aucune mention de permis municipal.
- **Aucun maillage interne entre les pages de secteurs.** La navigation compte 5 liens
  (Accueil, Services, À propos, Projets, Soumission). Les pages-secteurs sont des feuilles
  isolées.

C'est le profil type de la couche C et D. Ces pages passeraient toutes en échec sur nos trois
portes : `MIN_WORDS 400`, `MIN_LOCAL_FACTS 5`, `MIN_FAQ 4`, et surtout `MAX_SIMILARITY 0.35`
entre sœurs.

**Ce que ça veut dire concrètement :** notre avantage n'est pas d'écrire mieux, c'est d'écrire
**une chose différente par secteur**. Le concurrent a déjà occupé le terrain avec des pages
identiques ; il ne peut pas se défendre contre une page qui explique *pourquoi le problème se
présente ici et pas ailleurs*.

---

## 3. Où sont les trous — par ordre de facilité

1. **La géologie locale n'est écrite nulle part.** Personne dans la couche C/D n'explique
   l'argile de la mer de Champlain, le till, le roc affleurant de la Haute-Saint-Charles, ni
   les sols sableux ferrugineux. C'est pourtant le mécanisme qui explique tout le reste. Un
   `whyHere` par secteur est un contenu que personne n'a.
2. **L'ocre ferreuse est sous-traitée.** Quelques pages existent (SOS Sous-sol, ACQC, Goudrons
   du Québec, Drainage Québec), mais presque personne ne relie **ocre ferreuse → norme
   BNQ 3661-500 → drain à parois lisses + cheminées d'accès → entretien récurrent**. C'est le
   sujet le plus technique de la niche et le moins bien couvert. **Priorité 1 du moat.**
3. **La norme BNQ 3661-500 n'est presque jamais citée.** Un propriétaire qui fait remplacer un
   drain en 2026 ne sait pas qu'une norme définit le produit. C'est exactement le type de fait
   public vérifiable et exigible que le PLAYBOOK §5 décrit comme différenciateur.
4. **Le volet réglementaire est absent partout.** Licence RBQ (quelle sous-catégorie pour quel
   travail), permis municipal d'excavation près d'une fondation, garantie GCR pour le neuf,
   obligations du vendeur au moment d'une vente. Zéro couverture sérieuse dans la couche C.
5. **Les requêtes « prix » au niveau régional.** Les agrégateurs de la couche B publient des
   fourchettes *nationales*. Personne ne publie « ce qui fait varier le prix **à Québec** » —
   accès à la cour, mitoyenneté du Vieux-Québec, profondeur de gel, présence d'ocre.
6. **Le vocabulaire réel des gens.** « solage fissuré », « eau dans le sous-sol au printemps »,
   « craque dans le solage », « mon drain est bouché ». Les concurrents écrivent le vocabulaire
   d'entrepreneur, pas celui du propriétaire paniqué.
7. **L'anglais est quasi inexistant.** Aucun concurrent régional sérieux n'a de version
   anglaise. Marché petit à Québec, mais concurrence ≈ 0 et notre coût marginal est faible
   puisque le système FR/EN est déjà construit.
8. **La saisonnalité n'est exploitée par personne.** Fonte des neiges (mars-avril) et gel
   (novembre) sont les deux pics d'intention réels. Aucun contenu ne s'aligne dessus.

---

## 4. Ce qu'il ne faut PAS attaquer

- **La pyrite comme sujet principal.** Le gonflement du remblai de pierre par la pyrite est
  massivement un problème de la **Montérégie et de la couronne de Montréal** (shales des
  basses-terres). Sur la CMQ, c'est un sujet de **transaction immobilière** (« faut-il faire un
  test avant d'acheter ? »), pas un sujet de volume de travaux. → une page informative, pas un
  hub, et **aucune page pyrite × secteur**.
- **La pyrrhotite.** C'est la Mauricie / Trois-Rivières. Rien à faire sur un site de Québec.
  Ne pas confondre les deux minéraux : la pyrrhotite est dans le **béton** (granulat), la
  pyrite est dans le **remblai sous la dalle**.
- **La tête de requête « fondation Québec ».** Détenue par la couche A + D avec des années de
  citations. On ne la vise pas frontalement ; on la récolte par accumulation de longue traîne.
- **Le commercial / industriel.** Le brief est résidentiel. Un hub commercial supposerait des
  références de projets qu'on ne peut pas montrer.

---

## 5. Correction factuelle à porter au brief

Le brief mentionne « le protocole pyrite de l'IRSST ». La référence exacte est le
**protocole CTQ-M200** du *Comité technique québécois d'étude des problèmes de gonflement
associés à la pyrite*, qui établit l'**IPPG** (indice pétrographique du potentiel de
gonflement) sur un bâtiment existant. L'IRSST est l'institut en santé et sécurité du travail ;
ses méthodes analytiques sont citées dans un autre contexte (amiante, vermiculite). **Écrire
« protocole de l'IRSST » sur une page pyrite serait une erreur factuelle vérifiable et
citable contre nous.** Toutes les sources ci-dessous doivent être revalidées à la source
primaire avant publication.

---

## 6. Sources à vérifier en phase 2 avant tout usage sur une page

| Fait à citer | Source primaire à ouvrir | Statut |
|---|---|---|
| Sous-catégories de licence RBQ applicables | `rbq.gouv.qc.ca/sous-categories` — Annexe I officielle (PDF) | ✅ **VÉRIFIÉ le 4 août 2026 à la source.** Détail ci-dessous. |
| Norme BNQ 3661-500 (drains de fondation, ocre ferreuse) | `bnq.qc.ca` — fiche de la norme, date de publication (février 2012) | à confirmer |
| Protocole CTQ-M200 et IPPG | ACQC + laboratoires accrédités | à confirmer |
| Programme d'aide pyrite | SHQ / gouvernement du Québec | vérifier s'il est **encore actif en 2026** |
| Garantie de construction résidentielle (GCR) — couverture des fondations, délais | `garantiegcr.com` | à confirmer |
| Profondeur de gel exigée pour une semelle dans la région | Code de construction du Québec, chap. I – Bâtiment + règlements municipaux | à confirmer |
| Permis d'excavation près d'une fondation | Ville de Québec + Ville de Lévis, règlements d'urbanisme | à confirmer, **varie par municipalité** |
| Fourchettes de prix | agrégateurs + au moins une source croisée ; sinon `null` + note `TODO:` | à confirmer |

**Règle :** un chiffre sans source primaire vaut `null` et la page écrit « aucune fourchette
publiée ». Voir PLAYBOOK §2, « honest nulls ».

---

## 7. Licences RBQ — vérifié à la source, texte officiel

Source : Régie du bâtiment du Québec, *Liste des sous-catégories de licence*, annexes I à III
(`rbq.gouv.qc.ca/sous-categories`). Extraits **textuels**. C'est ce corpus qui alimente le
volet réglementaire du site, et il **corrige le brief** : « 2.5 / 2.6 / 3.1 » circulait sur des
blogues d'agrégateurs et n'est ni complet ni exact pour du résidentiel.

| N° | Titre officiel | Ce que la RBQ dit qu'elle autorise (extrait) | Ce que ça couvre chez nous |
|---|---|---|---|
| **2.5** | Excavation et terrassement | « le creusage, le déplacement, le compactage, le nivelage de terre ou de matériaux granulaires y compris les travaux relatifs aux petits ouvrages d'art » | **Drain français**, excavation périmétrique, remblai, pentes de terrain |
| **2.6** | Pieux et fondations spéciales | « la mécanique des sols, tels les pieux et les caissons, le soutènement des excavations, les tirants d'ancrage, **la reprise en sous-œuvre** ou l'injection dans les sols et le roc » | **Affaissement**, pieux vissés, stabilisation, sous-œuvre |
| **3.2** | Petits ouvrages de béton | « le coffrage à béton pour les assises et **les murs de fondation** de bâtiments visés à la partie 9 du Code national du bâtiment […], bétonnage, armature et finition de béton » | **La fondation résidentielle proprement dite** — c'est 3.2, pas 3.1 |
| **3.1** | Structures de béton | « le béton structural coulé ou préfabriqué » ; autorise aussi la 3.2 | Multi-logements, structures — rarement le résidentiel visé par la partie 9 |
| **7** | Isolation, étanchéité, couvertures et revêtement extérieur | « l'ignifugation, **l'étanchéité**, l'isolation, le calorifugeage, les couvertures, le revêtement mural extérieur autre qu'en maçonnerie » | **Imperméabilisation / membrane** — personne ne cite cette sous-catégorie |
| **4.2** | Travaux de maçonnerie non structurale | maçonnerie non structurale, marbre, granit | Réparation de fondations de pierre (Vieux-Québec, Saint-Roch) |

**Trois faits que la structure des annexes révèle, et que personne n'écrit :**

1. **La 2.5 (excavation) relève de l'annexe III**, dont la RBQ dit noir sur blanc : *« Ces
   sous-catégories ne nécessitent pas une évaluation de la compétence en exécution de travaux
   de construction. »* La **2.6 relève de l'annexe II** et exige, elle, cette évaluation.
   Autrement dit : **détenir une licence d'excavation n'atteste d'aucune compétence évaluée en
   exécution.** C'est un fait public, vérifiable, directement utile au propriétaire — et c'est
   probablement l'information la plus précieuse de tout le site. → `/blogue/verifier-licence-rbq-entrepreneur/`.
2. **Un chantier de fondation ordinaire touche souvent 3 sous-catégories** (2.5 + 3.2 + 7).
   Un entrepreneur peut être parfaitement licencié pour creuser et pas du tout pour la
   membrane. Le propriétaire a le droit de le demander.
3. **La 2.6 mentionne explicitement « la reprise en sous-œuvre »** — le terme officiel pour la
   stabilisation d'une fondation qui s'affaisse. Utiliser le vocabulaire de la RBQ dans le hub
   `affaissement-de-fondation` aligne la page sur le corpus réglementaire.

**Formulation obligatoire (règle 1).** Jamais « nous détenons la licence 2.6 ». Toujours :
« demandez le numéro de licence RBQ, vérifiez-le au registre public, et vérifiez que les
sous-catégories couvrent bien les travaux à faire. »

---

## Sources consultées

- [fissuredefondation.ca](https://fissuredefondation.ca/) · [reparationfissurefondation.ca](https://reparationfissurefondation.ca/) · [fissuredebeton.ca](https://fissuredebeton.ca/) · [systemessoussolsquebec.ca](https://www.systemessoussolsquebec.ca/reparation-de-fondations.html)
- [drainquebec.com — Sainte-Foy](https://drainquebec.com/drain-francais-sainte-foy/) *(échantillon analysé en profondeur)* · [drainagequebec.com](https://www.drainagequebec.com/) · [expertdrainagequebec.com](https://expertdrainagequebec.com/) · [excavationlr.com](https://excavationlr.com/drain-et-impermeabilisation-a-quebec-et-levis/) · [excavationjfcaron.com](https://excavationjfcaron.com/nos-services/impermeabilisation-de-fondation/) · [isolationnf.com](https://isolationnf.com/impermeabilisation-de-fondation-quebec/) · [snvconstructions.com](https://snvconstructions.com/) · [g-solutionsfissures.com](https://g-solutionsfissures.com/)
- Agrégateurs : [soumissionrenovation.ca](https://soumissionrenovation.ca/fr/blogue/quel-est-le-prix-dune-reparation-de-fissure-de-fondation-au-quebec-en-2024-2025) · [soumissionsquebec.ca](https://soumissionsquebec.ca/drain-francais/) · [trouveunpro.ca](https://trouveunpro.ca/drain-francais/) · [xpertsource.com](https://xpertsource.com/blogue/inspecteur-batiment/pyrite-maison-que-faire) · [constructionrenovation.com](https://www.constructionrenovation.com/drain-francais-quebec/)
- Ocre ferreuse et BNQ : [ACQC — ocre ferreuse](https://www.acqc.ca/fr/ocre-ferreuse) · [sossoussol.ca](https://sossoussol.ca/ocre-ferreuse/) · [vopaa.com — drain BNQ](https://vopaa.com/en/french-drain-specialist/the-french-drain-bnq-the-solution-against-ferous-ochre/) · [drainage-quebec.com](https://www.drainage-quebec.com/conseils/ques-ce-que-locre-ferreuse)
- Pyrite : [ACQC — pyrite](https://www.acqc.ca/fr/pyrite) · [inspection.quebec](https://inspection.quebec/la-pyrite/) · [inspectionsgarceau.com — CTQ-M200](https://www.inspectionsgarceau.com/pyrite)
