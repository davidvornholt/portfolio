import type { ReactNode } from 'react';
import {
  BlogTeaser,
  CTA,
  Expertise,
  Hero,
  SelectedWorks,
  SiteFooter,
  SiteHeader,
} from './components';

const Page = (): ReactNode => (
  <>
    <SiteHeader />
    <main>
      <Hero />
      <SelectedWorks />
      <Expertise />
      <BlogTeaser />
      <CTA />
    </main>
    <SiteFooter />
  </>
);

export default Page;
