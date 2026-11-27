'use client';

import {
  type ComponentProps,
  type FocusEvent,
  type PointerEvent,
  type ReactNode,
  useRef,
} from 'react';
import './hopping-link.css';

type Point = Readonly<{ x: number; y: number }>;

// A square this close to the pointer, in pixels, stays where it is: the
// pointer would hide its hop.
const pointerReach = 24;

/** The squares with nothing standing on them, which have room to hop. */
const freeSquares = (link: Element): ReadonlyArray<Element> => {
  const topOfColumn = new Map<number, Element>();
  for (const square of link.querySelectorAll('[data-square]')) {
    const box = square.getBoundingClientRect();
    const column = Math.round(box.left);
    const highest = topOfColumn.get(column);
    if (
      highest === undefined ||
      box.top < highest.getBoundingClientRect().top
    ) {
      topOfColumn.set(column, square);
    }
  }
  return [...topOfColumn.values()];
};

const isNear = (square: Element, pointer: Point): boolean => {
  const box = square.getBoundingClientRect();
  const dx = Math.max(box.left - pointer.x, 0, pointer.x - box.right);
  const dy = Math.max(box.top - pointer.y, 0, pointer.y - box.bottom);
  return Math.hypot(dx, dy) < pointerReach;
};

/**
 * A link around a group of squares, each marked `data-square`. Every time
 * the visitor points at the link or reaches it with the keyboard, another
 * one of its squares hops. Only a square with nothing standing on it is
 * chosen, so the hop never passes through a neighbour, and never one under
 * the pointer.
 */
export const HoppingLink = ({
  href,
  children,
  ...link
}: ComponentProps<'a'> & { readonly href: string }): ReactNode => {
  const hoppedRef = useRef<Element | null>(null);
  const hop = (anchor: Element, pointer?: Point): void => {
    const free = freeSquares(anchor).filter(
      (square) => pointer === undefined || !isNear(square, pointer),
    );
    // Another one than last time, wherever there is more than one.
    const others = free.filter((square) => square !== hoppedRef.current);
    const choices = others.length > 0 ? others : free;
    const chosen = choices[Math.floor(Math.random() * choices.length)];
    if (chosen === undefined) {
      return;
    }
    hoppedRef.current?.removeAttribute('data-hop');
    if (chosen === hoppedRef.current) {
      // The same square again: reading its box makes the browser notice that
      // the attribute was gone, so the hop starts over.
      chosen.getBoundingClientRect();
    }
    chosen.setAttribute('data-hop', '');
    hoppedRef.current = chosen;
  };
  return (
    <a
      {...link}
      href={href}
      onPointerEnter={(event: PointerEvent<HTMLAnchorElement>) =>
        hop(event.currentTarget, { x: event.clientX, y: event.clientY })
      }
      onFocus={(event: FocusEvent<HTMLAnchorElement>) =>
        hop(event.currentTarget)
      }
    >
      {children}
    </a>
  );
};
