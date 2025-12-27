'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import type { ReactNode } from 'react';

type Certification = {
  readonly issuer: string;
  readonly title: string;
  readonly description: string;
  readonly href: string;
};

type CertificationItemProps = {
  readonly certification: Certification;
  readonly index: number;
};

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
};

export const CertificationItem = ({
  certification,
  index,
}: CertificationItemProps): ReactNode => (
  <motion.a
    {...fadeInUp}
    transition={{ duration: 0.6, ease: 'easeOut', delay: 0.5 + index * 0.1 }}
    href={certification.href}
    target="_blank"
    rel="noopener noreferrer"
    className="group flex flex-col gap-2 rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary/20 hover:bg-accent"
  >
    <div className="flex items-start justify-between gap-4">
      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          {certification.issuer}
        </span>
        <h4 className="font-serif text-base font-semibold leading-snug text-foreground">
          {certification.title}
        </h4>
      </div>
      <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground/50 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
    </div>
    <p className="text-sm leading-relaxed text-muted-foreground">
      {certification.description}
    </p>
  </motion.a>
);

export type { Certification };
