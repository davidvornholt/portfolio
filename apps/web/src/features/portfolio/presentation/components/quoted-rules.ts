/**
 * The rules the home page quotes from this repository. `code` is what the page
 * shows: the lines `firstLine` to `lastLine` of `path`, without their common
 * indentation, and each line may stop before the end of its source line.
 * `quoted-rules.test.ts` fails when a quote no longer matches its source.
 */
export type QuotedRule = Readonly<{
  plain: string;
  path: string;
  firstLine: number;
  lastLine: number;
  code: string;
  emphasis: string;
}>;

export const quotedRules: ReadonlyArray<QuotedRule> = [
  {
    plain:
      'One command runs every check: code style, types, tests, the build and accessibility.',
    path: 'package.json',
    firstLine: 18,
    lastLine: 18,
    code: '"check": "standards check && turbo run lint check-types test build test:a11y --output-logs=errors-only"',
    emphasis: 'lint check-types test build test:a11y',
  },
  {
    plain: 'A warning stops a change, the same as an error.',
    path: 'package.json',
    firstLine: 20,
    lastLine: 20,
    code: '"lint": "biome check --error-on-warnings ."',
    emphasis: '--error-on-warnings',
  },
  {
    plain: 'The site is published only from a version that passed every check.',
    path: '.github/workflows/publish-container.yml',
    firstLine: 246,
    lastLine: 249,
    code: [
      'if [ "$conclusion" != success ]; then',
      '  echo "::error::The $GATE_WORKFLOW gate concluded $conclusion for $SHA"',
      '  exit 1',
      'fi',
    ].join('\n'),
    emphasis: 'exit 1',
  },
  {
    plain:
      'Every page is scanned for accessibility problems. The only passing result is none.',
    path: 'apps/web/a11y/routes.a11y.ts',
    firstLine: 184,
    lastLine: 184,
    code: 'expect(await scanWcag22AaViolations(page)).toEqual([]);',
    emphasis: 'toEqual([])',
  },
  {
    plain:
      'Nobody lowers a check to get a change through. That includes the AI, and it includes me.',
    path: 'AGENTS.md',
    firstLine: 19,
    lastLine: 19,
    code: "Don't weaken a quality gate to make a change pass.",
    emphasis: "Don't weaken a quality gate",
  },
];
