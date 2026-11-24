import { BookOpen } from 'lucide-react';
import Link from 'next/link';
import { navItems } from './nav-items';

export const Header = () => (
  <header className="masthead">
    <nav
      aria-label="Main"
      className="folio-wrap flex h-16 items-center justify-between gap-2 md:h-20"
    >
      <Link href="/" aria-label="David Vornholt, home" className="wordmark">
        <BookOpen size={21} strokeWidth={1.6} />
        <span>David Vornholt</span>
      </Link>
      <div className="flex items-center gap-4 text-sm sm:gap-8">
        {navItems.map((item) => (
          <Link className="mast-link" key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  </header>
);
