'use client';

import { type ReactNode, useEffect, useRef } from 'react';

// How much of the element has to be on screen before it plays.
const inView = 0.5;

/**
 * Lets its content play once when it scrolls into view. It marks itself
 * `data-run="waiting"` until then and `data-run="playing"` from then on, and
 * a stylesheet does the rest. Without scripts, and for a visitor who prefers
 * reduced motion, it carries no mark and the content shows its final state.
 */
export const PlayOnView = ({
  children,
  className,
}: Readonly<{ children: ReactNode; className?: string }>): ReactNode => {
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
      { threshold: inView },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};
