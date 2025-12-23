'use client';

import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

export const Hero = (): ReactNode => (
  <section className="relative flex min-h-screen items-center justify-center px-6 pt-16">
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="mx-auto max-w-4xl text-center"
    >
      <motion.p
        variants={fadeInUp}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="mb-4 text-sm font-medium uppercase tracking-widest text-primary"
      >
        Full Stack Developer & Digital Experience Architect
      </motion.p>

      <motion.h1
        variants={fadeInUp}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="mb-6 font-serif text-5xl font-semibold leading-tight tracking-tight text-foreground md:text-6xl lg:text-7xl"
      >
        David Vornholt
      </motion.h1>

      <motion.p
        variants={fadeInUp}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="mb-8 font-serif text-xl italic text-muted-foreground md:text-2xl"
      >
        "Speaking the languages of humans and machines with equal precision."
      </motion.p>

      <motion.p
        variants={fadeInUp}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="mx-auto mb-12 max-w-2xl text-base leading-relaxed text-foreground/80 md:text-lg"
      >
        Fluent in four languages and the strict logic of functional programming,
        I bridge the divide between complex technical systems and the people
        they serve. I build software with the soul of a social architect and the
        mind of a functional engineer.
      </motion.p>

      <motion.div
        variants={fadeInUp}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
      >
        <Link
          href="#works"
          className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          View Selected Works
        </Link>
        <Link
          href="#contact"
          className="inline-flex h-12 items-center justify-center rounded-md border border-border bg-background px-8 text-sm font-medium text-foreground transition-colors hover:bg-accent"
        >
          Get in Touch
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2"
      >
        <Link
          href="#works"
          aria-label="Scroll to works"
          className="flex flex-col items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
        >
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ArrowDown className="h-4 w-4" />
          </motion.div>
        </Link>
      </motion.div>
    </motion.div>
  </section>
);
