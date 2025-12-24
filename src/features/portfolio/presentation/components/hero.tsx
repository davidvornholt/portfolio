'use client';

import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import profileImage from '@/../public/profile-without-bg.png';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const fadeInScale = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

export const Hero = (): ReactNode => (
  <section className="relative flex min-h-dvh items-center justify-center px-4 py-20 sm:px-6 md:px-8 lg:py-16">
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="mx-auto flex w-full max-w-6xl flex-col-reverse items-center gap-8 sm:gap-10 md:gap-12 lg:flex-row lg:items-center lg:gap-16 xl:gap-20"
    >
      <div className="flex-1 text-center lg:text-left">
        <motion.p
          variants={fadeInUp}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mb-3 text-sm font-medium uppercase tracking-widest text-primary sm:mb-4"
        >
          Full Stack Developer & Digital Experience Architect
        </motion.p>

        <motion.h1
          variants={fadeInUp}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mb-4 font-serif text-5xl font-semibold leading-tight tracking-tight text-foreground sm:mb-5 md:mb-6 md:text-6xl lg:text-7xl"
        >
          David Vornholt
        </motion.h1>

        <motion.p
          variants={fadeInUp}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mx-auto mb-6 max-w-xl font-serif text-xl italic text-muted-foreground sm:mb-7 md:mb-8 md:text-2xl lg:mx-0 lg:max-w-2xl"
        >
          &ldquo;Speaking the languages of humans and machines with equal
          precision.&rdquo;
        </motion.p>

        <motion.p
          variants={fadeInUp}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mx-auto mb-8 max-w-xl text-base leading-relaxed text-foreground/80 sm:mb-10 md:mb-12 md:text-lg lg:mx-0 lg:max-w-2xl"
        >
          Fluent in four languages and the strict logic of functional
          programming, I bridge the divide between complex technical systems and
          the people they serve. I build software with the soul of a social
          architect and the mind of a functional engineer.
        </motion.p>

        <motion.div
          variants={fadeInUp}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4 lg:justify-start"
        >
          <Link
            href="#works"
            className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 sm:h-12 sm:px-8"
          >
            View Selected Works
          </Link>
          <Link
            href="#contact"
            className="inline-flex h-11 items-center justify-center rounded-md border border-border bg-background px-6 text-sm font-medium text-foreground transition-colors hover:bg-accent sm:h-12 sm:px-8"
          >
            Get in Touch
          </Link>
        </motion.div>
      </div>

      <motion.div
        variants={fadeInScale}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="relative shrink-0"
      >
        <div className="relative h-64 w-52 overflow-hidden rounded-2xl bg-linear-to-br from-primary/10 to-primary/5 ring-1 ring-border sm:h-72 sm:w-56 md:h-80 md:w-64 lg:h-96 lg:w-72">
          <Image
            src={profileImage}
            alt="David Vornholt"
            className="h-full w-full object-cover"
            priority
            placeholder="blur"
          />
        </div>
        <div className="absolute -bottom-3 -left-3 h-full w-full rounded-2xl border border-primary/20 sm:-bottom-4 sm:-left-4" />
      </motion.div>
    </motion.div>

    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.2, duration: 0.8 }}
      className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 md:block lg:bottom-12"
    >
      <Link
        href="#works"
        aria-label="Scroll to works"
        className="text-muted-foreground transition-colors hover:text-foreground"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ArrowDown className="h-5 w-5" />
        </motion.div>
      </Link>
    </motion.div>
  </section>
);
