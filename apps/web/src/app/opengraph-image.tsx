import { Effect } from 'effect';
import type { ImageResponse } from 'next/og';
import { siteUrl } from '@/config/site';
import { ogImageSize } from '@/shared/og/services/og-image-size';
import { createOgImageResponse } from '@/shared/og/services/og-response';

export const alt = 'David Vornholt, co-founder and CTO of ProsaBridge';
export const size = ogImageSize;
export const contentType = 'image/png';

const OpengraphImage = (): Promise<ImageResponse> =>
  Effect.runPromise(
    createOgImageResponse({
      title: 'David Vornholt',
      subtitle: 'AI writes most of my code. It still has to get over this bar.',
      footerLeft: new URL(siteUrl).host,
      footerRight: 'Co-founder and CTO of ProsaBridge',
    }),
  );

export default OpengraphImage;
