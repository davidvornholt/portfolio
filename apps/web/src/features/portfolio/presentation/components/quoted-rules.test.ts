import { describe, expect, it } from 'bun:test';
import { type QuotedRule, quotedRules } from './quoted-rules';

type Lines = Readonly<{ firstLine: number; lastLine: number }>;

const repositoryRoot = new URL('../../../../../../../', import.meta.url);

const readSourceLines = async (path: string): Promise<ReadonlyArray<string>> =>
  (await globalThis.Bun.file(new URL(path, repositoryRoot)).text()).split('\n');

const withoutCommonIndentation = (
  lines: ReadonlyArray<string>,
): ReadonlyArray<string> => {
  const indentation = Math.min(
    ...lines.map((line) => line.length - line.trimStart().length),
  );
  return lines.map((line) => line.slice(indentation));
};

const isQuotedAt = (
  quoted: ReadonlyArray<string>,
  sourceLines: ReadonlyArray<string>,
  start: number,
): boolean => {
  const candidate = withoutCommonIndentation(
    sourceLines.slice(start, start + quoted.length),
  );
  return (
    candidate.length === quoted.length &&
    quoted.every((line, offset) => candidate[offset]?.startsWith(line))
  );
};

// Where the quote stands in the source today. When it has moved, the failure
// shows the line numbers to write into `quoted-rules.ts`.
const locate = (
  rule: QuotedRule,
  expected: Lines,
  sourceLines: ReadonlyArray<string>,
): Lines | 'not found' => {
  const quoted = rule.code.split('\n');
  if (isQuotedAt(quoted, sourceLines, expected.firstLine - 1)) {
    return {
      firstLine: expected.firstLine,
      lastLine: expected.firstLine - 1 + quoted.length,
    };
  }
  const moved = sourceLines.findIndex((_, start) =>
    isQuotedAt(quoted, sourceLines, start),
  );
  return moved === -1
    ? 'not found'
    : { firstLine: moved + 1, lastLine: moved + quoted.length };
};

// The lines of one Markdown section: from under its heading to the next
// heading of the same level.
const sectionLines = (
  sourceLines: ReadonlyArray<string>,
  section: string,
): ReadonlyArray<string> => {
  const start = sourceLines.indexOf(`## ${section}`);
  if (start === -1) {
    return [];
  }
  const rest = sourceLines.slice(start + 1);
  const end = rest.findIndex((line) => line.startsWith('## '));
  return end === -1 ? rest : rest.slice(0, end);
};

const byLines = quotedRules.flatMap((rule) =>
  'section' in rule.place ? [] : [[rule.path, rule, rule.place] as const],
);
const bySection = quotedRules.flatMap((rule) =>
  'section' in rule.place
    ? [[rule.path, rule, rule.place.section] as const]
    : [],
);

describe('quoted rules', () => {
  it.each(byLines)(
    'quotes %s at the lines the page names',
    async (_path, rule, place) => {
      const sourceLines = await readSourceLines(rule.path);

      expect(locate(rule, place, sourceLines)).toEqual(place);
    },
  );

  it.each(bySection)(
    'quotes %s from the section the page names',
    async (_path, rule, section) => {
      const quoted = rule.code.split('\n');
      const lines = sectionLines(await readSourceLines(rule.path), section);

      expect(lines.some((_, at) => isQuotedAt(quoted, lines, at))).toBe(true);
    },
  );

  it('finds no quote in a section that does not hold it', async () => {
    const sourceLines = await readSourceLines('AGENTS.md');
    const lines = sectionLines(sourceLines, 'Change policy');

    expect(
      lines.some((_, start) =>
        isQuotedAt(['Don’t weaken a quality gate'], lines, start),
      ),
    ).toBe(false);
    expect(sectionLines(sourceLines, 'No such section')).toEqual([]);
  });

  it('emphasizes text that the quoted code contains', () => {
    for (const rule of quotedRules) {
      expect(rule.code).toContain(rule.emphasis);
    }
  });
});
