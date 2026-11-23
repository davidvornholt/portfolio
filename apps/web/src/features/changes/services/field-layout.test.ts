import { describe, expect, it } from 'bun:test';
import { dayColumns } from './field-layout';
import type { SnapshotDay } from './snapshot';

const day = (changes: number, sentBack = 0): SnapshotDay => ({
  date: '2026-11-23',
  changes: Array.from({ length: changes }, () => ({
    verdict: 'passed',
    linesChanged: 1,
    source: null,
  })),
  sentBack: Array.from({ length: sentBack }, () => ({ source: null })),
});

const limits = { rowsAbove: 28, rowsInside: 10 };

describe('dayColumns', () => {
  it.each([
    [0, 1],
    [56, 1],
    [57, 2],
    [112, 2],
    [187, 4],
  ])('gives a day with %d changes %d columns', (changes, columns) => {
    expect(dayColumns(day(changes), limits)).toBe(columns);
  });

  it('widens a quiet day whose sent-back attempts need the room', () => {
    expect(dayColumns(day(3, 36), limits)).toBe(2);
  });
});
