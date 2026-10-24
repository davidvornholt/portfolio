import type { ReactNode } from 'react';
import {
  MDXAnchor,
  MDXParagraph,
} from '@/shared/content/presentation/components/mdx-markdown-elements';
import { LegalDocument, LegalSection } from '../components/legal-document';
import { OperatorAddress } from '../components/operator-address';

export const ImpressumScreen = (): ReactNode => (
  <LegalDocument
    eyebrow="Impressum"
    title="Legal notice"
    lastUpdated="October 2026"
  >
    <LegalSection title="Information under § 5 DDG">
      <OperatorAddress />
    </LegalSection>

    <LegalSection title="Responsible for content under § 18(2) MStV">
      <MDXParagraph>David Vornholt, at the address above.</MDXParagraph>
    </LegalSection>

    <LegalSection title="Privacy">
      <MDXParagraph>
        How this site handles personal data is described in the{' '}
        <MDXAnchor href="/privacy">privacy notice</MDXAnchor>.
      </MDXParagraph>
    </LegalSection>
  </LegalDocument>
);
