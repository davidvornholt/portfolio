import { works } from '@velite';
import { Effect } from 'effect';
import { notFound } from 'next/navigation';
import type { ImageResponse } from 'next/og';
import { siteUrl } from '@/config/site';
import { ogImageSize } from '@/shared/og/services/og-image-size';
import { createOgImageResponse } from '@/shared/og/services/og-response';

export const alt = 'Case study by David Vornholt';
export const size = ogImageSize;
export const contentType = 'image/png';

const OpengraphImage = async ({
  params,
}: Readonly<{
  params: Promise<{ slug: string }>;
}>): Promise<ImageResponse> => {
  const { slug } = await params;
  const work = works.find((entry) => entry.slug === slug);

  if (!work) {
    notFound();
  }

  return Effect.runPromise(
    createOgImageResponse({
      eyebrow: 'Case study',
      title: work.title,
      footerLeft: 'David Vornholt',
      footerRight: new URL(siteUrl).host,
    }),
  );
};

export default OpengraphImage;
