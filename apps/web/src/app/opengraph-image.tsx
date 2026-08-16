import type { ImageResponse } from 'next/og';
import { siteUrl } from '@/config/site';
import { ogImageSize } from '@/shared/og/services/og-image-size';
import { createOgImageResponse } from '@/shared/og/services/og-response';

export const alt =
  'David Vornholt — full stack developer & digital experience architect';
export const size = ogImageSize;
export const contentType = 'image/png';

const OpengraphImage = (): Promise<ImageResponse> =>
  createOgImageResponse({
    eyebrow: 'Full stack developer & digital experience architect',
    title: 'David Vornholt',
    italicPhrase: 'Speaking the languages of humans and machines.',
    footerLeft: new URL(siteUrl).host,
    footerRight: 'Portfolio',
  });

export default OpengraphImage;
