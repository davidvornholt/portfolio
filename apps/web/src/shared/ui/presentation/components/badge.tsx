import type { ReactNode } from 'react';

type BadgeVariant = 'secondary' | 'outline';

const badgeVariantClasses: Record<BadgeVariant, string> = {
  secondary: 'bg-secondary text-secondary-foreground',
  outline: 'border-border text-foreground',
};

export const Badge = ({
  variant,
  className,
  children,
}: Readonly<{
  variant: BadgeVariant;
  className?: string;
  children: ReactNode;
}>): ReactNode => (
  <span
    className={`inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 whitespace-nowrap border border-transparent px-2 py-0.5 font-medium text-xs ${badgeVariantClasses[variant]} ${className ?? ''}`}
  >
    {children}
  </span>
);
