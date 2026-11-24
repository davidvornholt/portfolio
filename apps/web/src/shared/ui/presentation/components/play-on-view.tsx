'use client';

import { type ReactNode, useEffect, useRef } from 'react';

// By default it plays once its upper edge has come up past the lowest
// quarter of the screen. A share of the element would never be reached by one
// that is much taller than the screen.
const quarterUp = '0px 0px -25% 0px';

/**
 * Lets its content play once when it scrolls into view. It marks itself
 * `data-run="waiting"` until then and `data-run="playing"` from then on, and
 * a stylesheet does the rest. Without scripts, and for a visitor who prefers
 * reduced motion, it carries no mark and the content shows its final state.
 */
export const PlayOnView = ({
  children,
  className,
  margin = quarterUp,
}: Readonly<{
  children: ReactNode;
  className?: string;
  /**
   * How far inside the screen the element has to be, as an
   * IntersectionObserver root margin, which takes pixels and percent only.
   * An element at the very end of a page never rises a quarter up the screen
   * and needs a smaller one.
   */
  margin?: string;
}>): ReactNode => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    const still = globalThis.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (element === null || still) {
      return;
    }
    element.setAttribute('data-run', 'waiting');
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          element.setAttribute('data-run', 'playing');
        }
      },
      { rootMargin: margin },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [margin]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};
