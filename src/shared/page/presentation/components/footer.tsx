'use client';

import { motion } from 'framer-motion';
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
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="border-t border-border bg-background"
    >
      <div className="mx-auto max-w-5xl px-6 py-12 md:px-8 md:py-16">
        <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
          <div className="text-center md:text-left">
            <Link
              href="/"
              className="font-serif text-lg font-semibold tracking-tight"
            >
              David Vornholt
            </Link>
            <p className="mt-2 max-w-xs text-sm text-muted-foreground">
              Full Stack Developer & Digital Experience Architect
            </p>
          </div>

          <nav className="flex flex-wrap justify-center gap-6">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {label}
              </Link>
            ))}
          </nav>

          <SocialLinks />
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-4 text-center text-sm text-muted-foreground md:flex-row">
          <p>&copy; {currentYear} David Vornholt. All rights reserved.</p>
          <p className="font-mono text-xs">
            Built with Next.js, Tailwind CSS & TypeScript
          </p>
        </div>
      </div>
    </motion.footer>
  );
};
