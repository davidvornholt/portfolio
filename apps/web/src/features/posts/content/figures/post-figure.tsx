import type { ReactNode } from 'react';

/** A figure in an article: what it shows, and under it what it was drawn from. */
export const PostFigure = ({
  title,
  caption,
  wide = false,
  children,
}: Readonly<{
  title?: string;
  caption: ReactNode;
  /** Stands between sections and may be wider than the text. */
  wide?: boolean;
  children: ReactNode;
}>): ReactNode => (
  <figure
    className="my-10 border-foreground border-t-2 pt-4 data-wide:mt-14 data-wide:max-w-6xl"
    data-wide={wide ? '' : undefined}
  >
    {title === undefined ? null : <p className="mb-6 font-bold">{title}</p>}
    {children}
    <figcaption className="mt-5 text-muted-foreground text-sm leading-relaxed">
      {caption}
    </figcaption>
  </figure>
);

export type FigureNumber = Readonly<{
  value: string;
  label: string;
}>;

/** A row of large numbers, each with the few words that say what it counts. */
export const FigureNumbers = ({
  numbers,
}: {
  readonly numbers: ReadonlyArray<FigureNumber>;
}): ReactNode => (
  <dl className="grid gap-x-8 gap-y-6 sm:grid-cols-3">
    {numbers.map((number) => (
      <div key={number.label} className="flex flex-col-reverse justify-end">
        <dt className="mt-1 text-muted-foreground leading-snug">
          {number.label}
        </dt>
        <dd className="font-bold text-5xl tabular-nums tracking-tight">
          {number.value}
        </dd>
      </div>
    ))}
  </dl>
);
