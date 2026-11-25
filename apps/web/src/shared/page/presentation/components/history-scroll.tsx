'use client';

import { useEffect } from 'react';

// How long after a step through the history the page scrolls without
// animation, in milliseconds. The browser restores the old scroll position
// a moment after the step, once the page it returns to has been drawn.
const settleTime = 1000;

/**
 * Lets the browser's back and forward buttons return to where the visitor
 * was at once. The site scrolls smoothly to a section when its link is
 * clicked, and without this the browser would restore an old position the
 * same way: from the top of the page down to it, past everything between.
 */
export const HistoryScroll = (): null => {
  useEffect(() => {
    const root = document.documentElement;
    let timer: ReturnType<typeof globalThis.setTimeout> | undefined;
    const scrollAtOnce = (): void => {
      root.style.setProperty('scroll-behavior', 'auto');
      globalThis.clearTimeout(timer);
      timer = globalThis.setTimeout(
        () => root.style.removeProperty('scroll-behavior'),
        settleTime,
      );
    };
    globalThis.addEventListener('popstate', scrollAtOnce);
    return () => {
      globalThis.removeEventListener('popstate', scrollAtOnce);
      globalThis.clearTimeout(timer);
      root.style.removeProperty('scroll-behavior');
    };
  }, []);
  return null;
};
