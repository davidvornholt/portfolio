import type { ReactNode } from 'react';
import {
  MDXCallToAction,
  MDXSection,
} from '@/shared/content/presentation/components/mdx-layout-components';
import {
  MDXAnchor,
  MDXHeadingOne,
  MDXListItem,
  MDXOrderedList,
  MDXParagraph,
  MDXStrong,
  MDXUnorderedList,
} from '@/shared/content/presentation/components/mdx-markdown-elements';
import { LoopGrowthChart } from './figures/loop-growth-chart';
import { FigureNumbers, PostFigure } from './figures/post-figure';
import type { Post } from './post-meta';

const standards = 'https://github.com/davidvornholt/standards';

const runNumbers = [
  { value: '39', label: 'rounds of review' },
  { value: '289', label: 'findings, none of them turned down' },
  { value: '0 of 2', label: 'clean rounds it needed to stop' },
] as const;

const ReviewLoopRanFor46HoursBody = (): ReactNode => (
  <>
    <MDXSection>
      <MDXParagraph>
        On July 13, 2026 I opened a small change to my standards repository, the
        one that holds the rules all my projects share. It added two options to
        a command-line tool: pin the version of the rules a project uses, and
        switch off the scheduled updates. It touched 7 files and added 179
        lines.
      </MDXParagraph>
      <MDXParagraph>
        I gave it to a review workflow I was trying out, called{' '}
        <MDXStrong>review-loop</MDXStrong>. Its rule was simple. Five AI
        reviewers read the whole change, each looking for a different kind of
        problem. Other agents fix everything the reviewers find. Then five fresh
        reviewers read the whole change again, fixes included. The loop ends
        when two rounds in a row find nothing.
      </MDXParagraph>
      <MDXParagraph>
        It never ended. I stopped it by hand during round 39, about 46 hours
        after it had started. By then the change touched 350 files and added
        37,451 lines.
      </MDXParagraph>
    </MDXSection>

    <PostFigure
      wide={true}
      title="Lines added by the change, hour by hour"
      caption={
        <>
          The lines the change added at each of its 70 commits, measured on the{' '}
          <MDXAnchor
            href={`${standards}/tree/museum/review-loop-failed-experiment`}
          >
            archived branch
          </MDXAnchor>
          . Gray is what the loop wrote and I threw away. The black band along
          the bottom is what I merged in the end, drawn a little thicker than
          its true height so that it can be seen.
        </>
      }
    >
      <LoopGrowthChart />
    </PostFigure>

    <MDXSection>
      <MDXHeadingOne>Everything I kept existed after 23 minutes</MDXHeadingOne>
      <MDXParagraph>
        The first round did what a review should do. It found about ten real
        defects in my 179 lines, and the fix for them was committed 23 minutes
        after the start. At that point the change was 7 files and 217 lines.
        Those are the 7 files and 217 lines I merged two days later.
      </MDXParagraph>
      <MDXParagraph>
        Everything after that was the loop reviewing itself. The reviewers
        confirmed 289 findings in total, and by my later count about 260 of them
        were in code the loop had written during the run. When I stopped it, the
        loop had written 99.5 percent of what it was reviewing.
      </MDXParagraph>
      <PostFigure caption="From the closing report of the run. A clean round is one in which no reviewer finds anything.">
        <FigureNumbers numbers={runNumbers} />
      </PostFigure>
    </MDXSection>

    <MDXSection>
      <MDXHeadingOne>What it built</MDXHeadingOne>
      <MDXParagraph>
        Many of the later findings were real, in the sense that a reviewer could
        reproduce them. But nothing in my rule asked whether a fix was worth it
        for a tool that copies files from one repository into another. So every
        finding was fixed, and every fix was new code for the next round to find
        fault with.
      </MDXParagraph>
      <MDXParagraph>
        Round 17 shows it best. One finding described a rare failure while
        cleaning up a lock file. The fix added 9,575 lines in a single commit:
        crash recovery with a write-ahead log, of the kind a database has.
      </MDXParagraph>
      <MDXParagraph>When I stopped it, the branch held:</MDXParagraph>
      <MDXUnorderedList>
        <MDXListItem>
          11,600 lines of crash recovery in 99 files, each kept just under the
          limit of 200 lines per file that I had then
        </MDXListItem>
        <MDXListItem>7,500 lines of release automation</MDXListItem>
        <MDXListItem>
          7,300 lines that manage the settings of a GitHub repository
        </MDXListItem>
        <MDXListItem>
          a parser, written in round 39, whose only job was to check the
          scanners written in round 38
        </MDXListItem>
      </MDXUnorderedList>
    </MDXSection>

    <MDXSection>
      <MDXHeadingOne>It left the pull request</MDXHeadingOne>
      <MDXParagraph>
        One fix did not stay in the branch. It applied the branch’s rewritten
        settings to the live repository. It swapped the rule that protects the
        main branch for an older kind of protection, added a rule for release
        tags that nobody had asked for, and created a deployment environment.
        From then on the check of the repository’s settings failed on every
        branch, including changes that had nothing to do with the experiment.
      </MDXParagraph>
      <MDXParagraph>
        I put the settings back after stopping the run. Nothing from the branch
        was merged.
      </MDXParagraph>
    </MDXSection>

    <MDXSection>
      <MDXHeadingOne>The mistake was mine</MDXHeadingOne>
      <MDXParagraph>
        The model, GPT-5.6 Sol at high effort, did what I had told it to do.
        Four decisions of mine made this run possible.
      </MDXParagraph>
      <MDXOrderedList>
        <MDXListItem>
          <MDXStrong>A finish line that can’t be reached.</MDXStrong> I asked
          for two rounds without a finding. A strong reviewer that reads a
          growing change always finds something: when the plain problems are
          gone, it moves on to rarer ones. This run went from unsafe
          command-line options to timing races, then to proofs about which disk
          a file is on, and ended up checking its own checkers.
        </MDXListItem>
        <MDXListItem>
          <MDXStrong>The loop reviewed its own fixes.</MDXStrong> Every fix
          landed in the same change, so every round had more to read than the
          one before.
        </MDXListItem>
        <MDXListItem>
          <MDXStrong>Nothing was ever turned down.</MDXStrong> “A reviewer can
          reproduce it” counted as “it has to be fixed here”. Of 289 findings,
          not one was discarded.
        </MDXListItem>
        <MDXListItem>
          <MDXStrong>No limits.</MDXStrong> There was no maximum number of
          rounds, no time limit, and no alarm for a change that grows to two
          hundred times its size. I had also told the workflow at the start that
          I approved every further decision, which removed the last point where
          it would have asked me.
        </MDXListItem>
      </MDXOrderedList>
      <MDXParagraph>
        I had made the finish line stricter only shortly before. Earlier
        versions of the workflow stopped after a few rounds, until a stronger
        model found 17 real problems in a change that a weaker model had called
        clean. Two clean rounds in a row looked like the safe answer to that.
      </MDXParagraph>
    </MDXSection>

    <MDXSection>
      <MDXHeadingOne>What I changed</MDXHeadingOne>
      <MDXParagraph>
        I merged the 217 lines as{' '}
        <MDXAnchor href={`${standards}/pull/32`}>their own change</MDXAnchor>{' '}
        and{' '}
        <MDXAnchor href={`${standards}/pull/33`}>deleted review-loop</MDXAnchor>
        . Its replacement, review-fix, reviews a change, fixes what matters, has
        the fixes checked, and then stops, whatever the reviewers would still
        like to say. A finding that lies outside the purpose of the change
        becomes an issue instead of more code. At the end the workflow writes
        down the risk that remains, and a person decides.
      </MDXParagraph>
      <MDXParagraph>
        Four days later that workflow found{' '}
        <MDXAnchor href="/posts/review-fix-versus-coderabbit">
          15 real problems in two changes
        </MDXAnchor>{' '}
        in which a commercial review tool found none.
      </MDXParagraph>
      <MDXParagraph>
        Everything the loop wrote is still public in an archived branch, with{' '}
        <MDXAnchor href={`${standards}/pull/28`}>
          the findings of every round
        </MDXAnchor>{' '}
        and{' '}
        <MDXAnchor
          href={`${standards}/blob/museum/review-loop-failed-experiment/POST-MORTEM.md`}
        >
          my post-mortem
        </MDXAnchor>
        . I keep it for what it taught me: a review is a report for the person
        who decides. It is not a test that code has to pass in silence.
      </MDXParagraph>
    </MDXSection>

    <MDXCallToAction
      title="What came after"
      description="The bounded workflow and CodeRabbit, on the same two changes."
      href="/posts/review-fix-versus-coderabbit"
      linkText="Read the comparison"
    />
  </>
);

export const reviewLoopRanFor46HoursPost: Post = {
  meta: {
    title:
      'I told an AI reviewer to stop when the code was clean. It ran for 46 hours.',
    subtitle:
      'A 179-line change grew to 37,451 lines. Everything I kept in the end existed after 23 minutes.',
    slug: 'review-loop-ran-for-46-hours',
    date: '2026-08-26',
    category: 'Engineering',
    readTime: '5 min read',
    excerpt:
      'An experimental review workflow reviewed its own repairs for 39 rounds, changed live repository settings, and never finished. The mistake was in the rule I had given it.',
  },
  body: ReviewLoopRanFor46HoursBody,
};
