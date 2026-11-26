import type { StaticImageData } from 'next/image';
import Image from 'next/image';
import type { ReactNode } from 'react';
import { TravellingPicture } from '@/shared/page/presentation/components/page-transitions';
import { SharpeningImage } from '@/shared/page/presentation/components/sharpening-image';

// Every object gets a box of this shape, and fills its width or its height.
// The box's own class below has to name the same shape.
const box = { width: 3, height: 2 } as const;
// The width of the small picture beside an article's row.
const listSizes = '7rem';

/**
 * The object that stands for an article, in a box three wide and two high.
 * The picture itself is as large as the box allows and no larger, so that
 * its edges are the object's own. That matters when it travels between the
 * list and the article: both pictures have the same shape, and one lies
 * exactly on the other. Multiplied with the page, its white takes the page's
 * colour, so the object and its shadow lie on the page.
 *
 * With `sharpSizes` this is the large picture on the article's page, which
 * starts from the small one the list has already loaded.
 */
export const ObjectPicture = ({
  slug,
  picture,
  alt,
  sharpSizes,
  className,
}: Readonly<{
  slug: string;
  picture: StaticImageData;
  alt: string;
  sharpSizes?: string;
  /** Places the box, and with `justify-*` the picture in it. */
  className: string;
}>): ReactNode => {
  const wide = picture.width * box.height >= picture.height * box.width;
  const frame = wide ? 'w-full' : 'h-full';
  const fit = wide ? 'h-auto w-full' : 'h-full w-auto';
  return (
    <span className={`flex aspect-[3/2] items-center ${className}`}>
      <TravellingPicture kind="post" slug={slug}>
        {sharpSizes === undefined ? (
          <Image
            src={picture}
            alt={alt}
            sizes={listSizes}
            className={`mix-blend-multiply ${fit}`}
          />
        ) : (
          <SharpeningImage
            src={picture}
            alt={alt}
            seenSizes={listSizes}
            sizes={sharpSizes}
            className={`mix-blend-multiply ${frame}`}
            imageClassName={fit}
          />
        )}
      </TravellingPicture>
    </span>
  );
};
