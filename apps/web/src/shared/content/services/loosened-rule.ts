/**
 * The rule the home page and an article show an agent loosening, and what the
 * commands printed when that was tried in this repository on November 25,
 * 2026. `loosened-rule.test.ts` fails when the rule no longer stands in
 * AGENTS.md.
 */
export const loosenedRule = {
  file: 'AGENTS.md',
  section: 'Quality gates',
  before: "Don't weaken a quality gate to make a change pass.",
  after: "Weaken a quality gate if a change doesn't pass.",
} as const;

export type OutputLine = Readonly<{ text: string; failed: boolean }>;

const passed = (text: string): OutputLine => ({ text, failed: false });
const failed = (text: string): OutputLine => ({ text, failed: true });

// The three parts of the check that the loosened rule does not touch.
const untouchedChecks = [
  passed('standards doctor: consumer integration seams are wired'),
  passed('standards structure: workspace layout matches the standards'),
  passed(
    'standards source-text: tracked source text contains no forbidden control characters',
  ),
  passed(
    'standards github: live GitHub settings match the declared configuration',
  ),
];

/** `bun standards check` with the rule loosened. */
export const checkOutput: ReadonlyArray<OutputLine> = [
  failed('standards: 1 canonical path(s) drifted from the last synced state:'),
  failed(
    '  modified: AGENTS.md (expected 6b12033227b4, found 309f073185f2); this repository\'s own rules go below "## Project-specific rules"',
  ),
  failed(
    'These files are read-only. Restore them with `bun standards sync`, or move your change upstream.',
  ),
  ...untouchedChecks,
  failed('error: script "standards" exited with code 1'),
];

/** `bun standards check` with the rule as the rulebook has it. */
export const passedCheckOutput: ReadonlyArray<OutputLine> = [
  passed('standards: 64 canonical path(s) match the last synced state'),
  ...untouchedChecks,
];

const syncComplete = passed(
  'sync complete: 64 managed path(s) at cfd203728421d7e6be710c523b27c97791a9c489',
);

/** `bun standards sync`, which puts the rulebook's wording back. */
export const syncOutput = {
  restored: [
    passed('  overwrote 1 locally-modified canonical path(s): AGENTS.md'),
    syncComplete,
  ],
  nothingToRestore: [syncComplete],
} as const;

// The rule shares its line in AGENTS.md with the two sentences after it.
const restOfLine =
  " Explain every inline suppression where it appears. Use a configuration exception only where a rule can't apply, scoped to the affected path and rule.";

/** `git diff` with the rule loosened. */
export const diffOutput: ReadonlyArray<OutputLine> = [
  passed('diff --git a/AGENTS.md b/AGENTS.md'),
  passed('--- a/AGENTS.md'),
  passed('+++ b/AGENTS.md'),
  passed(`-${loosenedRule.before}${restOfLine}`),
  passed(`+${loosenedRule.after}${restOfLine}`),
];
