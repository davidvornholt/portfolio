import { describe, expect, it } from 'bun:test';
import { DateTime, Effect, Exit } from 'effect';
import { GitHubGraphQL } from './github-graphql';
import type { PublicPullRequestNode } from './github-operations';
import { found, publicNode } from './merged-changes-fixtures';
import { fetchSiteRecord } from './repository-records';
import {
  readSiteVerdicts,
  type SiteVerdicts,
  type SiteVerdictsMode,
  siteVerdictsUrl,
} from './site-verdicts';

const fetchedAt = DateTime.makeUnsafe('2026-11-27T12:00:00Z');

// Merged 335 days before the fetch, past the 300 days within which a change
// has to be recorded, and old enough that GitHub may have deleted its checks.
const oldChange = (number: number): PublicPullRequestNode => ({
  ...publicNode(number),
  mergedAt: DateTime.makeUnsafe('2025-12-27T10:00:00Z'),
  statusCheckRollup: null,
});

const siteRecord = (
  nodes: ReadonlyArray<PublicPullRequestNode>,
  recorded: SiteVerdicts,
  mode: SiteVerdictsMode,
) =>
  Effect.runPromiseExit(
    fetchSiteRecord('davidvornholt', 'davidvornholt/portfolio', fetchedAt, {
      recorded,
      mode,
    }).pipe(
      Effect.provide(
        GitHubGraphQL.layerTest({
          countMergedChanges: () =>
            Effect.succeed({ search: { issueCount: nodes.length } }),
          publicMergedChanges: () => Effect.succeed(found(nodes)),
        }),
      ),
    ),
  );

describe('fetchSiteRecord', () => {
  // GitHub deleted the checks of #3, which would now read as unchecked and
  // bring back the sentence that no change had a failed check.
  it('keeps a recorded verdict after the checks behind it are gone', async () => {
    const exit = await siteRecord(
      [oldChange(3), publicNode(9)],
      { changes: [{ number: 3, verdict: 'failed' }] },
      'read',
    );

    expect(exit).toEqual(
      Exit.succeed({
        record: {
          repository: 'davidvornholt/portfolio',
          firstMergedOn: '2025-12-27',
          passed: 1,
          failed: 1,
          unchecked: 0,
        },
        verdicts: {
          changes: [
            { number: 3, verdict: 'failed' },
            { number: 9, verdict: 'passed' },
          ],
        },
      }),
    );
  });

  it('fails in read mode when an old change has no recorded verdict', async () => {
    const exit = await siteRecord(
      [publicNode(9), oldChange(4), oldChange(3)],
      { changes: [] },
      'read',
    );

    expect(Exit.isFailure(exit)).toBe(true);
    const failure = JSON.stringify(exit);
    expect(failure).toContain('SiteVerdictMissingError');
    expect(failure).toContain('#3, #4');
  });

  it('records the verdicts of unrecorded changes in record mode', async () => {
    const exit = await siteRecord(
      [publicNode(9), oldChange(3)],
      { changes: [{ number: 1, verdict: 'passed' }] },
      'record',
    );

    expect(Exit.map(exit, ({ verdicts }) => verdicts)).toEqual(
      Exit.succeed({
        changes: [
          // Kept, although this search didn't return it.
          { number: 1, verdict: 'passed' },
          { number: 3, verdict: 'unchecked' },
          { number: 9, verdict: 'passed' },
        ],
      }),
    );
  });
});

describe('the committed site verdicts', () => {
  it('decode and name each change once, in order', async () => {
    const verdicts = await Effect.runPromise(readSiteVerdicts(siteVerdictsUrl));
    const numbers = verdicts.changes.map((entry) => entry.number);

    expect(numbers.length).toBeGreaterThan(0);
    expect(numbers).toEqual(numbers.toSorted((a, b) => a - b));
    expect(new Set(numbers).size).toBe(numbers.length);
  });
});
