import type { Metadata } from 'next';
import { LabScreen } from '@/features/lab/presentation/screens/lab-screen';

export const metadata: Metadata = {
  title: 'The Creative Lab | David Vornholt',
  description:
    'A private archive of early experiments in visual storytelling and media.',
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default LabScreen;
