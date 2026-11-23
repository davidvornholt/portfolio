import type { ReactNode } from 'react';
import type {
  FieldModel,
  FieldWindow,
} from '@/features/changes/services/field-model';
import type { WeekCounts } from '@/features/changes/services/weekly-table';
import { formatPostDate } from '@/shared/content/services/format-post-date';
import styles from './change-field.module.css';

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
  { window: 'thirteenWeeks', weeks: 13, className: 'hidden min-[69rem]:inline' },
] as const satisfies ReadonlyArray<
  Readonly<{ window: FieldWindow; weeks: number; className: string }>
>;

const count = (value: number): string => value.toLocaleString('en-US');

const merged = (counts: WeekCounts): number =>
  counts.passed + counts.failed + counts.unchecked;

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
  <span aria-hidden="true" className={styles.key} data-v={verdict} />
);

/**
 * Says in plain words what the chart shows. It is the chart's description
 * for assistive technology too, so it carries the numbers.
 */
export const ChangeLegend = ({
  id,
  model,
}: Readonly<{ id: string; model: FieldModel }>): ReactNode => (
  <>
    <p id={id} className="mt-3 max-w-2xl text-muted-foreground leading-relaxed">
      Every square is one change to my software. Standing on the bar are the{' '}
      <PerWindow
        model={model}
        text={(counts, weeks) =>
          `${count(merged(counts))} that went live in the last ${weeks} weeks`
        }
      />
      :{' '}
      <span className="whitespace-nowrap">
        <Key /> its automated checks had passed,
      </span>{' '}
      <span className="whitespace-nowrap">
        <Key verdict="f" /> a check had failed,
      </span>{' '}
      <span className="whitespace-nowrap">
        <Key verdict="u" /> no check had run.
      </span>{' '}
      Caught in the bar are the{' '}
      <PerWindow model={model} text={(counts) => count(counts.sentBack)} />{' '}
      attempts the checks sent back for more work.
    </p>
    <p className="mt-1.5 max-w-2xl text-muted-foreground text-sm">
      Updated{' '}
      <time dateTime={model.updatedOn}>{formatPostDate(model.updatedOn)}</time>.
      Private projects show only changes that passed, without their names.
    </p>
  </>
);
