import type { ReactNode } from 'react';
import { studyWorkflows } from './study-data';
import { StudyFigure } from './study-outcomes';

const chartWidth = 600;
const maximumCost = 60;

const CostBar = ({
  label,
  value,
  partial,
}: Readonly<{
  label: string;
  value: number;
  partial: boolean;
}>): ReactNode => {
  const width = (value / maximumCost) * chartWidth;
  const formattedCost = `${partial ? 'At least ' : ''}$${value.toFixed(2)}`;
  return (
    <li>
      <div className="mb-2 flex items-baseline justify-between gap-4 text-sm">
        <span className="text-foreground">{label}</span>
        <span className="shrink-0 font-mono text-foreground tabular-nums">
          {formattedCost}
        </span>
      </div>
      <svg
        aria-hidden="true"
        className="h-6 w-full"
        focusable="false"
        preserveAspectRatio="none"
        viewBox="0 0 600 24"
      >
        <title>{label}</title>
        <line className="stroke-border" x1={0} x2={600} y1={23} y2={23} />
        <rect className="fill-primary" height={16} width={width} x={0} y={4} />
        {partial ? (
          <path
            className="fill-none stroke-primary"
            d={`M ${width + 2} 4 l 10 8 -10 8`}
            strokeWidth={2}
          />
        ) : null}
      </svg>
    </li>
  );
};

export const CostFigure = (): ReactNode => (
  <StudyFigure
    title="Estimated cost for both tasks"
    caption="All bars start at zero on the same $0 to $60 scale. The mixed setup is a minimum because some usage is missing."
  >
    <ul className="space-y-5">
      {studyWorkflows.map((workflow) => (
        <CostBar
          key={workflow.label}
          label={workflow.label}
          partial={workflow.partial}
          value={workflow.estimatedCost}
        />
      ))}
    </ul>
  </StudyFigure>
);
