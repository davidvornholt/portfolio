'use client';

import { ArrowUpRight } from 'lucide-react';
import { useState } from 'react';

const pullRequest = 'https://github.com/davidvornholt/standards/pull/598';
const stages = [
  {
    name: 'Issue',
    title: 'An old key still opened the door.',
    text: 'When I withdrew access to a service, its current key stopped working. A previous key could still grant access for up to 30 days.',
    link: pullRequest,
    source: 'Read the change',
  },
  {
    name: 'Draft',
    title: 'Trace both keys to one setting.',
    text: 'I changed the plan so it revokes both active keys when the setting that granted them disappears. If a deployment still needs the old key, it keeps working.',
    link: `${pullRequest}/files`,
    source: 'Inspect the patch',
  },
  {
    name: 'Check',
    title: 'Reproduce the failure first.',
    text: 'Three tests failed on the original code and passed with the repair. I also tested that withdrawing one part of a paired key leaves the remaining access in place.',
    link: pullRequest,
    source: 'See verification',
  },
  {
    name: 'Review',
    title: 'Inspect the repair',
    text: 'Two reviewers examined the behavior and the assumptions behind it. I checked two proposed blockers against the old code. Both were already present. Two comments in the new code still needed correcting.',
    link: `${pullRequest}#issuecomment-7087643522`,
    source: 'Read the review',
  },
  {
    name: 'Release',
    title: 'Ship the checked version.',
    text: 'I ran the full gate after the edits and merged the repair. Version 0.44.1 of my standards tool shipped the change.',
    link: 'https://github.com/davidvornholt/standards/releases/tag/v0.44.1',
    source: 'Open release 0.44.1',
  },
  {
    name: 'Fix',
    title: 'Correct two comments and check again.',
    text: 'One comment overlooked disabled keys. Another repeated the same policy in a second place. I cut both and reran the checks. These edits changed no behavior, so the review ended there.',
    link: `${pullRequest}/commits/e5cefbee24b5233cf36b1c36f21095d00e96c8df`,
    source: 'Read the edits',
  },
] as const;

export const ReviewPath = () => {
  const [selected, setSelected] = useState(0);
  const stage = stages[selected] ?? stages[0];
  return (
    <div className="review-path">
      <div className="review-caption">
        <span>Standards</span>
        <a href={pullRequest}>PR #598 ↗</a>
      </div>
      <div className="review-schematic">
        <svg
          viewBox="0 0 1000 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <title>Repair branch returns from review to checks</title>
          <path d="M100 25H900" className="main-track" />
          <path
            d="M700 25v31q0 12 -14 12H514q-14 0 -14 -12V25M559 61l-9 7 9 7"
            className="fix-track"
          />
        </svg>
        {stages.map(({ name }, i) => (
          <button
            key={name}
            type="button"
            className={name === 'Fix' ? 'branch-stop' : 'review-stop'}
            aria-pressed={selected === i}
            onClick={() => setSelected(i)}
          >
            <i aria-hidden="true" />
            {name}
          </button>
        ))}
      </div>
      <div className="stage-detail" aria-live="polite">
        <div key={stage.name}>
          <h3>{stage.title}</h3>
          <p>{stage.text}</p>
          <a href={stage.link} className="ink-link">
            {stage.source}
            <ArrowUpRight size={15} />
          </a>
        </div>
      </div>
    </div>
  );
};
