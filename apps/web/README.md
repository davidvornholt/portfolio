# Web

The public portfolio site, built with Next.js. Case studies and blog posts are plain TSX modules under `src/features/works/content/` and `src/features/posts/content/`, each pairing a typed metadata object with a React body component and collected in a registry that the routes read.

## Commands

- `bun run dev` starts the development server.
- `bun run build` creates the production build.
- `bun run test:a11y` scans every reachable route in desktop and mobile Chromium with Axe.

## Configuration and secrets

This workspace consumes no secrets, and its own code reads no environment variables. Its configuration is tracked source under `src/config/`: the values are served in the HTML of every page that renders the root layout and grant no access to anything, so there is nothing to keep out of the repository and nothing for a build to supply. The one environment the deployed artifact does read is the Next.js server's own — `PORT` and `HOSTNAME`, both set in the root `Dockerfile` and defaulted by Next.js itself.

Every value below is required and has no fallback; each is compiled into the published image by `next build`, so correcting one costs a rebuild, republish, and promotion rather than a configuration change on the host.

- `siteUrl` (`src/config/site.ts`): the site's canonical origin, `https://david.vornholt.online`. Metadata, structured data, and OG image URLs derive from it, and so does the analytics tracked domain below — changing it moves analytics as well.
- `umamiWebsiteId` (`src/config/analytics.ts`): the Umami website record this site reports against.
- `umamiScriptUrl` (`src/config/analytics.ts`): the tracker script's address on the self-hosted installation.
- `umamiTrackedDomain` (`src/config/analytics.ts`): derived as the hostname of `siteUrl`. Passed to the tracker as `data-domains`, which is what keeps development servers and preview builds from reporting.

## Analytics

Umami is self-hosted on `prod-1` at `https://umami.vornholt.online`. The `personal-infra` repository owns that deployment, its DNS record, and the website record this site quotes, so analytics only starts reporting once that repository's side is deployed — until then the tracker request simply fails and the site is unaffected. Both halves of the website record are a contract between the two repositories, pinned on the other side in `infra/modules/apps/umami.nix` as `websiteId` and `websiteDomain`:

- `umamiWebsiteId` here must equal `websiteId` there.
- `umamiTrackedDomain` here — and therefore the hostname of `siteUrl` — must equal `websiteDomain` there.

A mismatch on either is silent: Umami answers normally while discarding every event this site sends. Nothing at runtime detects it, so `src/config/analytics.test.ts` pins both values, and changing one deliberately means changing the other repository in the same breath. The tests exist for that reason and are not redundant literal assertions.

The tracker is scoped to the deployed hostname, so a development server or a preview build still loads the script but reports nothing. The zone apex `vornholt.online` redirects to the canonical host rather than serving the site, so one tracked domain covers every hostname a visitor can arrive on.

Umami tracks pageviews automatically and is cookie-less. Custom events are declared with `data-umami-event` attributes on key interactions: `contact-email`, `social-link` (with `network`), `case-study-open` (with `project`), `post-open` (with `post`), `live-platform-visit` (with `title`), `content-cta` (with `title`), `lab-video-open` (with `video`), `open-source-open` (with `project`), and `standards-open`.
