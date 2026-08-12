# {{DOMAIN}} — project instructions

> **Template.** Copy to `CLAUDE.md` at the repo root and replace every `{{PLACEHOLDER}}`.
> Delete this blockquote. The reasoning behind every rule here is in `docs/PLAYBOOK.md` —
> read that once before the first session, then work from this file.

**Read this file, then `docs/PROGRESS.md`, before doing anything.**
`docs/PROGRESS.md` is the memory across sessions. `docs/SEO-PLAN.md` is the full strategy.

---

## What this project is

A bilingual ({{LOCALE_A}} primary, {{LOCALE_B}} secondary) {{NICHE}} website for
**{{METRO_AREA}}**, built to rank in local organic search and then be **rented to an operating
{{OPERATOR_TYPE}}**.

There is **no real business behind the site yet**. That single fact drives the hard rules below.

- Domain: `{{DOMAIN}}`
- Target: ~{{PAGE_TARGET}} indexable pages
- Stack: Astro static (no adapter) → Cloudflare Worker with static assets
- The one route that executes is the lead form, at `worker/index.ts` — **not** under
  `functions/`, which only Cloudflare Pages reads. See `docs/PLAYBOOK.md` §10.

---

## The 8 hard rules

### 1. Never invent trust
No fake address. No phone number implying a location we don't have. No invented review, star
rating, testimonial, certification number, licence number, "since 19XX", team member bio, or
job photo presented as our own work.

**Why:** these are search-engine spam-policy violations *and* consumer-protection problems.
They would poison the asset for the eventual tenant, which defeats the entire point.

**What to do instead:** the site speaks in the second person about the *service* and the
*problem*, cites verifiable public facts ({{REGULATOR}} rules, {{TRIBUNAL}} decisions, real
price ranges), and uses a lead form + call-tracking number. Trust markers get filled in by the
tenant at handoff — see `docs/HANDOFF-TENANT.md`.

**The subtle version of this violation:** attaching a regulation to the service being sold
("the price of a *certified* treatment") implies we hold the credential. Present regulations as
public facts the reader can verify and demand — "you can ask to see the certificate before work
begins."

### 2. No page without a `docs/KEYWORD-MAP.md` row
Every URL has one row: URL · locale · page type · primary keyword · secondary keywords ·
status. If the row doesn't exist, the page doesn't get built. This prevents keyword
cannibalization and uncontrolled page sprawl.

### 3. No page that fails the uniqueness gate
`scripts/uniqueness-check.mjs` blocks the build. A {{ENTITY}} × {{AREA}} page that can't clear
it becomes a *section* on the area hub instead of its own thin page. **Better 40 real pages
than 49 with 9 doorway pages dragging the whole domain down.**

Never lower a threshold to make a page pass. Fix the page or demote it, and write down which.

### 4. URLs are frozen after launch
Additions only. A slug change costs weeks of ranking. Get it right in `docs/KEYWORD-MAP.md`
before creating the file.

### 5. Write {{LOCALE_A_VARIANT}}, not {{LOCALE_A_METROPOLITAN}}

| Use | Not |
|---|---|
| {{TERM_1_CORRECT}} | {{TERM_1_WRONG}} |
| {{TERM_2_CORRECT}} | {{TERM_2_WRONG}} |
| {{CURRENCY_FORMAT}} | {{CURRENCY_WRONG}} |

Use the non-breaking space in prices and units. Accents are mandatory everywhere including
headings, titles and meta descriptions.

**Check NBSP at byte level (`c2 a0`), never visually** — file-writing tools silently normalize
it. Better still: keep literal prices out of body copy and link to the pricing page.

### 6. Every {{LOCALE_A}} page ships with its {{LOCALE_B}} twin
Or an explicit TODO row in `docs/PROGRESS.md`. {{LOCALE_B}} is a real translation *of the
argument*, not of the sentences — rewrite where the target language's search phrasing differs.
Never a machine dump, never a transliterated slug.

### 7. No new JS dependency without justification
Astro ships 0 KB JS by default and that is the site's competitive edge. Any client-side JS
needs a line in `docs/PROGRESS.md` explaining the Core Web Vitals cost. Interactive components
use `<details>`, CSS, or `client:visible` at worst.

### 8. Update `docs/PROGRESS.md` at the end of every session
What shipped · what's next · open questions · anything you learned that the next session would
otherwise rediscover.

---

## Before you build a new page type

In this order, in the same commit:

1. Add the row(s) to `docs/KEYWORD-MAP.md`.
2. Build the route and confirm it renders **one real page**.
3. **Register the family in `FAMILIES` in `scripts/uniqueness-check.mjs`.**
4. Then write content.

Skipping 3 means the family ships unchecked *and the gate reports a clean pass*. This has
happened twice. A green gate checking nothing is worse than no gate.

---

## Traps that have already cost time here

- **A collection using a `slug` frontmatter field needs an explicit `generateId`** —
  `generateId: ({ entry }) => entry.replace(/\.md$/, '')`. Without it, locale-split files
  collide on the id and **one is silently discarded**: files exist, schema validates, zero
  pages render, audits report 0 errors.
- **Hoist typed casts into the frontmatter.** A generic TS cast in the template body is parsed
  as JSX.
- **Resolve images through an eager `import.meta.glob` keyed on the stem, and throw on no
  match.** A bare string path skips optimization; a silent fallback ships a page without the
  photo it declares.
- **Use double quotes for copy containing apostrophes** — a French apostrophe in a
  single-quoted TS string breaks the frontmatter parse.
- **`locale === '{{LOCALE_A}}'` fails type-check in the {{LOCALE_B}} twin** of a generated
  template. Use computed keys.
- **Drive link grids from `getCollection(...)`, never from the raw data file** — demoted
  entities stay in the data and become permanent dead links the audit cannot see.
- **Never return 502/504 from the origin for a page a human reads** — the CDN replaces it with
  its own error page. 400 for bad input, 200 for an "our side failed" page.
- **An empty string is not an unset variable.** Compose writes `${VAR:-}` as `''`, and `??`
  does not fall back on `''`. Normalize and trim env at the boundary.
- **Astro silently excludes `src/pages/_*.astro` from routing.** A scratch page named with a
  leading underscore never builds, so anything it was meant to exercise never runs — and the
  build reports a clean pass. Same failure shape as the `generateId` collision above.
- **A validation module that nothing imports never executes.** Type-checking a schema file
  proves it compiles, not that the data satisfies it. Until a real page imports it, the
  guarantee is theoretical. Wire it into a page or a build step, and say so in `PROGRESS.md`
  while it is dormant.
- **`null` coerces to `0` in arithmetic and does it quietly.** A ranking key like
  `population / 1e6` turns every null-population entity into the worst-ranked one, silently
  deciding a cut. Use `?? 0` deliberately, or exclude the field from the key.
- **Inherited data from the previous site hides in more fields than the obvious ones.** Beyond
  the fields you plan to rewrite, check every free-text field written for the old vertical —
  image-need descriptions, alt text, TODOs. A leftover that reads plausibly is worse than one
  that reads absurdly.
- **Never run a generator without reading what it writes.** A script that regenerates a block
  between `GEN` markers silently reverts any hand curation inside it. The fix is not to redo the
  edit: make the generated field *derived* from the file that owns the decision, so manual
  curation becomes impossible rather than temporary. **One owner per decision.**
- **Nested geography cannot carry its own `service × place` page.** If an entity has a
  `parentSector` (a neighbourhood inside a borough), a page for both cannibalizes one intent
  across nested geography. Filter on the parent link, not on tier — tier is a proxy that drifts.

---

## Bulk work across many entities (the {{ENTITY_COUNT}}-entity problem)

Per-entity research — one paragraph for each of ~50 areas, services, or products — is the
expensive, quality-critical part of a build like this. Done badly it produces interchangeable
paragraphs, which is the exact doorway page the uniqueness gate exists to block. Run it with
parallel subagents, under these rules:

1. **The subagent writes to disk and returns ≤ 1 line per entity.** Its final report lands in
   the orchestrator's context, so returning prose just moves the cost instead of removing it.
   Enforce a strict report format in the brief.
2. **One file per entity. Never concurrent writes to one large JSON.** A single-threaded merge
   step recombines them afterwards. This is also what makes the work resumable.
3. **The resume registry is the directory listing — not a second state file**, which would
   drift. `status` diffs the directory against the full key list.
4. **Stamp each file with the version of the rule it was classified under.** Existence is not
   enough the moment a criterion changes mid-run: an agent that evaluates an entity and leaves
   it unchanged writes nothing, so "unmodified" and "unprocessed" become indistinguishable, and
   file timestamps cannot separate them either. Without the stamp, a rule change is a blind
   restart. Have `status` flag stale stamps and the merge refuse them.
5. **Write one self-contained brief the agent reads cold.** It should not read this file or
   `PROGRESS.md`. The prompt then fits in two lines, and the brief's fixed cost is amortized by
   grouping 4-6 entities per agent.
6. **Group batches by whatever makes entities resemble each other** — era, category, size — not
   alphabetically. Agents cannot see each other, so two similar entities in two different
   batches will *independently converge on the same natural phrasing*. Same batch, they see
   themselves repeat and vary.
7. **Add a mechanical duplicate-phrase check anyway.** Compare every pair of generated texts for
   shared n-grams (8 words worked) and fail the merge above a threshold. Rule 3 applies: rewrite
   the entity, never lower the threshold.
8. **A global cap cannot be respected by parallel agents.** They classify on *absolute* written
   criteria; the single-threaded merge ranks and cuts.

**Make each unit of work self-contained, so an interruption leaves finished units.** If an entity
ships as a pair (a page and its translation), tell the agent to write both before moving to the
next entity — never "all the FR first, then all the EN." A session limit killed nine agents
mid-run here and left three French pages with no English twin, which violates the ship-as-a-pair
rule and had to be repaired by hand. The same principle applies to any multi-file entity.

**Launch in two waves rather than one.** Nine concurrent agents exhausted a session budget in a
single evening. Half the fleet, then the rest, costs nothing extra and halves what is in flight
when a limit hits.

**Never run the full build while agents are still writing.** A file rewritten mid-scan gets
picked up twice and the content loader reports `Duplicate id "…"` — the same message as the
`generateId` collision bug, but caused by a race, not by the data. Tell agents to verify with
the type-checker only (it does not write `dist/`), and run the build yourself once they are all
done. Otherwise you will chase a phantom.

**Pilot one small batch before fanning out.** Five entities cost little and surfaced three real
defects here — a recycled sentence, a free-text field that should have been a token, and a
classification resting on a minority stratum — all invisible in a single entity.

---

## Building the first page of a family

The uniqueness gate reports `N pages` per family. **Until N ≥ 1 for a family, every green run on
it is meaningless** — a family with no members is skipped silently. So:

1. Add the `KEYWORD-MAP.md` row (including for section index pages — they are pages too).
2. Build the route **and register the family** in the gate's `FAMILIES` list.
3. Write **one** page, FR + EN, and check the gate prints `N pages` with N ≥ 1.
4. Only then fan out the rest.

Doing step 3 before step 4 is the whole point. It cost a previous session a phase that looked
finished and had verified nothing.

**A section index page is not optional furniture.** Without `/section/`, every hub in that
section has one inbound internal link and the link audit says so. It is also the cheapest page
to build, since it is generated from the collection.

**Drive every link grid from the content collection, never from the data file.** A demoted or
not-yet-written entity stays in the JSON and becomes a permanent dead link that the "planned"
exemption covers for life.

**Only verified facts may reach the render.** Expose two accessors — `all` and `verifiedOnly` —
and have templates read the second. Then an unverified entry cannot reach a page even by an
editing mistake, which is a stronger guarantee than remembering the rule.

**Every interface string belongs in the locale dictionaries**, including `<h2>` section
headings inside a route. A heading hardcoded in the FR template makes the EN twin drift by
construction.

---

## Make the honesty rules mechanical

Rules 1 and 3 are about not publishing what you cannot support. A rule that lives only in a doc
gets forgotten at 2 a.m.; a rule that fails `astro check` does not. Encode them as schema
refinements over the data files:

- a non-null price range **requires** a non-null primary `sourceUrl`;
- a null range **requires** a `todo` saying what to open;
- a regulatory entry marked `verified` **requires** a `sourceUrl`;
- an unverified key may not appear in the array that renders — only in a `…Pending` array;
- a claim that depends on external evidence **requires** a non-empty `sources` array.

**Watch for the adjacent-domain source.** The failure mode is not inventing a number — it is
finding a real source about a *neighbouring* subject and reasoning across the gap. If the
justification contains "extrapolated", "by analogy", "matches the profile" or "to be confirmed",
the honest answer was `null`. Put the URL in the `todo`, not in `sources`, so it helps whoever
reopens the question without posing as evidence.

**And check that your selection criterion actually selects.** A criterion 96 % of entities pass
is true and useless: it stops ranking anything, and the cap then fills by population, producing
pages that differ only in prose. Print the distribution before trusting a gate.

---

## Astro gotchas (this project is on {{ASTRO_VERSION}})

- The **Rust compiler is default** and errors on unclosed or semantically invalid HTML.
  Templates must be well-formed — no `<p>` wrapping a `<div>`, no unclosed tags.
- `compressHTML` defaults to `'jsx'`: whitespace between inline elements is stripped. Check
  spacing around inline links inside paragraphs.
- Content collections live in `src/content.config.ts` with `glob()` / `file()` loaders from
  `astro/loaders`, schemas via `z` from `astro/zod`, queried with `getCollection` / `getEntry`
  / `render`.

## Commands

```bash
npm run dev        # local dev server
npm run build      # includes astro check + the three audit scripts (blocking)
npm run preview    # serve the built site
npm run audit      # uniqueness-check + link-audit + seo-audit against dist/
PENDING_IMAGES=strict npm run audit   # pre-launch image gate
```

## Conventions

- **Files:** kebab-case, {{LOCALE_A}} slugs under {{LOCALE_A}} routes, {{LOCALE_B}} slugs under
  {{LOCALE_B}} routes.
- **Content:** reusable/templated parts live in `src/data/*.json`; the *unique* prose per page
  lives in `src/content/**/*.md`. Never hardcode copy in an `.astro` file.
- **Strings:** every UI string goes in `src/data/ui.{{LOCALE_A}}.json` / `ui.{{LOCALE_B}}.json`.
  No literal copy in a component.
- **Images:** `src/assets/img/` only. Any root-level archive is untouched originals — never
  import from it.
- **Alt text:** both locales, descriptive, local keyword at most once.
- **Schema.org:** built through `src/lib/schema.ts` helpers, never hand-written JSON-LD.
- **URLs:** every link and alternate derives from a `PageRef` through `src/lib/routes.ts`.
  Never hand-write an internal URL.

## Where things are

| Need | File |
|---|---|
| The method, and why every rule exists | `docs/PLAYBOOK.md` |
| Full strategy | `docs/SEO-PLAN.md` |
| What's done / what's next | `docs/PROGRESS.md` |
| How to write each page type | `docs/CONTENT-BRIEF.md` |
| URL ↔ keyword registry | `docs/KEYWORD-MAP.md` |
| Tenant handoff checklist | `docs/HANDOFF-TENANT.md` |
| Deployment + the trap list | `docs/DEPLOY.md` |
| Image licences & credits | `docs/IMAGE-CREDITS.md` |
