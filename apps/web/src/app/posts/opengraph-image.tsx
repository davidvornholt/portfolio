import { Effect } from 'effect';
import type { ImageResponse } from 'next/og';
import { siteUrl } from '@/config/site';
import { cardSkyline } from '@/features/changes/services/card-skyline';
import { snapshot } from '@/features/changes/services/load-snapshot';
import { ogImageSize } from '@/shared/og/services/og-image-size';
import { createOgImageResponse } from '@/shared/og/services/og-response';

export const alt = 'Articles by David Vornholt, the word over the bar';
export const size = ogImageSize;
export const contentType = 'image/png';

const PostsOpengraphImage = (): Promise<ImageResponse> =>
  Effect.runPromise(
    createOgImageResponse({
      title: 'Articles',
      subtitle: 'Decisions, measured results, and experiments that failed.',
      footerLeft: 'David Vornholt',
      footerRight: new URL(siteUrl).host,
      skyline: cardSkyline(snapshot.days),
    }),
  );

export default PostsOpengraphImage;
