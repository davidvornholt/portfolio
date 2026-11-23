import { describe, expect, it } from 'bun:test';
import { DateTime, Effect, Exit } from 'effect';
import { GitHubGraphQL } from './github-graphql';
import type {
  PrivatePullRequestNode,
  PublicPullRequestNode,
} from './github-operations';
import { fetchMergedChanges } from './merged-changes';

type Handlers = Parameters<typeof GitHubGraphQL.layerTest>[0];
type Commit = NonNullable<
  NonNullable<PrivatePullRequestNode['commits']['nodes']>[number]
>['commit'];
type Contexts = NonNullable<Commit['statusCheckRollup']>['contexts'];

const mergedAt = DateTime.makeUnsafe('2026-11-07T17:48:00Z');
const lastPage = { hasNextPage: false, endCursor: null };

const passedCheck = {
  __typename: 'CheckRun',
  name: 'check',
  conclusion: 'SUCCESS',
  startedAt: DateTime.makeUnsafe('2026-11-07T17:30:00Z'),
  completedAt: DateTime.makeUnsafe('2026-11-07T17:40:00Z'),
  checkSuite: null,
} as const;

const commit = (contexts: Contexts): Commit => ({
  id: 'commit-id',
  oid: 'head-sha',
  statusCheckRollup: { contexts },
});

const privateNode = (
  contexts: Contexts = { pageInfo: lastPage, nodes: [passedCheck] },
): PrivatePullRequestNode => ({
  mergedAt,
  additions: 30,
  deletions: 10,
  repository: { databaseId: 2 },
  commits: { nodes: [{ commit: commit(contexts) }] },
});

const publicNode = (number: number): PublicPullRequestNode => ({
  ...privateNode(),
  number,
  title: `change ${number}`,
  url: `https://github.com/davidvornholt/standards/pull/${number}`,
  repository: { databaseId: 1, nameWithOwner: 'davidvornholt/standards' },
});

const run = (handlers: Handlers, days: ReadonlyArray<string>) =>
  Effect.runPromiseExit(
    fetchMergedChanges('davidvornholt', days).pipe(
      Effect.provide(GitHubGraphQL.layerTest(handlers)),
    ),
  );

const noPrivateChanges: Handlers['privateMergedChanges'] = () =>
  Effect.succeed({ search: { pageInfo: lastPage, nodes: [] } });

describe('fetchMergedChanges', () => {
  it('judges public and private changes and names only the public ones', async () => {
    const exit = await run(
      {
        countMergedChanges: () => Effect.succeed({ search: { issueCount: 1 } }),
        publicMergedChanges: () =>
          Effect.succeed({
            search: { pageInfo: lastPage, nodes: [publicNode(7)] },
          }),
        privateMergedChanges: () =>
          Effect.succeed({
            search: { pageInfo: lastPage, nodes: [privateNode()] },
          }),
      },
      ['2026-11-07'],
    );

    expect(exit).toEqual(
      Exit.succeed([
        {
          mergedAt,
          linesChanged: 40,
          verdict: 'passed',
          failedChecks: [],
          repositoryId: 1,
          headSha: 'head-sha',
          source: {
            repository: 'davidvornholt/standards',
            number: 7,
            title: 'change 7',
            url: 'https://github.com/davidvornholt/standards/pull/7',
          },
        },
        {
          mergedAt,
          linesChanged: 40,
          verdict: 'passed',
          failedChecks: [],
          repositoryId: 2,
          headSha: 'head-sha',
          source: undefined,
        },
      ]),
    );
  });

  it('searches by visibility, author and merge days', async () => {
    const queries: Array<string> = [];
    await run(
      {
        countMergedChanges: ({ query }) => {
          queries.push(query);
          return Effect.succeed({ search: { issueCount: 0 } });
        },
        publicMergedChanges: () =>
          Effect.succeed({ search: { pageInfo: lastPage, nodes: [] } }),
        privateMergedChanges: noPrivateChanges,
      },
      ['2026-11-01', '2026-11-02'],
    );

    expect(queries.toSorted((a, b) => a.localeCompare(b))).toEqual([
      'is:pr is:merged is:private author:davidvornholt merged:2026-11-01..2026-11-02',
      'is:pr is:merged is:public author:davidvornholt merged:2026-11-01..2026-11-02',
    ]);
  });

  it('follows the search to its last page', async () => {
    const exit = await run(
      {
        countMergedChanges: () => Effect.succeed({ search: { issueCount: 2 } }),
        publicMergedChanges: ({ after }) =>
          Effect.succeed({
            search:
              after === 'second'
                ? { pageInfo: lastPage, nodes: [publicNode(2)] }
                : {
                    pageInfo: { hasNextPage: true, endCursor: 'second' },
                    nodes: [publicNode(1), null],
                  },
          }),
        privateMergedChanges: noPrivateChanges,
      },
      ['2026-11-07'],
    );

    expect(
      Exit.isSuccess(exit) && exit.value.map((change) => change.source?.number),
    ).toEqual([1, 2]);
  });
});

describe('fetchMergedChanges beyond the limits of one request', () => {
  it('searches day by day when a week has more results than one search returns', async () => {
    const searched: Array<string> = [];
    const exit = await run(
      {
        countMergedChanges: ({ query }) =>
          Effect.succeed({
            search: {
              issueCount: query.includes('2026-11-01..2026-11-02') ? 1001 : 1,
            },
          }),
        publicMergedChanges: ({ query }) => {
          searched.push(query.slice(query.indexOf('merged:')));
          return Effect.succeed({ search: { pageInfo: lastPage, nodes: [] } });
        },
        privateMergedChanges: noPrivateChanges,
      },
      ['2026-11-01', '2026-11-02'],
    );

    expect(Exit.isSuccess(exit)).toBe(true);
    expect(searched).toEqual([
      'merged:2026-11-01..2026-11-01',
      'merged:2026-11-02..2026-11-02',
    ]);
  });

  it('fails when a single day has more results than one search returns', async () => {
    const exit = await run(
      {
        countMergedChanges: () =>
          Effect.succeed({ search: { issueCount: 1001 } }),
      },
      ['2026-11-07'],
    );

    expect(Exit.isFailure(exit)).toBe(true);
    expect(JSON.stringify(exit)).toContain('SearchWindowTooLargeError');
  });

  it('reads the rest of a long check list before judging', async () => {
    const failedLater = { ...passedCheck, name: 'slow', conclusion: 'FAILURE' };
    const exit = await run(
      {
        countMergedChanges: () => Effect.succeed({ search: { issueCount: 1 } }),
        publicMergedChanges: () =>
          Effect.succeed({ search: { pageInfo: lastPage, nodes: [] } }),
        privateMergedChanges: () =>
          Effect.succeed({
            search: {
              pageInfo: lastPage,
              nodes: [
                privateNode({
                  pageInfo: { hasNextPage: true, endCursor: 'more' },
                  nodes: [passedCheck],
                }),
              ],
            },
          }),
        commitChecks: ({ after }) =>
          Effect.succeed({
            node: {
              statusCheckRollup: {
                contexts:
                  after === 'more'
                    ? { pageInfo: lastPage, nodes: [failedLater] }
                    : {
                        pageInfo: { hasNextPage: true, endCursor: 'more' },
                        nodes: [passedCheck],
                      },
              },
            },
          }),
      },
      ['2026-11-07'],
    );

    expect(Exit.isSuccess(exit) && exit.value).toMatchObject([
      { verdict: 'failed', failedChecks: ['slow'] },
    ]);
  });
});
