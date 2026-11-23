import { Children, isValidElement, type ReactNode } from 'react';
import { getMdxNodeText } from './mdx-node-text';

/** The heading of a section. The page's own title is the first-level one. */
export const MDXHeadingOne = ({
  children,
}: {
  readonly children: ReactNode;
}): ReactNode => (
  <h2 className="font-bold text-2xl tracking-tight md:text-[2rem] md:leading-tight">
    {children}
  </h2>
);

/** The sentence under a section's heading that says what the section finds. */
export const MDXHeadingTwo = ({
  children,
}: {
  readonly children: ReactNode;
}): ReactNode => (
  <p className="mt-3 mb-6 font-semibold text-xl leading-snug">{children}</p>
);

export const MDXHeadingThree = ({
  children,
}: {
  readonly children: ReactNode;
}): ReactNode => (
  <h3 className="mt-8 mb-3 font-bold text-xl tracking-tight">{children}</h3>
);

export const MDXParagraph = ({
  children,
}: {
  readonly children: ReactNode;
}): ReactNode => (
  <p className="mt-5 mb-5 text-lg leading-relaxed">{children}</p>
);

export const MDXStrong = ({
  children,
}: {
  readonly children: ReactNode;
}): ReactNode => <strong className="font-bold">{children}</strong>;

export const MDXEmphasis = ({
  children,
}: {
  readonly children: ReactNode;
}): ReactNode => <em className="italic">{children}</em>;

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
    <blockquote className="mt-8 border-border border-l-4 pl-6">
      <div className="font-semibold text-xl leading-snug">{quoteNodes}</div>
      {author === undefined ? null : (
        <footer className="mt-3 text-muted-foreground">{author}</footer>
      )}
    </blockquote>
  );
};

export const MDXUnorderedList = ({
  children,
}: {
  readonly children: ReactNode;
}): ReactNode => (
  <ul className="mb-6 list-disc space-y-2 pl-6 text-lg leading-relaxed">
    {children}
  </ul>
);

export const MDXOrderedList = ({
  children,
}: {
  readonly children: ReactNode;
}): ReactNode => (
  <ol className="mb-6 list-decimal space-y-2 pl-6 text-lg leading-relaxed">
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
      className="font-semibold underline decoration-2 underline-offset-4 hover:decoration-4"
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
    >
      {children}
    </a>
  );
};

export const MDXHorizontalRule = (): ReactNode => (
  <hr className="my-8 border-border" />
);
