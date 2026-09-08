import type { ReactNode } from 'react';
import { MDXSection } from '@/shared/content/presentation/components/mdx-layout-components';
import {
  MDXAnchor,
  MDXHeadingOne,
  MDXParagraph,
  MDXStrong,
} from '@/shared/content/presentation/components/mdx-markdown-elements';

export const StudyDecision = (): ReactNode => (
  <MDXSection>
    <MDXHeadingOne>05 One default, one less decision</MDXHeadingOne>
    <MDXParagraph>
      I will use{' '}
      <MDXStrong>
        Astra at medium effort for the lead agent and every reviewer and repair
        agent
      </MDXStrong>
      . Medium is my chosen balance, not a proven optimum. I did not compare
      Astra's effort settings against each other.
    </MDXParagraph>
    <MDXParagraph>
      I also do not want to ask before every review whether this change is
      complicated enough for Astra. That is another decision between me and
      getting work done.
    </MDXParagraph>
    <MDXParagraph>
      “Use the cheap model and switch when it fails” sounds sensible. But a
      review that misses a bug can still return a confident report. There may be
      no warning that I need a stronger review. If I need Astra to check whether
      I can trust the cheap review, I have not replaced Astra.
    </MDXParagraph>
    <MDXParagraph>
      This was a small study of real work, not a universal model ranking. The
      tools and conditions varied, and Astra missed a useful fix too. Those
      limits matter. They do not erase the demonstrated bugs, the broken repair,
      or the mixed setup's failure to save money.
    </MDXParagraph>
    <MDXParagraph>
      I wanted to save money on reviews. I decided I would rather pay for the
      setup that caught the problems I needed it to catch, without choosing a
      model all over again each time.
    </MDXParagraph>
    <MDXParagraph>
      The optional{' '}
      <MDXAnchor href="/posts/cheap-ai-code-reviews/evidence.md">
        methods and cost notes
      </MDXAnchor>{' '}
      include the accounting and limitations. Unpublished project details are
      omitted, so this is not a fully public replication package.
    </MDXParagraph>
  </MDXSection>
);
