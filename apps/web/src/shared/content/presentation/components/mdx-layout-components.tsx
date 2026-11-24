import type { ReactNode } from 'react';

export const MDXSection = ({
  children,
  className = '',
  ariaLabel,
}: Readonly<{
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
}>): ReactNode => (
  <section className={`mt-16 max-w-3xl ${className}`} aria-label={ariaLabel}>
    {children}
  </section>
);

export const MDXCallout = ({
  title,
  children,
}: Readonly<{
  title?: string;
  children: ReactNode;
}>): ReactNode => (
  <div className="my-8 border-foreground border-l-4 py-1 pl-6 text-lg leading-relaxed">
    {title === undefined ? null : <p className="font-bold">{title}</p>}
    <div className={title === undefined ? 'font-semibold' : 'mt-1'}>
      {children}
    </div>
  </div>
);

export const MDXAttributedBlockquote = ({
  children,
  author,
}: Readonly<{
  children: ReactNode;
  author?: string;
}>): ReactNode => (
  <blockquote className="mt-8 border-border border-l-4 pl-6">
    <div className="font-semibold text-xl leading-snug">{children}</div>
    {author === undefined ? null : (
      <footer className="mt-3 text-muted-foreground">{author}</footer>
    )}
  </blockquote>
);

export const MDXCheckItem = ({
  title,
  description,
}: Readonly<{
  title: string;
  description: string;
}>): ReactNode => (
  <li className="border-border border-b py-4">
    <p className="font-bold text-lg">{title}</p>
    <p className="mt-1 text-lg text-muted-foreground leading-relaxed">
      {description}
    </p>
  </li>
);

export const MDXCheckList = ({
  children,
}: {
  readonly children: ReactNode;
}): ReactNode => (
  <ul className="mt-6 border-foreground border-t-2">{children}</ul>
);

export const MDXCallToAction = ({
  title,
  description,
  href,
  linkText,
}: Readonly<{
  title: string;
  description: string;
  href: string;
  linkText: string;
}>): ReactNode => (
  <section className="mt-20 flex max-w-3xl flex-col justify-between gap-6 border-foreground border-t-2 pt-8 sm:flex-row sm:items-center">
    <div>
      <p className="font-bold text-xl tracking-tight">{title}</p>
      <p className="text-lg text-muted-foreground">{description}</p>
    </div>
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-umami-event="content-cta"
      data-umami-event-title={title}
      className="inline-flex h-12 shrink-0 items-center justify-center whitespace-nowrap border-2 border-foreground bg-foreground px-6 font-semibold text-background hover:bg-background hover:text-foreground active:translate-y-px"
    >
      {linkText}
    </a>
  </section>
);
