/**
 * Umami analytics configuration. Values are read at build time while the
 * layout is prerendered, so they must be present in the environment of the
 * `next build` that produces the deployed artifact. When the website ID is
 * unset, no tracker is rendered and analytics is fully disabled.
 */
import process from 'node:process';
import { Data, Effect, Schema } from 'effect';

export class AnalyticsConfigurationError extends Data.TaggedError(
  'AnalyticsConfigurationError',
)<{
  readonly message: string;
  readonly cause: unknown;
}> {}

const nonEmptyWebsiteId = Schema.String.pipe(
  Schema.filter(
    (value) =>
      value.trim().length > 0 ||
      'UMAMI_WEBSITE_ID must not be empty when it is set.',
  ),
);

const absoluteHttpScriptUrl = Schema.String.pipe(
  Schema.filter((value) => {
    try {
      const url = new URL(value);
      return (
        ((url.protocol === 'http:' || url.protocol === 'https:') &&
          url.hostname.length > 0) ||
        'UMAMI_SCRIPT_URL must be an absolute HTTP(S) URL.'
      );
    } catch {
      return 'UMAMI_SCRIPT_URL must be an absolute HTTP(S) URL.';
    }
  }),
);

const umamiWebsiteIdEnvironmentKey = 'UMAMI_WEBSITE_ID' as const;
const umamiScriptUrlEnvironmentKey = 'UMAMI_SCRIPT_URL' as const;

const analyticsEnvironmentSchema = Schema.Struct({
  [umamiWebsiteIdEnvironmentKey]: Schema.optional(nonEmptyWebsiteId),
  [umamiScriptUrlEnvironmentKey]: Schema.optional(absoluteHttpScriptUrl),
});

const defaultUmamiScriptUrl = 'https://cloud.umami.is/script.js';

export const decodeAnalyticsConfig = (input: unknown) =>
  Effect.try({
    try: () => {
      const environment = Schema.decodeUnknownSync(analyticsEnvironmentSchema)(
        input,
      );

      return {
        websiteId: environment[umamiWebsiteIdEnvironmentKey],
        scriptUrl:
          environment[umamiScriptUrlEnvironmentKey] ?? defaultUmamiScriptUrl,
      } as const;
    },
    catch: (cause) =>
      new AnalyticsConfigurationError({
        cause,
        message: `Invalid Umami analytics configuration: ${String(cause)}`,
      }),
  });

const analyticsConfig = Effect.runSync(
  decodeAnalyticsConfig({
    [umamiScriptUrlEnvironmentKey]: process.env.UMAMI_SCRIPT_URL,
    [umamiWebsiteIdEnvironmentKey]: process.env.UMAMI_WEBSITE_ID,
  }),
);

export const umamiWebsiteId = analyticsConfig.websiteId;
export const umamiScriptUrl = analyticsConfig.scriptUrl;
