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
    <span className="font-medium font-mono text-primary text-sm">{number}</span>
    <h2 className="font-semibold font-serif text-3xl text-foreground md:text-4xl">
      {title}
    </h2>
  </div>
);
