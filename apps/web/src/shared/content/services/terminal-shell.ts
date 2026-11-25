import {
  checkOutput,
  diffOutput,
  loosenedRule,
  type OutputLine,
  passedCheckOutput,
  syncOutput,
} from './loosened-rule';

/**
 * The few commands the terminal on the page answers when a visitor types
 * into it. It is not a shell: it knows one file with one loosened rule, and
 * prints what the real commands printed in this repository.
 */
export type ShellState = Readonly<{ rule: 'loosened' | 'restored' }>;

export const initialShellState: ShellState = { rule: 'loosened' };

export type ShellAnswer = Readonly<{
  state: ShellState;
  lines: ReadonlyArray<OutputLine>;
  /** The command empties the screen. */
  clears: boolean;
}>;

const said = (text: string): OutputLine => ({ text, failed: false });

const help = [
  'bun standards check      run the check',
  'git diff                 see what the agent changed',
  `git restore ${loosenedRule.file}    undo the change`,
  'bun standards sync       let the rulebook undo it',
  'clear                    empty the screen',
].map(said);

const unknown = [
  said(
    'This terminal knows only a handful of commands. Type help to see them.',
  ),
];

// No real command prints this. It answers the attempt to skip the checks.
const skippingChangesNothing = [
  said(
    'Skipping the checks on this machine changes nothing. They run again on the pull request.',
  ),
];

type Outcome = Readonly<{
  lines: ReadonlyArray<OutputLine>;
  restores?: boolean;
  clears?: boolean;
}>;

/** What a command does, given whether the rule is still loosened. */
type Command = (loosened: boolean) => Outcome;

const check: Command = (loosened) => ({
  lines: loosened ? checkOutput : passedCheckOutput,
});

const sync: Command = (loosened) => ({
  lines: loosened ? syncOutput.restored : syncOutput.nothingToRestore,
  restores: true,
});

const diff: Command = (loosened) => ({ lines: loosened ? diffOutput : [] });

// `git restore` prints nothing.
const restore: Command = () => ({ lines: [], restores: true });

const checkout: Command = (loosened) => ({
  lines: [said(`Updated ${loosened ? '1 path' : '0 paths'} from the index`)],
  restores: true,
});

const commands: ReadonlyMap<string, Command> = new Map([
  ['', () => ({ lines: [] })],
  ['help', () => ({ lines: help })],
  ['clear', () => ({ lines: [], clears: true })],
  ['bun standards check', check],
  ['bun standards sync', sync],
  ['git diff', diff],
  [`git diff ${loosenedRule.file}`, diff],
  [`git restore ${loosenedRule.file}`, restore],
  ['git restore .', restore],
  [`git checkout ${loosenedRule.file}`, checkout],
  [`git checkout -- ${loosenedRule.file}`, checkout],
  ['git checkout .', checkout],
]);

const whitespace = /\s+/gu;

/** What the terminal prints for one typed line, and the state it leaves. */
export const runCommand = (state: ShellState, typed: string): ShellAnswer => {
  const line = typed.trim().replace(whitespace, ' ');
  const fallback: Command = () => ({
    lines: line.includes('--no-verify') ? skippingChangesNothing : unknown,
  });
  const effect = (commands.get(line) ?? fallback)(state.rule === 'loosened');
  return {
    state: effect.restores === true ? { rule: 'restored' } : state,
    lines: effect.lines,
    clears: effect.clears === true,
  };
};
