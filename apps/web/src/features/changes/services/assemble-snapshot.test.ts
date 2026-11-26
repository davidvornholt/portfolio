import { describe, expect, it } from 'bun:test';
import { DateTime } from 'effect';
import {
  assembleSnapshot,
  type FailedAttempt,
  type MergedChange,
} from './assemble-snapshot';
import { decodeSnapshot } from './snapshot';

const at = (instant: string): DateTime.Utc => DateTime.makeUnsafe(instant);

const publicChange = (
  mergedAt: string,
  title: string,
  verdict: MergedChange['verdict'] = 'passed',
): MergedChange => ({
  mergedAt: at(mergedAt),
  linesChanged: 12,
  verdict,
  failedChecks: verdict === 'failed' ? ['check'] : [],
  source: {
    repository: 'davidvornholt/standards',
    number: 7,
    title,
    url: 'https://github.com/davidvornholt/standards/pull/7',
  },
});

const privateChange = (
  mergedAt: string,
  verdict: MergedChange['verdict'],
): MergedChange => ({
  mergedAt: at(mergedAt),
  linesChanged: 40,
  verdict,
  failedChecks: verdict === 'failed' ? ['check'] : [],
  source: undefined,
});

const fetchedAt = at('2026-11-23T05:00:00Z');

const assemble = (
  changes: ReadonlyArray<MergedChange>,
  attempts: ReadonlyArray<FailedAttempt> = [],
) =>
  assembleSnapshot({
    fetchedAt,
    dayCount: 3,
    changes,
    attempts,
    site: {
      repository: 'davidvornholt/portfolio',
      firstMergedOn: '2026-07-10',
      passed: 70,
      failed: 0,
      unchecked: 1,
    },
    elsewhere: [{ repository: 'serokell/deploy-rs', changes: 1 }],
  });

describe('assembleSnapshot', () => {
  it('covers the days that end on the German day of the fetch', () => {
    const snapshot = assemble([]);

    expect(snapshot.updatedOn).toBe('2026-11-23');
    expect(snapshot.days.map((day) => day.date)).toEqual([
      '2026-11-21',
      '2026-11-22',
      '2026-11-23',
    ]);
  });

  it('puts each change on its German day, in merge order', () => {
    const snapshot = assemble([
      publicChange('2026-11-22T23:30:00Z', 'after midnight in Germany'),
      publicChange('2026-11-22T10:00:00Z', 'second'),
      publicChange('2026-11-22T09:00:00Z', 'first'),
    ]);

    expect(
      snapshot.days.map((day) =>
        day.changes.map((change) => change.source?.title),
      ),
    ).toEqual([[], ['first', 'second'], ['after midnight in Germany']]);
  });

  it('leaves out changes that merged outside the window', () => {
    const snapshot = assemble([publicChange('2026-11-20T10:00:00Z', 'older')]);

    expect(snapshot.days.flatMap((day) => day.changes)).toEqual([]);
  });

  it('publishes a private change only when it passed, and only its size', () => {
    const snapshot = assemble([
      privateChange('2026-11-22T09:00:00Z', 'passed'),
      privateChange('2026-11-22T10:00:00Z', 'failed'),
      privateChange('2026-11-22T11:00:00Z', 'unchecked'),
    ]);

    expect(snapshot.days.flatMap((day) => day.changes)).toEqual([
      { verdict: 'passed', linesChanged: 40, source: null },
    ]);
  });

  it('keeps a failed public change with the checks that failed', () => {
    const snapshot = assemble([
      publicChange('2026-11-22T09:00:00Z', 'red', 'failed'),
    ]);

    expect(snapshot.days[1]?.changes[0]).toMatchObject({
      verdict: 'failed',
      source: { failedChecks: ['check'] },
    });
  });

  it('lists sent-back attempts by the day they started, private ones bare', () => {
    const snapshot = assemble(
      [],
      [
        { startedAt: at('2026-11-23T04:00:00Z'), source: undefined },
        {
          startedAt: at('2026-11-23T03:00:00Z'),
          source: {
            repository: 'davidvornholt/standards',
            workflow: 'Standards',
            title: 'fix(sync): keep the lock',
            url: 'https://github.com/davidvornholt/standards/actions/runs/1',
          },
        },
      ],
    );

    expect(snapshot.days[2]?.sentBack).toEqual([
      {
        source: {
          repository: 'davidvornholt/standards',
          workflow: 'Standards',
          title: 'fix(sync): keep the lock',
          url: 'https://github.com/davidvornholt/standards/actions/runs/1',
        },
      },
      { source: null },
    ]);
  });

  it('produces a snapshot that its own schema accepts', () => {
    const snapshot = assemble([
      publicChange('2026-11-22T09:00:00Z', 'first'),
      privateChange('2026-11-22T10:00:00Z', 'passed'),
    ]);

    expect(decodeSnapshot(snapshot)).toEqual(snapshot);
  });
});
