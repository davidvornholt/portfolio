import type { ReactNode } from 'react';
import { contrast, oklchLightness, toHex, white } from '../../services/color';
import { type Model, ratio, siteContrasts, swatchesOf } from './lightness-data';

/**
 * Five hues at one lightness of a color model. Under each: how light OKLCH
 * says the color is, and its contrast against white.
 */
export const LightnessRow = ({
  model,
}: {
  readonly model: Model;
}): ReactNode => (
  <ul className="grid grid-cols-5 gap-2 sm:gap-4">
    {swatchesOf(model).map((swatch) => (
      <li key={swatch.name}>
        <svg
          aria-hidden="true"
          viewBox="0 0 1 1"
          preserveAspectRatio="none"
          className="block h-16 w-full border border-border sm:h-24"
        >
          <rect
            data-slot="color-swatch"
            width="1"
            height="1"
            fill={toHex(swatch.color)}
          />
        </svg>
        <p className="mt-2 font-bold">{swatch.name}</p>
        <p className="text-muted-foreground text-sm tabular-nums">
          L {oklchLightness(swatch.color).toFixed(2)}
        </p>
        <p className="font-semibold tabular-nums">
          {ratio(contrast(swatch.color, white))}
        </p>
      </li>
    ))}
  </ul>
);

/** What the site's own colors measure against the ground they stand on. */
export const SiteContrasts = (): ReactNode => (
  <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
    {siteContrasts.map((pair) => (
      <div key={pair.name} className="flex flex-col-reverse justify-end">
        <dt className="text-muted-foreground">{pair.name}</dt>
        <dd className="font-bold text-3xl tabular-nums tracking-tight">
          {ratio(pair.value, 1)}
        </dd>
      </div>
    ))}
  </dl>
);
