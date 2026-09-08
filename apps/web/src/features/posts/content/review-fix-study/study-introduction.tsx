import type { ReactNode } from 'react';
import { MDXSection } from '@/shared/content/presentation/components/mdx-layout-components';
import {
  MDXHeadingOne,
  MDXParagraph,
  MDXStrong,
} from '@/shared/content/presentation/components/mdx-markdown-elements';
import { StudyConfigurations } from './study-outcomes';

export const StudyIntroduction = (): ReactNode => (
  <MDXSection>
    <MDXHeadingOne>01 Could cheaper models handle the reviews?</MDXHeadingOne>
    <MDXParagraph>
      I wanted to spend less on AI-assisted development. Code review seemed like
      a reasonable place to save. Let a cheaper model check the work and bring
      in a stronger one only when needed.
    </MDXParagraph>
    <MDXParagraph>
      The cheaper reviews missed real bugs. One repair even brought a failure
      back. I ended up choosing GPT-6 Astra for every part of the process.
    </MDXParagraph>
    <MDXParagraph>
      My <MDXStrong>review-fix</MDXStrong> workflow asks AI to check a proposed
      code change, fix important bugs, and verify the repairs. A lead agent
      coordinates other agents, which are separate AI sessions assigned to
      reviewing or fixing the code. I wanted to compare the finished work, not
      just how convincing the review sounded.
    </MDXParagraph>
    <MDXParagraph>
      From September 5 to 7, 2026, I tested several setups across nine code
      changes in two projects. The most revealing round used two changes, each
      starting from the same code and instructions across four setups:
    </MDXParagraph>
    <StudyConfigurations />
  </MDXSection>
);
