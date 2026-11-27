import { Effect } from 'effect';
import type { ReactNode } from 'react';
import { highlightCode } from '@/shared/content/services/syntax-highlighting';
import { inkCodeTheme } from './code-theme';

type SyntaxHighlighterProps = Readonly<{
  code: string;
  language: string;
}>;

/**
 * Server-side syntax highlighter using Shiki with the ink theme.
 * Highlighting happens at build time, so code blocks ship as static,
 * crawlable HTML with no client-side JavaScript.
 */
export const SyntaxHighlighter = async ({
  code,
  language,
}: SyntaxHighlighterProps): Promise<ReactNode> => {
  const html = await Effect.runPromise(
    highlightCode({ code, language, theme: inkCodeTheme }),
  );

  return (
    <div
      className="overflow-x-auto [&_code]:font-mono [&_code]:text-sm [&_code]:leading-relaxed [&_pre]:m-0 [&_pre]:p-4"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: Shiki output is trusted
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
