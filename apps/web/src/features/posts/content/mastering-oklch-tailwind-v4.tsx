import type { ReactNode } from 'react';
import { MDXCodeSnippet } from '@/shared/content/presentation/components/mdx-code-snippet';
import {
  MDXCallToAction,
  MDXSection,
} from '@/shared/content/presentation/components/mdx-layout-components';
import {
  MDXHeadingOne,
  MDXListItem,
  MDXOrderedList,
  MDXParagraph,
  MDXStrong,
} from '@/shared/content/presentation/components/mdx-markdown-elements';
import { LightnessRow, SiteContrasts } from './figures/lightness-comparison';
import { contrastRange, themeExcerpt } from './figures/lightness-data';
import { PostFigure } from './figures/post-figure';
import type { Post } from './post-meta';

const [hslLowest, hslHighest] = contrastRange('hsl');
const [oklchLowest, oklchHighest] = contrastRange('oklch');

const MasteringOklchBody = (): ReactNode => (
  <>
    <MDXSection>
      <MDXParagraph>
        HSL is a way to write colors in CSS, and one of its three numbers is
        called lightness. Set it to 50% for a yellow and for a blue, and you
        would expect two colors that look about equally light. Here are five
        colors at 50%, each with two things I computed for it: how light OKLCH,
        a newer way to write colors, measures it to be on a scale from 0 to 1,
        and its contrast against a white background.
      </MDXParagraph>
      <PostFigure
        title="HSL: five hues, all at lightness 50%"
        caption="L is the lightness that OKLCH assigns to the color that is painted. The ratio is its contrast against white, as the accessibility standard WCAG computes it."
      >
        <LightnessRow model="hsl" />
      </PostFigure>
      <MDXParagraph>
        The yellow is almost white: {hslLowest} against white. The blue is
        almost black: {hslHighest}. Text needs at least 4.5:1 to count as
        readable by that standard. So “lightness 50%” says nothing about whether
        text in that color can be read.
      </MDXParagraph>
      <MDXParagraph>
        The reason is that HSL’s lightness is arithmetic on the red, green and
        blue values of a color: the largest plus the smallest, divided by two.
        It knows nothing about eyes, and eyes see green as far lighter than
        blue.
      </MDXParagraph>
    </MDXSection>

    <MDXSection>
      <MDXHeadingOne>What OKLCH does differently</MDXHeadingOne>
      <MDXParagraph>
        OKLCH also describes a color with three numbers: L for lightness, C for
        chroma, which is how colorful it is, and H for hue. The difference is
        that its L was fitted to measurements of how light colors look to
        people. Here are the same five hues, all at L 0.6.
      </MDXParagraph>
      <PostFigure
        title="OKLCH: five hues, all at lightness 0.6"
        caption="The same two numbers as above. All five colors have a chroma of 0.1."
      >
        <LightnessRow model="oklch" />
      </PostFigure>
      <MDXParagraph>
        Their contrast against white runs from {oklchLowest} to {oklchHighest}.
        That is not identical, but the five now sit close together, where in HSL
        they were spread from {hslLowest} to {hslHighest}.
      </MDXParagraph>
      <MDXParagraph>
        This is what I use it for. When I need a second grey, I change L and
        leave the other two numbers alone. When two colors have the same L, I
        know they will carry about the same weight on the page.
      </MDXParagraph>
    </MDXSection>

    <MDXSection>
      <MDXHeadingOne>What it doesn’t do</MDXHeadingOne>
      <MDXOrderedList>
        <MDXListItem>
          <MDXStrong>The same L is not the same contrast.</MDXStrong> The
          accessibility standard computes contrast from luminance, which is a
          different measure, and the row above shows the gap between the two.
          OKLCH gets me close. A test decides: every page of this site is
          scanned for contrast on every change.
        </MDXListItem>
        <MDXListItem>
          <MDXStrong>
            OKLCH lets you write colors that a screen can’t show.
          </MDXStrong>{' '}
          An earlier version of the row above used a chroma of 0.15. At that
          chroma the yellow and the cyan lie outside sRGB, the range of colors
          an ordinary screen can display. A browser then quietly shows a
          neighboring color, and the numbers you wrote are no longer the numbers
          you get.
        </MDXListItem>
      </MDXOrderedList>
    </MDXSection>

    <MDXSection>
      <MDXHeadingOne>On this site</MDXHeadingOne>
      <MDXParagraph>
        This site has eight colors, and seven of them are grey. All of them are
        written in OKLCH, and the greys differ in little but their L.
      </MDXParagraph>
      <MDXCodeSnippet
        language="css"
        title="packages/ui/src/theme.css, in part"
        code={themeExcerpt}
      />
      <MDXParagraph>
        These are the pairs that matter most, and what they measure:
      </MDXParagraph>
      <PostFigure caption="Contrast of a color against the ground it stands on, computed from the theme above.">
        <SiteContrasts />
      </PostFigure>
      <MDXParagraph>
        The second block connects these colors to Tailwind v4, which reads its
        colors from CSS. <MDXStrong>@theme inline</MDXStrong> turns each
        variable into the usual classes, such as{' '}
        <MDXStrong>bg-background</MDXStrong> and{' '}
        <MDXStrong>text-failed</MDXStrong>, without a configuration file in
        JavaScript.
      </MDXParagraph>
      <MDXParagraph>
        OKLCH can also describe colors beyond sRGB, which newer screens can
        show. I use none of them. A site in black, white and one red has no need
        for them.
      </MDXParagraph>
    </MDXSection>

    <MDXCallToAction
      title="See the theme"
      description="The whole file, and the code that computes the numbers in this article, are in the public repository."
      href="https://github.com/davidvornholt/portfolio"
      linkText="Open the repository"
    />
  </>
);

export const masteringOklchPost: Post = {
  meta: {
    title: 'HSL lies about lightness. I measured by how much.',
    subtitle:
      'Five colors with the same HSL lightness, and contrast against white from 1.07 to 8.59. Why this site’s colors are written in OKLCH, and what OKLCH doesn’t fix.',
    slug: 'mastering-oklch-tailwind-v4',
    date: '2026-03-01',
    category: 'Engineering',
    readTime: '3 min read',
    excerpt:
      'In HSL, a yellow and a blue at 50% lightness differ in their contrast against white by a factor of eight. What OKLCH does better, what it doesn’t do, and how this site uses it with Tailwind v4.',
  },
  body: MasteringOklchBody,
};
