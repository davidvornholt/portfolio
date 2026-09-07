import type { ReactNode } from 'react';
import { MDXSection } from '@/shared/content/presentation/components/mdx-layout-components';
import { MDXAnchor, MDXHeadingOne, MDXParagraph, MDXStrong } from '@/shared/content/presentation/components/mdx-markdown-elements';
import { CostFigure, OutputFigure, TaskCostFigure } from './study-charts';

export const StudyEconomics = (): ReactNode => (
  <MDXSection>
    <MDXHeadingOne>08 The mixed workflow did not save money</MDXHeadingOne>
<MDXParagraph>For the two latest tasks, I reconstructed usage from native session records and applied a locally cached September 5 tariff snapshot:</MDXParagraph>
<CostFigure />
<MDXParagraph>These are <MDXStrong>estimates at stated assumed token rates</MDXStrong>, not invoices, subscription charges, current-price claims, or measured percentages of my ChatGPT allowance. The <MDXAnchor href="/posts/cheap-ai-code-reviews/evidence.md">evidence appendix</MDXAnchor> includes the per-category rates and usage.</MDXParagraph>
<MDXParagraph>The mixed number is a lower bound. Some extra CLI reviewer and worker executions lacked complete accounting, so I excluded their unknown costs rather than extrapolating them. The recorded subtotal already exceeded all-Astra.</MDXParagraph>
<TaskCostFigure />
<MDXParagraph>The recorded mixed subtotal was lower on ProsaBridge ($19.14 versus $27.28), but higher on Rota ($29.33 versus $17.42). The supported comparison is the pair total, not a claim that mixed cost more on each task.</MDXParagraph>
<MDXParagraph>All-Astra's higher estimate relative to the all-cheap configurations came from much higher assumed token prices, not more output: Astra generated 84,421 output tokens across the pair, versus Spark's 216,840 and Luna's 478,867.</MDXParagraph>
<OutputFigure />
<MDXParagraph>But the cheapest row is not the price of an equivalent successful deliverable. Luna's ProsaBridge run was incomplete. Its Rota repairs stayed local and included the reproduced transport regression. Spark's quicker, restrained reviews missed the central defects.</MDXParagraph>
<MDXParagraph>Nor do these figures establish that mixing models is inherently more expensive. Repeated reading, additional coordination, environment debugging, thread limits, and continuations affected these executions. The supported conclusion is narrower and still decisive: <MDXStrong>the mixed workflow did not produce the saving it was being tested to achieve</MDXStrong>.</MDXParagraph>
<MDXParagraph>Human supervision and the consequences of missed bugs were not priced. I cannot turn this into a numerical return-on-investment claim. The cheaper pairs saved roughly $39–42 in estimated token costs, but they did not deliver the same demonstrated result.</MDXParagraph>
  </MDXSection>
);
