import type { Post } from './post-meta';

export const readingMyChangeRecordPost: Post = {
  meta: {
    title: 'Why I put my change record on the front page',
    slug: 'reading-my-change-record',
    date: '2026-11-24',
    category: 'Engineering',
    readTime: '2 min read',
    excerpt:
      'A passing test tells you something specific. I wanted readers to be able to see exactly what it says, including the times it failed.',
  },
  body: () => (
    <div className="essay">
      <p>
        A publishing editor and a software engineer can both ask me how I know a
        change is ready. I wanted the first answer on my portfolio to work for
        either of them. Each square on the home page stands for one change.
        Select it and you can read what happened.
      </p>
      <h2>Which result belongs to a change?</h2>
      <p>
        A test can fail, then pass on a later run. Counting the old failure
        forever would tell the wrong story. I read the latest result for each
        named check on the version I merged. If a public preview failed to
        deploy, I leave that failure visible.
      </p>
      <h2>What a reader can verify</h2>
      <p>
        Public entries link to the original change. For private work, including
        work at ProsaBridge, I publish only the date and size of changes that
        passed. A quiet patch on the chart can have several explanations. It is
        a record of the work I can show, not a measure of how hard I worked.
      </p>
      <p>
        I put a real repair before the chart because even a perfect run of
        passing checks would leave a question unanswered. What did the tests
        actually protect? In the standards example, the answer is access that
        should end when I withdraw a credential.
      </p>
      <a href="/#method">Follow the repair</a>
    </div>
  ),
};
