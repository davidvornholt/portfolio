# Web

The public portfolio site, built with Next.js. Case studies and blog posts are plain TSX modules under `src/features/works/content/` and `src/features/posts/content/`, each pairing a typed metadata object with a React body component and collected in a registry that the routes read.

## Commands

- `bun run dev` starts the development server.
- `bun run build` creates the production build.
- `bun run test:a11y` scans every reachable route in desktop and mobile Chromium with Axe.

## Configuration and secrets

This workspace consumes no secrets. It reads two optional configuration values at build time, while the root layout is prerendered, so they must be present in the environment of the `next build` that produces the deployed artifact:

- `UMAMI_WEBSITE_ID` (optional): the Umami website ID. When unset, the analytics tracker is not rendered and analytics is fully disabled. The ID only routes events to a dashboard and grants no access, so it is configuration, not a secret.
- `UMAMI_SCRIPT_URL` (optional): the Umami tracker script URL. Defaults to `https://cloud.umami.is/script.js`; set it when self-hosting Umami.

## Analytics

Umami tracks pageviews automatically and is cookie-less. Custom events are declared with `data-umami-event` attributes on key interactions: `contact-email`, `social-link` (with `network`), `case-study-open` (with `project`), `post-open` (with `post`), `live-platform-visit` (with `title`), `content-cta` (with `title`), and `lab-video-open` (with `video`).
