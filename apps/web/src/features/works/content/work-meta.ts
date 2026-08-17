import type { ReactNode } from 'react';

export type WorkMeta = Readonly<{
  title: string;
  subtitle: string;
  slug: string;
  date: string;
  timeline: string;
  role: string;
  techStack: ReadonlyArray<string>;
  liveUrl?: string;
  summary: string;
  outcome: string;
}>;

export type Work = Readonly<{
  meta: WorkMeta;
  body: () => ReactNode;
}>;
