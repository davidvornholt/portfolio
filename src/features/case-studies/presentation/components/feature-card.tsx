import { div as MotionDiv } from 'motion/react-client';
import type { ReactNode } from 'react';

type FeatureCardProps = {
  readonly icon: ReactNode;
  readonly title: string;
  readonly description: string;
  readonly delay?: number;
};

export const FeatureCard = ({
  icon,
  title,
  description,
  delay = 0,
}: FeatureCardProps): ReactNode => (
  <MotionDiv
    variants={{
      initial: { opacity: 0, y: 20 },
      whileInView: { opacity: 1, y: 0 },
    }}
    transition={{ duration: 0.5, delay }}
    className="rounded-lg border border-border bg-card p-6"
  >
    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
      <span className="text-primary">{icon}</span>
    </div>
    <h3 className="mb-2 font-semibold text-foreground">{title}</h3>
    <p className="text-sm text-muted-foreground">{description}</p>
  </MotionDiv>
);
