# Portfolio — David Vornholt

Personal portfolio site built with Next.js and a content-first architecture (case studies + blog posts in MDX).

## Editorial Tech (Design System)

The visual language is “Editorial Tech”: modern product UI discipline with editorial typography.

- Typography: IBM Plex Sans (UI/body), Source Serif 4 (headings), IBM Plex Mono (code)
- Color + theming: light mode, OKLCH-based palette (deep-forest primary + stone neutrals)
- Theme plumbing: CSS variables in `src/app/globals.css`, mapped to Tailwind via `@theme inline`
- UI primitives: shadcn/ui (`base-vega`, baseColor `stone`, CSS variables), radius `0.375rem`
- Texture: subtle “film grain” overlay via a fixed SVG noise layer

## Tech Stack

- Next.js 16 (App Router) + React 19
- TypeScript
- Tailwind CSS v4 + tw-animate-css
- Biome (lint + format)
- Velite (MDX content pipeline)

## Content Pipeline (MDX)

- Source content lives in `content/` (`works/` for case studies, `posts/` for blog)
- Velite compiles content into typed data in `.velite/` (configured in `velite.config.ts`).

## Development

This repo uses Bun.

- Install: `bun install`
- Dev server: `bun dev`
- Build: `bun build`
- Production: `bun start`
- Lint: `bun lint`
- Format: `bun format`

## Project Structure (high level)

- `src/app/` — Next.js routes and layout
- `src/app/posts/[slug]/page.tsx` — post detail
- `src/app/works/[slug]/page.tsx` — work/case study detail
- `src/features/` — feature-level UI (portfolio screen, case study screen)
- `src/shared/` — shared UI + content rendering (MDX components/layout)
