import type { ReactNode } from 'react';

/**
 * An arrow drawn to the weight of the text beside it. The text typeface has
 * no arrow of its own, and a browser's substitute comes out as a hairline. It
 * is decoration beside a label, so it is hidden from assistive technology.
 */
export const Arrow = ({ to }: { readonly to: 'left' | 'right' }): ReactNode => (
  <svg
    aria-hidden="true"
    viewBox="0 0 16 12"
    data-to={to}
    className="inline-block h-[0.75em] w-[1em] fill-none stroke-2 stroke-current align-baseline data-[to=left]:-scale-x-100"
  >
    <path d="M0 6h14M9 1l5 5-5 5" strokeLinecap="square" />
  </svg>
);
