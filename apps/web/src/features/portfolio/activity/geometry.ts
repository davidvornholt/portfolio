import snapshot from './snapshot.json' with { type: 'json' };

export type Change = {
  date: string;
  lines: number;
  result: string;
  repo?: string;
  title?: string;
  url?: string;
  failed?: Array<string>;
};
const changes: ReadonlyArray<Change> = snapshot.changes;
if (changes.length === 0 || changes.length !== snapshot.count) {
  throw new Error('The complete activity snapshot is required.');
}
const dayFormat = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC',
});
export const shortDate = (date: string) => dayFormat.format(new Date(date));
const dayMs = 86_400_000;
export const chartHeight = 142;
export const columnWidth = 12;
const maxHeight = 116;
export const desktopWeeks = 13;
export const phoneWeeks = 4;
const weekDays = 7;
const dateLength = 10;
export const cellCenter = 0.5;
const laneWidth = 10;
const markFill = 0.83;
export const bottomInset = 5;
export const chartWindow = (weeks: number) => {
  const days = Array.from({ length: weeks * weekDays }, (_, index) => {
    const date = new Date(
      Date.parse(snapshot.end) - (weeks * weekDays - index - 1) * dayMs,
    )
      .toISOString()
      .slice(0, dateLength);
    return { date, entries: changes.filter((change) => change.date === date) };
  });
  const busiest = Math.max(1, ...days.map((day) => day.entries.length));
  const stackHeight = (count: number) => maxHeight * Math.sqrt(count / busiest);
  const points = days.flatMap(({ entries }, day) => {
    const height = stackHeight(entries.length);
    // Fold busy stacks into narrow lanes. Every change keeps its own square.
    const lanes = Math.max(
      1,
      Math.ceil(Math.sqrt((entries.length * laneWidth) / height) || 0),
    );
    const rows = Math.ceil(entries.length / lanes);
    const pitch = Math.min(laneWidth, height / rows);
    const size = Math.min(pitch, laneWidth / lanes) * markFill;
    return entries.map((change, index) => ({
      change,
      x:
        day * columnWidth +
        1 +
        (((index % lanes) + cellCenter) * laneWidth) / lanes,
      y:
        chartHeight -
        bottomInset -
        (Math.floor(index / lanes) + cellCenter) * pitch,
      size,
    }));
  });
  const totals = Array.from({ length: weeks }, (_, index) => {
    const week = days.slice(index * weekDays, index * weekDays + weekDays);
    const entries = week.flatMap((day) => day.entries);
    return {
      date: week[0]?.date ?? '',
      passed: entries.filter((c) => c.result === 'passed').length,
      failed: entries.filter((c) => c.result === 'failed').length,
      skipped: entries.filter((c) => c.result === 'skipped').length,
      untested: entries.filter((c) => c.result === 'untested').length,
    };
  });
  return {
    points,
    days: days.map((day) => ({
      ...day,
      height: stackHeight(day.entries.length),
    })),
    totals,
    width: days.length * columnWidth,
  };
};
export const updated = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'medium',
  timeZone: 'UTC',
}).format(new Date(snapshot.end));
