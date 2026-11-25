import {
  checkOutput,
  diffOutput,
  gateOutput,
  logOutput,
  loosenedRule,
  type OutputLine,
  passedCheckOutput,
  rootEntries,
  statusOutput,
  syncOutput,
} from './loosened-rule';

/**
 * The commands the terminal on the page answers when a visitor types into
 * it. It is not a shell: it knows one folder and one loosened rule, and prints what the real commands printed in this repository.
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
  '',
  'Also: ls, git status, git log --oneline, bun run check',
].map(said);

// None of the answers below is printed by a real command. They say where
// this terminal ends.
const unknown = said(
  'This terminal knows only a handful of commands. Type help to see them.',
);
const unknownGit = said(
  'git: this terminal knows status, diff, log --oneline, branch, restore and checkout.',
);
const unknownBun = said(
  'bun: this terminal knows standards check, standards sync and run check.',
);
const unreadable = said(
  'cat: this terminal holds no files. git diff shows what the agent changed.',
);
const staysHere = said('cd: this terminal stays in ~/dev/portfolio.');
const skippingChangesNothing = said(
  'Skipping the checks on this machine changes nothing. They run again on the pull request.',
);

// `ls` prints names in columns, down each column first.
const columns = 3;
const columnGap = 2;

const listing = (): ReadonlyArray<OutputLine> => {
  const rows = Math.ceil(rootEntries.length / columns);
  const width =
    Math.max(...rootEntries.map((entry) => entry.length)) + columnGap;
  return Array.from({ length: rows }, (_, row) =>
    said(
      Array.from(
        { length: columns },
        (_unused, column) => rootEntries[column * rows + row] ?? '',
      )
        .map((entry) => entry.padEnd(width))
        .join('')
        .trimEnd(),
    ),
  );
};

type Outcome = Readonly<{
  lines: ReadonlyArray<OutputLine>;
  restores?: boolean;
  clears?: boolean;
}>;

/** What a command does, given whether the rule is still loosened. */
type Command = (loosened: boolean) => Outcome;

const prints =
  (lines: ReadonlyArray<OutputLine>): Command =>
  () => ({ lines });

const check: Command = (loosened) => ({
  lines: loosened ? checkOutput : passedCheckOutput,
});

const gate: Command = (loosened) => ({
  lines: loosened ? gateOutput.failed : gateOutput.passed,
});

const sync: Command = (loosened) => ({
  lines: loosened ? syncOutput.restored : syncOutput.nothingToRestore,
  restores: true,
});

const diff: Command = (loosened) => ({
  lines: loosened ? diffOutput : [],
});

const status: Command = (loosened) => ({
  lines: loosened ? statusOutput.loosened : statusOutput.clean,
});

// `git restore` prints nothing.
const restore: Command = () => ({ lines: [], restores: true });

const checkout: Command = (loosened) => ({
  lines: [said(`Updated ${loosened ? '1 path' : '0 paths'} from the index`)],
  restores: true,
});

const commands: ReadonlyMap<string, Command> = new Map([
  ['', prints([])],
  ['help', prints(help)],
  ['clear', () => ({ lines: [], clears: true })],
  ['ls', prints(listing())],
  ['pwd', prints([said('/home/david/dev/portfolio')])],
  ['whoami', prints([said('david')])],
  ['bun standards check', check],
  ['bun standards sync', sync],
  ['bun run check', gate],
  ['git status', status],
  ['git diff', diff],
  [`git diff ${loosenedRule.file}`, diff],
  ['git log --oneline', prints(logOutput)],
  ['git branch', prints([said('* main')])],
  [`git restore ${loosenedRule.file}`, restore],
  ['git restore .', restore],
  [`git checkout ${loosenedRule.file}`, checkout],
  [`git checkout -- ${loosenedRule.file}`, checkout],
  ['git checkout .', checkout],
]);

// For a line that is none of the commands above: the first of these whose
// test fits answers it.
const otherwise: ReadonlyArray<
  readonly [
    fits: (line: string) => boolean,
    answer: (line: string) => OutputLine,
  ]
> = [
  [(line) => line.includes('--no-verify'), () => skippingChangesNothing],
  [(line) => line === 'echo', () => said('')],
  [
    (line) => line.startsWith('echo '),
    (line) => said(line.slice('echo '.length)),
  ],
  [(line) => line === 'cd' || line.startsWith('cd '), () => staysHere],
  [(line) => line === 'cat' || line.startsWith('cat '), () => unreadable],
  [(line) => line === 'git' || line.startsWith('git '), () => unknownGit],
  [(line) => line === 'bun' || line.startsWith('bun '), () => unknownBun],
  [() => true, () => unknown],
];

const whitespace = /\s+/gu;

/** What the terminal prints for one typed line, and the state it leaves. */
export const runCommand = (state: ShellState, typed: string): ShellAnswer => {
  const line = typed.trim().replace(whitespace, ' ');
  const fallback: Command = () => ({
    lines: otherwise
      .flatMap(([fits, answer]) => (fits(line) ? [answer(line)] : []))
      .slice(0, 1),
  });
  const outcome = (commands.get(line) ?? fallback)(state.rule === 'loosened');
  return {
    state: outcome.restores === true ? { rule: 'restored' } : state,
    lines: outcome.lines,
    clears: outcome.clears === true,
  };
};
