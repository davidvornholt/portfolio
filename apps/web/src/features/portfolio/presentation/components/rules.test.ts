import { expect, test as it } from 'bun:test';
import { rules } from './rules';

for (const rule of rules) {
  it(`matches the source of ${rule.title}`, async () => {
    const source = await globalThis.Bun.file(
      new URL(`../../../../../../../${rule.path}`, import.meta.url),
    ).text();
    expect(
      source.split('\n')[rule.line - 1]?.trim().startsWith(rule.quote),
    ).toBe(true);
  });
}
