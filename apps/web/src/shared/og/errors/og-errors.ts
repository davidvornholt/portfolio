import { Schema } from 'effect';

const GoogleFontResource = Schema.Literals(['CSS', 'font']);

export class GoogleFontRequestError extends Schema.TaggedError<GoogleFontRequestError>()(
  'GoogleFontRequestError',
  {
    family: Schema.String,
    resource: GoogleFontResource,
    url: Schema.String,
    cause: Schema.Defect(),
    message: Schema.String,
  },
) {}

export class GoogleFontHttpError extends Schema.TaggedError<GoogleFontHttpError>()(
  'GoogleFontHttpError',
  {
    family: Schema.String,
    resource: GoogleFontResource,
    url: Schema.String,
    status: Schema.Number,
    message: Schema.String,
  },
) {}

export class GoogleFontCssResponseError extends Schema.TaggedError<GoogleFontCssResponseError>()(
  'GoogleFontCssResponseError',
  {
    family: Schema.String,
    url: Schema.String,
    message: Schema.String,
  },
) {}

export class GoogleFontDownloadError extends Schema.TaggedError<GoogleFontDownloadError>()(
  'GoogleFontDownloadError',
  {
    family: Schema.String,
    url: Schema.String,
    cause: Schema.Defect(),
    message: Schema.String,
  },
) {}

export class OgImageResponseError extends Schema.TaggedError<OgImageResponseError>()(
  'OgImageResponseError',
  {
    message: Schema.String,
    cause: Schema.Defect(),
  },
) {}
