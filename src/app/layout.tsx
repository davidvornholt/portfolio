import type { Metadata } from 'next';
import {
  IBM_Plex_Mono,
  IBM_Plex_Sans,
  Inter,
  Source_Serif_4,
} from 'next/font/google';
import './globals.css';
import type { ReactNode } from 'react';
import { siteUrl } from '@/config/site';
import { Footer } from '@/shared/page/presentation/components/footer';
import { cn } from '@/shared/ui/services/utils';
import { Header } from '../shared/page/presentation/components/header';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

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
    default: 'David Vornholt | Full Stack Developer',
    template: '%s | David Vornholt',
  },
  description:
    'Fluent in four languages and the strict logic of functional programming, I bridge the divide between complex technical systems and the people they serve.',
  keywords: [
    'Digital Experience Architect',
    'Software Engineering',
    'Full Stack Developer',
    'TypeScript',
    'Next.js',
    'Clean Code',
    'Functional Programming',
    'React',
    'Web Development',
  ],
  authors: [{ name: 'David Vornholt', url: siteUrl }],
  creator: 'David Vornholt',
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
    title: 'David Vornholt | Full Stack Developer',
    description:
      'Speaking the languages of humans and machines with equal precision.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 1200,
        alt: 'David Vornholt - Full Stack Developer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'David Vornholt | Full Stack Developer',
    description:
      'Speaking the languages of humans and machines with equal precision.',
    creator: '@davidvornholt',
    images: ['/og-image.png'],
  },
};

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'David Vornholt',
  jobTitle: 'Digital Experience Architect',
  url: siteUrl,
  image: `${siteUrl}/og-image.png`,
  sameAs: [
    'https://www.linkedin.com/in/david-vornholt-055239366',
    'https://github.com/davidvornholt',
    'https://x.com/davidvornholt',
  ],
  knowsAbout: [
    'Next.js',
    'TypeScript',
    'Clean Code',
    'Functional Programming',
    'React',
    'Software Architecture',
    'Web Development',
  ],
} as const;

const RootLayout = ({
  children,
}: Readonly<{
  children: ReactNode;
}>): ReactNode => {
  return (
    <html lang="en" className={cn('scroll-smooth', inter.variable)}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body
        className={`${ibmPlexSans.variable} ${ibmPlexMono.variable} ${sourceSerif4.variable} antialiased`}
      >
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
};

export default RootLayout;
