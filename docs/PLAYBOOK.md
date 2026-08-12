# PLAYBOOK — building a rank-and-rent local SEO site

Consolidated from the 12 build sessions + the deployment sessions of `exterminateur-qc.ca`
(286 pages, FR/EN, three audit gates at zero errors, 0 KB client JS, live on Cloudflare Tunnel).

**This file is domain-agnostic.** It is written to be copied into a *new* project in a
different niche. Wherever the pest-control site is used as an example, it is an example —
the method is what transfers.

> If you are an agent starting a new site: read this file, then `CLAUDE.template.md`.
> Do not read the old project's `PROGRESS.md` — everything durable from it is already here.

---

## 0. Read this first — how to not waste tokens

The single biggest cost across 12 sessions was **rework caused by ordering**. These seven
rules are what the whole playbook optimizes for.

1. **Build the route and register the audit family BEFORE writing any content for a new page
   type.** Sessions 4–7 each lost time to a missing route. Worse: session 4 nearly shipped a
   false pass, because the uniqueness gate reported an *empty* family as clean — a green gate
   checking nothing. A page type is not "started" until `getStaticPaths` renders one page and
   the gate counts it.
2. **Generate every list from data. Never hand-maintain one.** Sitemap alternates, internal
   link grids, the `llms.txt` index, the "planned URLs" registry — all derived. A hand-written
   list of 286 URLs is stale on the next commit, and a stale index is worse than none.
3. **Verify against built HTML, not against an agent's report.** Every single time this was
   done it caught something: half the hero images silently not rendering, 21 EN pages
   rendering zero output, four permanent dead links, meta descriptions over the cap.
4. **One source of truth per fact, enforced by derivation.** When two places can disagree,
   they eventually will. Approved combos derive from the same field the link grid derives
   from, so demoting one removes its link automatically.
5. **Fail loudly at build time rather than degrade silently at runtime.** Templates throw on a
   missing data entry; `resolveImage()` throws on an unknown image name. A blank hero that
   ships is more expensive than a build that stops.
6. **Reproduce the exact deployment environment locally before debugging it remotely.** The
   final production bug (see §10.4) survived three wrong hypotheses and was solved in one shot
   by setting one variable to `""` locally.
7. **Write down findings as you go.** Session 3's note about a mislabelled photo prevented a
   session 4 mistake. This is the cheapest possible insurance.

**Corollary for cost:** phases 1–3 below are pure scaffolding and should be done by the
strongest model available, once, carefully. Phases 4–7 are bulk content and parallelize well.
Getting phase 1–3 wrong makes phases 4–7 cost 2–3× more.

---

## 1. What this pattern is, and its structural ceiling

Build a content site that ranks in **local organic** search for a service niche in a defined
metro area, then rent it to an operator who actually performs the service.

**Because no real business exists yet, the site cannot have:** an address, a phone number
implying a location, reviews, star ratings, testimonials, certification or licence numbers, a
founding date, team bios, or job photos presented as its own work.

**Therefore it cannot have a Google Business Profile**, which means **no map pack, no review
stars, no "near me" results**. This is the known, permanent ceiling of the pattern until a
tenant attaches. Plan for organic only. Do not let anyone "solve" it by inventing a NAP —
citations built on invented details are a consumer-protection problem *and* poison the
citation graph the tenant will later need to be consistent with. Building them is actively
worse than not building them.

**What you compete on instead:** the long tail. The head term is owned by incumbents with
decades of citations. The winnable ground is `{service} × {sub-area}` and
`{problem} × {locality}` — hundreds of low-competition queries no incumbent bothers to write
for.

**The counterintuitive payoff:** the honesty constraint turns into an asset. A site that
cannot say "industry leader since 1985" has to say something verifiable instead — real
regulations, real price ranges, real public references. That is precisely the material that
earns AI citations and featured snippets (see §12). Sites full of unsubstantiated superlatives
have nothing quotable.

---

## 2. Stack — decided, do not re-litigate

| Choice | Why | Trap avoided |
|---|---|---|
| **Astro, static output** | 0 KB JS by default; this is the competitive edge on Core Web Vitals | — |
| **No adapter at all** | Every page prerenders. The one route that must execute (the lead form) lives *outside* Astro, as a platform function | An adapter drags in a Node origin, and a Node origin serving prerendered pages emits `cache-control: max-age=0` — see below |
| **TypeScript strict** | The FR/EN pairing system is type-driven | — |
| **Tailwind via `@tailwindcss/vite`** | No PostCSS config | — |
| **`trailingSlash: 'always'` + `build.format: 'directory'`** | One directory per route; URLs always end in `/` | A POST to a non-slashed URL 301s and **a browser converts POST→GET on a 301**, silently losing form submissions |
| **Self-hosted font, one subset** | Latin subset covers accented characters; ~48 KB | A second subset request firing at runtime |
| **Content collections + Zod** | Schema *is* the content brief; invalid pages cannot build | — |
| **Cloudflare Worker with static assets** | Free, cached at the edge by default, `_headers` works, no machine to keep alive. The lead form is the Worker's only executable route | Self-hosting behind a tunnel cost this project a month of zero caching and zero security headers — see §10 |

**Pinned versions matter.** `@astrojs/check` peer-requires TypeScript `^5 || ^6` — pinning TS
to 5.9 is deliberate. Node must be **24**.

**Pin the transitive native dependencies too.** `@napi-rs/wasm-runtime` declares
`@emnapi/core@^1.7.1 || ^2.0.0-alpha.3`. npm 11 resolves that to the stable branch; npm 10
takes the prerelease branch and then declares it missing from the lockfile. **No lockfile can
satisfy both resolvers**, so regenerating is not a fix — three CI builds died proving it. Ship
this in `package.json` from day one:

```json
"overrides": {
  "@emnapi/core": "1.11.3",
  "@emnapi/runtime": "1.11.3",
  "@emnapi/wasi-threads": "1.2.3"
}
```

And validate with the build platform's own command before pushing, not just your local npm:

```bash
npx npm@10.9.2 clean-install --progress=false   # whatever version the platform reports
```

---

## 3. The phase plan (12 sessions → 8 phases)

Ordering is load-bearing. Each phase's output is the next phase's input.

### Phase 1 — Foundation (do this carefully; everything else depends on it)
- Project memory: `CLAUDE.md`, `SEO-PLAN.md`, `CONTENT-BRIEF.md`, `KEYWORD-MAP.md`,
  `HANDOFF-TENANT.md`, `DEPLOY.md`.
- **The URL system** — `src/data/slugs.ts` (the full slug registry for every entity, both
  locales) + `src/lib/routes.ts`. Pages declare a locale-independent `PageRef`; canonical,
  both hreflang alternates and the language switcher are all **derived** from it. *This is the
  single mechanism that keeps FR/EN pairs correct across a dozen sessions.* Build it before
  any page exists.
- **The honest schema layer** — `Organization` + `WebSite` + `Service`/`BreadcrumbList`/
  `FAQPage`/`BlogPosting`. Deliberately **not** `LocalBusiness`, **no** `aggregateRating`:
  both require a verified address and real reviews. The tenant handoff flips this.
- **The four scripts**, built now because `package.json` gates the build on them (§6).
- Layout shell, design tokens, CSS-only mobile menu.

### Phase 2 — Data layer
Define Zod schemas first, then populate. Entities, generalized:

| This project | Generic role |
|---|---|
| `pests.{locale}.json` (23) | **Service/problem entities** — what the customer has |
| `cities.json` (51) | **Geo entities** — where they have it |
| `matrix.json` (30 approved / 19 demoted) | **Approved service × geo combinations** |
| `pricing.json` | **Real price ranges, each with a source** |
| `commercial` (8) | **B2B verticals** — higher value, far lower competition |

**The geo file is the whole game.** Each entry carries ≥10 `localTerms` (real neighbourhoods,
arteries, landmarks, housing-stock era, municipal references), a `whyHere` explaining the
*mechanism* that makes this problem happen *here*, `housingStock`, `pressure` rankings and
`publicReferences`. `localTerms` is what the anti-doorway gate counts. **This file is the
difference between real local pages and doorway pages.** Budget real research time for it.

**Honest nulls are mandatory.** Where a real figure does not exist, store `null` with a
`TODO:` source note and render "no published figure". This project shipped 9 null prices and
null populations for neighbourhoods (per-neighbourhood figures are not published; an estimate
would be a fabrication).

### Phase 3 — Assets + the combination matrix
- Images into `src/assets/` (see §9), each with bilingual alt text in a keyed JSON.
- **Derive the approved matrix from the data**, not from ambition: a combo is approved only
  where the geo entry already ranks that service high/moderate — i.e. where a distinct
  `whyHere` genuinely exists. Everything else is **demoted** and becomes a *section on the geo
  hub* instead of its own page. Write demotions down with the reason.
- **40 real pages beat 49 with 9 doorway pages dragging the domain down.**

### Phase 4 — Primary service hubs (money pages), locale A
1800–2600 words each. Build the route first. Register the family in the gate.

### Phase 5 — Secondary + adjacent entities, locale A
Where a second family appears (this project: wildlife, which needed different framing —
protected species, "this page sells nothing"), **register it in the gate in the same commit**.
It shipped unchecked here for a full session.

### Phase 6 — Geo hubs, then the matrix, locale A
Geo hubs first: the matrix pages link up to them. Do geo in tiers (A/B/C by importance) and
finish a tier cleanly rather than half-writing all of them.

### Phase 7 — Commercial verticals + utility pages + the lead form
Utility pages (`/quote/`, `/pricing/`, `/about/`, `/contact/`, `/privacy/`, `/process/`,
`/faq/`, `/emergency/`, `/service-area/`, `/sitemap/`) are one-off `.astro` files, not a
collection — each is structurally unique. That is correct; it means ~10 individual pages.

**The `about` page is the hardest page on the site.** No company, no team, no founding date,
no address. It must talk about the *service* and the *region*. Do not invent a history.

### Phase 8 — Locale B mirror, then blog, then sitewide QA, then launch prep
- **Locale B is a translation of the argument, not of the sentences.** Rewrite where the
  target language's search phrasing differs.
- Blog exists to capture informational queries and pass internal links up to money pages.
- QA phase target: drive link-audit warnings down by fixing **templates and scripts**, not
  individual pages, so the fix holds for pages added later.

---

## 4. Architecture decisions not to re-litigate

- **`src/lib/*.ts` and `src/data/slugs.ts` use relative `.ts` import specifiers**, not path
  aliases. Node strips TS types natively, so the audit scripts import the *same* slug registry
  the site uses. Aliases would break the scripts and re-introduce a second copy of the list.
  `.astro` components still use aliases.
- **Reusable/templated content lives in `src/data/*.json`; the unique prose per page lives in
  `src/content/**/*.md`.** Never hardcode copy in an `.astro` file.
- **Every UI string goes in `ui.{locale}.json`.** The audit checks FR/EN key parity.
- **Headings use `color: inherit`**, not a pinned colour — pinning breaks contrast inside dark
  sections.
- **A "planned but not built" URL is a warning; a URL that is neither built nor planned is a
  hard error.** That carve-out is what lets locale A ship ahead of locale B without disabling
  the gate. It also has a failure mode — see §7.3.

---

## 5. The content recipe

Full per-type recipe: copy `CONTENT-BRIEF.md` and swap the domain examples. The universal
rules:

| Element | Rule |
|---|---|
| `<title>` | ≤ 60 chars, primary keyword first, unique site-wide |
| Meta description | 140–158 chars, keyword + reason to click, unique site-wide |
| `<h1>` | Exactly one, contains the keyword, **never identical to the title** |
| First paragraph | Answers the query in 2 sentences; keyword in the first 100 words. Never "Welcome to…" |
| CTA | One above the fold, one mid-page, one at the end |
| Internal links | ≥5 contextual outbound in body copy, varied anchors, never "click here" |
| FAQ | `<details>`/`<summary>`, no JS |
| Schema | Through the helper module only, never hand-written JSON-LD |

**Tone:** calm, factual, competent. *The single most persuasive thing on the page is accurate
information the competitors don't bother to provide.*

**Forbidden:** "industry leader", "best in {region}", "since X years", "thousands of satisfied
customers", any superlative that cannot be substantiated.

**The money-page section order that works** (adapt the nouns): identify the problem → signs →
why it matters (with a real figure) → the protocol, named by *method category* not by
commercial product → what it costs, with the variables that move it → **the regulatory angle**
→ prevention → sub-area link grid → FAQ ≥8 → related entities.

**The regulatory section is the differentiator.** Most competitors omit it entirely. Present
the regulation as a *public fact the reader can verify and demand*, never as a credential the
site holds. Getting this wrong is the easiest rule-1 violation to commit accidentally: "the
price of a **certified** treatment" implies you hold the certification. "You can ask to see
the certificate before work begins" is consumer education. Use the second framing.

---

## 6. The three audit gates

Wired into `npm run build` so they block. Thresholds used here:

**`seo-audit.mjs`** — duplicate/missing titles and descriptions (`TITLE_MAX 60`,
`DESC_MIN 140`, `DESC_MAX 158`), self-referencing canonicals, exactly one `<h1>`, **hreflang
reciprocity across the whole build**, `PLACEHOLDER_` leaks, missing `alt`, UI-dictionary key
drift between locales.

**`link-audit.mjs`** — broken internal links, orphan money pages (`MIN_INBOUND 3`), outbound
density (`MIN_OUTBOUND 5`), anchor-text diversity (`ANCHOR_MAX 25`).

**`uniqueness-check.mjs`** — the anti-doorway gate:
`MAX_SIMILARITY 0.35` (Jaccard on 5-word shingles vs any sibling) · `MIN_LOCAL_FACTS 5` ·
`MIN_FAQ 4` · `MIN_WORDS 400` · distinct hero + alt.

### 6.1 The three things that make these gates actually work

1. **`PLACEHOLDER_` as a hard error is a safety net worth building on day one.** Unanswered
   questions (form endpoint, phone number) live in config as `PLACEHOLDER_*`. The template
   computes `hasEndpoint = !value.startsWith('PLACEHOLDER_')` and **spreads the attribute
   conditionally**, so while unanswered *no attribute is emitted at all*. The form physically
   cannot ship half-wired.
2. **A family not registered in the gate ships unchecked, and the gate reports a clean pass.**
   This happened twice (wildlife, commercial) and nearly a third time. Registering a family is
   part of building its route, not a later step.
3. **The gate scans the *rendered* body**, which includes `h1`, frontmatter fields the template
   renders, and all FAQ text. That is why the anti-doorway argument fields (`localAngle`,
   `housingStock`, `publicReference`) are rendered as **visible page furniture** rather than
   left as validated-but-unused metadata: the schema forces the argument to be stated, so it
   should appear on the page.

### 6.2 Never lower a threshold to make a page pass

Every time a page failed, the fix was to make the page genuinely better or to demote it. One
page hit 4 local terms and was fixed by weaving in three terms *where they genuinely belonged*
— not by padding a keyword list. **That is the intended failure mode: it caught a page drifting
away from its own subject.**

---

## 7. Bilingual pairing — the part that silently breaks

### 7.1 THE BUG THAT MATTERS — read before adding any locale-split collection

**Astro's glob loader treats a `slug` field in frontmatter as an ID OVERRIDE.** If a collection
uses `slug`, then `fr/foo.md` and `en/foo.md` both claim the id `foo`, collide, and **one is
silently discarded — no error, no warning.** Files exist on disk, pass schema validation, and
render **zero pages**. The SEO audit reports 0 errors because the pages simply do not exist.

**The tell:** log `getCollection(...)` inside `getStaticPaths` and look at the ids. Bare ids
(`foo`) instead of `fr/foo` means the directory prefix was dropped.

**The fix, applied to every collection that uses a `slug` field:**
```ts
generateId: ({ entry }) => entry.replace(/\.md$/, '')
```

### 7.2 Slugs that genuinely differ per locale

Blog slugs differ (a translated headline gives a translated slug), so a post cannot know its
twin's slug from its own frontmatter. Give it a `translationKey` and build the pair by
matching on it. **A post ships as a pair or it does not ship** — enforce it by making the SEO
audit hard-error on a non-noindex page missing an alternate, so the build refuses rather than
relying on discipline.

### 7.3 Dangling links to pages that will never exist

Demoted entities stay in the data file, so anything driving links from that file links them.
The "planned but not built" carve-out means the audit never flags it — the URLs count as
planned *forever*. Four permanent dead links hid this way for six sessions.

**Fix:** drive link grids from `getCollection(...)` (what actually has a page), not from the
raw data file. Demoted entities still appear as **plain text**, which keeps the territory
listing complete and honest.

### 7.4 Locale-specific gate vocabulary

The local-facts rule matches source-language terms as literal substrings. That is right for
proper nouns (place names stay in the source language in any locale) but **wrong for generic
vocabulary** — it penalises an accurate translation. Solution: an optional `localTermsEn` per
entry, preferred for `*-en` families, falling back to the source list. **Count and thresholds
unchanged.** Populate it lazily, only when a page actually fails. Do not solve it by lowering
the threshold.

---

## 8. Template traps (all cost real time)

- **A generic TS cast in the template body is parsed as JSX** and produces a cascade of
  confusing errors. Hoist typed casts into the frontmatter. (Cost: 11 phantom errors.)
- **`heroImage` must resolve through an eager `import.meta.glob`**, keyed on the **stem** so
  both `foo` and `foo.webp` work, and **throw on no match**. Written both ways in the same
  session, 4 of 8 silently fell back to a placeholder and shipped without their photo.
- **A related-links loop must not assume a section.** Mapping every related key through one
  slug table dies on the first cross-section relation. Use a helper returning the correct
  `PageRef` for either section.
- **`locale === 'fr'` fails type-check in the locale-B twin** of a generated template —
  `locale` is a narrowed literal, so the comparison has no overlap. Use computed keys:
  `{ [locale]: slug, [otherLocale(locale)]: twin }`. *This class of bug appears in only one of
  the two twins, which is exactly what generated-from-template code hides.*
- **Schema helpers need ISO strings** (`.toISOString()`), not `Date` objects.
- **A French apostrophe inside a single-quoted TS string breaks the frontmatter parse.** Use
  double quotes for copy in any language with apostrophes.
- **Non-breaking spaces get silently normalized by file-writing tools.** Check at byte level
  (`c2 a0`), never visually. **Better: keep literal prices out of body copy entirely** and
  link to the pricing page. One project tier sidestepped the whole problem this way, and it
  keeps prices in one place.
- **Centre the reading column, do not widen it.** A 42rem measure inside a 75rem section
  without `mx-auto` hugs the left edge on desktop and looks broken. Mobile is unaffected,
  which is why it survives review.
- **An accessible-name trap:** decorative content inside a card's `<a>` becomes part of the
  link's accessible name. Wrap only the label; put the decoration beside it.

---

## 9. Images and licensing

**Licensing is a launch blocker and it follows the asset to the tenant.** Treat an untraceable
file as a liability, not an asset.

- **Deleting an untraceable file is cheaper than replacing it**, and it removes the risk
  instead of documenting it.
- **Match user-supplied originals by MD5 first, then perceptual hash.** MD5 fails the moment a
  file has been re-encoded — the same photo can have two different sums.
- **Search public-domain archives by SUBJECT, not by place name.** Searching by locality found
  nothing for 15 municipalities; searching by **scientific name** and by **landmark** found 11
  more images immediately.
- **Toponym trap:** place names repeat across countries. Require a regional marker in the
  title for a *place* photo (`Québec`, `Canada`). For a *subject* photo (a species, an object)
  the shooting location is irrelevant.
- **A licence requiring attribution but with no named author is unusable.** Reject it.
- **Verify what is actually in the photo.** Three separate catches: a "residential street"
  that was a German village with a legible sign; an AI image of a "wasp nest removal" showing
  a plain soffit and no nest; a "rat" that was a pet fancy rat, unusable as identification.
- AI-generated images are fine as illustration with honest alt text, **never** as "our work".
- Downscale to ≤2400 px before entering `src/assets/`.
- **Gate images before launch:** an env flag (`PENDING_IMAGES=strict`) that re-arms
  hero-distinctness turns "placeholders everywhere" from an invisible state into a countable
  one.

---

## 10. Deployment

### 10.0 The recommended topology — start here

`visitor → Cloudflare edge → static assets from dist/, or the Worker for the one dynamic route`

Deploy as a **Cloudflare Worker with static assets**. Not Pages: Cloudflare merged the two
products and the "Create" flow now produces a Worker (`*.workers.dev`), which changes one
thing that silently breaks the form — see the trap below.

```jsonc
// wrangler.jsonc — name MUST match the Worker in the dashboard,
// or you create a second one instead of updating it
{
  "name": "myproject",
  "main": "worker/index.ts",
  "compatibility_date": "2026-08-01",
  "assets": {
    "directory": "./dist",
    "binding": "ASSETS",
    "not_found_handling": "none"   // misses fall through so YOU serve the localized 404
  },
  "observability": { "enabled": true }
}
```

Assets are served first; the Worker only sees what no file matches. So `worker/index.ts` routes
the form endpoint and serves the 404 for everything else.

**The five traps this topology has already cost, in order of how quietly they fail:**

1. **`functions/` is a Pages-only convention.** A Worker never reads it. The handler was
   ignored and the form answered `200 Hello world` while discarding the lead. Route explicitly
   in the Worker entry.
2. **`wrangler deploy` overwrites the dashboard's plaintext variables**, but not Secrets.
   Mailgun variables vanished on the first successful deploy. **Store every variable as a
   Secret**, even the ones that are not credentials.
3. **A CSRF allowlist built from the canonical domain blocks your own pre-cutover test.**
   Submitting on `*.workers.dev` returned 403 — the one test that proves leads are delivered
   before real traffic arrives. Accept `Origin === the host the request was sent to`.
4. **`not_found_handling: "404-page"` serves one 404 for every locale.** English visitors get
   the French error page. Handle it in the Worker.
5. **The failure page must not render a contact address it does not have.** It is reached
   precisely when `LEAD_TO_EMAIL` is unset, so it printed "write to us directly at —" with a
   dead `mailto:`.

**Verify the deployed site, never the config:**

```bash
curl -I https://example.com/some-page/
# expect: 200, all security headers, cf-cache-status: HIT on the second call
```

The three audit gates check the **built HTML**. They say nothing about what the server does
with it. Make `curl -I` against production a distinct launch step.

### 10.A Appendix — self-hosting behind a Cloudflare Tunnel

⚠ **This is what the project moved away from on 2026-08-03. Do not choose it by default.**
It works, but a Node origin serving prerendered pages costs two things that are invisible in
the source and were live in production for a month:

- **Nothing is cached.** The Node adapter emits `cache-control: public, max-age=0`;
  Cloudflare reported `cf-cache-status: DYNAMIC` on every request, so all ~282 URLs travelled
  to a home server on every hit, including each Googlebot crawl. On a domain in its first
  indexation wave, origin downtime becomes a reduced crawl rate and dropped pages.
- **Zero security headers.** `public/_headers` is a Pages/Workers-assets feature and is inert
  elsewhere; the Astro-middleware replacement **never runs for prerendered routes**. The
  launch checklist claimed the headers were live. `curl -I` said 0 of 5.

Keep reading only if you deliberately need self-hosting. **Traefik is not in the request
path**, so security headers must come from a Cloudflare Transform Rule.

### 10.1 Networking
- Give the app a **stable, unique network alias** (`myapp-web`) on the shared network. Do not
  point the tunnel at the bare service name (`web` collides across stacks) or at the full
  container name (it carries a project suffix regenerated on every deploy).
- **A network alias only takes effect when the container is recreated.** Adding one and
  restarting does nothing.
- Tunnel Public Hostname type must be **HTTP**, not HTTPS — the container serves plaintext and
  the tunnel provides encryption. HTTPS there causes a TLS handshake failure → 502.
- `HOST=0.0.0.0`, never `127.0.0.1`. No `ports:` mapping — the tunnel connects over the Docker
  network.

### 10.2 Deploys
- `dist/` is in `.gitignore` **and** `.dockerignore`; the image builds it. **A local
  `npm run build` can never reach production.**
- **Restarting a container never rebuilds it.** Only an image build re-runs the build step.
- **A deploy whose file timestamps are new but whose content is old means the build ran against
  a stale checkout.** Check what commit the platform actually pulled.

### 10.3 Behind a TLS-terminating proxy, the framework's CSRF check breaks
Astro's `security.checkOrigin` compares `request.headers.get('origin')` against `url.origin`,
and the Node adapter derives the scheme from `req.socket.encrypted` **alone**. Behind a tunnel
that is `http` while the browser says `https` → **every POST returns 403** and every lead is
lost.

`security.allowedDomains` does **not** fix it (in that code path it only gates whether
`x-forwarded-for` is trusted; the scheme is fixed before it is consulted, and
`x-forwarded-proto` is never read). Middleware cannot fix it either — the origin check runs
ahead of the user middleware chain.

**Fix:** disable the built-in check and reimplement it in the route, comparing the **hostname
only**. That is not a loosening: the hostname is the part an attacker cannot forge; the scheme
carried no security signal, it was purely proxy topology. Accept apex and `www`. Accept a
missing `Origin` on a form with no session or cookie — the worst a forged POST achieves is an
unwanted email, which the honeypot already filters, and rejecting it drops real leads from
privacy tools.

**Same root cause, two more leaks:** build redirect `Location` headers as **root-relative
paths** (valid per RFC 7231 §7.1.2), and resolve any absolute URL in outgoing email against a
canonical `SITE_URL` constant — never against the request URL.

### 10.4 An empty string is not an unset variable — the expensive one
Compose declares optional variables as `${VAR:-}`, which defines them as the **empty string**,
not unset. Code doing `env.BASE_URL ?? 'https://default'` therefore gets `''`, because `??`
only falls back on `null`/`undefined`. The request URL collapsed to a relative path and
`fetch()` threw `Failed to parse URL` **before any network call** — while the credentials, DNS,
egress and remote account were all perfectly fine, and the log said "request failed", which
reads as a transport problem.

**It never reproduced locally**, because running without the variable defined leaves it
`undefined` and `??` behaves as intended.

**Rules:** normalize env at the boundary (`''` and whitespace-only → `undefined`) and **trim**
— a trailing newline pasted into a secrets field silently breaks Basic auth and yields a 401
indistinguishable from a wrong key. Build outbound URLs with `new URL()` so a malformed base
fails legibly at construction. And **any local reproduction must set optional variables
explicitly to `""`**, or it is testing an environment that does not exist.

### 10.5 Cloudflare edge behaviours that will confuse you
- **Cloudflare substitutes its own "Bad gateway" page for an origin 502** (and 504). A
  user-facing error page returning 502 is *replaced*, so the visitor never sees your message
  or your fallback contact link. **Never return 502/504 from the origin for a page a human is
  meant to read.** Use 400 for bad input and 200 for an "our side failed" page — a 200
  carrying an error page is ordinary form practice and the only status guaranteed to arrive
  intact. Observability comes from server logs, not the status code.
- **Cloudflare's managed robots.txt is prepended to yours** and can block AI crawlers. The
  file on disk is no longer what is served.
- **Email Address Obfuscation rewrites `mailto:` links into a JS decoder.** On a page whose
  entire purpose is the fallback address, that makes the address unreadable without JS — and it
  injects client-side JS into a 0-JS site.

### 10.6 Debugging discipline that finally worked
Timing separates "returned before the network call" from "called and was rejected" — but
**connection pooling and a nearby endpoint can compress a round trip below what you can
resolve**, so timing narrows, it does not conclude. Three hypotheses were eliminated by direct
probes from inside the container (`docker exec … printenv | length`, a `fetch()` to the remote
API, then the real credentials). What actually solved it was **reproducing the exact
environment locally**.

---

## 11. Working with parallel subagents

Used successfully for bulk content phases; here is what made it work.

- **Disjoint files only.** Agents write fragments to a scratch directory; the orchestrator
  merges. Never let two agents write the same file.
- **Batch writes.** Agents hit session limits mid-run repeatedly. Batched writes meant nothing
  had to be redone; one unbatched run lost an entire fragment.
- **"Do not run any git command" belongs in every brief.** One agent ran `git stash -u` for a
  clean diff *while two other agents were writing untracked files*. It recovered, but keep the
  line.
- **Split the hardest-to-differentiate pages to the same writer** so near-sibling pages get
  deliberately distinguished rather than accidentally converged.
- **Spot-check research against primary sources.** Population figures were verified against the
  municipal PDF and the national statistics agency, not taken on trust. Note when a source
  itself rounds a figure, so nobody "fixes" it later.
- **Verify agent claims against built output.** The orchestrator caught: a whole family
  shipping unchecked, orphaned pages, over-length meta descriptions, and non-rendering images.
- Good agent behaviours worth asking for explicitly: rewriting pages that land *exactly* at a
  threshold to build margin, and noticing a repeated anchor across a batch and varying it.

---

## 12. AI visibility

**Retrieval, not training, produces citations.** Answers to local queries come from live search
(`OAI-SearchBot`, `ChatGPT-User`, `PerplexityBot`, `Claude-User`). Keep those crawlers allowed.

**`ai-train=no` is the right default for this pattern.** A model trained today ships in 6–18
months and would memorize a version with no business name and no phone number — the one thing a
recommendation needs. And the decision reverses in only one direction: `no → yes` is a toggle;
there is no un-training. Posture: `Content-Signal: search=yes, ai-train=no, use=reference`.

Two terminology traps: blocking `Google-Extended` does **not** remove you from Google's AI
Overviews (those follow ordinary Googlebot), and `ai.txt` is a *training opt-out* format — the
opposite of a referral mechanism.

**What actually earns citations, in order:** (1) being crawlable by the retrieval bots;
(2) complete JSON-LD; (3) verifiable specifics — regulations, real ranges, named public
references; (4) answer-first formatting, a direct 40–60 word answer under each H2.

**`llms.txt`:** cheap, harmless, and **no major provider has publicly confirmed consuming it**.
Ship it, don't oversell it. **Generate it from the collections** — a hand-written index across
hundreds of pages is stale immediately. Use the `## Optional` section for the long-tail pages.
Cross-check that every generated URL has a built page before shipping.

---

## 13. Definition of done

```bash
npm run build          # astro check + all three audits, blocking
npm run audit          # re-run audits against dist/
PENDING_IMAGES=strict npm run audit   # pre-launch image gate
```

Then verify **against `dist/`, not the audit summary**:

| Check | Expected |
|---|---|
| `find dist/client -name '*.js' \| wc -l` | `0` |
| `PLACEHOLDER_` strings in output | `0` |
| Phone numbers / addresses anywhere | `0` |
| Every `<script>` tag | `application/ld+json` only |
| Dangling internal links | `0` |
| hreflang reciprocity | 100 %, only intentionally single-locale pages exempt |
| Sitemap alternates | every URL, generated **from the rendered HTML** so the two cannot disagree |

Lighthouse target, both desktop and mobile: **100/100/100/100**.

---

## 14. What to copy into a new project

**Verbatim, needs only renaming:**
`scripts/` (all four) · `src/lib/routes.ts` · `src/lib/schema.ts` · `src/lib/images.ts` ·
`src/content.config.ts` (schemas) · `astro.config.mjs` · `Dockerfile` · `docker-compose.yml` ·
`src/middleware.ts` · `src/pages/api/*` (the form handler, with §10.3–10.4 fixes baked in) ·
`src/pages/llms.txt.ts`

**Adapt:** `CLAUDE.template.md` → `CLAUDE.md` · `CONTENT-BRIEF.md` (swap domain examples) ·
`SEO-PLAN.md` · `KEYWORD-MAP.md` (structure) · `HANDOFF-TENANT.md` · `ui.{locale}.json`

**Rebuild from scratch for the new niche:** the geo file, the entity files, pricing, the
approved matrix. That research *is* the product; it does not transfer.

---

## 15. The rules, in one screen

1. Never invent trust. No address, phone, review, rating, testimonial, certification number,
   founding date, team bio, or borrowed photo presented as own work.
2. No page without a row in the URL ↔ keyword registry.
3. No page that fails the uniqueness gate. It becomes a section on the parent hub instead.
4. URLs are frozen after launch. Additions only.
5. Write the target locale's *actual* vocabulary, not the metropolitan variant. Non-breaking
   spaces in prices and units. Accents mandatory everywhere, including titles and meta.
6. Every page ships with its twin, or an explicit TODO row.
7. No new client-side JS dependency without a written Core Web Vitals justification.
8. Update the progress journal at the end of every session: what shipped, what's next, open
   questions, and anything the next session would otherwise rediscover.
