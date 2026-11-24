import type { ReactNode } from 'react';
import { PlayOnView } from '@/shared/ui/presentation/components/play-on-view';
import './rulebook.css';
import { checkOutput, loosenedRule } from './loosened-rule';
import { textLinkClassName } from './text-link';

const command = 'bun standards check';

const places = [
  'on my machine, before a change is sent',
  'on every proposed change',
  'every week, when the rulebook is synced',
] as const;

const reasons = [
  {
    title: 'Agents have no memory',
    text: 'The rules live in the project. An agent reads them at the start of every session.',
  },
  {
    title: 'Every agent works differently',
    text: 'Instructions fix what a problem note, a proposal, and a review have to contain.',
  },
  {
    title: 'Copies drift apart',
    text: 'One public rulebook feeds all my projects. A better rule reaches each of them as a proposed change.',
  },
] as const;

const Terminal = (): ReactNode => (
  <PlayOnView className="terminal keeps-colors">
    <p className="terminal-title">~/dev/portfolio</p>
    <div className="terminal-body">
      <p className="terminal-dim">
        # An agent "loosens" a rule in {loosenedRule.file}:
      </p>
      <p className="terminal-dim">- {loosenedRule.before}</p>
      <p>+ {loosenedRule.after}</p>
      <p className="mt-4">
        <span className="terminal-dim">$</span>{' '}
        <span className="terminal-typed">{command}</span>
        <span aria-hidden="true" className="terminal-caret" data-at="command" />
      </p>
      <div className="terminal-output mt-1 grid gap-1">
        {checkOutput.map((line) => (
          <p
            key={line.text}
            className="terminal-line"
            data-failed={line.failed ? '' : undefined}
          >
            {line.text}
          </p>
        ))}
        <p aria-hidden="true">
          <span className="terminal-dim">$</span>{' '}
          <span className="terminal-caret" />
        </p>
      </div>
    </div>
  </PlayOnView>
);

/**
 * Why the rules hold: each one is checked, and the check notices when a rule
 * is rewritten. `record` is the sentence on what the checks said about every
 * change to this site's own repository.
 */
export const Rulebook = ({
  record,
}: {
  readonly record: ReactNode;
}): ReactNode => (
  <section
    id="rules"
    className="page-column -scroll-mt-16 pt-28 md:-scroll-mt-24 md:pt-36"
  >
    <div className="grid gap-x-14 gap-y-8 lg:grid-cols-13">
      <div className="lg:col-span-5">
        <h2 className="font-bold text-3xl tracking-tight md:text-5xl md:leading-[1.05]">
          A rule alone is only a request
        </h2>
        <p className="mt-4 text-lg md:text-xl md:leading-snug">
          So every rule of mine comes with a check that fails when the rule is
          broken, or quietly rewritten. Here an agent tries that in this site’s
          project.
        </p>
        <p className="mt-8 font-semibold">The same check runs</p>
        <ol className="mt-2 border-foreground border-t-2">
          {places.map((place, position) => (
            <li
              key={place}
              className="grid grid-cols-[2rem_1fr] border-border border-b py-2.5"
            >
              <span aria-hidden="true" className="font-bold">
                {position + 1}
              </span>
              {place}
            </li>
          ))}
        </ol>
      </div>
      <div className="lg:col-span-8">
        <Terminal />
      </div>
    </div>

    <ul className="mt-12 grid gap-x-14 border-foreground border-t-2 md:mt-16 lg:grid-cols-3">
      {reasons.map((reason) => (
        <li
          key={reason.title}
          className="border-border border-b py-6 lg:border-b-0"
        >
          <h3 className="font-bold text-xl tracking-tight">{reason.title}</h3>
          <p className="mt-2 max-w-md text-muted-foreground leading-relaxed">
            {reason.text}
          </p>
        </li>
      ))}
    </ul>
    <p className="mt-4 text-muted-foreground">
      {record}{' '}
      <a
        href="https://github.com/davidvornholt/standards"
        target="_blank"
        rel="noopener noreferrer"
        data-umami-event="standards-open"
        className={`${textLinkClassName} text-foreground`}
      >
        Read the rulebook on GitHub
      </a>
    </p>
  </section>
);
