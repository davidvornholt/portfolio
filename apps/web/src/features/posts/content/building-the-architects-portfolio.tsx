import Image from 'next/image';
import type { ReactNode } from 'react';
import {
  MDXCallToAction,
  MDXSection,
} from '@/shared/content/presentation/components/mdx-layout-components';
import {
  MDXAnchor,
  MDXHeadingOne,
  MDXListItem,
  MDXParagraph,
  MDXStrong,
  MDXUnorderedList,
} from '@/shared/content/presentation/components/mdx-markdown-elements';
import { PostFigure } from './figures/post-figure';
import oldHomePage from './images/portfolio-before.jpg';
import type { Post } from './post-meta';

const repository = 'https://github.com/davidvornholt/portfolio';

const BuildingTheArchitectsPortfolioBody = (): ReactNode => (
  <>
    <MDXSection>
      <MDXParagraph>
        Until November 2026 this site had a cream background, a serif typeface
        and forest green buttons. It was pleasant. It was also the look that AI
        design tools produce when nobody tells them otherwise. For a site that
        claims I use AI with care, that was the wrong look.
      </MDXParagraph>
      <PostFigure caption="The home page until November 2026.">
        <Image
          src={oldHomePage}
          alt="The old home page: a cream background, the name David Vornholt in a large serif, a quotation in brown italics, a forest green button, and a portrait photo."
          placeholder="blur"
          sizes="(min-width: 48rem) 48rem, 100vw"
          className="w-full border border-border"
        />
      </PostFigure>
    </MDXSection>

    <MDXSection>
      <MDXHeadingOne>One picture in place of a claim</MDXHeadingOne>
      <MDXParagraph>
        The old page said that agents write most of my code and that strict
        checks decide what goes live. Anyone can write that sentence. The new{' '}
        <MDXAnchor href="/">home page</MDXAnchor> shows it.
      </MDXParagraph>
      <MDXParagraph>
        It opens with a thick black bar. Every change I merged in the last
        thirteen weeks stands on that bar as one small square: black when its
        automated checks passed, red with a slot when one of them failed, and an
        outline when none had finished. The attempts that the checks sent back
        before they could merge sit inside the bar as grey marks.
      </MDXParagraph>
      <MDXParagraph>
        The rest of the design follows from that picture. White, black, and one
        red that appears only where a check failed. Square corners. Sofia Sans
        for text and IBM Plex Mono for code. No dark mode.
      </MDXParagraph>
      <MDXParagraph>
        The chart is drawn from real data, so it has rules of its own:
      </MDXParagraph>
      <MDXUnorderedList>
        <MDXListItem>
          It counts only changes that I authored, in every repository I work in.
          Bots and other people’s changes are left out.
        </MDXListItem>
        <MDXListItem>
          From a private repository it shows only that a change was merged and
          passed, never a name or a title. The step that fetches the data drops
          those before it writes anything, so they can’t reach this site’s code
          or your browser.
        </MDXListItem>
        <MDXListItem>
          A change is judged by the checks that had finished when it merged.
          Whatever ran afterwards doesn’t count.
        </MDXListItem>
        <MDXListItem>
          When fetching the data fails, nothing is written. A chart drawn from
          half the data would be worse than an old one.
        </MDXListItem>
      </MDXUnorderedList>
    </MDXSection>

    <MDXSection>
      <MDXHeadingOne>What I turned down</MDXHeadingOne>
      <MDXParagraph>
        Agents wrote the code for the new design too. The model was Claude Fable
        5.2. My part was to say what I wanted and to send back what was not good
        enough. These things went:
      </MDXParagraph>
      <MDXUnorderedList>
        <MDXListItem>
          <MDXStrong>A product picture with rounded corners,</MDXStrong> on a
          site where nothing has a rounded corner.
        </MDXListItem>
        <MDXListItem>
          <MDXStrong>
            Two versions of a section that moved as you scrolled.
          </MDXStrong>{' '}
          It was meant to show the path a change takes through its checks. The
          first version held the page still while you scrolled and felt broken.
          The second was smoother and still not right. The third is a diagram
          from a talk of mine, and it simply plays when it comes into view.
        </MDXListItem>
        <MDXListItem>
          <MDXStrong>A table that quoted five of my rules.</MDXStrong> It was
          correct and dull. In its place a terminal shows an agent rewriting a
          rule and the check failing because of it.
        </MDXListItem>
        <MDXListItem>
          <MDXStrong>A good part of the text.</MDXStrong> I doubted that anybody
          would read all of it.
        </MDXListItem>
      </MDXUnorderedList>
    </MDXSection>

    <MDXSection>
      <MDXHeadingOne>How it is built</MDXHeadingOne>
      <MDXParagraph>
        Four things about the build that you can’t see by looking at the page:
      </MDXParagraph>
      <MDXUnorderedList>
        <MDXListItem>
          <MDXStrong>The chart is plain HTML</MDXStrong> that the server
          renders, so it is there without JavaScript. A small script adds what
          needs one: pointing at a square, or stepping through the changes with
          the arrow keys, shows that change.
        </MDXListItem>
        <MDXListItem>
          <MDXStrong>Articles are TypeScript files.</MDXStrong> Until August
          2026 they were MDX files that ran through a content pipeline with its
          own build step and its own schema checks. That was a second build
          system for a site with one author who has a compiler open anyway, so I
          deleted it. An article is now a typed object and a React component.
        </MDXListItem>
        <MDXListItem>
          <MDXStrong>Every change passes the same checks</MDXStrong> as in all
          my projects: lint, types, tests, the build, and a scan of every page
          for accessibility problems.{' '}
          <MDXAnchor href="/posts/executable-engineering-standards">
            How those work
          </MDXAnchor>{' '}
          is its own article.
        </MDXListItem>
        <MDXListItem>
          <MDXStrong>Little moves.</MDXStrong> The chart builds once, one change
          runs through the diagram of its path, the square in the footer drops
          onto its bar, and the logo hops when you click it. None of it plays
          for a visitor who has asked for reduced motion.
        </MDXListItem>
      </MDXUnorderedList>
      <MDXParagraph>
        The colors are written in OKLCH, which gets{' '}
        <MDXAnchor href="/posts/mastering-oklch-tailwind-v4">
          an article of its own
        </MDXAnchor>
        .
      </MDXParagraph>
    </MDXSection>

    <MDXCallToAction
      title="Read the source"
      description="The repository behind this site is public, with the checks and the history of the redesign."
      href={repository}
      linkText="Open the repository"
    />
  </>
);

export const buildingTheArchitectsPortfolioPost: Post = {
  meta: {
    title: 'This site looked AI-made. So I threw the design away.',
    subtitle:
      'What replaced it, what I turned down on the way, and how the site is built.',
    slug: 'building-the-architects-portfolio',
    date: '2026-08-17',
    updated: '2026-11-23',
    category: 'Engineering',
    readTime: '3 min read',
    excerpt:
      'The first version was cream paper, a serif and forest green, the look AI design tools produce by default. The new one is a black bar with every change I merged standing on it.',
  },
  body: BuildingTheArchitectsPortfolioBody,
};
