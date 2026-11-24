import { describe, expect, it } from 'bun:test';
import { cardSkyline } from './card-skyline';
import type { SnapshotDay } from './snapshot';

const day = (index: number, changes: number): SnapshotDay => ({
  date: `2026-11-${String(index).padStart(2, '0')}`,
  changes: Array.from({ length: changes }, () => ({
    verdict: 'passed' as const,
    linesChanged: 1,
    source: null,
  })),
  sentBack: [],
});

describe('cardSkyline', () => {
  it('gives each week one square per forty changes', () => {
    const days = [
      ...Array.from({ length: 7 }, (_, index) => day(index + 1, 20)),
      ...Array.from({ length: 7 }, (_, index) => day(index + 8, 40)),
    ];

    expect(cardSkyline(days)).toEqual([4, 7]);
  });

  it('keeps one square for a quiet week and none for an empty one', () => {
    const days = [
      ...Array.from({ length: 7 }, (_, index) =>
        day(index + 1, index === 0 ? 3 : 0),
      ),
      ...Array.from({ length: 7 }, (_, index) => day(index + 8, 0)),
    ];

    expect(cardSkyline(days)).toEqual([1, 0]);
  });
});
