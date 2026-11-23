import type { ReactNode } from 'react';
import { loopGrowth, loopRun } from './loop-growth-data';

const minutesPerHour = 60;
const totalMinutes = loopRun.stoppedAfterHours * minutesPerHour;
const topLines = 40_000;
const lineStep = 10_000;
const lineMarks = [lineStep, lineStep * 2, lineStep + lineStep * 2] as const;
const hourStep = 12;
const hourMarks = [
  0,
  hourStep,
  hourStep * 2,
  hourStep + hourStep * 2,
  loopRun.stoppedAfterHours,
] as const;

// Distances in the notes, as multiples of the font size.
const lineHeight = 1.35;
const noteGap = 0.7;
const leaderGap = 1.4;

// The chart is drawn twice, because text in a drawing shrinks with it: once
// for a wide column and once for a phone.
type Geometry = Readonly<{
  size: 'wide' | 'narrow';
  width: number;
  height: number;
  left: number;
  right: number;
  top: number;
  bottom: number;
  font: number;
  /** The least height of the band of kept lines, so that it can be seen. */
  band: number;
  /** The height, in lines, at which the note on the kept lines stands. */
  keptNote: number;
}>;

const wide: Geometry = {
  size: 'wide',
  width: 960,
  height: 420,
  left: 64,
  right: 8,
  top: 40,
  bottom: 36,
  font: 15,
  band: 3,
  keptNote: 21_000,
};

const narrow: Geometry = {
  size: 'narrow',
  width: 360,
  height: 330,
  left: 46,
  right: 4,
  top: 34,
  bottom: 30,
  font: 12,
  band: 3,
  keptNote: 34_500,
};

const fixed = (value: number): string => value.toFixed(1);

const xOf = (geometry: Geometry, minutes: number): number =>
  geometry.left +
  (minutes / totalMinutes) * (geometry.width - geometry.left - geometry.right);

const yOf = (geometry: Geometry, lines: number): number =>
  geometry.height -
  geometry.bottom -
  (lines / topLines) * (geometry.height - geometry.top - geometry.bottom);

/** The size of the change over time: level until a commit, then a step. */
const stepPath = (geometry: Geometry): string => {
  const [first = [0, 0] as const, ...rest] = loopGrowth;
  const steps = rest.map(
    ([minutes, lines]) =>
      `H${fixed(xOf(geometry, minutes))}V${fixed(yOf(geometry, lines))}`,
  );
  return `M${fixed(xOf(geometry, 0))} ${fixed(yOf(geometry, first[1]))}${steps.join('')}H${fixed(xOf(geometry, totalMinutes))}`;
};

const count = (value: number): string => value.toLocaleString('en-US');

const hourLabel = (hour: number): string =>
  hour === 0 ? 'Start' : `${hour} h`;

const Axes = ({ geometry }: { readonly geometry: Geometry }): ReactNode => (
  <g fontSize={geometry.font} className="fill-muted-foreground">
    {lineMarks.map((lines) => (
      <g key={lines}>
        <line
          x1={geometry.left}
          x2={geometry.width - geometry.right}
          y1={yOf(geometry, lines)}
          y2={yOf(geometry, lines)}
          className="stroke-border"
        />
        <text
          x={geometry.left - geometry.font / 2}
          y={yOf(geometry, lines)}
          textAnchor="end"
          dominantBaseline="middle"
        >
          {count(lines)}
        </text>
      </g>
    ))}
    {hourMarks.map((hour) => (
      <text
        key={hour}
        x={xOf(geometry, hour * minutesPerHour)}
        y={geometry.height - geometry.bottom + geometry.font * 2}
        textAnchor={hour === loopRun.stoppedAfterHours ? 'end' : 'start'}
      >
        {hourLabel(hour)}
      </text>
    ))}
  </g>
);

/** The labels on the three points the article talks about. */
const Notes = ({ geometry }: { readonly geometry: Geometry }): ReactNode => {
  const line = geometry.font * lineHeight;
  const keptX = xOf(geometry, loopRun.kept.afterMinutes);
  const keptY = yOf(geometry, geometry.keptNote);
  const foot = geometry.font / 2;
  const repairX =
    xOf(geometry, loopRun.largestRepair.afterMinutes) + geometry.font * noteGap;
  const repairY = yOf(geometry, topLines / 2) + line * 2;
  return (
    <g fontSize={geometry.font} className="fill-foreground font-semibold">
      <line
        x1={keptX}
        x2={keptX}
        y1={keptY + line * leaderGap}
        y2={yOf(geometry, loopRun.kept.lines)}
        className="stroke-foreground"
      />
      <rect
        x={keptX - foot / 2}
        y={yOf(geometry, loopRun.kept.lines) - foot}
        width={foot}
        height={foot}
      />
      <text x={keptX - 1} y={keptY}>
        After {loopRun.kept.afterMinutes} minutes: {loopRun.kept.lines} lines.
      </text>
      <text x={keptX - 1} y={keptY + line}>
        Nothing written later was kept.
      </text>
      <text x={repairX} y={repairY}>
        Round 17: one finding,
      </text>
      <text x={repairX} y={repairY + line}>
        {count(loopRun.largestRepair.lines)} new lines
      </text>
      <text
        x={geometry.width - geometry.right}
        y={yOf(geometry, loopRun.finalLines) - geometry.font * noteGap}
        textAnchor="end"
      >
        Stopped by hand at {count(loopRun.finalLines)} lines
      </text>
    </g>
  );
};

const Drawing = ({ geometry }: { readonly geometry: Geometry }): ReactNode => {
  const path = stepPath(geometry);
  const floor = yOf(geometry, 0);
  const keptHeight = Math.max(
    geometry.band,
    floor - yOf(geometry, loopRun.kept.lines),
  );
  return (
    <svg
      viewBox={`0 0 ${geometry.width} ${geometry.height}`}
      className={
        geometry.size === 'wide'
          ? 'hidden h-auto w-full md:block'
          : 'block h-auto w-full md:hidden'
      }
    >
      <title>
        The change grows from 179 added lines to 37,451 in 46 hours. After 23
        minutes it has 217 lines, which is all that was kept.
      </title>
      <Axes geometry={geometry} />
      <path
        d={`${path}V${fixed(floor)}H${fixed(xOf(geometry, 0))}Z`}
        className="fill-foreground/20"
      />
      <path
        d={path}
        fill="none"
        className="stroke-foreground"
        strokeWidth={2}
        strokeLinejoin="miter"
      />
      <rect
        x={xOf(geometry, 0)}
        y={floor - keptHeight}
        width={xOf(geometry, totalMinutes) - xOf(geometry, 0)}
        height={keptHeight}
        className="fill-foreground"
      />
      <Notes geometry={geometry} />
    </svg>
  );
};

/**
 * How the change grew while the review loop ran: grey is what was written
 * and thrown away, and the black band at the bottom is what was kept.
 */
export const LoopGrowthChart = (): ReactNode => (
  <>
    <Drawing geometry={wide} />
    <Drawing geometry={narrow} />
  </>
);
