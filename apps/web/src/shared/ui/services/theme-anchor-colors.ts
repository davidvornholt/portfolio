/**
 * Raw hex mirrors of the theme anchors in `packages/ui/src/theme.css`, for
 * contexts that cannot resolve CSS variables (Open Graph image generation,
 * the Shiki syntax theme, browser theme-color). Values are the sRGB
 * conversion of the canonical oklch tokens; when a token changes there,
 * update its mirror here.
 */
export const themeAnchorColors = {
  paper100: '#fafafa',
  paper200: '#f0f0f1',
  line300: '#d0d1d2',
  ink900: '#0f0f11',
  ink600: '#4f5053',
  ink400: '#858689',
  ink200: '#aaabad',
  red600: '#dd141e',
} as const;
