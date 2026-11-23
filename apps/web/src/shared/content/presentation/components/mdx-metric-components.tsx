import type { ReactNode } from 'react';
import { ChartBarFill } from './chart-bar-fill';

const chartPercentageScale = 100;

export const MDXStatCard = ({
  label,
  value,
  subtext,
}: Readonly<{
  label: string;
  value: string;
  subtext: string;
}>): ReactNode => (
  <div className="border-foreground border-t-2 pt-3 pb-2">
    <p className="font-bold text-4xl tabular-nums tracking-tight">{value}</p>
    <p className="mt-1 font-semibold">{label}</p>
    <p className="text-muted-foreground text-sm">{subtext}</p>
  </div>
);

export const MDXStatGrid = ({
  children,
}: {
  readonly children: ReactNode;
}): ReactNode => (
  <div className="my-8 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
    {children}
  </div>
);

export const MDXFeatureCard = ({
  title,
  description,
}: Readonly<{
  title: string;
  description: string;
}>): ReactNode => (
  <div className="border-foreground border-t-2 pt-3">
    <h3 className="font-bold text-lg tracking-tight">{title}</h3>
    <p className="mt-1 text-muted-foreground leading-relaxed">{description}</p>
  </div>
);

export const MDXFeatureGrid = ({
  children,
}: {
  readonly children: ReactNode;
}): ReactNode => (
  <div className="my-8 grid gap-x-8 gap-y-6 md:grid-cols-3">{children}</div>
);

export const MDXChart = ({
  title,
  data,
  unit = '',
}: Readonly<{
  type: 'bar';
  title: string;
  data: Readonly<{
    labels: ReadonlyArray<string>;
    values: ReadonlyArray<number>;
  }>;
  unit?: string;
}>): ReactNode => {
  const maxValue = Math.max(...data.values);

  return (
    <div className="my-8 bg-muted p-6">
      <h4 className="mb-6 font-bold">{title}</h4>
      <div className="space-y-4">
        {data.labels.map((label, index) => {
          const value = data.values[index] ?? 0;
          const percentage = (value / maxValue) * chartPercentageScale;
          return (
            <div key={label} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-semibold tabular-nums">
                  {value}
                  {unit}
                </span>
              </div>
              <div className="h-2 w-full bg-background">
                <ChartBarFill
                  percentage={percentage}
                  className="text-foreground"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
