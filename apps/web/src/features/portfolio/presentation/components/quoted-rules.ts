/**
 * Where a quote stands in its file. A file this repository owns is quoted by
 * its lines. A file the standards sync owns changes without a change to this
 * page, and the next sync would move a line number, so its quote names the
 * section it stands in.
 */
export type QuotePlace =
  | Readonly<{ firstLine: number; lastLine: number }>
  | Readonly<{ section: string }>;

/**
 * The rules the home page quotes from this repository. `code` is what the page
 * shows: lines of `path` at `place`, without their common indentation, and
 * each line may stop before the end of its source line.
 * `quoted-rules.test.ts` fails when a quote no longer matches its source.
 */
export type QuotedRule = Readonly<{
  plain: string;
  path: string;
  place: QuotePlace;
  code: string;
  emphasis: string;
}>;

export const quotedRules: ReadonlyArray<QuotedRule> = [
  {
    plain:
      'One command runs every check: code style, types, tests, the build and accessibility.',
    path: 'package.json',
    place: { firstLine: 18, lastLine: 18 },
    code: '"check": "standards check && turbo run lint check-types test build test:a11y --output-logs=errors-only"',
    emphasis: 'lint check-types test build test:a11y',
  },
  {
    plain: 'A warning stops a change, the same as an error.',
    path: 'package.json',
    place: { firstLine: 20, lastLine: 20 },
    code: '"lint": "biome check --error-on-warnings ."',
    emphasis: '--error-on-warnings',
  },
  {
    plain: 'The site is published only from a version that passed every check.',
    path: '.github/workflows/publish-container.yml',
    place: { firstLine: 246, lastLine: 249 },
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
    place: { firstLine: 184, lastLine: 184 },
    code: 'expect(await scanWcag22AaViolations(page)).toEqual([]);',
    emphasis: 'toEqual([])',
  },
  {
    plain:
      'Nobody lowers a check to get a change through. That includes the AI, and it includes me.',
    path: 'AGENTS.md',
    place: { section: 'Quality gates' },
    code: "Don't weaken a quality gate to make a change pass.",
    emphasis: "Don't weaken a quality gate",
  },
];
