import { Schema } from 'effect';
import snapshotData from '../data/changes.json' with { type: 'json' };
import { Snapshot } from './snapshot';

/**
 * The snapshot the site is built from, checked against its schema when the
 * module loads. A file that `changes:fetch` did not write whole fails the
 * build instead of drawing a wrong chart.
 */
export const snapshot: Snapshot =
  Schema.decodeUnknownSync(Snapshot)(snapshotData);
