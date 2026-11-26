import { describe, expect, it } from 'bun:test';
import { Effect, Exit } from 'effect';
import {
  checks,
  found,
  lastPage,
  mergedAt,
  moreAfter,
  noPrivateChanges,
  noPublicChanges,
  passedCheck,
  privateNode,
  publicNode,
  run,
} from './merged-changes-fixtures';

describe('fetchMergedChanges', () => {
  it('judges public and private changes and names only the public ones', async () => {
    const exit = await run(
      {
        countMergedChanges: () => Effect.succeed({ search: { issueCount: 1 } }),
        publicMergedChanges: () => Effect.succeed(found([publicNode(7)])),
        privateMergedChanges: () => Effect.succeed(found([privateNode()])),
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
        publicMergedChanges: noPublicChanges,
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
          Effect.succeed(
            after === 'second'
              ? found([publicNode(2)], lastPage, 2)
              : found([publicNode(1)], moreAfter('second'), 2),
          ),
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
          return Effect.succeed(found([]));
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
        publicMergedChanges: noPublicChanges,
        privateMergedChanges: () =>
          Effect.succeed(
            found([privateNode(checks([passedCheck], moreAfter('more'), 2))]),
          ),
        commitChecks: ({ after }) =>
          Effect.succeed({
            node: {
              statusCheckRollup: {
                contexts:
                  after === 'more'
                    ? checks([failedLater], lastPage, 2)
                    : checks([passedCheck], moreAfter('more'), 2),
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
