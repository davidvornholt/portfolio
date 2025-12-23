'use client';

import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import type { ReactNode } from 'react';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
};

export const CTA = (): ReactNode => (
  <section id="contact" className="bg-primary px-6 py-24 md:py-32">
    <motion.div
      {...fadeInUp}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="mx-auto max-w-3xl text-center"
    >
      <p className="mb-4 text-sm font-medium uppercase tracking-widest text-primary-foreground/70">
        Let's Connect
      </p>

      <h2 className="mb-6 font-serif text-4xl font-semibold text-primary-foreground md:text-5xl">
        Ready to Build Something Meaningful?
      </h2>

      <p className="mb-10 text-lg leading-relaxed text-primary-foreground/80">
        Whether you're looking for a technical partner for your next project or
        want to discuss engineering philosophy over coffee, I'd love to hear
        from you.
      </p>

      <a
        href="mailto:david@vornholt.online"
        className="group inline-flex items-center gap-3 rounded-md bg-primary-foreground px-8 py-4 text-base font-medium text-primary transition-all hover:bg-primary-foreground/90"
      >
        <Mail className="h-5 w-5 transition-transform group-hover:-translate-y-0.5" />
        david@vornholt.online
      </a>
    </motion.div>
  </section>
);
