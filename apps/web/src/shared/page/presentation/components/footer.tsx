import { footer as MotionFooter } from 'motion/react-client';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { Separator } from '@/shared/ui/presentation/components/separator';
import { SocialLinks } from './social-links';

const navLinks = [
  { href: '#works', label: 'Works' },
  { href: '#expertise', label: 'Expertise' },
  { href: '#blog', label: 'Blog' },
  { href: '#contact', label: 'Contact' },
] as const;

export const Footer = (): ReactNode => {
  const currentYear = new Date().getFullYear();

  return (
    <MotionFooter
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="border-border border-t bg-background"
    >
      <div className="mx-auto max-w-5xl px-6 py-12 md:px-8 md:py-16">
        <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
          <div className="text-center md:text-left">
            <Link
              href="/"
              className="font-semibold font-serif text-lg tracking-tight"
            >
              David Vornholt
            </Link>
            <p className="mt-2 max-w-xs text-muted-foreground text-sm">
              Full Stack Developer & Digital Experience Architect
            </p>
          </div>

          <nav className="flex flex-wrap justify-center gap-6">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-muted-foreground text-sm transition-colors hover:text-foreground"
              >
                {label}
              </Link>
            ))}
          </nav>

          <SocialLinks />
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-4 text-center text-muted-foreground text-sm md:flex-row">
          <p>
            &copy; {currentYear} David Vornholt. All rights reserved. Built with
            intention in Germany.
          </p>
          <p className="font-mono text-xs">
            Built with Next.js, Tailwind CSS & TypeScript
          </p>
        </div>
      </div>
    </MotionFooter>
  );
};
