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
    <BackNavigation href="/" label="Home" />
    <article className="page-column pt-8 pb-24 md:pt-12">
      <header className="mb-12">
        <h1 className="font-bold text-4xl leading-[1.05] tracking-tight md:text-6xl">
          {title}
        </h1>
        <p className="mt-4 text-muted-foreground">
          {eyebrow}, last updated {lastUpdated}
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
    <h2 className="mb-4 font-bold text-2xl tracking-tight">{title}</h2>
    {children}
  </section>
);

export const LegalAddress = ({
  children,
}: Readonly<{
  children: ReactNode;
}>): ReactNode => (
  <address className="mb-6 text-lg not-italic leading-relaxed">
    {children}
  </address>
);
