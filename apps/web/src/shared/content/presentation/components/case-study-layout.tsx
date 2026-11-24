import { ArrowUpRight } from 'lucide-react';
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
    <header className="folio-wrap my-12 grid items-center gap-10 border-border border-b pb-12 md:grid-cols-[1.3fr_1fr]">
      <div>
        <p className="folio-label mb-3 text-welcome">
          {role} · {timeline}
        </p>
        <h1 className="folio-heading">{title}</h1>
        <p className="my-5 max-w-md text-xl">{subtitle}</p>
        <p className="text-muted-foreground text-sm">{techStack.join(' / ')}</p>
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
    {children}
  </article>
);
