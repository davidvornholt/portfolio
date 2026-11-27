import { describe, expect, it } from 'bun:test';
import type { SnapshotChange, SnapshotDay } from './snapshot';
import { totalCounts, weeklyTable } from './weekly-table';

const change = (verdict: SnapshotChange['verdict']): SnapshotChange =>
  verdict === 'passed'
    ? { verdict, linesChanged: 1, source: null }
    : {
        verdict,
        linesChanged: 1,
        source: {
          repository: 'davidvornholt/standards',
          number: 1,
          title: 'change',
          url: 'https://example',
          failedChecks: [],
        },
      };

const day = (
  index: number,
  verdicts: ReadonlyArray<SnapshotChange['verdict']>,
  sentBack = 0,
): SnapshotDay => ({
  date: `2026-11-${String(index).padStart(2, '0')}`,
  changes: verdicts.map(change),
  sentBack: Array.from({ length: sentBack }, () => ({ source: null })),
});

describe('weeklyTable', () => {
  it('counts each seven days and ends on the last day', () => {
    const days = Array.from({ length: 14 }, (_, index) =>
      day(index + 1, index < 7 ? ['passed'] : ['passed', 'failed'], 1),
    );

    expect(weeklyTable(days)).toEqual([
      {
        firstDay: '2026-11-01',
        lastDay: '2026-11-07',
        passed: 7,
        failed: 0,
        unchecked: 0,
        sentBack: 7,
      },
      {
        firstDay: '2026-11-08',
        lastDay: '2026-11-14',
        passed: 7,
        failed: 7,
        unchecked: 0,
        sentBack: 7,
      },
    ]);
  });

  it('starts with a shorter row when the days are not whole weeks', () => {
    const days = Array.from({ length: 9 }, (_, index) =>
      day(index + 1, ['unchecked']),
    );

    expect(
      weeklyTable(days).map((week) => [
        week.firstDay,
        week.lastDay,
        week.unchecked,
      ]),
    ).toEqual([
      ['2026-11-01', '2026-11-02', 2],
      ['2026-11-03', '2026-11-09', 7],
    ]);
  });
});

describe('totalCounts', () => {
  it('adds up every day', () => {
    expect(
      totalCounts([
        day(1, ['passed', 'passed', 'failed'], 2),
        day(2, ['unchecked'], 1),
      ]),
    ).toEqual({
      firstDay: '2026-11-01',
      lastDay: '2026-11-02',
      passed: 2,
      failed: 1,
      unchecked: 1,
      sentBack: 3,
    });
  });
});
