import type { ReactNode } from 'react';
import './servers.css';
import { Section } from './section';
import { textLinkClassName } from './text-link';

const steps = [
  {
    kind: 'passed',
    title: 'Proposed',
    text: 'The whole configuration is checked, and tests boot it on virtual machines.',
  },
  {
    kind: 'passed',
    title: 'Merged',
    text: 'Each server that changed is switched over, one at a time.',
  },
  {
    kind: 'passed',
    title: 'Verified',
    text: 'Every public page has to answer.',
  },
  {
    kind: 'failed',
    title: 'If something fails',
    text: 'The server goes back to the system it ran before.',
  },
] as const;

/**
 * How a change reaches a server: the servers are described in files, so a
 * change to them takes the same path as a change to code.
 */
export const Servers = (): ReactNode => (
  <Section
    id="servers"
    heading="The server is code too"
    lede="I change nothing on a server by hand. What runs there stands in files, so what is live always matches a version that was checked, and an AI agent can read all of it."
  >
    <ol className="servers-track keeps-colors">
      {steps.map((step) => (
        <li key={step.title} className="servers-step" data-kind={step.kind}>
          <h3 className="font-bold text-xl tracking-tight">{step.title}</h3>
          <p className="mt-1.5 max-w-xs text-muted-foreground leading-relaxed">
            {step.text}
          </p>
        </li>
      ))}
    </ol>
    <p className="mt-8">
      <a
        href="https://github.com/davidvornholt/portfolio/blob/main/.github/workflows/roll-back.yml"
        target="_blank"
        rel="noopener noreferrer"
        data-umami-event="roll-back-open"
        className={textLinkClassName}
      >
        See how this site goes back a version
      </a>
    </p>
  </Section>
);
