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
    title: 'Publish the contract',
    detail: 'Rules, skills, gates, and repository settings live upstream.',
  },
  {
    number: '02',
    title: 'Sync a consumer',
    detail: 'The CLI mirrors canonical files and records their exact state.',
  },
  {
    number: '03',
    title: 'Run the gate',
    detail: 'The consumer checks sync state before its own lint, types, and tests.',
  },
  {
    number: '04',
    title: 'Block drift',
    detail: 'A required CI verdict stops the merge when the contract no longer holds.',
  },
] as const;

const FileOwnershipFigure = (): ReactNode => (
  <figure className="my-10 border-border border-y py-8">
    <div className="grid md:grid-cols-3">
      {ownershipClasses.map((fileClass) => (
        <div
          className="border-border border-t py-6 first:border-t-0 md:border-t-0 md:border-l md:px-6 md:first:border-l-0 md:first:pl-0 md:last:pr-0"
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

const StandardsFlowFigure = (): ReactNode => (
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
      The standard reaches a repository as code, then the repository has to
      prove that it still follows it.
    </figcaption>
  </figure>
);

const ExecutableEngineeringStandardsBody = (): ReactNode => (
  <>
    <MDXSection>
      <MDXHeadingOne>01 A document is not a control</MDXHeadingOne>
      <MDXHeadingTwo>
        A rule matters only when a repository can tell whether it follows it.
      </MDXHeadingTwo>
      <MDXParagraph>
        An ordinary standards document has no way to know whether anyone obeyed
        it. A copied linter configuration can drift. A test command can exist
        without CI calling it. A coding agent can report that the checks passed
        without proving which checks ran.
      </MDXParagraph>
      <MDXParagraph>
        More prose does not close those gaps. I built{' '}
        <MDXAnchor href="https://github.com/davidvornholt/standards">
          standards
        </MDXAnchor>{' '}
        so the important rules arrive as versioned files, executable checks,
        and declared repository state. A consumer either matches the contract
        or its gate fails.
      </MDXParagraph>
      <MDXCallout title="The test">
        A standard should answer a concrete question: what command proves that
        this repository still follows it?
      </MDXCallout>
    </MDXSection>

    <MDXSection>
      <MDXHeadingOne>02 One source of truth</MDXHeadingOne>
      <MDXHeadingTwo>
        The standards repository contains both policy and the machinery that
        checks it.
      </MDXHeadingTwo>
      <MDXParagraph>
        The shared contract starts in <MDXStrong>AGENTS.md</MDXStrong>. It tells
        humans and coding agents how the repository is structured, which quality
        rules are non-negotiable, and where local decisions belong. Reusable
        skills add task-specific instructions for review, CI, databases,
        infrastructure, and interface work.
      </MDXParagraph>
      <MDXUnorderedList>
        <MDXListItem>
          Strict TypeScript and Biome configuration turn warnings and unsafe
          shortcuts into errors.
        </MDXListItem>
        <MDXListItem>
          Playwright and Axe scan browser routes against WCAG 2.2 AA.
        </MDXListItem>
        <MDXListItem>
          Declared GitHub settings cover merge methods, required checks,
          rulesets, and labels.
        </MDXListItem>
        <MDXListItem>
          The <MDXStrong>@davidvornholt/standards</MDXStrong> CLI initializes,
          syncs, and checks consuming repositories.
        </MDXListItem>
      </MDXUnorderedList>
      <MDXParagraph>
        Each consumer runs the standards check before its own lint, types,
        tests, build, and accessibility suite. A repository cannot call its
        quality gate green while the shared contract is already out of date.
      </MDXParagraph>
      <StandardsFlowFigure />
    </MDXSection>

    <MDXSection>
      <MDXHeadingOne>03 Three kinds of files</MDXHeadingOne>
      <MDXHeadingTwo>
        Central control only works when local ownership is explicit.
      </MDXHeadingTwo>
      <MDXParagraph>
        Making every file identical would be simple and useless. Projects need
        different databases, deployment targets, and product rules. Letting
        every project edit the shared files would be flexible and would destroy
        the standard.
      </MDXParagraph>
      <MDXParagraph>
        The sync system resolves that tension by assigning every managed file
        to one of three classes.
      </MDXParagraph>
      <FileOwnershipFigure />
      <MDXParagraph>
        Local variation goes through named extension points. A repository adds
        its own instructions in <MDXStrong>AGENTS.local.md</MDXStrong>, extends
        the shared linter from its repo-owned <MDXStrong>biome.jsonc</MDXStrong>,
        and keeps project-specific operator commands in{' '}
        <MDXStrong>local.just</MDXStrong>. The shared file stays unchanged.
      </MDXParagraph>
      <MDXParagraph>
        The filenames are not the main idea. The important part is that each
        decision has one owner. Editing a canonical file is drift. Extending it
        through an approved local file is part of the design.
      </MDXParagraph>
    </MDXSection>

    <MDXSection>
      <MDXHeadingOne>04 The repository is part of the product</MDXHeadingOne>
      <MDXHeadingTwo>
        Correct application code can still live in a badly configured
        repository.
      </MDXHeadingTwo>
      <MDXParagraph>
        Tests do not tell me whether somebody enabled merge commits, removed a
        required status check, or changed a branch rule. Those settings decide
        what can ship, so I treat them as product behavior rather than dashboard
        housekeeping.
      </MDXParagraph>
      <MDXParagraph>
        The standards repository declares the expected GitHub state in code.
        The check compares that declaration with the live repository and fails
        on drift or on an API error that prevents verification. The apply
        command brings the live settings back to the declaration with
        administrator credentials.
      </MDXParagraph>
      <MDXParagraph>
        This makes the repository itself reviewable. Source files, quality
        gates, merge policy, and selected labels all have a versioned home.
        Passing tests is no longer the only evidence required to merge.
      </MDXParagraph>
    </MDXSection>

    <MDXSection>
      <MDXHeadingOne>05 A template stops at day one</MDXHeadingOne>
      <MDXHeadingTwo>
        Starting aligned is easy. Staying aligned is the actual work.
      </MDXHeadingTwo>
      <MDXParagraph>
        A repository template copies one good starting point. The copy begins
        aging as soon as the first project changes. Fixing a rule upstream does
        nothing for repositories that already exist.
      </MDXParagraph>
      <MDXParagraph>
        The standards CLI gives those repositories an upgrade path. Init creates
        the first managed state. A lock records the exact canonical files.
        Sync applies later changes, and check reports edits, deletions, or
        integration mistakes.
      </MDXParagraph>
      <MDXParagraph>
        A weekly workflow turns upstream changes into ordinary pull requests.
        A stricter accessibility rule or a corrected agent instruction arrives
        as a diff, runs against the consumer's own gate, and waits for the same
        merge decision as application code.
      </MDXParagraph>
      <MDXCallout title="The difference">
        A template gives a repository a starting point. A sync system gives it
        an upgrade path.
      </MDXCallout>
    </MDXSection>

    <MDXSection>
      <MDXHeadingOne>06 Fail closed does not mean infallible</MDXHeadingOne>
      <MDXHeadingTwo>
        Automation can enforce a bad rule with perfect consistency.
      </MDXHeadingTwo>
      <MDXParagraph>
        Strict shared standards have a cost. A mistake upstream can affect many
        repositories. A new gate can expose work that every consumer must fix.
        The ownership model and sync engine also need maintenance of their own.
      </MDXParagraph>
      <MDXParagraph>
        My sharpest lesson came from an experimental review workflow inside the
        standards repository. It was supposed to keep reviewing until two
        consecutive passes found nothing. Instead, it turned a 179-line change
        into 37,451 added lines and changed live repository settings before I
        stopped it. The{' '}
        <MDXAnchor href="/posts/review-loop-ran-for-46-hours">
          full 46-hour failure
        </MDXAnchor>{' '}
        is public.
      </MDXParagraph>
      <MDXParagraph>
        I removed that workflow and replaced it with a bounded review, repair,
        and verification cycle. In a later public comparison, that workflow
        found fifteen material issues across two changes while CodeRabbit found
        no valid issue. The{' '}
        <MDXAnchor href="/posts/review-fix-versus-coderabbit">
          comparison and every finding
        </MDXAnchor>{' '}
        are available to inspect.
      </MDXParagraph>
      <MDXParagraph>
        Those experiments changed the contract. Automated work now gets finite
        stages, explicit ownership, and a human merge decision. Fail closed
        means that an error stops the process. It does not mean the process is
        correct.
      </MDXParagraph>
    </MDXSection>

    <MDXSection>
      <MDXHeadingOne>07 Inspect the contract</MDXHeadingOne>
      <MDXHeadingTwo>
        Nobody has to take my claims about engineering quality on trust.
      </MDXHeadingTwo>
      <MDXParagraph>
        The standards, sync lock, workflows, and pull request history are
        public. A reader can inspect the rule, see how it reaches a consumer,
        and check whether the repository's required verdict passed.
      </MDXParagraph>
      <MDXParagraph>
        I do not expect every team to adopt my exact opinions. The useful idea
        is smaller. Make the rules that matter executable, give local variation
        an explicit home, and let drift fail where people can see it.
      </MDXParagraph>
      <MDXCallout>
        A standard that cannot be checked is advice.
      </MDXCallout>
    </MDXSection>

    <MDXCallToAction
      title="Audit the standards"
      description="Read the contract, CLI, ownership model, and current gates."
      href="https://github.com/davidvornholt/standards"
      linkText="Open the repository"
    />
  </>
);

export const executableEngineeringStandardsPost: Post = {
  meta: {
    title: 'A standards document can be ignored. Mine can fail CI.',
    subtitle:
      'How one shared engineering contract, three classes of files, and a sync engine keep every repository aligned.',
    slug: 'executable-engineering-standards',
    date: '2026-08-31',
    category: 'Engineering',
    readTime: '7 min read',
    excerpt:
      'I turned engineering standards into an executable system: one shared contract, fail-closed gates, declared repository state, and a sync engine that detects drift.',
  },
  body: ExecutableEngineeringStandardsBody,
};
