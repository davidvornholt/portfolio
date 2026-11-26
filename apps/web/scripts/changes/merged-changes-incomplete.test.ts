import { describe, expect, it } from 'bun:test';
import { Effect, Exit } from 'effect';
import {
  type Contexts,
  checks,
  found,
  type Handlers,
  lastPage,
  moreAfter,
  noPrivateChanges,
  noPublicChanges,
  passedCheck,
  privateNode,
  publicNode,
  run,
} from './merged-changes-fixtures';

// What a fetch that has to fail ended with. Each of the cases below has to
// end the run, because the snapshot is written from what the fetch returns
// and would draw a chart with a part missing.
const incomplete = 'IncompleteDataError';
const outcome = (exit: Exit.Exit<unknown, unknown>): string =>
  Exit.isFailure(exit) ? JSON.stringify(exit) : 'The fetch succeeded.';

const twoChanges: Handlers['countMergedChanges'] = () =>
  Effect.succeed({ search: { issueCount: 2 } });

describe('fetchMergedChanges when a search leaves something out', () => {
  it('fails when a search with two results returns one change', async () => {
    let readings = 0;
    const exit = await run(
      {
        countMergedChanges: twoChanges,
        publicMergedChanges: () => {
          readings += 1;
          return Effect.succeed(found([publicNode(1)], lastPage, 2));
        },
        privateMergedChanges: noPrivateChanges,
      },
      ['2026-11-07'],
    );

    expect(outcome(exit)).toContain(incomplete);
    expect(readings).toBe(3);
  });

  it('fails when a search returns an empty entry in place of a change', async () => {
    const exit = await run(
      {
        countMergedChanges: twoChanges,
        publicMergedChanges: () => Effect.succeed(found([publicNode(1), null])),
        privateMergedChanges: noPrivateChanges,
      },
      ['2026-11-07'],
    );

    expect(outcome(exit)).toContain(incomplete);
  });

  it('fails when a page does not say where the next one starts', async () => {
    const exit = await run(
      {
        countMergedChanges: twoChanges,
        publicMergedChanges: () =>
          Effect.succeed(
            found([publicNode(1)], { hasNextPage: true, endCursor: null }, 2),
          ),
        privateMergedChanges: noPrivateChanges,
      },
      ['2026-11-07'],
    );

    expect(outcome(exit)).toContain(incomplete);
  });

  it('reads a search again when a change merges between two pages', async () => {
    let readings = 0;
    const exit = await run(
      {
        countMergedChanges: twoChanges,
        publicMergedChanges: ({ after }) => {
          readings += after === 'second' ? 0 : 1;
          if (readings > 1) {
            return Effect.succeed(
              found([publicNode(1), publicNode(2), publicNode(3)]),
            );
          }
          return Effect.succeed(
            after === 'second'
              ? found([publicNode(2)], lastPage, 3)
              : found([publicNode(1)], moreAfter('second'), 2),
          );
        },
        privateMergedChanges: noPrivateChanges,
      },
      ['2026-11-07'],
    );

    expect(
      Exit.isSuccess(exit) && exit.value.map((change) => change.source?.number),
    ).toEqual([1, 2, 3]);
  });

  it('fails when a change has no last commit', async () => {
    const exit = await run(
      {
        countMergedChanges: twoChanges,
        publicMergedChanges: noPublicChanges,
        privateMergedChanges: () =>
          Effect.succeed(found([{ ...privateNode(), commits: { nodes: [] } }])),
      },
      ['2026-11-07'],
    );

    expect(outcome(exit)).toContain(incomplete);
  });
});

describe('fetchMergedChanges when a check list leaves something out', () => {
  const privateChangeWith = (
    contexts: Contexts,
    commitChecks?: Handlers['commitChecks'],
  ): Handlers => ({
    countMergedChanges: twoChanges,
    publicMergedChanges: noPublicChanges,
    privateMergedChanges: () => Effect.succeed(found([privateNode(contexts)])),
    ...(commitChecks === undefined ? {} : { commitChecks }),
  });

  it('fails when a commit has one passed check and one empty entry', async () => {
    const exit = await run(privateChangeWith(checks([passedCheck, null])), [
      '2026-11-07',
    ]);

    expect(outcome(exit)).toContain(incomplete);
  });

  it('fails when a commit lists fewer checks than it counts', async () => {
    const exit = await run(
      privateChangeWith(checks([passedCheck], lastPage, 2)),
      ['2026-11-07'],
    );

    expect(outcome(exit)).toContain(incomplete);
  });

  it.each([
    ['the commit', { node: null }],
    ['the check list', { node: {} }],
    ['the check list', { node: { statusCheckRollup: null } }],
  ])(
    'fails when %s is gone while a long check list is read',
    async (_what, answer) => {
      const exit = await run(
        privateChangeWith(checks([passedCheck], moreAfter('more'), 2), () =>
          Effect.succeed(answer),
        ),
        ['2026-11-07'],
      );

      expect(outcome(exit)).toContain(incomplete);
    },
  );

  it('judges a commit that no check ran on as before', async () => {
    const exit = await run(
      {
        countMergedChanges: twoChanges,
        publicMergedChanges: noPublicChanges,
        privateMergedChanges: () =>
          Effect.succeed(
            found([
              {
                ...privateNode(),
                commits: {
                  nodes: [
                    {
                      commit: {
                        id: 'commit-id',
                        oid: 'head-sha',
                        statusCheckRollup: null,
                      },
                    },
                  ],
                },
              },
            ]),
          ),
      },
      ['2026-11-07'],
    );

    expect(Exit.isSuccess(exit) && exit.value).toMatchObject([
      { verdict: 'unchecked' },
    ]);
  });
});
