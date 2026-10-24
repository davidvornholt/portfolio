import type { ReactNode } from 'react';
import { BackNavigation } from '@/shared/content/presentation/components/back-navigation';

type LegalDocumentProps = Readonly<{
  eyebrow: string;
  title: string;
  lastUpdated: string;
  children: ReactNode;
}>;

/**
 * Legal pages stay static and unanimated: the text must be readable at once,
 * and nothing on them should depend on scrolling into view.
 */
export const LegalDocument = ({
  eyebrow,
  title,
  lastUpdated,
  children,
}: LegalDocumentProps): ReactNode => (
  <>
    <BackNavigation href="/" label="Back to home" />
    <article className="mx-auto max-w-4xl px-6 pt-12 pb-24">
      <header className="mb-12 border-border border-b pb-8">
        <p className="mb-2 font-medium text-primary text-sm uppercase tracking-widest">
          {eyebrow}
        </p>
        <h1 className="font-semibold font-serif text-4xl text-foreground md:text-5xl">
          {title}
        </h1>
        <p className="mt-4 text-muted-foreground text-sm">
          Last updated: {lastUpdated}
        </p>
      </header>
      <div className="max-w-3xl">{children}</div>
    </article>
  </>
);

export const LegalSection = ({
  title,
  children,
}: Readonly<{
  title: string;
  children: ReactNode;
}>): ReactNode => (
  <section className="mb-12">
    <h2 className="mb-4 font-semibold font-serif text-2xl text-foreground">
      {title}
    </h2>
    {children}
  </section>
);

export const LegalAddress = ({
  children,
}: Readonly<{
  children: ReactNode;
}>): ReactNode => (
  <address className="mb-6 text-foreground/80 not-italic leading-relaxed">
    {children}
  </address>
);
