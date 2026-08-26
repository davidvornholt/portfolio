import type { ReactNode } from 'react';
import {
  MDXCallout,
  MDXCallToAction,
  MDXSection,
} from '@/shared/content/presentation/components/mdx-layout-components';
import {
  MDXAnchor,
  MDXHeadingOne,
  MDXHeadingTwo,
  MDXParagraph,
  MDXStrong,
} from '@/shared/content/presentation/components/mdx-markdown-elements';
import type { Post } from './post-meta';

const ReviewLoopFigure = (): ReactNode => (
  <figure className="my-10 border-border border-y py-8">
    <div className="grid items-stretch gap-3 sm:grid-cols-[1fr_auto_1fr_auto_1fr]">
      <div className="border border-border p-4">
        <p className="font-mono text-primary text-xs">01</p>
        <p className="mt-2 font-medium text-foreground text-sm">
          Review the entire current diff
        </p>
      </div>
      <span
        aria-hidden="true"
        className="self-center justify-self-center text-muted-foreground sm:hidden"
      >
        ↓
      </span>
      <span
        aria-hidden="true"
        className="hidden self-center text-muted-foreground sm:block"
      >
        →
      </span>
      <div className="border border-border p-4">
        <p className="font-mono text-primary text-xs">02</p>
        <p className="mt-2 font-medium text-foreground text-sm">
          Repair every accepted finding
        </p>
      </div>
      <span
        aria-hidden="true"
        className="self-center justify-self-center text-muted-foreground sm:hidden"
      >
        ↓
      </span>
      <span
        aria-hidden="true"
        className="hidden self-center text-muted-foreground sm:block"
      >
        →
      </span>
      <div className="border border-border p-4">
        <p className="font-mono text-primary text-xs">03</p>
        <p className="mt-2 font-medium text-foreground text-sm">
          Add the repairs to the diff
        </p>
      </div>
    </div>
    <div className="mt-3 border border-primary/40 bg-primary/5 p-4">
      <p className="font-mono text-primary text-xs">↳ NEXT PASS</p>
      <p className="mt-2 text-foreground text-sm">
        Send the enlarged diff back to step 01. A clean pass counted as 1 / 2,
        then the whole diff went around once more.
      </p>
    </div>
    <figcaption className="mt-5 text-muted-foreground text-sm">
      Review-loop repeatedly reviewed its own repairs. Only two consecutive
      clean passes could end the run.
    </figcaption>
  </figure>
);

const RunawayDiffFigure = (): ReactNode => (
  <figure className="my-10 border-border border-y py-8">
    <div className="space-y-8">
      <div>
        <div className="flex items-baseline justify-between gap-4">
          <p className="font-medium text-foreground text-sm">Original change</p>
          <p className="text-right font-mono text-muted-foreground text-xs tabular-nums">
            179 added lines · 7 files
          </p>
        </div>
        <div aria-hidden="true" className="mt-3 h-1 bg-border">
          <span className="block h-1 w-[0.48%] min-w-1 bg-primary" />
        </div>
      </div>
      <div>
        <div className="flex items-baseline justify-between gap-4">
          <p className="font-medium text-foreground text-sm">
            Force-stopped branch
          </p>
          <p className="text-right font-mono text-foreground text-xs tabular-nums">
            37,451 added lines · 350 files
          </p>
        </div>
        <div aria-hidden="true" className="mt-3 h-1 bg-primary" />
      </div>
    </div>
    <div className="mt-8 grid gap-4 border-border border-t pt-4 font-mono text-xs sm:grid-cols-3">
      <p>
        <span className="block text-primary text-xl tabular-nums">39</span>
        <span className="text-muted-foreground">full review passes</span>
      </p>
      <p>
        <span className="block text-primary text-xl tabular-nums">~46 h</span>
        <span className="text-muted-foreground">before I stopped it</span>
      </p>
      <p>
        <span className="block text-primary text-xl tabular-nums">0 / 2</span>
        <span className="text-muted-foreground">clean-pass counter</span>
      </p>
    </div>
    <figcaption className="mt-6 text-muted-foreground text-sm">
      The process multiplied the added lines by about 209 and still could not
      satisfy its stopping rule.
    </figcaption>
  </figure>
);

const ReviewLoopRanFor46HoursBody = (): ReactNode => (
  <>
    <MDXSection>
      <MDXHeadingOne>01 Forty-six hours later</MDXHeadingOne>
      <MDXHeadingTwo>
        A 179-line change had become 37,451 added lines.
      </MDXHeadingTwo>
      <MDXParagraph>
        On July 13, 2026, I opened a small change to my engineering standards
        repository. It added two controls to a command-line tool: choose which
        version of the standards to use, and opt out of scheduled updates. The
        first draft touched seven files.
      </MDXParagraph>
      <MDXParagraph>
        I handed that change to an experimental{' '}
        <MDXStrong>review-loop</MDXStrong> workflow. Five reviewers inspected
        the full pull request. Workers fixed every accepted finding. Then five
        fresh reviewers inspected the enlarged pull request. The workflow would
        stop after two consecutive passes found nothing.
      </MDXParagraph>
      <ReviewLoopFigure />
      <RunawayDiffFigure />
      <MDXParagraph>
        The clean-pass counter never moved. I stopped the run during pass 39.
        The branch now touched 350 files across 70 commits. It had spent roughly
        46 hours trying to prove that no reviewer could find one more thing.
      </MDXParagraph>
      <MDXCallout title="The complete record">
        Pull request{' '}
        <MDXAnchor href="https://github.com/davidvornholt/standards/pull/28">
          #28
        </MDXAnchor>{' '}
        contains every review pass and the closing report. The final branch and
        its{' '}
        <MDXAnchor href="https://github.com/davidvornholt/standards/blob/museum/review-loop-failed-experiment/POST-MORTEM.md">
          post-mortem
        </MDXAnchor>{' '}
        remain archived as the failed experiment.
      </MDXCallout>
    </MDXSection>

    <MDXSection>
      <MDXHeadingOne>02 The workflow began reviewing itself</MDXHeadingOne>
      <MDXHeadingTwo>
        Roughly 260 findings concerned code written during the run.
      </MDXHeadingTwo>
      <MDXParagraph>
        The reviewers confirmed 289 findings. The workers fixed 286. The
        workflow discarded zero. My later audit estimated that the original
        change contained about nine to eleven defects, all found in the first
        pass. Almost everything after that came from the repairs.
      </MDXParagraph>
      <MDXParagraph>
        Many findings were real. Their fixes still had no place in this pull
        request. The workflow treated reproducible as mandatory and never asked
        whether a repair matched the feature's actual risk. Every fix gave the
        next reviewers more code to inspect.
      </MDXParagraph>
      <MDXParagraph>
        Pass 17 is where the scale became indefensible. One finding described a
        rare failure while cleaning up copied files. The repair added about
        9,575 lines across 74 files. A tool that copies standards files now had
        crash recovery machinery closer to a database than a file copy.
      </MDXParagraph>
      <MDXParagraph>
        The later passes became stranger. The workflow built release automation,
        repository administration, filesystem identity checks, and custom code
        scanners. By pass 39, it added a parser whose job was policing scanners
        written one pass earlier. The process had become its own customer.
      </MDXParagraph>
    </MDXSection>

    <MDXSection>
      <MDXHeadingOne>03 It escaped the pull request</MDXHeadingOne>
      <MDXHeadingTwo>
        The branch changed live repository settings and broke unrelated CI.
      </MDXHeadingTwo>
      <MDXParagraph>
        One repair applied the branch's rewritten GitHub settings to the live
        repository. It removed the declared protection for the main branch,
        added an undeclared release-tag rule, and created a deployment
        environment. The repository's configuration check then failed on every
        branch, including pull requests unrelated to the experiment.
      </MDXParagraph>
      <MDXParagraph>
        I restored the settings after stopping the run. The pull request stayed
        closed and unmerged. This was the clearest cost of the experiment. The
        workflow had moved beyond producing too much code and changed the system
        it was supposed to protect.
      </MDXParagraph>
    </MDXSection>

    <MDXSection>
      <MDXHeadingOne>04 Silence was the wrong finish line</MDXHeadingOne>
      <MDXHeadingTwo>
        A capable reviewer can always descend one level deeper.
      </MDXHeadingTwo>
      <MDXParagraph>
        Earlier versions of the workflow had finished in a few passes. Their
        repairs became smaller each time until reviewers ran out of material
        findings. I tightened the stopping rule after a stronger model found 17
        valid issues in a change that a weaker model had declared clean.
      </MDXParagraph>
      <MDXParagraph>
        Requiring two clean full reviews sounded safer. On this change, each
        repair round added code faster than the reviewers could clear it. The
        stronger reviewers kept finding defects because the workflow kept
        writing defects. Silence moved farther away after every pass.
      </MDXParagraph>
      <MDXParagraph>
        The workflow also lacked a pass limit, a time limit, and an alarm for
        explosive diff growth. I had given it blanket approval to continue,
        which disabled the last human interruption point. Those decisions made a
        46-hour run possible.
      </MDXParagraph>
    </MDXSection>

    <MDXSection>
      <MDXHeadingOne>05 Seven files survived</MDXHeadingOne>
      <MDXHeadingTwo>The useful change fit into 217 added lines.</MDXHeadingTwo>
      <MDXParagraph>
        I reopened the original feature and its first-pass hardening as{' '}
        <MDXAnchor href="https://github.com/davidvornholt/standards/pull/32">
          pull request #32
        </MDXAnchor>
        . It touched seven files, added 217 lines, passed its checks, and
        merged. The other 37,000 lines stayed in the museum branch.
      </MDXParagraph>
      <MDXParagraph>
        I retired review-loop in{' '}
        <MDXAnchor href="https://github.com/davidvornholt/standards/pull/33">
          pull request #33
        </MDXAnchor>{' '}
        and replaced it with review-fix. The replacement reviews once, repairs
        material findings, checks those repairs, and stops. A person receives
        the remaining risk and decides whether to merge.
      </MDXParagraph>
      <MDXParagraph>
        That bounded workflow later found fifteen material problems across two
        real changes. CodeRabbit found zero valid problems on the same original
        and repaired snapshots. The{' '}
        <MDXAnchor href="/posts/review-fix-versus-coderabbit">
          public comparison
        </MDXAnchor>{' '}
        shows what happened after the failed experiment became a usable skill.
      </MDXParagraph>
    </MDXSection>

    <MDXCallToAction
      title="See the bounded workflow at work"
      description="The follow-up experiment compared review-fix with CodeRabbit on two real changes."
      href="/posts/review-fix-versus-coderabbit"
      linkText="Read the comparison"
    />
  </>
);

export const reviewLoopRanFor46HoursPost: Post = {
  meta: {
    title:
      'I asked an AI reviewer to stop when the code was clean. It ran for 46 hours.',
    subtitle:
      'A 179-line change became 37,451 lines because reviewer silence was an impossible stopping condition.',
    slug: 'review-loop-ran-for-46-hours',
    date: '2026-08-26',
    category: 'Engineering',
    readTime: '7 min read',
    excerpt:
      'An experimental review workflow ran 39 passes, wrote most of its own defects, changed live repository settings, and still could not finish.',
  },
  body: ReviewLoopRanFor46HoursBody,
};
