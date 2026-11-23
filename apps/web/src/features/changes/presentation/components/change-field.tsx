import type { CSSProperties, ReactNode } from 'react';
import type { AxisLabel } from '@/features/changes/services/axis-labels';
import type {
  FieldDay,
  FieldModel,
} from '@/features/changes/services/field-model';
import './change-field.css';
import { FieldExplorer } from './field-explorer';

const squaresPerRow = 2;

const rowsOf = (squares: number, columns: number): number =>
  Math.max(1, Math.ceil(squares / (squaresPerRow * columns)));

// A day's width, its place in the load sequence and the rows it stacks are
// numbers worked out from the data, so they reach the stylesheet as custom
// properties.
const dayStyle = (day: FieldDay, index: number, squares: number) =>
  ({
    '--columns-wide': day.columns,
    '--columns-tall': day.columnsTall,
    '--rows-wide': rowsOf(squares, day.columns),
    '--rows-tall': rowsOf(squares, day.columnsTall),
    '--index': index,
  }) as CSSProperties;

const verdictCodes = { passed: '', failed: 'f', unchecked: 'u' } as const;

// One `<i>` per change. The markup is built from counts and verdicts alone,
// never from text, and a string keeps thousands of squares out of React.
const changeSquares = (day: FieldDay): string =>
  day.verdicts
    .map((verdict) =>
      verdict === 'passed'
        ? '<i></i>'
        : `<i data-v="${verdictCodes[verdict]}"></i>`,
    )
    .join('');

const Stack = ({ html }: { readonly html: string }): ReactNode => (
  <div
    className="field-stack"
    // biome-ignore lint/security/noDangerouslySetInnerHtml: the markup is generated from counts and verdict codes, with no text from outside.
    dangerouslySetInnerHTML={{ __html: html }}
  />
);

// The stylesheet shows a label in the windows named here, and draws a month
// with a rule before it.
const Tick = ({ label }: { readonly label: AxisLabel }): ReactNode => (
  <span
    className="field-tick"
    data-kind={label.kind}
    data-windows={label.windows.join(' ')}
  >
    {label.text}
  </span>
);

const Axis = ({ days }: { readonly days: FieldModel['days'] }): ReactNode => (
  <div className="field-days field-axis">
    {days.map((day, index) => (
      <div key={day.date} className="field-day" style={dayStyle(day, index, 0)}>
        {day.labels.map((label) => (
          <Tick key={label.kind} label={label} />
        ))}
        {index === days.length - 1 ? (
          <span className="field-tick field-today">Today</span>
        ) : null}
      </div>
    ))}
  </div>
);

/**
 * The chart of merged changes. The squares are a picture for sighted
 * visitors: the element named by `describedBy` says what it shows, the table
 * below the chart holds the exact counts, and the explorer reads out single
 * changes.
 */
export const ChangeField = ({
  model,
  describedBy,
}: Readonly<{ model: FieldModel; describedBy: string }>): ReactNode => (
  <FieldExplorer describedBy={describedBy}>
    <div
      aria-hidden="true"
      className="field"
      style={
        {
          '--columns-thirteen-weeks': model.columns.thirteenWeeks,
          '--columns-eight-weeks': model.columns.eightWeeks,
          '--columns-four-weeks': model.columns.fourWeeks,
          '--columns-four-weeks-tall': model.columns.fourWeeksTall,
        } as CSSProperties
      }
    >
      <div className="field-days field-above" data-row="above">
        {model.days.map((day, index) => (
          <div
            key={day.date}
            className="field-day"
            data-date={day.date}
            style={dayStyle(day, index, day.verdicts.length)}
          >
            <Stack html={changeSquares(day)} />
          </div>
        ))}
      </div>
      <div className="field-slab">
        <div className="field-days field-inside" data-row="inside">
          {model.days.map((day, index) => (
            <div
              key={day.date}
              className="field-day"
              data-date={day.date}
              style={dayStyle(day, index, day.sentBack)}
            >
              <Stack html={'<i></i>'.repeat(day.sentBack)} />
            </div>
          ))}
        </div>
        <Axis days={model.days} />
      </div>
    </div>
  </FieldExplorer>
);
