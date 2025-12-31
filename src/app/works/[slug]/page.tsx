import { works } from '@velite';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';

import { siteUrl } from '@/config/site';
import { BackNavigation } from '@/shared/content/presentation/components/back-navigation';
import { CaseStudyLayout } from '@/shared/content/presentation/components/case-study-layout';
import { MDXContent } from '@/shared/content/presentation/components/mdx-content';

type WorkPageProps = Readonly<{
  params: Promise<{ slug: string }>;
}>;

type Work = (typeof works)[number];

const getWorkBySlug = (slug: string): Work | undefined =>
  works.find((work) => work.slug === slug);

export const generateStaticParams = (): { slug: string }[] =>
  works.map((work) => ({ slug: work.slug }));

export const generateMetadata = async ({
  params,
}: WorkPageProps): Promise<Metadata | undefined> => {
  const { slug } = await params;
  const work = getWorkBySlug(slug);

  if (!work) return undefined;

  const url = `${siteUrl}/works/${work.slug}`;

  return {
    title: work.title,
    description: work.subtitle,
    openGraph: {
      type: 'article',
      url,
      title: work.title,
      description: work.subtitle,
      publishedTime: work.date,
      authors: ['David Vornholt'],
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 1200,
          alt: work.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: work.title,
      description: work.subtitle,
      images: ['/og-image.png'],
    },
  };
};

const createCreativeWorkJsonLd = (work: Work): Record<string, unknown> => ({
  '@context': 'https://schema.org',
  '@type': 'CreativeWork',
  name: work.title,
  description: work.subtitle,
  url: `${siteUrl}/works/${work.slug}`,
  dateCreated: work.date,
  author: {
    '@type': 'Person',
    name: 'David Vornholt',
    url: siteUrl,
  },
  keywords: work.techStack.join(', '),
});

const WorkPage = async ({ params }: WorkPageProps): Promise<ReactNode> => {
  const { slug } = await params;
  const work = getWorkBySlug(slug);

  if (!work) notFound();

  const jsonLd = createCreativeWorkJsonLd(work);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BackNavigation href="/#works" label="Back to Works" />
      <CaseStudyLayout
        title={work.title}
        subtitle={work.subtitle}
        timeline={work.timeline}
        role={work.role}
        techStack={work.techStack}
        liveUrl={work.liveUrl}
      >
        <MDXContent code={work.content} />
      </CaseStudyLayout>
    </>
  );
};

export default WorkPage;
