# @portfolio/ui

The design system's value layer: the theme tokens and the shared easing curve every app consumes. Design intent and usage rules live in the root `DESIGN.md`; this package owns the values.

## Public API

- `@portfolio/ui/theme.css` — Tailwind v4 theme: oklch primitive ramps, semantic color aliases (`background`, `primary`, `welcome`, the `deep-*` register, …), a zeroed radius scale, the single `shadow-float`, and the single `ease-out` curve. Import it from an app's global stylesheet after Tailwind itself. It disables the default Tailwind palette (`--color-*: initial`), so only semantic color utilities exist.
- `@portfolio/ui/easing` — `easing` (motion-compatible cubic-bezier array) and `easingCss`, kept in sync with the `--ease-out` token so CSS and JS motion share one curve.

## Configuration

This workspace consumes no configuration values and no secrets.
