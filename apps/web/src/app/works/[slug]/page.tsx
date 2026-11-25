import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';

import { siteUrl } from '@/config/site';
import type { WorkMeta } from '@/features/works/content/work-meta';
import { getWorkBySlug, works } from '@/features/works/content/works-registry';
import { BackNavigation } from '@/shared/content/presentation/components/back-navigation';
import { CaseStudyLayout } from '@/shared/content/presentation/components/case-study-layout';
import { PageTransition } from '@/shared/page/presentation/components/page-transitions';

type WorkPageProps = Readonly<{
  params: Promise<{ slug: string }>;
}>;

export const generateStaticParams = (): Array<{ slug: string }> =>
  works.map((work) => ({ slug: work.meta.slug }));

export const generateMetadata = async ({
  params,
}: WorkPageProps): Promise<Metadata | undefined> => {
  const { slug } = await params;
  const work = getWorkBySlug(slug);

  if (!work) {
    return;
  }

  const url = `${siteUrl}/works/${work.meta.slug}`;

  return {
    title: work.meta.title,
    description: work.meta.summary,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: 'article',
      url,
      title: work.meta.title,
      description: work.meta.summary,
      publishedTime: work.meta.date,
      authors: ['David Vornholt'],
    },
    twitter: {
      card: 'summary_large_image',
      title: work.meta.title,
      description: work.meta.summary,
    },
  };
};

const createCreativeWorkJsonLd = (meta: WorkMeta): Record<string, unknown> => ({
  '@context': 'https://schema.org',
  '@type': 'CreativeWork',
  name: meta.title,
  description: meta.summary,
  url: `${siteUrl}/works/${meta.slug}`,
  dateCreated: meta.date,
  author: {
    '@type': 'Person',
    name: 'David Vornholt',
    url: siteUrl,
  },
  keywords: meta.techStack.join(', '),
});

const WorkPage = async ({ params }: WorkPageProps): Promise<ReactNode> => {
  const { slug } = await params;
  const work = getWorkBySlug(slug);

  if (!work) {
    notFound();
  }

  const jsonLd = createCreativeWorkJsonLd(work.meta);
  const Body = work.body;

  return (
    <PageTransition>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: correct way of injecting JSON-LD
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BackNavigation href="/#work" label="Home" />
      <CaseStudyLayout
        slug={work.meta.slug}
        title={work.meta.title}
        subtitle={work.meta.subtitle}
        since={work.meta.since}
        role={work.meta.role}
        stage={work.meta.stage}
        techStack={work.meta.techStack}
        liveUrl={work.meta.liveUrl}
        image={work.meta.image}
      >
        <Body />
      </CaseStudyLayout>
    </PageTransition>
  );
};

export default WorkPage;
