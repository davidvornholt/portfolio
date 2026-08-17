import type { ReactNode } from 'react';
import {
  MDXCallToAction,
  MDXSection,
} from '@/shared/content/presentation/components/mdx-layout-components';
import {
  MDXHeadingOne,
  MDXHeadingTwo,
  MDXParagraph,
  MDXStrong,
} from '@/shared/content/presentation/components/mdx-markdown-elements';
import {
  MDXFeatureCard,
  MDXFeatureGrid,
} from '@/shared/content/presentation/components/mdx-metric-components';
import type { Work } from './work-meta';

const ProsaBridgeBody = (): ReactNode => (
  <>
    <MDXSection>
      <MDXHeadingOne>01 Where translation tools give up</MDXHeadingOne>
      <MDXHeadingTwo>
        A book is one long argument. Most tools translate it one sentence at a
        time.
      </MDXHeadingTwo>
      <MDXParagraph>
        Machine translation is good at sentences and bad at books. Across four
        hundred pages, terminology drifts, tone wanders, and recurring phrases
        return in new disguises. The working format of publishing is Microsoft
        Word, and a careless pipeline shreds it: headings, footnotes, emphasis,
        the typography a book is set in.
      </MDXParagraph>
      <MDXParagraph>
        ProsaBridge is built for exactly this case: very large manuscripts,
        strong terminology control, and theological and academic content, where
        a wrong term is not a blemish but an error.
      </MDXParagraph>
    </MDXSection>

    <MDXSection>
      <MDXHeadingOne>02 How it holds a book together</MDXHeadingOne>
      <MDXFeatureGrid>
        <MDXFeatureCard
          icon="code"
          title="The layout survives"
          description="Manuscripts are extracted to XLIFF, translated, and reinjected. The Word document keeps its structure, down to footnotes and emphasis."
          delay={0}
        />
        <MDXFeatureCard
          icon="search"
          title="Terminology holds"
          description="A map-reduce pass over the whole manuscript builds the glossary before translation begins, so every term is rendered one way, everywhere."
          delay={0.1}
        />
        <MDXFeatureCard
          icon="lineChart"
          title="Continuity carries"
          description="Every passage is translated with overlapping context from its neighbors, and domain lookups ground theological references in the source text."
          delay={0.2}
        />
      </MDXFeatureGrid>
      <MDXParagraph>
        ProsaBridge is built for European publishers, and compliance is part of
        the engineering: the pipeline is{' '}
        <MDXStrong>fully EU AI Act compliant</MDXStrong>.
      </MDXParagraph>
    </MDXSection>

    <MDXSection>
      <MDXHeadingOne>03 It lives in Word</MDXHeadingOne>
      <MDXHeadingTwo>Editors keep their instrument.</MDXHeadingTwo>
      <MDXParagraph>
        The ProsaBridge add-in uploads the active manuscript, reports progress
        while the pipeline works, and delivers the translated document back into
        Word. When a passage reads wrong, the editor flags it without leaving
        the page.
      </MDXParagraph>
    </MDXSection>

    <MDXSection>
      <MDXHeadingOne>04 The company</MDXHeadingOne>
      <MDXHeadingTwo>
        Built by two people who take books seriously.
      </MDXHeadingTwo>
      <MDXParagraph>
        I founded ProsaBridge with André Vornholt, who leads the company as CEO.
        As co-founder and CTO I own the architecture and the engineering. Our
        first publishing customer is testing the engine on real manuscripts, and
        in October 2026 we will be at the Frankfurt Book Fair.
      </MDXParagraph>
      <MDXParagraph>
        I live in four languages, so translation is not an abstract problem to
        me. I know what a careless one loses. ProsaBridge exists so a publisher
        never has to accept that loss.
      </MDXParagraph>
    </MDXSection>

    <MDXCallToAction
      title="See ProsaBridge"
      description="The product, the pipeline, and the company."
      href="https://prosabridge.com"
      linkText="Visit prosabridge.com"
    />
  </>
);

export const prosabridgeWork: Work = {
  meta: {
    title: 'ProsaBridge',
    subtitle: 'An enterprise AI translation engine for book publishers',
    slug: 'prosabridge',
    date: '2026-08-17',
    timeline: 'March 2026 – present',
    role: 'Co-founder & CTO',
    techStack: ['TypeScript', 'LLM pipelines', 'XLIFF', 'PostgreSQL'],
    liveUrl: 'https://prosabridge.com',
    summary:
      'Whole manuscripts move through context-aware LLM pipelines and come back as Word documents with every heading, footnote, and italic in place.',
    outcome:
      'In testing with the first publishing customer. At the Frankfurt Book Fair in October 2026.',
  },
  body: ProsaBridgeBody,
};
