import { describe, expect, it } from 'bun:test';
import { Cause, Effect, Option } from 'effect';
import {
  AnalyticsConfigurationError,
  decodeAnalyticsConfig,
} from './analytics';

describe('analytics configuration', () => {
  it('keeps analytics opt-out and supplies the default script URL', () => {
    expect(Effect.runSync(decodeAnalyticsConfig({}))).toEqual({
      websiteId: undefined,
      scriptUrl: 'https://cloud.umami.is/script.js',
    });
  });

  it('rejects an empty website ID with a typed actionable error', () => {
    const exit = Effect.runSyncExit(
      decodeAnalyticsConfig(Object.fromEntries([['UMAMI_WEBSITE_ID', '   ']])),
    );
    if (exit._tag === 'Success') {
      throw new Error('Expected the analytics configuration to fail.');
    }
    const error = Option.getOrThrow(Cause.failureOption(exit.cause));

    expect(error).toBeInstanceOf(AnalyticsConfigurationError);
    expect(error.message).toContain(
      'UMAMI_WEBSITE_ID must not be empty when it is set.',
    );
  });

  it('rejects non-HTTP(S) script URLs with a typed configuration error', () => {
    const exit = Effect.runSyncExit(
      decodeAnalyticsConfig(
        Object.fromEntries([['UMAMI_SCRIPT_URL', 'javascript:alert(1)']]),
      ),
    );
    if (exit._tag === 'Success') {
      throw new Error('Expected the analytics configuration to fail.');
    }
    const error = Option.getOrThrow(Cause.failureOption(exit.cause));

    expect(error).toBeInstanceOf(AnalyticsConfigurationError);
    expect(error.message).toContain(
      'UMAMI_SCRIPT_URL must be an absolute HTTP(S) URL.',
    );
  });
});
