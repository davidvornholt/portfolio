'use client';

import { MotionConfig } from 'motion/react';
import { type ReactNode, useSyncExternalStore } from 'react';

const reducedMotionMediaQuery = '(prefers-reduced-motion: reduce)';

const getReducedMotionSnapshot = (): boolean =>
  typeof globalThis.window !== 'undefined' &&
  globalThis.window.matchMedia(reducedMotionMediaQuery).matches;

const subscribeToReducedMotion = (onStoreChange: () => void): (() => void) => {
  if (typeof globalThis.window === 'undefined') {
    return () => undefined;
  }

  const mediaQueryList = globalThis.window.matchMedia(reducedMotionMediaQuery);
  mediaQueryList.addEventListener('change', onStoreChange);

  return () => mediaQueryList.removeEventListener('change', onStoreChange);
};

const usePrefersReducedMotion = (): boolean =>
  useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    () => false,
  );

export const MotionProvider = ({
  children,
}: {
  readonly children: ReactNode;
}): ReactNode => {
  const shouldReduceMotion = usePrefersReducedMotion();

  return (
    <MotionConfig
      reducedMotion="user"
      skipAnimations={shouldReduceMotion === true}
    >
      {children}
    </MotionConfig>
  );
};
