# HANDOFF-TENANT — remettre le site à un entrepreneur

Ce site a été construit **sans entreprise derrière lui**, et c'est ce seul fait qui a dicté toutes
les règles dures de `CLAUDE.md`. Le jour où un entrepreneur réel le loue, une partie de ces règles
**s'inverse** — et une autre partie ne s'inverse pas du tout.

Ce document dit laquelle est laquelle.

---

## 1. Ce que le locataire reçoit

| | |
|---|---|
| **188 pages** bilingues | 11 hubs de service, 51 hubs de secteur, 13 pages matrice, 3 articles, les pages utilitaires — FR + EN |
| **Un corpus réglementaire vérifié** | `src/data/regulations.json` : RBQ, BNQ 3661-500, plan de garantie — chaque fait rattaché à sa source publique et daté |
| **Trois portes de qualité** | unicité, maillage, SEO — bloquantes au build |
| **0 octet de JS client** | et une CSP qui interdit le script tout court |
| **Des licences propres** | images DP/CC0 avec provenance (`IMAGE-CREDITS.md`), polices OFL (`public/fonts/`) |

**Les licences suivent l'actif.** C'est pour ça que le script d'images refuse tout ce qui n'est pas
domaine public ou CC0 : une CC BY-SA aurait imposé le partage à l'identique **au locataire**, qui
n'a rien demandé. Ne pas desserrer cette contrainte en ajoutant des images plus tard.

---

## 2. Ce qui s'inverse — les marqueurs de confiance

Le site a été écrit avec des trous **assumés** là où un marqueur de confiance aurait été un
mensonge. Ces trous se remplissent maintenant, et **les portes qui les protégeaient doivent être
desserrées explicitement**, pas contournées.

### 2.1 `src/data/site.json`

| Champ | Aujourd'hui | Au handoff |
|---|---|---|
| `phone` | `null` | Le numéro réel (ou le numéro de suivi d'appel) |
| `address` | `null` | L'adresse réelle de l'entreprise |
| `rbqLicence` | `null` | **Le numéro de licence RBQ du locataire** |

⚠ `domain` et `formEndpoint` ont été **retirés** de ce fichier le 2026-08-11 : aucun module ne
l'importait, donc les deux valeurs étaient mortes, et `domain` était un second endroit où un
domaine pouvait s'écrire en dur. Le domaine vient de `SITE_URL` au build ; l'endpoint du
formulaire, de `LEAD_ENDPOINT` (`src/lib/constants.ts`). **Le responsable de la protection des
renseignements personnels est dans `PRIVACY_OFFICER`, même fichier** — voir §4.1.

⚠ **Le numéro de licence doit être celui du locataire, vérifié au registre public.** Le site
explique les sous-catégories RBQ comme un droit du consommateur ; en revendiquer une sans la
détenir retournerait l'argument central du site contre lui.

### 2.2 Le JSON-LD

`src/lib/schema.ts` n'émet **pas** de `LocalBusiness` ni d'`aggregateRating` — les deux exigent
une adresse vérifiée et de vrais avis. Aujourd'hui le graphe est `Organization` + `WebSite` +
`Service` + `BreadcrumbList` + `FAQPage` + `BlogPosting`.

**Cette interdiction est mécanique, pas seulement écrite.** `scripts/seo-audit.mjs` **échoue en
erreur dure** si `LocalBusiness` ou `AggregateRating` apparaît dans le graphe d'une page. Pour
l'ouvrir au handoff :

1. ajouter le helper `localBusinessSchema()` dans `src/lib/schema.ts`, avec l'adresse **réelle** ;
2. retirer le type correspondant de la liste des interdits dans `seo-audit.mjs`, **dans le même
   commit**, avec le motif en commentaire ;
3. `aggregateRating` **reste interdit** tant qu'il n'y a pas de vrais avis, avec une vraie source.
   Un `aggregateRating` inventé est une violation des politiques des moteurs *et* un problème de
   protection du consommateur.

### 2.3 Les pages qui parlent du prestataire

Trois pages disent aujourd'hui « le prestataire qui vous rappelle est une **entreprise
indépendante** ». Avec un locataire, la formulation doit devenir exacte — et elle dépend du
montage juridique retenu :

- `/conditions-utilisation/` et `/en/terms/` — l'énoncé de mise en relation ;
- `/a-propos/` et `/en/about/` — « comment le service est financé » ;
- `/confidentialite/` et `/en/privacy/` — « à qui les renseignements sont transmis ».

**Si le locataire exploite le site en son nom propre, ce n'est plus un service de mise en
relation** : c'est le site d'une entreprise, et ces trois pages doivent être réécrites en
conséquence. Les laisser telles quelles serait faux dans l'autre sens.

---

## 3. Ce qui NE s'inverse PAS

Ces règles protègent la valeur de l'actif. Elles survivent au handoff.

1. **Aucun avis inventé, aucun témoignage fabriqué, aucun « depuis 19XX ».** Les vrais avis se
   collectent ; ils ne s'écrivent pas.
2. **Aucune instruction d'exécution** (règle 1bis). Le site explique le problème, la
   réglementation et ce qu'un professionnel fait. Jamais comment le faire. C'est de la
   responsabilité civile, pas une préférence éditoriale.
3. **Aucun chiffre sans source primaire.** `pricing.json` est à `null` partout avec un `todo` qui
   dit quoi ouvrir. Un locataire **peut** publier ses propres fourchettes — ce sont ses prix, il
   en est la source — mais alors elles s'écrivent comme telles, datées, et pas comme un fait de
   marché.
4. **Les URL sont gelées.** Ajouts seulement. Un changement de slug coûte des semaines de
   classement (`CLAUDE.md` règle 4).
5. **Aucune page sans une ligne dans `docs/KEYWORD-MAP.md`** (règle 2).
6. **Les trois portes restent bloquantes.** On améliore la page ou on la rétrograde ; on ne baisse
   jamais un seuil (règle 3).
7. **Le français québécois** — `soumission` et non « devis », `drain français` et non « drainage
   périphérique ». Le tableau complet est dans `CLAUDE.md` règle 5.

---

## 4. Le flux des demandes

```
formulaire  →  worker/lead-form.ts  →  Mailgun  →  LEAD_TO_EMAIL
                                                    (+ LEAD_BCC en copie)
```

- **`LEAD_TO_EMAIL`** devient la boîte du locataire.
- **`LEAD_BCC`** garde une copie côté propriétaire : c'est le registre qui permet de démontrer le
  volume livré. À convenir explicitement avec le locataire — une copie non annoncée d'un courriel
  contenant des renseignements personnels n'est pas acceptable.
- `MAILGUN_DOMAIN` doit rester un sous-domaine **vérifié** (SPF/DKIM), sinon les demandes partent
  en indésirable et personne ne s'en aperçoit avant des semaines.
- **Les clés des champs du formulaire** (`service`, `sector`, `building`, `urgency`, `message`)
  sont définies dans `FIELD_LABELS` de `worker/lead-form.ts`. Elles décident de la mise en forme
  du courriel : changer le HTML sans changer cette table produit des demandes aux champs vides.

---

### 4.1 ⚠ Le responsable des renseignements personnels — à régler AVANT d'activer le formulaire

La loi québécoise sur la protection des renseignements personnels **ne dépend ni d'une
immatriculation ni d'une forme juridique**. Elle s'applique à quiconque recueille les
renseignements, personne physique comprise. Et elle exige que la personne responsable de leur
protection soit **identifiable** par la personne concernée.

`/confidentialite/` promet aujourd'hui un droit d'accès, de rectification et de suppression, et
renvoie vers `/contact/` pour l'exercer. **Tant que `/contact/` ne porte pas un nom réel et un
canal joignable, cette promesse est creuse.**

**La règle qui en découle, et qui doit être respectée :**

> **Ne pas mettre le formulaire en ligne avant qu'un responsable soit nommé sur `/contact/`.**

> ✅ **Satisfait depuis le 2026-08-11.** Le responsable est **Xavier Breton**,
> `contact@solagecapitale.ca`, et les deux `/contact/` le portent. C'est ce qui a débloqué
> l'écriture du formulaire.
>
> **Le nom et le courriel vivent dans UNE constante** — `PRIVACY_OFFICER` dans
> `src/lib/constants.ts` — lue par `/contact/`, `/en/contact/` et le bas des deux pages de
> formulaire. **Au handoff, c'est le seul endroit à changer**, et les cinq emplacements suivent.
> Ne pas réécrire le nom en dur dans une page : les deux jumelles divergeraient au premier oubli.

Deux cas, et un seul est propre :

| Situation | Qui est responsable | Ce qu'il faut |
|---|---|---|
| **Site loué** — le cas nominal | **Le locataire.** C'est lui qui reçoit les demandes à `LEAD_TO_EMAIL` et qui les exploite. | Son nom, sa raison sociale et un courriel joignable sur `/contact/` |
| **Site en ligne sans locataire** | **Le propriétaire du site**, personnellement | Son nom et un courriel sur `/contact/` — ou, plus simple, **ne pas activer le formulaire du tout** |

Le second cas est à éviter : publier les 182 pages sans formulaire actif ne coûte rien et laisse le
site s'indexer pendant la recherche d'un locataire. **Activer une collecte de renseignements sans
responsable nommé est le seul geste de tout ce projet qui créerait une obligation sans contrepartie.**

`LEAD_BCC` mérite la même rigueur : une copie non annoncée d'un courriel contenant des
renseignements personnels n'est pas acceptable, quelle que soit la forme juridique de qui la reçoit.

---

## 5. Ce que le locataire doit fournir avant la mise en service

- [ ] Numéro de **licence RBQ**, et les sous-catégories détenues
- [ ] Adresse et téléphone réels
- [ ] Boîte de réception des demandes (`LEAD_TO_EMAIL`)
- [ ] Accord écrit sur `LEAD_BCC`
- [ ] Territoire réellement desservi — s'il est plus petit que la CMQ, **les hubs de secteur hors
      territoire doivent être retirés, pas laissés en place.** Une page de secteur qui capte une
      demande qu'on ne peut pas servir empoisonne l'actif.
- [ ] Confirmation qu'il assume les pages légales sous sa raison sociale
- [ ] **Nom du responsable de la protection des renseignements personnels + courriel joignable**,
      à publier sur `/contact/` — voir §4.1. **Sans ça, le formulaire ne s'active pas.**

---

## 6. Ce que le propriétaire doit vérifier au moment de remettre

- [ ] `PENDING_IMAGES=strict npm run audit` — vert
- [ ] `link-audit` — NOTE `planned` à **0** (sinon liens morts permanents)
- [ ] `find dist -name '*.js' | wc -l` — **0**
- [ ] Aucun `PLACEHOLDER_` dans `dist/`
- [ ] `docs/IMAGE-CREDITS.md` à jour et transmis
- [ ] Licences OFL présentes dans `public/fonts/`
- [ ] `docs/DEPLOY.md` déroulé au moins une fois, §4 inclus
- [ ] `grep -roh 'style="[^"]*"' dist/` — **vide** (un attribut `style` est annulé par la CSP,
      voir `DEPLOY.md` §4b)
- [ ] `PRIVACY_OFFICER` mis à jour au nom du locataire, et les deux `/contact/` revérifiées
