import type { Metadata, Viewport } from 'next';
import { IBM_Plex_Mono, IBM_Plex_Sans, Source_Serif_4 } from 'next/font/google';
import './globals.css';
import Script from 'next/script';
import type { ReactNode } from 'react';
import {
  umamiScriptUrl,
  umamiTrackedDomain,
  umamiWebsiteId,
} from '@/config/analytics';
import { siteUrl } from '@/config/site';
import { Footer } from '@/shared/page/presentation/components/footer';
import { MotionProvider } from '@/shared/ui/presentation/components/motion-provider';
import { themeAnchorColors } from '@/shared/ui/services/theme-anchor-colors';
import { Header } from '../shared/page/presentation/components/header';

const ibmPlexSans = IBM_Plex_Sans({
  variable: '--font-sans',
  subsets: ['latin'],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  weight: ['400', '700'],
});

const sourceSerif4 = Source_Serif_4({
  variable: '--font-serif',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'David Vornholt | Founder & CTO',
    template: '%s | David Vornholt',
  },
  description:
    'Founder of Atrium and co-founder & CTO of ProsaBridge. Agents write most of my code, and strict quality gates decide what ships.',
  keywords: [
    'Founder',
    'CTO',
    'Atrium',
    'ProsaBridge',
    'TypeScript',
    'Effect',
    'Next.js',
    'AI engineering',
    'Functional programming',
    'Web development',
  ],
  authors: [{ name: 'David Vornholt', url: siteUrl }],
  creator: 'David Vornholt',
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'David Vornholt',
    title: 'David Vornholt | Founder & CTO',
    description:
      'Speaking the languages of humans and machines with equal precision.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'David Vornholt | Founder & CTO',
    description:
      'Speaking the languages of humans and machines with equal precision.',
    creator: '@davidvornholt',
  },
};

export const viewport: Viewport = {
  themeColor: themeAnchorColors.paper100,
};

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'David Vornholt',
  jobTitle: 'Founder & CTO',
  url: siteUrl,
  image: `${siteUrl}/portrait.png`,
  sameAs: [
    'https://www.linkedin.com/in/david-vornholt-055239366',
    'https://github.com/davidvornholt',
    'https://x.com/davidvornholt',
  ],
  knowsAbout: [
    'TypeScript',
    'Effect',
    'Next.js',
    'AI engineering',
    'Software architecture',
    'Functional programming',
    'Web development',
  ],
} as const;

const webSiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'David Vornholt',
  url: siteUrl,
  author: {
    '@type': 'Person',
    name: 'David Vornholt',
    url: siteUrl,
  },
} as const;

const RootLayout = ({
  children,
}: Readonly<{
  children: ReactNode;
}>): ReactNode => (
  <html lang="en" className="motion-safe:scroll-smooth">
    <head>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Next.js JSON-LD requires a serialized script payload from this static object.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Next.js JSON-LD requires a serialized script payload from this static object.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
      />
    </head>
    <body
      className={`${ibmPlexSans.variable} ${ibmPlexMono.variable} ${sourceSerif4.variable} antialiased`}
    >
      <MotionProvider>
        <Header />
        <main>{children}</main>
        <Footer />
      </MotionProvider>
      <Script
        src={umamiScriptUrl}
        data-website-id={umamiWebsiteId}
        data-domains={umamiTrackedDomain}
        strategy="afterInteractive"
      />
    </body>
  </html>
);

export default RootLayout;
