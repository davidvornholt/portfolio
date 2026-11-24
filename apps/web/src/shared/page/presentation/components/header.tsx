import Link from 'next/link';
import { navItems } from './nav-items';

export const Header = () => (
  <header className="fixed inset-x-0 top-0 z-50 bg-deep text-deep-foreground">
    <nav
      aria-label="Main"
      className="folio-wrap flex h-16 items-center justify-between gap-2"
    >
      <Link href="/" aria-label="David Vornholt, home" className="brand-link">
        <span aria-hidden="true" className="network-mark" />
        <span>David Vornholt</span>
      </Link>
      <div className="flex items-center gap-2 text-xs sm:gap-7 sm:text-sm">
        {navItems.map((item) => (
          <Link className="sign-link" key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  </header>
);
