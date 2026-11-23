import type { ReactNode } from 'react';
import { contactEmail } from '@/config/site';
import { SocialLinks } from '@/shared/page/presentation/components/social-links';

export const Contact = (): ReactNode => (
  <section
    id="contact"
    className="page-column scroll-mt-8 pt-32 pb-28 md:pt-44 md:pb-36"
  >
    <h2 className="max-w-4xl font-bold text-[2.5rem] leading-[1.04] tracking-tight md:text-7xl md:leading-[1.02]">
      Talk to me about schools, books or code.
    </h2>
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
