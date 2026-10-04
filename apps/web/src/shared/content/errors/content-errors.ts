import { Schema } from 'effect';

export class ShikiHighlightError extends Schema.TaggedError<ShikiHighlightError>()(
  'ShikiHighlightError',
  {
    language: Schema.String,
    cause: Schema.Defect(),
    message: Schema.String,
  },
) {}
