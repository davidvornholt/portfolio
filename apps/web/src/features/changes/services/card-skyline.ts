import type { SnapshotDay } from './snapshot';
import { weeksOf } from './weekly-table';

// A social card has room for a few squares per column, so one square stands
// for this many changes.
const changesPerSquare = 40;

/**
 * The chart in the small: how many squares stand in each week's column on a
 * social card, oldest week first. A week with any change keeps one square.
 */
export const cardSkyline = (
  days: ReadonlyArray<SnapshotDay>,
): ReadonlyArray<number> =>
  weeksOf(days).map((week) => {
    const changes = week.reduce((sum, day) => sum + day.changes.length, 0);
    return changes === 0
      ? 0
      : Math.max(1, Math.round(changes / changesPerSquare));
  });
