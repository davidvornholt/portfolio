import type { StaticImageData } from 'next/image';
import type { ReactNode } from 'react';

export type WorkMeta = Readonly<{
  title: string;
  /** What it is, in a few plain words. */
  subtitle: string;
  slug: string;
  date: string;
  /** When the work began, as it reads after "Since". */
  since: string;
  role: string;
  /** Where the work stands today. */
  stage: string;
  techStack: ReadonlyArray<string>;
  liveUrl?: string;
  summary: string;
  image: Readonly<{
    src: StaticImageData;
    alt: string;
    /** Says what the picture is when it is not the product as it runs today. */
    caption?: string;
  }>;
}>;

export type Work = Readonly<{
  meta: WorkMeta;
  body: () => ReactNode;
}>;
