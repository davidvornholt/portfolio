import type { StaticImageData } from 'next/image';
import Image from 'next/image';
import type { ReactNode } from 'react';

type CaseStudyLayoutProps = Readonly<{
  title: string;
  subtitle: string;
  since: string;
  role: string;
  stage: string;
  techStack: ReadonlyArray<string>;
  liveUrl?: string;
  image: Readonly<{ src: StaticImageData; alt: string; caption?: string }>;
  children: ReactNode;
}>;

export const CaseStudyLayout = ({
  title,
  subtitle,
  since,
  role,
  stage,
  techStack,
  liveUrl,
  image,
  children,
}: CaseStudyLayoutProps): ReactNode => (
  <article className="page-column pt-8 pb-24 md:pt-12">
    <header>
      <h1 className="max-w-4xl font-bold text-4xl leading-[1.05] tracking-tight md:text-6xl">
        {title}
      </h1>
      <p className="mt-4 max-w-2xl font-semibold text-xl leading-snug md:text-2xl">
        {subtitle}
      </p>

      <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4 leading-snug">
        {[
          ['My part', role],
          ['Since', since],
          ['Stage', stage],
          ['Built with', techStack.join(', ')],
        ].map(([term, value]) => (
          <div key={term}>
            <dt className="text-muted-foreground text-sm">{term}</dt>
            <dd className="font-semibold">{value}</dd>
          </div>
        ))}
      </dl>

      {liveUrl === undefined ? null : (
        <a
          href={liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          data-umami-event="live-platform-visit"
          data-umami-event-title={title}
          className="keeps-colors mt-8 inline-flex h-12 items-center border-2 border-foreground bg-foreground px-6 font-semibold text-background hover:bg-background hover:text-foreground active:translate-y-px"
        >
          Visit {new URL(liveUrl).host}
        </a>
      )}

      <figure className="mt-12">
        <Image
          src={image.src}
          alt={image.alt}
          priority={true}
          placeholder="blur"
          sizes="(min-width: 102.5rem) 102.5rem, 100vw"
          className="w-full border border-border"
        />
        {image.caption === undefined ? null : (
          <figcaption className="mt-2 text-muted-foreground text-sm">
            {image.caption}
          </figcaption>
        )}
      </figure>
    </header>

    {children}
  </article>
);
