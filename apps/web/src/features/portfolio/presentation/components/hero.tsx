import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import portraitImage from '@/public/portrait.png';

/**
 * The opening of the home page: the chart of merged changes on its bar, and
 * under it the sentence that says what the bar is for.
 */
export const Hero = ({
  field,
  legend,
}: Readonly<{ field: ReactNode; legend: ReactNode }>): ReactNode => (
  <section className="page-column">
    {field}

    <div className="grid gap-y-5 pt-6 md:pt-8 lg:grid-cols-13">
      <h1 className="font-bold text-[2.125rem] leading-[1.06] tracking-tight sm:text-5xl lg:col-span-10 lg:text-[4rem] lg:leading-[1.03] 2xl:text-[4.5rem]">
        <span className="block text-balance">
          I wrote code by&nbsp;hand for six years.
        </span>{' '}
        <span className="block text-balance">Now AI writes most of it.</span>{' '}
        <span className="block text-balance">
          It still has to get over this bar.
        </span>
      </h1>

      <figure className="flex items-center gap-4 lg:col-span-3 lg:col-start-11 lg:row-span-2 lg:block lg:pt-2">
        <Image
          src={portraitImage}
          alt="David Vornholt"
          priority={true}
          placeholder="blur"
          sizes="(min-width: 64rem) 22vw, 5rem"
          className="aspect-square w-20 object-cover object-[50%_18%] lg:aspect-[4/5] lg:w-full"
        />
        <figcaption className="text-muted-foreground text-sm leading-snug lg:mt-2.5">
          <strong className="block font-bold text-foreground">
            David Vornholt
          </strong>
          Co-founder and CTO of ProsaBridge
        </figcaption>
      </figure>

      <div className="lg:col-span-8">
        <p className="max-w-2xl text-xl leading-snug md:text-[1.4rem]">
          I’m David. I co-founded ProsaBridge, where we translate whole books
          for publishers, and I’m building Atrium, which takes a school’s daily
          paperwork off its staff.
        </p>
        {legend}
        <p className="mt-5 flex flex-wrap gap-3 print:hidden">
          <Link
            href="#work"
            className="inline-flex h-12 items-center border-2 border-foreground bg-foreground px-6 font-semibold text-background hover:bg-background hover:text-foreground active:translate-y-px"
          >
            See what I build
          </Link>
          <Link
            href="#contact"
            className="inline-flex h-12 items-center border-2 border-foreground px-6 font-semibold hover:bg-foreground hover:text-background active:translate-y-px"
          >
            Write to me
          </Link>
        </p>
      </div>
    </div>
  </section>
);
