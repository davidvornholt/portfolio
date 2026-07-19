import { Badge } from '@/shared/ui/presentation/components/badge';
import { Separator } from '@/shared/ui/presentation/components/separator';
import { ColorSwatchComparison } from './color-swatch-comparison';
import { MDXCodeSnippet } from './mdx-code-snippet';
import { MDXImage } from './mdx-image';
import {
  MDXAttributedBlockquote,
  MDXCallout,
  MDXCallToAction,
  MDXCheckItem,
  MDXCheckList,
  MDXSection,
} from './mdx-layout-components';
import {
  MDXAnchor,
  MDXBlockquote,
  MDXEmphasis,
  MDXHeadingOne,
  MDXHeadingThree,
  MDXHeadingTwo,
  MDXHorizontalRule,
  MDXListItem,
  MDXOrderedList,
  MDXParagraph,
  MDXStrong,
  MDXUnorderedList,
} from './mdx-markdown-elements';
import {
  MDXChart,
  MDXFeatureCard,
  MDXFeatureGrid,
  MDXStatCard,
  MDXStatGrid,
} from './mdx-metric-components';

export const mdxComponents = {
  h1: MDXHeadingOne,
  h2: MDXHeadingTwo,
  h3: MDXHeadingThree,
  p: MDXParagraph,
  strong: MDXStrong,
  em: MDXEmphasis,
  blockquote: MDXBlockquote,
  ul: MDXUnorderedList,
  ol: MDXOrderedList,
  li: MDXListItem,
  a: MDXAnchor,
  hr: MDXHorizontalRule,
  img: MDXImage,
  Section: MDXSection,
  Callout: MDXCallout,
  Blockquote: MDXAttributedBlockquote,
  StatGrid: MDXStatGrid,
  StatCard: MDXStatCard,
  FeatureGrid: MDXFeatureGrid,
  FeatureCard: MDXFeatureCard,
  CheckList: MDXCheckList,
  CheckItem: MDXCheckItem,
  CTA: MDXCallToAction,
  Chart: MDXChart,
  CodeSnippet: MDXCodeSnippet,
  ColorSwatchComparison,
  Separator,
  Badge,
  Image: MDXImage,
};

export type MDXComponents = typeof mdxComponents;
