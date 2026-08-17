import { easing } from '@portfolio/ui/easing';
import { ArrowUpRight } from 'lucide-react';
import { div as MotionDiv, header as MotionHeader } from 'motion/react-client';
import type { ReactNode } from 'react';

type Principle = Readonly<{
  title: string;
  description: string;
}>;

const principles: ReadonlyArray<Principle> = [
  {
    title: 'Fail-closed gates',
    description:
      'Lint, types, tests, and WCAG 2.2 AA accessibility run as one command. A gate that errors fails, and deploys run only for commits the gate has passed.',
  },
  {
    title: 'Verified review loops',
    description:
      'Agent review passes fix findings, then verify the fixes. Nothing merges on an agent’s self-report.',
  },
  {
    title: 'One synced contract',
    description:
      'Every repository shares the same operating contract and skills, kept aligned by a sync engine. The gates strengthen over time and never weaken to let a change pass.',
  },
];

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
};

export const HowIWork = (): ReactNode => (
  <section id="how-i-work" className="px-6 py-24 md:py-32">
    <div className="mx-auto max-w-6xl">
      <MotionHeader
        {...fadeInUp}
        transition={{ duration: 0.6, ease: easing }}
        className="mb-12"
      >
        <p className="mb-2 font-medium text-primary text-sm uppercase tracking-widest">
          How I work
        </p>
        <h2 className="max-w-3xl font-semibold font-serif text-4xl text-foreground md:text-5xl">
          Agents write most of my code. Quality gates decide what ships.
        </h2>
      </MotionHeader>

      <MotionDiv
        {...fadeInUp}
        transition={{ duration: 0.6, ease: easing }}
        className="mb-12 max-w-2xl"
      >
        <p className="text-foreground/80 leading-relaxed">
          My engineering standards are public: one operating contract for humans
          and agents, strict lint and type configuration, accessibility testing,
          and the sync engine that keeps every repository aligned with it. The
          work is verified mechanically, so nothing relies on an agent’s word,
          including mine.
        </p>
      </MotionDiv>

      <div className="mb-12">
        {principles.map((principle) => (
          <MotionDiv
            key={principle.title}
            {...fadeInUp}
            transition={{ duration: 0.6, ease: easing }}
            className="grid gap-2 border-border border-t py-6 md:grid-cols-12 md:gap-12"
          >
            <h3 className="font-medium text-foreground md:col-span-4">
              {principle.title}
            </h3>
            <p className="text-foreground/80 leading-relaxed md:col-span-8">
              {principle.description}
            </p>
          </MotionDiv>
        ))}
      </div>

      <MotionDiv {...fadeInUp} transition={{ duration: 0.6, ease: easing }}>
        <a
          href="https://github.com/davidvornholt/standards"
          target="_blank"
          rel="noopener noreferrer"
          data-umami-event="standards-open"
          className="inline-flex items-center gap-1.5 font-medium text-primary text-sm transition-colors hover:text-primary/80"
        >
          Read the standards on GitHub
          <ArrowUpRight className="h-4 w-4" />
        </a>
      </MotionDiv>
    </div>
  </section>
);
