import type { ReactNode } from 'react';

const socialLinks = [
  { label: 'GitHub', href: 'https://github.com/davidvornholt' },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/david-vornholt-055239366',
  },
  { label: 'X', href: 'https://x.com/davidvornholt' },
] as const;

export const SocialLinks = (): ReactNode => (
  <ul className="flex flex-wrap gap-x-6 gap-y-2 font-semibold">
    {socialLinks.map((link) => (
      <li key={link.href}>
        <a
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          data-umami-event="social-link"
          data-umami-event-network={link.label}
          className="underline decoration-2 underline-offset-4 hover:decoration-4"
        >
          {link.label}
        </a>
      </li>
    ))}
  </ul>
);
