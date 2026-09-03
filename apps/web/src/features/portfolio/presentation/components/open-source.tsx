import { easing } from '@portfolio/ui/easing';
import { ArrowUpRight } from 'lucide-react';
import { div as MotionDiv, header as MotionHeader } from 'motion/react-client';
import type { ReactNode } from 'react';
import { Badge } from '@/shared/ui/presentation/components/badge';
import { openSourceProjects } from './open-source-data';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
};

export const OpenSource = (): ReactNode => (
  <section id="open-source" className="px-6 py-24 md:py-32">
    <div className="mx-auto max-w-6xl">
      <MotionHeader
        {...fadeInUp}
        transition={{ duration: 0.6, ease: easing }}
        className="mb-12"
      >
        <p className="mb-2 font-medium text-primary text-sm uppercase tracking-widest">
          Open source
        </p>
        <h2 className="font-semibold font-serif text-4xl text-foreground md:text-5xl">
          Code you can read
        </h2>
      </MotionHeader>

      <div>
        {openSourceProjects.map((project) => (
          <MotionDiv
            key={project.name}
            {...fadeInUp}
            transition={{ duration: 0.6, ease: easing }}
            className="border-border border-t"
          >
            <a
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              data-umami-event="open-source-open"
              data-umami-event-project={project.name}
              className="group grid gap-3 py-6 md:grid-cols-12 md:items-baseline md:gap-12"
            >
              <h3 className="font-medium font-mono text-foreground transition-colors group-hover:text-primary md:col-span-3">
                {project.name}
              </h3>
              <p className="text-foreground/80 leading-relaxed md:col-span-6">
                {project.description}
              </p>
              <span className="flex flex-wrap items-center gap-2 md:col-span-3 md:justify-end">
                {project.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="font-mono text-xs"
                  >
                    {tag}
                  </Badge>
                ))}
                <ArrowUpRight className="size-4 text-muted-foreground transition-colors group-hover:text-primary" />
              </span>
            </a>
          </MotionDiv>
        ))}
      </div>
    </div>
  </section>
);
