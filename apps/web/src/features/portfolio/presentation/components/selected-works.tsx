import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { WorkPlate } from '@/shared/content/presentation/components/work-plate';
export type WorkSummary = {
  readonly slug: string;
  readonly title: string;
  readonly role: string;
  readonly summary: string;
};
export const SelectedWorks = ({
  works,
}: {
  readonly works: ReadonlyArray<WorkSummary>;
}) => (
  <section
    id="works"
    className="folio-wrap border-border border-t py-14 md:py-20"
  >
    <h2 className="folio-heading mb-8">Selected work</h2>
    <div className="grid">
      {works.map((work) => (
        <Link
          key={work.slug}
          href={`/works/${work.slug}`}
          className="group grid items-center gap-x-8 gap-y-2 border-border border-t py-7 md:grid-cols-[0.9fr_2fr_1.6fr_auto]"
          data-umami-event="case-study-open"
          data-umami-event-project={work.slug}
        >
          {work.slug === 'prosabridge' && (
            <div className="mb-4 md:col-span-4">
              <WorkPlate slug={work.slug} />
            </div>
          )}
          <p className="credit-label text-welcome">{work.role}</p>
          <h3 className="font-normal font-serif text-3xl tracking-tight md:text-4xl">
            {work.title}
          </h3>
          <p className="max-w-md text-muted-foreground">{work.summary}</p>
          <ArrowUpRight
            size={22}
            className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
          />
        </Link>
      ))}
    </div>
  </section>
);
