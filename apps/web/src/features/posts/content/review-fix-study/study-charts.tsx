import type { ReactNode } from 'react';
import { studyWorkflows } from './study-data';
import { StudyFigure } from './study-outcomes';

const dollars = (value: number): string => `$${value.toFixed(2)}`;
const tokens = new Intl.NumberFormat('en-US');

const MetricBar = ({
  label,
  value,
  maximum,
  displayValue,
  partial,
}: Readonly<{
  label: string;
  value: number;
  maximum: number;
  displayValue: string;
  partial: boolean;
}>): ReactNode => {
  const width = (value / maximum) * 600;
  return (
    <li>
      <div className="mb-2 flex items-baseline justify-between gap-4 text-sm">
        <span className="text-foreground">{label}</span>
        <span className="shrink-0 font-mono text-foreground tabular-nums">
          {partial ? '≥ ' : ''}{displayValue}
        </span>
      </div>
      <svg aria-hidden="true" className="h-6 w-full" focusable="false" preserveAspectRatio="none" viewBox="0 0 600 24">
        <title>{label}</title>
        <line className="stroke-border" x1={0} x2={600} y1={23} y2={23} />
        <rect className="fill-primary" height={16} width={width} x={0} y={4} />
        {partial ? <path className="fill-none stroke-primary" d={`M ${width + 2} 4 l 10 8 -10 8`} strokeWidth={2} /> : null}
      </svg>
      {partial ? <p className="mt-1 text-muted-foreground text-xs">Recorded lower bound; additional usage is missing.</p> : null}
    </li>
  );
};

export const CostFigure = (): ReactNode => (
  <StudyFigure
    title="Estimated API-equivalent cost, latest pair"
    caption="Linear scale: $0–$60, same zero baseline for every bar. Historical rate assumptions, not invoices or subscription consumption. The cheapest runs did not deliver equivalent successful results."
  >
    <ul className="space-y-5">
      {studyWorkflows.map((workflow) => (
        <MetricBar
          displayValue={dollars(workflow.prosaCost + workflow.rotaCost)}
          key={workflow.label}
          label={workflow.label}
          maximum={60}
          partial={workflow.partial}
          value={workflow.prosaCost + workflow.rotaCost}
        />
      ))}
    </ul>
  </StudyFigure>
);

const taskCharts = [
  { title: 'ProsaBridge', costKey: 'prosaCost' },
  { title: 'Rota', costKey: 'rotaCost' },
] as const;

export const TaskCostFigure = (): ReactNode => (
  <StudyFigure
    title="Where the mixed subtotal grew"
    caption="Both panels share a $0–$35 scale. The recorded mixed subtotal was lower than all-Astra on ProsaBridge, higher on Rota, and higher for the pair. Missing mixed usage is not extrapolated."
  >
    <div className="grid gap-8 sm:grid-cols-2">
      {taskCharts.map((task) => (
        <div key={task.title}>
          <p className="mb-5 font-medium text-foreground">{task.title}</p>
          <ul className="space-y-5">
            {studyWorkflows.map((workflow) => (
              <MetricBar
                displayValue={dollars(workflow[task.costKey])}
                key={workflow.label}
                label={workflow.label}
                maximum={35}
                partial={workflow.partial}
                value={workflow[task.costKey]}
              />
            ))}
          </ul>
        </div>
      ))}
    </div>
  </StudyFigure>
);

export const OutputFigure = (): ReactNode => (
  <StudyFigure
    title="More output was not a better review"
    caption="Output tokens across the latest pair; linear scale 0–500,000. Mixed includes only persisted sessions. This is output volume, not all processed tokens, unique code read, or a quality score."
  >
    <ul className="space-y-5">
      {studyWorkflows.map((workflow) => (
        <MetricBar
          displayValue={tokens.format(workflow.outputTokens)}
          key={workflow.label}
          label={workflow.label}
          maximum={500_000}
          partial={workflow.partial}
          value={workflow.outputTokens}
        />
      ))}
    </ul>
  </StudyFigure>
);
