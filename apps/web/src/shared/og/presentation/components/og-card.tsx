import type { ReactNode } from 'react';
import { themeAnchorColors } from '@/shared/ui/services/theme-anchor-colors';

/**
 * Shared warm-print card for Open Graph images: paper ground, one hairline
 * frame, eyebrow + serif display + mono footer. Rendered by satori, which
 * requires inline styles and explicit flex displays.
 */
const longTitleLength = 40;
const longTitleFontSize = 64;
const titleFontSize = 88;

export const OgCard = ({
  eyebrow,
  title,
  italicPhrase,
  footerLeft,
  footerRight,
}: Readonly<{
  eyebrow: string;
  title: string;
  italicPhrase?: string;
  footerLeft: string;
  footerRight: string;
}>): ReactNode => (
  <div
    style={{
      display: 'flex',
      width: '100%',
      height: '100%',
      backgroundColor: themeAnchorColors.paper100,
      padding: 40,
    }}
  >
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        flex: 1,
        border: `1px solid ${themeAnchorColors.line300}`,
        padding: 64,
      }}
    >
      <div
        style={{
          display: 'flex',
          fontFamily: 'IBM Plex Sans',
          fontSize: 24,
          fontWeight: 500,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: themeAnchorColors.green700,
        }}
      >
        {eyebrow}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div
          style={{
            display: 'flex',
            fontFamily: 'Source Serif 4',
            fontSize:
              title.length > longTitleLength
                ? longTitleFontSize
                : titleFontSize,
            fontWeight: 600,
            lineHeight: 1.1,
            color: themeAnchorColors.ink900,
          }}
        >
          {title}
        </div>
        {italicPhrase === undefined ? null : (
          <div
            style={{
              display: 'flex',
              fontFamily: 'Source Serif 4',
              fontSize: 36,
              fontStyle: 'italic',
              color: themeAnchorColors.clay600,
            }}
          >
            {italicPhrase}
          </div>
        )}
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: `1px solid ${themeAnchorColors.line300}`,
          paddingTop: 32,
          fontFamily: 'IBM Plex Mono',
          fontSize: 24,
          color: themeAnchorColors.ink600,
        }}
      >
        <div style={{ display: 'flex' }}>{footerLeft}</div>
        <div style={{ display: 'flex' }}>{footerRight}</div>
      </div>
    </div>
  </div>
);
