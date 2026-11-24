import { ArrowUpRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { BackNavigation } from './back-navigation';
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
    <header className="case-cover">
      <div className="folio-wrap">
        <BackNavigation href="/#works" label="Back to works" />
        <div className="case-spread">
          <div>
            <p className="folio-label mb-4">Case study / {role}</p>
            <h1 className="publication-title">{title}</h1>
            <p className="my-5 max-w-lg text-xl md:text-2xl">{subtitle}</p>
            {liveUrl !== undefined && (
              <a href={liveUrl} className="press-link">
                Visit the website <ArrowUpRight size={16} />
              </a>
            )}
          </div>
          <figure>
            <WorkPlate slug={slug} />
            <figcaption className="mt-3 max-w-lg text-sm">
              {slug === 'atrium' ? 'Class register concept. ' : ''}
              {outcome}
            </figcaption>
          </figure>
        </div>
        <div className="edition-line border-current border-t py-4">
          <span>{timeline}</span>
          <span>{techStack.join(' / ')}</span>
        </div>
      </div>
    </header>
    {children}
  </article>
);
