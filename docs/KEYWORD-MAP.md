# KEYWORD-MAP — registre URL ↔ mot-clé

**Règle 2 : aucune page sans une ligne ici.** Une ligne peut exister en `planifié` ou
`candidat` ; c'est le seul moyen légitime de tenir une page en attente. Une page qui se
construit sans ligne est un bug de processus, pas un oubli.

Statuts : `planifié` (approuvé, pas encore écrit) · `candidat` (pas encore approuvé, non
constructible) · `écrit` · `rétrogradé` (devient une section, jamais une page) · `en ligne`.
Strates : A/B/C selon `tier` dans `cities.json`.

**Les blocs entre marqueurs `<!-- GEN:… -->` sont générés** par
`node scripts/keyword-map-gen.mjs` depuis `src/data/cities.json`. Ne pas les éditer à la main.

---

## 1. Accueil et pages utilitaires

| URL | Lang | Type | Mot-clé principal | Secondaires | Statut |
|---|---|---|---|---|---|
| `/` | fr | accueil | réparation de fondation Québec | drain français Québec · fissure de fondation Québec · sous-sol humide | écrit |
| `/soumission/` | fr | conversion | soumission réparation fondation Québec | soumission drain français · estimation fissure fondation | écrit |
| `/prix/` | fr | prix | prix réparation fondation Québec | coût drain français Québec · prix injection fissure · combien coûte refaire un drain | écrit |
| `/urgence/` | fr | urgence | eau dans le sous-sol Québec | sous-sol inondé · infiltration urgente fonte des neiges | écrit |
| `/processus/` | fr | confiance | étapes réparation de fondation | déroulement travaux drain français · à quoi s'attendre | écrit |
| `/territoire/` | fr | index géo | réparation de fondation région de Québec | secteurs desservis · Communauté métropolitaine de Québec | écrit |
| `/fondation/` | fr | index-service | réparation de fondation Québec services | drain français · fissure de fondation · imperméabilisation · ocre ferreuse | écrit |
| `/faq/` | fr | FAQ | questions fondation Québec | licence RBQ vérifier · norme drain français · garantie | écrit |
| `/a-propos/` | fr | confiance | service de mise en relation fondation Québec | comment fonctionne le service | écrit |
| `/contact/` | fr | légal | contact Solage Capitale | responsable de la protection des renseignements personnels | écrit |
| `/merci/` | fr | confirmation | *(noindex — page de retour du formulaire)* | — | écrit |
| `/conditions-utilisation/` | fr | légal | conditions d'utilisation | *(noindex non — indexable, mais sans cible commerciale)* | écrit |
| `/confidentialite/` | fr | légal | politique de confidentialité | — | écrit |
| `/plan-du-site/` | fr | index | plan du site | — | écrit |
| `/en/` | en | home | foundation repair Quebec City | french drain Quebec City · foundation crack repair | écrit |
| `/en/quote/` | en | conversion | foundation repair quote Quebec City | free estimate french drain | écrit |
| `/en/pricing/` | en | pricing | foundation repair cost Quebec | french drain replacement cost | écrit |
| `/en/emergency/` | en | emergency | water in basement Quebec City | flooded basement spring melt | écrit |
| `/en/process/` | en | trust | foundation repair process | what to expect french drain work | écrit |
| `/en/service-area/` | en | geo index | foundation repair Quebec City area | boroughs served | écrit |
| `/en/foundation/` | en | service-index | foundation repair services Quebec City | french drain · foundation crack repair · waterproofing · iron ochre | écrit |
| `/en/faq/` | en | FAQ | foundation questions Quebec | check RBQ licence · drain standard | écrit |
| `/en/about/` | en | trust | foundation referral service Quebec City | — | écrit |
| `/en/contact/` | en | legal | contact Solage Capitale | privacy officer | écrit |
| `/en/thank-you/` | en | confirmation | *(noindex — form return page)* | — | écrit |
| `/en/terms/` | en | legal | terms of use | — | écrit |
| `/en/privacy/` | en | legal | privacy policy | — | écrit |
| `/en/sitemap/` | en | index | sitemap | — | écrit |

⚠ `/conditions-utilisation/` et `/en/terms/` portent l'énoncé obligatoire : **service
publicitaire et de mise en relation, prestataire indépendant, aucun avis technique ou
d'ingénierie**. Ce n'est pas une page de remplissage.

⚠ **`/contact/` a été reclassée de `conversion` à `légal` le 2026-08-11.** Ce n'est pas une
page de conversion et elle ne doit jamais en devenir une : elle existe parce que
`/confidentialite/` promet un droit d'accès, de rectification et de suppression, et que la loi
québécoise exige un **responsable identifiable** pour l'exercer (`HANDOFF-TENANT.md` §4.1). Y
poser un formulaire de soumission, un appel à l'action ou une promesse de rappel diluerait la
seule chose qu'elle doit dire. La demande de soumission a sa page : `/soumission/`.

⚠ **`/merci/` et `/en/thank-you/` sont `noindex` et n'ont pas de mot-clé.** Ce sont les cibles
du 303 de `worker/lead-form.ts` après un envoi réussi. Elles ne figuraient nulle part avant le
2026-08-11 : le Worker redirigeait vers deux URL qui **n'existaient pas**, donc une soumission
réussie aboutissait à un 404. Elles ne sont liées depuis aucune page — c'est voulu, on n'atteint
`/merci/` qu'en ayant envoyé le formulaire — et elles sont donc exclues de `/plan-du-site/`.

---

## 2. Hubs de service (11 × 2)

| URL | Lang | Type | Mot-clé principal | Secondaires | Statut |
|---|---|---|---|---|---|
| `/fondation/fissure-de-fondation/` | fr | hub-service | réparation fissure de fondation Québec | solage fissuré · craque dans le béton · injection polyuréthane · fissure en escalier · fissure de retrait | planifié |
| `/fondation/drain-francais/` | fr | hub-service | drain français Québec | remplacement drain de fondation · norme BNQ 3661-500 · drain bouché · durée de vie d'un drain | planifié |
| `/fondation/impermeabilisation-de-fondation/` | fr | hub-service | imperméabilisation de fondation Québec | membrane élastomère fondation · goudron fondation · margelle et pente de terrain | planifié |
| `/fondation/infiltration-eau-sous-sol/` | fr | hub-service | infiltration d'eau au sous-sol Québec | eau dans le sous-sol au printemps · pression hydrostatique · sous-sol qui coule | planifié |
| `/fondation/ocre-ferreuse/` | fr | hub-service | ocre ferreuse Québec | drain colmaté ocre · dépôt orange drain · BNQ 3661-500 · bactéries ferrugineuses | planifié |
| `/fondation/affaissement-de-fondation/` | fr | hub-service | affaissement de fondation Québec | mur de fondation bombé · tassement différentiel · pieux vissés · sous-œuvre | planifié |
| `/fondation/humidite-et-moisissure-sous-sol/` | fr | hub-service | humidité au sous-sol Québec | remontée capillaire · efflorescence sur béton · odeur de terre sous-sol · moisissure | planifié |
| `/fondation/pompe-de-puisard-et-drain-interieur/` | fr | hub-service | pompe de puisard Québec | drain intérieur sous dalle · fosse de retenue · refoulement | planifié |
| `/fondation/vide-sanitaire/` | fr | hub-service | vide sanitaire humide Québec | assainissement vide sanitaire · pare-vapeur au sol | planifié |
| `/fondation/inspection-de-drain-par-camera/` | fr | hub-service | inspection de drain par caméra Québec | vérifier l'état d'un drain français · inspection avant achat | planifié |
| `/fondation/pyrite/` | fr | hub-service | pyrite sous la dalle Québec | test pyrite CTQ-M200 · IPPG · gonflement du remblai · pyrite avant achat | planifié |
| `/en/foundation/foundation-crack-repair/` | en | service-hub | foundation crack repair Quebec City | concrete crack injection · stair-step crack · shrinkage crack | planifié |
| `/en/foundation/french-drain/` | en | service-hub | french drain Quebec City | foundation drain replacement · BNQ 3661-500 standard · clogged drain | planifié |
| `/en/foundation/foundation-waterproofing/` | en | service-hub | foundation waterproofing Quebec City | elastomeric membrane · exterior waterproofing · grading and window wells | planifié |
| `/en/foundation/basement-water-infiltration/` | en | service-hub | basement water infiltration Quebec City | water in basement spring · hydrostatic pressure | planifié |
| `/en/foundation/iron-ochre/` | en | service-hub | iron ochre Quebec City | ochre clogged drain · orange sludge in drain · iron bacteria | planifié |
| `/en/foundation/foundation-settlement/` | en | service-hub | foundation settlement Quebec City | bowing foundation wall · differential settlement · helical piles · underpinning | planifié |
| `/en/foundation/basement-humidity-and-mould/` | en | service-hub | basement humidity Quebec City | rising damp · efflorescence on concrete · musty basement smell | planifié |
| `/en/foundation/sump-pump-and-interior-drain/` | en | service-hub | sump pump Quebec City | interior drain under slab · sump pit · backflow | planifié |
| `/en/foundation/crawl-space/` | en | service-hub | crawl space moisture Quebec City | crawl space encapsulation · ground vapour barrier | planifié |
| `/en/foundation/drain-camera-inspection/` | en | service-hub | drain camera inspection Quebec City | check french drain condition · pre-purchase inspection | planifié |
| `/en/foundation/pyrite/` | en | service-hub | pyrite under slab Quebec | CTQ-M200 pyrite test · IPPG · swelling backfill | planifié |

---

## 3. Hubs de secteur (51 × 2) — généré

<!-- GEN:sectors -->
_102 lignes générées depuis `src/data/cities.json` par `scripts/keyword-map-gen.mjs`. Ne pas éditer à la main._

| URL | Lang | Type | Mot-clé principal | Secondaires | Strate | Statut |
|---|---|---|---|---|---|---|
| `/secteurs/beauport/` | fr | hub-secteur | réparation de fondation Beauport | drain français Beauport · fissure fondation Beauport · infiltration d'eau sous-sol Beauport · entrepreneur fondation Beauport | A | planifié |
| `/en/areas/beauport/` | en | area-hub | foundation repair Beauport | french drain Beauport · foundation crack Beauport · basement water infiltration Beauport | A | planifié |
| `/secteurs/charlesbourg/` | fr | hub-secteur | réparation de fondation Charlesbourg | drain français Charlesbourg · fissure fondation Charlesbourg · infiltration d'eau sous-sol Charlesbourg · entrepreneur fondation Charlesbourg | A | planifié |
| `/en/areas/charlesbourg/` | en | area-hub | foundation repair Charlesbourg | french drain Charlesbourg · foundation crack Charlesbourg · basement water infiltration Charlesbourg | A | planifié |
| `/secteurs/la-cite-limoilou/` | fr | hub-secteur | réparation de fondation La Cité-Limoilou | drain français La Cité-Limoilou · fissure fondation La Cité-Limoilou · infiltration d'eau sous-sol La Cité-Limoilou · entrepreneur fondation La Cité-Limoilou | A | planifié |
| `/en/areas/la-cite-limoilou/` | en | area-hub | foundation repair La Cité-Limoilou | french drain La Cité-Limoilou · foundation crack La Cité-Limoilou · basement water infiltration La Cité-Limoilou | A | planifié |
| `/secteurs/la-haute-saint-charles/` | fr | hub-secteur | réparation de fondation La Haute-Saint-Charles | drain français La Haute-Saint-Charles · fissure fondation La Haute-Saint-Charles · infiltration d'eau sous-sol La Haute-Saint-Charles · entrepreneur fondation La Haute-Saint-Charles | A | planifié |
| `/en/areas/la-haute-saint-charles/` | en | area-hub | foundation repair La Haute-Saint-Charles | french drain La Haute-Saint-Charles · foundation crack La Haute-Saint-Charles · basement water infiltration La Haute-Saint-Charles | A | planifié |
| `/secteurs/les-rivieres/` | fr | hub-secteur | réparation de fondation Les Rivières | drain français Les Rivières · fissure fondation Les Rivières · infiltration d'eau sous-sol Les Rivières · entrepreneur fondation Les Rivières | A | planifié |
| `/en/areas/les-rivieres/` | en | area-hub | foundation repair Les Rivières | french drain Les Rivières · foundation crack Les Rivières · basement water infiltration Les Rivières | A | planifié |
| `/secteurs/levis/` | fr | hub-secteur | réparation de fondation Lévis | drain français Lévis · fissure fondation Lévis · infiltration d'eau sous-sol Lévis · entrepreneur fondation Lévis | A | planifié |
| `/en/areas/levis/` | en | area-hub | foundation repair Lévis | french drain Lévis · foundation crack Lévis · basement water infiltration Lévis | A | planifié |
| `/secteurs/sainte-foy-sillery-cap-rouge/` | fr | hub-secteur | réparation de fondation Sainte-Foy–Sillery–Cap-Rouge | drain français Sainte-Foy–Sillery–Cap-Rouge · fissure fondation Sainte-Foy–Sillery–Cap-Rouge · infiltration d'eau sous-sol Sainte-Foy–Sillery–Cap-Rouge · entrepreneur fondation Sainte-Foy–Sillery–Cap-Rouge | A | planifié |
| `/en/areas/sainte-foy-sillery-cap-rouge/` | en | area-hub | foundation repair Sainte-Foy–Sillery–Cap-Rouge | french drain Sainte-Foy–Sillery–Cap-Rouge · foundation crack Sainte-Foy–Sillery–Cap-Rouge · basement water infiltration Sainte-Foy–Sillery–Cap-Rouge | A | planifié |
| `/secteurs/beaupre/` | fr | hub-secteur | réparation de fondation Beaupré | drain français Beaupré · fissure fondation Beaupré · infiltration d'eau sous-sol Beaupré · entrepreneur fondation Beaupré | B | planifié |
| `/en/areas/beaupre/` | en | area-hub | foundation repair Beaupré | french drain Beaupré · foundation crack Beaupré · basement water infiltration Beaupré | B | planifié |
| `/secteurs/boischatel/` | fr | hub-secteur | réparation de fondation Boischatel | drain français Boischatel · fissure fondation Boischatel · infiltration d'eau sous-sol Boischatel · entrepreneur fondation Boischatel | B | planifié |
| `/en/areas/boischatel/` | en | area-hub | foundation repair Boischatel | french drain Boischatel · foundation crack Boischatel · basement water infiltration Boischatel | B | planifié |
| `/secteurs/chateau-richer/` | fr | hub-secteur | réparation de fondation Château-Richer | drain français Château-Richer · fissure fondation Château-Richer · infiltration d'eau sous-sol Château-Richer · entrepreneur fondation Château-Richer | B | planifié |
| `/en/areas/chateau-richer/` | en | area-hub | foundation repair Château-Richer | french drain Château-Richer · foundation crack Château-Richer · basement water infiltration Château-Richer | B | planifié |
| `/secteurs/fossambault-sur-le-lac/` | fr | hub-secteur | réparation de fondation Fossambault-sur-le-Lac | drain français Fossambault-sur-le-Lac · fissure fondation Fossambault-sur-le-Lac · infiltration d'eau sous-sol Fossambault-sur-le-Lac · entrepreneur fondation Fossambault-sur-le-Lac | B | planifié |
| `/en/areas/fossambault-sur-le-lac/` | en | area-hub | foundation repair Fossambault-sur-le-Lac | french drain Fossambault-sur-le-Lac · foundation crack Fossambault-sur-le-Lac · basement water infiltration Fossambault-sur-le-Lac | B | planifié |
| `/secteurs/ile-dorleans/` | fr | hub-secteur | réparation de fondation Île d'Orléans | drain français Île d'Orléans · fissure fondation Île d'Orléans · infiltration d'eau sous-sol Île d'Orléans · entrepreneur fondation Île d'Orléans | B | planifié |
| `/en/areas/ile-dorleans/` | en | area-hub | foundation repair Île d'Orléans | french drain Île d'Orléans · foundation crack Île d'Orléans · basement water infiltration Île d'Orléans | B | planifié |
| `/secteurs/lac-beauport/` | fr | hub-secteur | réparation de fondation Lac-Beauport | drain français Lac-Beauport · fissure fondation Lac-Beauport · infiltration d'eau sous-sol Lac-Beauport · entrepreneur fondation Lac-Beauport | B | planifié |
| `/en/areas/lac-beauport/` | en | area-hub | foundation repair Lac-Beauport | french drain Lac-Beauport · foundation crack Lac-Beauport · basement water infiltration Lac-Beauport | B | planifié |
| `/secteurs/lac-delage/` | fr | hub-secteur | réparation de fondation Lac-Delage | drain français Lac-Delage · fissure fondation Lac-Delage · infiltration d'eau sous-sol Lac-Delage · entrepreneur fondation Lac-Delage | B | planifié |
| `/en/areas/lac-delage/` | en | area-hub | foundation repair Lac-Delage | french drain Lac-Delage · foundation crack Lac-Delage · basement water infiltration Lac-Delage | B | planifié |
| `/secteurs/lancienne-lorette/` | fr | hub-secteur | réparation de fondation L'Ancienne-Lorette | drain français L'Ancienne-Lorette · fissure fondation L'Ancienne-Lorette · infiltration d'eau sous-sol L'Ancienne-Lorette · entrepreneur fondation L'Ancienne-Lorette | B | planifié |
| `/en/areas/lancienne-lorette/` | en | area-hub | foundation repair L'Ancienne-Lorette | french drain L'Ancienne-Lorette · foundation crack L'Ancienne-Lorette · basement water infiltration L'Ancienne-Lorette | B | planifié |
| `/secteurs/lange-gardien/` | fr | hub-secteur | réparation de fondation L'Ange-Gardien | drain français L'Ange-Gardien · fissure fondation L'Ange-Gardien · infiltration d'eau sous-sol L'Ange-Gardien · entrepreneur fondation L'Ange-Gardien | B | planifié |
| `/en/areas/lange-gardien/` | en | area-hub | foundation repair L'Ange-Gardien | french drain L'Ange-Gardien · foundation crack L'Ange-Gardien · basement water infiltration L'Ange-Gardien | B | planifié |
| `/secteurs/saint-augustin-de-desmaures/` | fr | hub-secteur | réparation de fondation Saint-Augustin-de-Desmaures | drain français Saint-Augustin-de-Desmaures · fissure fondation Saint-Augustin-de-Desmaures · infiltration d'eau sous-sol Saint-Augustin-de-Desmaures · entrepreneur fondation Saint-Augustin-de-Desmaures | B | planifié |
| `/en/areas/saint-augustin-de-desmaures/` | en | area-hub | foundation repair Saint-Augustin-de-Desmaures | french drain Saint-Augustin-de-Desmaures · foundation crack Saint-Augustin-de-Desmaures · basement water infiltration Saint-Augustin-de-Desmaures | B | planifié |
| `/secteurs/saint-ferreol-les-neiges/` | fr | hub-secteur | réparation de fondation Saint-Ferréol-les-Neiges | drain français Saint-Ferréol-les-Neiges · fissure fondation Saint-Ferréol-les-Neiges · infiltration d'eau sous-sol Saint-Ferréol-les-Neiges · entrepreneur fondation Saint-Ferréol-les-Neiges | B | planifié |
| `/en/areas/saint-ferreol-les-neiges/` | en | area-hub | foundation repair Saint-Ferréol-les-Neiges | french drain Saint-Ferréol-les-Neiges · foundation crack Saint-Ferréol-les-Neiges · basement water infiltration Saint-Ferréol-les-Neiges | B | planifié |
| `/secteurs/saint-gabriel-de-valcartier/` | fr | hub-secteur | réparation de fondation Saint-Gabriel-de-Valcartier | drain français Saint-Gabriel-de-Valcartier · fissure fondation Saint-Gabriel-de-Valcartier · infiltration d'eau sous-sol Saint-Gabriel-de-Valcartier · entrepreneur fondation Saint-Gabriel-de-Valcartier | B | planifié |
| `/en/areas/saint-gabriel-de-valcartier/` | en | area-hub | foundation repair Saint-Gabriel-de-Valcartier | french drain Saint-Gabriel-de-Valcartier · foundation crack Saint-Gabriel-de-Valcartier · basement water infiltration Saint-Gabriel-de-Valcartier | B | planifié |
| `/secteurs/sainte-anne-de-beaupre/` | fr | hub-secteur | réparation de fondation Sainte-Anne-de-Beaupré | drain français Sainte-Anne-de-Beaupré · fissure fondation Sainte-Anne-de-Beaupré · infiltration d'eau sous-sol Sainte-Anne-de-Beaupré · entrepreneur fondation Sainte-Anne-de-Beaupré | B | planifié |
| `/en/areas/sainte-anne-de-beaupre/` | en | area-hub | foundation repair Sainte-Anne-de-Beaupré | french drain Sainte-Anne-de-Beaupré · foundation crack Sainte-Anne-de-Beaupré · basement water infiltration Sainte-Anne-de-Beaupré | B | planifié |
| `/secteurs/sainte-brigitte-de-laval/` | fr | hub-secteur | réparation de fondation Sainte-Brigitte-de-Laval | drain français Sainte-Brigitte-de-Laval · fissure fondation Sainte-Brigitte-de-Laval · infiltration d'eau sous-sol Sainte-Brigitte-de-Laval · entrepreneur fondation Sainte-Brigitte-de-Laval | B | planifié |
| `/en/areas/sainte-brigitte-de-laval/` | en | area-hub | foundation repair Sainte-Brigitte-de-Laval | french drain Sainte-Brigitte-de-Laval · foundation crack Sainte-Brigitte-de-Laval · basement water infiltration Sainte-Brigitte-de-Laval | B | planifié |
| `/secteurs/sainte-catherine-de-la-jacques-cartier/` | fr | hub-secteur | réparation de fondation Sainte-Catherine-de-la-Jacques-Cartier | drain français Sainte-Catherine-de-la-Jacques-Cartier · fissure fondation Sainte-Catherine-de-la-Jacques-Cartier · infiltration d'eau sous-sol Sainte-Catherine-de-la-Jacques-Cartier · entrepreneur fondation Sainte-Catherine-de-la-Jacques-Cartier | B | planifié |
| `/en/areas/sainte-catherine-de-la-jacques-cartier/` | en | area-hub | foundation repair Sainte-Catherine-de-la-Jacques-Cartier | french drain Sainte-Catherine-de-la-Jacques-Cartier · foundation crack Sainte-Catherine-de-la-Jacques-Cartier · basement water infiltration Sainte-Catherine-de-la-Jacques-Cartier | B | planifié |
| `/secteurs/shannon/` | fr | hub-secteur | réparation de fondation Shannon | drain français Shannon · fissure fondation Shannon · infiltration d'eau sous-sol Shannon · entrepreneur fondation Shannon | B | planifié |
| `/en/areas/shannon/` | en | area-hub | foundation repair Shannon | french drain Shannon · foundation crack Shannon · basement water infiltration Shannon | B | planifié |
| `/secteurs/stoneham-et-tewkesbury/` | fr | hub-secteur | réparation de fondation Stoneham-et-Tewkesbury | drain français Stoneham-et-Tewkesbury · fissure fondation Stoneham-et-Tewkesbury · infiltration d'eau sous-sol Stoneham-et-Tewkesbury · entrepreneur fondation Stoneham-et-Tewkesbury | B | planifié |
| `/en/areas/stoneham-et-tewkesbury/` | en | area-hub | foundation repair Stoneham-et-Tewkesbury | french drain Stoneham-et-Tewkesbury · foundation crack Stoneham-et-Tewkesbury · basement water infiltration Stoneham-et-Tewkesbury | B | planifié |
| `/secteurs/wendake/` | fr | hub-secteur | réparation de fondation Wendake | drain français Wendake · fissure fondation Wendake · infiltration d'eau sous-sol Wendake · entrepreneur fondation Wendake | B | planifié |
| `/en/areas/wendake/` | en | area-hub | foundation repair Wendake | french drain Wendake · foundation crack Wendake · basement water infiltration Wendake | B | planifié |
| `/secteurs/breakeyville/` | fr | hub-secteur | réparation de fondation Breakeyville | drain français Breakeyville · fissure fondation Breakeyville · infiltration d'eau sous-sol Breakeyville · entrepreneur fondation Breakeyville | C | planifié |
| `/en/areas/breakeyville/` | en | area-hub | foundation repair Breakeyville | french drain Breakeyville · foundation crack Breakeyville · basement water infiltration Breakeyville | C | planifié |
| `/secteurs/cap-rouge/` | fr | hub-secteur | réparation de fondation Cap-Rouge | drain français Cap-Rouge · fissure fondation Cap-Rouge · infiltration d'eau sous-sol Cap-Rouge · entrepreneur fondation Cap-Rouge | C | planifié |
| `/en/areas/cap-rouge/` | en | area-hub | foundation repair Cap-Rouge | french drain Cap-Rouge · foundation crack Cap-Rouge · basement water infiltration Cap-Rouge | C | planifié |
| `/secteurs/charny/` | fr | hub-secteur | réparation de fondation Charny | drain français Charny · fissure fondation Charny · infiltration d'eau sous-sol Charny · entrepreneur fondation Charny | C | planifié |
| `/en/areas/charny/` | en | area-hub | foundation repair Charny | french drain Charny · foundation crack Charny · basement water infiltration Charny | C | planifié |
| `/secteurs/duberger-les-saules/` | fr | hub-secteur | réparation de fondation Duberger–Les Saules | drain français Duberger–Les Saules · fissure fondation Duberger–Les Saules · infiltration d'eau sous-sol Duberger–Les Saules · entrepreneur fondation Duberger–Les Saules | C | planifié |
| `/en/areas/duberger-les-saules/` | en | area-hub | foundation repair Duberger–Les Saules | french drain Duberger–Les Saules · foundation crack Duberger–Les Saules · basement water infiltration Duberger–Les Saules | C | planifié |
| `/secteurs/giffard/` | fr | hub-secteur | réparation de fondation Giffard | drain français Giffard · fissure fondation Giffard · infiltration d'eau sous-sol Giffard · entrepreneur fondation Giffard | C | planifié |
| `/en/areas/giffard/` | en | area-hub | foundation repair Giffard | french drain Giffard · foundation crack Giffard · basement water infiltration Giffard | C | planifié |
| `/secteurs/lac-saint-charles/` | fr | hub-secteur | réparation de fondation Lac-Saint-Charles | drain français Lac-Saint-Charles · fissure fondation Lac-Saint-Charles · infiltration d'eau sous-sol Lac-Saint-Charles · entrepreneur fondation Lac-Saint-Charles | C | planifié |
| `/en/areas/lac-saint-charles/` | en | area-hub | foundation repair Lac-Saint-Charles | french drain Lac-Saint-Charles · foundation crack Lac-Saint-Charles · basement water infiltration Lac-Saint-Charles | C | planifié |
| `/secteurs/lebourgneuf/` | fr | hub-secteur | réparation de fondation Lebourgneuf | drain français Lebourgneuf · fissure fondation Lebourgneuf · infiltration d'eau sous-sol Lebourgneuf · entrepreneur fondation Lebourgneuf | C | planifié |
| `/en/areas/lebourgneuf/` | en | area-hub | foundation repair Lebourgneuf | french drain Lebourgneuf · foundation crack Lebourgneuf · basement water infiltration Lebourgneuf | C | planifié |
| `/secteurs/limoilou/` | fr | hub-secteur | réparation de fondation Limoilou | drain français Limoilou · fissure fondation Limoilou · infiltration d'eau sous-sol Limoilou · entrepreneur fondation Limoilou | C | planifié |
| `/en/areas/limoilou/` | en | area-hub | foundation repair Limoilou | french drain Limoilou · foundation crack Limoilou · basement water infiltration Limoilou | C | planifié |
| `/secteurs/loretteville/` | fr | hub-secteur | réparation de fondation Loretteville | drain français Loretteville · fissure fondation Loretteville · infiltration d'eau sous-sol Loretteville · entrepreneur fondation Loretteville | C | planifié |
| `/en/areas/loretteville/` | en | area-hub | foundation repair Loretteville | french drain Loretteville · foundation crack Loretteville · basement water infiltration Loretteville | C | planifié |
| `/secteurs/montcalm/` | fr | hub-secteur | réparation de fondation Montcalm | drain français Montcalm · fissure fondation Montcalm · infiltration d'eau sous-sol Montcalm · entrepreneur fondation Montcalm | C | planifié |
| `/en/areas/montcalm/` | en | area-hub | foundation repair Montcalm | french drain Montcalm · foundation crack Montcalm · basement water infiltration Montcalm | C | planifié |
| `/secteurs/neufchatel/` | fr | hub-secteur | réparation de fondation Neufchâtel | drain français Neufchâtel · fissure fondation Neufchâtel · infiltration d'eau sous-sol Neufchâtel · entrepreneur fondation Neufchâtel | C | planifié |
| `/en/areas/neufchatel/` | en | area-hub | foundation repair Neufchâtel | french drain Neufchâtel · foundation crack Neufchâtel · basement water infiltration Neufchâtel | C | planifié |
| `/secteurs/pintendre/` | fr | hub-secteur | réparation de fondation Pintendre | drain français Pintendre · fissure fondation Pintendre · infiltration d'eau sous-sol Pintendre · entrepreneur fondation Pintendre | C | planifié |
| `/en/areas/pintendre/` | en | area-hub | foundation repair Pintendre | french drain Pintendre · foundation crack Pintendre · basement water infiltration Pintendre | C | planifié |
| `/secteurs/saint-emile/` | fr | hub-secteur | réparation de fondation Saint-Émile | drain français Saint-Émile · fissure fondation Saint-Émile · infiltration d'eau sous-sol Saint-Émile · entrepreneur fondation Saint-Émile | C | planifié |
| `/en/areas/saint-emile/` | en | area-hub | foundation repair Saint-Émile | french drain Saint-Émile · foundation crack Saint-Émile · basement water infiltration Saint-Émile | C | planifié |
| `/secteurs/saint-etienne-de-lauzon/` | fr | hub-secteur | réparation de fondation Saint-Étienne-de-Lauzon | drain français Saint-Étienne-de-Lauzon · fissure fondation Saint-Étienne-de-Lauzon · infiltration d'eau sous-sol Saint-Étienne-de-Lauzon · entrepreneur fondation Saint-Étienne-de-Lauzon | C | planifié |
| `/en/areas/saint-etienne-de-lauzon/` | en | area-hub | foundation repair Saint-Étienne-de-Lauzon | french drain Saint-Étienne-de-Lauzon · foundation crack Saint-Étienne-de-Lauzon · basement water infiltration Saint-Étienne-de-Lauzon | C | planifié |
| `/secteurs/saint-jean-baptiste/` | fr | hub-secteur | réparation de fondation Saint-Jean-Baptiste | drain français Saint-Jean-Baptiste · fissure fondation Saint-Jean-Baptiste · infiltration d'eau sous-sol Saint-Jean-Baptiste · entrepreneur fondation Saint-Jean-Baptiste | C | planifié |
| `/en/areas/saint-jean-baptiste/` | en | area-hub | foundation repair Saint-Jean-Baptiste | french drain Saint-Jean-Baptiste · foundation crack Saint-Jean-Baptiste · basement water infiltration Saint-Jean-Baptiste | C | planifié |
| `/secteurs/saint-jean-chrysostome/` | fr | hub-secteur | réparation de fondation Saint-Jean-Chrysostome | drain français Saint-Jean-Chrysostome · fissure fondation Saint-Jean-Chrysostome · infiltration d'eau sous-sol Saint-Jean-Chrysostome · entrepreneur fondation Saint-Jean-Chrysostome | C | planifié |
| `/en/areas/saint-jean-chrysostome/` | en | area-hub | foundation repair Saint-Jean-Chrysostome | french drain Saint-Jean-Chrysostome · foundation crack Saint-Jean-Chrysostome · basement water infiltration Saint-Jean-Chrysostome | C | planifié |
| `/secteurs/saint-nicolas/` | fr | hub-secteur | réparation de fondation Saint-Nicolas | drain français Saint-Nicolas · fissure fondation Saint-Nicolas · infiltration d'eau sous-sol Saint-Nicolas · entrepreneur fondation Saint-Nicolas | C | planifié |
| `/en/areas/saint-nicolas/` | en | area-hub | foundation repair Saint-Nicolas | french drain Saint-Nicolas · foundation crack Saint-Nicolas · basement water infiltration Saint-Nicolas | C | planifié |
| `/secteurs/saint-redempteur/` | fr | hub-secteur | réparation de fondation Saint-Rédempteur | drain français Saint-Rédempteur · fissure fondation Saint-Rédempteur · infiltration d'eau sous-sol Saint-Rédempteur · entrepreneur fondation Saint-Rédempteur | C | planifié |
| `/en/areas/saint-redempteur/` | en | area-hub | foundation repair Saint-Rédempteur | french drain Saint-Rédempteur · foundation crack Saint-Rédempteur · basement water infiltration Saint-Rédempteur | C | planifié |
| `/secteurs/saint-roch/` | fr | hub-secteur | réparation de fondation Saint-Roch | drain français Saint-Roch · fissure fondation Saint-Roch · infiltration d'eau sous-sol Saint-Roch · entrepreneur fondation Saint-Roch | C | planifié |
| `/en/areas/saint-roch/` | en | area-hub | foundation repair Saint-Roch | french drain Saint-Roch · foundation crack Saint-Roch · basement water infiltration Saint-Roch | C | planifié |
| `/secteurs/saint-romuald/` | fr | hub-secteur | réparation de fondation Saint-Romuald | drain français Saint-Romuald · fissure fondation Saint-Romuald · infiltration d'eau sous-sol Saint-Romuald · entrepreneur fondation Saint-Romuald | C | planifié |
| `/en/areas/saint-romuald/` | en | area-hub | foundation repair Saint-Romuald | french drain Saint-Romuald · foundation crack Saint-Romuald · basement water infiltration Saint-Romuald | C | planifié |
| `/secteurs/saint-sauveur/` | fr | hub-secteur | réparation de fondation Saint-Sauveur | drain français Saint-Sauveur · fissure fondation Saint-Sauveur · infiltration d'eau sous-sol Saint-Sauveur · entrepreneur fondation Saint-Sauveur | C | planifié |
| `/en/areas/saint-sauveur/` | en | area-hub | foundation repair Saint-Sauveur | french drain Saint-Sauveur · foundation crack Saint-Sauveur · basement water infiltration Saint-Sauveur | C | planifié |
| `/secteurs/sainte-foy/` | fr | hub-secteur | réparation de fondation Sainte-Foy | drain français Sainte-Foy · fissure fondation Sainte-Foy · infiltration d'eau sous-sol Sainte-Foy · entrepreneur fondation Sainte-Foy | C | planifié |
| `/en/areas/sainte-foy/` | en | area-hub | foundation repair Sainte-Foy | french drain Sainte-Foy · foundation crack Sainte-Foy · basement water infiltration Sainte-Foy | C | planifié |
| `/secteurs/sillery/` | fr | hub-secteur | réparation de fondation Sillery | drain français Sillery · fissure fondation Sillery · infiltration d'eau sous-sol Sillery · entrepreneur fondation Sillery | C | planifié |
| `/en/areas/sillery/` | en | area-hub | foundation repair Sillery | french drain Sillery · foundation crack Sillery · basement water infiltration Sillery | C | planifié |
| `/secteurs/val-belair/` | fr | hub-secteur | réparation de fondation Val-Bélair | drain français Val-Bélair · fissure fondation Val-Bélair · infiltration d'eau sous-sol Val-Bélair · entrepreneur fondation Val-Bélair | C | planifié |
| `/en/areas/val-belair/` | en | area-hub | foundation repair Val-Bélair | french drain Val-Bélair · foundation crack Val-Bélair · basement water infiltration Val-Bélair | C | planifié |
| `/secteurs/vanier/` | fr | hub-secteur | réparation de fondation Vanier | drain français Vanier · fissure fondation Vanier · infiltration d'eau sous-sol Vanier · entrepreneur fondation Vanier | C | planifié |
| `/en/areas/vanier/` | en | area-hub | foundation repair Vanier | french drain Vanier · foundation crack Vanier · basement water infiltration Vanier | C | planifié |
| `/secteurs/vieux-quebec/` | fr | hub-secteur | réparation de fondation Vieux-Québec | drain français Vieux-Québec · fissure fondation Vieux-Québec · infiltration d'eau sous-sol Vieux-Québec · entrepreneur fondation Vieux-Québec | C | planifié |
| `/en/areas/vieux-quebec/` | en | area-hub | foundation repair Old Québec | french drain Old Québec · foundation crack Old Québec · basement water infiltration Old Québec | C | planifié |
<!-- /GEN:sectors -->

---

## 4. Matrice service × secteur — candidats, non constructibles

<!-- GEN:matrix -->
_100 lignes générées, dont 26 en **planifié**. Le statut est **dérivé** de `src/data/foundation-pressure/_matrice.txt`, écrit par `foundation-pressure.mjs merge` qui applique le plafond de 30 et exclut les secteurs imbriqués (`parentSector`). **Ne pas éditer un statut à la main : ce bloc est réécrit à chaque exécution.** Le reste devient une **section** du hub de secteur, en texte brut, sans lien (PLAYBOOK §7.3)._

| URL | Lang | Type | Mot-clé principal | Secondaires | Strate | Statut |
|---|---|---|---|---|---|---|
| `/fondation/drain-francais/beauport/` | fr | matrice | drain français Beauport | drain français prix Beauport · entrepreneur drain français Beauport | A | planifié |
| `/en/foundation/french-drain/beauport/` | en | matrix | french drain Beauport | french drain cost Beauport · french drain contractor Beauport | A | planifié |
| `/fondation/fissure-de-fondation/beauport/` | fr | matrice | fissure de fondation Beauport | fissure de fondation prix Beauport · entrepreneur fissure de fondation Beauport | A | candidat |
| `/en/foundation/foundation-crack-repair/beauport/` | en | matrix | foundation crack repair Beauport | foundation crack repair cost Beauport · foundation crack repair contractor Beauport | A | candidat |
| `/fondation/drain-francais/charlesbourg/` | fr | matrice | drain français Charlesbourg | drain français prix Charlesbourg · entrepreneur drain français Charlesbourg | A | planifié |
| `/en/foundation/french-drain/charlesbourg/` | en | matrix | french drain Charlesbourg | french drain cost Charlesbourg · french drain contractor Charlesbourg | A | planifié |
| `/fondation/fissure-de-fondation/charlesbourg/` | fr | matrice | fissure de fondation Charlesbourg | fissure de fondation prix Charlesbourg · entrepreneur fissure de fondation Charlesbourg | A | candidat |
| `/en/foundation/foundation-crack-repair/charlesbourg/` | en | matrix | foundation crack repair Charlesbourg | foundation crack repair cost Charlesbourg · foundation crack repair contractor Charlesbourg | A | candidat |
| `/fondation/drain-francais/la-cite-limoilou/` | fr | matrice | drain français La Cité-Limoilou | drain français prix La Cité-Limoilou · entrepreneur drain français La Cité-Limoilou | A | planifié |
| `/en/foundation/french-drain/la-cite-limoilou/` | en | matrix | french drain La Cité-Limoilou | french drain cost La Cité-Limoilou · french drain contractor La Cité-Limoilou | A | planifié |
| `/fondation/fissure-de-fondation/la-cite-limoilou/` | fr | matrice | fissure de fondation La Cité-Limoilou | fissure de fondation prix La Cité-Limoilou · entrepreneur fissure de fondation La Cité-Limoilou | A | candidat |
| `/en/foundation/foundation-crack-repair/la-cite-limoilou/` | en | matrix | foundation crack repair La Cité-Limoilou | foundation crack repair cost La Cité-Limoilou · foundation crack repair contractor La Cité-Limoilou | A | candidat |
| `/fondation/drain-francais/la-haute-saint-charles/` | fr | matrice | drain français La Haute-Saint-Charles | drain français prix La Haute-Saint-Charles · entrepreneur drain français La Haute-Saint-Charles | A | candidat |
| `/en/foundation/french-drain/la-haute-saint-charles/` | en | matrix | french drain La Haute-Saint-Charles | french drain cost La Haute-Saint-Charles · french drain contractor La Haute-Saint-Charles | A | candidat |
| `/fondation/fissure-de-fondation/la-haute-saint-charles/` | fr | matrice | fissure de fondation La Haute-Saint-Charles | fissure de fondation prix La Haute-Saint-Charles · entrepreneur fissure de fondation La Haute-Saint-Charles | A | candidat |
| `/en/foundation/foundation-crack-repair/la-haute-saint-charles/` | en | matrix | foundation crack repair La Haute-Saint-Charles | foundation crack repair cost La Haute-Saint-Charles · foundation crack repair contractor La Haute-Saint-Charles | A | candidat |
| `/fondation/drain-francais/les-rivieres/` | fr | matrice | drain français Les Rivières | drain français prix Les Rivières · entrepreneur drain français Les Rivières | A | candidat |
| `/en/foundation/french-drain/les-rivieres/` | en | matrix | french drain Les Rivières | french drain cost Les Rivières · french drain contractor Les Rivières | A | candidat |
| `/fondation/fissure-de-fondation/les-rivieres/` | fr | matrice | fissure de fondation Les Rivières | fissure de fondation prix Les Rivières · entrepreneur fissure de fondation Les Rivières | A | candidat |
| `/en/foundation/foundation-crack-repair/les-rivieres/` | en | matrix | foundation crack repair Les Rivières | foundation crack repair cost Les Rivières · foundation crack repair contractor Les Rivières | A | candidat |
| `/fondation/drain-francais/levis/` | fr | matrice | drain français Lévis | drain français prix Lévis · entrepreneur drain français Lévis | A | candidat |
| `/en/foundation/french-drain/levis/` | en | matrix | french drain Lévis | french drain cost Lévis · french drain contractor Lévis | A | candidat |
| `/fondation/fissure-de-fondation/levis/` | fr | matrice | fissure de fondation Lévis | fissure de fondation prix Lévis · entrepreneur fissure de fondation Lévis | A | planifié |
| `/en/foundation/foundation-crack-repair/levis/` | en | matrix | foundation crack repair Lévis | foundation crack repair cost Lévis · foundation crack repair contractor Lévis | A | planifié |
| `/fondation/drain-francais/sainte-foy-sillery-cap-rouge/` | fr | matrice | drain français Sainte-Foy–Sillery–Cap-Rouge | drain français prix Sainte-Foy–Sillery–Cap-Rouge · entrepreneur drain français Sainte-Foy–Sillery–Cap-Rouge | A | candidat |
| `/en/foundation/french-drain/sainte-foy-sillery-cap-rouge/` | en | matrix | french drain Sainte-Foy–Sillery–Cap-Rouge | french drain cost Sainte-Foy–Sillery–Cap-Rouge · french drain contractor Sainte-Foy–Sillery–Cap-Rouge | A | candidat |
| `/fondation/fissure-de-fondation/sainte-foy-sillery-cap-rouge/` | fr | matrice | fissure de fondation Sainte-Foy–Sillery–Cap-Rouge | fissure de fondation prix Sainte-Foy–Sillery–Cap-Rouge · entrepreneur fissure de fondation Sainte-Foy–Sillery–Cap-Rouge | A | candidat |
| `/en/foundation/foundation-crack-repair/sainte-foy-sillery-cap-rouge/` | en | matrix | foundation crack repair Sainte-Foy–Sillery–Cap-Rouge | foundation crack repair cost Sainte-Foy–Sillery–Cap-Rouge · foundation crack repair contractor Sainte-Foy–Sillery–Cap-Rouge | A | candidat |
| `/fondation/drain-francais/beaupre/` | fr | matrice | drain français Beaupré | drain français prix Beaupré · entrepreneur drain français Beaupré | B | candidat |
| `/en/foundation/french-drain/beaupre/` | en | matrix | french drain Beaupré | french drain cost Beaupré · french drain contractor Beaupré | B | candidat |
| `/fondation/fissure-de-fondation/beaupre/` | fr | matrice | fissure de fondation Beaupré | fissure de fondation prix Beaupré · entrepreneur fissure de fondation Beaupré | B | candidat |
| `/en/foundation/foundation-crack-repair/beaupre/` | en | matrix | foundation crack repair Beaupré | foundation crack repair cost Beaupré · foundation crack repair contractor Beaupré | B | candidat |
| `/fondation/drain-francais/boischatel/` | fr | matrice | drain français Boischatel | drain français prix Boischatel · entrepreneur drain français Boischatel | B | planifié |
| `/en/foundation/french-drain/boischatel/` | en | matrix | french drain Boischatel | french drain cost Boischatel · french drain contractor Boischatel | B | planifié |
| `/fondation/fissure-de-fondation/boischatel/` | fr | matrice | fissure de fondation Boischatel | fissure de fondation prix Boischatel · entrepreneur fissure de fondation Boischatel | B | candidat |
| `/en/foundation/foundation-crack-repair/boischatel/` | en | matrix | foundation crack repair Boischatel | foundation crack repair cost Boischatel · foundation crack repair contractor Boischatel | B | candidat |
| `/fondation/drain-francais/chateau-richer/` | fr | matrice | drain français Château-Richer | drain français prix Château-Richer · entrepreneur drain français Château-Richer | B | planifié |
| `/en/foundation/french-drain/chateau-richer/` | en | matrix | french drain Château-Richer | french drain cost Château-Richer · french drain contractor Château-Richer | B | planifié |
| `/fondation/fissure-de-fondation/chateau-richer/` | fr | matrice | fissure de fondation Château-Richer | fissure de fondation prix Château-Richer · entrepreneur fissure de fondation Château-Richer | B | candidat |
| `/en/foundation/foundation-crack-repair/chateau-richer/` | en | matrix | foundation crack repair Château-Richer | foundation crack repair cost Château-Richer · foundation crack repair contractor Château-Richer | B | candidat |
| `/fondation/drain-francais/fossambault-sur-le-lac/` | fr | matrice | drain français Fossambault-sur-le-Lac | drain français prix Fossambault-sur-le-Lac · entrepreneur drain français Fossambault-sur-le-Lac | B | planifié |
| `/en/foundation/french-drain/fossambault-sur-le-lac/` | en | matrix | french drain Fossambault-sur-le-Lac | french drain cost Fossambault-sur-le-Lac · french drain contractor Fossambault-sur-le-Lac | B | planifié |
| `/fondation/fissure-de-fondation/fossambault-sur-le-lac/` | fr | matrice | fissure de fondation Fossambault-sur-le-Lac | fissure de fondation prix Fossambault-sur-le-Lac · entrepreneur fissure de fondation Fossambault-sur-le-Lac | B | candidat |
| `/en/foundation/foundation-crack-repair/fossambault-sur-le-lac/` | en | matrix | foundation crack repair Fossambault-sur-le-Lac | foundation crack repair cost Fossambault-sur-le-Lac · foundation crack repair contractor Fossambault-sur-le-Lac | B | candidat |
| `/fondation/drain-francais/ile-dorleans/` | fr | matrice | drain français Île d'Orléans | drain français prix Île d'Orléans · entrepreneur drain français Île d'Orléans | B | planifié |
| `/en/foundation/french-drain/ile-dorleans/` | en | matrix | french drain Île d'Orléans | french drain cost Île d'Orléans · french drain contractor Île d'Orléans | B | planifié |
| `/fondation/fissure-de-fondation/ile-dorleans/` | fr | matrice | fissure de fondation Île d'Orléans | fissure de fondation prix Île d'Orléans · entrepreneur fissure de fondation Île d'Orléans | B | candidat |
| `/en/foundation/foundation-crack-repair/ile-dorleans/` | en | matrix | foundation crack repair Île d'Orléans | foundation crack repair cost Île d'Orléans · foundation crack repair contractor Île d'Orléans | B | candidat |
| `/fondation/drain-francais/lac-beauport/` | fr | matrice | drain français Lac-Beauport | drain français prix Lac-Beauport · entrepreneur drain français Lac-Beauport | B | candidat |
| `/en/foundation/french-drain/lac-beauport/` | en | matrix | french drain Lac-Beauport | french drain cost Lac-Beauport · french drain contractor Lac-Beauport | B | candidat |
| `/fondation/fissure-de-fondation/lac-beauport/` | fr | matrice | fissure de fondation Lac-Beauport | fissure de fondation prix Lac-Beauport · entrepreneur fissure de fondation Lac-Beauport | B | candidat |
| `/en/foundation/foundation-crack-repair/lac-beauport/` | en | matrix | foundation crack repair Lac-Beauport | foundation crack repair cost Lac-Beauport · foundation crack repair contractor Lac-Beauport | B | candidat |
| `/fondation/drain-francais/lac-delage/` | fr | matrice | drain français Lac-Delage | drain français prix Lac-Delage · entrepreneur drain français Lac-Delage | B | planifié |
| `/en/foundation/french-drain/lac-delage/` | en | matrix | french drain Lac-Delage | french drain cost Lac-Delage · french drain contractor Lac-Delage | B | planifié |
| `/fondation/fissure-de-fondation/lac-delage/` | fr | matrice | fissure de fondation Lac-Delage | fissure de fondation prix Lac-Delage · entrepreneur fissure de fondation Lac-Delage | B | candidat |
| `/en/foundation/foundation-crack-repair/lac-delage/` | en | matrix | foundation crack repair Lac-Delage | foundation crack repair cost Lac-Delage · foundation crack repair contractor Lac-Delage | B | candidat |
| `/fondation/drain-francais/lancienne-lorette/` | fr | matrice | drain français L'Ancienne-Lorette | drain français prix L'Ancienne-Lorette · entrepreneur drain français L'Ancienne-Lorette | B | candidat |
| `/en/foundation/french-drain/lancienne-lorette/` | en | matrix | french drain L'Ancienne-Lorette | french drain cost L'Ancienne-Lorette · french drain contractor L'Ancienne-Lorette | B | candidat |
| `/fondation/fissure-de-fondation/lancienne-lorette/` | fr | matrice | fissure de fondation L'Ancienne-Lorette | fissure de fondation prix L'Ancienne-Lorette · entrepreneur fissure de fondation L'Ancienne-Lorette | B | candidat |
| `/en/foundation/foundation-crack-repair/lancienne-lorette/` | en | matrix | foundation crack repair L'Ancienne-Lorette | foundation crack repair cost L'Ancienne-Lorette · foundation crack repair contractor L'Ancienne-Lorette | B | candidat |
| `/fondation/drain-francais/lange-gardien/` | fr | matrice | drain français L'Ange-Gardien | drain français prix L'Ange-Gardien · entrepreneur drain français L'Ange-Gardien | B | candidat |
| `/en/foundation/french-drain/lange-gardien/` | en | matrix | french drain L'Ange-Gardien | french drain cost L'Ange-Gardien · french drain contractor L'Ange-Gardien | B | candidat |
| `/fondation/fissure-de-fondation/lange-gardien/` | fr | matrice | fissure de fondation L'Ange-Gardien | fissure de fondation prix L'Ange-Gardien · entrepreneur fissure de fondation L'Ange-Gardien | B | candidat |
| `/en/foundation/foundation-crack-repair/lange-gardien/` | en | matrix | foundation crack repair L'Ange-Gardien | foundation crack repair cost L'Ange-Gardien · foundation crack repair contractor L'Ange-Gardien | B | candidat |
| `/fondation/drain-francais/saint-augustin-de-desmaures/` | fr | matrice | drain français Saint-Augustin-de-Desmaures | drain français prix Saint-Augustin-de-Desmaures · entrepreneur drain français Saint-Augustin-de-Desmaures | B | candidat |
| `/en/foundation/french-drain/saint-augustin-de-desmaures/` | en | matrix | french drain Saint-Augustin-de-Desmaures | french drain cost Saint-Augustin-de-Desmaures · french drain contractor Saint-Augustin-de-Desmaures | B | candidat |
| `/fondation/fissure-de-fondation/saint-augustin-de-desmaures/` | fr | matrice | fissure de fondation Saint-Augustin-de-Desmaures | fissure de fondation prix Saint-Augustin-de-Desmaures · entrepreneur fissure de fondation Saint-Augustin-de-Desmaures | B | candidat |
| `/en/foundation/foundation-crack-repair/saint-augustin-de-desmaures/` | en | matrix | foundation crack repair Saint-Augustin-de-Desmaures | foundation crack repair cost Saint-Augustin-de-Desmaures · foundation crack repair contractor Saint-Augustin-de-Desmaures | B | candidat |
| `/fondation/drain-francais/saint-ferreol-les-neiges/` | fr | matrice | drain français Saint-Ferréol-les-Neiges | drain français prix Saint-Ferréol-les-Neiges · entrepreneur drain français Saint-Ferréol-les-Neiges | B | planifié |
| `/en/foundation/french-drain/saint-ferreol-les-neiges/` | en | matrix | french drain Saint-Ferréol-les-Neiges | french drain cost Saint-Ferréol-les-Neiges · french drain contractor Saint-Ferréol-les-Neiges | B | planifié |
| `/fondation/fissure-de-fondation/saint-ferreol-les-neiges/` | fr | matrice | fissure de fondation Saint-Ferréol-les-Neiges | fissure de fondation prix Saint-Ferréol-les-Neiges · entrepreneur fissure de fondation Saint-Ferréol-les-Neiges | B | candidat |
| `/en/foundation/foundation-crack-repair/saint-ferreol-les-neiges/` | en | matrix | foundation crack repair Saint-Ferréol-les-Neiges | foundation crack repair cost Saint-Ferréol-les-Neiges · foundation crack repair contractor Saint-Ferréol-les-Neiges | B | candidat |
| `/fondation/drain-francais/saint-gabriel-de-valcartier/` | fr | matrice | drain français Saint-Gabriel-de-Valcartier | drain français prix Saint-Gabriel-de-Valcartier · entrepreneur drain français Saint-Gabriel-de-Valcartier | B | candidat |
| `/en/foundation/french-drain/saint-gabriel-de-valcartier/` | en | matrix | french drain Saint-Gabriel-de-Valcartier | french drain cost Saint-Gabriel-de-Valcartier · french drain contractor Saint-Gabriel-de-Valcartier | B | candidat |
| `/fondation/fissure-de-fondation/saint-gabriel-de-valcartier/` | fr | matrice | fissure de fondation Saint-Gabriel-de-Valcartier | fissure de fondation prix Saint-Gabriel-de-Valcartier · entrepreneur fissure de fondation Saint-Gabriel-de-Valcartier | B | candidat |
| `/en/foundation/foundation-crack-repair/saint-gabriel-de-valcartier/` | en | matrix | foundation crack repair Saint-Gabriel-de-Valcartier | foundation crack repair cost Saint-Gabriel-de-Valcartier · foundation crack repair contractor Saint-Gabriel-de-Valcartier | B | candidat |
| `/fondation/drain-francais/sainte-anne-de-beaupre/` | fr | matrice | drain français Sainte-Anne-de-Beaupré | drain français prix Sainte-Anne-de-Beaupré · entrepreneur drain français Sainte-Anne-de-Beaupré | B | planifié |
| `/en/foundation/french-drain/sainte-anne-de-beaupre/` | en | matrix | french drain Sainte-Anne-de-Beaupré | french drain cost Sainte-Anne-de-Beaupré · french drain contractor Sainte-Anne-de-Beaupré | B | planifié |
| `/fondation/fissure-de-fondation/sainte-anne-de-beaupre/` | fr | matrice | fissure de fondation Sainte-Anne-de-Beaupré | fissure de fondation prix Sainte-Anne-de-Beaupré · entrepreneur fissure de fondation Sainte-Anne-de-Beaupré | B | candidat |
| `/en/foundation/foundation-crack-repair/sainte-anne-de-beaupre/` | en | matrix | foundation crack repair Sainte-Anne-de-Beaupré | foundation crack repair cost Sainte-Anne-de-Beaupré · foundation crack repair contractor Sainte-Anne-de-Beaupré | B | candidat |
| `/fondation/drain-francais/sainte-brigitte-de-laval/` | fr | matrice | drain français Sainte-Brigitte-de-Laval | drain français prix Sainte-Brigitte-de-Laval · entrepreneur drain français Sainte-Brigitte-de-Laval | B | candidat |
| `/en/foundation/french-drain/sainte-brigitte-de-laval/` | en | matrix | french drain Sainte-Brigitte-de-Laval | french drain cost Sainte-Brigitte-de-Laval · french drain contractor Sainte-Brigitte-de-Laval | B | candidat |
| `/fondation/fissure-de-fondation/sainte-brigitte-de-laval/` | fr | matrice | fissure de fondation Sainte-Brigitte-de-Laval | fissure de fondation prix Sainte-Brigitte-de-Laval · entrepreneur fissure de fondation Sainte-Brigitte-de-Laval | B | candidat |
| `/en/foundation/foundation-crack-repair/sainte-brigitte-de-laval/` | en | matrix | foundation crack repair Sainte-Brigitte-de-Laval | foundation crack repair cost Sainte-Brigitte-de-Laval · foundation crack repair contractor Sainte-Brigitte-de-Laval | B | candidat |
| `/fondation/drain-francais/sainte-catherine-de-la-jacques-cartier/` | fr | matrice | drain français Sainte-Catherine-de-la-Jacques-Cartier | drain français prix Sainte-Catherine-de-la-Jacques-Cartier · entrepreneur drain français Sainte-Catherine-de-la-Jacques-Cartier | B | candidat |
| `/en/foundation/french-drain/sainte-catherine-de-la-jacques-cartier/` | en | matrix | french drain Sainte-Catherine-de-la-Jacques-Cartier | french drain cost Sainte-Catherine-de-la-Jacques-Cartier · french drain contractor Sainte-Catherine-de-la-Jacques-Cartier | B | candidat |
| `/fondation/fissure-de-fondation/sainte-catherine-de-la-jacques-cartier/` | fr | matrice | fissure de fondation Sainte-Catherine-de-la-Jacques-Cartier | fissure de fondation prix Sainte-Catherine-de-la-Jacques-Cartier · entrepreneur fissure de fondation Sainte-Catherine-de-la-Jacques-Cartier | B | candidat |
| `/en/foundation/foundation-crack-repair/sainte-catherine-de-la-jacques-cartier/` | en | matrix | foundation crack repair Sainte-Catherine-de-la-Jacques-Cartier | foundation crack repair cost Sainte-Catherine-de-la-Jacques-Cartier · foundation crack repair contractor Sainte-Catherine-de-la-Jacques-Cartier | B | candidat |
| `/fondation/drain-francais/shannon/` | fr | matrice | drain français Shannon | drain français prix Shannon · entrepreneur drain français Shannon | B | planifié |
| `/en/foundation/french-drain/shannon/` | en | matrix | french drain Shannon | french drain cost Shannon · french drain contractor Shannon | B | planifié |
| `/fondation/fissure-de-fondation/shannon/` | fr | matrice | fissure de fondation Shannon | fissure de fondation prix Shannon · entrepreneur fissure de fondation Shannon | B | candidat |
| `/en/foundation/foundation-crack-repair/shannon/` | en | matrix | foundation crack repair Shannon | foundation crack repair cost Shannon · foundation crack repair contractor Shannon | B | candidat |
| `/fondation/drain-francais/stoneham-et-tewkesbury/` | fr | matrice | drain français Stoneham-et-Tewkesbury | drain français prix Stoneham-et-Tewkesbury · entrepreneur drain français Stoneham-et-Tewkesbury | B | candidat |
| `/en/foundation/french-drain/stoneham-et-tewkesbury/` | en | matrix | french drain Stoneham-et-Tewkesbury | french drain cost Stoneham-et-Tewkesbury · french drain contractor Stoneham-et-Tewkesbury | B | candidat |
| `/fondation/fissure-de-fondation/stoneham-et-tewkesbury/` | fr | matrice | fissure de fondation Stoneham-et-Tewkesbury | fissure de fondation prix Stoneham-et-Tewkesbury · entrepreneur fissure de fondation Stoneham-et-Tewkesbury | B | planifié |
| `/en/foundation/foundation-crack-repair/stoneham-et-tewkesbury/` | en | matrix | foundation crack repair Stoneham-et-Tewkesbury | foundation crack repair cost Stoneham-et-Tewkesbury · foundation crack repair contractor Stoneham-et-Tewkesbury | B | planifié |
| `/fondation/drain-francais/wendake/` | fr | matrice | drain français Wendake | drain français prix Wendake · entrepreneur drain français Wendake | B | candidat |
| `/en/foundation/french-drain/wendake/` | en | matrix | french drain Wendake | french drain cost Wendake · french drain contractor Wendake | B | candidat |
| `/fondation/fissure-de-fondation/wendake/` | fr | matrice | fissure de fondation Wendake | fissure de fondation prix Wendake · entrepreneur fissure de fondation Wendake | B | candidat |
| `/en/foundation/foundation-crack-repair/wendake/` | en | matrix | foundation crack repair Wendake | foundation crack repair cost Wendake · foundation crack repair contractor Wendake | B | candidat |
<!-- /GEN:matrix -->

---

## 5. Blogue (phase 9)

| URL | Lang | Mot-clé principal | Intention | Statut |
|---|---|---|---|---|
| `/blogue/verifier-licence-rbq-entrepreneur/` | fr | vérifier licence RBQ entrepreneur | #8 réglementaire | écrit |
| `/blogue/norme-bnq-3661-500-drain-francais/` | fr | norme BNQ 3661-500 | #8 · **pilier du moat** | écrit |
| `/blogue/garantie-gcr-fondation-maison-neuve/` | fr | garantie GCR fondation | #8 | écrit |
| `/blogue/permis-excavation-pres-fondation-quebec/` | fr | permis excavation Québec | #8 | écrit |
| `/blogue/assurance-habitation-infiltration-eau/` | fr | assurance infiltration d'eau sous-sol | #10 | planifié |
| `/blogue/fissure-grave-ou-benigne/` | fr | fissure de fondation grave ou non | #2 | planifié |
| `/blogue/eau-sous-sol-fonte-des-neiges/` | fr | eau au sous-sol fonte des neiges | **#7 mécanisme régional** — reclassé le 2026-08-11 | planifié |
| `/blogue/gel-degel-fondation-region-quebec/` | fr | gel-dégel fondation Québec | #7 · saisonnier novembre | planifié |
| `/blogue/argile-mer-de-champlain-fondation/` | fr | sol argileux fondation Québec | #7 · **différenciateur géologique** | planifié |
| `/blogue/inspection-fondation-avant-achat/` | fr | inspection fondation avant achat | #9 | planifié |
| `/blogue/vice-cache-fondation-quebec/` | fr | vice caché fondation | #9 | planifié |
| ~~`/blogue/duree-de-vie-drain-francais/`~~ | fr | ~~durée de vie drain français~~ | #3 | **rétrogradé** |

### Contrôle n°1 exécuté le 2026-08-07 — deux conflits trouvés

**`durée de vie drain français` → RÉTROGRADÉ.** Le mot-clé figure déjà comme **secondaire** de
`/fondation/drain-francais/` (ligne 58). C'est le cas exact que le contrôle n°1 décrit : un
article de blogue qui vise le secondaire de son propre hub ne concurrence pas un inconnu, il
concurrence la page qu'il devrait renforcer. **Il devient une section du hub**, en texte, jamais
une page. Ne pas rouvrir sans retirer d'abord le secondaire de la ligne 58.

**`eau au sous-sol fonte des neiges` → à recadrer avant d'écrire.** La ligne porte l'intention
**#1**, et `/urgence/` porte déjà #1 — la table de conflits dit d'ailleurs que `/urgence/` est
« transactionnel et court » et « ne doit pas devenir un deuxième article sur l'infiltration ».
Deux URL sur #1 est une cannibalisation par construction. L'article n'est écrivable que s'il
change d'intention : **expliquer le mécanisme saisonnier** — sol encore gelé, l'eau de fonte ne
s'infiltre pas et suit la couche gelée jusqu'à la fondation — ce qui est #7 (mécanisme régional),
pas #1. Reclasser la ligne **avant** d'écrire, sinon c'est une section de `/urgence/`.

**Deux points de surveillance, pages conservées :**

- `assurance-habitation-infiltration-eau` — recoupe fortement `/fondation/infiltration-eau-sous-sol/`.
  L'intention diffère (#10, l'assurance), pas le vocabulaire. **Le H1 et la première phrase doivent
  mener avec l'assurance**, jamais avec l'infiltration.
- `inspection-fondation-avant-achat` — recoupe `/fondation/inspection-de-drain-par-camera/` sur
  « inspection · avant · achat ». Le hub vise l'ouvrage, l'article vise l'acheteur. Même discipline.

**`vice-cache-fondation-quebec` reste bloqué sur sa source.** Le fond est le Code civil du Québec
(garantie de qualité, dénonciation dans un délai raisonnable), mais **LégisQuébec répond 403 aux
requêtes automatisées** — les articles n'ont donc pas été vérifiés à la source. Règle du projet :
on ne publie pas un texte de loi de mémoire. À ouvrir à la main avant d'écrire.

### Jumelles EN

**Appariement par `translationKey`, jamais par slug** (PLAYBOOK §7.2) : les slugs de blogue
diffèrent réellement d'une langue à l'autre. Les routes lèvent si une jumelle manque, et les
index ne listent que les articles appariés — un article ne peut donc pas partir seul (règle 6).

| URL | Lang | `translationKey` | Mot-clé principal | Statut |
|---|---|---|---|---|
| `/en/blog/check-rbq-contractor-licence/` | en | `rbq-licence-check` | check RBQ contractor licence | écrit |
| `/en/blog/bnq-3661-500-french-drain-standard/` | en | `bnq-3661-500` | BNQ 3661-500 standard | écrit |
| `/en/blog/new-home-warranty-foundation-coverage/` | en | `gcr-warranty` | new home warranty foundation | écrit |
| `/en/blog/foundation-drain-connection-rules-quebec-city/` | en | `excavation-permit` | foundation drain connection Quebec City | écrit |

⚠ **Le slug EN mène avec le raccordement, pas avec le permis, et c'est délibéré.** L'article
répond à la requête « permis d'excavation » en français parce que c'est ce que les gens
cherchent — et il y répond par la négative. En anglais, « excavation permit » attire surtout des
requêtes commerciales et municipales sans rapport ; la matière réelle de l'article est le
règlement de raccordement du drain, qui est ce que la version anglaise met en avant. Règle 6 :
on traduit **l'argument**, pas les phrases.

Les 8 jumelles EN restantes seront listées ici au fur et à mesure que les articles FR
correspondants s'écrivent. Une ligne s'ajoute **avant** le fichier, pas après (règle 2).

---

## Garde anti-cannibalisation

**Une intention = une URL. Si deux lignes se disputent la même SERP, l'une des deux devient une
section.**

### Règles de conflit décidées d'avance

| Conflit | Décision |
|---|---|
| « solage fissuré », « craque dans le béton », « fissure en escalier », « fissure de retrait » | **Sections** de `/fondation/fissure-de-fondation/`. Jamais de page. Ce sont des synonymes et des sous-cas, pas des intentions distinctes. |
| « drain de fondation » vs « drain français » | Même page. `drain-francais` est le slug ; « drain de fondation » est un secondaire dans le corps et les H2. |
| « imperméabilisation » vs « membrane » vs « goudron » | Même page (#3). |
| « mur bombé », « pieux vissés », « vérins », « sous-œuvre » | **Sections** de `/fondation/affaissement-de-fondation/`. |
| « efflorescence », « remontée capillaire », « odeur de terre » | **Sections** de `/fondation/humidite-et-moisissure-sous-sol/`. |
| « infiltration d'eau » (#4) vs « imperméabilisation » (#3) | #4 entre par le **symptôme** et vend le diagnostic ; #3 entre par la **solution** et vend les travaux. H1 et première phrase doivent rendre cette différence évidente, sinon fusionner. **Point de surveillance n° 1.** |
| « ocre ferreuse » (#5) vs « drain français » (#2) | #5 est la **cause**, #2 est **l'ouvrage**. #5 ne doit jamais devenir un deuxième article sur le remplacement de drain. **Point de surveillance n° 2.** |
| « pompe de puisard » (#8) vs « drain intérieur » | Même page ; ce sont deux moitiés du même ouvrage. |
| « refoulement d'égout » | **Aucune page.** Ce n'est pas notre service. Mention dans #8 avec renvoi explicite vers la Ville. |
| « pyrrhotite » | **Aucune page.** Mauricie, pas la CMQ. Une phrase de désambiguïsation dans #11 suffit. |
| Hub de service vs page matrice | Le hub porte `{service} Québec` ; la matrice porte `{service} {Secteur}`. **Le hub ne cible jamais un secteur nommé dans son `<title>`.** |
| Hub de secteur vs page matrice | Le hub de secteur porte `réparation de fondation {Secteur}` (générique) ; la matrice porte `{service} {Secteur}` (spécifique). Si un secteur n'a aucune combinaison approuvée, son hub absorbe les deux intentions — c'est le cas nominal, pas une exception. |
| `/prix/` vs section prix d'un hub | `/prix/` est la page canonique pour toute requête « prix/coût » **sans service nommé**. Les hubs traitent le prix en 150 mots max et **lient** vers `/prix/`. Garder les montants littéraux hors des hubs (PLAYBOOK §8, insécables). |
| `/urgence/` vs #4 infiltration | `/urgence/` est transactionnel et court (intention #1, la personne a de l'eau *maintenant*). #4 est explicatif. `/urgence/` ne doit pas devenir un deuxième article sur l'infiltration. |
| FR vs EN | Jamais un conflit : hreflang réciproque. Mais un slug EN translittéré d'un slug FR **est** un conflit — il capte la mauvaise requête. |

### Contrôles à exécuter

1. **Avant d'ajouter une ligne :** chercher le mot-clé principal dans ce fichier. S'il apparaît
   déjà comme principal **ou** comme secondaire sur une page de même langue et de même type,
   la nouvelle page n'existe pas — c'est une section.
2. **Après chaque phase :** `seo-audit.mjs` bloque déjà sur les `<title>` et meta dupliqués.
   C'est le filet, pas la règle. Deux titres différents peuvent viser la même SERP.
3. **Après indexation :** en Search Console, toute URL dont la requête principale est déjà la
   requête principale d'une autre URL est un cas de cannibalisation → fusionner, avec un 301,
   et noter la fusion dans `PROGRESS.md`. Rappel règle 4 : les URL sont gelées, donc une fusion
   coûte cher. **Mieux vaut refuser une page maintenant que la fusionner dans six mois.**
