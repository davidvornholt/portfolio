import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { siteUrl } from '@/config/site';
import { ImpressumScreen } from '@/features/legal/presentation/screens/impressum-screen';

const impressumDescription =
  'Legal notice (Impressum) for david.vornholt.online under § 5 DDG and § 18 MStV.';

export const metadata: Metadata = {
  title: 'Legal notice / Impressum',
  description: impressumDescription,
  alternates: {
    canonical: `${siteUrl}/impressum`,
  },
  openGraph: {
    type: 'website',
    url: `${siteUrl}/impressum`,
    title: 'Legal notice / Impressum',
    description: impressumDescription,
  },
};

const ImpressumPage = (): ReactNode => <ImpressumScreen />;

export default ImpressumPage;
