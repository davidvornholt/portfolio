import type { ReactNode } from 'react';
import { Section } from './section';
import { textLinkClassName } from './text-link';

/** How many of David's changes one project he doesn't maintain has merged. */
export type AcceptedProject = Readonly<{ repository: string; changes: number }>;

const featuredRepository = 'super-productivity/super-productivity';

const otherFixes = [
  {
    name: 'libblockdev',
    about: 'The library Linux desktops use to manage disks.',
    fix: 'A damaged exFAT drive is now reported as damaged instead of stopping the check.',
    href: 'https://github.com/storaged-project/libblockdev/pull/1226',
  },
  {
    name: 'deploy-rs',
    about: 'A tool that rolls out server configurations.',
    fix: 'I fixed a race that could undo a rollout that had succeeded.',
    href: 'https://github.com/serokell/deploy-rs/pull/385',
  },
] as const;

// A choice of David's public projects, the ones that show the most range.
const ownProjects = [
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
    about: 'Lets AI agents work with mail, calendars and contacts.',
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

// One square per merged change, like the squares on the bar.
const Squares = ({ count }: { readonly count: number }): ReactNode => (
  <span aria-hidden="true" className="flex max-w-88 flex-wrap gap-0.75">
    {Array.from({ length: count }, (_, ordinal) => ordinal + 1).map(
      (ordinal) => (
        <span key={ordinal} className="size-2.75 bg-foreground" />
      ),
    )}
  </span>
);

const Featured = ({ changes }: { readonly changes: number }): ReactNode => (
  <a
    href="https://github.com/super-productivity/super-productivity/pulls?q=is%3Apr+is%3Amerged+author%3Adavidvornholt"
    target="_blank"
    rel="noopener noreferrer"
    data-umami-event="accepted-open"
    data-umami-event-project="super-productivity"
    className="group grid gap-x-14 gap-y-5 border-foreground border-t-2 py-7 md:grid-cols-2 md:py-9"
  >
    <span>
      <strong className="block font-bold text-2xl tracking-tight underline decoration-2 decoration-transparent underline-offset-4 group-hover:decoration-current">
        Super Productivity
      </strong>
      <span className="mt-2 block max-w-xl text-lg text-muted-foreground leading-relaxed">
        A to-do and time-tracking app with more than 20,000 stars on GitHub. I
        fixed lost tracked time, reminders that fired on the wrong day and slow
        task lists.
      </span>
    </span>
    <span className="md:pt-2">
      <Squares count={changes} />
      <span className="mt-3 block font-semibold text-sm">
        {changes} changes merged
      </span>
    </span>
  </a>
);

/**
 * Changes that maintainers of other projects reviewed and merged, and David's
 * own projects that are open to read.
 */
export const Accepted = ({
  projects,
}: {
  readonly projects: ReadonlyArray<AcceptedProject>;
}): ReactNode => {
  const total = projects.reduce((sum, project) => sum + project.changes, 0);
  const featured = projects.find(
    (project) => project.repository === featuredRepository,
  );
  return (
    <Section
      id="accepted"
      heading="Other projects accept my changes too"
      lede={`A check I wrote myself only proves so much. The maintainers of ${projects.length} projects I don’t run have reviewed ${total} of my changes and merged them.`}
    >
      <div className="mt-10 md:mt-13">
        {featured === undefined ? null : (
          <Featured changes={featured.changes} />
        )}
        <ul className="grid gap-x-14 border-border border-t md:grid-cols-2">
          {otherFixes.map((fix) => (
            <li key={fix.name} className="border-border border-b py-6">
              <a
                href={fix.href}
                target="_blank"
                rel="noopener noreferrer"
                data-umami-event="accepted-open"
                data-umami-event-project={fix.name}
                className="group block"
              >
                <strong className="font-bold text-xl tracking-tight underline decoration-2 decoration-transparent underline-offset-4 group-hover:decoration-current">
                  {fix.name}
                </strong>
                <span className="mt-1 block max-w-lg text-muted-foreground leading-relaxed">
                  {fix.about} {fix.fix}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <h3 className="mt-14 font-bold text-2xl tracking-tight md:mt-16">
        My own projects, open to read
      </h3>
      <ul className="mt-5 grid gap-x-14 gap-y-5 border-border border-t pt-6 sm:grid-cols-2 lg:grid-cols-3">
        {ownProjects.map((project) => (
          <li key={project.name}>
            <a
              href={`https://github.com/davidvornholt/${project.name}`}
              target="_blank"
              rel="noopener noreferrer"
              data-umami-event="open-source-open"
              data-umami-event-project={project.name}
              className="group block"
            >
              <strong className="font-bold underline decoration-2 decoration-transparent underline-offset-4 group-hover:decoration-current">
                {project.name}
              </strong>
              <span className="mt-0.5 block text-muted-foreground leading-snug">
                {project.about}
              </span>
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-7">
        <a
          href="https://github.com/davidvornholt"
          target="_blank"
          rel="noopener noreferrer"
          data-umami-event="social-link"
          data-umami-event-network="GitHub"
          className={textLinkClassName}
        >
          Everything on GitHub
        </a>
      </p>
    </Section>
  );
};
