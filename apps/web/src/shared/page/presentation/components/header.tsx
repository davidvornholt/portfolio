import Link from 'next/link';
import type { ReactNode } from 'react';
import { HomeLink } from './home-link';
import { contactItem, navItems } from './nav-items';

const linkClassName =
  'underline decoration-2 decoration-transparent underline-offset-4 hover:decoration-current';

/**
 * The site's name, the links to the home page's sections, and the way to
 * write to David. On a narrow screen the section links have no room beside
 * the name, so they stand in a row of their own under it.
 */
export const Header = (): ReactNode => (
  <header className="page-column">
    <div className="flex h-16 items-center justify-between md:h-19">
      <HomeLink />

      <nav
        aria-label="Main"
        className="flex items-center gap-8 font-medium print:hidden"
      >
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`hidden md:inline ${linkClassName}`}
          >
            {item.label}
          </Link>
        ))}
        <Link
          href={contactItem.href}
          className="inline-flex h-11 items-center border-2 border-foreground px-4 hover:bg-foreground hover:text-background active:translate-y-px"
        >
          {contactItem.label}
        </Link>
      </nav>
    </div>

    <nav
      aria-label="Page sections"
      className="flex gap-x-6 pb-1 font-medium text-sm md:hidden print:hidden"
    >
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`inline-block py-2 ${linkClassName}`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  </header>
);
