import type { ReactNode } from 'react';

// A bar's share of its track. The value comes from the post's data, so it
// reaches the browser as the bar's own width.
export const ChartBarFill = ({
  percentage,
  className,
}: Readonly<{
  percentage: number;
  className: string;
}>): ReactNode => (
  <svg
    aria-hidden="true"
    viewBox="0 0 100 1"
    preserveAspectRatio="none"
    className={`block size-full fill-current ${className}`}
  >
    <rect width={percentage} height="1" />
  </svg>
);
