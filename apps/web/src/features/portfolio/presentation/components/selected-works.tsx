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
    <div className="grid gap-8 md:grid-cols-3">
      {works.map((work) => (
        <Link
          key={work.slug}
          href={`/works/${work.slug}`}
          className="group"
          data-umami-event="case-study-open"
          data-umami-event-project={work.slug}
        >
          <WorkPlate slug={work.slug} />
          <p className="folio-label mt-4 text-welcome">{work.role}</p>
          <h3 className="my-1 flex items-center justify-between gap-3 font-medium font-serif text-3xl tracking-tight">
            {work.title}
            <ArrowUpRight
              size={22}
              className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
            />
          </h3>
          <p className="max-w-sm text-muted-foreground">{work.summary}</p>
        </Link>
      ))}
    </div>
  </section>
);
