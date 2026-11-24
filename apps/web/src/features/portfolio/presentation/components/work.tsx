import type { StaticImageData } from 'next/image';
import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { Section } from './section';
import { textLinkClassName } from './text-link';

export type WorkSummary = Readonly<{
  slug: string;
  title: string;
  subtitle: string;
  summary: string;
  role: string;
  since: string;
  stage: string;
  liveUrl?: string;
  image: Readonly<{ src: StaticImageData; alt: string; caption?: string }>;
}>;

const Facts = ({ work }: { readonly work: WorkSummary }): ReactNode => (
  <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 text-sm leading-snug sm:flex sm:flex-wrap sm:gap-x-9">
    {[
      ['My part', work.role],
      ['Since', work.since],
      ['Stage', work.stage],
    ].map(([term, value]) => (
      <div key={term}>
        <dt className="text-muted-foreground">{term}</dt>
        <dd className="font-semibold">{value}</dd>
      </div>
    ))}
  </dl>
);

const Links = ({ work }: { readonly work: WorkSummary }): ReactNode => (
  <p className="mt-5 flex flex-wrap gap-x-7 gap-y-2">
    <Link
      href={`/works/${work.slug}`}
      data-umami-event="case-study-open"
      data-umami-event-project={work.slug}
      className={textLinkClassName}
    >
      Read the case study
      <span className="sr-only"> of {work.title}</span>
    </Link>
    {work.liveUrl === undefined ? null : (
      <a
        href={work.liveUrl}
        target="_blank"
        rel="noopener noreferrer"
        data-umami-event="live-platform-visit"
        data-umami-event-title={work.title}
        className={textLinkClassName}
      >
        {new URL(work.liveUrl).host}
      </a>
    )}
  </p>
);

const Picture = ({
  work,
  sizes,
}: Readonly<{ work: WorkSummary; sizes: string }>): ReactNode => (
  <figure>
    <Image
      src={work.image.src}
      alt={work.image.alt}
      placeholder="blur"
      sizes={sizes}
      className="aspect-[16/10] w-full border border-border object-cover object-top"
    />
    {work.image.caption === undefined ? null : (
      <figcaption className="mt-2 text-muted-foreground text-sm">
        {work.image.caption}
      </figcaption>
    )}
  </figure>
);

const Description = ({ work }: { readonly work: WorkSummary }): ReactNode => (
  <>
    <h3 className="font-bold text-2xl tracking-tight md:text-[1.75rem]">
      {work.title}
    </h3>
    <p className="mt-1 font-semibold text-lg md:text-xl">{work.subtitle}</p>
    <p className="mt-3 max-w-xl text-lg text-muted-foreground leading-relaxed">
      {work.summary}
    </p>
    <Facts work={work} />
    <Links work={work} />
  </>
);

/** What David builds: his company first, then the other two side by side. */
export const Work = ({
  works,
}: {
  readonly works: ReadonlyArray<WorkSummary>;
}): ReactNode => {
  const [first, ...others] = works;
  return (
    <Section id="work" heading="What I build">
      {first === undefined ? null : (
        <article className="mt-10 grid gap-x-14 gap-y-6 md:mt-13 lg:grid-cols-13">
          <div className="lg:col-span-8">
            <Picture work={first} sizes="(min-width: 64rem) 58vw, 100vw" />
          </div>
          <div className="lg:col-span-5">
            <Description work={first} />
          </div>
        </article>
      )}
      <div className="mt-16 grid gap-x-14 gap-y-16 md:mt-22 md:grid-cols-2">
        {others.map((work) => (
          <article key={work.slug}>
            <Picture work={work} sizes="(min-width: 48rem) 46vw, 100vw" />
            <div className="mt-6">
              <Description work={work} />
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
};
