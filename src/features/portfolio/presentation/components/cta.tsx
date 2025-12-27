'use client';

import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import {
  type MouseEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react';

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
  const [emailAddress, setEmailAddress] = useState<string | null>(null);

  useEffect((): void => {
    setEmailAddress(getEmailAddress());
  }, []);

  const handleClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>): void => {
      event.preventDefault();

      window.location.href = `mailto:${getEmailAddress()}`;
    },
    [],
  );

  const fallbackLabel = 'david [at] vornholt [dot] online';

  return (
    <a
      href={emailAddress ? `mailto:${emailAddress}` : '#'}
      onClick={handleClick}
      className="group inline-flex items-center gap-3 rounded-md bg-primary-foreground px-8 py-4 text-base font-medium text-primary transition-all hover:bg-primary-foreground/90"
    >
      <Mail className="h-5 w-5 transition-transform group-hover:-translate-y-0.5" />
      {emailAddress ?? fallbackLabel}
    </a>
  );
};

export const CTA = (): ReactNode => (
  <section id="contact" className="bg-primary px-6 py-24 md:py-32">
    <motion.div
      {...fadeInUp}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="mx-auto max-w-3xl text-center"
    >
      <p className="mb-4 text-sm font-medium uppercase tracking-widest text-primary-foreground/70">
        Let&apos;s Connect
      </p>

      <h2 className="mb-6 font-serif text-4xl font-semibold text-primary-foreground md:text-5xl">
        Ready to Build Something Meaningful?
      </h2>

      <p className="mb-10 text-lg leading-relaxed text-primary-foreground/80">
        Great systems start with a conversation. Whether you have a specific
        project in mind or want to discuss the intersection of code and
        community, let&apos;s architect something that lasts.
      </p>

      <EmailLink />
    </motion.div>
  </section>
);
