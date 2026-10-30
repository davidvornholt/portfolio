import { easing } from '@portfolio/ui/easing';
import { div as MotionDiv } from 'motion/react-client';
import type { ReactNode } from 'react';

// The bar has its final width from the start and grows from the left edge by
// scaling, so the server-rendered markup shows the full bar. The `<noscript>`
// style in the root layout resets the scaled start frame without JavaScript.
export const ChartBarFill = ({
  percentage,
  delaySeconds,
  className,
}: Readonly<{
  percentage: number;
  delaySeconds: number;
  className: string;
}>): ReactNode => (
  <MotionDiv
    initial={{ scaleX: 0 }}
    whileInView={{ scaleX: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay: delaySeconds, ease: easing }}
    style={{ width: `${percentage}%` }}
    className={`h-full origin-left ${className}`}
  />
);
