import type { ReactNode } from 'react';
import { videoProjects } from '../data/video-projects';

export const VideoArchive = (): ReactNode => (
  <section className="page-column pb-24">
    <ul className="border-foreground border-t-2">
      {videoProjects.map((project) => (
        <li key={project.id} className="border-border border-b">
          <a
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            data-umami-event="lab-video-open"
            data-umami-event-video={project.title}
            className="group grid gap-x-14 gap-y-2 py-6 md:grid-cols-13 md:py-7"
          >
            <span className="md:col-span-7">
              <strong className="block max-w-xl font-bold text-xl leading-snug tracking-tight underline-offset-4 group-hover:underline group-hover:decoration-2 md:text-2xl">
                {project.title}
              </strong>
              <span className="mt-1 block text-muted-foreground text-sm">
                {project.type}, {project.language}, {project.date}
              </span>
            </span>
            <span className="text-muted-foreground leading-relaxed md:col-span-6">
              {project.description}
            </span>
          </a>
        </li>
      ))}
    </ul>
  </section>
);
