import Link from 'next/link';
import type { ReactNode } from 'react';
import { BarMark } from '@/shared/ui/presentation/components/bar-mark';
import { contactItem, navItems } from './nav-items';

export const Header = (): ReactNode => (
  <header className="page-column flex h-16 items-center justify-between md:h-19">
    <Link
      href="/"
      className="inline-flex items-center gap-2.5 font-bold text-lg tracking-tight"
    >
      <BarMark className="h-4 w-4.5" />
      David Vornholt
    </Link>

    <nav aria-label="Main" className="flex items-center gap-8 font-medium">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="hidden underline-offset-4 hover:underline hover:decoration-2 md:inline"
        >
          {item.label}
        </Link>
      ))}
      <Link
        href={contactItem.href}
        className="inline-flex h-11 items-center border-2 border-foreground px-4 hover:bg-foreground hover:text-background"
      >
        {contactItem.label}
      </Link>
    </nav>
  </header>
);
