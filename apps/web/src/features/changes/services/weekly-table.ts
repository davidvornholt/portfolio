import type { SnapshotChange, SnapshotDay } from './snapshot';

export type WeekCounts = Readonly<{
  firstDay: string;
  lastDay: string;
  passed: number;
  failed: number;
  unchecked: number;
  sentBack: number;
}>;

const daysPerWeek = 7;

const countWeek = (days: ReadonlyArray<SnapshotDay>): WeekCounts => {
  const changes = days.flatMap((day) => day.changes);
  const count = (verdict: SnapshotChange['verdict']): number =>
    changes.filter((change) => change.verdict === verdict).length;
  return {
    firstDay: days[0]?.date ?? '',
    lastDay: days.at(-1)?.date ?? '',
    passed: count('passed'),
    failed: count('failed'),
    unchecked: count('unchecked'),
    sentBack: days.reduce((sum, day) => sum + day.sentBack.length, 0),
  };
};

/**
 * The days in rows of seven. The rows end on the last day, so the first row
 * is shorter when the days do not divide into whole weeks.
 */
export const weeksOf = (
  days: ReadonlyArray<SnapshotDay>,
): ReadonlyArray<ReadonlyArray<SnapshotDay>> => {
  const firstWeekLength = days.length % daysPerWeek;
  const weeks: Array<ReadonlyArray<SnapshotDay>> = [];
  if (firstWeekLength > 0) {
    weeks.push(days.slice(0, firstWeekLength));
  }
  for (let start = firstWeekLength; start < days.length; start += daysPerWeek) {
    weeks.push(days.slice(start, start + daysPerWeek));
  }
  return weeks;
};

/** The exact counts behind the chart, one row per seven days. */
export const weeklyTable = (
  days: ReadonlyArray<SnapshotDay>,
): ReadonlyArray<WeekCounts> => weeksOf(days).map(countWeek);

export const totalCounts = (days: ReadonlyArray<SnapshotDay>): WeekCounts =>
  countWeek(days);
