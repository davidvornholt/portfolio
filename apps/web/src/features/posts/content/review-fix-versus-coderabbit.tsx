import type { Post } from './post-meta';

export const reviewFixVersusCodeRabbitPost: Post = {
  meta: {
    title: 'What two code reviews missed',
    slug: 'review-fix-versus-coderabbit',
    date: '2026-08-26',
    category: 'Engineering',
    readTime: '2 min read',
    excerpt:
      'I gave two review systems the same changes. Their comments were easy to count. Their findings took more work to verify.',
  },
  body: () => (
    <div className="essay">
      <p>
        I took two changes from my standards repository and saved the original
        and repaired versions of each. That gave me four snapshots. I asked
        CodeRabbit Pro for a full review on its Assertive setting and compared
        its reports with my own review-fix process.
      </p>
      <h2>Fifteen findings, fourteen repairs</h2>
      <p>
        My reviewers found nine problems in the policy checker and six in the
        GitHub permissions change. Fourteen needed a correction to the code,
        tests, or instructions. I accepted one credential risk after testing
        whether a narrower permission could do the job.
      </p>
      <p>
        CodeRabbit left one comment. I checked it against the implementation and
        could not reproduce the problem it described. A review with one comment
        looks pleasantly uneventful until you know what the software still does
        wrong.
      </p>
      <h2>How I use the result</h2>
      <p>
        These were two changes in a repository with unusual rules. I use
        reviewers that can read those rules, ask for a repair, and inspect the
        resulting diff. I judge a finding by the behavior it changes. Anyone can
        repeat that part of the comparison from the reports.
      </p>
      <p>
        <a href="https://github.com/davidvornholt/standards/pull/93#issuecomment-5015507517">
          Read the nine policy findings ↗
        </a>
        <br />
        <a href="https://github.com/davidvornholt/standards/pull/94#issuecomment-5015370540">
          Read the six permission findings ↗
        </a>
      </p>
    </div>
  ),
};
