import type { SnapshotDay } from './snapshot';

/** How many rows of squares a day may be tall, on the bar and inside it. */
export type FieldLimits = Readonly<{ rowsAbove: number; rowsInside: number }>;

const squaresPerColumnRow = 2;

const columnsFor = (squares: number, rows: number): number =>
  Math.ceil(squares / (squaresPerColumnRow * rows));

/**
 * A day's width in columns, each two squares wide. A busy day grows wider
 * instead of taller: it takes one more column whenever its squares would
 * exceed the row limit. Every change stays visible and no day towers over the
 * others.
 */
export const dayColumns = (day: SnapshotDay, limits: FieldLimits): number =>
  Math.max(
    1,
    columnsFor(day.changes.length, limits.rowsAbove),
    columnsFor(day.sentBack.length, limits.rowsInside),
  );
