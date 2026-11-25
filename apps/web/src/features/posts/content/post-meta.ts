import type { StaticImageData } from 'next/image';
import type { ReactNode } from 'react';

export type PostMeta = Readonly<{
  title: string;
  subtitle?: string;
  slug: string;
  date: string;
  category: string;
  readTime: string;
  excerpt: string;
  /**
   * A black-and-white picture of one object that stands for what the article
   * found, such as a sieve for reviews that let bugs through. It is shown
   * multiplied with the page, so its background has to be pure white.
   *
   * How the existing ones were made, so that a new one matches them. An image
   * model drew the object from a sentence describing it, followed by: "Black-
   * and-white studio product photograph, flat lay seen from directly above,
   * the object lying on a seamless pure white surface. One hard light from the
   * upper left, so the object casts one short, crisp, dark shadow to the lower
   * right. Very high contrast with deep blacks and clean whites, fine film
   * grain, everything in sharp focus. The object sits in the middle with
   * generous empty pure white space on all sides and nothing else in the
   * frame. No people, no hands, no text, no letters, no numbers, no logos, no
   * props. Strictly monochrome." The result was turned to greyscale, its
   * levels stretched from 1% to 97.5% so that the background became pure
   * white, cut to the object and its shadow, and saved as a JPEG.
   */
  picture: Readonly<{ src: StaticImageData; alt: string }>;
}>;

export type Post = Readonly<{
  meta: PostMeta;
  body: () => ReactNode;
}>;
