import { type AxisLabel, axisLabels } from './axis-labels';
import { dayColumns, type FieldLimits } from './field-layout';
import type { Snapshot, SnapshotChange, SnapshotDay } from './snapshot';
import { totalCounts, type WeekCounts } from './weekly-table';

/**
 * The windows the chart shows, by how much room the screen has. `tall` is the
 * four-week window on a phone, where days may stack higher because the
 * screen is taller than it is wide.
 */
export const fieldWindows = {
  thirteenWeeks: { days: 91, limits: { rowsAbove: 28, rowsInside: 10 } },
  eightWeeks: { days: 56, limits: { rowsAbove: 28, rowsInside: 10 } },
  fourWeeks: { days: 28, limits: { rowsAbove: 28, rowsInside: 10 } },
  fourWeeksTall: { days: 28, limits: { rowsAbove: 40, rowsInside: 12 } },
} as const satisfies Record<
  string,
  Readonly<{ days: number; limits: FieldLimits }>
>;

export type FieldWindow = keyof typeof fieldWindows;

export type FieldDay = Readonly<{
  date: string;
  /** One verdict per change, in merge order. */
  verdicts: ReadonlyArray<SnapshotChange['verdict']>;
  sentBack: number;
  columns: number;
  columnsTall: number;
  labels: ReadonlyArray<AxisLabel>;
}>;

export type FieldModel = Readonly<{
  updatedOn: string;
  /** Oldest first, for the widest window. */
  days: ReadonlyArray<FieldDay>;
  /** The columns each window's days take together. */
  columns: Readonly<Record<FieldWindow, number>>;
  counts: Readonly<Record<FieldWindow, WeekCounts>>;
}>;

const windowNames = Object.keys(fieldWindows) as ReadonlyArray<FieldWindow>;

const inWindow = (
  days: ReadonlyArray<SnapshotDay>,
  window: FieldWindow,
): ReadonlyArray<SnapshotDay> => days.slice(-fieldWindows[window].days);

const perWindow = <A>(
  measure: (window: FieldWindow) => A,
): Readonly<Record<FieldWindow, A>> =>
  Object.fromEntries(
    windowNames.map((window) => [window, measure(window)]),
  ) as Record<FieldWindow, A>;

/** Everything the chart draws, worked out from the snapshot once per build. */
export const fieldModel = (snapshot: Snapshot): FieldModel => {
  const days = inWindow(snapshot.days, 'thirteenWeeks');
  const labels = axisLabels(days.map((day) => day.date));
  return {
    updatedOn: snapshot.updatedOn,
    days: days.map((day, index) => ({
      date: day.date,
      verdicts: day.changes.map((change) => change.verdict),
      sentBack: day.sentBack.length,
      columns: dayColumns(day, fieldWindows.thirteenWeeks.limits),
      columnsTall: dayColumns(day, fieldWindows.fourWeeksTall.limits),
      labels: labels[index] ?? [],
    })),
    columns: perWindow((window) =>
      inWindow(days, window).reduce(
        (sum, day) => sum + dayColumns(day, fieldWindows[window].limits),
        0,
      ),
    ),
    counts: perWindow((window) => totalCounts(inWindow(days, window))),
  };
};
