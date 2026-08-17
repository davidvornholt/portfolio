import { describe, expect, it } from 'bun:test';
import { file } from 'bun';
import { themeAnchorColors } from './theme-anchor-colors';

const anchorCssNames = {
  paper100: 'paper-100',
  paper200: 'paper-200',
  line300: 'line-300',
  ink900: 'ink-900',
  ink600: 'ink-600',
  green700: 'green-700',
  green800: 'green-800',
  clay600: 'clay-600',
  deepGround900: 'deep-ground-900',
  deepInk100: 'deep-ink-100',
  deepGreen300: 'deep-green-300',
} as const satisfies Readonly<Record<keyof typeof themeAnchorColors, string>>;

type Oklch = Readonly<{
  lightness: number;
  chroma: number;
  hue: number;
}>;

const oklchDeclarationPattern =
  /--(?<name>[a-z0-9-]+):\s*oklch\((?<lightness>-?\d+(?:\.\d+)?)\s+(?<chroma>-?\d+(?:\.\d+)?)\s+(?<hue>-?\d+(?:\.\d+)?)\);/gu;

const degreesPerHalfTurn = 180;
const cubeExponent = 3;
const srgbLinearThreshold = 0.003_130_8;
const srgbLinearScale = 12.92;
const srgbGamma = 2.4;
const srgbGammaScale = 1.055;
const srgbGammaOffset = 0.055;
const colorChannelMinimum = 0;
const colorChannelMaximum = 1;
const maxSrgbByte = 255;
const hexRadix = 16;
const hexWidth = 2;

const oklchToLmsCoefficients = {
  lightnessToL: 0.396_337_777_4,
  chromaToL: 0.215_803_757_3,
  lightnessToM: 0.105_561_345_8,
  chromaToM: 0.063_854_172_8,
  lightnessToS: 0.089_484_177_5,
  chromaToS: 1.291_485_548,
} as const;

const lmsToLinearSrgbCoefficients = {
  redL: 4.076_741_662_1,
  redM: 3.307_711_591_3,
  redS: 0.230_969_929_2,
  greenL: 1.268_438_004_6,
  greenM: 2.609_757_401_1,
  greenS: 0.341_319_396_5,
  blueL: 0.004_196_086_3,
  blueM: 0.703_418_614_7,
  blueS: 1.707_614_701,
} as const;

const parseOklchAnchors = (themeCss: string): ReadonlyMap<string, Oklch> => {
  const anchors = new Map<string, Oklch>();

  for (const match of themeCss.matchAll(oklchDeclarationPattern)) {
    const name = match.groups?.name;
    const lightness = match.groups?.lightness;
    const chroma = match.groups?.chroma;
    const hue = match.groups?.hue;

    if (
      name !== undefined &&
      lightness !== undefined &&
      chroma !== undefined &&
      hue !== undefined
    ) {
      anchors.set(name, {
        lightness: Number(lightness),
        chroma: Number(chroma),
        hue: Number(hue),
      });
    }
  }

  return anchors;
};

const toSrgbHex = ({ lightness, chroma, hue }: Oklch): string => {
  const hueRadians = (hue * Math.PI) / degreesPerHalfTurn;
  const a = chroma * Math.cos(hueRadians);
  const b = chroma * Math.sin(hueRadians);
  const l =
    (lightness +
      oklchToLmsCoefficients.lightnessToL * a +
      oklchToLmsCoefficients.chromaToL * b) **
    cubeExponent;
  const m =
    (lightness -
      oklchToLmsCoefficients.lightnessToM * a -
      oklchToLmsCoefficients.chromaToM * b) **
    cubeExponent;
  const s =
    (lightness -
      oklchToLmsCoefficients.lightnessToS * a -
      oklchToLmsCoefficients.chromaToS * b) **
    cubeExponent;
  const linearChannels = [
    lmsToLinearSrgbCoefficients.redL * l -
      lmsToLinearSrgbCoefficients.redM * m +
      lmsToLinearSrgbCoefficients.redS * s,
    -lmsToLinearSrgbCoefficients.greenL * l +
      lmsToLinearSrgbCoefficients.greenM * m -
      lmsToLinearSrgbCoefficients.greenS * s,
    -lmsToLinearSrgbCoefficients.blueL * l -
      lmsToLinearSrgbCoefficients.blueM * m +
      lmsToLinearSrgbCoefficients.blueS * s,
  ];
  const srgbChannels = linearChannels.map((channel) => {
    const clamped = Math.max(
      colorChannelMinimum,
      Math.min(colorChannelMaximum, channel),
    );
    return clamped <= srgbLinearThreshold
      ? srgbLinearScale * clamped
      : srgbGammaScale * clamped ** (1 / srgbGamma) - srgbGammaOffset;
  });

  return `#${srgbChannels
    .map((channel) =>
      Math.round(channel * maxSrgbByte)
        .toString(hexRadix)
        .padStart(hexWidth, '0'),
    )
    .join('')}`;
};

describe('theme anchor colors', () => {
  it('matches the sRGB mirrors to the canonical OKLCH anchors', async () => {
    const themeCss = await file(
      new URL('../../../../../../packages/ui/src/theme.css', import.meta.url),
    ).text();
    const anchors = parseOklchAnchors(themeCss);

    for (const mirrorName of Object.keys(anchorCssNames) as ReadonlyArray<
      keyof typeof themeAnchorColors
    >) {
      const cssName = anchorCssNames[mirrorName];
      const anchor = anchors.get(cssName);
      if (anchor === undefined) {
        throw new Error(`Theme anchor ${cssName} is missing from theme.css.`);
      }
      expect(String(themeAnchorColors[mirrorName])).toBe(toSrgbHex(anchor));
    }
  });
});
