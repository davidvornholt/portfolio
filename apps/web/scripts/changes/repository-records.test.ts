import { describe, expect, it } from 'bun:test';
import { Effect, Exit } from 'effect';
import { GitHubGraphQL } from './github-graphql';
import { fetchAcceptedElsewhere } from './repository-records';

const lastPage = { hasNextPage: false, endCursor: null };
const merged = (nameWithOwner: string) => ({ repository: { nameWithOwner } });

describe('fetchAcceptedElsewhere', () => {
  it('leaves the own owners out of the search and counts each repository', async () => {
    const queries: Array<string> = [];
    const exit = await Effect.runPromiseExit(
      fetchAcceptedElsewhere('davidvornholt', [
        'davidvornholt',
        'prosabridge',
      ]).pipe(
        Effect.provide(
          GitHubGraphQL.layerTest({
            countMergedChanges: ({ query }) => {
              queries.push(query);
              return Effect.succeed({ search: { issueCount: 3 } });
            },
            mergedRepositories: ({ query }) => {
              queries.push(query);
              return Effect.succeed({
                search: {
                  issueCount: 3,
                  pageInfo: lastPage,
                  nodes: [
                    merged('serokell/deploy-rs'),
                    merged('super-productivity/super-productivity'),
                    merged('super-productivity/super-productivity'),
                  ],
                },
              });
            },
          }),
        ),
      ),
    );

    expect(exit).toEqual(
      Exit.succeed([
        { repository: 'super-productivity/super-productivity', changes: 2 },
        { repository: 'serokell/deploy-rs', changes: 1 },
      ]),
    );
    expect(new Set(queries)).toEqual(
      new Set([
        'is:pr is:merged is:public author:davidvornholt -user:davidvornholt -user:prosabridge',
      ]),
    );
  });

  // The search has no date range to split, so past the limit GitHub would
  // return a part of the list and the record would be built on it.
  it('fails before it reads a list longer than one search returns', async () => {
    let listsRead = 0;
    const exit = await Effect.runPromiseExit(
      fetchAcceptedElsewhere('davidvornholt', ['davidvornholt']).pipe(
        Effect.provide(
          GitHubGraphQL.layerTest({
            countMergedChanges: () =>
              Effect.succeed({ search: { issueCount: 1001 } }),
            mergedRepositories: () => {
              listsRead += 1;
              return Effect.succeed({
                search: {
                  issueCount: 1,
                  pageInfo: lastPage,
                  nodes: [merged('serokell/deploy-rs')],
                },
              });
            },
          }),
        ),
      ),
    );

    expect(Exit.isFailure(exit)).toBe(true);
    expect(JSON.stringify(exit)).toContain('SearchWindowTooLargeError');
    expect(listsRead).toBe(0);
  });
});
