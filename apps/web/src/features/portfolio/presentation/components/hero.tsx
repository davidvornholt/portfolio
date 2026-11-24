import { ArrowDown, ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export const Hero = () => (
  <section className="opening">
    <Image
      src="/stills/binding.webp"
      alt="A bookbinder draws linen thread through folded sheets."
      fill={true}
      preload={true}
      sizes="100vw"
      className="opening-still"
    />
    <div className="opening-titles folio-wrap">
      <div className="title-block">
        <p className="credit-label">
          <span className="cue" />
          Publishing software
        </p>
        <h1>
          I make software
          <br />
          for books.
        </h1>
        <p className="opening-deck">
          I co-founded ProsaBridge to help editors translate a whole manuscript
          and keep every footnote in place.
        </p>
        <Link className="film-link" href="/works/prosabridge">
          Inside ProsaBridge <ArrowUpRight size={16} />
        </Link>
      </div>
      <div className="closing-credit">
        <p>
          <span className="credit-label">David Vornholt</span>
          <span>Co-founder &amp; CTO, ProsaBridge</span>
        </p>
        <a href="#method" className="credit-label flex items-center gap-3">
          How I work <ArrowDown size={16} />
        </a>
      </div>
    </div>
  </section>
);
