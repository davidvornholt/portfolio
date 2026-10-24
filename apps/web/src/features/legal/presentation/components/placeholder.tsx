import type { ReactNode } from 'react';

/**
 * Marks a value the site owner still has to supply. It renders loudly on
 * purpose, so an unfinished legal page cannot pass a visual review unnoticed.
 */
export const Placeholder = ({
  children,
}: Readonly<{
  children: ReactNode;
}>): ReactNode => (
  <mark className="bg-welcome px-1 font-medium text-welcome-foreground">
    [Placeholder: {children}]
  </mark>
);
