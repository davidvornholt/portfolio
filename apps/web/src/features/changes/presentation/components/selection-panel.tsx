import type { ReactNode } from 'react';
import type { MarkDescription } from '@/features/changes/services/describe-mark';
import { formatPostDate } from '@/shared/content/services/format-post-date';
import './change-field.css';

const keyCodes = {
  passed: undefined,
  failed: 'f',
  unchecked: 'u',
  caught: 'c',
} as const;

const stepClassName =
  'inline-flex size-11 items-center justify-center border-2 border-foreground font-bold text-lg hover:bg-foreground hover:text-background';

/** What the selected square stands for, with the ways to move on from it. */
export const SelectionPanel = ({
  date,
  description,
  pinned,
  onStep,
  onClose,
}: Readonly<{
  date: string;
  /** Undefined while the details are still on their way. */
  description: MarkDescription | undefined;
  pinned: boolean;
  onStep: (step: 1 | -1) => void;
  onClose: () => void;
}>): ReactNode => (
  <>
    <p className="text-muted-foreground">
      {formatPostDate(date)}
      {description === undefined ? null : ` · ${description.project}`}
    </p>
    {description?.title === undefined ? null : (
      <p className="mt-0.5 font-bold text-base leading-snug">
        {description.title}
      </p>
    )}
    {description === undefined ? null : (
      <p className="mt-1 font-semibold">
        <span
          aria-hidden="true"
          className="field-key"
          data-v={keyCodes[description.key]}
        />{' '}
        {description.verdict}
      </p>
    )}
    {description?.reason === undefined ? null : (
      <p className="text-muted-foreground">{description.reason}</p>
    )}
    {description?.linesChanged === undefined ? null : (
      <p className="text-muted-foreground">
        {description.linesChanged.toLocaleString('en-US')} lines changed
      </p>
    )}
    {pinned ? (
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          aria-label="Previous change"
          onClick={() => onStep(-1)}
          className={stepClassName}
        >
          <span aria-hidden="true">←</span>
        </button>
        <button
          type="button"
          aria-label="Next change"
          onClick={() => onStep(1)}
          className={stepClassName}
        >
          <span aria-hidden="true">→</span>
        </button>
        {description?.href === undefined ? null : (
          <a
            href={description.href}
            target="_blank"
            rel="noopener noreferrer"
            data-umami-event="change-open"
            className="inline-flex h-11 items-center px-2 font-semibold underline decoration-2 underline-offset-4 hover:decoration-4"
          >
            Open on GitHub
          </a>
        )}
        <button
          type="button"
          onClick={onClose}
          className="ml-auto inline-flex h-11 items-center px-2 font-semibold underline decoration-2 underline-offset-4 hover:decoration-4"
        >
          Close
        </button>
      </div>
    ) : null}
  </>
);
