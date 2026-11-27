import type { ReactNode } from 'react';
import { contactEmail } from '@/config/site';
import { SocialLinks } from '@/shared/page/presentation/components/social-links';

export const Contact = (): ReactNode => (
  <section
    id="contact"
    className="page-column -scroll-mt-20 pt-32 pb-28 md:-scroll-mt-32 md:pt-44 md:pb-36"
  >
    <h2 className="font-bold text-[2.5rem] leading-[1.04] tracking-tight md:text-7xl md:leading-[1.02]">
      <span className="block text-balance">AI writes my code.</span>{' '}
      <span className="block text-balance">I answer my email myself.</span>
    </h2>
    <p className="mt-6 max-w-2xl text-balance text-lg md:text-xl md:leading-snug">
      Write to me about a book, a school, or software that has to hold up.
    </p>
    <p className="mt-8">
      <a
        href={`mailto:${contactEmail}`}
        data-umami-event="contact-email"
        className="font-semibold text-2xl underline decoration-2 underline-offset-4 hover:decoration-4 md:text-3xl"
      >
        {contactEmail}
      </a>
    </p>
    <div className="mt-7">
      <SocialLinks />
    </div>
  </section>
);
