import { describe, expect, it } from 'bun:test';
import { file } from 'bun';
import { easingCss } from './easing';

describe('easing', () => {
  it('matches the --ease-out token in theme.css', async () => {
    const themeCss = await file(new URL('theme.css', import.meta.url)).text();
    expect(themeCss).toContain(`--ease-out: ${easingCss};`);
  });
});
