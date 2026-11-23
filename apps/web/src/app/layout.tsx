import type { Metadata, Viewport } from 'next';
import { IBM_Plex_Mono, Sofia_Sans } from 'next/font/google';
import './globals.css';
import { themeAnchorColors } from '@portfolio/ui/theme-anchor-colors';
import type { ReactNode } from 'react';
import { siteUrl } from '@/config/site';
import { AnalyticsScript } from '@/shared/analytics/presentation/components/analytics-script';
import { Footer } from '@/shared/page/presentation/components/footer';
import { Header } from '@/shared/page/presentation/components/header';

// Sofia Sans follows the proportions of DIN 1451, the lettering of German
// standards. It sets everything but code.
const sofiaSans = Sofia_Sans({
  variable: '--font-sans',
  subsets: ['latin'],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  weight: ['400', '500'],
});

const siteDescription =
  'Co-founder and CTO of ProsaBridge and founder of Atrium. AI writes most of my code, and every change has to pass the same automated checks before it goes live.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'David Vornholt | Founder & CTO',
    template: '%s | David Vornholt',
  },
  description: siteDescription,
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
    description: siteDescription,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'David Vornholt | Founder & CTO',
    description: siteDescription,
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
      className={`${sofiaSans.variable} ${ibmPlexMono.variable} antialiased`}
    >
      <Header />
      <main>{children}</main>
      <Footer />
      <AnalyticsScript />
    </body>
  </html>
);

export default RootLayout;
