import Link from 'next/link';
import { navItems } from './nav-items';
import { SocialLinks } from './social-links';
export const Footer = () => (
  <footer className="bg-deep py-10 text-deep-foreground">
    <div className="folio-wrap">
      <div className="flex flex-wrap items-center justify-between gap-5">
        <Link href="/" className="brand-link">
          <span aria-hidden="true" className="network-mark" />
          David Vornholt
        </Link>
        <nav aria-label="Footer" className="flex gap-5 text-sm">
          {navItems.map((item) => (
            <Link className="sign-link" key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <SocialLinks />
      </div>
      <div className="mt-6 flex justify-between border-deep-border border-t pt-4 text-deep-muted-foreground text-sm">
        <p>© {new Date().getFullYear()} David Vornholt</p>
        <nav aria-label="Legal" className="flex gap-4">
          <Link href="/impressum">Impressum</Link>
          <Link href="/privacy">Privacy</Link>
        </nav>
      </div>
    </div>
  </footer>
);
