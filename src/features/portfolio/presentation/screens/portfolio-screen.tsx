import type { ReactNode } from 'react';
import { BlogTeaser } from '../components/blog-teaser';
import { CTA } from '../components/cta';
import { Expertise } from '../components/expertise';
import { Hero } from '../components/hero';
import { SelectedWorks } from '../components/selected-works';

export const PortfolioScreen = (): ReactNode => (
  <>
    <Hero />
    <SelectedWorks />
    <Expertise />
    <BlogTeaser />
    <CTA />
  </>
);
