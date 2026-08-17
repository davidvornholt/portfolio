import { posts } from '@velite';
import { Effect } from 'effect';
import { notFound } from 'next/navigation';
import type { ImageResponse } from 'next/og';
import { siteUrl } from '@/config/site';
import { ogImageSize } from '@/shared/og/services/og-image-size';
import { createOgImageResponse } from '@/shared/og/services/og-response';

export const alt = 'Blog post by David Vornholt';
export const size = ogImageSize;
export const contentType = 'image/png';

const OpengraphImage = async ({
  params,
}: Readonly<{
  params: Promise<{ slug: string }>;
}>): Promise<ImageResponse> => {
  const { slug } = await params;
  const post = posts.find((entry) => entry.slug === slug);

  if (!post) {
    notFound();
  }

  return Effect.runPromise(
    createOgImageResponse({
      eyebrow: post.category,
      title: post.title,
      footerLeft: 'David Vornholt',
      footerRight: new URL(siteUrl).host,
    }),
  );
};

export default OpengraphImage;
