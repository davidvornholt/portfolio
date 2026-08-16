import type { ReactNode } from 'react';
import { type BundledLanguage, codeToHtml } from 'shiki';
import { warmPrintCodeTheme } from './code-theme';

type SyntaxHighlighterProps = Readonly<{
  code: string;
  language: string;
}>;

/**
 * Server-side syntax highlighter using Shiki with the warm-print theme.
 * Highlighting happens at build time, so code blocks ship as static,
 * crawlable HTML with no client-side JavaScript.
 */
export const SyntaxHighlighter = async ({
  code,
  language,
}: SyntaxHighlighterProps): Promise<ReactNode> => {
  try {
    const html = await codeToHtml(code, {
      lang: language as BundledLanguage,
      theme: warmPrintCodeTheme,
    });
    return (
      <div
        className="overflow-x-auto [&_code]:font-mono [&_code]:text-sm [&_code]:leading-relaxed [&_pre]:m-0 [&_pre]:p-4"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Shiki output is trusted
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  } catch {
    return (
      <pre className="overflow-x-auto p-4">
        <code className="font-mono text-foreground/90 text-sm leading-relaxed">
          {code}
        </code>
      </pre>
    );
  }
};
