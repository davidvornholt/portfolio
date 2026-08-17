import { Effect } from 'effect';
import { ImageResponse } from 'next/og';
import { createElement } from 'react';
import { OgImageResponseError } from '../errors/og-errors';
import { OgCard } from '../presentation/components/og-card';
import { loadGoogleFont } from './og-fonts';
import { ogImageSize } from './og-image-size';

const sansWeight = 500 as const;
const serifWeight = 600 as const;
const monoWeight = 400 as const;

type OgCardProps = Readonly<{
  eyebrow: string;
  title: string;
  italicPhrase?: string;
  footerLeft: string;
  footerRight: string;
}>;

export const createOgImageResponse = (props: OgCardProps) =>
  Effect.gen(function* () {
    const { eyebrow, title, italicPhrase, footerLeft, footerRight } = props;

    const fonts = yield* Effect.all(
      [
        loadGoogleFont({
          family: 'IBM Plex Sans',
          weight: sansWeight,
          // The card uppercases the eyebrow, so subset the uppercase glyphs.
          text: eyebrow.toUpperCase(),
        }).pipe(
          Effect.map((data) => ({
            name: 'IBM Plex Sans',
            data,
            weight: sansWeight,
            style: 'normal' as const,
          })),
        ),
        loadGoogleFont({
          family: 'Source Serif 4',
          weight: serifWeight,
          text: title,
        }).pipe(
          Effect.map((data) => ({
            name: 'Source Serif 4',
            data,
            weight: serifWeight,
            style: 'normal' as const,
          })),
        ),
        loadGoogleFont({
          family: 'IBM Plex Mono',
          weight: monoWeight,
          text: `${footerLeft}${footerRight}`,
        }).pipe(
          Effect.map((data) => ({
            name: 'IBM Plex Mono',
            data,
            weight: monoWeight,
            style: 'normal' as const,
          })),
        ),
        ...(italicPhrase === undefined
          ? []
          : [
              loadGoogleFont({
                family: 'Source Serif 4',
                weight: serifWeight,
                text: italicPhrase,
                italic: true,
              }).pipe(
                Effect.map((data) => ({
                  name: 'Source Serif 4',
                  data,
                  weight: serifWeight,
                  style: 'italic' as const,
                })),
              ),
            ]),
      ],
      { concurrency: 'unbounded' },
    );

    return yield* Effect.try({
      try: () =>
        new ImageResponse(createElement(OgCard, props), {
          ...ogImageSize,
          fonts,
        }),
      catch: (cause) =>
        new OgImageResponseError({
          cause,
          message: `Open Graph image response construction failed: ${String(cause)}`,
        }),
    });
  });
