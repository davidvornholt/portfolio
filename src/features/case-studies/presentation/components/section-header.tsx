import type { ReactNode } from 'react';

type SectionHeaderProps = {
  readonly number: string;
  readonly title: string;
};

export const SectionHeader = ({
  number,
  title,
}: SectionHeaderProps): ReactNode => (
  <div className="mb-8 flex items-baseline gap-4">
    <span className="font-mono text-sm font-medium text-primary">{number}</span>
    <h2 className="font-serif text-3xl font-semibold text-foreground md:text-4xl">
      {title}
    </h2>
  </div>
);
