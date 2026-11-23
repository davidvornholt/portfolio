import { describe, expect, it } from 'bun:test';
import { loosenedRule } from './loosened-rule';

const repositoryRoot = new URL('../../../../../../../', import.meta.url);

// The page writes the rule with a typographic apostrophe.
const asTyped = (text: string): string => text.replaceAll('’', "'");

describe('the loosened rule', () => {
  it('quotes a rule that stands in its section of the file', async () => {
    const lines = (
      await globalThis.Bun.file(
        new URL(loosenedRule.file, repositoryRoot),
      ).text()
    ).split('\n');
    const start = lines.indexOf(`## ${loosenedRule.section}`);
    const rest = lines.slice(start + 1);
    const end = rest.findIndex((line) => line.startsWith('## '));
    const section = end === -1 ? rest : rest.slice(0, end);

    expect(start).toBeGreaterThan(-1);
    expect(
      section.some((line) => line.includes(asTyped(loosenedRule.before))),
    ).toBe(true);
  });
});
