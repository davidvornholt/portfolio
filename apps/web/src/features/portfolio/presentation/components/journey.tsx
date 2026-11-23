import type { ReactNode } from 'react';
import './journey.css';
import { JourneyDiagram } from './journey-diagram';
import { narrowGeometry, stationNames, wideGeometry } from './journey-geometry';
import { JourneyPlayer } from './journey-player';
import { textLinkClassName } from './text-link';

const exampleUrl = 'https://github.com/davidvornholt/standards/pull/566';
const reportUrl = `${exampleUrl}#issuecomment-6923936877`;

// What happens at each station, in the order of `stationNames`.
const steps = [
  {
    title: 'The problem',
    text: 'What is wrong and what counts as fixed, written down first.',
  },
  {
    title: 'The agent',
    text: 'An AI agent builds the fix on its own copy of the project.',
  },
  {
    title: 'The proposal',
    text: 'It says what was before, what is now, and how that was verified.',
  },
  {
    title: 'The checks',
    text: 'Style, types, tests, build and accessibility. One failure stops it.',
  },
  {
    title: 'The review',
    text: 'A different AI model looks for what the checks can’t see.',
  },
  {
    title: 'Live',
    text: 'Merged as one change, released automatically, one step to undo.',
  },
] as const;

/**
 * The way every change takes, drawn as a line that leaves the bar and comes
 * back to it, and under it a real change that took it.
 */
export const Journey = (): ReactNode => (
  <section id="how" className="journey scroll-mt-8">
    <div className="page-column">
      <h2 className="max-w-4xl font-bold text-3xl tracking-tight md:text-5xl md:leading-[1.05]">
        The path of every change
      </h2>
      <p className="mt-4 max-w-2xl text-lg md:text-xl md:leading-snug">
        Whether I write it or an AI agent does. Nothing reaches the bar any
        other way.
      </p>
    </div>

    <JourneyPlayer>
      <div className="journey-stage page-column" data-stage="">
        <JourneyDiagram geometry={wideGeometry} size="wide" />
        <JourneyDiagram geometry={narrowGeometry} size="narrow" />
        <p aria-hidden="true" className="journey-flag" data-flag="">
          <span data-flag-text="bad">3 blockers</span>
          <span data-flag-text="ok">Round 2: nothing found</span>
        </p>
      </div>
      <div aria-hidden="true" className="journey-bar bleed">
        <ol className="journey-stations page-column">
          {steps.map((step, position) => (
            <li key={step.title}>
              <span className="journey-station-number">{position + 1}</span>
              <span className="journey-station-name">{step.title}</span>
            </li>
          ))}
        </ol>
      </div>
      <ol className="journey-steps page-column">
        {steps.map((step, position) => (
          <li
            key={step.title}
            className="journey-step"
            data-step={stationNames[position]}
          >
            <span
              aria-hidden="true"
              className="journey-step-number font-bold text-muted-foreground"
            >
              {position + 1}
            </span>
            <span>
              <strong className="font-bold md:sr-only">{step.title}. </strong>
              <span className="leading-snug">{step.text}</span>
            </span>
          </li>
        ))}
      </ol>
    </JourneyPlayer>

    <div className="page-column mt-14 border-foreground border-t-2 pt-6 md:mt-16">
      <p className="text-muted-foreground">
        The picture follows a real change to my rulebook’s own tool:{' '}
        <a
          href={exampleUrl}
          target="_blank"
          rel="noopener noreferrer"
          data-umami-event="journey-open"
          className={`${textLinkClassName} text-foreground`}
        >
          access keys had expired without warning and stopped a release
        </a>
      </p>
      <div className="journey-example">
        <p>
          <strong className="block font-bold text-5xl tracking-tight md:text-6xl">
            3
          </strong>
          <span className="mt-2 block text-muted-foreground">
            blockers in the first review, none in the second
          </span>
        </p>
        <p>
          <strong className="block font-bold text-xl tracking-tight">
            The most important one
          </strong>
          <span className="mt-2 block text-lg leading-snug">
            The new warning would have gone quiet just when it mattered: a key
            about to expire was hidden by a newer one of the same name. Now a
            key stays reported until it is retired.{' '}
            <a
              href={reportUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-umami-event="journey-report-open"
              className={textLinkClassName}
            >
              Read the review
            </a>
          </span>
        </p>
        <p>
          <strong className="block font-bold text-5xl tracking-tight md:text-6xl">
            25 min
          </strong>
          <span className="mt-2 block text-muted-foreground">
            for both reviews and all fixes
          </span>
        </p>
      </div>
    </div>
  </section>
);
