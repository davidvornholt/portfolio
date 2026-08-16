/**
 * Umami analytics configuration. Values are read at build time while the
 * layout is prerendered, so they must be present in the environment of the
 * `next build` that produces the deployed artifact. When the website ID is
 * unset, no tracker is rendered and analytics is fully disabled.
 */
import process from 'node:process';
export const umamiWebsiteId = process.env.UMAMI_WEBSITE_ID;

export const umamiScriptUrl =
  process.env.UMAMI_SCRIPT_URL ?? 'https://cloud.umami.is/script.js';
