import { describe, expect, it } from 'bun:test';
import { type QuotedRule, quotedRules } from './quoted-rules';

type Location = Pick<QuotedRule, 'firstLine' | 'lastLine'>;

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
  sourceLines: ReadonlyArray<string>,
): Location | 'not found' => {
  const quoted = rule.code.split('\n');
  if (isQuotedAt(quoted, sourceLines, rule.firstLine - 1)) {
    return {
      firstLine: rule.firstLine,
      lastLine: rule.firstLine - 1 + quoted.length,
    };
  }
  const moved = sourceLines.findIndex((_, start) =>
    isQuotedAt(quoted, sourceLines, start),
  );
  return moved === -1
    ? 'not found'
    : { firstLine: moved + 1, lastLine: moved + quoted.length };
};

describe('quoted rules', () => {
  it.each(
    quotedRules.map((rule) => [rule.path, rule.firstLine, rule] as const),
  )('quotes %s line %d as the file has it', async (_path, _line, rule) => {
    const sourceLines = await readSourceLines(rule.path);

    expect(locate(rule, sourceLines)).toEqual({
      firstLine: rule.firstLine,
      lastLine: rule.lastLine,
    });
  });

  it('emphasizes text that the quoted code contains', () => {
    for (const rule of quotedRules) {
      expect(rule.code).toContain(rule.emphasis);
    }
  });
});
