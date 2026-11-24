import type { ReactNode } from 'react';
import {
  checkOutput,
  loosenedRule,
} from '@/shared/content/services/loosened-rule';
import { PlayOnView } from '@/shared/ui/presentation/components/play-on-view';
import './terminal.css';

const command = 'bun standards check';

const Lines = (): ReactNode => (
  <>
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
  </>
);

/**
 * The terminal in which an agent loosens a rule and the check notices. With
 * `plays` the command is typed and the output arrives once the terminal comes
 * into view. Without it the terminal shows the finished run.
 */
export const LoosenedRuleTerminal = ({
  plays = false,
}: {
  readonly plays?: boolean;
}): ReactNode =>
  plays ? (
    <PlayOnView className="terminal keeps-colors">
      <Lines />
    </PlayOnView>
  ) : (
    <div className="terminal keeps-colors">
      <Lines />
    </div>
  );
