import Link from 'next/link';
import type { ReactNode } from 'react';
import { buildInfo } from '@/shared/build/services/build-info';
import { BuildLine } from './build-line';
import { contactItem, navItems } from './nav-items';

const legalLinks = [
  { href: '/impressum', label: 'Impressum' },
  { href: '/privacy', label: 'Privacy' },
] as const;

const linkClassName = 'underline-offset-4 hover:underline hover:decoration-2';

export const Footer = (): ReactNode => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="page-column pb-10">
      {/* The page itself, as one change standing on the bar. */}
      <div aria-hidden="true">
        <div className="mb-0.5 size-3 bg-foreground" />
        <div className="bleed h-4 bg-bar" />
      </div>

      <div className="mt-6 max-w-3xl">
        <BuildLine build={buildInfo} />
      </div>

      <div className="mt-12 flex flex-col gap-4 text-muted-foreground text-sm md:flex-row md:items-center md:justify-between">
        <nav aria-label="Sections" className="flex flex-wrap gap-x-6 gap-y-2">
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
