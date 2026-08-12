/**
 * JSON-LD helpers. Never hand-write structured data in a template.
 *
 * DELIBERATELY ABSENT: LocalBusiness, aggregateRating, review, address,
 * openingHours. All of them require a verified address and real reviews, and we
 * have neither -- asserting them would be a spam-policy violation and would
 * poison the asset for the tenant. docs/HANDOFF-TENANT.md flips this on.
 *
 * What we CAN assert truthfully: that a service exists, what area it covers,
 * where a page sits in the hierarchy, and what a FAQ says.
 */

import { SITE_NAME, SITE_URL, type Locale } from './constants.ts';
import { pathFor, urlFor, type PageRef } from './routes.ts';

type Json = Record<string, unknown>;

const abs = (path: string) => new URL(path, SITE_URL + '/').toString();

export function organizationSchema(locale: Locale): Json {
  return {
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: abs(pathFor({ type: 'home' }, locale)),
    // No address, no telephone, no logo claim, no foundingDate. See file header.
  };
}

export function websiteSchema(locale: Locale): Json {
  return {
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: abs(pathFor({ type: 'home' }, locale)),
    inLanguage: locale === 'fr' ? 'fr-CA' : 'en-CA',
    publisher: { '@id': `${SITE_URL}/#organization` },
  };
}

/** `areaServed` is a geographic claim we can actually substantiate. */
export function serviceSchema(opts: {
  locale: Locale;
  name: string;
  description: string;
  ref: PageRef;
  areaServed: string;
}): Json {
  return {
    '@type': 'Service',
    name: opts.name,
    description: opts.description,
    serviceType: opts.name,
    url: urlFor(opts.ref, opts.locale),
    areaServed: { '@type': 'AdministrativeArea', name: opts.areaServed },
    provider: { '@id': `${SITE_URL}/#organization` },
  };
}

export function breadcrumbSchema(
  locale: Locale,
  trail: { name: string; ref: PageRef }[],
): Json {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: urlFor(item.ref, locale),
    })),
  };
}

export function faqSchema(items: { q: string; a: string }[]): Json {
  return {
    '@type': 'FAQPage',
    mainEntity: items.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };
}

export function blogPostingSchema(opts: {
  locale: Locale;
  headline: string;
  description: string;
  ref: PageRef;
  published: Date;
  updated?: Date;
}): Json {
  return {
    '@type': 'BlogPosting',
    headline: opts.headline,
    description: opts.description,
    url: urlFor(opts.ref, opts.locale),
    // Schema helpers need ISO strings, not Date objects (PLAYBOOK §8).
    datePublished: opts.published.toISOString(),
    dateModified: (opts.updated ?? opts.published).toISOString(),
    inLanguage: opts.locale === 'fr' ? 'fr-CA' : 'en-CA',
    publisher: { '@id': `${SITE_URL}/#organization` },
  };
}

/**
 * Wraps any set of nodes into the single graph a page emits.
 *
 * `<` is escaped to its JSON `<` form: the result is injected raw into a
 * `<script>` element, and a `</script>` sequence appearing inside any string
 * value would close the tag early and spill the rest of the graph into the page
 * as markup. `<` is still the same character to every JSON parser, so the
 * structured data is unchanged.
 */
export const graph = (nodes: Json[]): string =>
  JSON.stringify({ '@context': 'https://schema.org', '@graph': nodes }).replace(
    /</g,
    '\\u003c',
  );
