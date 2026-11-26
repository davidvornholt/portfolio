import type { StaticImageData } from 'next/image';
import Image from 'next/image';
import type { ReactNode } from 'react';

/**
 * A picture the visitor has usually just seen smaller, on the page they came
 * from. It shows that smaller file at once, because the browser still holds
 * it, and lays the sharper one over it as soon as that has loaded. Without
 * this the place stays empty until the large file arrives, and a picture that
 * travels from the other page fades into nothing on the way.
 *
 * `seenSizes` has to be the `sizes` the other page gave the picture, so that
 * both ask for the same file.
 */
export const SharpeningImage = ({
  src,
  alt,
  seenSizes,
  sizes,
  blurs = false,
  className,
  imageClassName,
}: Readonly<{
  src: StaticImageData;
  alt: string;
  seenSizes: string;
  sizes: string;
  /** Show the blurred preview until the smaller file is there. */
  blurs?: boolean;
  /** For the box around both layers. It needs a size of its own or `imageClassName` to give it one. */
  className?: string;
  /** For the smaller picture, which gives the box its shape. */
  imageClassName: string;
}>): ReactNode => (
  <span className={`relative block ${className ?? ''}`}>
    <Image
      src={src}
      alt=""
      sizes={seenSizes}
      loading="eager"
      decoding="sync"
      placeholder={blurs ? 'blur' : 'empty'}
      className={`block ${imageClassName}`}
    />
    <Image
      src={src}
      alt={alt}
      sizes={sizes}
      priority={true}
      className="absolute inset-0 size-full"
    />
  </span>
);
