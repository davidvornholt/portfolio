'use client';

import { type ReactNode, useState } from 'react';
import './field-legend.css';

/** The four marks of the chart: passed, failed, unchecked, and caught in the bar. */
export type LegendMark = 'p' | 'f' | 'u' | 'c';

export type LegendKey = Readonly<{
  mark: LegendMark;
  /** The mark, its count and the words that say what it stands for. */
  content: ReactNode;
}>;

/**
 * The key under the chart. Pointing at an entry, or focusing it, leaves only
 * its marks at full strength in the chart, and pressing it holds that until
 * it is pressed again. The stylesheet does the dimming: it reads `data-legend`
 * and `aria-pressed` from here.
 */
export const LegendKeys = ({
  keys,
}: {
  readonly keys: ReadonlyArray<LegendKey>;
}): ReactNode => {
  const [held, setHeld] = useState<LegendMark>();
  return (
    <ul className="mt-1.5 flex flex-wrap gap-x-5 gap-y-1 text-sm">
      {keys.map((key) => (
        <li key={key.mark}>
          <button
            type="button"
            data-legend={key.mark}
            aria-pressed={held === key.mark}
            onClick={() =>
              setHeld((current) =>
                current === key.mark ? undefined : key.mark,
              )
            }
            className="field-legend-key cursor-pointer whitespace-nowrap"
          >
            {key.content}
          </button>
        </li>
      ))}
    </ul>
  );
};
