import { Effect } from 'effect';
import {
  GoogleFontCssResponseError,
  GoogleFontDownloadError,
  GoogleFontHttpError,
  GoogleFontRequestError,
} from '../errors/og-errors';

/**
 * Loads a subsetted TTF from the Google Fonts CSS API for Open Graph image
 * generation. Satori cannot use the woff2 files next/font serves, so the
 * OG pipeline fetches its own truetype subsets at build time — the same
 * build-time network dependency next/font/google already establishes.
 */
const truetypeSourcePattern =
  /src: url\((?<url>.+?)\) format\('(?:opentype|truetype)'\)/u;

const fetchFontResource = ({
  family,
  resource,
  url,
}: Readonly<{
  family: string;
  resource: 'CSS' | 'font';
  url: string;
}>) =>
  Effect.tryPromise({
    try: () => fetch(url),
    catch: (cause) =>
      new GoogleFontRequestError({
        family,
        resource,
        url,
        cause,
        message: `Open Graph ${resource} request failed for ${family} at ${url}: ${String(cause)}`,
      }),
  });

export const loadGoogleFont = ({
  family,
  weight,
  text,
  italic = false,
}: Readonly<{
  family: string;
  weight: number;
  text: string;
  italic?: boolean;
}>) =>
  Effect.gen(function* () {
    const axes = italic ? `ital,wght@1,${weight}` : `wght@${weight}`;
    const cssUrl = `https://fonts.googleapis.com/css2?family=${family.replaceAll(' ', '+')}:${axes}&text=${encodeURIComponent(text)}`;

    const cssResponse = yield* fetchFontResource({
      family,
      resource: 'CSS',
      url: cssUrl,
    });

    if (!cssResponse.ok) {
      return yield* Effect.fail(
        new GoogleFontHttpError({
          family,
          resource: 'CSS',
          url: cssUrl,
          status: cssResponse.status,
          message: `Open Graph CSS request for ${family} returned HTTP ${cssResponse.status} at ${cssUrl}.`,
        }),
      );
    }

    const css = yield* Effect.tryPromise({
      try: () => cssResponse.text(),
      catch: (cause) =>
        new GoogleFontRequestError({
          family,
          resource: 'CSS',
          url: cssUrl,
          cause,
          message: `Open Graph CSS response could not be read for ${family} at ${cssUrl}: ${String(cause)}`,
        }),
    });
    const fontUrl = css.match(truetypeSourcePattern)?.groups?.url;

    if (fontUrl === undefined) {
      return yield* Effect.fail(
        new GoogleFontCssResponseError({
          family,
          url: cssUrl,
          message: `Open Graph font loading failed: the Google Fonts CSS response for ${family} has no truetype subset source.`,
        }),
      );
    }

    const fontResponse = yield* fetchFontResource({
      family,
      resource: 'font',
      url: fontUrl,
    });

    if (!fontResponse.ok) {
      return yield* Effect.fail(
        new GoogleFontHttpError({
          family,
          resource: 'font',
          url: fontUrl,
          status: fontResponse.status,
          message: `Open Graph font subset request for ${family} returned HTTP ${fontResponse.status} at ${fontUrl}.`,
        }),
      );
    }

    const data = yield* Effect.tryPromise({
      try: () => fontResponse.arrayBuffer(),
      catch: (cause) =>
        new GoogleFontDownloadError({
          family,
          url: fontUrl,
          cause,
          message: `Open Graph font subset download failed for ${family} at ${fontUrl}: ${String(cause)}`,
        }),
    });

    if (data.byteLength === 0) {
      return yield* Effect.fail(
        new GoogleFontDownloadError({
          family,
          url: fontUrl,
          cause: new Error('The font subset response was empty.'),
          message: `Open Graph font subset download returned no bytes for ${family} at ${fontUrl}.`,
        }),
      );
    }

    return data;
  });
