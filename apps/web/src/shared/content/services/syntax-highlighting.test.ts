import { describe, expect, it } from 'bun:test';
import { Cause, Effect, Option } from 'effect';
import { ShikiHighlightError } from '../errors/content-errors';
import { warmPrintCodeTheme } from '../presentation/components/code-theme';
import { highlightCode } from './syntax-highlighting';

describe('highlightCode', () => {
  it('returns static HTML for a supported language', async () => {
    const html = await Effect.runPromise(
      highlightCode({
        code: 'const answer = 42;',
        language: 'typescript',
        theme: warmPrintCodeTheme,
      }),
    );

    expect(html).toContain('answer');
    expect(html).toContain('<pre');
  });

  it('returns a typed error when Shiki cannot resolve a language', async () => {
    const result = await Effect.runPromiseExit(
      highlightCode({
        code: 'not valid for a missing grammar',
        language: 'not-a-real-language',
        theme: warmPrintCodeTheme,
      }),
    );

    expect(result._tag).toBe('Failure');
    if (result._tag !== 'Failure') {
      throw new Error('Expected Shiki highlighting to fail.');
    }
    const error = Option.getOrThrow(Cause.failureOption(result.cause));
    expect(error).toBeInstanceOf(ShikiHighlightError);
    expect(error.message).toContain(
      'Shiki failed to highlight not-a-real-language code',
    );
  });
});
