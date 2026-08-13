# DEPLOY — mise en ligne, et la liste des pièges

**Cible : Cloudflare Worker avec assets statiques.** Pas Cloudflare Pages, pas d'adaptateur Node,
pas de serveur. 182 fichiers HTML préconstruits plus **une seule** route qui s'exécute — le
formulaire, dans `worker/index.ts`.

> **Le domaine est `solagecapitale.ca`** (acheté le 2026-08-11). Le build de production est vert
> et la route est posée dans `wrangler.jsonc`. **Il ne reste que la commande à lancer**, plus la
> configuration Mailgun du §2.
>
> ⚠ **Un seul bloqueur fonctionnel subsiste : Mailgun n'est pas configuré.** Tant que les
> variables du §2 ne sont pas posées, le formulaire répond la page d'erreur de `lead-form.ts` au
> lieu d'envoyer. Le site peut être mis en ligne ainsi — les 188 pages s'indexent — mais **la
> vérification §4a échouera tant que ce n'est pas fait**, et c'est normal.

---

## 0. Avant de commencer

| | |
|---|---|
| Node | **24** (`engines` l'exige) |
| Install | `npm ci` — **jamais `npm install`** en CI, voir §5 |
| Wrangler | **en `devDependency`, épinglé 4.120.0.** `npx wrangler` prend donc la version du dépôt, pas celle du jour |

---

## 1. Le domaine, d'abord

Canoniques, hreflang, sitemap, JSON-LD et courriels sortants dérivent tous de la même valeur.

```bash
npm run build        # le domaine est le défaut
```

**Le domaine est écrit en dur dans exactement TROIS fichiers, tous de la configuration :**

| Fichier | Ce qu'il porte |
|---|---|
| `astro.config.mjs` | `site` — le défaut du build |
| `src/lib/constants.ts` | `SITE_URL` — le défaut du runtime, lu par le Worker |
| `wrangler.jsonc` | la route `custom_domain` **et** `vars.SITE_URL` |

**Aucun n'est du contenu.** Ne jamais écrire de domaine dans une page, un markdown ou un JSON de
données. La liste sert aussi au handoff : `HANDOFF-TENANT.md` §2.1b.

⚠ **Pourquoi en dur et non en variable obligatoire.** Le défaut était `http://localhost:4321`.
C'était juste tant que le domaine n'existait pas ; une fois acheté, c'est devenu **le mode de
panne** — un build sans `SITE_URL` sortait 190 canoniques vers une machine locale, **et sortait
vert** (le garde-fou `PLACEHOLDER_` ne se déclenche pas sur `localhost`). Depuis Workers Builds,
le build tourne dans un CI où la variable s'oublie en silence. Un défaut correct supprime le
risque au lieu de le surveiller.

**Pour travailler en local :** `SITE_URL=http://localhost:4321 npm run build` — la variable reste
prioritaire. `seo-audit.mjs` échoue en erreur dure si une canonique pointe vers `localhost` **sans
que `SITE_URL` l'ait demandé**, donc le cas « obtenu sans l'avoir voulu » est bloqué et le cas
« demandé explicitement » passe.

Le build échoue toujours si `PLACEHOLDER_` atteint une page.

**Le `www`.** Il n'est **pas** déclaré en domaine personnalisé : deux domaines personnalisés
serviraient les 188 pages sous deux hôtes. À régler par une **Redirect Rule** Cloudflare
`www.solagecapitale.ca/*` → `https://solagecapitale.ca/$1` en 301. `CANONICAL_HOSTS` dans
`worker/lead-form.ts` accepte déjà l'origine `www`, donc rien ne casse dans l'intervalle.

---

## 2. Variables d'environnement du Worker

**Une seule est à poser à la main.** Les noms sont sensibles à la casse.

| Nom | Où | Valeur |
|---|---|---|
| `MAILGUN_API_KEY` | **Dashboard → type Secret** | la clé privée. **Jamais dans le dépôt.** |
| `MAILGUN_DOMAIN` | ✅ `wrangler.jsonc` → `vars` | `mg.solagecapitale.ca` — le **sous-domaine** vérifié |
| `LEAD_TO_EMAIL` | ✅ `wrangler.jsonc` → `vars` | `contact@solagecapitale.ca` |
| `SITE_URL` | ✅ `wrangler.jsonc` → `vars` | `https://solagecapitale.ca` |
| `MAILGUN_BASE_URL` | `wrangler.jsonc`, en commentaire | `https://api.eu.mailgun.net` **si compte en région UE** |
| `LEAD_BCC` | `wrangler.jsonc`, en commentaire | copie du registre — **à convenir par écrit** (`HANDOFF-TENANT.md` §4) |

Chemin du secret : **Compute (Workers) → `fondation-site` → Settings → Variables and Secrets →
Add → type Secret**.

⚠ **POURQUOI LES NON-SECRÈTES SONT DANS LE DÉPÔT ET NON DANS LE TABLEAU DE BORD.** Le bloc `vars`
définit **l'ensemble complet** des variables en clair du Worker : une variable ajoutée uniquement
dans le tableau de bord est **retirée au déploiement suivant**. Le piège est vicieux — le
formulaire marche le jour où on la pose à la main, puis meurt au prochain `git push` sans qu'une
ligne du dépôt ait changé. **Les secrets ne sont pas concernés** : ils sont stockés à part et
survivent aux déploiements. Aucune des trois valeurs versionnées n'est confidentielle — le
domaine est public, `mg.` apparaît dans les en-têtes de tout courriel envoyé, et
`contact@solagecapitale.ca` est déjà publié sur `/contact/`.

Une variable manquante **ne fait pas planter silencieusement** : `lead-form.ts` les nomme dans le
log du Worker et sert une page d'erreur lisible. `console.error` remonte dans le tableau de bord
et dans `npx wrangler tail` — c'est la seule observabilité du formulaire.

**Délivrabilité :** le message part **de** notre sous-domaine Mailgun, avec `Reply-To` sur le
visiteur. Envoyer `From:` l'adresse du visiteur échoue SPF/DKIM et part en indésirable. Ne pas
« simplifier » ça.

⚠ **VÉRIFIER MAILGUN SUR LE SOUS-DOMAINE `mg.`, JAMAIS SUR L'APEX.** Mailgun demande des
enregistrements **MX** sur le domaine qu'on lui fait vérifier. Or `contact@solagecapitale.ca` —
l'adresse du responsable publiée sur `/contact/`, celle dont dépend la promesse de
`/confidentialite/` — passe par **Cloudflare Email Routing**, qui pose ses propres MX sur l'apex.
Vérifier Mailgun sur `solagecapitale.ca` écraserait ces MX et **ferait disparaître l'adresse de
contact**, en silence, pendant que le formulaire, lui, continuerait de fonctionner. Sur
`mg.solagecapitale.ca` les deux cohabitent sans se voir.

⚠ **Compte en région UE : `MAILGUN_BASE_URL=https://api.eu.mailgun.net` est obligatoire.** Sans
lui, l'API répond 401 avec des identifiants pourtant valides, et le diagnostic part dans la
mauvaise direction.

⚠ **`LEAD_TO_EMAIL` se pose même si le reste attend.** Sans elle, la page d'erreur du formulaire
n'a aucun repli à offrir : le code omet le paragraphe plutôt que d'afficher un `mailto:` vide —
correct, mais le visiteur se retrouve sans issue.

---

## 3. Déployer

```bash
npm run build        # le domaine est le défaut — plus besoin de préfixer SITE_URL
npx wrangler dev     # ⚠ OBLIGATOIRE — voir ci-dessous
npx wrangler deploy
```

**Aucune variable de build à poser dans Workers Builds.** Le domaine est le défaut
d'`astro.config.mjs` depuis le 2026-08-12, précisément pour qu'un CI ne puisse pas l'oublier.
`SITE_URL` reste prioritaire si on la pose — c'est ce qui permet le travail local :
`SITE_URL=http://localhost:4321 npm run build`.

`npm run build` enchaîne `astro check` → build → `post-build` → les trois audits. **Si une porte
est rouge, on ne déploie pas** — on corrige la page, jamais le seuil (règle 3).

### ⚠ `wrangler dev` n'est pas facultatif, et `--dry-run` ne le remplace pas

Le dry-run **bundle sans jamais exécuter**. Il était vert pendant que le Worker levait
`ReferenceError: process is not defined` **au chargement du module** — donc sur chaque requête
qu'il traite : le formulaire **et tous les 404**. Le site aurait eu l'air parfaitement sain,
parce que Cloudflare sert les assets statiques sans invoquer le code et que les 190 pages
répondaient 200. Trouvé le 2026-08-11, jamais détecté avant parce que personne n'avait lancé le
Worker.

Les 8 contrôles locaux, quelques secondes :

```bash
B=http://localhost:8788
curl -s -o /dev/null -w "%{http_code}\n" $B/                       # 200, statique
curl -sI $B/api/soumission/ | grep -i "^HTTP\|^allow"              # 405 + Allow: POST
curl -s -o /dev/null -w "%{http_code}\n" -X POST $B/api/soumission/ \
  -F "name=T" -F "email=t@e.com" -F "locale=fr"                    # 200 (ou 303 si Mailgun est prêt)
curl -s -o /dev/null -w "%{http_code}\n" -X POST $B/api/soumission \
  -F "name=T" -F "email=t@e.com" -F "locale=fr"                    # surtout PAS 301
curl -s -o /dev/null -w "%{redirect_url}\n" -X POST $B/api/soumission/ \
  -F "name=B" -F "email=b@e.com" -F "website=x" -F "locale=fr"     # 303 -> /merci/
curl -s -o /dev/null -w "%{http_code}\n" $B/merci/                 # 200 — la cible du 303 existe
curl -s -o /dev/null -w "%{http_code}\n" $B/nexiste-pas/           # 404 réel
curl -s $B/en/nexiste-pas/ | grep -o '<html[^>]*>'                 # lang="en-CA"
```

---

## 4. Vérifications APRÈS le premier déploiement

Ces cinq contrôles ne peuvent pas se faire en local. Trois d'entre eux ont déjà échoué en
production sur le projet précédent.

**a) Le formulaire envoie réellement.**

```bash
curl -i -X POST https://solagecapitale.ca/api/soumission/ \
  -F "name=Test" -F "email=test@example.com" -F "locale=fr"
```

Attendu : un **303 vers `/merci/`**, **et un courriel qui arrive**. Puis ouvrir `/merci/` dans un
navigateur — la page existe depuis la session 5 seulement ; avant, le 303 aboutissait à un 404 et
**une soumission réussie ressemblait exactement à un échec**. Aucune porte ne peut le voir : la
cible d'une redirection du Worker n'est pas un lien dans le HTML. Sur le projet précédent,
le handler était sous `functions/` — une convention que seul Pages lit — donc il était ignoré et
chaque POST répondait `200 Hello world` en jetant la demande. **Un formulaire qui répond 200 et
perd le prospect est le pire échec possible ici.**

**b) Les en-têtes de sécurité sont réellement appliqués.**

```bash
curl -sI https://solagecapitale.ca/ | grep -iE "content-security|strict-transport|x-content-type"
```

`public/_headers` est appliqué **par la plateforme**, pas par le Worker : avec un binding
`assets`, Cloudflare sert l'asset avant d'invoquer le code, donc le Worker ne voit jamais passer
une vraie page. **Si les en-têtes sont absents**, le repli est `run_worker_first` dans
`wrangler.jsonc` — ça fonctionne, mais ça coûte une invocation par requête.

⚠ **Et si l'en-tête EST présent, regarder la page.** La CSP pose `style-src 'self'` sans
`'unsafe-inline'`, ce qui bloque aussi les **attributs** `style=`. Les 34 gabarits en portaient
un (`padding-block:3rem`) : la CSP l'annulait, et les 188 pages perdaient leur air vertical au
moment précis où cette vérification-ci annonçait un succès. Corrigé en session 5 par les classes
`.bloc-page` / `.bloc-page-ample` de `global.css`. Contrôle de non-régression, à faire tourner
avant tout déploiement :

```bash
grep -roh 'style="[^"]*"' dist/ | sort | uniq -c   # doit être VIDE
```

**Ne jamais réintroduire d'attribut `style=` dans un gabarit.** Un `<style>` de composant Astro
est extrait dans une feuille externe et passe la CSP ; un attribut `style`, non.

**c) Le 404 est un vrai 404, dans la bonne langue.**

```bash
curl -sI https://<domaine>/nexiste-pas/    | grep -i "^HTTP"   # 404
curl -s  https://<domaine>/en/nexiste-pas/ | grep -o "<html[^>]*>"  # lang="en-CA"
```

Un « soft 404 » — page d'erreur servie en 200 — fait indexer la page d'erreur.

**d) Aucun JavaScript n'est parti.**

```bash
find dist -name '*.js' | wc -l    # doit valoir 0
```

C'est l'avantage compétitif du site (règle 7). Le Worker tourne à la périphérie, pas dans le
navigateur.

**e) `sitemap.xml`, `robots.txt` et `llms.txt` portent le bon domaine.**

```bash
curl -s https://<domaine>/robots.txt
curl -s https://<domaine>/sitemap.xml | head -5
```

Ils sont générés depuis les canoniques du HTML rendu, donc s'ils sont faux, le HTML l'est aussi.

---

## 5. Les pièges qui ont déjà coûté du temps

- **`npm ci` casse sur Cloudflare sans les overrides `@emnapi`.** Ils sont dans `package.json`
  depuis le premier commit (`@emnapi/core` 1.11.3, `@emnapi/runtime` 1.11.3,
  `@emnapi/wasi-threads` 1.2.3). Ne pas les retirer.
- **Deux copies de Vite.** `@tailwindcss/vite` tire Vite 8, Astro embarque 6.4.3 → `astro check`
  échoue. L'override `"vite": "6.4.3"` règle ça. **À revérifier à chaque montée d'Astro.**
- **Ne jamais renvoyer 502/504 depuis l'origine pour une page qu'un humain lit** : le CDN la
  remplace par la sienne. 400 pour une entrée invalide, 200 pour « c'est nous qui avons échoué ».
- **Ne jamais transformer l'acceptation des deux URL du formulaire en redirection.** Un navigateur
  dégrade un POST en GET quand il suit un 301, ce qui perd la soumission. `/api/soumission` et
  `/api/soumission/` sont acceptées telles quelles, exprès.
- **`not_found_handling: "none"` dans `wrangler.jsonc` est délibéré.** `"404-page"` servirait
  `/404.html` pour tout, y compris sous `/en/`, donnant une page d'erreur française aux
  anglophones.
- **Renommer `name` dans `wrangler.jsonc` crée un SECOND Worker** au lieu de mettre à jour
  l'existant.
- **Le certificat CD5, `pest`, `exterminateur-qc.ca`** — le dépôt vient d'un site antiparasitaire.
  Quatre fichiers documentaient encore l'autre projet en session 4. **Après toute reprise de code,
  greper les termes de l'ancienne verticale sur tout le dépôt, `worker/` compris.**

---

## 6. Ce qui reste à faire avant une vraie mise en ligne

1. ~~Choisir le domaine~~ — **`solagecapitale.ca`**, câblé.
2. ~~Écrire `/soumission/` et `/contact/`~~ — **écrites, plus `/merci/` et `/en/thank-you/`.**
   La NOTE `planned` de `link-audit` est à **0**.
3. **Créer le sous-domaine Mailgun `mg.solagecapitale.ca` et vérifier SPF/DKIM**, puis poser les
   variables du §2 sur le Worker. **C'est le seul bloqueur fonctionnel restant.** Poser
   `LEAD_TO_EMAIL` même si le reste attend : sans elle, la page d'erreur du formulaire n'a aucun
   repli à offrir au visiteur (le code omet le paragraphe plutôt que d'afficher un `mailto:`
   vide, ce qui est correct mais laisse une impasse).
4. Poser la **Redirect Rule `www` → apex** (§1).
5. Décider du numéro de suivi d'appel (question ouverte n° 7) — ou lancer avec le formulaire seul.
6. Un **favicon** : il n'y en a aucun, le navigateur prend un 404 sur `/favicon.ico`. Cosmétique,
   mais visible dans l'onglet.
7. Dérouler `docs/HANDOFF-TENANT.md` le jour où un locataire arrive.
