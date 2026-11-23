import type { ReactNode } from 'react';
import { Section } from './section';

// A real sequence: each entry happened after the one before it.
const timeline = [
  { when: '2019', what: 'First programs, written by hand' },
  {
    when: '2024',
    what: 'The website for the Freie Evangelische Schule Kirchheim goes live',
  },
  { when: 'Late 2025', what: 'AI starts writing most of my code' },
  { when: 'March 2026', what: 'Co-founded ProsaBridge' },
  { when: 'August 2026', what: 'Atrium starts its pilot at the first school' },
] as const;

export const About = (): ReactNode => (
  <Section id="about" heading="About me">
    <div className="mt-6 grid gap-x-14 gap-y-10 lg:grid-cols-13">
      <div className="lg:col-span-7">
        <p className="max-w-2xl text-lg md:text-xl md:leading-snug">
          I started programming in 2019 and wrote every line myself for six
          years. In late 2025 the AI models became good enough to write most of
          the code, and my work moved from typing it to deciding what gets built
          and what is good enough to go live.
        </p>
        <p className="mt-5 max-w-xl text-lg text-muted-foreground leading-relaxed">
          I speak German and English at native level and get by in French and
          Spanish. That is part of why I ended up building a translation
          company.
        </p>
      </div>
      <ol className="border-foreground border-t-2 lg:col-span-6 lg:mt-2">
        {timeline.map((entry) => (
          <li
            key={entry.what}
            className="grid grid-cols-[7.5rem_1fr] border-border border-b py-3.5 leading-snug"
          >
            <span className="font-bold">{entry.when}</span>
            <span>{entry.what}</span>
          </li>
        ))}
      </ol>
    </div>
  </Section>
);
