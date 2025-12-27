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
  techStack: readonly string[];
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
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="mx-auto mb-16 mt-12 max-w-4xl px-6"
    >
      <p className="mb-4 text-sm font-medium uppercase tracking-widest text-primary">
        Case Study
      </p>
      <h1 className="mb-6 font-serif text-4xl font-semibold leading-tight text-foreground md:text-5xl lg:text-6xl">
        {title}
      </h1>
      <p className="mb-8 max-w-2xl font-serif text-xl italic text-muted-foreground md:text-2xl">
        {subtitle}
      </p>

      <div className="flex flex-wrap items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          <span className="text-muted-foreground">{timeline}</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
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

      {liveUrl && (
        <a
          href={liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex h-9 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
        >
          Visit Live Platform
          <ExternalLink className="h-4 w-4" />
        </a>
      )}
    </MotionHeader>

    <Separator className="mx-auto mb-16 max-w-4xl" />

    <div className="mx-auto max-w-4xl">{children}</div>
  </article>
);
