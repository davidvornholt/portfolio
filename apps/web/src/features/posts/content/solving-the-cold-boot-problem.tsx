import { MDXChart } from '@/shared/content/presentation/components/mdx-metric-components';
import type { Post } from './post-meta';

const coldMs = 5200;
const warmMs = 800;
const cachedMs = 50;
export const solvingTheColdBootProblemPost: Post = {
  meta: {
    title: 'Why the first visitor waited five seconds',
    slug: 'solving-the-cold-boot-problem',
    date: '2026-02-01',
    category: 'Engineering',
    readTime: '2 min read',
    excerpt:
      'The school published a few updates a day. Its old website rebuilt the page whenever someone asked for it.',
  },
  body: () => (
    <div className="essay">
      <p>
        I timed two visits to the school website. With the old server already
        awake, it took about 800 milliseconds to send the first byte. After a
        quiet spell, the same request took 5.2 seconds. A parent looking up a
        date had to wait for a database connection and a fresh page.
      </p>
      <MDXChart
        type="bar"
        title="Time until the first byte"
        data={{
          labels: ['Old site, cold', 'Old site, warm', 'Cached page'],
          values: [coldMs, warmMs, cachedMs],
        }}
        unit="ms"
      />
      <h2>Move the work off the request</h2>
      <p>
        The office changed the news a few times a day. Most visitors were asking
        for identical HTML. I started serving a saved copy and refreshing it in
        the background after the revalidation window. A visitor could read the
        previous edition while the server prepared the next.
      </p>
      <p>
        The cached response took about 50 milliseconds in my comparison. That
        measures the start of the response. Images, fonts, and the rest of the
        page still have to reach the browser.
      </p>
      <h2>What the office gained</h2>
      <p>
        The office kept control over its news and event listings. The rebuilt
        platform cost 60 percent less per year to run. The important change for
        a family checking the website early in the morning was simpler. Being
        first no longer meant waking the server.
      </p>
      <a href="/works/fes-kirchheim">Read the school case study</a>
    </div>
  ),
};
