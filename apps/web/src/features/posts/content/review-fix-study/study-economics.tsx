import type { ReactNode } from 'react';
import { MDXSection } from '@/shared/content/presentation/components/mdx-layout-components';
import {
  MDXHeadingOne,
  MDXParagraph,
  MDXStrong,
} from '@/shared/content/presentation/components/mdx-markdown-elements';
import { CostFigure } from './study-charts';

export const StudyEconomics = (): ReactNode => (
  <MDXSection>
    <MDXHeadingOne>04 Lower cost did not mean equivalent work</MDXHeadingOne>
    <MDXParagraph>
      I estimated what the two latest tasks would cost at the model prices
      recorded for the study. These are estimates from recorded usage, not
      actual bills or measurements of my subscription allowance.
    </MDXParagraph>
    <CostFigure />
    <MDXParagraph>
      The mixed total is a minimum because some usage could not be counted. Even
      the recorded portion cost more than using Astra throughout. Mixing models
      did not deliver the saving I had hoped for in these runs.
    </MDXParagraph>
    <MDXParagraph>
      Spark and Luna were much cheaper, but their results were not equivalent.
      Luna's internal-tool review was incomplete, and its Rota repair contained
      the reproduced failure. Spark missed the main bugs.
    </MDXParagraph>
    <MDXParagraph>
      <MDXStrong>
        The cheapest review was not the cheapest successful result.
      </MDXStrong>{' '}
      My supervision time and the cost of missed bugs are not included in these
      figures. I cannot put an exact dollar value on avoiding them, but they are
      part of what I am choosing to pay for.
    </MDXParagraph>
  </MDXSection>
);
