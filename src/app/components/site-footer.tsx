'use client';

import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';

type SocialLink = {
  readonly label: string;
  readonly href: string;
  readonly icon: ReactNode;
};

const socialLinks: readonly SocialLink[] = [
  {
    label: 'GitHub',
    href: 'https://github.com/davidvornholt',
    icon: <Github className="h-5 w-5" />,
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/davidvornholt',
    icon: <Linkedin className="h-5 w-5" />,
  },
  {
    label: 'X',
    href: 'https://x.com/davidvornholt',
    icon: <Twitter className="h-5 w-5" />,
  },
] as const;

const currentYear = new Date().getFullYear();

export const SiteFooter = (): ReactNode => (
  <motion.footer
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    className="border-t border-border bg-background px-6 py-12"
  >
    <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 md:flex-row">
      <div className="flex flex-col items-center gap-2 md:items-start">
        <Link
          href="/"
          className="font-serif text-lg font-semibold tracking-tight text-foreground"
        >
          David Vornholt
        </Link>
        <p className="text-sm text-muted-foreground">
          Full Stack Developer & Digital Experience Architect
        </p>
      </div>

      <div className="flex items-center gap-6">
        {socialLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.label}
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            {link.icon}
          </a>
        ))}
      </div>

      <p className="text-sm text-muted-foreground">
        © {currentYear} David Vornholt. All rights reserved.
      </p>
    </div>
  </motion.footer>
);
