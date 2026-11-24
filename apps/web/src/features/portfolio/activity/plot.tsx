import type { PointerEvent } from 'react';
import {
  cellCenter,
  chartHeight,
  type chartWindow,
  columnWidth,
} from './geometry';

const denseDay = 40;
const labelGap = 10;
const slotWidth = 0.68;
const slotHeight = 0.24;
type PlotProps = Pick<
  ReturnType<typeof chartWindow>,
  'points' | 'days' | 'width'
> & {
  point: ReturnType<typeof chartWindow>['points'][number] | undefined;
  pointAt: (event: PointerEvent<SVGSVGElement>) => void;
};
const box = (x: number, y: number, w: number, h: number) =>
  `M${x.toFixed(2)} ${y.toFixed(2)}h${w.toFixed(2)}v${h.toFixed(2)}h${(-w).toFixed(2)}Z`;
const Marks = ({ points }: Pick<PlotProps, 'points'>) => {
  const paths = new Map<string, Array<string>>();
  for (const { x, y, size, change } of points) {
    const shapes = paths.get(change.result) ?? [];
    shapes.push(box(x - size / 2, y - size / 2, size, size));
    if (change.result === 'failed') {
      const w = size * slotWidth;
      const h = size * slotHeight;
      shapes.push(box(x - w / 2, y - h / 2, w, h));
    }
    paths.set(change.result, shapes);
  }
  return Array.from(paths, ([result, shapes]) => (
    <path
      key={result}
      data-result={result}
      fillRule="evenodd"
      d={shapes.join('')}
    />
  ));
};
export const Plot = ({ points, days, width, point, pointAt }: PlotProps) => (
  <svg
    viewBox={`0 0 ${width} ${chartHeight}`}
    preserveAspectRatio="none"
    aria-hidden="true"
    className="block w-full"
    onPointerMove={(e) => {
      if (e.pointerType === 'mouse') {
        pointAt(e);
      }
    }}
    onPointerDown={pointAt}
  >
    <title>Software changes by day</title>
    {days.map((day, i) =>
      day.entries.length >= denseDay ? (
        <text
          key={day.date}
          x={(i + cellCenter) * columnWidth}
          y={chartHeight - labelGap - day.height}
          textAnchor="middle"
          fill="var(--muted-foreground)"
          fontSize="9"
        >
          {day.entries.length}
        </text>
      ) : null,
    )}
    <Marks points={points} />
    {point !== undefined && (
      <circle
        cx={point.x}
        cy={point.y}
        r={point.size / 2 + 2}
        fill="none"
        stroke="var(--foreground)"
      />
    )}
  </svg>
);
