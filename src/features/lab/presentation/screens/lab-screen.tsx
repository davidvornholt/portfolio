import type { ReactNode } from 'react';
import { LabHero } from '../components/lab-hero';
import { VideoArchive } from '../components/video-archive';

export const LabScreen = (): ReactNode => (
  <>
    <LabHero />
    <VideoArchive />
  </>
);
