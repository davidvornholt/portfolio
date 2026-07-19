import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { section as MotionSection } from 'motion/react-client';
import type { ReactNode } from 'react';
import { Separator } from '@/shared/ui/presentation/components/separator';
import { fadeInUp } from './mdx-motion';

export const MDXSection = ({
  children,
  className = '',
  ariaLabel,
}: Readonly<{
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
}>): ReactNode => (
  <MotionSection
    {...fadeInUp}
    transition={{ duration: 0.6, ease: 'easeOut' }}
    className={`mx-auto mb-20 max-w-4xl px-6 ${className}`}
    aria-label={ariaLabel}
  >
    {children}
  </MotionSection>
);

export const MDXCallout = ({
  title,
  children,
}: Readonly<{
  title?: string;
  children: ReactNode;
}>): ReactNode => (
  <div className="my-8 rounded-lg border-primary border-l-4 bg-primary/5 p-6">
    {title === undefined ? null : (
      <p className="font-medium text-foreground">{title}</p>
    )}
    <div className="mt-2 text-foreground/80">{children}</div>
  </div>
);

export const MDXAttributedBlockquote = ({
  children,
  author,
}: Readonly<{
  children: ReactNode;
  author?: string;
}>): ReactNode => (
  <blockquote className="relative mt-8 rounded-lg border border-border bg-card p-8">
    <div className="absolute -top-3 left-6 bg-background px-2">
      <span className="font-serif text-4xl text-primary">&ldquo;</span>
    </div>
    <div className="font-serif text-foreground text-lg italic">{children}</div>
    {author === undefined ? null : (
      <footer className="mt-4 text-muted-foreground text-sm">— {author}</footer>
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
  <div className="flex gap-4">
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
      <CheckCircle2 className="h-4 w-4 text-primary" />
    </div>
    <div>
      <p className="font-medium text-foreground">{title}</p>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  </div>
);

export const MDXCheckList = ({
  children,
}: {
  readonly children: ReactNode;
}): ReactNode => <div className="mt-8 space-y-4">{children}</div>;

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
  <MotionSection
    {...fadeInUp}
    transition={{ duration: 0.6, ease: 'easeOut' }}
    className="mx-auto max-w-4xl px-6"
  >
    <Separator className="mb-16" />
    <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
      <div>
        <p className="font-semibold font-serif text-foreground text-xl">
          {title}
        </p>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex h-10 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary px-6 font-medium text-primary-foreground text-sm transition-colors hover:bg-primary/80"
      >
        {linkText}
        <ArrowUpRight className="h-4 w-4" />
      </a>
    </div>
  </MotionSection>
);
