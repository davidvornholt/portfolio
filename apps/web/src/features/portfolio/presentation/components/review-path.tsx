'use client';
import Image from 'next/image';
import { useState } from 'react';

const frames = [
  {
    name: 'Issue',
    title: 'One key still worked.',
    image: 'proof',
    alt: 'One piece of metal type sits out of alignment.',
    caption:
      'I withdrew permission from a service. Its current key stopped working. Its previous key could still grant access for up to 30 days.',
  },
  {
    name: 'Repair',
    title: 'I traced both keys to one setting.',
    image: 'press',
    alt: 'A book press holds folded pages together.',
    caption:
      'I asked the agent to tie both keys to the permission that issued them. The tests also covered a deployment that still needed its key.',
  },
  {
    name: 'Review',
    title: 'I checked what happened after withdrawal.',
    image: 'turn',
    alt: 'A bound book opens across its spine.',
    caption:
      'Fresh reviewers inspect the repair. I resolve their findings and check the revised version. With this change in place, withdrawing permission revokes both keys.',
  },
] as const;
export const ReviewPath = () => {
  const [selected, setSelected] = useState(0);
  const frame = frames[selected] ?? frames[0];
  return (
    <div className="sequence">
      <div className="frame-window">
        <Image
          key={frame.image}
          src={`/stills/${frame.image}.webp`}
          alt={frame.alt}
          fill={true}
          sizes="(max-width: 760px) 92vw, 65vw"
          className="frame-image object-cover"
        />
        <span className="frame-counter credit-label">0{selected + 1} / 03</span>
      </div>
      <div className="sequence-script">
        <p className="credit-label">A change in three frames</p>
        <div aria-live="polite" className="frame-caption">
          <h3>{frame.title}</h3>
          <p>{frame.caption}</p>
        </div>
        <div className="frame-selectors">
          {frames.map((still, i) => (
            <button
              type="button"
              key={still.name}
              aria-pressed={selected === i}
              onClick={() => setSelected(i)}
            >
              <span aria-hidden="true">0{i + 1}</span>
              {still.name}
            </button>
          ))}
        </div>
        <a
          className="film-link mt-5"
          href="https://github.com/davidvornholt/standards/pull/598"
        >
          Read the change on GitHub ↗
        </a>
      </div>
    </div>
  );
};
