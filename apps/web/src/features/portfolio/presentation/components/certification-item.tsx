import { ArrowUpRight } from 'lucide-react';
import { a as MotionA } from 'motion/react-client';
import type { ReactNode } from 'react';
import type { Certification } from './certification';

const certificationInitialDelaySeconds = 0.5;
const certificationStaggerSeconds = 0.1;

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
  <MotionA
    {...fadeInUp}
    transition={{
      duration: 0.6,
      ease: 'easeOut',
      delay:
        certificationInitialDelaySeconds + index * certificationStaggerSeconds,
    }}
    href={certification.href}
    target="_blank"
    rel="noopener noreferrer"
    className="group flex flex-col gap-2 rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary/20 hover:bg-secondary"
  >
    <div className="flex items-start justify-between gap-4">
      <div className="flex flex-col gap-1">
        <span className="font-medium text-muted-foreground text-xs uppercase tracking-widest">
          {certification.issuer}
        </span>
        <h4 className="font-semibold font-serif text-base text-foreground leading-snug">
          {certification.title}
        </h4>
      </div>
      <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground/50 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
    </div>
    <p className="text-muted-foreground text-sm leading-relaxed">
      {certification.description}
    </p>
  </MotionA>
);
