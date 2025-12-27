import { TrendingDown, TrendingUp } from 'lucide-react';
import { div as MotionDiv } from 'motion/react-client';
import type { ReactNode } from 'react';

export type StatItem = {
  readonly label: string;
  readonly value: string;
  readonly subtext: string;
  readonly trend: 'up' | 'down';
  readonly icon: ReactNode;
};

type StatCardProps = {
  readonly stat: StatItem;
};

export const StatCard = ({ stat }: StatCardProps): ReactNode => (
  <MotionDiv
    variants={{
      initial: { opacity: 0, y: 20 },
      whileInView: { opacity: 1, y: 0 },
    }}
    transition={{ duration: 0.5, ease: 'easeOut' }}
    className="group relative overflow-hidden rounded-lg border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-sm"
  >
    <div className="mb-4 flex items-center justify-between">
      <span className="text-primary">{stat.icon}</span>
      {stat.trend === 'up' ? (
        <TrendingUp className="h-4 w-4 text-green-600" />
      ) : (
        <TrendingDown className="h-4 w-4 text-green-600" />
      )}
    </div>
    <p className="font-mono text-3xl font-bold text-foreground">{stat.value}</p>
    <p className="mt-1 text-sm font-medium text-foreground">{stat.label}</p>
    <p className="text-xs text-muted-foreground">{stat.subtext}</p>
  </MotionDiv>
);
