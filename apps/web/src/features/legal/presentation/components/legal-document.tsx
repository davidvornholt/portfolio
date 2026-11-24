import type { ReactNode } from 'react';
import { BackNavigation } from '@/shared/content/presentation/components/back-navigation';

type LegalDocumentProps = Readonly<{
  eyebrow: string;
  title: string;
  lastUpdated: string;
  children: ReactNode;
}>;

/** Legal text must be readable at once without scrolling into view. */
export const LegalDocument = ({
  eyebrow,
  title,
  lastUpdated,
  children,
}: LegalDocumentProps): ReactNode => (
  <>
    <BackNavigation href="/" label="Back to home" />
    <article className="folio-wrap grid gap-8 py-16 md:grid-cols-[1fr_1.4fr]">
      <header className="self-start border-foreground border-t-2 pt-4">
        <p className="folio-label mb-3 text-welcome">{eyebrow}</p>
        <h1 className="folio-heading">{title}</h1>
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
