import {
  CheckCircle2,
  Code2,
  Gauge,
  LineChart,
  Search,
  Server,
  TrendingDown,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import { div as MotionDiv } from 'motion/react-client';
import type { ReactNode } from 'react';
import { staggerContainer } from './mdx-motion';

const chartPercentageScale = 100;
const chartItemDelaySeconds = 0.1;

const iconMap: Record<string, ReactNode> = {
  zap: <Zap className="h-5 w-5" />,
  gauge: <Gauge className="h-5 w-5" />,
  lineChart: <LineChart className="h-5 w-5" />,
  search: <Search className="h-5 w-5" />,
  trendingUp: <TrendingUp className="h-5 w-5" />,
  trendingDown: <TrendingDown className="h-5 w-5" />,
  server: <Server className="h-5 w-5" />,
  users: <Users className="h-5 w-5" />,
  checkCircle: <CheckCircle2 className="h-5 w-5" />,
  code: <Code2 className="h-5 w-5" />,
};

export const MDXStatCard = ({
  label,
  value,
  subtext,
  trend,
  icon,
}: Readonly<{
  label: string;
  value: string;
  subtext: string;
  trend: 'up' | 'down';
  icon: string;
}>): ReactNode => (
  <MotionDiv
    variants={{
      initial: { opacity: 0, y: 20 },
      whileInView: { opacity: 1, y: 0 },
    }}
    transition={{ duration: 0.5, ease: 'easeOut' }}
    className="group relative overflow-hidden rounded-lg border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-sm"
  >
    <div className="mb-4 flex items-center justify-between">
      <span className="text-primary">{iconMap[icon]}</span>
      {trend === 'up' ? (
        <TrendingUp className="h-4 w-4 text-green-600" />
      ) : (
        <TrendingDown className="h-4 w-4 text-green-600" />
      )}
    </div>
    <p className="font-bold font-mono text-3xl text-foreground">{value}</p>
    <p className="mt-1 font-medium text-foreground text-sm">{label}</p>
    <p className="text-muted-foreground text-xs">{subtext}</p>
  </MotionDiv>
);

export const MDXStatGrid = ({
  children,
}: {
  readonly children: ReactNode;
}): ReactNode => (
  <MotionDiv
    variants={staggerContainer}
    initial="initial"
    whileInView="whileInView"
    viewport={{ once: true, margin: '-100px' }}
    className="my-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
  >
    {children}
  </MotionDiv>
);

export const MDXFeatureCard = ({
  icon,
  title,
  description,
  delay = 0,
}: Readonly<{
  icon: string;
  title: string;
  description: string;
  delay?: number;
}>): ReactNode => (
  <MotionDiv
    variants={{
      initial: { opacity: 0, y: 20 },
      whileInView: { opacity: 1, y: 0 },
    }}
    transition={{ duration: 0.5, delay }}
    className="rounded-lg border border-border bg-card p-6"
  >
    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
      <span className="text-primary">{iconMap[icon]}</span>
    </div>
    <h3 className="mb-2 font-semibold text-foreground">{title}</h3>
    <p className="text-muted-foreground text-sm">{description}</p>
  </MotionDiv>
);

export const MDXFeatureGrid = ({
  children,
}: {
  readonly children: ReactNode;
}): ReactNode => (
  <div className="my-8 grid gap-6 md:grid-cols-3">{children}</div>
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
    <MotionDiv
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="my-8 rounded-lg border border-border bg-card p-6"
    >
      <h4 className="mb-6 font-medium text-foreground text-sm">{title}</h4>
      <div className="space-y-4">
        {data.labels.map((label, index) => {
          const value = data.values[index] ?? 0;
          const percentage = (value / maxValue) * chartPercentageScale;
          return (
            <div key={label} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-medium font-mono text-foreground">
                  {value}
                  {unit}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <MotionDiv
                  initial={{ width: 0 }}
                  whileInView={{ width: `${percentage}%` }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.8,
                    delay: index * chartItemDelaySeconds,
                  }}
                  className="h-full rounded-full bg-primary"
                />
              </div>
            </div>
          );
        })}
      </div>
    </MotionDiv>
  );
};
