export const headSha = '1111111111111111111111111111111111111111';
export const producerRunId = 100;
const producerRunNumber = 10;
const producerWorkflowId = 316_903_523;
const pullRequestNumber = 35;

export const apiRecord = (
  entries: ReadonlyArray<readonly [string, unknown]>,
): Record<string, unknown> => Object.fromEntries(entries);

export const eligiblePullRequest = (overrides: Record<string, unknown> = {}) =>
  apiRecord([
    ['number', pullRequestNumber],
    ['state', 'open'],
    ['draft', false],
    [
      'base',
      apiRecord([
        ['repo', apiRecord([['full_name', 'davidvornholt/portfolio']])],
        ['ref', 'main'],
      ]),
    ],
    [
      'head',
      apiRecord([
        ['repo', apiRecord([['full_name', 'davidvornholt/portfolio']])],
        ['sha', headSha],
      ]),
    ],
    ['labels', [{ name: 'pr-preview' }]],
    ...Object.entries(overrides),
  ]);

export const producerRun = (
  pullRequests: ReadonlyArray<{ readonly number: number }>,
) =>
  apiRecord([
    ['id', producerRunId],
    ['workflow_id', producerWorkflowId],
    ['name', 'Publish container'],
    ['path', '.github/workflows/publish-container.yml'],
    ['event', 'pull_request'],
    ['status', 'completed'],
    ['conclusion', 'success'],
    ['head_sha', headSha],
    ['head_repository', apiRecord([['full_name', 'davidvornholt/portfolio']])],
    ['run_attempt', 1],
    ['run_number', producerRunNumber],
    ['pull_requests', pullRequests],
  ]);
