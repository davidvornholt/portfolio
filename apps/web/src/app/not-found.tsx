import type { Metadata } from 'next';
import Link from 'next/link';
import type { ReactNode } from 'react';

// The page stands for no address, so it names no canonical one and stays out
// of search results.
export const metadata: Metadata = {
  title: 'Nothing stands at this address',
  alternates: { canonical: null },
  openGraph: { url: null },
  robots: { index: false },
};

const linkClassName =
  'font-semibold underline decoration-2 underline-offset-4 hover:decoration-4';

/**
 * The page for an address that leads nowhere, in the site's own picture: the
 * bar with nothing standing on it, and inside it the one mark of an attempt
 * that was sent back.
 */
const NotFound = (): ReactNode => (
  <section className="page-column pb-28 md:pb-36">
    <div className="bleed keeps-colors mt-28 h-20 bg-bar pt-1.5 md:mt-44 md:h-24">
      <svg
        aria-hidden="true"
        viewBox="0 0 7 7"
        className="size-3.5 fill-bar-caught"
      >
        <path d="M0 0h7v2.5H0zM0 4.5h7V7H0z" />
      </svg>
    </div>
    <p className="mt-8 font-mono text-muted-foreground">404</p>
    <h1 className="mt-2 font-bold text-4xl leading-[1.05] tracking-tight md:text-6xl">
      Nothing stands at this address.
    </h1>
    <p className="mt-4 max-w-2xl text-lg md:text-xl md:leading-snug">
      The page may have moved, or the address has a typo in it.
    </p>
    <p className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
      <Link href="/" className={linkClassName}>
        Go to the home page
      </Link>
      <Link href="/posts" className={linkClassName}>
        See all articles
      </Link>
    </p>
  </section>
);

export default NotFound;
