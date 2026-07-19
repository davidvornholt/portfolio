import { Children, isValidElement, type ReactNode } from 'react';
import { Separator } from '@/shared/ui/presentation/components/separator';
import { getMdxNodeText } from './mdx-node-text';

const sectionHeaderPattern = /^(?<number>\d{2})\s+(?<title>.+)$/u;

const parseSectionHeader = (
  children: ReactNode,
): { readonly number: string; readonly title: string } | null => {
  const match = sectionHeaderPattern.exec(getMdxNodeText(children));
  const number = match?.groups?.number;
  const title = match?.groups?.title;
  return number === undefined || title === undefined ? null : { number, title };
};

export const MDXHeadingOne = ({
  children,
}: {
  readonly children: ReactNode;
}): ReactNode => {
  const parsed = parseSectionHeader(children);
  if (parsed === null) {
    return (
      <h1 className="mb-6 font-semibold font-serif text-4xl text-foreground md:text-5xl">
        {children}
      </h1>
    );
  }

  return (
    <header className="mb-8 flex items-baseline gap-4">
      <span
        className="font-medium font-mono text-primary text-sm"
        aria-hidden="true"
      >
        {parsed.number}
      </span>
      <h2 className="font-semibold font-serif text-3xl text-foreground md:text-4xl">
        {parsed.title}
      </h2>
    </header>
  );
};

export const MDXHeadingTwo = ({
  children,
}: {
  readonly children: ReactNode;
}): ReactNode => (
  <p className="mb-6 font-medium text-foreground text-lg">{children}</p>
);

export const MDXHeadingThree = ({
  children,
}: {
  readonly children: ReactNode;
}): ReactNode => (
  <h3 className="mt-8 mb-4 font-semibold text-foreground text-xl">
    {children}
  </h3>
);

export const MDXParagraph = ({
  children,
}: {
  readonly children: ReactNode;
}): ReactNode => (
  <p className="mb-6 text-foreground/80 leading-relaxed">{children}</p>
);

export const MDXStrong = ({
  children,
}: {
  readonly children: ReactNode;
}): ReactNode => (
  <strong className="font-semibold text-foreground">{children}</strong>
);

export const MDXEmphasis = ({
  children,
}: {
  readonly children: ReactNode;
}): ReactNode => <em className="font-serif italic">{children}</em>;

export const MDXBlockquote = ({
  children,
}: {
  readonly children: ReactNode;
}): ReactNode => {
  const nodes = Children.toArray(children);
  const citeNode = nodes.find(
    (node) => isValidElement(node) && node.type === 'cite',
  );
  const author =
    citeNode === undefined || !isValidElement(citeNode)
      ? undefined
      : getMdxNodeText(
          (citeNode.props as { readonly children?: ReactNode }).children,
        );
  const quoteNodes =
    author === undefined
      ? nodes
      : nodes.filter((node) => !(isValidElement(node) && node.type === 'cite'));

  return (
    <blockquote className="relative mt-8 rounded-lg border border-border bg-card p-8">
      <div className="absolute -top-3 left-6 bg-background px-2">
        <span className="font-serif text-4xl text-primary">&ldquo;</span>
      </div>
      <div className="font-serif text-foreground text-lg italic">
        {quoteNodes}
      </div>
      {author === undefined ? null : (
        <footer className="mt-4 text-muted-foreground text-sm">
          — {author}
        </footer>
      )}
    </blockquote>
  );
};

export const MDXUnorderedList = ({
  children,
}: {
  readonly children: ReactNode;
}): ReactNode => (
  <ul className="mb-6 list-disc space-y-2 pl-6 text-foreground/80">
    {children}
  </ul>
);

export const MDXOrderedList = ({
  children,
}: {
  readonly children: ReactNode;
}): ReactNode => (
  <ol className="mb-6 list-decimal space-y-2 pl-6 text-foreground/80">
    {children}
  </ol>
);

export const MDXListItem = ({
  children,
}: {
  readonly children: ReactNode;
}): ReactNode => <li>{children}</li>;

export const MDXAnchor = ({
  href,
  children,
}: {
  readonly href?: string;
  readonly children: ReactNode;
}): ReactNode => {
  const isExternal = href?.startsWith('http') === true;
  return (
    <a
      href={href}
      className="font-medium text-primary underline decoration-primary/30 underline-offset-4 transition-colors hover:text-primary/80"
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
    >
      {children}
    </a>
  );
};

export const MDXHorizontalRule = (): ReactNode => (
  <Separator className="my-8" />
);
