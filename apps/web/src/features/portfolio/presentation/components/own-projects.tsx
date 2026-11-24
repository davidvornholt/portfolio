import type { ReactNode } from 'react';
import './own-projects.css';
import { textLinkClassName } from './text-link';

type Verdict = 'passed' | 'failed' | 'unchecked';

/** The changes one public repository merged in each week of the chart. */
export type ProjectActivity = Readonly<{
  repository: string;
  /** Oldest week first, and in each week the changes in the order they merged. */
  weeks: ReadonlyArray<ReadonlyArray<Verdict>>;
  total: number;
}>;

const owner = 'davidvornholt';

// A choice of David's public projects, the ones that show the most range.
const projects = [
  {
    name: 'standards',
    about:
      'The rulebook behind every project, and the tool that keeps them in step.',
  },
  {
    name: 'wordhold',
    about: 'Vocabulary practice from photographed textbook pages.',
  },
  {
    name: 'rota',
    about: 'A photographed wardrobe that proposes one outfit each morning.',
  },
  {
    name: 'postlude',
    about: 'A calm journal for closing out the day.',
  },
  {
    name: 'glimpse',
    about: 'A phone app that hands a photo to an AI agent.',
  },
  {
    name: 'keepsake',
    about: 'Turns a folder of photos into a small album of the best ones.',
  },
  {
    name: 'pim',
    about: 'Lets AI agents work with mail, calendars, and contacts.',
  },
  {
    name: 'runlet',
    about: 'Runs each automated check in a fresh, locked-down container.',
  },
  {
    name: 'klarfunk-box',
    about: 'An internet radio for seniors: five buttons on a Raspberry Pi.',
  },
] as const;

// The small chart of a project, in pixels: one square per change, a week as
// a block of squares, and the bar they stand on.
const square = 3;
const pitch = 4;
const squaresAcross = 6;
const weekGap = 4;
const bar = 2;
const weekPitch = squaresAcross * pitch - (pitch - square) + weekGap;
// An outline is drawn inside its square, so its line stays sharp.
const outlineInset = 0.5;

const verdictMark = { passed: 'p', failed: 'f', unchecked: 'u' } as const;

type Mark = Readonly<{
  key: string;
  x: number;
  y: number;
  verdict: Verdict;
  newest: boolean;
}>;

/** Where each change of a project stands: weeks side by side, filled from the bar up. */
const marksOf = (
  weeks: ReadonlyArray<ReadonlyArray<Verdict>>,
  ground: number,
): ReadonlyArray<Mark> => {
  const newestWeek = weeks.findLastIndex((week) => week.length > 0);
  return weeks.flatMap((week, weekIndex) =>
    week.map((verdict, place) => ({
      key: `${weekIndex}-${place}`,
      x: weekIndex * weekPitch + (place % squaresAcross) * pitch,
      y: ground - (Math.floor(place / squaresAcross) + 1) * pitch,
      verdict,
      newest: weekIndex === newestWeek && place === week.length - 1,
    })),
  );
};

const Weeks = ({
  weeks,
}: {
  readonly weeks: ReadonlyArray<ReadonlyArray<Verdict>>;
}): ReactNode => {
  const width = Math.max(square, weeks.length * weekPitch - weekGap);
  const busiest = Math.max(1, ...weeks.map((week) => week.length));
  const ground = Math.ceil(busiest / squaresAcross) * pitch;
  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${width} ${ground + bar}`}
      width={width}
      height={ground + bar}
      className="project-weeks"
    >
      {marksOf(weeks, ground).map((mark) =>
        mark.verdict === 'unchecked' ? (
          <rect
            key={mark.key}
            data-v={verdictMark[mark.verdict]}
            data-newest={mark.newest ? '' : undefined}
            x={mark.x + outlineInset}
            y={mark.y + outlineInset}
            width={square - outlineInset * 2}
            height={square - outlineInset * 2}
          />
        ) : (
          <rect
            key={mark.key}
            data-v={verdictMark[mark.verdict]}
            data-newest={mark.newest ? '' : undefined}
            x={mark.x}
            y={mark.y}
            width={square}
            height={square}
          />
        ),
      )}
      <rect y={ground} width={width} height={bar} />
    </svg>
  );
};

/**
 * David's public projects as a ledger: what each one is, and its own piece of
 * the bar with the changes of the large chart's weeks standing on it. A
 * square is the same size in every row, so a quiet project looks quiet and a
 * new one starts at the right edge.
 */
export const OwnProjects = ({
  activity,
}: {
  readonly activity: ReadonlyArray<ProjectActivity>;
}): ReactNode => {
  const weekCount = Math.max(0, ...activity.map((entry) => entry.weeks.length));
  const idle = Array.from({ length: weekCount }, (): Array<Verdict> => []);
  const rows = projects
    .map((project) => {
      const found = activity.find(
        (entry) => entry.repository === `${owner}/${project.name}`,
      );
      return {
        ...project,
        weeks: found?.weeks ?? idle,
        total: found?.total ?? 0,
      };
    })
    .sort((one, other) => other.total - one.total);
  return (
    <>
      <div className="mt-14 flex flex-wrap items-end justify-between gap-x-6 gap-y-1 md:mt-16">
        <h3 className="font-bold text-2xl tracking-tight">
          My own projects, open to read
        </h3>
        <p className="text-muted-foreground text-sm">
          Changes merged in the last {weekCount} weeks, one square each
        </p>
      </div>
      <ul className="keeps-colors mt-5 border-foreground border-t-2">
        {rows.map((row) => (
          <li key={row.name} className="border-border border-b">
            <a
              href={`https://github.com/${owner}/${row.name}`}
              target="_blank"
              rel="noopener noreferrer"
              data-umami-event="open-source-open"
              data-umami-event-project={row.name}
              className="project-row"
            >
              <strong className="project-name font-bold text-xl tracking-tight">
                {row.name}
              </strong>
              <span className="project-about leading-snug">{row.about}</span>
              <Weeks weeks={row.weeks} />
              <span className="project-total font-bold text-xl tabular-nums tracking-tight">
                {row.total}
                <span className="sr-only">
                  {' '}
                  changes merged in the last {weekCount} weeks
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-7">
        <a
          href={`https://github.com/${owner}`}
          target="_blank"
          rel="noopener noreferrer"
          data-umami-event="social-link"
          data-umami-event-network="GitHub"
          className={textLinkClassName}
        >
          Everything on GitHub
        </a>
      </p>
    </>
  );
};
