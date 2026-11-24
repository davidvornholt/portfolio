import type { Work } from './work-meta';
export const atriumWork: Work = {
  meta: {
    title: 'Atrium',
    subtitle:
      'I bring the school office and the classroom into the same register.',
    slug: 'atrium',
    date: '2026-08-17',
    timeline: '2026 – present',
    role: 'Founder',
    techStack: ['TypeScript', 'Effect', 'Bun', 'TanStack Start'],
    summary:
      'I bring attendance, sick notes, and parent letters together for a school office.',
    outcome: 'The first school started its pilot in August 2026.',
  },
  body: () => (
    <div className="essay px-6">
      <p>
        A sick note arrives in the office, but the teacher taking attendance
        needs it in the classroom. I built Atrium around that handoff. The
        office, teachers, and parents each see the part of the school day they
        are responsible for.
      </p>
      <h2>Draw the boundary around the school day</h2>
      <p>
        The school already has an official system for certificates and
        promotions. At the first pilot school that system is Atlantis. Atrium
        reads the records it needs and leaves the official decisions there.
        Students appear in the register without needing accounts.
      </p>
      <h2>Let the school own its installation</h2>
      <p>
        Staff sign in through the school’s identity provider. Each school has
        its own instance. The configuration for that instance lives in the
        school’s infrastructure repository, so its administrators can inspect a
        proposed change before it reaches their system.
      </p>
      <p>
        The first school started its pilot in August 2026. I got to know the
        office while <a href="/works/fes-kirchheim">rebuilding its website</a>.
        Watching information travel between paper forms and spreadsheets gave me
        the starting point for Atrium.
      </p>
    </div>
  ),
};
