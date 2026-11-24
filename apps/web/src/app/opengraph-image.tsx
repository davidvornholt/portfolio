import { Effect } from 'effect';
import type { ImageResponse } from 'next/og';
import { siteUrl } from '@/config/site';
import { ogImageSize } from '@/shared/og/services/og-image-size';
import { createOgImageResponse } from '@/shared/og/services/og-response';

export const alt = 'David Vornholt, founder & CTO';
export const size = ogImageSize;
export const contentType = 'image/png';

const OpengraphImage = (): Promise<ImageResponse> =>
  Effect.runPromise(
    createOgImageResponse({
      eyebrow: 'Co-founder & CTO, ProsaBridge',
      title: 'David Vornholt',
      italicPhrase: 'I build software for publishers.',
      footerLeft: new URL(siteUrl).host,
      footerRight: 'Portfolio',
    }),
  );

export default OpengraphImage;
