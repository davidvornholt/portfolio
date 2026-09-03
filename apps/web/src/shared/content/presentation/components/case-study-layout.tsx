import { easing } from '@portfolio/ui/easing';
import { Clock, ExternalLink, Users } from 'lucide-react';
import { header as MotionHeader } from 'motion/react-client';
import type { ReactNode } from 'react';

import { Badge } from '@/shared/ui/presentation/components/badge';
import { Separator } from '@/shared/ui/presentation/components/separator';

type CaseStudyLayoutProps = Readonly<{
  title: string;
  subtitle: string;
  timeline: string;
  role: string;
  techStack: ReadonlyArray<string>;
  liveUrl?: string;
  children: ReactNode;
}>;

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
};

export const CaseStudyLayout = ({
  title,
  subtitle,
  timeline,
  role,
  techStack,
  liveUrl,
  children,
}: CaseStudyLayoutProps): ReactNode => (
  <article className="pb-24">
    <MotionHeader
      {...fadeInUp}
      transition={{ duration: 0.6, ease: easing }}
      className="mx-auto mt-12 mb-16 max-w-4xl px-6"
    >
      <p className="mb-4 font-medium text-primary text-sm uppercase tracking-widest">
        Case study
      </p>
      <h1 className="mb-6 font-semibold font-serif text-4xl text-foreground leading-tight md:text-5xl lg:text-6xl">
        {title}
      </h1>
      <p className="mb-8 max-w-2xl font-serif text-muted-foreground text-xl italic md:text-2xl">
        {subtitle}
      </p>

      <div className="flex flex-wrap items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <Clock className="size-4 text-primary" />
          <span className="text-muted-foreground">{timeline}</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="size-4 text-primary" />
          <span className="text-muted-foreground">{role}</span>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {techStack.map((tech) => (
          <Badge key={tech} variant="secondary" className="font-mono text-xs">
            {tech}
          </Badge>
        ))}
      </div>

      {liveUrl === undefined ? null : (
        <a
          href={liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          data-umami-event="live-platform-visit"
          data-umami-event-title={title}
          className="mt-8 inline-flex h-9 items-center justify-center gap-2 bg-primary px-4 font-medium text-primary-foreground text-sm transition-colors hover:bg-primary-strong"
        >
          Visit live platform
          <ExternalLink className="size-4" />
        </a>
      )}
    </MotionHeader>

    <Separator className="mx-auto mb-16 max-w-4xl" />

    <div className="mx-auto max-w-4xl">{children}</div>
  </article>
);
