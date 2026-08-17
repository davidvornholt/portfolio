import { atriumWork } from './atrium';
import { fesKirchheimWork } from './fes-kirchheim';
import { prosabridgeWork } from './prosabridge';
import type { Work } from './work-meta';

export const works: ReadonlyArray<Work> = [
  atriumWork,
  prosabridgeWork,
  fesKirchheimWork,
];

export const getWorkBySlug = (slug: string): Work | undefined =>
  works.find((work) => work.meta.slug === slug);
