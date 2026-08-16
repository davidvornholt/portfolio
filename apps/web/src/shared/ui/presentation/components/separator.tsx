import type { ReactNode } from 'react';

export const Separator = ({
  className,
}: {
  readonly className?: string;
}): ReactNode => (
  <hr
    className={`h-px w-full shrink-0 border-0 bg-border ${className ?? ''}`}
  />
);
