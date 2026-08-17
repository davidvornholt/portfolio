import type { Metadata } from 'next';
import { LabScreen } from '@/features/lab/presentation/screens/lab-screen';

export const metadata: Metadata = {
  title: 'The creative lab',
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

const LabPage = () => <LabScreen />;

export default LabPage;
