import type { Metadata } from 'next';
import { IBM_Plex_Mono, IBM_Plex_Sans, Inter, Lora } from 'next/font/google';
import './globals.css';
import type { ReactNode } from 'react';
import { Footer } from '@/shared/page/presentation/components/footer';
import { cn } from '@/shared/ui/services/utils';
import { Header } from '../shared/page/presentation/components/header';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const ibmPlexSans = IBM_Plex_Sans({
  variable: '--font-ibm-plex-sans',
  subsets: ['latin'],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: '--font-ibm-plex-mono',
  subsets: ['latin'],
  weight: ['400', '700'],
});

const lora = Lora({
  variable: '--font-lora',
  subsets: ['latin'],
});

// const sourceSerif4 = Source_Serif_4({
//   variable: "--font-source-serif-4",
//   subsets: ["latin"],
// })

// const sourceSans3 = Source_Sans_3({
//   variable: "--font-source-sans-3",
//   subsets: ["latin"],
// })

export const metadata: Metadata = {
  title: 'David Vornholt | Full Stack Developer & Digital Experience Architect',
  description:
    'Fluent in four languages and the strict logic of functional programming, I bridge the divide between complex technical systems and the people they serve.',
  keywords: [
    'Full Stack Developer',
    'Digital Experience Architect',
    'TypeScript',
    'Next.js',
    'Clean Code',
    'Functional Programming',
  ],
  authors: [{ name: 'David Vornholt' }],
  openGraph: {
    title: 'David Vornholt | Full Stack Developer',
    description:
      'Speaking the languages of humans and machines with equal precision.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'David Vornholt | Full Stack Developer',
    description:
      'Speaking the languages of humans and machines with equal precision.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className={cn('scroll-smooth', inter.variable)}>
      <body
        className={`${ibmPlexSans.variable} ${ibmPlexMono.variable} ${lora.variable} antialiased`}
      >
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
