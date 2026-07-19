import { Code2 } from 'lucide-react';
import { div as MotionDiv } from 'motion/react-client';
import type { ReactNode } from 'react';
import { Badge } from '@/shared/ui/presentation/components/badge';
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
  children,
}: Readonly<{
  language?: string;
  title?: string;
  code?: string;
  children?: ReactNode;
}>): ReactNode => {
  const source = (codeProp ?? getMdxNodeText(children)).trim();
  const code = reindentCode(source);

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="my-8 overflow-hidden rounded-lg border border-border"
    >
      {title === undefined ? null : (
        <div className="flex items-center gap-2 border-border border-b bg-muted/50 px-4 py-3">
          <Code2 className="h-4 w-4 text-muted-foreground" />
          <span className="font-mono text-muted-foreground text-xs">
            {title}
          </span>
          <Badge variant="outline" className="ml-auto text-xs">
            {language}
          </Badge>
        </div>
      )}
      <div className="bg-card">
        <SyntaxHighlighter code={code} language={language} />
      </div>
    </MotionDiv>
  );
};
