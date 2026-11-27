import { describe, expect, it } from 'bun:test';
import {
  contrast,
  hslToRgb,
  oklchLightness,
  oklchToRgb,
  toHex,
  white,
} from './color';

// The expected colors are what Chromium painted for the same CSS on
// November 23, 2026, read back from a canvas.
describe('color maths', () => {
  it('gives the color a browser paints for an HSL color', () => {
    expect(hslToRgb(60, 1, 0.5)).toEqual([255, 255, 0]);
    expect(hslToRgb(120, 1, 0.5)).toEqual([0, 255, 0]);
    expect(hslToRgb(0, 1, 0.5)).toEqual([255, 0, 0]);
    expect(hslToRgb(180, 1, 0.5)).toEqual([0, 255, 255]);
    expect(hslToRgb(240, 1, 0.5)).toEqual([0, 0, 255]);
  });

  it('gives the color a browser paints for an OKLCH color inside sRGB', () => {
    expect(oklchToRgb(0.6, 0.15, 265)).toEqual([83, 123, 217]);
    expect(oklchToRgb(0.6, 0.15, 25)).toEqual([202, 85, 81]);
    expect(oklchToRgb(0.6, 0.15, 145)).toEqual([58, 151, 66]);
    expect(oklchToRgb(0.6, 0.1, 195)).toEqual([15, 146, 147]);
    expect(oklchToRgb(0.6, 0.1, 100)).toEqual([142, 129, 51]);
    expect(oklchToRgb(0.17, 0.004, 270)).toEqual([15, 15, 17]);
    expect(oklchToRgb(0.985, 0, 0)).toEqual([250, 250, 250]);
  });

  it('names no color for an OKLCH color outside sRGB', () => {
    expect(oklchToRgb(0.6, 0.15, 195)).toBeUndefined();
    expect(oklchToRgb(0.6, 0.15, 100)).toBeUndefined();
  });

  it('measures the lightness OKLCH assigns to a color', () => {
    expect(oklchLightness([255, 255, 0])).toBeCloseTo(0.968, 3);
    expect(oklchLightness([0, 0, 255])).toBeCloseTo(0.452, 3);
    expect(oklchLightness(white)).toBeCloseTo(1, 3);
  });

  it('computes contrast as WCAG 2 does', () => {
    expect(contrast([255, 255, 0], white)).toBeCloseTo(1.07, 2);
    expect(contrast([0, 0, 255], white)).toBeCloseTo(8.59, 2);
    expect(contrast([0, 0, 0], white)).toBeCloseTo(21, 2);
    expect(contrast([15, 15, 17], [250, 250, 250])).toBeCloseTo(18.34, 2);
  });

  it('writes a color in hexadecimal', () => {
    expect(toHex([255, 128, 0])).toBe('#ff8000');
  });
});
