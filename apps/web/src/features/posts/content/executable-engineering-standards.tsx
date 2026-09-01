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

const ownershipClasses = [
  {
    number: '01',
    name: 'Synced',
    owner: 'The standards repository owns the file.',
    example: 'AGENTS.md',
    behavior: 'Sync replaces local edits, and check reports drift.',
  },
  {
    number: '02',
    name: 'Repo-owned',
    owner: 'The consuming repository owns the file.',
    example: 'AGENTS.local.md',
    behavior: 'Sync preserves it as the approved place for local decisions.',
  },
  {
    number: '03',
    name: 'Generated',
    owner: 'The engine composes the file from shared and local inputs.',
    example: '.github/dependabot.yml',
    behavior: 'Hand edits are drift because the output must be reproducible.',
  },
] as const;

const flowStages = [
  {
    number: '01',
    title: 'Share the contract',
    detail: 'Synced instructions and repo-local rules define the work.',
  },
  {
    number: '02',
    title: 'Agent writes',
    detail:
      'A coding agent implements the change and repairs accepted findings.',
  },
  {
    number: '03',
    title: 'Gates verify',
    detail:
      'Types, lint, tests, accessibility, and repository state run on the exact commit.',
  },
  {
    number: '04',
    title: 'Human decides',
    detail: 'The evidence and remaining risk return to a person for the merge.',
  },
] as const;

const FileOwnershipFigure = (): ReactNode => (
  <figure className="my-10 border-border border-y py-8">
    <div className="grid md:grid-cols-3">
      {ownershipClasses.map((fileClass) => (
        <div
          className="border-border border-t py-6 first:border-t-0 md:border-t-0 md:border-l md:px-6 md:last:pr-0 md:first:border-l-0 md:first:pl-0"
          key={fileClass.name}
        >
          <p className="font-mono text-primary text-xs">{fileClass.number}</p>
          <p className="mt-2 font-medium text-foreground">{fileClass.name}</p>
          <p className="mt-2 text-muted-foreground text-sm leading-relaxed">
            {fileClass.owner}
          </p>
          <p className="mt-5 font-mono text-foreground text-xs">
            {fileClass.example}
          </p>
          <p className="mt-2 text-muted-foreground text-sm leading-relaxed">
            {fileClass.behavior}
          </p>
        </div>
      ))}
    </div>
    <figcaption className="mt-6 border-border border-t pt-4 text-muted-foreground text-sm">
      Central rules and local choices can coexist when every file has one clear
      owner.
    </figcaption>
  </figure>
);

const VerificationFlowFigure = (): ReactNode => (
  <figure className="my-10 border-border border-y py-8">
    <ol className="grid gap-0 md:grid-cols-4">
      {flowStages.map((stage) => (
        <li
          className="relative border-border border-l pb-8 pl-6 last:pb-0 md:border-t md:border-l-0 md:pt-6 md:pr-6 md:pb-0 md:pl-0 md:last:pr-0"
          key={stage.number}
        >
          <span
            aria-hidden={true}
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
      The agent can propose and repair a change. It cannot give itself the final
      verdict.
    </figcaption>
  </figure>
);

const ExecutableEngineeringStandardsBody = (): ReactNode => (
  <>
    <MDXSection>
      <MDXHeadingOne>01 Agent confidence is not evidence</MDXHeadingOne>
      <MDXHeadingTwo>
        Coding agents write most of my code. They do not decide when it is
        ready.
      </MDXHeadingTwo>
      <MDXParagraph>
        In my workflow, the hard part is no longer producing code. It is
        deciding which changes deserve to reach main.
      </MDXParagraph>
      <MDXParagraph>
        Agents make code cheap. They also make convincing mistakes cheap. A
        change can compile and look polished while hiding a broken contract, a
        stale assumption, or a repair that introduced another defect. A model
        can say the checks passed without showing which checks ran. A second
        model can approve the same assumption with equal confidence.
      </MDXParagraph>
      <MDXParagraph>
        So I do not ask the model whether the work is done. I ask the
        repository.
      </MDXParagraph>
      <MDXParagraph>
        Every change has to meet the same bar: strict types and linting, tests,
        the production build, WCAG 2.2 AA accessibility checks, repository
        structure, synchronized instructions, and declared GitHub state. If a
        required check finds a problem, errors, or cannot prove what it checked,
        the merge stops.
      </MDXParagraph>
      <MDXParagraph>
        That is how I use coding agents aggressively without making their
        confidence part of the trust model.
      </MDXParagraph>
      <MDXCallout title="The boundary">
        An agent can propose code, repair findings, and explain its work. It
        cannot give itself the final verdict.
      </MDXCallout>
    </MDXSection>

    <MDXSection>
      <MDXHeadingOne>02 The repository has to prove the work</MDXHeadingOne>
      <MDXHeadingTwo>
        A green gate is an evidence trail, not an agent's opinion.
      </MDXHeadingTwo>
      <MDXParagraph>
        Each repository runs one required gate over the exact change it is about
        to merge. The gate starts by checking the shared engineering contract,
        then runs the repository's own code and behavior checks.
      </MDXParagraph>
      <MDXUnorderedList>
        <MDXListItem>
          Strict TypeScript and Biome configuration turn warnings, type
          mismatches, and unsafe shortcuts into failures.
        </MDXListItem>
        <MDXListItem>
          Unit tests and the production build check behavior and integration,
          not just whether the files parse.
        </MDXListItem>
        <MDXListItem>
          Playwright and Axe scan every browser route against WCAG 2.2 AA.
        </MDXListItem>
        <MDXListItem>
          Structure, synchronized files, generated configuration, and live
          GitHub settings are checked for drift.
        </MDXListItem>
      </MDXUnorderedList>
      <MDXParagraph>
        The exact checks vary with the repository. The rule does not. Required
        evidence must come from the system around the change, not from the final
        message written by the agent that produced it.
      </MDXParagraph>
      <VerificationFlowFigure />
    </MDXSection>

    <MDXSection>
      <MDXHeadingOne>03 One contract for humans and agents</MDXHeadingOne>
      <MDXHeadingTwo>
        The same non-negotiable rules have to reach every repository that uses
        them.
      </MDXHeadingTwo>
      <MDXParagraph>
        The public source of truth behind the repositories I maintain is the{' '}
        <MDXAnchor href="https://github.com/davidvornholt/standards">
          standards repository
        </MDXAnchor>
        . Its <MDXStrong>AGENTS.md</MDXStrong> defines architecture boundaries,
        quality rules, package management, error handling, and the final merge
        process for both people and coding agents.
      </MDXParagraph>
      <MDXParagraph>
        Reusable skills add narrower instructions for review, CI, databases,
        infrastructure, and interface work. The contract says where a decision
        belongs. The gate checks whether the repository still follows it.
      </MDXParagraph>
      <MDXParagraph>
        The <MDXStrong>@davidvornholt/standards</MDXStrong> CLI mirrors the
        shared files into each consumer and records their exact state. Every
        consumer runs <MDXStrong>standards check</MDXStrong> before its own
        lint, types, tests, build, and accessibility suite. A repository cannot
        call itself green while the contract it claims to follow is already
        stale.
      </MDXParagraph>
      <MDXCallout title="Why sync instead of copy">
        A template gives a repository a good first day. Synchronization gives it
        an upgrade path.
      </MDXCallout>
    </MDXSection>

    <MDXSection>
      <MDXHeadingOne>04 Every file needs one owner</MDXHeadingOne>
      <MDXHeadingTwo>
        Central rules and local decisions have to coexist without silent forks.
      </MDXHeadingTwo>
      <MDXParagraph>
        Making every file identical would be simple and useless. Projects need
        different databases, deployment targets, and product rules. Letting
        every project edit the shared files would be flexible and would destroy
        the standard.
      </MDXParagraph>
      <MDXParagraph>
        The sync system resolves that tension by assigning every managed file to
        one of three classes.
      </MDXParagraph>
      <FileOwnershipFigure />
      <MDXParagraph>
        Local variation goes through named extension points. A repository adds
        its own instructions in <MDXStrong>AGENTS.local.md</MDXStrong>. Its
        repo-owned <MDXStrong>biome.jsonc</MDXStrong> extends the shared linter.
        Project-specific operator commands live in{' '}
        <MDXStrong>local.just</MDXStrong>. The shared file stays unchanged.
      </MDXParagraph>
      <MDXParagraph>
        A weekly workflow turns upstream changes into ordinary pull requests.
        New rules arrive as a visible diff, run against the consumer's own gate,
        and wait for the same merge decision as application code. Local edits to
        canonical files are drift. Local decisions made through the approved
        seams are part of the design.
      </MDXParagraph>
    </MDXSection>

    <MDXSection>
      <MDXHeadingOne>05 The repository itself is checked</MDXHeadingOne>
      <MDXHeadingTwo>
        Correct application code can still be merged through a broken process.
      </MDXHeadingTwo>
      <MDXParagraph>
        Tests do not tell me whether somebody enabled merge commits, removed a
        required status check, changed a branch rule, or let repository
        configuration drift away from the declared policy. Those settings decide
        what can ship.
      </MDXParagraph>
      <MDXParagraph>
        The standards repository therefore declares the expected GitHub state in
        code. The gate compares that declaration with the live repository and
        fails on drift or on an API error that prevents verification. An
        administrator-only apply command brings the live settings back to the
        declaration.
      </MDXParagraph>
      <MDXParagraph>
        This makes the delivery process reviewable. Source files, quality gates,
        merge policy, rulesets, and selected labels all have a versioned home.
        Passing tests is necessary. It is no longer the only evidence required
        to merge.
      </MDXParagraph>
    </MDXSection>

    <MDXSection>
      <MDXHeadingOne>06 Strict automation can still fail</MDXHeadingOne>
      <MDXHeadingTwo>
        A gate can enforce a bad rule with perfect consistency.
      </MDXHeadingTwo>
      <MDXParagraph>
        My most expensive lesson came from an experimental review workflow in
        the standards repository. It kept reviewing until two consecutive passes
        found nothing. That sounded safer than stopping after one review.
      </MDXParagraph>
      <MDXParagraph>
        Instead, each repair gave the next reviewers more code to inspect. A
        179-line change became 37,451 added lines over 39 passes. The workflow
        even changed live repository settings before I stopped it after roughly
        46 hours. The{' '}
        <MDXAnchor href="/posts/review-loop-ran-for-46-hours">
          full failure
        </MDXAnchor>{' '}
        remains public.
      </MDXParagraph>
      <MDXParagraph>
        I removed the open-ended loop and replaced it with one bounded review,
        repair, and verification cycle. In a later public comparison, that
        workflow found fifteen material issues across two changes while
        CodeRabbit found no valid findings. The{' '}
        <MDXAnchor href="/posts/review-fix-versus-coderabbit">
          comparison and every finding
        </MDXAnchor>{' '}
        are available to inspect.
      </MDXParagraph>
      <MDXParagraph>
        Fail closed is one useful property. It is not proof that the process is
        correct. Automated work also needs a fixed scope, hard stopping
        conditions, explicit ownership, and a person who accepts the remaining
        risk.
      </MDXParagraph>
    </MDXSection>

    <MDXSection>
      <MDXHeadingOne>
        07 Confidence comes from evidence, not trust
      </MDXHeadingOne>
      <MDXHeadingTwo>
        I merge agent-written code when the repository can defend the change.
      </MDXHeadingTwo>
      <MDXParagraph>
        The gates do not remove responsibility. I still set product intent,
        choose the architecture, judge tradeoffs, and own what reaches
        production. The system makes the evidence visible before I make that
        decision.
      </MDXParagraph>
      <MDXParagraph>
        The shared contract, sync lock, workflows, checks, and pull request
        history are public. A reader can inspect a rule, see how it reaches a
        consumer, and verify whether the required gate passed.
      </MDXParagraph>
      <MDXParagraph>
        I do not expect every team to adopt my exact opinions. The useful idea
        is simpler. Separate generation from approval. Give important rules an
        executable form, check the repository as well as the code, and keep the
        final merge decision with a person.
      </MDXParagraph>
      <MDXCallout>
        Model confidence is cheap. Merge confidence has to be earned.
      </MDXCallout>
    </MDXSection>

    <MDXCallToAction
      title="Inspect the system"
      description="Read the shared contract, sync engine, quality gates, and public failure reports."
      href="https://github.com/davidvornholt/standards"
      linkText="Open the repository"
    />
  </>
);

export const executableEngineeringStandardsPost: Post = {
  meta: {
    title: "Coding agents write most of my code. They don't decide what ships.",
    subtitle:
      'How shared instructions, repository-aware review, and fail-closed gates let me merge agent-written changes without lowering the quality bar.',
    slug: 'executable-engineering-standards',
    date: '2026-08-31',
    category: 'Engineering',
    readTime: '7 min read',
    excerpt:
      'Agent-written code can look finished long before it is safe to merge. This is the evidence system every change must pass before it reaches main.',
  },
  body: ExecutableEngineeringStandardsBody,
};
