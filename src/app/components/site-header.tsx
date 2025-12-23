'use client';

import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';

type NavItem = {
  readonly label: string;
  readonly href: string;
};

type SocialLink = {
  readonly label: string;
  readonly href: string;
  readonly icon: ReactNode;
};

const navItems: readonly NavItem[] = [
  { label: 'Works', href: '#works' },
  { label: 'Expertise', href: '#expertise' },
  { label: 'Blog', href: '#blog' },
  { label: 'Contact', href: '#contact' },
] as const;

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

const NavLink = ({ item }: { readonly item: NavItem }): ReactNode => (
  <Link
    href={item.href}
    className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
  >
    {item.label}
  </Link>
);

const SocialIcon = ({ link }: { readonly link: SocialLink }): ReactNode => (
  <a
    href={link.href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={link.label}
    className="text-muted-foreground transition-colors hover:text-foreground"
  >
    {link.icon}
  </a>
);

export const SiteHeader = (): ReactNode => (
  <motion.header
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, ease: 'easeOut' }}
    className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md"
  >
    <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
      <Link
        href="/"
        className="font-serif text-lg font-semibold tracking-tight text-foreground"
      >
        David Vornholt
      </Link>

      <div className="hidden items-center gap-8 md:flex">
        {navItems.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}
      </div>

      <div className="flex items-center gap-4">
        {socialLinks.map((link) => (
          <SocialIcon key={link.href} link={link} />
        ))}
      </div>
    </nav>
  </motion.header>
);
