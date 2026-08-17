import type { ReactNode } from 'react';
import {
  MDXAttributedBlockquote,
  MDXCallout,
  MDXCallToAction,
  MDXCheckItem,
  MDXCheckList,
  MDXSection,
} from '@/shared/content/presentation/components/mdx-layout-components';
import {
  MDXAnchor,
  MDXHeadingOne,
  MDXHeadingTwo,
  MDXParagraph,
} from '@/shared/content/presentation/components/mdx-markdown-elements';
import {
  MDXStatCard,
  MDXStatGrid,
} from '@/shared/content/presentation/components/mdx-metric-components';
import type { Work } from './work-meta';

const FesKirchheimBody = (): ReactNode => (
  <>
    <MDXSection>
      <MDXHeadingOne>01 The starting point</MDXHeadingOne>
      <MDXHeadingTwo>A good school behind a slow website.</MDXHeadingTwo>
      <MDXParagraph>
        The Freie Evangelische Schule Kirchheim is a strong school that looked
        weak online. Its legacy platform cost too much, loaded too slowly, and
        hid content edits behind an admin interface the staff dreaded. The worst
        of it was a five-second cold start: parents arrived, waited, and left.
      </MDXParagraph>
      <MDXCallout title="The brief">
        A fast, affordable, accessible web presence the school office can run
        without a developer.
      </MDXCallout>
    </MDXSection>

    <MDXSection>
      <MDXHeadingOne>02 The results</MDXHeadingOne>
      <MDXHeadingTwo>Measured, not estimated.</MDXHeadingTwo>
      <MDXStatGrid>
        <MDXStatCard
          label="Cold boot time"
          value="0s"
          subtext="Down from 5 seconds"
          trend="down"
          icon="zap"
        />
        <MDXStatCard
          label="Lighthouse score"
          value="100"
          subtext="SEO and best practices"
          trend="up"
          icon="gauge"
        />
        <MDXStatCard
          label="Time to interactive"
          value="3x"
          subtext="Faster than the legacy site"
          trend="up"
          icon="lineChart"
        />
        <MDXStatCard
          label="Search impressions"
          value="+300%"
          subtext="Year over year"
          trend="up"
          icon="search"
        />
        <MDXStatCard
          label="Click-through rate"
          value="2.5x"
          subtext="In search results"
          trend="up"
          icon="trendingUp"
        />
        <MDXStatCard
          label="Infrastructure cost"
          value="-60%"
          subtext="Per year"
          trend="down"
          icon="server"
        />
      </MDXStatGrid>
    </MDXSection>

    <MDXSection>
      <MDXHeadingOne>03 The build</MDXHeadingOne>
      <MDXHeadingTwo>Boring architecture, chosen deliberately.</MDXHeadingTwo>
      <MDXParagraph>
        The site moved to Next.js with server rendering and incremental static
        regeneration, which removed the cold start entirely. The registration
        for new students became a short guided form that validates as parents
        type.
      </MDXParagraph>
      <MDXCheckList>
        <MDXCheckItem
          title="Strict typing"
          description="TypeScript in strict mode, so mistakes surface at compile time instead of in a parent's browser."
        />
        <MDXCheckItem
          title="Accessible by default"
          description="Semantic HTML and tested accessibility, because a school website serves grandparents on old tablets as much as students on new phones."
        />
        <MDXCheckItem
          title="Run by the school office"
          description="Staff update content and events themselves. No developer is needed for the daily work."
        />
      </MDXCheckList>
    </MDXSection>

    <MDXSection>
      <MDXHeadingOne>04 The second chapter: infrastructure</MDXHeadingOne>
      <MDXHeadingTwo>
        The school now owns its platform, declaratively.
      </MDXHeadingTwo>
      <MDXParagraph>
        The engagement did not stop at the website. FESK’s services now run on
        declarative infrastructure: the host is described in code, changes
        arrive as reviewed pull requests, and the running system is converged to
        match what the repository says. Nothing on the server is
        hand-configured.
      </MDXParagraph>
    </MDXSection>

    <MDXSection>
      <MDXHeadingOne>05 The third chapter: Atrium</MDXHeadingOne>
      <MDXHeadingTwo>From client to pilot school.</MDXHeadingTwo>
      <MDXParagraph>
        Working inside the school’s daily operations showed how much of the
        school day still ran on paper and patience. That observation became{' '}
        <MDXAnchor href="/works/atrium">Atrium</MDXAnchor>, a platform for the
        operative day of a school, and FESK became its first pilot. What began
        as a website now covers the school’s public face, its infrastructure,
        and the pilot of its operations platform.
      </MDXParagraph>
      <MDXAttributedBlockquote author="Feedback from the administration">
        The new platform didn’t just save us money; it gave us a voice that is
        finally heard clearly online.
      </MDXAttributedBlockquote>
    </MDXSection>

    <MDXCallToAction
      title="See it live"
      description="The website is in daily use by the school community."
      href="https://fes-kirchheim.de"
      linkText="Visit fes-kirchheim.de"
    />
  </>
);

export const fesKirchheimWork: Work = {
  meta: {
    title: 'Freie Evangelische Schule Kirchheim',
    subtitle:
      'A website engagement that grew into infrastructure, then into a product pilot',
    slug: 'fes-kirchheim',
    date: '2024-08-01',
    timeline: 'August 2024 – present',
    role: 'Lead full stack developer',
    techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'NixOS'],
    liveUrl: 'https://fes-kirchheim.de',
    summary:
      'The digital home of a school: a fast, accessible website, the declarative infrastructure under it, and the groundwork that made FESK the first Atrium pilot school.',
    outcome:
      'Cold boots eliminated, search impressions tripled, infrastructure cost down 60 percent. Now the first Atrium pilot school.',
  },
  body: FesKirchheimBody,
};
