import { easing } from '@portfolio/ui/easing';
import { ArrowDown } from 'lucide-react';
import {
  div as MotionDiv,
  h1 as MotionH1,
  p as MotionP,
} from 'motion/react-client';
import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import portraitImage from '@/public/portrait.png';

const scrollAnimationDelaySeconds = 1.2;

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
  <section className="relative flex min-h-dvh items-center justify-center px-4 py-20 sm:px-6 md:px-8 lg:py-16">
    <MotionDiv
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="mx-auto flex w-full max-w-6xl flex-col-reverse items-center gap-8 sm:gap-10 md:gap-12 lg:flex-row lg:items-center lg:gap-16 xl:gap-20"
    >
      <div className="flex-1 text-center lg:text-left">
        <MotionP
          variants={fadeInUp}
          transition={{ duration: 0.6, ease: easing }}
          className="mb-3 font-medium text-primary text-sm uppercase tracking-widest sm:mb-4"
        >
          Founder & CTO
        </MotionP>

        <MotionH1
          variants={fadeInUp}
          transition={{ duration: 0.6, ease: easing }}
          className="mb-4 font-semibold font-serif text-5xl text-foreground leading-tight tracking-tight sm:mb-5 md:mb-6 md:text-6xl lg:text-7xl"
        >
          David Vornholt
        </MotionH1>

        <MotionP
          variants={fadeInUp}
          transition={{ duration: 0.6, ease: easing }}
          className="mx-auto mb-6 max-w-xl font-serif text-welcome text-xl italic sm:mb-7 md:mb-8 md:text-2xl lg:mx-0 lg:max-w-2xl"
        >
          &ldquo;Speaking the languages of humans and machines with equal
          precision.&rdquo;
        </MotionP>

        <MotionP
          variants={fadeInUp}
          transition={{ duration: 0.6, ease: easing }}
          className="mx-auto mb-8 max-w-xl text-base text-foreground/80 leading-relaxed sm:mb-10 md:mb-12 md:text-lg lg:mx-0 lg:max-w-2xl"
        >
          I build two companies. Atrium runs the operative day of a school and
          is in pilot at its first one. ProsaBridge translates whole books for
          publishers, with layout and terminology intact. Agents write most of
          my code, and strict quality gates decide what ships.
        </MotionP>

        <MotionDiv
          variants={fadeInUp}
          transition={{ duration: 0.6, ease: easing }}
          className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4 lg:justify-start"
        >
          <Link
            href="#works"
            className="inline-flex h-11 items-center justify-center bg-primary px-6 font-medium text-primary-foreground text-sm transition-colors hover:bg-primary-strong sm:h-12 sm:px-8"
          >
            View selected works
          </Link>
          <Link
            href="#contact"
            className="inline-flex h-11 items-center justify-center border border-border bg-background px-6 font-medium text-foreground text-sm transition-colors hover:bg-secondary sm:h-12 sm:px-8"
          >
            Get in touch
          </Link>
        </MotionDiv>
      </div>

      <MotionDiv
        variants={fadeInUp}
        transition={{ duration: 0.7, ease: easing }}
        className="relative shrink-0"
      >
        <div className="relative h-64 w-52 overflow-hidden border border-border sm:h-72 sm:w-56 md:h-80 md:w-64 lg:h-96 lg:w-72">
          <Image
            src={portraitImage}
            alt="David Vornholt"
            className="size-full object-cover"
            priority={true}
            placeholder="blur"
          />
        </div>
        <div
          aria-hidden={true}
          className="absolute -bottom-3 -left-3 size-full border border-primary/20 sm:-bottom-4 sm:-left-4"
        />
      </MotionDiv>
    </MotionDiv>

    <MotionDiv
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        delay: scrollAnimationDelaySeconds,
        duration: 0.8,
        ease: easing,
      }}
      className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 md:block lg:bottom-12"
    >
      <Link
        href="#works"
        aria-label="Scroll to works"
        className="group text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowDown className="size-5 transition-transform group-hover:translate-y-1" />
      </Link>
    </MotionDiv>
  </section>
);
