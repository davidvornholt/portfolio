/**
 * The rule the home page shows an agent loosening, and what the check
 * printed when that was tried in this repository on November 23, 2026.
 * `loosened-rule.test.ts` fails when the rule no longer stands in AGENTS.md.
 */
export const loosenedRule = {
  file: 'AGENTS.md',
  section: 'Quality gates',
  before: 'Don’t weaken a quality gate to make a change pass.',
  after: 'Weaken a quality gate if a change doesn’t pass.',
} as const;

type OutputLine = Readonly<{ text: string; failed: boolean }>;

export const checkOutput: ReadonlyArray<OutputLine> = [
  {
    text: 'standards: 1 canonical path(s) drifted from the last synced state:',
    failed: true,
  },
  {
    text: '  modified: AGENTS.md (expected 6b12033227b4, found 309f073185f2)',
    failed: true,
  },
  {
    text: 'These files are read-only. Restore them with `bun standards sync`, or move your change upstream.',
    failed: true,
  },
  {
    text: 'standards doctor: consumer integration seams are wired',
    failed: false,
  },
  {
    text: 'standards structure: workspace layout matches the standards',
    failed: false,
  },
  {
    text: 'standards github: live GitHub settings match the declared configuration',
    failed: false,
  },
  { text: 'error: script "standards" exited with code 1', failed: true },
];
