import { Data } from 'effect';

export class ShikiHighlightError extends Data.TaggedError(
  'ShikiHighlightError',
)<{
  readonly language: string;
  readonly cause: unknown;
  readonly message: string;
}> {}
