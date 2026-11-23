/** The three windows an axis label can belong to, narrowest first. */
export const axisWindows = {
  fourWeeks: 28,
  eightWeeks: 56,
  thirteenWeeks: 91,
} as const;

export type AxisWindow = keyof typeof axisWindows;

export type AxisLabel = Readonly<{
  kind: 'start' | 'month';
  text: string;
  /** The windows in which the label has room. */
  windows: ReadonlyArray<AxisWindow>;
}>;

// A month label needs this many days of room after the window's first day,
// whose date is printed there, and before its last day, which says "Today".
const daysAfterStart = 6;
const daysBeforeEnd = 5;

const asUtcDate = (day: string): Date => new Date(`${day}T00:00:00Z`);

const startText = (day: string): string =>
  asUtcDate(day).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });

const monthText = (day: string): string =>
  asUtcDate(day).toLocaleDateString('en-US', {
    month: 'long',
    timeZone: 'UTC',
  });

const windowNames = Object.keys(axisWindows) as ReadonlyArray<AxisWindow>;

/**
 * The labels under each day of the chart, oldest day first. Each window
 * prints the date of its first day, and the name of a month where one begins
 * with room to spare.
 */
export const axisLabels = (
  days: ReadonlyArray<string>,
): ReadonlyArray<ReadonlyArray<AxisLabel>> =>
  days.map((day, index) => {
    const starts = windowNames.filter(
      (window) => index === days.length - axisWindows[window],
    );
    const months = day.endsWith('-01')
      ? windowNames.filter((window) => {
          const first = days.length - axisWindows[window];
          return (
            index - first >= daysAfterStart &&
            days.length - 1 - index >= daysBeforeEnd
          );
        })
      : [];
    return [
      ...(starts.length > 0
        ? [{ kind: 'start', text: startText(day), windows: starts } as const]
        : []),
      ...(months.length > 0
        ? [{ kind: 'month', text: monthText(day), windows: months } as const]
        : []),
    ];
  });
