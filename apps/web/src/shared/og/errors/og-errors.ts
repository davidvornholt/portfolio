import { Data } from 'effect';

export class GoogleFontRequestError extends Data.TaggedError(
  'GoogleFontRequestError',
)<{
  readonly family: string;
  readonly resource: 'CSS' | 'font';
  readonly url: string;
  readonly cause: unknown;
  readonly message: string;
}> {}

export class GoogleFontHttpError extends Data.TaggedError(
  'GoogleFontHttpError',
)<{
  readonly family: string;
  readonly resource: 'CSS' | 'font';
  readonly url: string;
  readonly status: number;
  readonly message: string;
}> {}

export class GoogleFontCssResponseError extends Data.TaggedError(
  'GoogleFontCssResponseError',
)<{
  readonly family: string;
  readonly url: string;
  readonly message: string;
}> {}

export class GoogleFontDownloadError extends Data.TaggedError(
  'GoogleFontDownloadError',
)<{
  readonly family: string;
  readonly url: string;
  readonly cause: unknown;
  readonly message: string;
}> {}

export class OgImageResponseError extends Data.TaggedError(
  'OgImageResponseError',
)<{
  readonly message: string;
  readonly cause: unknown;
}> {}
