import type { Metadata } from 'next';
import { siteUrl } from '@/config/site';
import { LabScreen } from '@/features/lab/presentation/screens/lab-screen';
import { PageTransition } from '@/shared/page/presentation/components/page-transitions';

const labTitle = 'The creative lab';
const labDescription =
  'Films I have made: short films, a documentary, and an ad, in French and German.';

// The lab stays out of search results through `noindex` alone. Crawlers must
// be able to fetch the page to read it, so robots.txt doesn't block `/lab`.
export const metadata: Metadata = {
  title: labTitle,
  description: labDescription,
  alternates: {
    canonical: `${siteUrl}/lab`,
  },
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  openGraph: {
    type: 'website',
    url: `${siteUrl}/lab`,
    title: labTitle,
    description: labDescription,
  },
  twitter: {
    card: 'summary_large_image',
    title: labTitle,
    description: labDescription,
  },
};

const LabPage = () => (
  <PageTransition>
    <LabScreen />
  </PageTransition>
);

export default LabPage;
