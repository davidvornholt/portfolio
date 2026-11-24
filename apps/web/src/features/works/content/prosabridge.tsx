import type { ReactNode } from 'react';
import {
  MDXCallToAction,
  MDXSection,
} from '@/shared/content/presentation/components/mdx-layout-components';
import {
  MDXHeadingOne,
  MDXParagraph,
} from '@/shared/content/presentation/components/mdx-markdown-elements';
import {
  MDXFeatureCard,
  MDXFeatureGrid,
} from '@/shared/content/presentation/components/mdx-metric-components';
import prosabridgeImage from './images/prosabridge.png';
import type { Work } from './work-meta';

const ProsaBridgeBody = (): ReactNode => (
  <>
    <MDXSection>
      <MDXHeadingOne>Where translation tools give up</MDXHeadingOne>
      <MDXParagraph>
        Machine translation is good at sentences and bad at books. Over four
        hundred pages a term gets translated three different ways, the tone
        drifts, and a phrase that recurs comes back in new wording each time.
        Publishers also work in Microsoft Word, and a careless tool destroys the
        document on the way: its headings, its footnotes, its italics.
      </MDXParagraph>
      <MDXParagraph>
        ProsaBridge is built for this case: very long manuscripts, strict
        control of terms, and theological and academic texts, where a wrong term
        is an error and not a blemish.
      </MDXParagraph>
    </MDXSection>

    <MDXSection>
      <MDXHeadingOne>How it holds a book together</MDXHeadingOne>
      <MDXFeatureGrid>
        <MDXFeatureCard
          title="The layout survives"
          description="The manuscript is extracted to XLIFF, translated, and put back. The Word document keeps its structure, down to footnotes and emphasis."
        />
        <MDXFeatureCard
          title="The terms hold"
          description="Before translation begins, one pass over the whole manuscript builds the glossary, so every term is translated one way, everywhere."
        />
        <MDXFeatureCard
          title="The thread carries"
          description="Every passage is translated together with the text around it, and theological references are looked up in the source they come from."
        />
      </MDXFeatureGrid>
      <MDXParagraph>
        ProsaBridge is built for European publishers, and the pipeline complies
        with the EU AI Act.
      </MDXParagraph>
    </MDXSection>

    <MDXSection>
      <MDXHeadingOne>It works inside Word</MDXHeadingOne>
      <MDXParagraph>
        The ProsaBridge add-in uploads the open manuscript, shows the progress
        while the translation runs, and puts the translated document back into
        Word. When a passage reads wrong, the editor flags it without leaving
        the page.
      </MDXParagraph>
    </MDXSection>

    <MDXSection>
      <MDXHeadingOne>The company</MDXHeadingOne>
      <MDXParagraph>
        I founded ProsaBridge with André Vornholt, who leads the company as CEO.
        As co-founder and CTO I own the architecture and the engineering.
        Publishers pay for it today.
      </MDXParagraph>
      <MDXParagraph>
        I speak German and English at a native level and get by in French and
        Spanish, so I know what a careless translation loses.
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
    subtitle: 'Whole books, translated for publishers',
    slug: 'prosabridge',
    date: '2026-08-17',
    since: 'March 2026',
    role: 'Co-founder and CTO',
    stage: 'Paying customers',
    techStack: ['TypeScript', 'LLM pipelines', 'XLIFF', 'PostgreSQL'],
    liveUrl: 'https://prosabridge.com',
    summary:
      'A publisher sends a manuscript in Word and gets it back in another language, with every heading, footnote, and italic where it was.',
    image: {
      src: prosabridgeImage,
      alt: 'ProsaBridge while it translates a book from German into English: 23 of 35 sections are done, and it expects to finish within the hour.',
      caption: 'The app with invented demo data.',
    },
  },
  body: ProsaBridgeBody,
};
