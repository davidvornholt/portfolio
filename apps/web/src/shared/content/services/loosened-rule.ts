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

const gateCommand = passed(
  '$ standards check && turbo run lint check-types test build test:a11y --output-logs=errors-only',
);

/** `bun run check`, the whole gate. It stops at the first part that fails. */
export const gateOutput = {
  failed: [
    gateCommand,
    ...checkOutput.slice(0, -1),
    failed('error: script "check" exited with code 1'),
  ],
  passed: [
    gateCommand,
    ...passedCheckOutput,
    passed(''),
    passed('   • turbo 2.11.11'),
    passed(
      '   • Packages in scope: //, @davidvornholt/a11y-testing, @davidvornholt/typescript-config, @portfolio/ui, @portfolio/web',
    ),
    passed(
      '   • Running lint, check-types, test, build, test:a11y in 5 packages',
    ),
    passed('   • Remote caching disabled, using shared worktree cache'),
    passed(''),
    passed(' Tasks:    11 successful, 11 total'),
    passed('Cached:    6 cached, 11 total'),
    passed('  Time:    11.368s'),
  ],
} as const;

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

/** `git status`, on the branch the site is published from. */
export const statusOutput = {
  loosened: [
    'On branch main',
    "Your branch is up to date with 'origin/main'.",
    '',
    'Changes not staged for commit:',
    '  (use "git add <file>..." to update what will be committed)',
    '  (use "git restore <file>..." to discard changes in working directory)',
    '\tmodified:   AGENTS.md',
    '',
    'no changes added to commit (use "git add" and/or "git commit -a")',
  ].map(passed),
  clean: [
    'On branch main',
    "Your branch is up to date with 'origin/main'.",
    '',
    'nothing to commit, working tree clean',
  ].map(passed),
} as const;

/** `git log --oneline`: the newest changes on `main` that day. */
export const logOutput: ReadonlyArray<OutputLine> = [
  '39c3c10 chore: sync standards from upstream (#147)',
  'd356c99 chore: ignore direnv cache (#143)',
  '11cb216 fix(runtime): upgrade Bun to 1.4.5 (#141)',
  '37cb339 chore(deps): bump the minor-and-patch group with 2 updates (#140)',
  '9fb0804 chore: sync standards from upstream (#139)',
].map(passed);

/** What `ls` lists in the repository's folder. */
export const rootEntries = [
  'AGENTS.local.md',
  'AGENTS.md',
  'apps',
  'biome.base.jsonc',
  'biome.jsonc',
  'bun.lock',
  'compose.yaml',
  'config',
  'Dockerfile',
  'docs',
  'flake.lock',
  'flake.nix',
  'justfile',
  'LICENSE',
  'nix',
  'node_modules',
  'package.json',
  'packages',
  'README.md',
  'secrets',
  'secrets.just',
  'skills-lock.json',
  'sync-standards.json',
  'sync-standards.lock',
  'turbo.json',
] as const;
