import type { ReactNode } from 'react';
import type {
  FieldModel,
  FieldWindow,
} from '@/features/changes/services/field-model';
import type { WeekCounts } from '@/features/changes/services/weekly-table';
import { formatPostDate } from '@/shared/content/services/format-post-date';
import './change-field.css';

// The chart shows four, eight or thirteen weeks by the width of the screen,
// at the same widths as the stylesheet. Each window's numbers are in the
// page, and only the window on screen is displayed.
const windows = [
  { window: 'fourWeeks', weeks: 4, className: 'min-[48rem]:hidden' },
  {
    window: 'eightWeeks',
    weeks: 8,
    className: 'hidden min-[48rem]:inline min-[69rem]:hidden',
  },
  {
    window: 'thirteenWeeks',
    weeks: 13,
    className: 'hidden min-[69rem]:inline',
  },
] as const satisfies ReadonlyArray<
  Readonly<{ window: FieldWindow; weeks: number; className: string }>
>;

const count = (value: number): string => value.toLocaleString('en-US');

const PerWindow = ({
  model,
  text,
}: Readonly<{
  model: FieldModel;
  text: (counts: WeekCounts, weeks: number) => string;
}>): ReactNode =>
  windows.map(({ window, weeks, className }) => (
    <span key={window} className={className}>
      {text(model.counts[window], weeks)}
    </span>
  ));

const Key = ({ verdict }: { readonly verdict?: 'f' | 'u' }): ReactNode => (
  <span aria-hidden="true" className="field-key" data-v={verdict} />
);

// The mark of an attempt that was sent back, on a piece of the bar it hangs
// in, because on paper it would look like nothing in the chart.
const CaughtKey = (): ReactNode => (
  <span aria-hidden="true" className="field-key-bar">
    <span className="field-key" data-v="c" />
  </span>
);

const Row = ({
  mark,
  model,
  pick,
  children,
}: Readonly<{
  mark: ReactNode;
  model: FieldModel;
  pick: (counts: WeekCounts) => number;
  children: ReactNode;
}>): ReactNode => (
  <li className="grid grid-cols-[1.25rem_3rem_1fr] items-baseline gap-x-1.5">
    {mark}
    <strong className="font-semibold text-foreground tabular-nums">
      <PerWindow model={model} text={(counts) => count(pick(counts))} />
    </strong>
    <span>{children}</span>
  </li>
);

/**
 * Says in plain words what each mark of the chart stands for. It is the
 * chart's description for assistive technology too, so it carries the
 * numbers.
 */
export const ChangeLegend = ({
  id,
  model,
}: Readonly<{ id: string; model: FieldModel }>): ReactNode => (
  <>
    <div id={id} className="mt-4 max-w-2xl text-muted-foreground">
      <p>
        One square is one change to my software, from the last{' '}
        <PerWindow model={model} text={(_, weeks) => String(weeks)} /> weeks.
      </p>
      <ul className="mt-2 grid gap-x-8 gap-y-1 sm:grid-cols-2">
        <Row mark={<Key />} model={model} pick={(counts) => counts.passed}>
          went live after their checks passed
        </Row>
        <Row
          mark={<Key verdict="f" />}
          model={model}
          pick={(counts) => counts.failed}
        >
          went live although a check had failed
        </Row>
        <Row
          mark={<Key verdict="u" />}
          model={model}
          pick={(counts) => counts.unchecked}
        >
          went live before a check had run
        </Row>
        <Row
          mark={<CaughtKey />}
          model={model}
          pick={(counts) => counts.sentBack}
        >
          attempts were sent back by the checks. They hang inside the bar.
        </Row>
      </ul>
    </div>
    <p className="mt-2.5 max-w-2xl text-muted-foreground text-sm">
      Updated{' '}
      <time dateTime={model.updatedOn}>{formatPostDate(model.updatedOn)}</time>.
      Private projects show only changes that passed, without their names.
    </p>
  </>
);
