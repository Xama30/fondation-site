/**
 * Image resolution, keyed on the file STEM so both `drain-bnq` and
 * `drain-bnq.webp` resolve, and THROWING when nothing matches.
 *
 * Why it throws: written the permissive way on the previous project, 4 of 8
 * heroes silently fell back to a placeholder and shipped without their photo.
 * A build that stops is cheaper than a blank hero that ships (PLAYBOOK §0.5).
 */

import type { ImageMetadata } from 'astro';

const files = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/img/**/*.{jpg,jpeg,png,webp,avif}',
  { eager: true },
);

const byStem = new Map<string, ImageMetadata>();
for (const [path, mod] of Object.entries(files)) {
  const stem = path.split('/').pop()!.replace(/\.[^.]+$/, '');
  byStem.set(stem, mod.default);
}

export function resolveImage(name: string): ImageMetadata {
  const stem = name.replace(/\.[^.]+$/, '');
  const found = byStem.get(stem);
  if (!found) {
    throw new Error(
      `Unknown image "${name}". Available: ${[...byStem.keys()].join(', ') || '(none yet)'}`,
    );
  }
  return found;
}

/** True while a page still has no licensed photo. Feeds PENDING_IMAGES=strict. */
export const hasImage = (name: string | null | undefined): name is string =>
  Boolean(name) && byStem.has(name!.replace(/\.[^.]+$/, ''));
