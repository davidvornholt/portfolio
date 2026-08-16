import type { ThemeRegistrationAny } from 'shiki';
import { themeAnchorColors } from '@/shared/ui/services/theme-anchor-colors';

/**
 * Warm-print syntax theme: restrained warm inks on paper. Voice green
 * carries structure (keywords, tags, types), clay marks literals, and
 * comments recede into muted ink.
 */
export const warmPrintCodeTheme: ThemeRegistrationAny = {
  name: 'warm-print',
  type: 'light',
  colors: {
    'editor.background': themeAnchorColors.paper100,
    'editor.foreground': themeAnchorColors.ink900,
  },
  settings: [
    {
      settings: {
        background: themeAnchorColors.paper100,
        foreground: themeAnchorColors.ink900,
      },
    },
    {
      scope: ['comment', 'punctuation.definition.comment'],
      settings: { foreground: themeAnchorColors.ink600, fontStyle: 'italic' },
    },
    {
      scope: ['string', 'punctuation.definition.string', 'string.template'],
      settings: { foreground: themeAnchorColors.green700 },
    },
    {
      scope: ['keyword', 'keyword.control', 'storage.type', 'storage.modifier'],
      settings: { foreground: themeAnchorColors.green800 },
    },
    {
      scope: [
        'constant',
        'constant.numeric',
        'constant.language',
        'variable.other.constant',
        'support.constant',
      ],
      settings: { foreground: themeAnchorColors.clay700 },
    },
    {
      scope: ['entity.name.function', 'support.function', 'meta.function-call'],
      settings: { foreground: themeAnchorColors.ink900 },
    },
    {
      scope: [
        'entity.name.type',
        'entity.name.class',
        'support.type',
        'support.class',
        'entity.other.inherited-class',
      ],
      settings: { foreground: themeAnchorColors.green700 },
    },
    {
      scope: ['variable', 'variable.parameter', 'variable.other'],
      settings: { foreground: themeAnchorColors.ink900 },
    },
    {
      scope: ['keyword.operator', 'punctuation', 'meta.brace'],
      settings: { foreground: themeAnchorColors.ink600 },
    },
    {
      scope: ['entity.name.tag'],
      settings: { foreground: themeAnchorColors.green800 },
    },
    {
      scope: ['entity.other.attribute-name'],
      settings: { foreground: themeAnchorColors.clay700 },
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
