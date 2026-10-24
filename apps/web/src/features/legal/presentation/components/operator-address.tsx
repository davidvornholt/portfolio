import type { ReactNode } from 'react';
import { contactEmail } from '@/config/site';
import { MDXAnchor } from '@/shared/content/presentation/components/mdx-markdown-elements';
import { LegalAddress } from './legal-document';
import { Placeholder } from './placeholder';

export const OperatorAddress = (): ReactNode => (
  <LegalAddress>
    David Vornholt
    <br />
    <Placeholder>street and house number</Placeholder>
    <br />
    <Placeholder>postal code and city</Placeholder>
    <br />
    Germany
    <br />
    Email: <MDXAnchor href={`mailto:${contactEmail}`}>{contactEmail}</MDXAnchor>
  </LegalAddress>
);
