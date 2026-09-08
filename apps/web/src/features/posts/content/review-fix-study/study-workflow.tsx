import type { ReactNode } from 'react';
import { MDXSection } from '@/shared/content/presentation/components/mdx-layout-components';
import {
  MDXHeadingOne,
  MDXParagraph,
  MDXStrong,
} from '@/shared/content/presentation/components/mdx-markdown-elements';

export const StudyCoordination = (): ReactNode => (
  <MDXSection>
    <MDXHeadingOne>03 A stronger supervisor was not enough</MDXHeadingOne>
    <MDXParagraph>
      The obvious compromise was to put Astra in charge while cheaper Luna
      agents did the reviewing and fixing. Astra was better at rejecting weak
      findings and avoiding unnecessary work. But this mixed setup still
      missed both bugs in the internal tool.
    </MDXParagraph>
    <MDXParagraph>
      <MDXStrong>
        Better judgment about reported problems did not recover the problems
        nobody reported.
      </MDXStrong>
    </MDXParagraph>
    <MDXParagraph>
      The mixed setup did contribute a useful Rota fix that Astra missed.
      Spark also contributed a worthwhile test improvement. I kept both. The
      result was not that Astra found everything or the cheaper models did
      nothing useful.
    </MDXParagraph>
    <MDXParagraph>
      One apparent mixed-model success could not count as independent evidence.
      Its reviewer had read Astra's completed fix before reporting the same
      loop. That exposed a weakness in my experiment setup, not another
      independent discovery.
    </MDXParagraph>
  </MDXSection>
);
