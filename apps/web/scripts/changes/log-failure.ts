import { Effect } from 'effect';

/**
 * Logs the message of the error a run failed with, and nothing else of it.
 * The log of a run is public, so every error raised under `scripts/changes`
 * builds its message from fixed text and facts that are safe to print.
 */
export const logFailure = <A, E extends Readonly<{ message: string }>, R>(
  effect: Effect.Effect<A, E, R>,
): Effect.Effect<A, E, R> =>
  Effect.tapError(effect, (error) => Effect.logError(error.message));
