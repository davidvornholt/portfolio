import { ArrowLeft } from 'lucide-react';
import {
  div as MotionDiv,
  h1 as MotionH1,
  p as MotionP,
} from 'motion/react-client';
import Link from 'next/link';
import type { ReactNode } from 'react';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
} as const;

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.15,
    },
  },
} as const;

export const LabHero = (): ReactNode => (
  <section className="relative flex min-h-[60dvh] items-center justify-center px-4 py-20 sm:px-6 md:px-8">
    <MotionDiv
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="mx-auto w-full max-w-4xl text-center"
    >
      <MotionDiv
        variants={fadeInUp}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="mb-12"
      >
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Studio
        </Link>
      </MotionDiv>

      <MotionP
        variants={fadeInUp}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="mb-3 text-sm font-medium uppercase tracking-widest text-primary sm:mb-4"
      >
        Private Archive
      </MotionP>

      <MotionH1
        variants={fadeInUp}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="mb-4 font-serif text-5xl font-semibold leading-tight tracking-tight text-foreground sm:mb-5 md:mb-6 md:text-6xl lg:text-7xl"
      >
        The Creative Lab
      </MotionH1>

      <MotionP
        variants={fadeInUp}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="mx-auto mb-8 max-w-2xl font-serif text-xl italic text-muted-foreground md:text-2xl"
      >
        A private archive of early experiments in visual storytelling and media.
      </MotionP>

      <MotionP
        variants={fadeInUp}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="mx-auto max-w-2xl text-base leading-relaxed text-foreground/80 md:text-lg"
      >
        Before focusing on digital architecture, I explored the world through a
        lens. These projects represent my early journey into narrative
        structure, editing, and cross-cultural communication.
      </MotionP>
    </MotionDiv>
  </section>
);
