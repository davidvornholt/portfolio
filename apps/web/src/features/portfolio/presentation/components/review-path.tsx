'use client';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useState } from 'react';

const stages = [
  [
    'Issue',
    'Define the failure',
    'When I removed the setting that gave a service access, its current key stopped working. An older key could still grant access for up to 30 days.',
  ],
  [
    'Draft',
    'Change the decision',
    'I give the agent a specific repair. Trace both keys to the setting that authorized them, and revoke both when the setting disappears.',
  ],
  [
    'Checks',
    'Test the boundary',
    'A token still needed during a deployment must keep working. The tests distinguish that case from a withdrawal.',
  ],
  [
    'Review',
    'Inspect the repair',
    'In my review-fix process, fresh reviewers read the change, repairs address their findings, and another pass checks those repairs.',
  ],
  [
    'Land',
    'Publish the decision',
    'I land the tested version. The code and the instructions for operators now agree on when access ends.',
  ],
] as const;
const evidence = [
  [
    ['Current key', 'Revoked'],
    ['Previous key', 'Still active'],
  ],
  [
    ['Current key', 'Trace setting'],
    ['Previous key', 'Trace setting'],
  ],
  [
    ['Setting removed', 'Revoke both'],
    ['Deploy in progress', 'Keep access'],
  ],
  [
    ['Inspect', 'Original change'],
    ['Verify', 'Accepted repairs'],
  ],
  [
    ['Current key', 'Revoked'],
    ['Previous key', 'Revoked'],
  ],
] as const;
export const ReviewPath = () => {
  const [step, setStep] = useState(0);
  const stage = stages[step] ?? stages[0];
  return (
    <div className="review-path mt-9 border border-deep-border p-5 md:p-8">
      <div className="flex items-center justify-between gap-4">
        <p className="folio-label text-deep-primary">Withdrawing access</p>
        <a
          className="text-xs underline"
          href="https://github.com/davidvornholt/standards/pull/598"
        >
          standards #598 ↗
        </a>
      </div>
      <ol className="my-8 grid grid-cols-5">
        {stages.map(([name], i) => (
          <li key={name}>
            <button
              type="button"
              aria-pressed={step === i}
              onClick={() => setStep(i)}
              className="track-stop"
            >
              <span className={`track-node ${i <= step ? 'complete' : ''}`} />
              <span>{name}</span>
            </button>
          </li>
        ))}
      </ol>
      <div className="grid items-end gap-6 md:grid-cols-[1fr_auto_auto]">
        <div
          key={stage[0]}
          aria-live="polite"
          className="stage-copy min-h-36 max-w-lg"
        >
          <p className="font-mono text-deep-primary text-xs">
            0{step + 1} / 05
          </p>
          <h3 className="my-2 font-normal text-2xl md:text-3xl">{stage[1]}</h3>
          <p className="text-deep-muted-foreground">{stage[2]}</p>
        </div>
        <dl
          key={stage[1]}
          className="stage-copy grid min-w-48 gap-3 border-deep-border border-l pl-4"
        >
          {evidence[step]?.map(([label, value]) => (
            <div key={label}>
              <dt className="folio-label text-deep-muted-foreground">
                {label}
              </dt>
              <dd className="font-mono text-deep-primary text-sm">{value}</dd>
            </div>
          ))}
        </dl>
        <div className="flex">
          {[-1, 1].map((dir) => (
            <button
              type="button"
              aria-label={dir > 0 ? 'Next stage' : 'Previous stage'}
              disabled={step + dir < 0 || step + dir >= stages.length}
              className="grid size-11 place-items-center border border-deep-border disabled:opacity-40"
              key={dir}
              onClick={() => setStep(step + dir)}
            >
              {dir < 0 ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
