import type { ReactNode } from 'react';
import { LoosenedRuleTerminal } from '@/shared/content/presentation/components/loosened-rule-terminal';
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
import { PostFigure } from './figures/post-figure';
import type { Post } from './post-meta';

const standards = 'https://github.com/davidvornholt/standards';

const owners = [
  {
    kind: 'Shared',
    example: 'AGENTS.md',
    rule: 'Belongs to the rulebook. A local edit makes the check fail.',
  },
  {
    kind: 'The project’s own',
    example: 'AGENTS.local.md',
    rule: 'Belongs to the project. This is where its own rules go.',
  },
  {
    kind: 'Generated',
    example: 'sync-standards.lock',
    rule: 'Written by the tool. It records exactly what was copied.',
  },
] as const;

const Owners = (): ReactNode => (
  <dl className="grid gap-x-8 gap-y-6 sm:grid-cols-3">
    {owners.map((owner) => (
      <div key={owner.kind}>
        <dt className="font-bold">{owner.kind}</dt>
        <dd className="mt-1 font-mono text-sm">{owner.example}</dd>
        <dd className="mt-2 text-muted-foreground leading-snug">
          {owner.rule}
        </dd>
      </div>
    ))}
  </dl>
);

const ExecutableEngineeringStandardsBody = (): ReactNode => (
  <>
    <MDXSection>
      <MDXParagraph>
        AI agents write most of my code. The{' '}
        <MDXAnchor href="/">chart on the home page</MDXAnchor> shows the changes
        I merged in the last thirteen weeks, and what my automated checks said
        about each of them.
      </MDXParagraph>
      <MDXParagraph>
        This article is about what the chart can’t show: why I let a change go
        live that I did not write.
      </MDXParagraph>
    </MDXSection>

    <MDXSection>
      <MDXHeadingOne>An agent saying “done” is not evidence</MDXHeadingOne>
      <MDXParagraph>
        Agents made code cheap. They made convincing mistakes cheap as well. A
        change can compile, read well, and still break something three files
        away. An agent can tell me that the checks passed without having run
        them. A second agent, asked to look it over, can agree with the first
        for the same wrong reason.
      </MDXParagraph>
      <MDXParagraph>
        So I don’t ask the agent whether the work is done. The repository
        answers that question, and no agent can argue with it.
      </MDXParagraph>
    </MDXSection>

    <MDXSection>
      <MDXHeadingOne>One command decides</MDXHeadingOne>
      <MDXParagraph>
        Each of my projects has one command that a change has to pass, on
        exactly the commit that is about to merge. In this site’s project it
        runs:
      </MDXParagraph>
      <MDXUnorderedList>
        <MDXListItem>
          the check that the project still follows my shared rules, which the
          next section explains
        </MDXListItem>
        <MDXListItem>
          the linter, with every warning counted as an error
        </MDXListItem>
        <MDXListItem>the type checker in its strict mode</MDXListItem>
        <MDXListItem>the tests and the production build</MDXListItem>
        <MDXListItem>
          a scan of every page for accessibility problems, against WCAG 2.2 AA
        </MDXListItem>
      </MDXUnorderedList>
      <MDXParagraph>
        If one of them fails, the change does not merge. If one of them can’t
        run, the change does not merge either.
      </MDXParagraph>
      <MDXParagraph>
        The chart also shows where this did not hold. A red square is a change
        that merged although a check had failed, and an outline is a change that
        merged before any check had finished. From my private projects the chart
        shows only the changes that passed, so for those it proves nothing
        either way.
      </MDXParagraph>
    </MDXSection>

    <MDXSection>
      <MDXHeadingOne>A rule alone is only a request</MDXHeadingOne>
      <MDXParagraph>
        My rules for agents are in a file called{' '}
        <MDXStrong>AGENTS.md</MDXStrong> at the top of every project. An agent
        reads it at the start of each session. An agent can also edit it. This
        is what happens when one does, tried in this site’s own project:
      </MDXParagraph>
      <div className="my-8">
        <LoosenedRuleTerminal />
      </div>
      <MDXParagraph>
        The file no longer matches what was recorded when the rules were last
        copied in, so the check fails, and with it everything that follows. The
        agent can still propose a different rule. It has to do that in the
        rulebook itself, where I see it.
      </MDXParagraph>
    </MDXSection>

    <MDXSection>
      <MDXHeadingOne>One rulebook for every project</MDXHeadingOne>
      <MDXParagraph>
        The rules don’t live in each project. They live in one public
        repository, called <MDXAnchor href={standards}>standards</MDXAnchor>,
        and a tool copies them into every project. Every file the tool knows has
        exactly one owner:
      </MDXParagraph>
      <PostFigure caption="The three kinds of file, each with one example.">
        <Owners />
      </PostFigure>
      <MDXParagraph>
        A project that needs something different doesn’t edit a shared file. It
        adds to it in a file of its own: its own instructions next to the shared
        ones, its own lint settings on top of the shared ones. Once a week a
        workflow proposes the newest rules to each project as an ordinary
        change, which has to pass that project’s checks like any other.
      </MDXParagraph>
    </MDXSection>

    <MDXSection>
      <MDXHeadingOne>The settings are checked too</MDXHeadingOne>
      <MDXParagraph>
        Tests can’t tell me whether somebody has switched off the rule that
        protects the main branch. So the settings of each repository on GitHub
        are written down in a file as well: which checks a change must pass, how
        changes may be merged, which labels exist. The same command compares
        that file with the live settings. It fails when they differ, and it
        fails when it can’t read them.
      </MDXParagraph>
    </MDXSection>

    <MDXSection>
      <MDXHeadingOne>A second model reads the change</MDXHeadingOne>
      <MDXParagraph>
        Checks catch what can be tested. For the rest, a different AI model than
        the one that wrote the change reviews it before it merges. Only a change
        so plain that a review could not find a bug anybody would run into goes
        without. The review has a hard limit: at most three reviews, then a
        report, then it stops. On two changes in July 2026 it{' '}
        <MDXAnchor href="/posts/review-fix-versus-coderabbit">
          found 15 problems
        </MDXAnchor>
        , and more than half of them turned up while it checked its own fixes.
      </MDXParagraph>
      <MDXParagraph>
        The limit is there because I once left it out. A few days earlier, a
        review workflow without one was told to go on until two reviews in a row
        found nothing. It{' '}
        <MDXAnchor href="/posts/review-loop-ran-for-46-hours">
          ran for 46 hours
        </MDXAnchor>
        , turned a change of 179 lines into one of 37,451, and changed the live
        settings of the repository before I stopped it. The workflow followed
        its rule to the letter. The rule was wrong.
      </MDXParagraph>
      <MDXParagraph>
        That is the limit of everything described here. Checks make sure that
        the rules are followed. They can’t tell me whether the rules are any
        good.
      </MDXParagraph>
    </MDXSection>

    <MDXSection>
      <MDXHeadingOne>What is left for me</MDXHeadingOne>
      <MDXParagraph>
        I decide what gets built and how it is put together. I write the rules,
        or approve them. I answer for what goes live.
      </MDXParagraph>
      <MDXParagraph>
        Merging is itself a command. It waits for the checks and refuses when
        one has failed, and an agent runs it only when I have told it to. Two
        kinds of change merge without me, and without a review, once their
        checks have passed: the weekly update of the rulebook, and small updates
        of dependencies.
      </MDXParagraph>
      <MDXParagraph>
        You don’t have to take my word for any of this. The rulebook, the tool,
        the checks, and the history of every change are public.
      </MDXParagraph>
    </MDXSection>

    <MDXCallToAction
      title="Read the rulebook"
      description="The rules, the tool that copies and checks them, and every change made to them."
      href={standards}
      linkText="Open the repository"
    />
  </>
);

export const executableEngineeringStandardsPost: Post = {
  meta: {
    title: 'Coding agents write most of my code. They don’t decide what ships.',
    subtitle:
      'Every change has to pass checks that no agent can argue with. How they work, and where they have failed.',
    slug: 'executable-engineering-standards',
    date: '2026-08-31',
    category: 'Engineering',
    readTime: '4 min read',
    excerpt:
      'An agent saying it is done is not evidence. What every change of mine has to pass before it merges, how one rulebook reaches all my projects, and what happens when an agent rewrites a rule.',
  },
  body: ExecutableEngineeringStandardsBody,
};
