import type { ReactNode } from 'react';
import { contactEmail } from '@/config/site';
import { MDXAnchor } from '@/shared/content/presentation/components/mdx-markdown-elements';
import { LegalAddress } from './legal-document';

export const OperatorAddress = (): ReactNode => (
  <LegalAddress>
    David Vornholt
    <br />
    Schlehenweg 8
    <br />
    73230 Kirchheim unter Teck
    <br />
    Germany
    <br />
    Email: <MDXAnchor href={`mailto:${contactEmail}`}>{contactEmail}</MDXAnchor>
  </LegalAddress>
);
