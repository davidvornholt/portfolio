import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import portrait from '@/public/portrait.png';
import { Activity } from '../../activity/activity';

export const Hero = () => (
  <section className="folio-wrap pt-24 md:pt-24">
    <div className="intro-grid">
      <div className="intro-copy">
        <p className="folio-label mb-4 flex items-center gap-3 text-primary">
          <span className="h-px w-9 bg-current" />
          Co-founder &amp; CTO, ProsaBridge
        </p>
        <h1 className="display-title">
          I build software
          <br />
          for <em>publishers.</em>
        </h1>
        <p className="mt-5 max-w-xl text-[1.08rem] leading-snug md:text-xl">
          I’m David Vornholt. At ProsaBridge, I help editors translate whole
          books and keep every footnote in place.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
          <Link className="ink-link" href="/works/prosabridge">
            Inside ProsaBridge <ArrowUpRight size={15} />
          </Link>
          <a className="ink-link" href="#method">
            How I work <ArrowDownRight size={15} />
          </a>
        </div>
      </div>
      <figure className="portrait-print">
        <Image
          src={portrait}
          preload={true}
          sizes="(max-width: 640px) 88px, 300px"
          alt="David Vornholt"
          className="size-full object-cover object-center"
        />
        <figcaption className="folio-label">David Vornholt</figcaption>
      </figure>
    </div>
    <Activity />
  </section>
);
