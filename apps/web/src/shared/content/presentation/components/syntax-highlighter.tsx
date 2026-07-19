'use client';

import { useEffect, useState } from 'react';
import { type BundledLanguage, type BundledTheme, codeToHtml } from 'shiki';

type SyntaxHighlighterProps = Readonly<{
  code: string;
  language: string;
  theme?: BundledTheme;
}>;

/**
 * Client-side syntax highlighter using Shiki.
 * Provides VSCode-quality syntax highlighting with support for many languages.
 * Uses a light theme to match the portfolio's design.
 */
export const SyntaxHighlighter = ({
  code,
  language,
  theme = 'github-light',
}: SyntaxHighlighterProps): React.ReactNode => {
  const [highlightedHtml, setHighlightedHtml] = useState<string | null>(null);

  useEffect(() => {
    const highlight = async (): Promise<void> => {
      try {
        const html = await codeToHtml(code, {
          lang: language as BundledLanguage,
          theme,
        });
        setHighlightedHtml(html);
      } catch {
        // Fallback to plain code if language not supported
        setHighlightedHtml(null);
      }
    };

    highlight().catch(() => setHighlightedHtml(null));
  }, [code, language, theme]);

  // Show loading state or plain code while highlighting
  if (highlightedHtml === null) {
    return (
      <pre className="overflow-x-auto p-4">
        <code className="font-mono text-foreground/90 text-sm leading-relaxed">
          {code}
        </code>
      </pre>
    );
  }

  return (
    <div
      className="shiki-wrapper [&_pre]:!m-0 [&_pre]:!bg-transparent overflow-x-auto [&_code]:font-mono [&_code]:text-sm [&_code]:leading-relaxed [&_pre]:p-4"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: Shiki output is trusted
      dangerouslySetInnerHTML={{ __html: highlightedHtml }}
    />
  );
};
