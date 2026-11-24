'use client';

import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { useState } from 'react';

const impressions = [
  {
    label: 'Issue',
    title: 'One key still worked.',
    body: 'When I withdrew access, the current key stopped working. Its predecessor could still open the same door for up to 30 days.',
    from: 'Access withdrawn',
    to: 'Old key active',
  },
  {
    label: 'Repair',
    title: 'Trace both keys.',
    body: 'I tied the previous key to the setting that granted access. Removing that setting now retires both active keys.',
    from: 'One key revoked',
    to: 'Both revoked',
  },
  {
    label: 'Tests',
    title: 'Keep the handoff working.',
    body: 'A running server needs its old key until the replacement arrives. I tested both cases. Removing the setting revokes access. Renewing the key preserves it.',
    from: 'Key renewed',
    to: 'Access retained',
  },
  {
    label: 'Review',
    title: 'Cut a misleading comment.',
    body: 'A reviewer found a comment that described every listed key as active. A disabled key could appear there too. I removed the claim and a second comment that repeated the policy.',
    from: 'Always active',
    to: 'Claim removed',
  },
  {
    label: 'Release',
    title: 'Check the final version.',
    body: 'All 312 credential tests passed. I ran the full project checks on the revision with both comments removed before I landed it.',
    from: '312 tests',
    to: '312 passed',
  },
] as const;

export const ReviewPath = () => {
  const [index, setIndex] = useState(0);
  const impression = impressions[index] ?? impressions[0];
  return (
    <div className="proof-stack">
      <div className="edition-line">
        <span>Withdrawing access</span>
        <a
          className="inline-flex items-center gap-1 underline"
          href="https://github.com/davidvornholt/standards/pull/598"
        >
          standards #598 <ArrowUpRight size={13} />
        </a>
      </div>
      <div key={impression.label} className="proof-face" aria-live="polite">
        <div className="proof-number" aria-hidden="true">
          0{index + 1}
        </div>
        <div className="proof-copy">
          <p className="folio-label">
            Impression {index + 1} of {impressions.length}
          </p>
          <h3 className="proof-heading">{impression.title}</h3>
          <p>{impression.body}</p>
          <p className="proof-result">
            <span>{impression.from}</span>
            <ArrowRight size={16} />
            <strong>{impression.to}</strong>
          </p>
        </div>
      </div>
      <div className="proof-controls">
        <fieldset aria-label="Review stages">
          {impressions.map(({ label }, i) => (
            <button
              key={label}
              type="button"
              aria-pressed={index === i}
              onClick={() => setIndex(i)}
            >
              {label}
            </button>
          ))}
        </fieldset>
        <div>
          {[-1, 1].map((direction) => (
            <button
              key={direction}
              type="button"
              disabled={
                index + direction < 0 || index + direction >= impressions.length
              }
              aria-label={direction > 0 ? 'Next stage' : 'Previous stage'}
              onClick={() => setIndex(index + direction)}
            >
              {direction > 0 ? (
                <ArrowRight size={16} />
              ) : (
                <ArrowLeft size={16} />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
