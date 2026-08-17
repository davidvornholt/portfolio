import type { ReactNode } from 'react';
import { MDXCodeSnippet } from '@/shared/content/presentation/components/mdx-code-snippet';
import {
  MDXAttributedBlockquote,
  MDXCallout,
  MDXCallToAction,
  MDXSection,
} from '@/shared/content/presentation/components/mdx-layout-components';
import {
  MDXHeadingOne,
  MDXHeadingTwo,
  MDXParagraph,
  MDXStrong,
} from '@/shared/content/presentation/components/mdx-markdown-elements';
import {
  MDXChart,
  MDXStatCard,
  MDXStatGrid,
} from '@/shared/content/presentation/components/mdx-metric-components';
import type { Post } from './post-meta';

const legacyColdTtfbMs = 5200;
const legacyWarmTtfbMs = 800;
const isrTtfbMs = 50;

const isrSnippet = `// Revalidate at most once per minute
export const revalidate = 60;

export default async function NewsPage() {
  // Runs on the server, in the background.
  // No visitor ever waits for this query.
  const news = await db.news.findMany({
    orderBy: { date: 'desc' },
    take: 10,
  });

  return <NewsGrid items={news} />;
}`;

const SolvingTheColdBootProblemBody = (): ReactNode => (
  <>
    <MDXSection>
      <MDXHeadingOne>01 Five seconds of nothing</MDXHeadingOne>
      <MDXHeadingTwo>The first visitor of the day always paid.</MDXHeadingTwo>
      <MDXParagraph>
        A parent checks the school website on a phone, on the way to drop-off.
        They tap the link and nothing happens for five seconds. That was the
        reality at the Freie Evangelische Schule Kirchheim: the legacy platform
        rendered every page on demand, on cheap shared hosting, and the server
        slept between requests. Waking it meant connecting to the database,
        fetching content, and rendering HTML before the first byte went out.
      </MDXParagraph>
      <MDXParagraph>
        The time to first byte on a cold request was close to five seconds. For
        a site whose whole job is answering small questions quickly, that is a
        broken front door.
      </MDXParagraph>
      <MDXCallout title="Why it matters">
        A school website has traffic spikes in the morning and silence at night.
        An architecture that sleeps when idle punishes exactly the visitor who
        arrives first with the most urgent question.
      </MDXCallout>
    </MDXSection>

    <MDXSection>
      <MDXHeadingOne>02 The diagnosis</MDXHeadingOne>
      <MDXHeadingTwo>Rendering on demand was the wrong default.</MDXHeadingTwo>
      <MDXParagraph>
        The content changes a few times a day. The pages were being rendered
        thousands of times a day. That mismatch was the entire problem: the
        expensive work happened per request instead of per change.
      </MDXParagraph>
      <MDXChart
        type="bar"
        title="Time to first byte, before and after"
        data={{
          labels: ['Legacy (cold)', 'Legacy (warm)', 'Next.js ISR'],
          values: [legacyColdTtfbMs, legacyWarmTtfbMs, isrTtfbMs],
        }}
        unit="ms"
      />
    </MDXSection>

    <MDXSection>
      <MDXHeadingOne>03 The architecture</MDXHeadingOne>
      <MDXHeadingTwo>Render per change, not per request.</MDXHeadingTwo>
      <MDXParagraph>
        The rebuilt platform uses Next.js with{' '}
        <MDXStrong>incremental static regeneration</MDXStrong>. Every visitor is
        served a static HTML file straight from the edge cache. When the cached
        copy is older than the revalidation window, Next.js regenerates the page
        in the background and the next visitor gets the fresh one. The database
        sits entirely behind the cache; no visitor ever waits on a query.
      </MDXParagraph>
      <MDXCodeSnippet
        language="typescript"
        title="app/news/page.tsx"
        code={isrSnippet}
      />
    </MDXSection>

    <MDXSection>
      <MDXHeadingOne>04 What it saved</MDXHeadingOne>
      <MDXHeadingTwo>Speed and cost come from the same decision.</MDXHeadingTwo>
      <MDXParagraph>
        Rendering per change instead of per request collapses the load. A
        thousand visitors in one minute used to mean a thousand database
        round-trips; now they can mean one. The same change that removed the
        cold boot cut the infrastructure bill.
      </MDXParagraph>
      <MDXStatGrid>
        <MDXStatCard
          label="Cold boot time"
          value="0s"
          subtext="Down from 5 seconds"
          trend="down"
          icon="zap"
        />
        <MDXStatCard
          label="Infrastructure cost"
          value="-60%"
          subtext="Per year"
          trend="down"
          icon="trendingDown"
        />
        <MDXStatCard
          label="Lighthouse performance"
          value="100"
          subtext="Core Web Vitals"
          trend="up"
          icon="gauge"
        />
      </MDXStatGrid>
      <MDXAttributedBlockquote author="Feedback from the FESK administration">
        The difference is night and day. Information is now instant, and we no
        longer worry about the site crashing during registration week.
      </MDXAttributedBlockquote>
    </MDXSection>

    <MDXCallToAction
      title="The full story"
      description="The website was chapter one. The case study covers the infrastructure and the Atrium pilot that followed."
      href="/works/fes-kirchheim"
      linkText="Read the case study"
    />
  </>
);

export const solvingTheColdBootProblemPost: Post = {
  meta: {
    title: 'From 5s to 0s: solving the cold boot problem',
    slug: 'solving-the-cold-boot-problem',
    date: '2026-02-01',
    category: 'Engineering',
    readTime: '4 min read',
    excerpt:
      'How a school website went from a five-second cold start to instant responses, and cut its infrastructure cost by 60 percent on the way.',
  },
  body: SolvingTheColdBootProblemBody,
};
