import type { ReactNode } from 'react';

/** A home page section: its heading, an optional lede, and its content. */
export const Section = ({
  id,
  heading,
  lede,
  children,
}: Readonly<{
  id: string;
  heading: string;
  lede?: ReactNode;
  children: ReactNode;
}>): ReactNode => (
  <section id={id} className="page-column scroll-mt-8 pt-28 md:pt-36">
    <h2 className="max-w-4xl font-bold text-3xl tracking-tight md:text-5xl md:leading-[1.05]">
      {heading}
    </h2>
    {lede === undefined ? null : (
      <p className="mt-4 max-w-2xl text-lg md:text-xl md:leading-snug">
        {lede}
      </p>
    )}
    {children}
  </section>
);
