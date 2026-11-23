import type { ReactNode } from 'react';

/**
 * The site's mark: one change standing on the bar. It is decoration beside a
 * text label everywhere it appears, so it is hidden from assistive technology.
 */
export const BarMark = ({
  className,
}: {
  readonly className?: string;
}): ReactNode => (
  <svg
    viewBox="0 0 18 15"
    aria-hidden="true"
    className={`fill-current ${className ?? ''}`}
  >
    <rect x="5" width="8" height="8" />
    <rect y="10" width="18" height="5" />
  </svg>
);
