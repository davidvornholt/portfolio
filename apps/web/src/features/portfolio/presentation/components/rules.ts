// Pin the source David quoted so links in older previews still resolve to the same lines.
export const sourceRevision = '39c3c10bbb22b723f730356bd28343edfa48ae1b';
export const rules = [
  {
    title: 'Run the whole suite before a release.',
    path: 'package.json',
    line: 18,
    quote:
      '"check": "standards check && turbo run lint check-types test build test:a11y --output-logs=errors-only",',
  },
  {
    title: 'A warning stops the build.',
    path: 'package.json',
    line: 20,
    quote: '"lint": "biome check --error-on-warnings .",',
  },
  {
    title: 'Deploy the exact version that passed.',
    path: '.github/workflows/publish-container.yml',
    line: 320,
    quote: 'needs.gate.outputs.gated-sha == github.sha',
  },
  {
    title: 'Test the pages for accessibility.',
    path: 'apps/web/a11y/routes.a11y.ts',
    line: 184,
    quote: 'expect(await scanWcag22AaViolations(page)).toEqual([]);',
  },
  {
    title: 'Fix the change when a rule catches a problem.',
    path: 'AGENTS.md',
    line: 21,
    quote: "Don't weaken a quality gate to make a change pass.",
  },
] as const;
