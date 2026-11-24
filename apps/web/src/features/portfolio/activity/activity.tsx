'use client';
import { ArrowLeft, ArrowRight, ChevronDown } from 'lucide-react';
import { type PointerEvent, useState } from 'react';
import {
  chartHeight,
  chartWindow,
  desktopWeeks,
  phoneWeeks,
  shortDate,
  updated,
} from './geometry';
import { Plot } from './plot';

const desktop = chartWindow(desktopWeeks);
const phone = chartWindow(phoneWeeks);
const labels: Record<string, string> = {
  passed: 'Passed',
  failed: 'Failed',
  untested: 'No tests',
  ...(desktop.totals.some((row) => row.skipped > 0)
    ? { skipped: 'Skipped' }
    : {}),
};
const firstIndex = (direction: number, count: number) =>
  direction < 0 ? count - 1 : 0;
const fmt = new Intl.NumberFormat('en-US');

const WeeklyTable = ({
  totals,
}: {
  totals: ReturnType<typeof chartWindow>['totals'];
}) => (
  <details className="weekly">
    <summary className="cursor-pointer text-primary">
      Show these numbers as a table <ChevronDown className="inline size-3" />
    </summary>
    <table className="my-3 w-full text-right">
      <caption className="sr-only">Weekly change counts in German time</caption>
      <thead>
        <tr>
          {['Week of', ...Object.values(labels)].map((label) => (
            <th className="p-1" key={label}>
              {label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {totals.map((row) => (
          <tr key={row.date}>
            <th>{shortDate(row.date)}</th>
            <td>{row.passed}</td>
            <td>{row.failed}</td>
            <td>{row.untested}</td>
            {labels.skipped !== undefined && <td>{row.skipped}</td>}
          </tr>
        ))}
      </tbody>
    </table>
  </details>
);
const RecordHeading = ({ weeks, count }: { weeks: number; count: number }) => (
  <header className="flex flex-wrap items-end justify-between gap-3 pt-4">
    <div>
      <p className="folio-label text-welcome">
        My work · {weeks} weeks through {updated}
      </p>
      <h2 className="mt-1 font-normal font-serif text-3xl tracking-tight md:text-4xl">
        {fmt.format(count)} software changes
      </h2>
    </div>
    <div className="flex gap-4 font-mono text-xs">
      {Object.entries(labels).map(([key, label]) => (
        <span className="flex items-center gap-1.5" key={key}>
          <i aria-hidden="true" className="sample" data-result={key} />
          {label}
        </span>
      ))}
    </div>
  </header>
);
const RecordWindow = ({ small }: { readonly small: boolean }) => {
  const { points, days, width, totals } = small ? phone : desktop;
  const [offset, setOffset] = useState<number | null>(null);
  const index = Math.max(0, points.length - 1 - (offset ?? 0));
  const point = points[index];
  const change = point?.change;
  const select = (i: number) => {
    setOffset(points.length - 1 - Math.min(points.length - 1, Math.max(0, i)));
  };
  const pointAt = (event: PointerEvent<SVGSVGElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) * width) / bounds.width;
    const y = ((event.clientY - bounds.top) * chartHeight) / bounds.height;
    let nearest = 0;
    let best = Number.POSITIVE_INFINITY;
    points.forEach((mark, i) => {
      const distance = (mark.x - x) ** 2 + (mark.y - y) ** 2;
      if (distance < best) {
        nearest = i;
        best = distance;
      }
    });
    select(nearest);
  };
  return (
    <section
      aria-label="Software change record"
      className={
        small
          ? 'border-foreground border-t-2 pb-10 sm:hidden'
          : 'hidden border-foreground border-t-2 pb-10 sm:block'
      }
    >
      <RecordHeading
        weeks={small ? phoneWeeks : desktopWeeks}
        count={points.length}
      />
      <p className="mt-2 text-muted-foreground text-sm">
        Each square is one change I made. I group them by day. The shapes show
        which changes passed their automated checks for errors.
      </p>
      <div
        role="slider"
        tabIndex={0}
        aria-label="Inspect changes with the arrow keys"
        aria-valuemin={1}
        aria-valuemax={points.length}
        aria-valuenow={index + 1}
        aria-valuetext={
          change
            ? `${shortDate(change.date)}, ${change.title ?? 'Private change'}, ${labels[change.result]}, ${change.lines} lines`
            : undefined
        }
        onKeyDown={(e) => {
          if (
            [
              'ArrowRight',
              'ArrowUp',
              'ArrowLeft',
              'ArrowDown',
              'Home',
              'End',
            ].includes(e.key)
          ) {
            e.preventDefault();
            if (e.key === 'Home') {
              select(0);
            } else if (e.key === 'End') {
              select(points.length - 1);
            } else {
              select(
                index + (['ArrowLeft', 'ArrowDown'].includes(e.key) ? -1 : 1),
              );
            }
          }
        }}
        className="plot mt-4"
      >
        <Plot
          points={points}
          days={days}
          width={width}
          point={offset === null ? undefined : point}
          pointAt={pointAt}
        />
      </div>
      <div className="flex justify-between border-border border-t py-1 font-mono text-[.66rem] text-muted-foreground">
        {totals.map((week, i) => (
          <span className="flex-1" key={week.date}>
            {small || i % 2 === 0 ? shortDate(week.date) : ''}
          </span>
        ))}
      </div>
      <div className="mt-2 flex min-h-14 items-center justify-between gap-3 bg-secondary px-3">
        <div aria-live="polite" className="py-2 text-sm">
          {offset === null || !change ? (
            <span>
              Point to a square or use the arrows to inspect a change.
            </span>
          ) : (
            <>
              <span className="font-mono text-xs">
                {shortDate(change.date)} · {fmt.format(change.lines)} lines ·{' '}
                {labels[change.result]}
              </span>
              <br />
              {change.url ? (
                <a className="underline" href={change.url}>
                  {change.repo} · {change.title}
                </a>
              ) : (
                'Private change'
              )}
              {change.failed?.map((name) => (
                <span key={name}>
                  {' '}
                  ·{' '}
                  {name.endsWith('command')
                    ? 'The preview deployment failed.'
                    : `The “${name}” check failed.`}
                </span>
              ))}
            </>
          )}
        </div>
        <div className="flex">
          {[-1, 1].map((direction) => (
            <button
              type="button"
              className="grid size-11 place-items-center border border-border hover:bg-background"
              key={direction}
              aria-label={direction < 0 ? 'Previous change' : 'Next change'}
              onClick={() =>
                select(
                  offset === null
                    ? firstIndex(direction, points.length)
                    : index + direction,
                )
              }
            >
              {direction < 0 ? (
                <ArrowLeft size={16} />
              ) : (
                <ArrowRight size={16} />
              )}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-baseline justify-between gap-2 text-muted-foreground text-xs">
        <p>
          Updated {updated}. For private projects, I show only changes that
          passed.
        </p>
        <WeeklyTable totals={totals} />
      </div>
    </section>
  );
};

export const Activity = () => (
  <>
    <RecordWindow small={false} />
    <RecordWindow small={true} />
  </>
);
