'use client';

import { div as MotionDiv } from 'motion/react-client';
import { type ReactNode, useState } from 'react';

// =============================================================================
// Types
// =============================================================================

type Swatch = Readonly<{
  label: string;
  color: string;
  lightness: string;
  perceivedNote: string;
}>;

// =============================================================================
// Data
// =============================================================================

const hslSwatches: readonly Swatch[] = [
  {
    label: 'Yellow',
    color: 'hsl(60, 100%, 50%)',
    lightness: '50%',
    perceivedNote: 'Appears almost white',
  },
  {
    label: 'Green',
    color: 'hsl(120, 100%, 50%)',
    lightness: '50%',
    perceivedNote: 'Bright, dominant',
  },
  {
    label: 'Red',
    color: 'hsl(0, 100%, 50%)',
    lightness: '50%',
    perceivedNote: 'Medium brightness',
  },
  {
    label: 'Cyan',
    color: 'hsl(180, 100%, 50%)',
    lightness: '50%',
    perceivedNote: 'Relatively bright',
  },
  {
    label: 'Blue',
    color: 'hsl(240, 100%, 50%)',
    lightness: '50%',
    perceivedNote: 'Appears nearly black',
  },
];

const oklchSwatches: readonly Swatch[] = [
  {
    label: 'Yellow',
    color: 'oklch(0.6 0.15 100)',
    lightness: '0.6',
    perceivedNote: 'Uniform brightness',
  },
  {
    label: 'Green',
    color: 'oklch(0.6 0.15 145)',
    lightness: '0.6',
    perceivedNote: 'Uniform brightness',
  },
  {
    label: 'Red',
    color: 'oklch(0.6 0.15 25)',
    lightness: '0.6',
    perceivedNote: 'Uniform brightness',
  },
  {
    label: 'Cyan',
    color: 'oklch(0.6 0.15 195)',
    lightness: '0.6',
    perceivedNote: 'Uniform brightness',
  },
  {
    label: 'Blue',
    color: 'oklch(0.6 0.15 265)',
    lightness: '0.6',
    perceivedNote: 'Uniform brightness',
  },
];

// =============================================================================
// Animation
// =============================================================================

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
};

// =============================================================================
// Sub-components
// =============================================================================

type SwatchCardProps = Readonly<{
  swatch: Swatch;
  index: number;
  isActive: boolean;
}>;

const SwatchCard = ({
  swatch,
  index,
  isActive,
}: SwatchCardProps): ReactNode => (
  <MotionDiv
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4, delay: index * 0.06 }}
    className="group flex flex-col items-center gap-2"
  >
    <div
      className="relative h-16 w-full overflow-hidden rounded-lg border border-border shadow-sm transition-all duration-300 sm:h-20"
      style={{ backgroundColor: swatch.color }}
    >
      {/* Shimmer effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </div>
    <div className="flex flex-col items-center gap-0.5 text-center">
      <span className="text-xs font-medium text-foreground">
        {swatch.label}
      </span>
      <span className="font-mono text-[10px] text-muted-foreground">
        L: {swatch.lightness}
      </span>
    </div>
    {isActive && (
      <MotionDiv
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        className="rounded bg-card px-2 py-1 text-center"
      >
        <span className="text-[10px] leading-tight text-muted-foreground">
          {swatch.perceivedNote}
        </span>
      </MotionDiv>
    )}
  </MotionDiv>
);

type SwatchRowProps = Readonly<{
  title: string;
  tag: string;
  tagVariant: 'broken' | 'correct';
  swatches: readonly Swatch[];
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
        <h4 className="text-sm font-semibold text-foreground">{title}</h4>
        <span
          className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${
            tagVariant === 'broken'
              ? 'bg-destructive/10 text-destructive'
              : 'bg-primary/10 text-primary'
          }`}
        >
          {tag}
        </span>
      </div>
      <p className="hidden text-xs text-muted-foreground sm:block">
        {description}
      </p>
    </div>
    <div className="grid grid-cols-5 gap-3">
      {swatches.map((swatch, index) => (
        <SwatchCard
          key={swatch.label}
          swatch={swatch}
          index={index}
          isActive={isActive}
        />
      ))}
    </div>
  </div>
);

// =============================================================================
// Perceived Brightness Bar
// =============================================================================

type BrightnessBarProps = Readonly<{
  swatches: readonly Swatch[];
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
        <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          {label} — Perceived Brightness
        </span>
      </div>
      <div className="grid grid-cols-5 gap-3">
        {swatches.map((swatch) => {
          const brightness = brightnessMap[swatch.label] ?? 50;
          return (
            <div key={swatch.label} className="space-y-1">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <MotionDiv
                  initial={{ width: 0 }}
                  whileInView={{ width: `${brightness}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className={`h-full rounded-full ${
                    label === 'HSL' ? 'bg-destructive/60' : 'bg-primary'
                  }`}
                />
              </div>
              <span className="block text-center font-mono text-[10px] text-muted-foreground">
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
    <MotionDiv
      {...fadeInUp}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="my-10 overflow-hidden rounded-xl border border-border bg-card"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-primary" />
          <span className="text-xs font-medium text-muted-foreground">
            Interactive Comparison
          </span>
        </div>
        <button
          type="button"
          onClick={() => setShowDetails((prev) => !prev)}
          className="rounded-md px-2.5 py-1 text-[11px] font-medium text-primary transition-colors hover:bg-primary/5"
        >
          {showDetails ? 'Hide Notes' : 'Show Notes'}
        </button>
      </div>

      {/* Content */}
      <div className="space-y-8 p-5 sm:p-6">
        {/* HSL Row */}
        <SwatchRow
          title="HSL — 50% Lightness"
          tag="Non-uniform"
          tagVariant="broken"
          swatches={hslSwatches}
          isActive={showDetails}
          description="Same mathematical lightness, wildly different perceived brightness"
        />

        {/* Brightness comparison */}
        <BrightnessBar swatches={hslSwatches} label="HSL" />

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-dashed border-border" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-card px-3 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
              vs
            </span>
          </div>
        </div>

        {/* OKLCH Row */}
        <SwatchRow
          title="OKLCH — 0.6 Lightness"
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
      <div className="border-t border-border bg-muted/30 px-5 py-3">
        <p className="text-center text-[11px] text-muted-foreground">
          HSL blue at 50% lightness appears{' '}
          <strong className="text-foreground">3.4×</strong> darker than HSL
          yellow at 50% lightness. In OKLCH, all five colors share identical
          perceived brightness.
        </p>
      </div>
    </MotionDiv>
  );
};
