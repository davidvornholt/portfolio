import type { ReactNode } from 'react';
import {
  MDXCheckItem,
  MDXCheckList,
  MDXSection,
} from '@/shared/content/presentation/components/mdx-layout-components';
import {
  MDXAnchor,
  MDXHeadingOne,
  MDXHeadingTwo,
  MDXParagraph,
  MDXStrong,
} from '@/shared/content/presentation/components/mdx-markdown-elements';
import type { Work } from './work-meta';

const AtriumBody = (): ReactNode => (
  <>
    <MDXSection>
      <MDXHeadingOne>01 The school day, on paper</MDXHeadingOne>
      <MDXHeadingTwo>
        A school runs on a hundred small records a day.
      </MDXHeadingTwo>
      <MDXParagraph>
        Who is present, who is sick, which teacher is out, which class has
        cleaning duty, which letter went home to which parents. At most schools
        these records live in separate tools, in spreadsheets, or on paper, and
        the school office retypes them from one place into the next.
      </MDXParagraph>
      <MDXParagraph>
        Atrium gathers this operative day in one place: class register,
        reliability list, absences and sick notes, teacher absences, parent
        letters, cleaning rota, grade records. It is built for the people who
        carry that day, which means the office, the teachers, and the parents.
      </MDXParagraph>
    </MDXSection>

    <MDXSection>
      <MDXHeadingOne>02 The judgment calls</MDXHeadingOne>
      <MDXHeadingTwo>Most of the architecture is restraint.</MDXHeadingTwo>
      <MDXCheckList>
        <MDXCheckItem
          title="Official data keeps its home"
          description="Certificates, grades, and promotions stay in the school's official system of record, Atlantis at the pilot school. Atrium syncs from it and never has the last word."
        />
        <MDXCheckItem
          title="Students are records, not users"
          description="Student data is synced from the official system. Students get no accounts and no app access, by design."
        />
        <MDXCheckItem
          title="No passwords"
          description="Atrium is an OIDC relying party only. Identity and roles come from the school's identity provider, and Atrium stores no credentials."
        />
        <MDXCheckItem
          title="One school, one instance"
          description="Every school runs its own isolated instance, deployed and owned by that school's infrastructure repository."
        />
      </MDXCheckList>
    </MDXSection>

    <MDXSection>
      <MDXHeadingOne>03 One contract, every surface</MDXHeadingOne>
      <MDXHeadingTwo>
        A single typed API schema is the source of truth.
      </MDXHeadingTwo>
      <MDXParagraph>
        The API contract is written once, as an{' '}
        <MDXStrong>Effect HttpApi schema</MDXStrong>. The backend implements it,
        the web client consumes it typed, and the OpenAPI documentation is
        generated from it. When the contract changes, every consumer fails to
        compile until it follows.
      </MDXParagraph>
      <MDXParagraph>
        Behind the contract sits a modular monolith on Bun. The web app is built
        with TanStack Start, and a mobile app follows once the pilot has settled
        the API. Deployment is declarative: the first production instance is
        owned by the pilot school’s own infrastructure repository.
      </MDXParagraph>
    </MDXSection>

    <MDXSection>
      <MDXHeadingOne>04 Where it stands</MDXHeadingOne>
      <MDXHeadingTwo>In pilot at its first school.</MDXHeadingTwo>
      <MDXParagraph>
        The Freie Evangelische Schule Kirchheim runs the first Atrium pilot. The
        path there is its own story: a website engagement that grew into
        infrastructure and then into a product. It is told in the{' '}
        <MDXAnchor href="/works/fes-kirchheim">FESK case study</MDXAnchor>.
      </MDXParagraph>
      <MDXParagraph>
        A public home for the product is coming at atrium.schule this autumn.
      </MDXParagraph>
    </MDXSection>
  </>
);

export const atriumWork: Work = {
  meta: {
    title: 'Atrium',
    subtitle: 'A platform for the operative day of a school',
    slug: 'atrium',
    date: '2026-08-17',
    timeline: '2026 – present',
    role: 'Founder',
    techStack: ['TypeScript', 'Effect', 'Bun', 'TanStack Start'],
    summary:
      'The operative day of a school in one place: class register, absences, sick notes, parent letters, cleaning rota. One typed contract from API to screen.',
    outcome:
      'In pilot at its first school, the Freie Evangelische Schule Kirchheim. A public home at atrium.schule follows this autumn.',
  },
  body: AtriumBody,
};
