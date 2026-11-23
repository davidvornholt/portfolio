import { describe, expect, it } from 'bun:test';
import { fieldModel, fieldWindows } from './field-model';
import { snapshot } from './load-snapshot';
import type { Snapshot, SnapshotDay } from './snapshot';

const day = (index: number, changes: number, sentBack = 0): SnapshotDay => ({
  date: `day-${index}`,
  changes: Array.from({ length: changes }, () => ({
    verdict: 'passed',
    linesChanged: 1,
    source: null,
  })),
  sentBack: Array.from({ length: sentBack }, () => ({ source: null })),
});

const records = {
  site: {
    repository: 'davidvornholt/portfolio',
    firstMergedOn: '2026-07-10',
    passed: 1,
    failed: 0,
    unchecked: 0,
  },
  elsewhere: [],
} as const;

const thirteenWeeks = (
  changesOn: (index: number) => number,
): Snapshot['days'] => {
  const [first, ...rest] = Array.from({ length: 91 }, (_, index) =>
    day(index, changesOn(index)),
  );
  if (first === undefined) {
    throw new Error('Thirteen weeks have a first day.');
  }
  return [first, ...rest];
};

describe('fieldModel', () => {
  it('counts each window from the same last day', () => {
    const model = fieldModel({
      updatedOn: '2026-11-23',
      days: thirteenWeeks(() => 1),
      ...records,
    });

    expect(model.counts.thirteenWeeks.passed).toBe(91);
    expect(model.counts.eightWeeks.passed).toBe(56);
    expect(model.counts.fourWeeks.passed).toBe(28);
    expect(model.counts.fourWeeks.lastDay).toBe('day-90');
  });

  it('widens a busy day less where days may stack higher', () => {
    const model = fieldModel({
      updatedOn: '2026-11-23',
      days: thirteenWeeks((index) => (index === 90 ? 70 : 1)),
      ...records,
    });

    expect(model.days.at(-1)).toMatchObject({ columns: 2, columnsTall: 1 });
    expect(model.columns).toEqual({
      thirteenWeeks: 92,
      eightWeeks: 57,
      fourWeeks: 29,
      fourWeeksTall: 28,
    });
  });

  it('keeps every change of the committed snapshot', () => {
    const model = fieldModel(snapshot);

    expect(model.days).toHaveLength(fieldWindows.thirteenWeeks.days);
    expect(model.days.flatMap((entry) => entry.verdicts)).toHaveLength(
      snapshot.days.flatMap((entry) => entry.changes).length,
    );
  });
});
