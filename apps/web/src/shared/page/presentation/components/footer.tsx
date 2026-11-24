import Image from 'next/image';
import Link from 'next/link';
import { contactEmail } from '@/config/site';
import portrait from '@/public/portrait.png';
import { navItems } from './nav-items';
import { SocialLinks } from './social-links';
export const Footer = () => (
  <footer id="contact" className="film-ground">
    <div className="folio-wrap py-12 md:py-20">
      <div className="grid items-center gap-7 sm:grid-cols-[auto_1fr_auto]">
        <Image
          src={portrait}
          alt="David Vornholt"
          sizes="112px"
          className="end-portrait"
        />
        <div>
          <p className="credit-label">David Vornholt</p>
          <h2 className="mt-2 font-normal font-serif text-4xl">Write to me.</h2>
          <a
            className="film-link mt-3"
            href={`mailto:${contactEmail}`}
            data-umami-event="contact-email"
          >
            {contactEmail} ↗
          </a>
        </div>
        <nav aria-label="Footer" className="grid gap-2 text-sm">
          {navItems.map((item) => (
            <Link className="mast-link" key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="footer-end mt-10 flex flex-wrap items-center justify-between gap-4 border-t pt-5 text-xs">
        <p>© {new Date().getFullYear()} David Vornholt</p>
        <SocialLinks />
        <nav aria-label="Legal" className="flex gap-4">
          <Link href="/impressum">Impressum</Link>
          <Link href="/privacy">Privacy</Link>
        </nav>
      </div>
    </div>
  </footer>
);
