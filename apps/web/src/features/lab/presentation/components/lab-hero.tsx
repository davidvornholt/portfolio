import type { ReactNode } from 'react';
import { BackNavigation } from '@/shared/content/presentation/components/back-navigation';

export const LabHero = (): ReactNode => (
  <>
    <BackNavigation href="/" label="Home" />
    <section className="page-column pt-8 pb-12 md:pt-12">
      <h1 className="font-bold text-4xl leading-[1.05] tracking-tight md:text-6xl">
        The creative lab
      </h1>
      <p className="mt-4 max-w-2xl font-semibold text-xl leading-snug md:text-2xl">
        Films I have made: short films, a documentary, and an ad, in French and
        German.
      </p>
    </section>
  </>
);
