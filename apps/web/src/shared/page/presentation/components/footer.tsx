import Link from 'next/link';
import type { ReactNode } from 'react';
import { contactItem, navItems } from './nav-items';

const legalLinks = [
  { href: '/impressum', label: 'Impressum' },
  { href: '/privacy', label: 'Privacy' },
] as const;

const linkClassName =
  'underline decoration-2 decoration-transparent underline-offset-4 hover:decoration-current';

export const Footer = (): ReactNode => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="page-column pb-10">
      {/* One change standing on the bar. */}
      <div aria-hidden="true" className="keeps-colors">
        <div className="landing-square mb-0.5 size-3 bg-foreground" />
        <div className="bleed h-4 bg-bar" />
      </div>

      <div className="mt-12 flex flex-col gap-4 text-muted-foreground text-sm md:flex-row md:items-center md:justify-between">
        <nav
          aria-label="Sections"
          className="flex flex-wrap gap-x-6 gap-y-2 print:hidden"
        >
          {[...navItems, contactItem].map(({ href, label }) => (
            <Link key={href} href={href} className={linkClassName}>
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <span>&copy; {currentYear} David Vornholt</span>
          <nav aria-label="Legal" className="flex gap-6">
            {legalLinks.map(({ href, label }) => (
              <Link key={href} href={href} className={linkClassName}>
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
};
