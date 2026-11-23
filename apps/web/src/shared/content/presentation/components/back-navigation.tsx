import Link from 'next/link';
import type { ReactNode } from 'react';

type BackNavigationProps = Readonly<{
  href: string;
  label: string;
}>;

export const BackNavigation = ({
  href,
  label,
}: BackNavigationProps): ReactNode => (
  <p className="page-column pt-6 md:pt-10">
    <Link
      href={href}
      className="font-semibold underline decoration-2 underline-offset-4 hover:decoration-4"
    >
      <span aria-hidden="true">← </span>
      {label}
    </Link>
  </p>
);
