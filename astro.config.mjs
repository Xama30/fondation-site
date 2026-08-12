// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

/**
 * No adapter, on purpose. Every page prerenders; the one route that executes
 * (the lead form) lives in worker/index.ts, outside Astro. Adding an adapter
 * drags in a Node origin, and a Node origin serving prerendered pages emits
 * `cache-control: max-age=0` -- a month of zero edge caching on the previous
 * project. See docs/PLAYBOOK.md §2 and §10.
 *
 * `site` comes from the environment because the domain is not chosen yet.
 * Production MUST set SITE_URL; the localhost default is a dev convenience and
 * would produce wrong canonicals if it ever shipped.
 */
export default defineConfig({
  site: process.env.SITE_URL || 'http://localhost:4321',
  trailingSlash: 'always',
  build: { format: 'directory' },
  // A POST to a non-slashed URL 301s, and a browser turns POST into GET on a
  // 301 -- which silently loses every form submission.
  vite: { plugins: [tailwindcss()] },
});
