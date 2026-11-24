import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
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
  <section id="works" className="folio-wrap destinations">
    <div className="section-sign">
      <span className="line-symbol key-work">P</span>
      <h2>Selected work</h2>
    </div>
    <div className="station-list">
      {works.map((work) => (
        <Link
          key={work.slug}
          href={`/works/${work.slug}`}
          data-umami-event="case-study-open"
          data-umami-event-project={work.slug}
          className="destination-row"
        >
          <span className="destination-dot" aria-hidden="true" />
          <h3>{work.title}</h3>
          <p>{work.summary}</p>
          <ArrowUpRight size={23} />
        </Link>
      ))}
    </div>
  </section>
);
