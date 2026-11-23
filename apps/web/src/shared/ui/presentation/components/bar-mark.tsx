import type { ReactNode, Ref } from 'react';

/**
 * The site's mark: one change standing on the bar. It is decoration beside a
 * text label everywhere it appears, so it is hidden from assistive technology.
 * `ref` gives a caller the drawing, to move its square.
 */
export const BarMark = ({
  className,
  ref,
}: Readonly<{ className?: string; ref?: Ref<SVGSVGElement> }>): ReactNode => (
  <svg
    ref={ref}
    viewBox="0 0 18 15"
    aria-hidden="true"
    className={`overflow-visible fill-current ${className ?? ''}`}
  >
    <rect data-mark="square" x="5" width="8" height="8" />
    <rect data-mark="bar" y="10" width="18" height="5" />
  </svg>
);
