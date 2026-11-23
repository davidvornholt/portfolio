'use client';

import { type ReactNode, useState } from 'react';
import { ChartBarFill } from './chart-bar-fill';

// =============================================================================
// Types
// =============================================================================

type Swatch = Readonly<{
  label: string;
  colorClassName: string;
  lightness: string;
  perceivedNote: string;
}>;

// =============================================================================
// Data
// =============================================================================

const hslSwatches: ReadonlyArray<Swatch> = [
  {
    label: 'Yellow',
    colorClassName: 'bg-comparison-hsl-yellow',
    lightness: '50%',
    perceivedNote: 'Appears almost white',
  },
  {
    label: 'Green',
    colorClassName: 'bg-comparison-hsl-green',
    lightness: '50%',
    perceivedNote: 'Bright, dominant',
  },
  {
    label: 'Red',
    colorClassName: 'bg-comparison-hsl-red',
    lightness: '50%',
    perceivedNote: 'Medium brightness',
  },
  {
    label: 'Cyan',
    colorClassName: 'bg-comparison-hsl-cyan',
    lightness: '50%',
    perceivedNote: 'Relatively bright',
  },
  {
    label: 'Blue',
    colorClassName: 'bg-comparison-hsl-blue',
    lightness: '50%',
    perceivedNote: 'Appears nearly black',
  },
];

const oklchSwatches: ReadonlyArray<Swatch> = [
  {
    label: 'Yellow',
    colorClassName: 'bg-comparison-oklch-yellow',
    lightness: '0.6',
    perceivedNote: 'Uniform brightness',
  },
  {
    label: 'Green',
    colorClassName: 'bg-comparison-oklch-green',
    lightness: '0.6',
    perceivedNote: 'Uniform brightness',
  },
  {
    label: 'Red',
    colorClassName: 'bg-comparison-oklch-red',
    lightness: '0.6',
    perceivedNote: 'Uniform brightness',
  },
  {
    label: 'Cyan',
    colorClassName: 'bg-comparison-oklch-cyan',
    lightness: '0.6',
    perceivedNote: 'Uniform brightness',
  },
  {
    label: 'Blue',
    colorClassName: 'bg-comparison-oklch-blue',
    lightness: '0.6',
    perceivedNote: 'Uniform brightness',
  },
];

const fallbackBrightnessPercent = 50;

// =============================================================================
// Sub-components
// =============================================================================

type SwatchCardProps = Readonly<{
  swatch: Swatch;
  isActive: boolean;
}>;

const SwatchCard = ({ swatch, isActive }: SwatchCardProps): ReactNode => (
  <div className="flex flex-col items-center gap-2">
    <div
      className={`relative h-16 w-full border border-border sm:h-20 ${swatch.colorClassName}`}
      data-slot="color-swatch"
    />
    <div className="flex flex-col items-center gap-0.5 text-center">
      <span className="font-semibold text-sm">{swatch.label}</span>
      <span className="font-mono text-muted-foreground text-xs">
        L: {swatch.lightness}
      </span>
    </div>
    {isActive ? (
      <div className="wrap-anywhere max-w-full px-0 py-1 text-center sm:px-2">
        <span className="text-muted-foreground text-xs leading-tight">
          {swatch.perceivedNote}
        </span>
      </div>
    ) : null}
  </div>
);

type SwatchRowProps = Readonly<{
  title: string;
  tag: string;
  tagVariant: 'broken' | 'correct';
  swatches: ReadonlyArray<Swatch>;
  isActive: boolean;
  description: string;
}>;

const SwatchRow = ({
  title,
  tag,
  tagVariant,
  swatches,
  isActive,
  description,
}: SwatchRowProps): ReactNode => (
  <div className="space-y-4">
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <h4 className="font-bold">{title}</h4>
        <span
          className={`font-semibold text-sm ${
            tagVariant === 'broken' ? 'text-failed' : 'text-foreground'
          }`}
        >
          {tag}
        </span>
      </div>
      <p className="hidden text-muted-foreground text-sm sm:block">
        {description}
      </p>
    </div>
    <div className="grid grid-cols-5 gap-3">
      {swatches.map((swatch) => (
        <SwatchCard key={swatch.label} swatch={swatch} isActive={isActive} />
      ))}
    </div>
  </div>
);

// =============================================================================
// Perceived Brightness Bar
// =============================================================================

type BrightnessBarProps = Readonly<{
  swatches: ReadonlyArray<Swatch>;
  label: string;
}>;

/** Maps swatch colors to approximate perceived brightness (0–100). */
const hslPerceivedBrightness: Record<string, number> = {
  Yellow: 95,
  Green: 72,
  Red: 53,
  Cyan: 79,
  Blue: 28,
};

const oklchPerceivedBrightness: Record<string, number> = {
  Yellow: 60,
  Green: 60,
  Red: 60,
  Cyan: 60,
  Blue: 60,
};

const BrightnessBar = ({ swatches, label }: BrightnessBarProps): ReactNode => {
  const brightnessMap =
    label === 'HSL' ? hslPerceivedBrightness : oklchPerceivedBrightness;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground text-sm">
          {label}: perceived brightness
        </span>
      </div>
      <div className="grid grid-cols-5 gap-3">
        {swatches.map((swatch) => {
          const brightness =
            brightnessMap[swatch.label] ?? fallbackBrightnessPercent;
          return (
            <div key={swatch.label} className="space-y-1">
              <div className="h-1.5 w-full overflow-hidden bg-muted">
                <ChartBarFill
                  percentage={brightness}
                  className={label === 'HSL' ? 'text-failed' : 'text-foreground'}
                />
              </div>
              <span className="block text-center font-mono text-muted-foreground text-xs">
                {brightness}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// =============================================================================
// Main Component
// =============================================================================

export const ColorSwatchComparison = (): ReactNode => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="my-10 border border-border">
      {/* Header */}
      <div className="flex items-center justify-between border-border border-b px-5 py-3">
        <span className="text-muted-foreground text-sm">
          Interactive comparison
        </span>
        <button
          type="button"
          onClick={() => setShowDetails((prev) => !prev)}
          className="font-semibold text-sm underline decoration-2 underline-offset-4 hover:decoration-4"
        >
          {showDetails ? 'Hide notes' : 'Show notes'}
        </button>
      </div>

      {/* Content */}
      <div className="space-y-8 p-5 sm:p-6">
        {/* HSL Row */}
        <SwatchRow
          title="HSL at 50% lightness"
          tag="Non-uniform"
          tagVariant="broken"
          swatches={hslSwatches}
          isActive={showDetails}
          description="Same mathematical lightness, wildly different perceived brightness"
        />

        {/* Brightness comparison */}
        <BrightnessBar swatches={hslSwatches} label="HSL" />

        <hr className="border-border" />

        {/* OKLCH Row */}
        <SwatchRow
          title="OKLCH at 0.6 lightness"
          tag="Perceptually uniform"
          tagVariant="correct"
          swatches={oklchSwatches}
          isActive={showDetails}
          description="Same perceptual lightness, identical perceived brightness"
        />

        {/* Brightness comparison */}
        <BrightnessBar swatches={oklchSwatches} label="OKLCH" />
      </div>

      {/* Footer insight */}
      <div className="border-border border-t px-5 py-3">
        <p className="text-center text-muted-foreground text-sm">
          HSL blue at 50% lightness appears{' '}
          <strong className="text-foreground">3.4×</strong> darker than HSL
          yellow at 50% lightness. In OKLCH, all five colors share identical
          perceived brightness.
        </p>
      </div>
    </div>
  );
};
