<!-- Seeded from warm-print. -->

# Design

This site is a thoughtfully set periodical that happens to live on a screen: warm paper, deep warm ink, one forest-green voice. Structure comes from typography, hairline rules, and alignment — never from boxes, elevation, or decoration. It is hospitable, not austere: the page is furnished with type, rhythm, and warmth rather than emptied. Every design value comes from `packages/ui/src/theme.css`; this document says what the values mean and how to compose them.

## Surfaces and ink

- The page is one continuous sheet of `background` paper. Do not tint section bands, do not stack translucent layers, do not blur what is behind chrome.
- On paper, write with `foreground` for primary text, `muted-foreground` for secondary text, and `primary` for the voice: links, actions, active states. Deepen the voice to `primary-strong` on press or hover, never lighten it.
- `welcome` is the single warm accent, reserved for moments of welcome — a greeting phrase, one highlighted word. At most one moment per page; it never becomes structural UI, grounds, or borders.
- A raised ground exists only where an action stands on the voice color: `primary` ground carries `primary-foreground` ink exclusively.
- `secondary` and `muted` grounds are recessed paper for quiet strips (code, figures); they carry `foreground` or `muted-foreground` ink.
- The paper carries a faint film grain, felt rather than seen. It is material, not decoration; nothing else textures the page.

## The deep register

- One inverse passage per page may turn the page dark for gravity: ground `deep`, ink `deep-foreground`, secondary ink `deep-muted-foreground`, rules `deep-border`, voice `deep-primary`. The closing invitation (contact) is the deep register on the home page.
- The deep register is part of light mode, not a dark mode. Entering it must feel like turning a page: same rules, same type, same flatness.
- There is no second mode. The site is light-only.

## Shape and depth

- Corners are square everywhere — buttons, inputs, images, tags, code blocks. Perfect circles are the only exception: elements whose width equals height (status dots, spinners, radio marks, avatars) may be fully round. Full rounding on anything wider than tall is a pill, and pills do not exist here.
- Hairline rules in `border` (or `deep-border` in the deep register) do all the work cards and shadows do elsewhere. Where a surface must be bounded, its border is one hairline; it gets no fill change and no shadow.
- Shadows exist only under the one thing that genuinely floats (a popover, if one ever exists), using the single float shadow. Fixed chrome such as the header is opaque paper with a hairline rule, not glass and not floating.

## Typography

- Display is the serif: headlines, the wordmark, and one italicized serif phrase per screen that carries the warmth — a subtitle, a reverent aside. Italics mark emphasis and reverence, never volume. One display-size setting per section.
- Body and UI text are the sans, quiet and competent.
- The mono face sets figures and apparatus: index numerals, dates, tags, code, the build credit. Numbers that must align are tabular.
- Eyebrows are uppercase, letterspaced, small, and label sections; an eyebrow, a serif headline, and at most one supporting line form the standard section head.

## Pattern vocabulary

- **Eyebrow** — the uppercase letterspaced section label, in `muted-foreground` or `primary`.
- **Index numeral** — a large mono ordinal that counts a real sequence (selected works, archive entries). Use only where order is true information.
- **Tag** — a square, hairline-bordered mono label for tech and categories. Tags sit alone or in a single quiet row; never stack tags, eyebrows, and other labels in one row.
- **Hairline entry** — the list idiom: entries separated by hairline rules, no boxes. Works, posts, and archive items are hairline entries.
- **Printed photograph** — images print flat: square, bounded by a hairline rule, on the paper itself. No gradient backdrops, no floating. The hero portrait alone carries a second offset hairline frame in a quiet tint of the voice — the site's single decorative flourish; no other image repeats it.
- **Pull quote** — long-form quotes are set in serif against a hairline rule, not inside a box.

## Layout

- Two named spans: the **sheet** (wide span for landing sections) and the **column** (the reading measure for posts and case studies). Every section aligns to one of them; nothing bleeds arbitrarily.
- Rhythm comes from consistent vertical intervals between sections, marked where helpful by a hairline rule, never by alternating tinted bands.

## Motion

- Sections enter with a short fade-and-rise, once per viewport pass. Nothing loops forever.
- Hovers prefer geometry over color: a rule extends, a chevron nudges, an underline draws. Color may deepen; it does not flash.
- One easing curve everywhere — the token in the theme and its exported constant for script-driven motion. All motion collapses under reduced-motion preferences.

## Voice

- Copy is warm editorial: hospitable, literary, precise. Write to a reader, not a market.
- Sentence case for headings, labels, and UI copy. No print-production jargon (folio, masthead, deck, slug) in copy or code vocabulary.
