import type { ReactNode } from 'react';
import { MDXCodeSnippet } from '@/shared/content/presentation/components/mdx-code-snippet';
import {
  MDXCallout,
  MDXCallToAction,
  MDXSection,
} from '@/shared/content/presentation/components/mdx-layout-components';
import {
  MDXAnchor,
  MDXHeadingOne,
  MDXHeadingTwo,
  MDXParagraph,
  MDXStrong,
} from '@/shared/content/presentation/components/mdx-markdown-elements';
import type { Post } from './post-meta';

const workMetaSnippet = `export type WorkMeta = Readonly<{
  title: string;
  subtitle: string;
  slug: string;
  date: string;
  since: string;
  role: string;
  stage: string;
  techStack: ReadonlyArray<string>;
  liveUrl?: string;
  summary: string;
  image: Readonly<{ src: StaticImageData; alt: string; caption?: string }>;
}>;

export type Work = Readonly<{
  meta: WorkMeta;
  body: () => ReactNode;
}>;`;

const BuildingTheArchitectsPortfolioBody = (): ReactNode => (
  <>
    <MDXSection>
      <MDXHeadingOne>What this site is for</MDXHeadingOne>
      <MDXHeadingTwo>A portfolio is a claim you have to back up.</MDXHeadingTwo>
      <MDXParagraph>
        This site says I build software carefully. That claim is cheap unless
        the site itself is evidence, so I treat it as a small production
        project: measured performance, tested accessibility, and a public
        repository anyone can read. This post is the story of how it is built,
        including the parts I later ripped out.
      </MDXParagraph>
    </MDXSection>

    <MDXSection>
      <MDXHeadingOne>The design: one bar</MDXHeadingOne>
      <MDXHeadingTwo>White paper, black ink, and one red.</MDXHeadingTwo>
      <MDXParagraph>
        The home page opens with a thick black bar. Every change I merged in the
        last thirteen weeks stands on it as one square, and the attempts that my
        checks sent back are caught inside it. The rest of the design follows
        from that picture: white paper, black ink, square corners, and a single
        red that appears only where a check failed. There is no dark mode, and
        nothing moves except the chart as it builds once.
      </MDXParagraph>
      <MDXParagraph>
        <MDXStrong>Sofia Sans</MDXStrong> sets everything but code. It follows
        the proportions of DIN 1451, the lettering of German standards, which
        suits a site about rules. <MDXStrong>IBM Plex Mono</MDXStrong> is kept
        for code. Every color on the site is defined in OKLCH, which gets{' '}
        <MDXAnchor href="/posts/mastering-oklch-tailwind-v4">
          its own post
        </MDXAnchor>
        .
      </MDXParagraph>
      <MDXParagraph>
        The first version looked different: warm paper, a serif, and a forest
        green. It was pleasant, and it was also the look that AI design tools
        produce by default. A site that claims care should not look like a
        default.
      </MDXParagraph>
    </MDXSection>

    <MDXSection>
      <MDXHeadingOne>Content is TypeScript</MDXHeadingOne>
      <MDXHeadingTwo>The compiler replaced the content pipeline.</MDXHeadingTwo>
      <MDXParagraph>
        The first version of this blog ran on Velite: posts were MDX files,
        frontmatter was validated with Zod schemas at build time, and a prebuild
        step compiled everything into a typed data file. It worked, but it was a
        second build system to maintain, and every custom component had to pass
        through an MDX component registry.
      </MDXParagraph>
      <MDXParagraph>
        The current version deletes all of that. A post is a plain TSX module: a
        typed metadata object and a React component, collected in a small
        registry array. The type checker validates the metadata, the bundler
        compiles the body, and interactive components are ordinary imports.
      </MDXParagraph>
      <MDXCodeSnippet
        language="typescript"
        title="features/works/content/work-meta.ts"
        code={workMetaSnippet}
      />
      <MDXCallout title="The trade">
        MDX is the right tool when non-developers write content. Here the author
        is a developer with a compiler open anyway, so the pipeline was pure
        overhead.
      </MDXCallout>
    </MDXSection>

    <MDXSection>
      <MDXHeadingOne>How it ships</MDXHeadingOne>
      <MDXHeadingTwo>Agents write the code. Gates decide.</MDXHeadingTwo>
      <MDXParagraph>
        Agents write most of the code on this site, under the same rules as
        every repository I run: strict TypeScript, Biome with warnings treated
        as errors, and a Playwright suite that scans every route against the
        full WCAG 2.2 AA rule set. The gates fail closed. If a check cannot run,
        the change does not ship.
      </MDXParagraph>
      <MDXParagraph>
        Those rules are public and versioned in their own repository, and every
        project syncs from it. The site you are reading passed them.
      </MDXParagraph>
    </MDXSection>

    <MDXCallToAction
      title="Read the source"
      description="The repository behind this site is public, gates and all."
      href="https://github.com/davidvornholt/portfolio"
      linkText="View repository"
    />
  </>
);

export const buildingTheArchitectsPortfolioPost: Post = {
  meta: {
    title: 'How this portfolio is built',
    subtitle:
      'One bar, OKLCH color, and a content pipeline that is just TypeScript.',
    slug: 'building-the-architects-portfolio',
    date: '2026-08-17',
    category: 'Engineering',
    readTime: '4 min read',
    excerpt:
      'The design system behind this site, and why the MDX content pipeline got replaced by plain TSX modules and a type checker.',
  },
  body: BuildingTheArchitectsPortfolioBody,
};
