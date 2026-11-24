import type { ReactNode } from 'react';
import {
  MDXCallToAction,
  MDXCheckItem,
  MDXCheckList,
  MDXSection,
} from '@/shared/content/presentation/components/mdx-layout-components';
import {
  MDXAnchor,
  MDXHeadingOne,
  MDXParagraph,
} from '@/shared/content/presentation/components/mdx-markdown-elements';
import {
  MDXStatCard,
  MDXStatGrid,
} from '@/shared/content/presentation/components/mdx-metric-components';
import fesKirchheimImage from './images/fes-kirchheim.png';
import type { Work } from './work-meta';

const FesKirchheimBody = (): ReactNode => (
  <>
    <MDXSection>
      <MDXHeadingOne>A good school behind a slow website</MDXHeadingOne>
      <MDXParagraph>
        The Freie Evangelische Schule Kirchheim is a good school that looked
        weak online. Its old website cost too much, took five seconds to appear
        when nobody had visited for a while, and its content could only be
        changed through an admin interface the staff dreaded.
      </MDXParagraph>
      <MDXParagraph>
        The school asked for a website that is fast, affordable, and accessible,
        and that the school office can run without a developer.
      </MDXParagraph>
    </MDXSection>

    <MDXSection>
      <MDXHeadingOne>What changed</MDXHeadingOne>
      <MDXStatGrid>
        <MDXStatCard
          label="Until a page starts to arrive"
          value="50 ms"
          subtext="Down from 5.2 seconds after a quiet spell"
        />
        <MDXStatCard
          label="Cost of running the site"
          value="−60%"
          subtext="Per year"
        />
        <MDXStatCard
          label="Search impressions"
          value="+300%"
          subtext="Year over year"
        />
        <MDXStatCard
          label="Click-through rate"
          value="2.5×"
          subtext="In search results"
        />
        <MDXStatCard
          label="Faster to interactive"
          value="3×"
          subtext="Than the old site"
        />
        <MDXStatCard
          label="Lighthouse score"
          value="100"
          subtext="Accessibility and best practices"
        />
      </MDXStatGrid>
      <MDXParagraph>
        How the wait disappeared is{' '}
        <MDXAnchor href="/posts/solving-the-cold-boot-problem">
          an article of its own
        </MDXAnchor>
        .
      </MDXParagraph>
    </MDXSection>

    <MDXSection>
      <MDXHeadingOne>How it is built</MDXHeadingOne>
      <MDXParagraph>
        The site runs on Next.js. The server keeps a finished copy of every page
        and builds a new one when the content changes, which is what removed the
        wait. The registration for new students is a short guided form that
        checks the entries while parents type.
      </MDXParagraph>
      <MDXCheckList>
        <MDXCheckItem
          title="Strict typing"
          description="TypeScript in strict mode, so mistakes surface when the site is built and not in a parent’s browser."
        />
        <MDXCheckItem
          title="Accessible"
          description="Semantic HTML and tested accessibility, because a school’s website serves grandparents on old tablets as much as students on new phones."
        />
        <MDXCheckItem
          title="Run by the school office"
          description="The staff update content and events themselves. The daily work needs no developer."
        />
      </MDXCheckList>
    </MDXSection>

    <MDXSection>
      <MDXHeadingOne>Then the servers</MDXHeadingOne>
      <MDXParagraph>
        The work did not stop at the website. The school’s services now run on
        servers that are described in code. A change arrives as a reviewed
        proposal, and the running system is brought to what the repository says.
        Nothing on a server is configured by hand.
      </MDXParagraph>
    </MDXSection>

    <MDXSection>
      <MDXHeadingOne>Then Atrium</MDXHeadingOne>
      <MDXParagraph>
        Working inside the school’s routine showed how much of the school day
        still ran on paper. That became{' '}
        <MDXAnchor href="/works/atrium">Atrium</MDXAnchor>, which puts a
        school’s daily records in one place, and the school became its first
        pilot. What began as a website now covers the school’s public face, its
        servers, and the pilot of Atrium.
      </MDXParagraph>
    </MDXSection>

    <MDXCallToAction
      title="See it live"
      description="The school community uses the website every day."
      href="https://fes-kirchheim.de"
      linkText="Visit fes-kirchheim.de"
    />
  </>
);

export const fesKirchheimWork: Work = {
  meta: {
    title: 'Freie Evangelische Schule Kirchheim',
    subtitle: 'A school website that appears at once',
    slug: 'fes-kirchheim',
    date: '2024-08-01',
    since: 'August 2024',
    role: 'Lead developer',
    stage: 'In daily use',
    techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'NixOS'],
    liveUrl: 'https://fes-kirchheim.de',
    summary:
      'The new site appears at once instead of after five seconds, costs 60 percent less to run, and search shows it four times as often.',
    image: {
      src: fesKirchheimImage,
      alt: 'The home page of the Freie Evangelische Schule Kirchheim, with the headline “Schule, die Freude bereitet.”',
    },
  },
  body: FesKirchheimBody,
};
