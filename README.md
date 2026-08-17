# Portfolio — David Vornholt

Personal portfolio site built as a Bun/Turbo monorepo with Next.js and a content-first architecture (case studies + blog posts in MDX).

> Built on [davidvornholt/standards](https://github.com/davidvornholt/standards).

## Design system

The visual language is warm editorial print: warm paper surfaces, hairline rules instead of boxes, square corners everywhere, and a deep forest-green voice. The full design contract lives in [`DESIGN.md`](DESIGN.md); all design values (colors, radii, shadows, easing) live in `packages/ui/src/theme.css`.

- Typography: IBM Plex Sans (UI/body), Source Serif 4 (display), IBM Plex Mono (figures/code)
- Color + theming: light only, OKLCH-based warm-paper palette with a deep inverse register
- Theme plumbing: semantic tokens in `packages/ui/src/theme.css`, mapped to Tailwind via `@theme inline`
- Shape: 0px radius everywhere; circles are the only exception
- Texture: subtle film grain overlay via fixed SVG noise layers

## Tech stack

- Next.js 16 (App Router) + React 19
- TypeScript
- Tailwind CSS v4
- Biome (lint + format)
- Velite (MDX content pipeline)
- Umami (cookie-less analytics, optional via `UMAMI_WEBSITE_ID`)

## Content pipeline (MDX)

- Source content lives in `apps/web/content/` (`works/` for case studies, `posts/` for blog).
- Velite compiles content into typed data in `apps/web/.velite/` (configured in `apps/web/velite.config.ts`).

## Development

This repo uses Bun.

- Install: `bun install`
- Dev server: `bun dev`
- Build: `bun build`
- Production: `bun start`
- Full quality gate: `bun run check`
- Auto-fixing quality gate: `bun run check:fix`
- Accessibility suite: `bun run test:a11y`

## Deployment

The `Publish container` workflow waits for the canonical `Standards` workflow
to pass for the exact `main` commit, publishes the image to GHCR under the
tracked `main` tag, and announces the resulting digest to `personal-infra` via
a broker-minted `image-bump` repository dispatch. The production server does
not deploy from this repository: `personal-infra` proves the announcement
against this workflow's own run log, opens a digest-pin promotion PR, and owns
the digest-pinned NixOS runtime and activation policy.

## Standards and secrets

- Pull canonical repository policy: `bun standards sync`
- Verify canonical files, workspace structure, and live GitHub settings: `bun standards check`
- Create or inspect the personal SOPS age identity: `just secrets age-create`
- Edit an encrypted environment file: `just secrets edit dev` or `just secrets edit ci`

Secret shapes are documented in `secrets/*.example.yaml`; real values belong only
in the SOPS-encrypted files. CI decrypts `secrets/ci.yaml` with the
repository-scoped `SOPS_AGE_KEY` GitHub Actions secret.

## Project structure

- `apps/web/src/app/` — Next.js routes and layout.
- `apps/web/src/features/` — feature-level UI.
- `apps/web/src/shared/` — app-local shared UI and content rendering.
- `packages/ui/` — design tokens (`theme.css`) and shared motion easing.
- `packages/typescript-config/` — canonical shared TypeScript configuration.
- `packages/a11y-testing/` — canonical Playwright + Axe harness.
