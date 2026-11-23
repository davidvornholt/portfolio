import { describe, expect, it } from 'bun:test';
import { layoutField } from './field-layout';
import type { SnapshotDay } from './snapshot';

const day = (date: string, changes: number, sentBack = 0): SnapshotDay => ({
  date,
  changes: Array.from({ length: changes }, () => ({
    verdict: 'passed',
    linesChanged: 1,
    source: null,
  })),
  sentBack: Array.from({ length: sentBack }, () => ({ source: null })),
});

const limits = { rowsAbove: 28, rowsInside: 10 };

describe('layoutField', () => {
  it('keeps the last days of the snapshot', () => {
    const field = layoutField(
      [day('2026-11-21', 1), day('2026-11-22', 2), day('2026-11-23', 3)],
      2,
      limits,
    );

    expect(field.map((entry) => entry.date)).toEqual([
      '2026-11-22',
      '2026-11-23',
    ]);
  });

  it.each([
    [0, 1],
    [56, 1],
    [57, 2],
    [112, 2],
    [187, 4],
  ])('gives a day with %d changes %d columns', (changes, columns) => {
    expect(
      layoutField([day('2026-11-23', changes)], 1, limits)[0]?.columns,
    ).toBe(columns);
  });

  it('widens a quiet day whose sent-back attempts need the room', () => {
    expect(layoutField([day('2026-11-23', 3, 36)], 1, limits)[0]?.columns).toBe(
      2,
    );
  });
});
