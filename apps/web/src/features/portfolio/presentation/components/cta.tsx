import { easing } from '@portfolio/ui/easing';
import { Mail } from 'lucide-react';
import { div as MotionDiv } from 'motion/react-client';
import type { ReactNode } from 'react';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
};

const EMAIL_PARTS = {
  user: 'david',
  domain: 'vornholt',
  tld: 'online',
} as const;

const getEmailAddress = (): string =>
  `${EMAIL_PARTS.user}@${EMAIL_PARTS.domain}.${EMAIL_PARTS.tld}`;

const EmailLink = (): ReactNode => {
  const emailAddress = getEmailAddress();

  return (
    <a
      href={`mailto:${emailAddress}`}
      data-umami-event="contact-email"
      className="group inline-flex items-center gap-3 bg-deep-foreground px-8 py-4 font-medium text-base text-deep transition-colors hover:bg-deep-foreground/90"
    >
      <Mail className="h-5 w-5 transition-transform group-hover:-translate-y-0.5" />
      {emailAddress}
    </a>
  );
};

export const CTA = (): ReactNode => (
  <section id="contact" className="bg-deep px-6 py-24 md:py-32">
    <MotionDiv
      {...fadeInUp}
      transition={{ duration: 0.6, ease: easing }}
      className="mx-auto max-w-3xl text-center"
    >
      <p className="mb-4 font-medium text-deep-primary text-sm uppercase tracking-widest">
        Let&apos;s connect
      </p>

      <h2 className="mb-6 font-semibold font-serif text-4xl text-deep-foreground md:text-5xl">
        Talk to me about schools, books, or code.
      </h2>

      <p className="mb-10 text-deep-muted-foreground text-lg leading-relaxed">
        If you run a school that Atrium could serve, a publishing house with
        manuscripts to translate, or you want to compare notes on quality gates
        and agent workflows, write me.
      </p>

      <EmailLink />
    </MotionDiv>
  </section>
);
