import type { ThemeRegistrationAny } from 'shiki';
import { themeAnchorColors } from '@/shared/ui/services/theme-anchor-colors';

/**
 * A syntax theme in ink alone. Weight and slant carry the structure that
 * other themes give to color: keywords are bold, comments are italic, and
 * strings and punctuation step back to the softer ink.
 */
export const inkCodeTheme: ThemeRegistrationAny = {
  name: 'ink',
  type: 'light',
  colors: {
    'editor.background': themeAnchorColors.paper200,
    'editor.foreground': themeAnchorColors.ink900,
  },
  settings: [
    {
      settings: {
        background: themeAnchorColors.paper200,
        foreground: themeAnchorColors.ink900,
      },
    },
    {
      scope: ['comment', 'punctuation.definition.comment'],
      settings: { foreground: themeAnchorColors.ink600, fontStyle: 'italic' },
    },
    {
      scope: ['string', 'punctuation.definition.string', 'string.template'],
      settings: { foreground: themeAnchorColors.ink600 },
    },
    {
      scope: [
        'keyword',
        'keyword.control',
        'storage.type',
        'storage.modifier',
        'entity.name.tag',
      ],
      settings: { foreground: themeAnchorColors.ink900, fontStyle: 'bold' },
    },
    {
      scope: ['keyword.operator', 'punctuation', 'meta.brace'],
      settings: { foreground: themeAnchorColors.ink600, fontStyle: '' },
    },
    {
      scope: ['markup.italic'],
      settings: { fontStyle: 'italic' },
    },
    {
      scope: ['markup.bold'],
      settings: { fontStyle: 'bold' },
    },
  ],
};
