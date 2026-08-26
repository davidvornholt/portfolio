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
  MDXListItem,
  MDXParagraph,
  MDXStrong,
  MDXUnorderedList,
} from '@/shared/content/presentation/components/mdx-markdown-elements';
import type { Post } from './post-meta';

const resultRows = [
  {
    change: 'GitHub permissions',
    reviewFix: '6 total',
    codeRabbit: '0 across 2 runs',
  },
  {
    change: 'Policy checker',
    reviewFix: '9 total',
    codeRabbit: '0 across 2 runs',
  },
] as const;

const workflowStages = [
  {
    number: '01',
    title: 'Review the change',
    detail: 'The initial review found seven issues across the two changes.',
  },
  {
    number: '02',
    title: 'Make the repairs',
    detail: 'Six issues were fixed. One documented risk was accepted.',
  },
  {
    number: '03',
    title: 'Check the repairs',
    detail: 'The first repairs introduced or exposed four more issues.',
  },
  {
    number: '04',
    title: 'Check once more',
    detail: 'The next repairs exposed the final four issues.',
  },
  {
    number: '05',
    title: 'Test and hand off',
    detail: 'The last repairs passed the gates. The workflow stopped.',
  },
] as const;

const BenchmarkScorecard = (): ReactNode => (
  <figure className="my-10 border-border border-y py-8">
    <div className="grid gap-8 sm:grid-cols-2 sm:gap-0">
      <div className="sm:border-border sm:border-r sm:pr-8">
        <p className="font-mono text-6xl text-primary tabular-nums">15</p>
        <p className="mt-2 font-medium text-foreground">
          material review-fix findings
        </p>
        <p className="mt-1 text-muted-foreground text-sm">
          14 repaired, one risk accepted
        </p>
      </div>
      <div className="border-border border-t pt-8 sm:border-t-0 sm:pt-0 sm:pl-8">
        <p className="font-mono text-6xl text-foreground tabular-nums">0</p>
        <p className="mt-2 font-medium text-foreground">
          valid CodeRabbit findings
        </p>
        <p className="mt-1 text-muted-foreground text-sm">One false positive</p>
      </div>
    </div>
    <figcaption className="mt-8 border-border border-t pt-4 text-muted-foreground text-sm">
      Two real change sets, four reviewed snapshots, and public receipts for
      every finding.
    </figcaption>
  </figure>
);

const ExperimentLedger = (): ReactNode => (
  <div className="my-10 border-border border-y">
    <table className="w-full table-fixed border-collapse text-sm">
      <caption className="sr-only">
        Valid findings from review-fix and CodeRabbit on two changes
      </caption>
      <thead>
        <tr className="border-border border-b text-muted-foreground">
          <th
            className="w-[46%] py-3 pr-3 text-left font-medium sm:pr-6"
            scope="col"
          >
            Change
          </th>
          <th className="px-2 py-3 text-center font-medium sm:px-6" scope="col">
            review-fix workflow
          </th>
          <th className="py-3 pl-2 text-center font-medium sm:pl-6" scope="col">
            CodeRabbit
          </th>
        </tr>
      </thead>
      <tbody>
        {resultRows.map((row) => (
          <tr
            className="border-border border-b last:border-b-0"
            key={row.change}
          >
            <th
              className="py-4 pr-3 text-left font-medium text-foreground sm:pr-6"
              scope="row"
            >
              {row.change}
            </th>
            <td className="px-2 py-4 text-center font-mono text-primary text-xs tabular-nums sm:px-6 sm:text-sm">
              {row.reviewFix}
            </td>
            <td className="py-4 pl-2 text-center font-mono text-foreground text-xs tabular-nums sm:pl-6 sm:text-sm">
              {row.codeRabbit}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const ReviewFixWorkflow = (): ReactNode => (
  <figure className="my-10 border-border border-y py-8">
    <ol className="grid gap-0 md:grid-cols-5">
      {workflowStages.map((stage) => (
        <li
          className="relative border-border border-l pb-8 pl-6 last:pb-0 md:border-t md:border-l-0 md:pt-6 md:pr-5 md:pb-0 md:pl-0"
          key={stage.number}
        >
          <span
            aria-hidden="true"
            className="absolute top-0 -left-[5px] size-2 bg-primary md:-top-[5px] md:left-0"
          />
          <p className="font-medium font-mono text-primary text-xs">
            {stage.number}
          </p>
          <p className="mt-2 font-medium text-foreground text-sm">
            {stage.title}
          </p>
          <p className="mt-2 text-muted-foreground text-xs leading-relaxed">
            {stage.detail}
          </p>
        </li>
      ))}
    </ol>
    <figcaption className="mt-8 border-border border-t pt-4 text-muted-foreground text-sm">
      The path only moves forward. Stage five ends with a human merge decision.
    </figcaption>
  </figure>
);

const ReviewFixVersusCodeRabbitBody = (): ReactNode => (
  <>
    <MDXSection>
      <MDXHeadingOne>01 The result</MDXHeadingOne>
      <MDXHeadingTwo>
        Fifteen material findings to zero valid findings.
      </MDXHeadingTwo>
      <MDXParagraph>
        In July 2026, I ran my repository-aware{' '}
        <MDXStrong>review-fix</MDXStrong> workflow over two real changes in my
        engineering standards repository. I cloned the original and repaired
        heads into four pull requests and asked CodeRabbit Pro, on its Assertive
        profile, for full reviews.
      </MDXParagraph>
      <BenchmarkScorecard />
      <MDXParagraph>
        review-fix found fifteen distinct problems across its review, repair,
        and verification stages. Fourteen changed the product, its tests, or the
        instructions people follow when adopting it. The fifteenth was a real
        credential risk that I accepted after a live probe showed there was no
        lower-privilege route. CodeRabbit left one comment. That comment was a
        false positive.
      </MDXParagraph>
      <MDXCallout title="Scope">
        This experiment covers two pull requests in one repository. The change
        sets, review reports, repair history, CodeRabbit runs, and final gates
        are public.
      </MDXCallout>
    </MDXSection>

    <MDXSection>
      <MDXHeadingOne>02 What the findings would have broken</MDXHeadingOne>
      <MDXHeadingTwo>
        The findings changed whether the work was safe to ship.
      </MDXHeadingTwo>
      <MDXParagraph>
        The complete reports list every finding and its disposition: the{' '}
        <MDXAnchor href="https://github.com/davidvornholt/standards/pull/93#issuecomment-5015507517">
          nine findings in the policy-checking change
        </MDXAnchor>{' '}
        and the{' '}
        <MDXAnchor href="https://github.com/davidvornholt/standards/pull/94#issuecomment-5015370540">
          six findings in the GitHub permissions change
        </MDXAnchor>
        . Every finding remained valid on re-audit. Fourteen were fixed. I
        accepted the remaining security risk and recorded why.
      </MDXParagraph>
      <MDXUnorderedList>
        <MDXListItem>
          <MDXStrong>A quality check that gave the wrong answer.</MDXStrong> It
          skipped files that should have been checked and sometimes mistook
          ordinary text for a violation. A broken change could pass. A clean
          change could fail.
        </MDXListItem>
        <MDXListItem>
          <MDXStrong>Results that went stale or reran every time.</MDXStrong>{' '}
          The check could reuse an old result after its inputs changed. The
          first repair swung too far and forced a rerun every time. The final
          repair made the result change only when its real inputs changed.
        </MDXListItem>
        <MDXListItem>
          <MDXStrong>Adoption instructions that led to a dead end.</MDXStrong>
          The change required a release that nobody could install yet. Its
          instructions also described behavior that had been removed. Both had
          to be corrected before another repository could adopt the change.
        </MDXListItem>
        <MDXListItem>
          <MDXStrong>
            Error messages that sent people in the wrong direction.
          </MDXStrong>
          The permissions checker called an access problem a network outage. It
          also blamed permissions for failures with other causes. Someone
          following those messages would troubleshoot the wrong system.
        </MDXListItem>
        <MDXListItem>
          <MDXStrong>
            A credential that could read more than intended.
          </MDXStrong>
          The narrower permission failed a test against a private repository. I
          accepted the extra read access and documented the controls around the
          credential.
        </MDXListItem>
      </MDXUnorderedList>
      <ExperimentLedger />
      <MDXParagraph>
        CodeRabbit reported no actionable comments on either original snapshot,
        including the{' '}
        <MDXAnchor href="https://github.com/davidvornholt/standards/pull/96#issuecomment-5015558506">
          permissions change
        </MDXAnchor>{' '}
        and the{' '}
        <MDXAnchor href="https://github.com/davidvornholt/standards/pull/98#issuecomment-5015559016">
          policy checker
        </MDXAnchor>
        . It also found nothing on the{' '}
        <MDXAnchor href="https://github.com/davidvornholt/standards/pull/99#issuecomment-5015558701">
          fully repaired policy checker
        </MDXAnchor>
        . Those original snapshots contained the first-pass defects. CodeRabbit
        had a clean chance to catch them and missed all of them.
      </MDXParagraph>
    </MDXSection>

    <MDXSection>
      <MDXHeadingOne>03 CodeRabbit's false positive</MDXHeadingOne>
      <MDXHeadingTwo>
        The whole package already followed one consistent design.
      </MDXHeadingTwo>
      <MDXParagraph>
        On the repaired permissions change, CodeRabbit objected to a plain error
        class, <MDXStrong>throw</MDXStrong>, async/await, and try/catch. It
        cited a general repository rule and asked two files to adopt Effect, a
        different way to manage async work and errors.{' '}
        <MDXAnchor href="https://github.com/davidvornholt/standards/pull/97#discussion_r3610537339">
          The comment is still public
        </MDXAnchor>
        .
      </MDXParagraph>
      <MDXParagraph>
        The package already used plain TypeScript async and error handling
        throughout. It is a small bootstrap tool that runs before the rest of a
        project is installed. Adding Effect to the two changed files would have
        given one package two competing ways to handle the same errors and added
        another dependency to a tool designed to start with very few. That
        design was later written into{' '}
        <MDXAnchor href="https://github.com/davidvornholt/standards/blob/main/AGENTS.local.md#standards-cli-bootstrap-architecture">
          its local instructions
        </MDXAnchor>
        . The same pattern already appeared throughout the code CodeRabbit
        reviewed.
      </MDXParagraph>
      <MDXParagraph>
        CodeRabbit applied the broad rule without checking how the package was
        built. review-fix kept the package consistent. Following CodeRabbit's
        comment would have left two files handling errors differently from the
        rest.
      </MDXParagraph>
    </MDXSection>

    <MDXSection>
      <MDXHeadingOne>04 How review-fix moves through a change</MDXHeadingOne>
      <MDXHeadingTwo>
        It is a bounded workflow with a hard stop and a human handoff.
      </MDXHeadingTwo>
      <ReviewFixWorkflow />
      <MDXParagraph>
        The first review checks the change against its intended behavior and the
        repository's own decisions. The repair stages then treat every fix as
        new code. That second look matters because a sensible repair can solve
        one problem and create another.
      </MDXParagraph>
      <MDXParagraph>
        Eight of the fifteen findings appeared while checking repairs. One fix
        made the quality check reject clean code. Another made the check rerun
        on every build. A third corrected one error message while leaving
        related messages wrong. Each problem was easier to see in the small set
        of new repairs than in the full change.
      </MDXParagraph>
      <MDXParagraph>
        CodeRabbit reviewed the original and final snapshots. The originals
        exposed every initial defect; CodeRabbit missed them. The temporary
        repair defects were gone by the final heads. The comparison measures
        that workflow advantage directly: review-fix inspects its own repairs.
      </MDXParagraph>
      <MDXParagraph>
        The hard stop came from a{' '}
        <MDXAnchor href="/posts/review-loop-ran-for-46-hours">
          46-hour review-loop experiment
        </MDXAnchor>
        . The predecessor turned a 179-line change into 37,451 added lines and
        changed live repository settings before I stopped it. review-fix
        replaced that open-ended behavior with the forward path in the diagram.
        On these two changes, the workflow found fifteen material problems. The
        snapshot reviewer found none.
      </MDXParagraph>
    </MDXSection>

    <MDXCallToAction
      title="Audit the audit"
      description="Every finding, repair, accepted tradeoff, and CodeRabbit review is public in the standards repository."
      href="https://github.com/davidvornholt/standards"
      linkText="Open the repository"
    />
  </>
);

export const reviewFixVersusCodeRabbitPost: Post = {
  meta: {
    title:
      'My review-fix workflow found 15 material issues. CodeRabbit found none.',
    subtitle:
      'Four public reruns show what repository context and repair verification catch.',
    slug: 'review-fix-versus-coderabbit',
    date: '2026-08-26',
    category: 'Engineering',
    readTime: '6 min read',
    excerpt:
      "I ran review-fix and CodeRabbit over the same two changes. Fourteen defects were repaired, one real risk was accepted, and CodeRabbit's only comment was a false positive.",
  },
  body: ReviewFixVersusCodeRabbitBody,
};
