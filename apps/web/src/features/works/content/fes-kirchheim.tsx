import type { Work } from './work-meta';
export const fesKirchheimWork: Work = {
  meta: {
    title: 'Freie Evangelische Schule Kirchheim',
    subtitle: 'I rebuilt a school website around the people who update it.',
    slug: 'fes-kirchheim',
    date: '2024-08-01',
    timeline: 'August 2024 – present',
    role: 'Lead full stack developer',
    techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'NixOS'],
    liveUrl: 'https://fes-kirchheim.de',
    summary:
      'I rebuilt a school website so the office could publish its own news and families could find it.',
    outcome:
      'Search impressions increased 300 percent year over year. Infrastructure costs fell 60 percent.',
  },
  body: () => (
    <div className="essay px-6">
      <p>
        The school office needed to publish news and change dates without asking
        a developer. Families needed those updates on their phones. On the old
        website the first request after a quiet spell could take five seconds
        before the browser received anything.
      </p>
      <h2>Serve the page before the server wakes up</h2>
      <p>
        I moved the public pages behind a cache and gave the office an editing
        workflow it could run itself. The cached response took about 50
        milliseconds to start. I wrote up the{' '}
        <a href="/posts/solving-the-cold-boot-problem">
          before-and-after measurements
        </a>
        .
      </p>
      <h2>What changed for the school</h2>
      <p>
        Search impressions increased 300 percent year over year. The rebuilt
        site scored 100 in Lighthouse for SEO and best practices. Annual
        infrastructure costs fell 60 percent.
      </p>
      <h2>Give the school a record of its servers</h2>
      <p>
        I described the host and services in code. When a setting changes, the
        school has a record of who changed it and what ran before. The same
        school became the first to pilot <a href="/works/atrium">Atrium</a> in
        August 2026.
      </p>
    </div>
  ),
};
