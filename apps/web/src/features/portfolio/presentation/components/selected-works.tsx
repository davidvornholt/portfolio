import { easing } from '@portfolio/ui/easing';
import { ArrowUpRight, Calendar, Code2 } from 'lucide-react';
import {
  article as MotionArticle,
  div as MotionDiv,
  header as MotionHeader,
  span as MotionSpan,
} from 'motion/react-client';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { Badge } from '@/shared/ui/presentation/components/badge';

export type WorkSummary = {
  readonly slug: string;
  readonly title: string;
  readonly role: string;
  readonly timeline: string;
  readonly stack: ReadonlyArray<string>;
  readonly summary: string;
  readonly outcome: string;
};

type SelectedWorksProps = {
  readonly works: ReadonlyArray<WorkSummary>;
};

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
};

const cardHover = {
  initial: { x: 0 },
  hover: { x: 4 },
};

const arrowHover = {
  initial: { x: 0, y: 0 },
  hover: { x: 3, y: -3 },
};

const numberHover = {
  initial: { opacity: 0.2, scale: 1 },
  hover: { opacity: 0.35, scale: 1.05 },
};

const WorkCardContent = ({
  work,
  index,
}: {
  readonly work: WorkSummary;
  readonly index: number;
}): ReactNode => (
  <div className="grid gap-8 md:grid-cols-12 md:gap-12">
    <div className="md:col-span-2">
      <MotionSpan
        variants={numberHover}
        transition={{ duration: 0.3, ease: easing }}
        className="block font-bold font-mono text-6xl text-muted-foreground/60"
      >
        {String(index + 1).padStart(2, '0')}
      </MotionSpan>
    </div>

    <MotionDiv
      variants={cardHover}
      transition={{ duration: 0.3, ease: easing }}
      className="md:col-span-10"
    >
      <header className="mb-6">
        <h3 className="mb-2 font-semibold font-serif text-2xl text-foreground transition-colors duration-300 group-hover:text-primary md:text-3xl">
          {work.title}
        </h3>
        <p className="font-medium text-primary text-sm">{work.role}</p>
      </header>

      <div className="mb-6 flex flex-wrap items-center gap-4 text-muted-foreground text-sm">
        <span className="inline-flex items-center gap-1.5">
          <Calendar className="h-4 w-4" />
          {work.timeline}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Code2 className="h-4 w-4" />
          <span className="flex flex-wrap gap-2">
            {work.stack.map((tech) => (
              <Badge
                key={tech}
                variant="secondary"
                className="font-mono text-xs transition-colors duration-300 group-hover:bg-primary/10"
              >
                {tech}
              </Badge>
            ))}
          </span>
        </span>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="mb-2 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
            The work
          </h4>
          <p className="text-foreground/80 leading-relaxed">{work.summary}</p>
        </div>

        <div>
          <h4 className="mb-2 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
            Where it stands
          </h4>
          <p className="text-foreground/80 leading-relaxed">{work.outcome}</p>
        </div>
      </div>

      <span className="mt-6 inline-flex items-center gap-1.5 font-medium text-primary text-sm transition-colors group-hover:text-primary/80">
        View case study
        <MotionSpan
          variants={arrowHover}
          transition={{ duration: 0.3, ease: easing }}
        >
          <ArrowUpRight className="h-4 w-4" />
        </MotionSpan>
      </span>
    </MotionDiv>
  </div>
);

const WorkCard = ({
  work,
  index,
}: {
  readonly work: WorkSummary;
  readonly index: number;
}): ReactNode => (
  <MotionArticle
    {...fadeInUp}
    transition={{ duration: 0.6, ease: easing }}
    whileHover="hover"
    initial="initial"
    className="group relative border-border border-t py-16 first:border-t-0"
  >
    <Link
      href={`/works/${work.slug}`}
      data-umami-event="case-study-open"
      data-umami-event-project={work.slug}
      className="block"
    >
      <WorkCardContent work={work} index={index} />
    </Link>
  </MotionArticle>
);

export const SelectedWorks = ({ works }: SelectedWorksProps): ReactNode => (
  <section id="works" className="px-6 py-24 md:py-32">
    <div className="mx-auto max-w-6xl">
      <MotionHeader
        {...fadeInUp}
        transition={{ duration: 0.6, ease: easing }}
        className="mb-16"
      >
        <p className="mb-2 font-medium text-primary text-sm uppercase tracking-widest">
          Portfolio
        </p>
        <h2 className="font-semibold font-serif text-4xl text-foreground md:text-5xl">
          Selected works
        </h2>
      </MotionHeader>

      <div>
        {works.map((work, index) => (
          <WorkCard key={work.slug} work={work} index={index} />
        ))}
      </div>
    </div>
  </section>
);
