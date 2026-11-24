import { ArrowUpRight } from 'lucide-react';

const projects = [
  [
    'standards',
    'The checks, review instructions, and update tool I share across my projects.',
  ],
  [
    'runlet',
    'Short-lived machines that build and test code, then discard the working environment.',
  ],
  [
    'wordhold',
    'Vocabulary practice that starts with a photo of the page I’m studying.',
  ],
  [
    'rota',
    'A wardrobe planner that remembers what I wore and what is in the laundry.',
  ],
] as const;
export const OpenSource = () => (
  <section className="folio-wrap grid gap-8 py-16 md:grid-cols-[1fr_1.5fr] md:py-24">
    <div>
      <h2 className="folio-heading">Open source</h2>
      <a
        className="ink-link mt-4 text-primary"
        href="https://github.com/davidvornholt"
      >
        My GitHub profile <ArrowUpRight size={15} />
      </a>
    </div>
    <div>
      {projects.map(([name, description]) => (
        <a
          key={name}
          className="group grid grid-cols-[1fr_auto] gap-2 border-border border-t py-5"
          href={`https://github.com/davidvornholt/${name}`}
        >
          <h3 className="font-mono text-lg">{name}</h3>
          <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-1" />
          <p className="text-muted-foreground">{description}</p>
        </a>
      ))}
    </div>
  </section>
);
