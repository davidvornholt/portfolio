// biome-ignore lint/correctness/noUnresolvedImports: React 19.3 exports ViewTransition, and the TypeScript compiler resolves it. Biome 2.5 does not see a constant that the types declare with `export const` inside their namespace.
import { type ReactNode, ViewTransition } from 'react';
import './page-transitions.css';

/**
 * Wraps what a page shows, so that the page fades out when the visitor
 * leaves it and fades in when they arrive. It belongs in every `page.tsx`
 * and not in the layout, because a layout stays mounted from page to page
 * and so never leaves or arrives.
 */
export const PageTransition = ({
  children,
}: {
  readonly children: ReactNode;
}): ReactNode => (
  <ViewTransition enter="page-arrives" exit="page-leaves" default="none">
    {/* The browser pictures this element on its own while it fades. Without
        a background of its own, a picture inside that is multiplied with
        the page would have nothing to multiply with and show its white. */}
    <div className="bg-background">{children}</div>
  </ViewTransition>
);

/**
 * Marks a picture that two pages show: the small one beside a link and the
 * large one on the page the link opens. Both carry the same name, so the
 * browser moves one picture from its old place to its new one instead of
 * swapping two. `kind` and `slug` together have to be unique on a page.
 */
export const TravellingPicture = ({
  kind,
  slug,
  children,
}: Readonly<{
  /** An article's object lies on the page, a work's screenshot is a framed picture. */
  kind: 'post' | 'work';
  slug: string;
  children: ReactNode;
}>): ReactNode => (
  <ViewTransition
    name={`${kind}-picture-${slug}`}
    share={kind === 'post' ? 'object-travels' : 'picture-travels'}
    default="none"
  >
    {children}
  </ViewTransition>
);
