# Web

The public portfolio site, built with Next.js. Case studies and blog posts are plain TSX modules under `src/features/works/content/` and `src/features/posts/content/`, each pairing a typed metadata object with a React body component and collected in a registry that the routes read.

## Commands

- `bun run dev` starts the development server.
- `bun run build` creates the production build.
- `bun run test:a11y` scans every reachable route in desktop and mobile Chromium with Axe.

## Configuration and secrets

This workspace consumes no secrets and reads no environment variables. Its analytics identity is tracked configuration in `src/config/analytics.ts`, next to the site URL it belongs with: the website ID and script URL are served in every page's HTML and grant no access to the dashboard, so there is nothing to keep out of the repository and nothing for a build to supply.

## Analytics

Umami is self-hosted on `prod-1` at `https://umami.vornholt.online`; the `personal-infra` repository owns that deployment. The website ID in `src/config/analytics.ts` must match the record it provisions there — the two are a contract, and a mismatch is silent: Umami answers normally while discarding every event this site sends.

The tracker is scoped to the deployed hostname, so a development server or a preview build loads it and reports nothing.

Umami tracks pageviews automatically and is cookie-less. Custom events are declared with `data-umami-event` attributes on key interactions: `contact-email`, `social-link` (with `network`), `case-study-open` (with `project`), `post-open` (with `post`), `live-platform-visit` (with `title`), `content-cta` (with `title`), and `lab-video-open` (with `video`).
