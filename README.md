# Portfolio — David Vornholt

Personal portfolio site built as a Bun/Turbo monorepo with Next.js and a content-first architecture (case studies + blog posts as typed TSX modules).

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
- Umami (cookie-less analytics, self-hosted at `umami.vornholt.online`)

## Content

- Case studies live in `apps/web/src/features/works/content/`, blog posts in `apps/web/src/features/posts/content/`.
- Each entry is a plain TSX module: a typed metadata object plus a React body component, collected in a registry the routes read. The type checker validates metadata; there is no separate content build step.

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

The `Publish container` workflow waits for the canonical `Standards` workflow to pass for the exact `main` commit, publishes the image to GHCR under the tracked `main` tag, and announces the resulting digest to `personal-infra` via a broker-minted `image-bump` repository dispatch. The production server does not deploy from this repository: `personal-infra` proves the announcement against this workflow's own run log, opens a digest-pin promotion PR, and owns the digest-pinned NixOS runtime and activation policy.

## Pull request previews

An open, non-draft, same-repository pull request to `main` gets a preview when it carries the `pr-preview` label. The preview becomes available at `https://<pull-request-number>.pr.david.vornholt.online` after the exact head passes the full repository gate and its credential-free container smoke test. Removing the label, converting the pull request to draft, retargeting it, closing it, or failing the current build removes the preview.

The pull request job has `contents: read` only. It uploads a bounded image archive instead of publishing to the registry. A trusted completed-run workflow checks the artifact, current pull request state, trusted workflow files, and an independent Standards run before it publishes the immutable digest and invokes the restricted host command.

Portfolio has no database, migrations, writable application data, or app secrets. Its preview therefore gets an isolated container, system identity, no-egress Podman network, loopback port, and Caddy route without an invented database boundary. `personal-infra` owns those resources and the unproxied wildcard DNS record.

## Standards and secrets

- Pull canonical repository policy: `bun standards sync`
- Verify canonical files, workspace structure, and live GitHub settings: `bun standards check`
- Create or inspect the personal SOPS age identity: `just secrets age-create`
- Edit an encrypted environment file: `just secrets edit dev` or `just secrets edit ci`

Secret shapes are documented in `secrets/*.example.yaml`; real values belong only
in the SOPS-encrypted files. CI decrypts `secrets/ci.yaml` with the
repository-scoped `SOPS_AGE_KEY` GitHub Actions secret.

`secrets/pr-preview.yaml` contains only the forced-command SSH key used by the main-only `pr-preview` GitHub environment. Its separate age identity cannot decrypt development or CI credentials.

## Project structure

- `apps/web/src/app/` — Next.js routes and layout.
- `apps/web/src/features/` — feature-level UI.
- `apps/web/src/shared/` — app-local shared UI and content rendering.
- `packages/ui/` — design tokens (`theme.css`) and shared motion easing.
- `packages/typescript-config/` — canonical shared TypeScript configuration.
- `packages/a11y-testing/` — canonical Playwright + Axe harness.
