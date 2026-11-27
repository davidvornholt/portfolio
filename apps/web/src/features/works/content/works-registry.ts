import { atriumWork } from './atrium';
import { fesKirchheimWork } from './fes-kirchheim';
import { prosabridgeWork } from './prosabridge';
import type { Work } from './work-meta';

// ProsaBridge leads: it is David's company and the first thing the home page
// says about him.
export const works: ReadonlyArray<Work> = [
  prosabridgeWork,
  atriumWork,
  fesKirchheimWork,
];

export const getWorkBySlug = (slug: string): Work | undefined =>
  works.find((work) => work.meta.slug === slug);
