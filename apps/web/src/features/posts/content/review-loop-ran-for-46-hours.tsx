import type { ReactNode } from 'react';
import type { Post } from './post-meta';

const RunawayDiffFigure = (): ReactNode => (
  <figure className="my-10 border-border border-y py-8">
    <div className="space-y-8">
      <div>
        <div className="flex items-baseline justify-between gap-4">
          <p className="font-medium text-foreground text-sm">Original change</p>
          <p className="text-right font-mono text-muted-foreground text-xs tabular-nums">
            179 added lines · 7 files
          </p>
        </div>
        <div aria-hidden="true" className="mt-3 h-1 bg-border">
          <span className="block h-1 w-[0.48%] min-w-1 bg-primary" />
        </div>
      </div>
      <div>
        <div className="flex items-baseline justify-between gap-4">
          <p className="font-medium text-foreground text-sm">
            Force-stopped branch
          </p>
          <p className="text-right font-mono text-foreground text-xs tabular-nums">
            37,451 added lines · 350 files
          </p>
        </div>
        <div aria-hidden="true" className="mt-3 h-1 bg-primary" />
      </div>
    </div>
    <div className="mt-8 grid gap-4 border-border border-t pt-4 font-mono text-xs sm:grid-cols-3">
      <p>
        <span className="block text-primary text-xl tabular-nums">39</span>
        <span className="text-muted-foreground">full review passes</span>
      </p>
      <p>
        <span className="block text-primary text-xl tabular-nums">~46 h</span>
        <span className="text-muted-foreground">before I stopped it</span>
      </p>
      <p>
        <span className="block text-primary text-xl tabular-nums">0 / 2</span>
        <span className="text-muted-foreground">clean-pass counter</span>
      </p>
    </div>
    <figcaption className="mt-6 text-muted-foreground text-sm">
      The process multiplied the added lines by about 209 and still could not
      satisfy its stopping rule.
    </figcaption>
  </figure>
);
export const reviewLoopRanFor46HoursPost: Post = {
  meta: {
    title: 'The review that ran for 46 hours',
    slug: 'review-loop-ran-for-46-hours',
    date: '2026-08-26',
    category: 'Engineering',
    readTime: '2 min read',
    excerpt:
      'I stopped a review after a seven-file change had grown to 350 files. The stopping rule explained how it got there.',
  },
  body: () => (
    <div className="essay">
      <p>
        I wanted two controls on a command-line tool. One picked a version. The
        other let a project opt out of scheduled updates. My first draft added
        179 lines across seven files. I handed it to five reviewers.
      </p>
      <h2>What the reviewers saw</h2>
      <p>
        Each reviewer read the whole change. Workers made repairs, and the next
        group reviewed the original work <em>and</em> the repairs. I had asked
        for two consecutive passes with no findings. Every new fix gave the next
        five reviewers something else to question.
      </p>
      <RunawayDiffFigure />
      <h2>Where I drew the line</h2>
      <p>
        After 39 passes I stopped the run. I went back to the original request.
        The change I kept added 217 lines across seven files. The extra work had
        made it harder to answer the only question that mattered to the people
        using the tool. Did those two controls work?
      </p>
      <p>
        I now give the verification pass a narrower job. Check the accepted
        findings and the repairs. If a reviewer discovers a separate piece of
        work, I can decide whether to take it on separately.
      </p>
      <a href="https://github.com/davidvornholt/standards/blob/museum/review-loop-failed-experiment/POST-MORTEM.md">
        Read the full incident record ↗
      </a>
    </div>
  ),
};
