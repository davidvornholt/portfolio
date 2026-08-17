/**
 * Raw hex mirrors of the theme anchors in `packages/ui/src/theme.css`, for
 * contexts that cannot resolve CSS variables (Open Graph image generation,
 * the Shiki syntax theme, browser theme-color). Values are the sRGB
 * conversion of the canonical oklch tokens; when a token changes there,
 * update its mirror here.
 */
export const themeAnchorColors = {
  paper100: '#f8f3ea',
  paper200: '#f0eadf',
  line300: '#d5cdc0',
  ink900: '#281e17',
  ink600: '#60564e',
  green700: '#245333',
  green800: '#164225',
  clay600: '#a55a37',
  deepGround900: '#251c16',
  deepInk100: '#f0ebe1',
  deepGreen300: '#7cb88c',
} as const;
