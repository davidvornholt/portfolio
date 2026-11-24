import type { Post } from './post-meta';

export const cheapAiCodeReviewsPost: Post = {
  meta: {
    title: 'The cost of a missed review finding',
    slug: 'cheap-ai-code-reviews',
    date: '2026-09-07',
    category: 'Engineering',
    readTime: '2 min read',
    excerpt:
      'A cheaper reviewer missed a reload loop. I measured what the browser actually did and compared the cost of the finished repairs.',
  },
  body: () => (
    <div className="essay">
      <p>
        In one of my Rota tests, an error sent the app back to its data loader.
        Five seconds later the loader had run 2,494 times. A casual look at the
        screen would never have told me how busy the browser was.
      </p>
      <h2>What I paid attention to</h2>
      <p>
        I tried different review setups on nine changes across two projects. For
        the last two changes, four setups started with the same code and
        instructions. I compared the bugs each one found and the behavior of the
        repaired code.
      </p>
      <p>
        Astra found three important bugs that the cheaper setups missed
        independently. Luna also made a repair that let a server error look like
        success again. I reproduced that failure separately and kept the repair
        out of production.
      </p>
      <h2>The price of the finished work</h2>
      <p>
        At the prices I recorded in September, the last two tasks would have
        cost about $2.75 with Luna throughout and $44.70 with Astra throughout.
        Putting Astra in charge of Luna came to at least $48.47. Some usage was
        missing from that last estimate.
      </p>
      <p>
        I chose Astra at medium effort for the lead, review, and repair roles. I
        had evidence about these changes, not a general ranking of models. What
        settled it for me was that a missed bug could come back with a confident
        review and no signal to try again.
      </p>
      <a href="/posts/cheap-ai-code-reviews/evidence.md">
        Read my methods and cost notes
      </a>
    </div>
  ),
};
