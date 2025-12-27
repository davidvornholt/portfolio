import { works } from '@velite';
import { notFound } from 'next/navigation';

import { BackNavigation } from '@/shared/content/presentation/components/back-navigation';
import { CaseStudyLayout } from '@/shared/content/presentation/components/case-study-layout';
import { MDXContent } from '@/shared/content/presentation/components/mdx-content';

type WorkPageProps = Readonly<{
  params: Promise<{ slug: string }>;
}>;

type Work = (typeof works)[number];

const getWorkBySlug = (slug: string): Work | undefined =>
  works.find((work) => work.slug === slug);

export const generateStaticParams = (): Array<{ slug: string }> =>
  works.map((work) => ({ slug: work.slug }));

export const generateMetadata = async ({
  params,
}: WorkPageProps): Promise<
  { title: string; description: string } | undefined
> => {
  const { slug } = await params;
  const work = getWorkBySlug(slug);

  if (!work) return undefined;

  return {
    title: `${work.title} | David Vornholt`,
    description: work.subtitle,
  };
};

const WorkPage = async ({
  params,
}: WorkPageProps): Promise<React.ReactNode> => {
  const { slug } = await params;
  const work = getWorkBySlug(slug);

  if (!work) notFound();

  return (
    <>
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
