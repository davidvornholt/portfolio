import type { SnapshotDay } from './snapshot';

/** How many rows of squares a day may be tall, above and inside the bar. */
export type FieldLimits = Readonly<{ rowsAbove: number; rowsInside: number }>;

export type FieldDay = SnapshotDay &
  Readonly<{
    /** The day's width in columns. One column is two squares wide. */
    columns: number;
  }>;

const squaresPerColumnRow = 2;

const columnsFor = (squares: number, rows: number): number =>
  Math.ceil(squares / (squaresPerColumnRow * rows));

/**
 * Lays out the last `dayCount` days of a snapshot. A busy day grows wider
 * instead of taller: it takes one more column whenever its squares would
 * exceed the row limit. Every change stays visible and no day towers over the
 * others.
 */
export const layoutField = (
  days: ReadonlyArray<SnapshotDay>,
  dayCount: number,
  limits: FieldLimits,
): ReadonlyArray<FieldDay> =>
  days.slice(-dayCount).map((day) => ({
    ...day,
    columns: Math.max(
      1,
      columnsFor(day.changes.length, limits.rowsAbove),
      columnsFor(day.sentBack.length, limits.rowsInside),
    ),
  }));
