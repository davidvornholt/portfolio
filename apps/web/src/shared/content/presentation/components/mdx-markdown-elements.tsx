import type { ReactNode } from 'react';

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

export const MDXParagraph = ({
  children,
}: {
  readonly children: ReactNode;
}): ReactNode => <p className="my-5 text-lg leading-relaxed">{children}</p>;

export const MDXStrong = ({
  children,
}: {
  readonly children: ReactNode;
}): ReactNode => <strong className="font-bold">{children}</strong>;

export const MDXUnorderedList = ({
  children,
}: {
  readonly children: ReactNode;
}): ReactNode => (
  <ul className="my-5 list-disc space-y-2 pl-6 text-lg leading-relaxed">
    {children}
  </ul>
);

export const MDXOrderedList = ({
  children,
}: {
  readonly children: ReactNode;
}): ReactNode => (
  <ol className="my-5 list-decimal space-y-2 pl-6 text-lg leading-relaxed">
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
