'use client';

import {
  type FocusEvent,
  type PointerEvent,
  type ReactNode,
  useRef,
} from 'react';

/**
 * A project's row in the ledger, which is one link. Every time the visitor
 * points at it or reaches it with the keyboard, another square of its chart
 * hops. Only a square with nothing standing on it is chosen, so the hop
 * never passes through a neighbour.
 */
export const ProjectRow = ({
  href,
  project,
  children,
}: Readonly<{
  href: string;
  project: string;
  children: ReactNode;
}>): ReactNode => {
  const hoppedRef = useRef<Element | null>(null);
  const hop = (
    event: PointerEvent<HTMLAnchorElement> | FocusEvent<HTMLAnchorElement>,
  ): void => {
    const free = [...event.currentTarget.querySelectorAll('[data-free]')];
    // Another one than last time, wherever the chart has more than one.
    const others = free.filter((candidate) => candidate !== hoppedRef.current);
    const choices = others.length > 0 ? others : free;
    const square = choices[Math.floor(Math.random() * choices.length)];
    if (square === undefined) {
      return;
    }
    hoppedRef.current?.removeAttribute('data-hop');
    if (square === hoppedRef.current) {
      // The same square again: reading its box makes the browser notice that
      // the attribute was gone, so the hop starts over.
      square.getBoundingClientRect();
    }
    square.setAttribute('data-hop', '');
    hoppedRef.current = square;
  };
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-umami-event="open-source-open"
      data-umami-event-project={project}
      className="project-row"
      onPointerEnter={hop}
      onFocus={hop}
    >
      {children}
    </a>
  );
};
