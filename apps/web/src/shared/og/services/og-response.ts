import { ImageResponse } from 'next/og';
import { createElement } from 'react';
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

export const createOgImageResponse = async (
  props: OgCardProps,
): Promise<ImageResponse> => {
  const { eyebrow, title, italicPhrase, footerLeft, footerRight } = props;

  const fonts = await Promise.all([
    loadGoogleFont({
      family: 'IBM Plex Sans',
      weight: sansWeight,
      // The card uppercases the eyebrow, so subset the uppercase glyphs.
      text: eyebrow.toUpperCase(),
    }).then((data) => ({
      name: 'IBM Plex Sans',
      data,
      weight: sansWeight,
      style: 'normal' as const,
    })),
    loadGoogleFont({
      family: 'Source Serif 4',
      weight: serifWeight,
      text: title,
    }).then((data) => ({
      name: 'Source Serif 4',
      data,
      weight: serifWeight,
      style: 'normal' as const,
    })),
    loadGoogleFont({
      family: 'IBM Plex Mono',
      weight: monoWeight,
      text: `${footerLeft}${footerRight}`,
    }).then((data) => ({
      name: 'IBM Plex Mono',
      data,
      weight: monoWeight,
      style: 'normal' as const,
    })),
    ...(italicPhrase === undefined
      ? []
      : [
          loadGoogleFont({
            family: 'Source Serif 4',
            weight: serifWeight,
            text: italicPhrase,
            italic: true,
          }).then((data) => ({
            name: 'Source Serif 4',
            data,
            weight: serifWeight,
            style: 'italic' as const,
          })),
        ]),
  ]);

  return new ImageResponse(createElement(OgCard, props), {
    ...ogImageSize,
    fonts,
  });
};
