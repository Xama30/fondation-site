/**
 * Content collection schemas. The schema IS the content brief: a page cannot be
 * created in a broken state, and a missing FAQ or a missing local reference is a
 * build error rather than a page that quietly under-performs.
 *
 * Collections are empty until phases 4-6 write into them. The routes that
 * consume them are created in the SAME commit as their first real page and
 * their entry in FAMILIES (scripts/uniqueness-check.mjs) -- a family with no
 * members is skipped silently and the gate reports a clean pass.
 *
 * Split by locale via the file path (`services/fr/*.md`, `services/en/*.md`) so
 * a missing translation is visible as a missing file rather than an empty field.
 */

import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * ⚠ THE BUG THAT MATTERS. Astro's glob loader treats a `slug` frontmatter field
 * as an ID OVERRIDE, so `fr/foo.md` and `en/foo.md` both claim the id `foo`,
 * collide, and one is SILENTLY DISCARDED -- files exist, schema validates, zero
 * pages render, and the SEO audit reports 0 errors because the pages simply do
 * not exist. Keeping the directory prefix in the id is the fix. Do not remove.
 */
const generateId = ({ entry }: { entry: string }) => entry.replace(/\.md$/, '');

const faqItem = z.object({
  q: z.string().min(8),
  a: z.string().min(40),
});

/** Shared SEO frontmatter. Lengths mirror the thresholds in seo-audit.mjs. */
const seo = {
  /** <title>. seo-audit errors above 60 characters. */
  title: z.string().min(10).max(60),
  /** <h1>. Must differ from `title` -- enforced below. */
  h1: z.string().min(6),
  metaDescription: z.string().min(140).max(158),
};

/** A title and an h1 that are byte-identical waste the second one. */
const distinctH1 = <T extends { title: string; h1: string }>(
  data: T,
  ctx: z.RefinementCtx,
) => {
  if (data.title.trim() === data.h1.trim()) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['h1'], message: 'h1 must differ from title' });
  }
};

const services = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/services', generateId }),
  schema: z
    .object({
      ...seo,
      locale: z.enum(['fr', 'en']),
      /** Key in SERVICE_SLUGS. The URL comes from the registry, never from here. */
      service: z.string(),
      /** >= 4 entries: the uniqueness gate enforces MIN_FAQ on the rendered body. */
      faq: z.array(faqItem).min(4),
      /**
       * The regulatory angle, stated as a public fact the reader can verify and
       * demand -- never as a credential this site holds (rule 1).
       */
      regulation: z.string().min(60),
      sources: z.array(z.object({ label: z.string(), url: z.string().url() })).min(1),
      heroImage: z.string().nullable().default(null),
      heroAlt: z.record(z.enum(['fr', 'en']), z.string()).nullable().default(null),
      order: z.number().int().default(50),
    })
    .superRefine(distinctH1),
});

const sectors = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/sectors', generateId }),
  schema: z
    .object({
      ...seo,
      locale: z.enum(['fr', 'en']),
      /** Key in src/data/cities.json. */
      sector: z.string(),
      faq: z.array(faqItem).min(4),
      /**
       * Why THIS problem happens HERE. Rendered as visible page furniture, not
       * left as validated-but-unused metadata: the schema forces the argument to
       * be stated, so it belongs on the page (PLAYBOOK §6.1).
       */
      localAngle: z.string().min(120),
      publicReference: z.string().min(20),
      heroImage: z.string().nullable().default(null),
      heroAlt: z.record(z.enum(['fr', 'en']), z.string()).nullable().default(null),
    })
    .superRefine(distinctH1),
});

const matrix = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/matrix', generateId }),
  schema: z
    .object({
      ...seo,
      locale: z.enum(['fr', 'en']),
      service: z.string(),
      sector: z.string(),
      faq: z.array(faqItem).min(4),
      localAngle: z.string().min(120),
      publicReference: z.string().min(20),
      heroImage: z.string().nullable().default(null),
      heroAlt: z.record(z.enum(['fr', 'en']), z.string()).nullable().default(null),
    })
    .superRefine(distinctH1),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog', generateId }),
  schema: z
    .object({
      ...seo,
      locale: z.enum(['fr', 'en']),
      /**
       * Blog slugs genuinely differ per locale, so a post cannot know its twin's
       * slug from its own frontmatter. Pairs are built by matching on this key.
       * A post ships as a pair or it does not ship (PLAYBOOK §7.2).
       */
      translationKey: z.string(),
      slug: z.string(),
      published: z.date(),
      updated: z.date().optional(),
      sources: z.array(z.object({ label: z.string(), url: z.string().url() })).min(1),
    })
    .superRefine(distinctH1),
});

export const collections = { services, sectors, matrix, blog };
