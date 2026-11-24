import type { ReactNode } from 'react';
import {
  MDXCheckItem,
  MDXCheckList,
  MDXSection,
} from '@/shared/content/presentation/components/mdx-layout-components';
import {
  MDXAnchor,
  MDXHeadingOne,
  MDXParagraph,
} from '@/shared/content/presentation/components/mdx-markdown-elements';
import atriumImage from './images/atrium.png';
import type { Work } from './work-meta';

const AtriumBody = (): ReactNode => (
  <>
    <MDXSection>
      <MDXHeadingOne>The school day, on paper</MDXHeadingOne>
      <MDXParagraph>
        A school keeps a hundred small records a day: who is present, who is
        sick, which teacher is out, which class has cleaning duty, which letter
        went home to which parents. At most schools these records live in
        separate tools, in spreadsheets, or on paper, and the school office
        types them from one place into the next.
      </MDXParagraph>
      <MDXParagraph>
        Atrium puts them in one place: the class register, the reliability list,
        absences and sick notes, teacher absences, parent letters, and the
        cleaning rota. It is built for the people who carry that day: the
        office, the teachers, and the parents.
      </MDXParagraph>
    </MDXSection>

    <MDXSection>
      <MDXHeadingOne>What Atrium leaves alone</MDXHeadingOne>
      <MDXCheckList>
        <MDXCheckItem
          title="Official data keeps its home"
          description="Certificates, grades, and promotions stay in the school’s official system of record, which is Atlantis at the pilot school. Atrium reads from it and never has the last word."
        />
        <MDXCheckItem
          title="Students are records, not users"
          description="Student data comes from the official system. Students get no accounts and no access to the app, on purpose."
        />
        <MDXCheckItem
          title="No passwords"
          description="Identity and roles come from the school’s own sign-in service. Atrium stores no passwords."
        />
        <MDXCheckItem
          title="One school, one instance"
          description="Every school runs its own separate instance, which that school’s infrastructure repository deploys and owns."
        />
      </MDXCheckList>
    </MDXSection>

    <MDXSection>
      <MDXHeadingOne>One contract for every part</MDXHeadingOne>
      <MDXParagraph>
        The API is described once, as an Effect HttpApi schema. The backend
        implements it, the web client uses it with its types, and the OpenAPI
        documentation is generated from it. When the contract changes, every
        part that uses it fails to compile until it follows.
      </MDXParagraph>
      <MDXParagraph>
        Behind the contract sits a modular monolith on Bun. The web app is built
        with TanStack Start, and a mobile app follows once the pilot has settled
        the API.
      </MDXParagraph>
    </MDXSection>

    <MDXSection>
      <MDXHeadingOne>Where it stands</MDXHeadingOne>
      <MDXParagraph>
        The Freie Evangelische Schule Kirchheim runs the first pilot. How a
        website job there grew into servers and then into a product is told in
        the <MDXAnchor href="/works/fes-kirchheim">FESK case study</MDXAnchor>.
      </MDXParagraph>
    </MDXSection>
  </>
);

export const atriumWork: Work = {
  meta: {
    title: 'Atrium',
    subtitle: 'A school’s day in one place',
    slug: 'atrium',
    date: '2026-08-17',
    since: '2026',
    role: 'Founder',
    stage: 'In pilot at its first school',
    techStack: ['TypeScript', 'Effect', 'Bun', 'TanStack Start'],
    summary:
      'Class register, absences, sick notes, parent letters, and the cleaning rota in one system instead of spreadsheets and paper.',
    image: {
      src: atriumImage,
      alt: 'Atrium’s class register for one Monday, laid out like the paper register German teachers know: six lessons as ruled rows with their numbers in a red margin, the running lesson open with the attendance of 24 children, and signed lessons marked with the teacher’s initials in blue ink.',
      caption: 'A design for the coming version, with invented demo data.',
    },
  },
  body: AtriumBody,
};
