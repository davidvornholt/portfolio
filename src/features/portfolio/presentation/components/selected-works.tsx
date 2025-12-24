'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, Calendar, Code2 } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { Badge } from '@/shared/ui/presentation/components/badge';

type Project = {
  readonly id: string;
  readonly number: string;
  readonly title: string;
  readonly role: string;
  readonly timeline: string;
  readonly stack: readonly string[];
  readonly description: string;
  readonly outcome: string;
  readonly href?: string;
};

const projects: readonly Project[] = [
  {
    id: 'fes-kirchheim',
    number: '01',
    title: 'Freie Evangelische Schule Kirchheim',
    role: 'Lead Full Stack Developer & Digital Experience Architect',
    timeline: 'August 2024 – Present',
    stack: ['Next.js 16', 'Tailwind CSS v4', 'TypeScript'],
    description:
      'Leading the digital transformation of an educational institution. Designing platforms to streamline communication between students, teachers, and parents.',
    outcome:
      'Improved workflow efficiency and enhanced accessibility for the entire school community.',
    href: '/works/fes-kirchheim',
  },
  {
    id: 'ccbb',
    number: '02',
    title: 'Christian Congregation Bietigheim-Bissingen',
    role: 'Full Stack Developer & UI/UX Designer',
    timeline: 'September 2025 – Present',
    stack: ['Next.js 16', 'Framer Motion', 'Bun'],
    description:
      'Redesigning the digital presence of a local church community. Focus on community engagement, event management, and modern user experience.',
    outcome:
      'A clean, welcoming digital home reflecting community values through modern UI/UX and functional reliability.',
    href: 'https://cg-bibi.de',
  },
] as const;

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

const ProjectCardContent = ({
  project,
}: {
  readonly project: Project;
}): ReactNode => (
  <div className="grid gap-8 md:grid-cols-12 md:gap-12">
    <div className="md:col-span-2">
      <motion.span
        variants={numberHover}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="block font-mono text-6xl font-bold text-muted-foreground/20"
      >
        {project.number}
      </motion.span>
    </div>

    <motion.div
      variants={cardHover}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="md:col-span-10"
    >
      <header className="mb-6">
        <h3 className="mb-2 font-serif text-2xl font-semibold text-foreground transition-colors duration-300 group-hover:text-primary md:text-3xl">
          {project.title}
        </h3>
        <p className="text-sm font-medium text-primary">{project.role}</p>
      </header>

      <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <Calendar className="h-4 w-4" />
          {project.timeline}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Code2 className="h-4 w-4" />
          <span className="flex flex-wrap gap-2">
            {project.stack.map((tech) => (
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
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            The Challenge
          </h4>
          <p className="leading-relaxed text-foreground/80">
            {project.description}
          </p>
        </div>

        <div>
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            The Outcome
          </h4>
          <p className="leading-relaxed text-foreground/80">
            {project.outcome}
          </p>
        </div>
      </div>

      {project.href && (
        <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors group-hover:text-primary/80">
          View Case Study
          <motion.span
            variants={arrowHover}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <ArrowUpRight className="h-4 w-4" />
          </motion.span>
        </span>
      )}
    </motion.div>
  </div>
);

const ProjectCard = ({ project }: { readonly project: Project }): ReactNode => {
  const isExternal = project.href?.startsWith('http') ?? false;

  return (
    <motion.article
      {...fadeInUp}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      whileHover="hover"
      initial="initial"
      className="group relative border-t border-border py-16 first:border-t-0"
    >
      {project.href ? (
        <Link
          href={project.href}
          {...(isExternal && {
            target: '_blank',
            rel: 'noopener noreferrer',
          })}
          className="block"
        >
          <ProjectCardContent project={project} />
        </Link>
      ) : (
        <ProjectCardContent project={project} />
      )}
    </motion.article>
  );
};

export const SelectedWorks = (): ReactNode => (
  <section id="works" className="px-6 py-24 md:py-32">
    <div className="mx-auto max-w-6xl">
      <motion.header
        {...fadeInUp}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="mb-16"
      >
        <p className="mb-2 text-sm font-medium uppercase tracking-widest text-primary">
          Portfolio
        </p>
        <h2 className="font-serif text-4xl font-semibold text-foreground md:text-5xl">
          Selected Works
        </h2>
      </motion.header>

      <div>
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  </section>
);
