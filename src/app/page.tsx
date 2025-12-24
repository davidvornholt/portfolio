import type { ReactNode } from 'react';
import { BlogTeaser } from '../features/portfolio/presentation/components/blog-teaser';
import { CTA } from '../features/portfolio/presentation/components/cta';
import { Expertise } from '../features/portfolio/presentation/components/expertise';
import { Hero } from '../features/portfolio/presentation/components/hero';
import { SelectedWorks } from '../features/portfolio/presentation/components/selected-works';

const Page = (): ReactNode => (
  <>
    <Hero />
    <SelectedWorks />
    <Expertise />
    <BlogTeaser />
    <CTA />
  </>
);

export default Page;
