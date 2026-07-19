import { Calendar, ExternalLink, Film, Globe } from 'lucide-react';
import {
  article as MotionArticle,
  div as MotionDiv,
  span as MotionSpan,
} from 'motion/react-client';
import type { ReactNode } from 'react';
import { Badge } from '@/shared/ui/presentation/components/badge';
import { type VideoProject, videoProjects } from '../data/video-projects';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
} as const;

const cardHover = {
  initial: { x: 0 },
  hover: { x: 4 },
} as const;

const arrowHover = {
  initial: { x: 0, y: 0 },
  hover: { x: 3, y: -3 },
} as const;

const numberHover = {
  initial: { opacity: 0.2, scale: 1 },
  hover: { opacity: 0.35, scale: 1.05 },
} as const;

const VideoCard = ({
  project,
}: {
  readonly project: VideoProject;
}): ReactNode => (
  <MotionArticle
    variants={fadeInUp}
    transition={{ duration: 0.6, ease: 'easeOut' }}
    initial="initial"
    whileInView="whileInView"
    whileHover="hover"
    viewport={{ once: true, margin: '-100px' }}
    className="group relative"
  >
    <a
      href={project.href}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-lg border border-border/50 bg-card/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:bg-card/80 hover:shadow-lg md:p-8"
    >
      <div className="grid gap-6 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-2">
          <MotionSpan
            variants={numberHover}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="block font-bold font-mono text-5xl text-muted-foreground/60 md:text-6xl"
          >
            {project.number}
          </MotionSpan>
        </div>

        <MotionDiv
          variants={cardHover}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="md:col-span-10"
        >
          <header className="mb-4">
            <div className="mb-2 flex items-start justify-between gap-4">
              <h3 className="font-semibold font-serif text-foreground text-xl transition-colors duration-300 group-hover:text-primary md:text-2xl">
                {project.title}
              </h3>
              <MotionSpan
                variants={arrowHover}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="shrink-0 text-muted-foreground transition-colors duration-300 group-hover:text-primary"
              >
                <ExternalLink className="size-5" />
              </MotionSpan>
            </div>
          </header>

          <div className="mb-4 flex flex-wrap items-center gap-3 text-muted-foreground text-sm">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="size-4" />
              {project.date}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Globe className="size-4" />
              <Badge
                variant="secondary"
                className="font-mono text-xs transition-colors duration-300 group-hover:bg-primary/10"
              >
                {project.language}
              </Badge>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Film className="size-4" />
              <Badge
                variant="outline"
                className="font-mono text-xs transition-colors duration-300 group-hover:border-primary/30"
              >
                {project.type}
              </Badge>
            </span>
          </div>

          <p className="text-foreground/70 leading-relaxed">
            {project.description}
          </p>
        </MotionDiv>
      </div>
    </a>
  </MotionArticle>
);

export const VideoArchive = (): ReactNode => (
  <section className="px-4 pb-24 sm:px-6 md:px-8">
    <div className="mx-auto max-w-4xl">
      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="mb-12 text-center"
      >
        <p className="font-medium text-muted-foreground text-sm uppercase tracking-widest">
          Early explorations in storytelling, media production, and
          communication
        </p>
      </MotionDiv>

      <div className="space-y-6">
        {videoProjects.map((project) => (
          <VideoCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  </section>
);
