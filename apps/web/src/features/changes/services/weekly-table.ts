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
 * The exact counts behind the chart, one row per seven days. The rows end on
 * the snapshot's last day, so the first row is shorter when the days do not
 * divide into whole weeks.
 */
export const weeklyTable = (
  days: ReadonlyArray<SnapshotDay>,
): ReadonlyArray<WeekCounts> => {
  const firstWeekLength = days.length % daysPerWeek;
  const weeks: Array<WeekCounts> = [];
  if (firstWeekLength > 0) {
    weeks.push(countWeek(days.slice(0, firstWeekLength)));
  }
  for (let start = firstWeekLength; start < days.length; start += daysPerWeek) {
    weeks.push(countWeek(days.slice(start, start + daysPerWeek)));
  }
  return weeks;
};

export const totalCounts = (days: ReadonlyArray<SnapshotDay>): WeekCounts =>
  countWeek(days);
