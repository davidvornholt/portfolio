import { describe, expect, it } from 'bun:test';
import { daysEndingOn } from './berlin-day';
import { snapshot } from './load-snapshot';

const thirteenWeeks = 91;

describe('the committed snapshot', () => {
  it('covers thirteen weeks of consecutive days up to its update day', () => {
    expect(snapshot.days.map((day) => day.date)).toEqual([
      ...daysEndingOn(snapshot.updatedOn, thirteenWeeks),
    ]);
  });

  it('holds nothing but the size of a private change', () => {
    const privateChanges = snapshot.days
      .flatMap((day) => day.changes)
      .filter((change) => change.source === null);

    expect(privateChanges.length).toBeGreaterThan(0);
    for (const change of privateChanges) {
      expect(new Set(Object.keys(change))).toEqual(
        new Set(['verdict', 'linesChanged', 'source']),
      );
      expect(change.verdict).toBe('passed');
    }
  });
});
