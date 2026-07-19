import Image from 'next/image';
import type { ReactNode } from 'react';

export const MDXImage = ({
  src,
  alt,
  className = '',
  priority = false,
}: Readonly<{
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}>): ReactNode => (
  <figure className="my-8">
    <div className="relative aspect-video w-full overflow-hidden rounded-lg">
      <Image
        src={src}
        alt={alt}
        fill={true}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"
        className={`object-cover ${className}`}
        priority={priority}
      />
    </div>
    {alt.length === 0 ? null : (
      <figcaption className="mt-2 text-center text-muted-foreground text-sm">
        {alt}
      </figcaption>
    )}
  </figure>
);
