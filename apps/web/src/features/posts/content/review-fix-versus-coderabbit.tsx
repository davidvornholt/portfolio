import type { ReactNode } from 'react';
import {
  MDXCallToAction,
  MDXSection,
} from '@/shared/content/presentation/components/mdx-layout-components';
import {
  MDXAnchor,
  MDXHeadingOne,
  MDXListItem,
  MDXParagraph,
  MDXStrong,
  MDXUnorderedList,
} from '@/shared/content/presentation/components/mdx-markdown-elements';
import { FigureNumbers, PostFigure } from './figures/post-figure';
import combPicture from './images/review-fix-versus-coderabbit-object.jpg';
import type { Post } from './post-meta';

const standards = 'https://github.com/davidvornholt/standards';

const score = [
  { value: '15', label: 'problems my workflow found' },
  { value: '14', label: 'of them fixed, 1 accepted as a risk' },
  { value: '0', label: 'correct findings from CodeRabbit' },
] as const;

const stages = [
  { value: '7', label: 'in the changes as they were first proposed' },
  { value: '4', label: 'while checking the first fixes' },
  { value: '4', label: 'while checking the fixes of those fixes' },
] as const;

const ReviewFixVersusCodeRabbitBody = (): ReactNode => (
  <>
    <MDXSection>
      <MDXParagraph>
        On July 19, 2026 I merged two changes to my standards repository. Two
        reviewers read them. One was <MDXStrong>review-fix</MDXStrong>, a
        workflow I wrote myself, in which AI agents review a change, fix what
        they find, and check the fixes. The other was CodeRabbit Pro, a
        commercial AI reviewer, on its Assertive profile.
      </MDXParagraph>
      <MDXParagraph>
        review-fix worked on the two changes before they merged. For CodeRabbit
        I opened four copies as pull requests the same day: each change as it
        was before review-fix touched it, and each change as it was afterwards.
      </MDXParagraph>
      <PostFigure
        caption={
          <>
            Two changes in one repository. The full reports:{' '}
            <MDXAnchor href={`${standards}/pull/93#issuecomment-5015507517`}>
              nine findings in the first change
            </MDXAnchor>
            ,{' '}
            <MDXAnchor href={`${standards}/pull/94#issuecomment-5015370540`}>
              six in the second
            </MDXAnchor>
            .
          </>
        }
      >
        <FigureNumbers numbers={score} />
      </PostFigure>
      <MDXParagraph>
        CodeRabbit wrote one comment in four reviews. It was wrong, and I
        explain why below.
      </MDXParagraph>
    </MDXSection>

    <MDXSection>
      <MDXHeadingOne>What my workflow found</MDXHeadingOne>
      <MDXParagraph>
        The first change replaced a test that kept timing out with a simple
        check: the files I share with all my projects may not contain a comment
        that switches a lint rule off. The second fixed a missing permission in
        the tool that compares a repository’s settings on GitHub with the
        settings I have declared for it. These are the findings that mattered
        most.
      </MDXParagraph>
      <MDXUnorderedList>
        <MDXListItem>
          <MDXStrong>A check that was wrong in both directions.</MDXStrong> It
          skipped some kinds of files it should have read, and it raised the
          alarm on harmless text. A broken change could have passed and a clean
          one could have failed.
        </MDXListItem>
        <MDXListItem>
          <MDXStrong>A result that went stale.</MDXStrong> The check kept its
          last result and reused it, even after one of the things it depends on
          had changed. The fix for that overdid it and made the check run again
          every single time. The fix after that got it right.
        </MDXListItem>
        <MDXListItem>
          <MDXStrong>A change that nobody could have installed.</MDXStrong> It
          required a version of my tool that had not been released, and its
          description still explained behavior that had since been deleted.
        </MDXListItem>
        <MDXListItem>
          <MDXStrong>Error messages that pointed the wrong way.</MDXStrong> When
          the tool lacked a permission, it reported a network outage. The first
          fix then blamed a missing permission for every refusal, including the
          ones that mean “too many requests”.
        </MDXListItem>
        <MDXListItem>
          <MDXStrong>An access token that can read too much.</MDXStrong> To read
          a repository’s labels, the token needs a permission that also lets it
          read the issues of a private repository. I tested a narrower
          permission against a private repository and it failed, so I accepted
          the risk and wrote down what limits it.
        </MDXListItem>
      </MDXUnorderedList>
    </MDXSection>

    <MDXSection>
      <MDXHeadingOne>
        Eight of the fifteen turned up while checking fixes
      </MDXHeadingOne>
      <PostFigure caption="Where the 15 problems were found.">
        <FigureNumbers numbers={stages} />
      </PostFigure>
      <MDXParagraph>
        More than half of the problems were not found in the changes as I had
        proposed them. They were found in the fixes. A sensible fix can remove
        one fault and plant the next, or uncover one that was there all along,
        and either is easy to see only when somebody reads the fix on its own.
      </MDXParagraph>
      <MDXParagraph>
        That explains part of the gap, and it is the part I hold against nobody:
        CodeRabbit never saw the versions in between. But it did read the two
        changes as they were first proposed, with the seven original problems in
        them, and reported nothing. It reported nothing on the{' '}
        <MDXAnchor href={`${standards}/pull/99#issuecomment-5015558701`}>
          finished version of the first change
        </MDXAnchor>{' '}
        either. Its reviews of the two original versions are public too:{' '}
        <MDXAnchor href={`${standards}/pull/98#issuecomment-5015559016`}>
          the check
        </MDXAnchor>{' '}
        and{' '}
        <MDXAnchor href={`${standards}/pull/96#issuecomment-5015558506`}>
          the settings tool
        </MDXAnchor>
        .
      </MDXParagraph>
    </MDXSection>

    <MDXSection>
      <MDXHeadingOne>CodeRabbit’s one comment</MDXHeadingOne>
      <MDXParagraph>
        On the finished version of the second change, CodeRabbit{' '}
        <MDXAnchor href={`${standards}/pull/97#discussion_r3610537339`}>
          objected to how two files handle errors
        </MDXAnchor>{' '}
        and rated it “major”. My rulebook says that code should handle errors
        with a library called Effect. The two files use plain TypeScript:{' '}
        <MDXStrong>throw</MDXStrong> and <MDXStrong>try/catch</MDXStrong>.
        CodeRabbit asked me to rewrite them.
      </MDXParagraph>
      <MDXParagraph>
        The files belong to the small tool that sets a project up before
        anything else is installed. For that reason it has almost no
        dependencies, and every file in it handles errors the plain way.
        Following the comment would have left two files working differently from
        all the others and added a dependency to a tool built to have few.
      </MDXParagraph>
      <MDXParagraph>
        To be fair, that exception was not written down at the time. I{' '}
        <MDXAnchor
          href={`${standards}/blob/main/AGENTS.md#standards-cli-bootstrap-architecture`}
        >
          added it to the instructions
        </MDXAnchor>{' '}
        afterwards. But a reviewer that had read the package, and not only the
        rulebook, would have seen that all of it is built this way. review-fix
        did, and kept the two files consistent with the rest.
      </MDXParagraph>
    </MDXSection>

    <MDXSection>
      <MDXHeadingOne>How review-fix works</MDXHeadingOne>
      <MDXParagraph>
        It reviews the change once. It fixes what matters. Then a reviewer reads
        only the fixes, because a fix is new code and deserves the same
        suspicion. What that turns up is fixed and read once more. The last fix
        is confirmed by tests alone, and then the workflow stops and hands me a
        report with the risk that remains.
      </MDXParagraph>
      <MDXParagraph>
        The hard stop is not a detail. Four days before this comparison I had
        ended the workflow’s predecessor by hand. It had no stop, and it had{' '}
        <MDXAnchor href="/posts/review-loop-ran-for-46-hours">
          run for 46 hours
        </MDXAnchor>
        .
      </MDXParagraph>
    </MDXSection>

    <MDXSection>
      <MDXHeadingOne>What this does not show</MDXHeadingOne>
      <MDXParagraph>
        These are two changes in one repository, compared by the person who
        wrote one of the two tools. That says nothing about CodeRabbit on other
        code. What I can say is narrower: on these two changes, a reviewer that
        knows the repository and checks its own fixes found 15 problems, and a
        general one found none. Every review, fix, and comment is public, so you
        can check my counting.
      </MDXParagraph>
    </MDXSection>

    <MDXCallToAction
      title="Check the counting"
      description="Every finding, fix, accepted risk, and CodeRabbit review is in the standards repository."
      href={standards}
      linkText="Open the repository"
    />
  </>
);

export const reviewFixVersusCodeRabbitPost: Post = {
  meta: {
    title:
      'My review workflow found 15 problems in two changes. CodeRabbit found none.',
    subtitle:
      'The same two changes, the same repository, and every finding public.',
    slug: 'review-fix-versus-coderabbit',
    date: '2026-08-26',
    category: 'Engineering',
    readTime: '4 min read',
    excerpt:
      'I ran my own review workflow and CodeRabbit Pro over the same two changes. Mine found 15 problems, and more than half of them were in its own fixes. CodeRabbit left one comment, and it was wrong.',
    picture: { src: combPicture, alt: 'A fine-toothed black comb.' },
  },
  body: ReviewFixVersusCodeRabbitBody,
};
