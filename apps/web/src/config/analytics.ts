/**
 * Umami analytics identity. These values are public — they are served in every
 * page's HTML and grant no access to the dashboard — so they are tracked
 * configuration alongside the site URL rather than build-time environment.
 *
 * The website ID must match the row the `personal-infra` repository provisions
 * in the self-hosted Umami installation. Changing it here orphans every event
 * already recorded under the old one.
 */
import { siteUrl } from './site';

export const umamiWebsiteId = '81f10165-1458-492d-9893-9e04b4e37a17';

export const umamiScriptUrl = 'https://umami.vornholt.online/script.js';

// The tracker reports nothing when it is loaded from any other host, so
// development servers and preview builds cannot pollute production's numbers.
export const umamiTrackedDomain = new URL(siteUrl).hostname;
