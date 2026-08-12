/**
 * UI strings. Every literal a visitor reads comes from ui.{locale}.json --
 * seo-audit.mjs hard-errors on key drift between the two files, so a string
 * added in one locale and forgotten in the other fails the build.
 */

import fr from '../data/ui.fr.json';
import en from '../data/ui.en.json';
import type { Locale } from './constants.ts';

const DICTS = { fr, en } as const;

export type UiKey = keyof typeof fr;

export function t(locale: Locale, key: UiKey): string {
  const value = (DICTS[locale] as Record<string, string>)[key];
  // Fail loudly at build time rather than degrade silently at runtime: a blank
  // label that ships is more expensive than a build that stops (PLAYBOOK §0.5).
  if (!value) throw new Error(`Missing UI string "${key}" for locale "${locale}"`);
  return value;
}

/** Bound helper, so templates read `ui('nav.quote')`. */
export const dict = (locale: Locale) => (key: UiKey) => t(locale, key);
