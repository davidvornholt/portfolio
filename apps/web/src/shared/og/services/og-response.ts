import { Effect } from 'effect';
import { ImageResponse } from 'next/og';
import { createElement } from 'react';
import { OgImageResponseError } from '../errors/og-errors';
import { OgCard } from '../presentation/components/og-card';
import { loadGoogleFont } from './og-fonts';
import { ogImageSize } from './og-image-size';

const family = 'Sofia Sans';
const boldWeight = 700 as const;
const regularWeight = 400 as const;

type OgCardProps = Readonly<{
  title: string;
  subtitle?: string;
  footerLeft: string;
  footerRight: string;
}>;

export const createOgImageResponse = Effect.fn('createOgImageResponse')(
  function* (props: OgCardProps) {
    const { title, subtitle, footerLeft, footerRight } = props;

    const fonts = yield* Effect.all(
      [
        loadGoogleFont({
          family,
          weight: boldWeight,
          text: `${title}${footerLeft}`,
        }).pipe(
          Effect.map((data) => ({
            name: family,
            data,
            weight: boldWeight,
            style: 'normal' as const,
          })),
        ),
        loadGoogleFont({
          family,
          weight: regularWeight,
          text: `${subtitle ?? ''}${footerRight}`,
        }).pipe(
          Effect.map((data) => ({
            name: family,
            data,
            weight: regularWeight,
            style: 'normal' as const,
          })),
        ),
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
  },
);
