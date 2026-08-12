/**
 * The single place raw `src/data/*.json` is touched.
 *
 * These files are the support layer, not page entities -- pages themselves live
 * in content collections (`src/content.config.ts`). But "not a collection" must
 * not mean "not validated": every field a template reads is parsed here, at
 * module load, so a malformed data file is a build error rather than a page that
 * renders `undefined` into production.
 *
 * The refinements below are the project's honesty rules made mechanical. A rule
 * that lives only in a doc gets forgotten; a rule that fails `astro check` does
 * not (PLAYBOOK §2, honest nulls -- CLAUDE.md rules 1 and 3).
 */

import { z } from 'astro/zod';

import citiesRaw from '../data/cities.json';
import pricingRaw from '../data/pricing.json';
import regulationsRaw from '../data/regulations.json';
import servicesEnRaw from '../data/services.en.json';
import servicesFrRaw from '../data/services.fr.json';
import { SERVICE_SLUGS, type ServiceKey } from '../data/slugs';

/** `$schema_note`, `$research_note`, `$leads`… are documentation, not entries. */
const entries = <T>(raw: Record<string, unknown>): Record<string, T> =>
  Object.fromEntries(Object.entries(raw).filter(([k]) => !k.startsWith('$'))) as Record<string, T>;

const parse = <T>(schema: z.ZodType<T>, value: unknown, what: string): T => {
  const r = schema.safeParse(value);
  if (!r.success) {
    throw new Error(`${what} is invalid:\n${JSON.stringify(r.error.format(), null, 2)}`);
  }
  return r.data;
};

const localized = z.object({ fr: z.string().min(1), en: z.string().min(1) });
const SERVICE_KEYS = Object.keys(SERVICE_SLUGS) as [ServiceKey, ...ServiceKey[]];
const serviceKey = z.enum(SERVICE_KEYS);

/* ------------------------------------------------------------ regulations -- */

const regulation = z.object({
  code: z.string().min(2),
  status: z.enum(['verified', 'unverified']),
  sourceUrl: z.string().url().nullable(),
  title: localized,
  todo: z.string().nullable().optional(),
}).passthrough().superRefine((r, ctx) => {
  // The whole point of the `verified` flag: it cannot be claimed without a URL
  // someone actually opened.
  if (r.status === 'verified' && !r.sourceUrl) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['sourceUrl'], message: `${r.code}: status "verified" requires a sourceUrl` });
  }
});

export const regulations = parse(
  z.record(regulation),
  entries(regulationsRaw as Record<string, unknown>),
  'src/data/regulations.json',
);

const VERIFIED = new Set(Object.entries(regulations).filter(([, r]) => r.status === 'verified').map(([k]) => k));

/** Only these ever reach a page. Templates must not read `regulations` directly. */
export const verifiedRegulations = Object.fromEntries(
  Object.entries(regulations).filter(([k]) => VERIFIED.has(k)),
);

/* -------------------------------------------------------------- services -- */

const service = z.object({
  name: z.string().min(3),
  shortDescription: z.string().min(60),
  /** What the reader OBSERVES. Never what they should do (rule 1bis). */
  signs: z.array(z.string().min(20)).min(3),
  /** What a professional does, third person. Never a method (rule 1bis). */
  whatProDoes: z.string().min(120),
  regulations: z.array(z.string()),
  regulationsPending: z.array(z.string()),
  related: z.array(serviceKey),
  order: z.number().int().positive(),
}).superRefine((s, ctx) => {
  for (const k of s.regulations) {
    if (!(k in regulations)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['regulations'], message: `unknown regulation "${k}"` });
    } else if (!VERIFIED.has(k)) {
      // Rule 1, mechanically. An unverified fact in `regulations` would render.
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['regulations'], message: `"${k}" is unverified -- it belongs in regulationsPending, not regulations` });
    }
  }
  for (const k of s.regulationsPending) {
    if (!(k in regulations)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['regulationsPending'], message: `unknown regulation "${k}"` });
    } else if (VERIFIED.has(k)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['regulationsPending'], message: `"${k}" is verified -- promote it to regulations` });
    }
  }
});

export type Service = z.infer<typeof service>;

/**
 * `z.record` infers `Partial<Record<K, V>>`, so every lookup would be
 * `possibly undefined` at every call site. The refinement below proves the map
 * is total, so the parsed value is typed as a complete Record -- the check is
 * what earns the cast, not a convenience.
 */
const total = <V>(schema: z.ZodType<V>, label: string) =>
  z.record(serviceKey, schema).superRefine((m, ctx) => {
    for (const k of SERVICE_KEYS) {
      if (!(k in m)) ctx.addIssue({ code: z.ZodIssueCode.custom, message: `missing ${label} "${k}"` });
    }
  }) as unknown as z.ZodType<Record<ServiceKey, V>>;

const servicesFile = total(service, 'service');

export const services = {
  fr: parse(servicesFile, entries(servicesFrRaw as Record<string, unknown>), 'src/data/services.fr.json'),
  en: parse(servicesFile, entries(servicesEnRaw as Record<string, unknown>), 'src/data/services.en.json'),
} as const;

/* --------------------------------------------------------------- pricing -- */

const price = z.object({
  /** `null` is a first-class answer: "no published range" beats a made-up one. */
  range: z.tuple([z.number().positive(), z.number().positive()]).nullable(),
  unit: z.string().nullable(),
  sourceUrl: z.string().url().nullable(),
  sourceLabel: z.string().nullable(),
  checkedOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  todo: z.string().nullable(),
}).superRefine((p, ctx) => {
  // The rule the whole /prix/ page rests on: a figure without a primary source
  // is not publishable. Made unforgeable here rather than left to discipline.
  if (p.range && !p.sourceUrl) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['sourceUrl'], message: 'a non-null range requires a primary sourceUrl (PLAYBOOK §2)' });
  }
  if (p.range && p.range[0] > p.range[1]) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['range'], message: 'min above max' });
  }
  if (!p.range && !p.todo) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['todo'], message: 'a null range must say what to open' });
  }
});

export const pricing = parse(
  total(price, 'price'),
  entries(pricingRaw as Record<string, unknown>),
  'src/data/pricing.json',
);

/** False when /prix/ has nothing sourced to show and must say so plainly. */
export const hasPublishedPricing = Object.values(pricing).some((p) => p.range != null);

/* --------------------------------------------------------------- sectors -- */

const pressureLevel = z.enum(['high', 'moderate', 'low']);

const soilClaim = z.object({ level: pressureLevel, why: z.string().min(40) }).nullable();

const foundationPressure = z.object({
  eras: z.array(z.object({
    span: z.string().regex(/^(avant-1945|1945-1975|1975-1990|1990-2005|apres-2005|\d{4}-\d{4})$/, 'span must be a token, not prose'),
    weight: z.enum(['dominant', 'minoritaire']),
    foundation: z.string().min(3),
    drain: z.string().min(3),
  })).min(1),
  services: z.object({
    'drain-francais': z.object({ level: pressureLevel, why: z.string().min(40) }),
    'fissure-de-fondation': z.object({ level: pressureLevel, why: z.string().min(40) }),
  }),
  ocre: soilClaim,
  pyrite: soilClaim,
  sources: z.array(z.string().url()).optional(),
  todo: z.string().optional(),
}).superRefine((f, ctx) => {
  // Soil claims are the project's highest-risk assertion (question 6). A level
  // without a cited source is exactly the extrapolation that was caught once
  // already -- so it cannot pass the build.
  for (const k of ['ocre', 'pyrite'] as const) {
    if (f[k] && !f.sources?.length) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: [k], message: `a non-null ${k} claim requires at least one source URL` });
    }
  }
  // `high` is the approval gate for the matrix. It may not rest on a minority stratum.
  const hasOldDominant = f.eras.some(
    (e) => e.weight === 'dominant' && (e.span === 'avant-1945' || e.span === '1945-1975' || /^\d{4}-/.test(e.span)),
  );
  if (f.services['drain-francais'].level === 'high' && !hasOldDominant) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['services', 'drain-francais'], message: 'high requires a dominant pre-1975 stratum (BRIEF §3)' });
  }
});

const city = z.object({
  tier: z.enum(['A', 'B', 'C']),
  type: z.enum(['borough', 'city', 'island', 'municipality', 'neighbourhood', 'reserve']),
  name: localized,
  municipality: z.string().min(2),
  mrc: z.string().nullable(),
  /** null for sub-sectors with no census figure of their own (Giffard, Charny…). */
  population: z.number().int().positive().nullable(),
  populationSource: z.string().min(2),
  parentSector: z.string().optional(),
  neighbourhoods: z.array(z.string()),
  localTerms: z.array(z.string()).min(3),
  housingStock: localized,
  whyHere: localized,
  publicReferences: z.array(z.string()),
  neighbours: z.array(z.string()),
  heroImage: z.string().nullable(),
  /**
   * Not a flag: the description of the image still to be sourced. Several were
   * written for the previous (pest-control) site and describe soffits and
   * south-facing walls -- see PROGRESS.md. Rewriting them is phase 3 work.
   */
  imagePending: z.string().nullable(),
  foundationPressure,
  /** Stamped by scripts/foundation-pressure.mjs. Absent = classified before the stamp existed. */
  criterion: z.string().optional(),
}).passthrough();

export const cities = parse(
  z.record(city),
  entries(citiesRaw as Record<string, unknown>),
  'src/data/cities.json',
);

export type SectorKey = keyof typeof cities;

/**
 * The matrix approval gate, derived rather than hand-listed so it can never drift
 * from the data (SEO-PLAN §5). The 30-page cap is applied by
 * `scripts/foundation-pressure.mjs merge`, not here.
 */
export const matrixCandidates = (service: 'drain-francais' | 'fissure-de-fondation') =>
  Object.entries(cities)
    .filter(([, c]) => c.foundationPressure.services[service].level !== 'low')
    .map(([slug]) => slug);
