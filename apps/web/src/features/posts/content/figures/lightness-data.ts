import {
  contrast,
  hslToRgb,
  oklchToRgb,
  type Rgb,
  white,
} from '../../services/color';

/**
 * The colors in the article on OKLCH. Nothing here is a measured number:
 * every figure the article prints is computed from these definitions.
 */

// Five hues, written once in HSL and once in OKLCH.
const hues = [
  { name: 'Yellow', hsl: 60, oklch: 100 },
  { name: 'Green', hsl: 120, oklch: 145 },
  { name: 'Red', hsl: 0, oklch: 25 },
  { name: 'Cyan', hsl: 180, oklch: 195 },
  { name: 'Blue', hsl: 240, oklch: 265 },
] as const;

const hslLightness = 0.5;
const oklchLightness = 0.6;
// The strongest chroma, in steps of 0.05, at which all five hues lie inside
// sRGB. At 0.15 the yellow and the cyan do not.
const oklchChroma = 0.1;
const black: Rgb = [0, 0, 0];

export type Model = 'hsl' | 'oklch';

export type Swatch = Readonly<{ name: string; color: Rgb }>;

export const swatchesOf = (model: Model): ReadonlyArray<Swatch> =>
  hues.map((hue) => ({
    name: hue.name,
    color:
      model === 'hsl'
        ? hslToRgb(hue.hsl, 1, hslLightness)
        : (oklchToRgb(oklchLightness, oklchChroma, hue.oklch) ?? black),
  }));

export const ratio = (value: number, digits = 2): string =>
  `${value.toFixed(digits)}:1`;

/** The lowest and the highest contrast against white in a row. */
export const contrastRange = (model: Model): readonly [string, string] => {
  const values = swatchesOf(model).map((swatch) =>
    contrast(swatch.color, white),
  );
  return [ratio(Math.min(...values)), ratio(Math.max(...values))];
};

type Lch = Readonly<{ lightness: number; chroma: number; hue: number }>;

/**
 * The colors of this site that the article measures, as the theme in
 * `packages/ui/src/theme.css` writes them. `lightness-data.test.ts` fails
 * when the theme says something else.
 */
export const themeColors = {
  paper: {
    token: '--paper-100',
    lch: { lightness: 0.985, chroma: 0, hue: 0 },
  },
  ink: {
    token: '--ink-900',
    lch: { lightness: 0.17, chroma: 0.004, hue: 270 },
  },
  mutedInk: {
    token: '--ink-600',
    lch: { lightness: 0.43, chroma: 0.005, hue: 270 },
  },
  caughtGray: {
    token: '--ink-400',
    lch: { lightness: 0.62, chroma: 0.004, hue: 270 },
  },
  red: {
    token: '--red-600',
    lch: { lightness: 0.57, chroma: 0.225, hue: 27 },
  },
} as const satisfies Record<string, { token: string; lch: Lch }>;

const painted = ({ lightness, chroma, hue }: Lch): Rgb =>
  oklchToRgb(lightness, chroma, hue) ?? black;

/** What the site's own colors measure against the ground they stand on. */
export const siteContrasts = [
  {
    name: 'Text on the page',
    value: contrast(
      painted(themeColors.ink.lch),
      painted(themeColors.paper.lch),
    ),
  },
  {
    name: 'Muted text on the page',
    value: contrast(
      painted(themeColors.mutedInk.lch),
      painted(themeColors.paper.lch),
    ),
  },
  {
    name: 'The red on the page',
    value: contrast(
      painted(themeColors.red.lch),
      painted(themeColors.paper.lch),
    ),
  },
  {
    name: 'The gray marks inside the black bar',
    value: contrast(
      painted(themeColors.caughtGray.lch),
      painted(themeColors.ink.lch),
    ),
  },
] as const;

/** The part of the theme the article prints. */
export const themeExcerpt = `:root {
  /* Primitive ramps */
  --paper-100: oklch(0.985 0 0);
  --paper-200: oklch(0.955 0.001 270);
  --line-300: oklch(0.86 0.002 270);
  --ink-900: oklch(0.17 0.004 270);
  --ink-600: oklch(0.43 0.005 270);
  --ink-400: oklch(0.62 0.004 270);
  --ink-200: oklch(0.74 0.004 270);
  --red-600: oklch(0.57 0.225 27);

  /* Semantic aliases */
  --background: var(--paper-100);
  --foreground: var(--ink-900);
  --muted-foreground: var(--ink-600);
  --failed: var(--red-600);
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-muted-foreground: var(--muted-foreground);
  --color-failed: var(--failed);
}`;
