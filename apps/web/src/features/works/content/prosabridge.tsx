import type { Work } from './work-meta';
export const prosabridgeWork: Work = {
  meta: {
    title: 'ProsaBridge',
    subtitle: 'I build translation software for book editors.',
    slug: 'prosabridge',
    date: '2026-08-17',
    timeline: 'March 2026 – present',
    role: 'Co-founder & CTO',
    techStack: ['TypeScript', 'LLM pipelines', 'XLIFF', 'PostgreSQL'],
    liveUrl: 'https://prosabridge.com',
    summary:
      'I help publishers translate manuscripts without rebuilding the book in Word.',
    outcome:
      'Our first publishing customer is testing the engine on manuscripts.',
  },
  body: () => (
    <div className="essay px-6">
      <p>
        A translator needs to know how a term was translated two hundred pages
        ago. An editor needs the footnote attached to the same sentence when the
        translation comes back. I co-founded ProsaBridge with André Vornholt to
        handle both parts of that handoff.
      </p>
      <h2>Read the book before translating it</h2>
      <p>
        We extract the text from a Word manuscript into a format called XLIFF
        and preserve the document structure. Before translating individual
        passages, the engine reads across the manuscript to build a glossary. In
        theological and academic books, the same term can recur in an argument
        that spans several chapters.
      </p>
      <h2>Put the translation back on the page</h2>
      <p>
        Each passage travels with text from its neighbors. After translation, we
        put the passages back into the original document. Headings, emphasis,
        and footnotes keep their places. An editor can flag a passage inside
        Word and keep working in the manuscript they know.
      </p>
      <p>
        André leads the company as CEO. I lead the engineering. Our first
        publishing customer is testing the engine on real manuscripts.
      </p>
    </div>
  ),
};
