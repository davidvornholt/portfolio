import Link from 'next/link';
import { navItems } from './nav-items';

export const Header = () => (
  <header className="fixed inset-x-0 top-0 z-50 border-foreground border-b bg-background">
    <nav
      aria-label="Main"
      className="folio-wrap flex h-14 items-center justify-between gap-3"
    >
      <Link
        href="/"
        className="group inline-flex items-center gap-2 font-bold text-lg tracking-tight"
      >
        <span aria-hidden="true" className="dv-mark" />
        <span className="sr-only sm:not-sr-only">David Vornholt</span>
        <span className="sr-only">, home</span>
      </Link>
      <div className="flex items-center gap-4 text-sm sm:gap-7">
        {navItems.map((item) => (
          <Link className="ink-link" key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  </header>
);
