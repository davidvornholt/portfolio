import { afterEach, describe, expect, it } from 'bun:test';
import { Cause, Effect, Option } from 'effect';
import {
  GoogleFontCssResponseError,
  GoogleFontDownloadError,
  GoogleFontHttpError,
} from '../errors/og-errors';
import { loadGoogleFont } from './og-fonts';

const originalFetch = globalThis.fetch;
const serviceUnavailableStatus = 503;

const runFailure = async <A, E>(
  effect: Effect.Effect<A, E>,
): Promise<unknown> => {
  const exit = await Effect.runPromiseExit(effect);
  if (exit._tag === 'Success') {
    throw new Error('Expected the effect to fail.');
  }
  return Option.getOrThrow(Cause.failureOption(exit.cause));
};

afterEach(() => {
  globalThis.fetch = originalFetch;
});

describe('loadGoogleFont', () => {
  it('returns a typed HTTP error before reading a failed CSS response', async () => {
    globalThis.fetch = (() =>
      Promise.resolve(
        new Response('unavailable', {
          status: serviceUnavailableStatus,
        }),
      )) as unknown as typeof fetch;

    const error = await runFailure(
      loadGoogleFont({ family: 'Test Sans', weight: 500, text: 'A' }),
    );

    expect(error).toBeInstanceOf(GoogleFontHttpError);
    expect((error as GoogleFontHttpError).status).toBe(
      serviceUnavailableStatus,
    );
    expect((error as GoogleFontHttpError).resource).toBe('CSS');
  });

  it('reports a changed CSS response shape instead of inventing a font URL', async () => {
    globalThis.fetch = (() =>
      Promise.resolve(
        new Response('body { color: red; }'),
      )) as unknown as typeof fetch;

    const error = await runFailure(
      loadGoogleFont({ family: 'Test Sans', weight: 500, text: 'A' }),
    );

    expect(error).toBeInstanceOf(GoogleFontCssResponseError);
    expect((error as GoogleFontCssResponseError).message).toContain(
      'no truetype subset source',
    );
  });

  it('checks the subset response and rejects an empty download', async () => {
    let requestIndex = 0;
    const responses = [
      new Response(
        "src: url(https://fonts.example.test/test.ttf) format('truetype')",
      ),
      new Response(new ArrayBuffer(0)),
    ] as const;
    globalThis.fetch = (() => {
      const response = responses[requestIndex] ?? new Response();
      requestIndex += 1;
      return Promise.resolve(response);
    }) as unknown as typeof fetch;

    const error = await runFailure(
      loadGoogleFont({ family: 'Test Sans', weight: 500, text: 'A' }),
    );

    expect(error).toBeInstanceOf(GoogleFontDownloadError);
    expect((error as GoogleFontDownloadError).message).toContain(
      'returned no bytes',
    );
  });
});
