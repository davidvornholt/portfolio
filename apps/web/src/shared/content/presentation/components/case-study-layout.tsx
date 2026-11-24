import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import type { ReactNode } from 'react';
import { WorkPlate } from './work-plate';

type CaseStudyLayoutProps = {
  readonly slug: string;
  readonly title: string;
  readonly outcome: string;
  readonly subtitle: string;
  readonly timeline: string;
  readonly role: string;
  readonly techStack: ReadonlyArray<string>;
  readonly liveUrl?: string;
  readonly children: ReactNode;
};
export const CaseStudyLayout = ({
  slug,
  title,
  subtitle,
  outcome,
  timeline,
  role,
  techStack,
  liveUrl,
  children,
}: CaseStudyLayoutProps) => (
  <article className="pb-24">
    {slug === 'prosabridge' ? (
      <>
        <header className="folio-wrap book-case mt-6">
          <Image
            src="/stills/turn.webp"
            alt="Leaves fanning out from the spine of an open book"
            sizes="95vw"
            fill={true}
          />
          <div className="p-6 md:p-12">
            <p className="credit-label">Case study / Publishing</p>
            <h1>{title}</h1>
            <p className="max-w-lg text-xl">{subtitle}</p>
            {liveUrl !== undefined && (
              <a className="film-link mt-4" href={liveUrl}>
                Visit ProsaBridge <ArrowUpRight size={16} />
              </a>
            )}
          </div>
        </header>
        <div className="folio-wrap mb-10 grid gap-3 border-border border-b py-5 text-sm sm:grid-cols-3">
          <p>{role}</p>
          <p>{timeline}</p>
          <p>{outcome}</p>
        </div>
      </>
    ) : (
      <header className="folio-wrap my-12 grid items-center gap-10 border-border border-b pb-12 md:grid-cols-[1.3fr_1fr]">
        <div>
          <p className="folio-label mb-3 text-welcome">
            {role} · {timeline}
          </p>
          <h1 className="folio-heading">{title}</h1>
          <p className="my-5 max-w-md text-xl">{subtitle}</p>
          <p className="text-muted-foreground text-sm">
            {techStack.join(' / ')}
          </p>
          {liveUrl !== undefined && (
            <a href={liveUrl} className="ink-link mt-3 text-primary">
              Visit the website <ArrowUpRight size={16} />
            </a>
          )}
        </div>
        <figure>
          <WorkPlate slug={slug} />
          <figcaption className="mt-3 text-muted-foreground text-sm">
            {slug === 'atrium' ? 'Class register concept. ' : ''}
            {outcome}
          </figcaption>
        </figure>
      </header>
    )}
    {children}
  </article>
);
