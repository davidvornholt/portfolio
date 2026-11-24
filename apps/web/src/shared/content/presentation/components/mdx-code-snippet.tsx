import type { ReactNode } from 'react';
import { getMdxNodeText } from './mdx-node-text';
import { SyntaxHighlighter } from './syntax-highlighter';

const reindentCode = (source: string): string => {
  const lines = source.split('\n');
  const result: Array<string> = [];
  let depth = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('}') || trimmed.startsWith(')')) {
      depth = Math.max(0, depth - 1);
    }

    const needsIndent = line === trimmed && depth > 0;
    result.push(needsIndent ? `${'  '.repeat(depth)}${trimmed}` : line);

    if (trimmed.endsWith('{') || trimmed.endsWith('(')) {
      depth += 1;
    }
  }

  return result.join('\n');
};

export const MDXCodeSnippet = ({
  language = 'typescript',
  title,
  code: codeProp,
  wrap = false,
  children,
}: Readonly<{
  language?: string;
  title?: string;
  code?: string;
  /** Breaks long lines instead of scrolling, for output that isn't code. */
  wrap?: boolean;
  children?: ReactNode;
}>): ReactNode => {
  const source = (codeProp ?? getMdxNodeText(children)).trim();
  const code = reindentCode(source);

  return (
    <div className="my-8 bg-muted">
      {title === undefined ? null : (
        <div className="flex items-baseline justify-between gap-4 px-4 pt-4 text-muted-foreground text-sm">
          <span className="wrap-anywhere min-w-0">{title}</span>
          <span className="shrink-0">{language}</span>
        </div>
      )}
      <SyntaxHighlighter code={code} language={language} wrap={wrap} />
    </div>
  );
};
