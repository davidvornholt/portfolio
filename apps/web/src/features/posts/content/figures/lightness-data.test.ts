import { describe, expect, it } from 'bun:test';
import {
  contrastRange,
  siteContrasts,
  swatchesOf,
  themeColors,
  themeExcerpt,
} from './lightness-data';

const theme = new URL(
  '../../../../../../../packages/ui/src/theme.css',
  import.meta.url,
);

const themeLines = async (): Promise<ReadonlyArray<string>> =>
  (await globalThis.Bun.file(theme).text())
    .split('\n')
    .map((line) => line.trim());

describe('the colors in the article on OKLCH', () => {
  it('prints an excerpt whose every declaration stands in the theme', async () => {
    const lines = await themeLines();
    const declarations = themeExcerpt
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.startsWith('--'));

    expect(declarations.length).toBeGreaterThan(0);
    for (const declaration of declarations) {
      expect(lines).toContain(declaration);
    }
  });

  it('measures the colors the theme defines', async () => {
    const lines = await themeLines();
    for (const { token, lch } of Object.values(themeColors)) {
      expect(lines).toContain(
        `${token}: oklch(${lch.lightness} ${lch.chroma} ${lch.hue});`,
      );
    }
  });

  it('shows five colors that a screen can paint in each row', () => {
    const black = [0, 0, 0];
    for (const model of ['hsl', 'oklch'] as const) {
      const swatches = swatchesOf(model);
      expect(swatches).toHaveLength(5);
      for (const swatch of swatches) {
        expect(swatch.color).not.toEqual(black);
      }
    }
  });

  it('gives the numbers the article quotes in its text', () => {
    expect(contrastRange('hsl')).toEqual(['1.07:1', '8.59:1']);
    expect(contrastRange('oklch')).toEqual(['3.78:1', '4.15:1']);
    expect(siteContrasts.map((pair) => pair.value.toFixed(1))).toEqual([
      '18.3',
      '7.7',
      '4.8',
      '5.3',
    ]);
  });
});
