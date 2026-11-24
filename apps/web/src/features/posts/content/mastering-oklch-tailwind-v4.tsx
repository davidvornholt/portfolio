import { ColorSwatchComparison } from '@/shared/content/presentation/components/color-swatch-comparison';
import type { Post } from './post-meta';

export const masteringOklchPost: Post = {
  meta: {
    title: 'Choosing colors I can adjust by eye',
    slug: 'mastering-oklch-tailwind-v4',
    date: '2026-03-01',
    category: 'Engineering',
    readTime: '2 min read',
    excerpt:
      'Yellow and blue can share an HSL lightness value and look nothing alike. I put the two color models side by side.',
  },
  body: () => (
    <div className="essay">
      <p>
        When I chose colors for the school website, I wanted to be able to
        darken a link without also changing what color it looked. HSL seemed to
        give me a dial for that. Then I put yellow and blue next to each other
        at 50 percent lightness.
      </p>
      <ColorSwatchComparison />
      <h2>Three separate adjustments</h2>
      <p>
        In OKLCH, I use L to adjust perceived lightness, C to adjust color
        intensity, and H to choose a hue. Holding lightness steady gives me a
        more consistent starting point as I move between hues. I still measure
        the contrast of the actual text and background together.
      </p>
      <h2>Where the decision lives</h2>
      <p>
        I give the palette values names once. A component asks for the primary
        link color or the page background. When I change the green I can see the
        effect across links, charts, and buttons together. If only one button
        needs a different state, I can see that decision in its component.
      </p>
      <a href="https://github.com/davidvornholt/portfolio/blob/main/packages/ui/src/theme.css">
        Read the palette used on this page ↗
      </a>
    </div>
  ),
};
