import type { ReactNode } from 'react';
import { MDXSection } from '@/shared/content/presentation/components/mdx-layout-components';
import {
  MDXHeadingOne,
  MDXParagraph,
  MDXStrong,
} from '@/shared/content/presentation/components/mdx-markdown-elements';
import { StudyScorecard } from './study-outcomes';

export const StudyFindings = (): ReactNode => (
  <MDXSection>
    <MDXHeadingOne>02 The difference was working software</MDXHeadingOne>
    <MDXParagraph>
      <MDXStrong>Astra found and repaired three important bugs</MDXStrong> that
      the cheaper setups did not independently catch. These affected normal,
      intended behavior, not just unlikely edge cases or coding preferences.
    </MDXParagraph>
    <StudyScorecard />
    <MDXParagraph>
      Two bugs affected an unpublished internal tool. The third affected Rota,
      my clothing-tracking app. After an error, it could get stuck repeatedly
      trying to reload data instead of stopping.
    </MDXParagraph>
    <MDXParagraph>
      A browser test recorded 2,494 calls to its data-loading function in five
      seconds. That demonstrates a runaway loop, not 2,494 paid AI requests or a
      measured production bill.
    </MDXParagraph>
    <MDXParagraph>
      Luna introduced a different problem while making a repair. Its change
      allowed server errors to look like successful responses again, bringing
      back the kind of failure the original change was meant to remove. I
      checked this separately against the actual framework. The repair stayed
      local and was never shipped.
    </MDXParagraph>
    <MDXParagraph>
      Earlier rounds also produced unnecessary code and tests that looked more
      reassuring than they were. One test still passed after the behavior it was
      supposed to protect had been deliberately broken. More findings, more
      code, and more passing tests did not reliably mean a better result.
    </MDXParagraph>
  </MDXSection>
);
