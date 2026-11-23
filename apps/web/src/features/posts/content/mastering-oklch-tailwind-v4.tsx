import type { ReactNode } from 'react';
import { ColorSwatchComparison } from '@/shared/content/presentation/components/color-swatch-comparison';
import { MDXCodeSnippet } from '@/shared/content/presentation/components/mdx-code-snippet';
import {
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
  MDXFeatureCard,
  MDXFeatureGrid,
  MDXStatCard,
  MDXStatGrid,
} from '@/shared/content/presentation/components/mdx-metric-components';
import type { Post } from './post-meta';

const themeSnippet = `/* theme.css: the single source of design values */
:root {
  /* Primitive ramps, all OKLCH */
  --paper-100: oklch(0.985 0 0);
  --ink-900: oklch(0.17 0.004 270);
  --ink-600: oklch(0.43 0.005 270);
  --red-600: oklch(0.57 0.225 27);

  /* Semantic aliases */
  --background: var(--paper-100);
  --foreground: var(--ink-900);
  --muted-foreground: var(--ink-600);
  --failed: var(--red-600);
}

@theme inline {
  /* Tailwind v4 turns these into utilities,
     opacity modifiers included */
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-failed: var(--failed);
}`;

const MasteringOklchBody = (): ReactNode => (
  <>
    <MDXSection>
      <MDXHeadingOne>The problem with HSL</MDXHeadingOne>
      <MDXHeadingTwo>
        Its lightness number does not mean lightness.
      </MDXHeadingTwo>
      <MDXParagraph>
        HEX and RGB describe what a monitor should emit, not what a person sees.
        HSL looks like the fix, because it exposes a lightness value you can
        reason about. But that value is a lie: HSL lightness is computed from
        RGB channels, not from human perception.
      </MDXParagraph>
      <MDXCallout title="The contrast roulette">
        In HSL, pure yellow at 50 percent lightness reads as nearly white, while
        pure blue at the same 50 percent reads as nearly black. Derive contrast
        from HSL lightness and you are guessing, with accessibility as the
        stake.
      </MDXCallout>
      <MDXParagraph>
        This site began as a project for a school, where a parent with low
        vision is not an edge case. Guessing at contrast was not acceptable, so
        the design system needed a color model whose numbers tell the truth.
      </MDXParagraph>
    </MDXSection>

    <MDXSection>
      <MDXHeadingOne>Enter OKLCH</MDXHeadingOne>
      <MDXHeadingTwo>A color space built on measured perception.</MDXHeadingTwo>
      <MDXParagraph>
        OKLCH, from CSS Color Level 4, describes color as lightness, chroma, and
        hue in the Oklab space, which is fitted to how people actually perceive
        brightness. Its key property is{' '}
        <MDXStrong>perceptual uniformity</MDXStrong>: two colors with the same L
        value look equally bright, whatever their hue.
      </MDXParagraph>
      <MDXFeatureGrid>
        <MDXFeatureCard
          title="L: lightness"
          description="0 to 1. The same L value is the same perceived brightness for every hue, which makes contrast something you can calculate."
        />
        <MDXFeatureCard
          title="C: chroma"
          description="Color intensity from gray outward. Lowering it desaturates cleanly instead of drifting toward mud."
        />
        <MDXFeatureCard
          title="H: hue"
          description="The angle on the color wheel. Rotating it keeps lightness and intensity stable, so hue shifts stay smooth."
        />
      </MDXFeatureGrid>
      <MDXParagraph>
        The comparison below shows five hues pinned to the same lightness in
        each model. The HSL row jumps between bright and dark; the OKLCH row
        holds steady.
      </MDXParagraph>
      <ColorSwatchComparison />
    </MDXSection>

    <MDXSection>
      <MDXHeadingOne>Beyond sRGB</MDXHeadingOne>
      <MDXHeadingTwo>
        HEX cannot name the colors modern screens show.
      </MDXHeadingTwo>
      <MDXParagraph>
        There is a second argument. HEX and HSL are locked to the sRGB gamut,
        while most current phones and laptops render the wider Display P3 gamut.
        OKLCH can address those colors directly, and the browser falls back to
        sRGB on hardware that cannot show them.
      </MDXParagraph>
      <MDXStatGrid>
        <MDXStatCard
          label="Legacy sRGB"
          value="35%"
          subtext="Of the visible spectrum"
        />
        <MDXStatCard
          label="Display P3"
          value="+25%"
          subtext="More colors than sRGB"
        />
        <MDXStatCard
          label="Browser support"
          value="95%+"
          subtext="For oklch() in CSS"
        />
      </MDXStatGrid>
    </MDXSection>

    <MDXSection>
      <MDXHeadingOne>Implementation in Tailwind v4</MDXHeadingOne>
      <MDXHeadingTwo>
        Primitive ramps, semantic aliases, utilities.
      </MDXHeadingTwo>
      <MDXParagraph>
        Tailwind v4 is CSS-first: tokens are plain custom properties, and the{' '}
        <MDXStrong>@theme</MDXStrong> block turns them into utility classes with
        opacity modifiers included. This site defines a small set of OKLCH
        primitives, aliases them to semantic names, and exposes only the
        semantic layer to components. This is the actual token source of the
        page you are reading.
      </MDXParagraph>
      <MDXCodeSnippet language="css" title="theme.css" code={themeSnippet} />
      <MDXParagraph>
        The discipline pays off in maintenance. Deriving a hover state means
        lowering L a step while keeping C and H, and the result stays on
        palette. Checking contrast means comparing two L values instead of
        eyeballing screenshots.
      </MDXParagraph>
    </MDXSection>

    <MDXCallToAction
      title="See the tokens"
      description="The complete OKLCH theme and the Tailwind v4 setup are in the public repository."
      href="https://github.com/davidvornholt/portfolio"
      linkText="View repository"
    />
  </>
);

export const masteringOklchPost: Post = {
  meta: {
    title: 'Why I abandoned HEX and HSL for OKLCH in Tailwind v4',
    subtitle:
      'Engineering color for perceptual uniformity, accessibility, and the P3 gamut.',
    slug: 'mastering-oklch-tailwind-v4',
    date: '2026-03-01',
    category: 'Engineering',
    readTime: '5 min read',
    excerpt:
      'HSL lightness lies about brightness, and HEX cannot name what modern screens can show. How this site moved its whole design system to OKLCH.',
  },
  body: MasteringOklchBody,
};
