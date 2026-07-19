import { header as MotionHeader } from 'motion/react-client';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { SocialLinks } from './social-links';

type NavItem = {
  readonly label: string;
  readonly href: string;
};

const navItems: ReadonlyArray<NavItem> = [
  { label: 'Works', href: '/#works' },
  { label: 'Expertise', href: '/#expertise' },
  { label: 'Blog', href: '/#blog' },
  { label: 'Contact', href: '/#contact' },
] as const;

const NavLink = ({ item }: { readonly item: NavItem }): ReactNode => (
  <Link
    href={item.href}
    className="font-medium text-muted-foreground text-sm transition-colors hover:text-foreground"
  >
    {item.label}
  </Link>
);

export const Header = (): ReactNode => (
  <MotionHeader
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, ease: 'easeOut' }}
    className="fixed top-0 right-0 left-0 z-50 border-border/40 border-b bg-background/80 backdrop-blur-lg backdrop-saturate-150"
  >
    <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
      <Link
        href="/"
        className="font-semibold font-serif text-foreground text-lg tracking-tight"
      >
        David Vornholt
      </Link>

      <div className="hidden items-center gap-8 md:flex">
        {navItems.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}
      </div>

      <SocialLinks />
    </nav>
  </MotionHeader>
);
