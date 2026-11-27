import type { ReactNode } from 'react';
import { ChartBarFill } from '@/shared/content/presentation/components/chart-bar-fill';

// What the two changes of the last round cost in each setup, in US dollars,
// at the list prices of September 5, 2026. The sums and the token counts
// behind them are in public/posts/cheap-ai-code-reviews/evidence.md. The
// mixed setup is a minimum: some of its runs recorded no usage.
const setups = [
  { name: 'Luna for everything', cost: 2.749_357_48, atLeast: false },
  { name: 'Spark for everything', cost: 5.747_064_5, atLeast: false },
  { name: 'Astra for everything', cost: 44.700_576, atLeast: false },
  { name: 'Astra leads, Luna works', cost: 48.465_691_96, atLeast: true },
] as const;

const scaleEnd = 50;
const percent = 100;

const price = (cost: number, atLeast: boolean): string =>
  `${atLeast ? 'at least ' : ''}$${cost.toFixed(2)}`;

/** The estimated cost of each setup as a bar, all on one scale from zero. */
export const ReviewCostChart = (): ReactNode => (
  <ul className="grid gap-5">
    {setups.map((setup) => (
      <li key={setup.name}>
        <p className="flex items-baseline justify-between gap-4">
          <span>{setup.name}</span>
          <span className="shrink-0 font-bold tabular-nums">
            {price(setup.cost, setup.atLeast)}
          </span>
        </p>
        <div className="mt-2 h-4 bg-muted">
          <ChartBarFill
            percentage={(setup.cost / scaleEnd) * percent}
            className="text-foreground"
          />
        </div>
      </li>
    ))}
  </ul>
);
