import { ArrowDown, ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import portrait from '@/public/portrait.png';
import { BookImpression } from '@/shared/content/presentation/components/book-impression';

export const Hero = () => (
  <section className="cover-sheet">
    <div className="folio-wrap">
      <div className="edition-line">
        <span>David Vornholt / Portfolio</span>
        <span>Selected work, 2024–26</span>
      </div>
      <div className="cover-composition">
        <div className="cover-copy">
          <h1 className="cover-title">
            Software
            <br />
            for <em>books.</em>
          </h1>
          <p>
            I’m David Vornholt. I co-founded ProsaBridge to help editors
            translate whole books and keep every footnote in place.
          </p>
          <Link className="press-link" href="/works/prosabridge">
            Inside ProsaBridge <ArrowUpRight size={18} />
          </Link>
        </div>
        <figure className="cover-art">
          <div className="plate-top" aria-hidden="true">
            <i className="register-cross" />
            <i className="ink-dots" />
          </div>
          <BookImpression />
          <figcaption className="edition-line">
            <span>Open signature</span>
            <span>Two-color study</span>
          </figcaption>
        </figure>
      </div>
      <div className="cover-credit">
        <div className="flex items-center gap-3">
          <Image
            src={portrait}
            alt="David Vornholt"
            width={55}
            height={73}
            sizes="55px"
            className="author-photo"
          />
          <div>
            <strong>David Vornholt</strong>
            <p className="folio-label">Co-founder &amp; CTO</p>
          </div>
        </div>
        <a href="#method" className="ink-link">
          How I review software <ArrowDown size={15} />
        </a>
      </div>
    </div>
  </section>
);
