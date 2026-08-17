import { Effect } from 'effect';
import {
  type BundledLanguage,
  codeToHtml,
  type ThemeRegistrationAny,
} from 'shiki';
import { ShikiHighlightError } from '../errors/content-errors';

export const highlightCode = ({
  code,
  language,
  theme,
}: Readonly<{
  code: string;
  language: string;
  theme: ThemeRegistrationAny;
}>) =>
  Effect.tryPromise({
    try: () =>
      codeToHtml(code, {
        lang: language as BundledLanguage,
        theme,
      }),
    catch: (cause) =>
      new ShikiHighlightError({
        language,
        cause,
        message: `Shiki failed to highlight ${language} code: ${String(cause)}`,
      }),
  });
