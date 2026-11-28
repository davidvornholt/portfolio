import { Effect, Schema } from 'effect';
import { SiteVerdictsFileError } from '@/features/changes/errors/changes-errors';

const SiteVerdict = Schema.Struct({
  number: Schema.Int,
  verdict: Schema.Literals(['passed', 'failed', 'unchecked']),
});

const SiteVerdicts = Schema.Struct({
  /** Ordered by pull request number. */
  changes: Schema.Array(SiteVerdict),
});

export type SiteVerdict = typeof SiteVerdict.Type;
export type SiteVerdicts = typeof SiteVerdicts.Type;

/**
 * Whether the run may add verdicts to the committed record (`record`, the
 * local refresh) or only reads it (`read`, the production fetch, whose
 * checkout is thrown away).
 */
export type SiteVerdictsMode = 'record' | 'read';

/**
 * The verdict the checks gave every change David merged into the site's own
 * repository, committed because GitHub deletes checks about 410 days after
 * they ran. Only the fetch reads it, never the site.
 */
export const siteVerdictsUrl = new URL(
  '../../src/features/changes/data/site-verdicts.json',
  import.meta.url,
);

const decode = Schema.decodeUnknownEffect(SiteVerdicts);
const encode = Schema.encodeSync(SiteVerdicts);

const fileError = (url: URL, action: string, cause: unknown) =>
  new SiteVerdictsFileError({
    path: url.pathname,
    message: `${action} the verdicts of this site's changes failed: ${String(cause)}`,
  });

export const readSiteVerdicts = Effect.fnUntraced(function* (url: URL) {
  const raw = yield* Effect.tryPromise({
    try: () => globalThis.Bun.file(url).json(),
    catch: (cause) => fileError(url, 'Reading', cause),
  });
  return yield* decode(raw, { onExcessProperty: 'error' }).pipe(
    Effect.mapError((cause) => fileError(url, 'Decoding', cause)),
  );
});

export const writeSiteVerdicts = (url: URL, verdicts: SiteVerdicts) =>
  Effect.tryPromise({
    try: () =>
      globalThis.Bun.write(
        url,
        `${JSON.stringify(encode(verdicts), null, 2)}\n`,
      ),
    catch: (cause) => fileError(url, 'Writing', cause),
  });
