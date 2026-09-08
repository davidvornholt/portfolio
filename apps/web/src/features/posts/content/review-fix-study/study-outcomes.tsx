import type { ReactNode } from 'react';

export const StudyFigure = ({
  title,
  caption,
  children,
}: Readonly<{
  title: string;
  caption: string;
  children: ReactNode;
}>): ReactNode => (
  <figure className="my-8 border-border border-y py-6">
    <p className="mb-6 font-semibold text-foreground">{title}</p>
    {children}
    <figcaption className="mt-6 border-border border-t pt-4 text-muted-foreground text-sm leading-relaxed">
      {caption}
    </figcaption>
  </figure>
);

const headlines = [
  {
    value: '3',
    label: 'important bugs Astra found and repaired',
    detail: 'Not independently caught by the cheaper setups.',
  },
  {
    value: '2,494',
    label: 'data-loading calls in five seconds',
    detail: 'A browser test, not paid AI requests.',
  },
  {
    value: '1',
    label: 'Luna repair with a reproduced failure',
    detail: 'Caught before it shipped.',
  },
] as const;

export const StudyScorecard = (): ReactNode => (
  <StudyFigure
    title="What the latest comparison exposed"
    caption="Two code changes tested with four AI setups. These are observed results, not a complete bug count."
  >
    <dl className="grid gap-6 sm:grid-cols-3">
      {headlines.map((item) => (
        <div className="border-border border-l pl-4" key={item.label}>
          <dt className="text-foreground text-sm">{item.label}</dt>
          <dd className="mt-3 font-mono text-5xl text-primary tabular-nums">
            {item.value}
          </dd>
          <dd className="mt-3 text-muted-foreground text-sm">{item.detail}</dd>
        </div>
      ))}
    </dl>
  </StudyFigure>
);

const configurations = [
  { name: 'Spark throughout', detail: 'Muse Spark 1.3 does every job.' },
  { name: 'Luna throughout', detail: 'GPT-5.6 Luna does every job.' },
  { name: 'Astra throughout', detail: 'GPT-6 Astra does every job.' },
  { name: 'Astra leading Luna', detail: 'Astra leads. Luna reviews and repairs.' },
] as const;

export const StudyConfigurations = (): ReactNode => (
  <StudyFigure
    title="Who does the work?"
    caption="Astra used medium effort. Luna used max. Spark was requested at max."
  >
    <dl className="grid gap-6 sm:grid-cols-2">
      {configurations.map((item) => (
        <div className="border-border border-l pl-4" key={item.name}>
          <dt className="font-semibold text-foreground">{item.name}</dt>
          <dd className="mt-2 text-foreground text-sm">{item.detail}</dd>
        </div>
      ))}
    </dl>
  </StudyFigure>
);
