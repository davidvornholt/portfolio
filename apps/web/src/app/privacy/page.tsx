import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { siteUrl } from '@/config/site';
import { PrivacyScreen } from '@/features/legal/presentation/screens/privacy-screen';

const privacyDescription =
  'Which personal data david.vornholt.online processes, why, and which rights you have under the GDPR.';

export const metadata: Metadata = {
  title: 'Privacy notice',
  description: privacyDescription,
  alternates: {
    canonical: `${siteUrl}/privacy`,
  },
  openGraph: {
    type: 'website',
    url: `${siteUrl}/privacy`,
    title: 'Privacy notice',
    description: privacyDescription,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy notice',
    description: privacyDescription,
  },
};

const PrivacyPage = (): ReactNode => <PrivacyScreen />;

export default PrivacyPage;
