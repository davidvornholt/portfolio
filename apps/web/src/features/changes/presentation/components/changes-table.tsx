import type { ReactNode } from 'react';
import type { WeekCounts } from '@/features/changes/services/weekly-table';

const count = (value: number): string => value.toLocaleString('en-US');

const day = (date: string): string =>
  new Date(`${date}T00:00:00Z`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });

const columns = [
  ['Checks passed', 'passed'],
  ['A check failed', 'failed'],
  ['No check ran', 'unchecked'],
  ['Sent back', 'sentBack'],
] as const;

const cellClassName = 'px-3 py-2 text-right tabular-nums';

/**
 * The exact numbers behind the chart, one row per week. It opens from a
 * plain disclosure, so it works without JavaScript.
 */
export const ChangesTable = ({
  weeks,
  total,
}: Readonly<{ weeks: ReadonlyArray<WeekCounts>; total: WeekCounts }>): ReactNode => (
  <details className="mt-3 max-w-2xl text-sm">
    <summary className="w-fit cursor-pointer font-semibold underline decoration-2 underline-offset-4 hover:decoration-4">
      Show the numbers as a table
    </summary>
    <div className="mt-4 overflow-x-auto">
      <table className="w-full border-collapse text-left">
        <caption className="sr-only">
          Changes that went live and attempts that were sent back, per week
        </caption>
        <thead>
          <tr className="border-foreground border-b-2">
            <th scope="col" className="py-2 pr-3 font-semibold">
              Week
            </th>
            {columns.map(([label]) => (
              <th
                key={label}
                scope="col"
                className={`${cellClassName} font-semibold`}
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week) => (
            <tr key={week.firstDay} className="border-border border-b">
              <th scope="row" className="whitespace-nowrap py-2 pr-3 font-normal">
                {day(week.firstDay)} to {day(week.lastDay)}
              </th>
              {columns.map(([label, key]) => (
                <td key={label} className={cellClassName}>
                  {count(week[key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="font-semibold">
            <th scope="row" className="py-2 pr-3">
              All thirteen weeks
            </th>
            {columns.map(([label, key]) => (
              <td key={label} className={cellClassName}>
                {count(total[key])}
              </td>
            ))}
          </tr>
        </tfoot>
      </table>
    </div>
  </details>
);
