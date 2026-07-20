# Portfolio — David Vornholt

Personal portfolio site built as a Bun/Turbo monorepo with Next.js and a content-first architecture (case studies + blog posts in MDX).

> Built on [davidvornholt/standards](https://github.com/davidvornholt/standards).

## Editorial tech design system

The visual language is “Editorial Tech”: modern product UI discipline with editorial typography.

- Typography: IBM Plex Sans (UI/body), Source Serif 4 (headings), IBM Plex Mono (code)
- Color + theming: light mode, OKLCH-based palette (deep-forest primary + stone neutrals)
- Theme plumbing: CSS variables in `apps/web/src/app/globals.css`, mapped to Tailwind via `@theme inline`
- UI primitives: shadcn/ui (`base-vega`, baseColor `stone`, CSS variables), radius `0.375rem`
- Texture: subtle “film grain” overlay via a fixed SVG noise layer

## Tech stack

- Next.js 16 (App Router) + React 19
- TypeScript
- Tailwind CSS v4 + tw-animate-css
- Biome (lint + format)
- Velite (MDX content pipeline)

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

The `Publish container` workflow builds the exact `main` commit that passed the
canonical `Standards` workflow and publishes it to GHCR under an immutable
`sha-<commit>` tag. The production server does not deploy from this repository:
`personal-infra` owns the digest-pinned NixOS runtime and activation policy.

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
- `packages/typescript-config/` — canonical shared TypeScript configuration.
- `packages/a11y-testing/` — canonical Playwright + Axe harness.
