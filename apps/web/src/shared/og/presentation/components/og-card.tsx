import { themeAnchorColors } from '@portfolio/ui/theme-anchor-colors';
import type { ReactNode } from 'react';

/**
 * The card for Open Graph images: the title on paper, standing on the bar,
 * with a short row of squares beside it. Rendered by satori, which requires
 * inline styles and explicit flex displays.
 */
const longTitleLength = 40;
const longTitleFontSize = 60;
const titleFontSize = 84;
const squareSize = 16;
const squareGap = 4;

// The chart in the small: how many squares stand in each week's column.
const Skyline = ({
  columns,
}: {
  readonly columns: ReadonlyArray<number>;
}): ReactNode => (
  <div style={{ display: 'flex', alignItems: 'flex-end', gap: squareGap }}>
    {columns.map((height, column) => (
      <div
        // biome-ignore lint/suspicious/noArrayIndexKey: a column is a week, identified by its place and by nothing else.
        key={column}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: squareGap,
          width: squareSize,
        }}
      >
        {Array.from({ length: height }, (_, row) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: the squares of a column are identical and never reorder.
            key={row}
            style={{
              width: squareSize,
              height: squareSize,
              backgroundColor: themeAnchorColors.ink900,
            }}
          />
        ))}
      </div>
    ))}
  </div>
);

export const OgCard = ({
  title,
  subtitle,
  footerLeft,
  footerRight,
  skyline,
}: Readonly<{
  title: string;
  subtitle?: string;
  footerLeft: string;
  footerRight: string;
  /** The squares in each column of the chart beside the title, oldest first. */
  skyline: ReadonlyArray<number>;
}>): ReactNode => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      width: '100%',
      height: '100%',
      backgroundColor: themeAnchorColors.paper100,
      fontFamily: 'Sofia Sans',
    }}
  >
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        padding: '72px 72px 0',
      }}
    >
      <div
        style={{
          display: 'flex',
          fontSize:
            title.length > longTitleLength ? longTitleFontSize : titleFontSize,
          fontWeight: 700,
          lineHeight: 1.05,
          letterSpacing: '-0.02em',
          color: themeAnchorColors.ink900,
        }}
      >
        {title}
      </div>
      {subtitle === undefined ? null : (
        <div
          style={{
            display: 'flex',
            fontSize: 34,
            fontWeight: 400,
            lineHeight: 1.3,
            color: themeAnchorColors.ink600,
          }}
        >
          {subtitle}
        </div>
      )}
    </div>

    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          padding: `0 72px ${squareGap}px`,
        }}
      >
        <Skyline columns={skyline} />
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '28px 72px',
          backgroundColor: themeAnchorColors.ink900,
          color: themeAnchorColors.paper100,
          fontSize: 28,
          fontWeight: 700,
        }}
      >
        <div style={{ display: 'flex' }}>{footerLeft}</div>
        <div
          style={{
            display: 'flex',
            fontWeight: 400,
            color: themeAnchorColors.ink200,
          }}
        >
          {footerRight}
        </div>
      </div>
    </div>
  </div>
);
