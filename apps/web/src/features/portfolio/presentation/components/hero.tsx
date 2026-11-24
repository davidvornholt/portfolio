import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import portrait from '@/public/portrait.png';
import { NetworkMap } from './network-map';

export const Hero = () => (
  <section className="guide-hero">
    <div className="folio-wrap guide-opening">
      <div className="guide-intro">
        <div className="flex items-center gap-3">
          <Image
            src={portrait}
            sizes="68px"
            preload={true}
            alt="David Vornholt"
            className="guide-portrait"
          />
          <div>
            <p className="font-semibold">David Vornholt</p>
            <p className="text-muted-foreground text-sm">
              Co-founder &amp; CTO
            </p>
          </div>
        </div>
        <h1>
          I build tools for <span>publishers.</span>
        </h1>
        <p className="intro-deck">
          I co-founded ProsaBridge to help editors translate entire books and
          keep every footnote in place.
        </p>
        <Link href="/works/prosabridge" className="destination-link">
          Inside ProsaBridge <ArrowUpRight size={18} />
        </Link>
      </div>
      <NetworkMap />
    </div>
  </section>
);
