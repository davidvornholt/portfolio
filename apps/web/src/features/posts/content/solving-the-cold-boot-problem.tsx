import type { ReactNode } from 'react';
import { ChartBarFill } from '@/shared/content/presentation/components/chart-bar-fill';
import { MDXCodeSnippet } from '@/shared/content/presentation/components/mdx-code-snippet';
import {
  MDXCallToAction,
  MDXSection,
} from '@/shared/content/presentation/components/mdx-layout-components';
import {
  MDXHeadingOne,
  MDXParagraph,
  MDXStrong,
} from '@/shared/content/presentation/components/mdx-markdown-elements';
import { PostFigure } from './figures/post-figure';
import type { Post } from './post-meta';

// Milliseconds until the first byte of a page arrived.
const waits = [
  { name: 'Old site, server asleep', milliseconds: 5200 },
  { name: 'Old site, server awake', milliseconds: 800 },
  { name: 'New site', milliseconds: 50 },
] as const;

const longestWait = 5200;
const percent = 100;

const patternSnippet = `// Build this page again at most once a minute.
export const revalidate = 60;

export default async function NewsPage() {
  // Runs on the server, in the background.
  // No visitor waits for this query.
  const news = await db.news.findMany({
    orderBy: { date: 'desc' },
    take: 10,
  });

  return <NewsGrid items={news} />;
}`;

const Waits = (): ReactNode => (
  <ul className="grid gap-5">
    {waits.map((wait) => (
      <li key={wait.name}>
        <p className="flex items-baseline justify-between gap-4">
          <span>{wait.name}</span>
          <span className="shrink-0 font-bold tabular-nums">
            {wait.milliseconds.toLocaleString('en-US')} ms
          </span>
        </p>
        <div className="mt-2 h-4 bg-muted">
          <ChartBarFill
            percentage={(wait.milliseconds / longestWait) * percent}
            className="text-foreground"
          />
        </div>
      </li>
    ))}
  </ul>
);

const SolvingTheColdBootProblemBody = (): ReactNode => (
  <>
    <MDXSection>
      <MDXParagraph>
        A parent wants to know when school ends on Friday. They open the
        school’s website on their phone, and for five seconds nothing happens.
      </MDXParagraph>
      <MDXParagraph>
        That was the website of the Freie Evangelische Schule Kirchheim before I
        rebuilt it. A school’s website has one job, which is to answer small
        questions quickly, and it was failing at it.
      </MDXParagraph>
    </MDXSection>

    <MDXSection>
      <MDXHeadingOne>Why it was slow</MDXHeadingOne>
      <MDXParagraph>
        The old site built every page at the moment somebody asked for it. It
        connected to the database, fetched the content, put the HTML together
        and sent it. It also ran on cheap shared hosting, where the server went
        to sleep when nobody had visited for a while. The first visitor after a
        quiet spell waited for the server to wake up as well.
      </MDXParagraph>
      <MDXParagraph>
        A school’s website is quiet all night and busy in the morning. So the
        setup punished exactly the people who arrived first.
      </MDXParagraph>
    </MDXSection>

    <MDXSection>
      <MDXHeadingOne>The work was done at the wrong moment</MDXHeadingOne>
      <MDXParagraph>
        The school office changes something on the site a few times a day.
        Visitors ask for its pages thousands of times a day. The old site did
        the expensive work once for every visitor.{' '}
        <MDXStrong>It only has to be done once for every change.</MDXStrong>
      </MDXParagraph>
      <MDXParagraph>
        The new site is built with Next.js and uses a feature with the unhelpful
        name incremental static regeneration. The idea behind it is simple. The
        server keeps a finished copy of every page and sends that. When a copy
        is older than a set time, the next visitor still gets it at once, and
        the server builds a fresh copy in the background for whoever comes
        after.
      </MDXParagraph>
      <MDXCodeSnippet
        language="typescript"
        title="The pattern, on one page"
        code={patternSnippet}
      />
      <MDXParagraph>
        This has a price: an edit does not show at once. With one minute, as in
        the example, it shows about a minute later. For the news of a school
        that is a fair trade.
      </MDXParagraph>
    </MDXSection>

    <MDXSection>
      <MDXHeadingOne>What changed</MDXHeadingOne>
      <PostFigure
        title="Time until the first byte of a page arrived"
        caption="In milliseconds. All three bars are on one scale that starts at zero."
      >
        <Waits />
      </PostFigure>
      <MDXParagraph>
        A thousand visitors in one minute used to mean a thousand trips to the
        database. Now they can mean one. The same change cut what the site costs
        to run by 60 percent a year.
      </MDXParagraph>
      <MDXParagraph>
        What I took from it: before I make a server faster, I ask whether it has
        to do the work at all.
      </MDXParagraph>
    </MDXSection>

    <MDXCallToAction
      title="The rest of the story"
      description="The website was the first chapter. The case study covers the servers and the pilot of Atrium that followed."
      href="/works/fes-kirchheim"
      linkText="Read the case study"
    />
  </>
);

export const solvingTheColdBootProblemPost: Post = {
  meta: {
    title:
      'A school’s website took five seconds to appear. The fix was to do less.',
    subtitle:
      'The server built every page again for every visitor. Now it builds a page when its content changes.',
    slug: 'solving-the-cold-boot-problem',
    date: '2026-02-01',
    updated: '2026-11-23',
    category: 'Engineering',
    readTime: '2 min read',
    excerpt:
      'The old website of a school built every page for every visitor, on a server that fell asleep in between. The new one builds a page when its content changes, and costs 60 percent less to run.',
  },
  body: SolvingTheColdBootProblemBody,
};
