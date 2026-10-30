import { Effect } from 'effect';
import { notFound } from 'next/navigation';
import type { ImageResponse } from 'next/og';
import { siteUrl } from '@/config/site';
import { getWorkBySlug, works } from '@/features/works/content/works-registry';
import { ogImageSize } from '@/shared/og/services/og-image-size';
import { createOgImageResponse } from '@/shared/og/services/og-response';

export const alt = 'Case study by David Vornholt';
export const size = ogImageSize;
export const contentType = 'image/png';

// Without known params this route renders on request and fetches its fonts
// from Google Fonts at runtime. Prerendering keeps that fetch in the build.
export const generateStaticParams = (): Array<{ slug: string }> =>
  works.map((work) => ({ slug: work.meta.slug }));

const OpengraphImage = async ({
  params,
}: Readonly<{
  params: Promise<{ slug: string }>;
}>): Promise<ImageResponse> => {
  const { slug } = await params;
  const work = getWorkBySlug(slug);

  if (!work) {
    notFound();
  }

  return Effect.runPromise(
    createOgImageResponse({
      eyebrow: 'Case study',
      title: work.meta.title,
      footerLeft: 'David Vornholt',
      footerRight: new URL(siteUrl).host,
    }),
  );
};

export default OpengraphImage;
