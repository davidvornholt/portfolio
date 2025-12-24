import { SiGithub, SiX } from '@icons-pack/react-simple-icons';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { LinkedInLogo } from './linkedin-logo';

type SocialLink = {
  readonly label: string;
  readonly href: string;
  readonly icon: ReactNode;
};

const socialLinks: readonly SocialLink[] = [
  {
    label: 'GitHub',
    href: 'https://github.com/davidvornholt',
    icon: <SiGithub className="size-5" />,
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/davidvornholt',
    icon: (
      <LinkedInLogo className="size-5 opacity-60 transition-opacity duration-200 hover:opacity-100" />
    ),
  },
  {
    label: 'X',
    href: 'https://x.com/davidvornholt',
    icon: <SiX className="size-5" />,
  },
] as const;

const SocialIcon = ({ link }: { readonly link: SocialLink }): ReactNode => (
  <Link
    href={link.href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={link.label}
    className="text-muted-foreground transition-colors hover:text-foreground"
  >
    {link.icon}
  </Link>
);

export const SocialLinks = (): ReactNode => (
  <div className="flex items-center gap-4">
    {socialLinks.map((link) => (
      <SocialIcon key={link.href} link={link} />
    ))}
  </div>
);
