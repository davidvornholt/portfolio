import type { ReactNode } from 'react';
import './journey.css';
import './journey-motion.css';
import { textLinkClassName } from './text-link';

const changeUrl = 'https://github.com/davidvornholt/glimpse/pull/27';
const reportUrl = `${changeUrl}#issuecomment-7018500648`;

type Step = Readonly<{
  /** The station's name on the bar, in a word or two. */
  station: string;
  title: string;
  text: string;
  fact: string;
  link?: Readonly<{ label: string; href: string }>;
}>;

// One real change, glimpse#27, with the numbers its pull request and its
// review report give. The stations and their order are fixed: the animation
// in `journey-motion.css` is written for exactly these six.
const steps: ReadonlyArray<Step> = [
  {
    station: 'Written down',
    title: 'The problem is written down',
    text: 'Before any code exists, a short note says what is wrong and what counts as fixed.',
    fact: 'Here: a note edited on the phone could be lost.',
    link: {
      label: 'Read the note',
      href: 'https://github.com/davidvornholt/glimpse/issues/10',
    },
  },
  {
    station: 'Built',
    title: 'An AI agent builds the fix',
    text: 'It works on its own copy of the project, so nothing that is live can break.',
    fact: '42 files changed.',
    link: { label: 'See the change', href: `${changeUrl}/files` },
  },
  {
    station: 'Checked',
    title: 'Every check has to pass',
    text: 'Types, tests and the build. Many projects would publish at this point.',
    fact: 'One failure stops the change here.',
  },
  {
    station: 'Reviewed',
    title: 'Reviewers try to break it',
    text: 'Three AI reviewers that didn’t write the change each hunt one kind of failure. They found what the checks could not, and the change went back.',
    fact: '8 serious faults found and fixed.',
    link: { label: 'Read their report', href: reportUrl },
  },
  {
    station: 'Checked again',
    title: 'Every check runs again',
    text: 'On the exact final version, because a fix can break something else.',
    fact: '16 of 16 tasks and 142 tests passed in 64 seconds.',
  },
  {
    station: 'Live',
    title: 'It goes live',
    text: '89 minutes after the fix was proposed. It is one of the squares at the top of this page.',
    fact: 'Merged on November 19, 2026.',
    link: { label: 'See it on GitHub', href: changeUrl },
  },
];

const faults = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const;
const earlier = ['a', 'b'] as const;

/**
 * What one change went through before it went live. A square travels along
 * the bar while the visitor reads: an outline while it is an idea, solid once
 * it is built, caught in the bar when the reviewers send it back, and at the
 * end on the pile of changes that went live.
 */
export const Journey = (): ReactNode => (
  <section id="how" className="journey scroll-mt-8">
    <div className="page-column">
      <h2 className="max-w-4xl font-bold text-3xl tracking-tight md:text-5xl md:leading-[1.05]">
        What one change goes through
      </h2>
      <p className="mt-4 max-w-2xl text-lg md:text-xl md:leading-snug">
        A real change, written by AI: a fix to Glimpse, my phone app for handing
        a photo to an AI agent.
      </p>
    </div>

    <div aria-hidden="true" className="journey-band">
      <div className="journey-track page-column">
        <span className="journey-pile">
          {earlier.map((key) => (
            <i key={key} />
          ))}
        </span>
        <span className="journey-square">
          <span className="journey-mark" />
        </span>
      </div>
      <div className="journey-bar bleed">
        <div className="journey-inside page-column">
          <span className="journey-checks" data-run="first" />
          <span className="journey-checks" data-run="second" />
          <span className="journey-caught">
            {faults.map((key) => (
              <i key={key} />
            ))}
          </span>
        </div>
        <ol className="journey-stations page-column">
          {steps.map((step, position) => (
            <li key={step.station}>
              <span className="journey-station-number">{position + 1}</span>
              <span className="journey-station-name">{step.station}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>

    <ol className="journey-steps page-column">
      {steps.map((step, position) => (
        <li key={step.station} className="journey-step">
          <h3 className="journey-title flex gap-4 font-bold tracking-tight md:gap-6">
            <span aria-hidden="true" className="text-muted-foreground">
              {position + 1}
            </span>
            {step.title}
          </h3>
          <p className="journey-text mt-3 max-w-3xl md:mt-4">{step.text}</p>
          <p className="mt-3 md:mt-4 md:text-lg">
            <strong className="font-semibold">{step.fact}</strong>
            {step.link === undefined ? null : (
              <>
                {' '}
                <a
                  href={step.link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-umami-event="journey-open"
                  className={textLinkClassName}
                >
                  {step.link.label}
                </a>
              </>
            )}
          </p>
        </li>
      ))}
    </ol>
  </section>
);
