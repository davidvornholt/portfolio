'use client';

import Link from 'next/link';
import { type ReactNode, useRef } from 'react';
import { BarMark } from '@/shared/ui/presentation/components/bar-mark';

const hopDuration = 620;

// The square leaps off the bar, turns half round and lands, and the bar
// gives a little under it.
const hop: ReadonlyArray<Keyframe> = [
  {
    transform: 'translateY(0) rotate(0deg)',
    easing: 'cubic-bezier(0.2, 0.7, 0.4, 1)',
  },
  {
    offset: 0.5,
    transform: 'translateY(-11px) rotate(100deg)',
    easing: 'cubic-bezier(0.6, 0, 0.9, 0.5)',
  },
  { offset: 0.86, transform: 'translateY(0) rotate(180deg) scaleY(1)' },
  { offset: 0.92, transform: 'translateY(0.6px) rotate(180deg) scaleY(0.85)' },
  { transform: 'translateY(0) rotate(180deg) scaleY(1)' },
];
const give: ReadonlyArray<Keyframe> = [
  { transform: 'translateY(0)' },
  { offset: 0.86, transform: 'translateY(0)' },
  { offset: 0.92, transform: 'translateY(0.8px)' },
  { transform: 'translateY(0)' },
];

/** The site's name with its mark, as the link home. A click makes the square hop. */
export const HomeLink = (): ReactNode => {
  const markRef = useRef<SVGSVGElement>(null);

  const play = (): void => {
    const mark = markRef.current;
    const still = globalThis.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (mark === null || still) {
      return;
    }
    mark
      .querySelector('[data-mark="square"]')
      ?.animate([...hop], { duration: hopDuration });
    mark
      .querySelector('[data-mark="bar"]')
      ?.animate([...give], { duration: hopDuration });
  };

  return (
    <Link
      href="/"
      onClick={play}
      className="inline-flex items-center gap-2.5 font-bold text-lg tracking-tight"
    >
      <BarMark ref={markRef} className="mark-hops h-4 w-4.5" />
      David Vornholt
    </Link>
  );
};
