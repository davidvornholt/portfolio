/**
 * The color maths behind the figures in the article on OKLCH: what a screen
 * shows for a color written in HSL or OKLCH, how light OKLCH says it is, and
 * its contrast as the accessibility standard (WCAG 2) computes it.
 */

/** Red, green and blue as a screen takes them, each from 0 to 255. */
export type Rgb = readonly [number, number, number];

type Triple = readonly [number, number, number];
type Matrix = readonly [Triple, Triple, Triple];

const byteMax = 255;
const halfTurn = 180;
const cubed = 3;

// The sRGB transfer curve, from IEC 61966-2-1.
const encodedLimit = 0.040_45;
const linearLimit = 0.003_130_8;
const linearSlope = 12.92;
const curveOffset = 0.055;
const curveExponent = 2.4;

const contrastFlare = 0.05;

// biome-ignore-start lint/style/noMagicNumbers: These are published tables of coefficients. A name for each number would only repeat the name of its table.
// How much each linear channel adds to luminance (WCAG 2, relative luminance).
const luminanceWeights: Triple = [0.2126, 0.7152, 0.0722];

// Björn Ottosson's Oklab: https://bottosson.github.io/posts/oklab/
const labToCone: Matrix = [
  [1, 0.396_337_777_4, 0.215_803_757_3],
  [1, -0.105_561_345_8, -0.063_854_172_8],
  [1, -0.089_484_177_5, -1.291_485_548],
];
const coneToLinear: Matrix = [
  [4.076_741_662_1, -3.307_711_591_3, 0.230_969_929_2],
  [-1.268_438_004_6, 2.609_757_401_1, -0.341_319_396_5],
  [-0.004_196_086_3, -0.703_418_614_7, 1.707_614_701],
];
const linearToCone: Matrix = [
  [0.412_221_470_8, 0.536_332_536_3, 0.051_445_992_9],
  [0.211_903_498_2, 0.680_699_545_1, 0.107_396_956_6],
  [0.088_302_461_9, 0.281_718_837_6, 0.629_978_700_5],
];
const coneToLightness: Triple = [
  0.210_454_255_3, 0.793_617_785, -0.004_072_046_8,
];
// biome-ignore-end lint/style/noMagicNumbers: The tables of coefficients end here.

// A channel this far outside 0 to 1 is rounding, not a color out of reach.
const gamutTolerance = 0.0005;

const dot = (left: Triple, right: Triple): number =>
  left[0] * right[0] + left[1] * right[1] + left[2] * right[2];

const transform = (matrix: Matrix, vector: Triple): Triple => [
  dot(matrix[0], vector),
  dot(matrix[1], vector),
  dot(matrix[2], vector),
];

const toLinear = (byte: number): number => {
  const encoded = byte / byteMax;
  return encoded <= encodedLimit
    ? encoded / linearSlope
    : ((encoded + curveOffset) / (1 + curveOffset)) ** curveExponent;
};

const toByte = (linear: number): number => {
  const clamped = Math.min(1, Math.max(0, linear));
  const encoded =
    clamped <= linearLimit
      ? clamped * linearSlope
      : (1 + curveOffset) * clamped ** (1 / curveExponent) - curveOffset;
  return Math.round(encoded * byteMax);
};

const linearOf = (color: Rgb): Triple => [
  toLinear(color[0]),
  toLinear(color[1]),
  toLinear(color[2]),
];

// The steps of the CSS Color 4 formula for HSL.
const hslSteps = 12;
const hslStepDegrees = 30;
const hslRise = 3;
const hslFall = 9;
const hslGreenShift = 8;
const hslBlueShift = 4;

/** The color for an HSL hue in degrees, with saturation and lightness from 0 to 1. */
export const hslToRgb = (
  hue: number,
  saturation: number,
  lightness: number,
): Rgb => {
  const amplitude = saturation * Math.min(lightness, 1 - lightness);
  const channel = (shift: number): number => {
    const step = (shift + hue / hslStepDegrees) % hslSteps;
    const share = Math.max(-1, Math.min(step - hslRise, hslFall - step, 1));
    return Math.round((lightness - amplitude * share) * byteMax);
  };
  return [channel(0), channel(hslGreenShift), channel(hslBlueShift)];
};

/**
 * The color for an OKLCH lightness (0 to 1), chroma and hue in degrees, or
 * `undefined` when it lies outside sRGB, where a browser would show a
 * neighbouring color instead of the one that was written.
 */
export const oklchToRgb = (
  lightness: number,
  chroma: number,
  hue: number,
): Rgb | undefined => {
  const angle = (hue * Math.PI) / halfTurn;
  const cone = transform(labToCone, [
    lightness,
    chroma * Math.cos(angle),
    chroma * Math.sin(angle),
  ]);
  const linear = transform(coneToLinear, [
    cone[0] ** cubed,
    cone[1] ** cubed,
    cone[2] ** cubed,
  ]);
  const reachable = linear.every(
    (channel) => channel >= -gamutTolerance && channel <= 1 + gamutTolerance,
  );
  return reachable
    ? [toByte(linear[0]), toByte(linear[1]), toByte(linear[2])]
    : undefined;
};

/** How light OKLCH says a color is, from 0 (black) to 1 (white). */
export const oklchLightness = (color: Rgb): number => {
  const cone = transform(linearToCone, linearOf(color));
  return dot(coneToLightness, [
    Math.cbrt(cone[0]),
    Math.cbrt(cone[1]),
    Math.cbrt(cone[2]),
  ]);
};

const luminance = (color: Rgb): number =>
  dot(luminanceWeights, linearOf(color));

/** The WCAG 2 contrast ratio of two colors, from 1 (none) to 21. */
export const contrast = (one: Rgb, other: Rgb): number => {
  const lighter = Math.max(luminance(one), luminance(other));
  const darker = Math.min(luminance(one), luminance(other));
  return (lighter + contrastFlare) / (darker + contrastFlare);
};

const hexRadix = 16;

/** The color as CSS writes it in hexadecimal. */
export const toHex = (color: Rgb): string =>
  `#${color.map((channel) => channel.toString(hexRadix).padStart(2, '0')).join('')}`;

export const white: Rgb = [byteMax, byteMax, byteMax];
