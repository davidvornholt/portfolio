import type { ReactNode } from 'react';
import { HoppingLink } from './hopping-link';
import { OwnProjects, type ProjectActivity } from './own-projects';
import { Section } from './section';

/** How many of David's changes one project he doesn't maintain has merged. */
export type AcceptedProject = Readonly<{ repository: string; changes: number }>;

// The project with the most accepted changes, and the repository that
// packages it for Flathub, which belongs to the same project.
const featured = {
  repository: 'super-productivity/super-productivity',
  packaging: 'flathub/com.super_productivity.SuperProductivity',
} as const;

// What the page can say about a project. A project the data names and this
// list doesn't still gets a row, with its name and its count.
const described: Readonly<
  Record<string, Readonly<{ name: string; about: string; href: string }>>
> = {
  'storaged-project/libblockdev': {
    name: 'libblockdev',
    about:
      'The library Linux desktops use to manage disks. A damaged exFAT drive is now reported as damaged instead of stopping the check.',
    href: 'https://github.com/storaged-project/libblockdev/pull/1226',
  },
  'serokell/deploy-rs': {
    name: 'deploy-rs',
    about:
      'A tool that rolls out server configurations. I fixed a race that could undo a rollout that had succeeded.',
    href: 'https://github.com/serokell/deploy-rs/pull/385',
  },
};

const merged = (changes: number): string =>
  `${changes} ${changes === 1 ? 'change' : 'changes'} merged`;

const mergedBy = (repository: string): string =>
  `https://github.com/${repository}/pulls?q=is%3Apr+is%3Amerged+author%3Adavidvornholt`;

// One square per merged change, like the squares on the bar.
const Squares = ({ count }: { readonly count: number }): ReactNode => (
  <span
    aria-hidden="true"
    className="keeps-colors flex max-w-88 flex-wrap gap-0.75 [--hop-height:1rem]"
  >
    {Array.from({ length: count }, (_, ordinal) => ordinal + 1).map(
      (ordinal) => (
        <span
          key={ordinal}
          data-square=""
          className="size-2.75 bg-foreground"
        />
      ),
    )}
  </span>
);

const Featured = ({
  changes,
  packaged,
}: Readonly<{ changes: number; packaged: number }>): ReactNode => (
  <HoppingLink
    href={mergedBy(featured.repository)}
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
        fixed lost tracked time, reminders that fired on the wrong day, and slow
        task lists.
      </span>
    </span>
    <span className="md:pt-2">
      <Squares count={changes + packaged} />
      <span className="mt-3 block font-semibold text-sm">
        {merged(changes + packaged)}
        {packaged === 0 ? null : `, ${packaged} of them in its Flathub package`}
      </span>
    </span>
  </HoppingLink>
);

/**
 * Changes that maintainers of other projects reviewed and merged, and David's
 * own projects that are open to read. Every project the lede counts has a
 * row, and the counts in the rows add up to the lede's total.
 */
export const Accepted = ({
  projects,
  activity,
}: Readonly<{
  projects: ReadonlyArray<AcceptedProject>;
  /** What David's own public projects merged, week by week. */
  activity: ReadonlyArray<ProjectActivity>;
}>): ReactNode => {
  const total = projects.reduce((sum, project) => sum + project.changes, 0);
  const changesOf = (repository: string): number =>
    projects.find((project) => project.repository === repository)?.changes ?? 0;
  const others = projects.filter(
    (project) =>
      project.repository !== featured.repository &&
      project.repository !== featured.packaging,
  );
  const featuredChanges = changesOf(featured.repository);
  const projectCount = others.length + (featuredChanges > 0 ? 1 : 0);
  return (
    <Section
      id="accepted"
      heading="Other projects accept my changes too"
      lede={`A check I wrote myself only proves so much. The maintainers of ${projectCount} projects I don’t run have reviewed ${total} of my changes and merged them.`}
    >
      <div className="mt-10 md:mt-13">
        {featuredChanges === 0 ? null : (
          <Featured
            changes={featuredChanges}
            packaged={changesOf(featured.packaging)}
          />
        )}
        <ul className="grid gap-x-14 border-border border-t md:grid-cols-2">
          {others.map((project) => {
            const known = described[project.repository];
            return (
              <li
                key={project.repository}
                className="border-border border-b py-6"
              >
                <a
                  href={known?.href ?? mergedBy(project.repository)}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-umami-event="accepted-open"
                  data-umami-event-project={known?.name ?? project.repository}
                  className="group block"
                >
                  <strong className="font-bold text-xl tracking-tight underline decoration-2 decoration-transparent underline-offset-4 group-hover:decoration-current">
                    {known?.name ?? project.repository}
                  </strong>
                  {known === undefined ? null : (
                    <span className="mt-1 block max-w-lg text-muted-foreground leading-relaxed">
                      {known.about}
                    </span>
                  )}
                  <span className="mt-2 block font-semibold text-sm">
                    {merged(project.changes)}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>

      <OwnProjects activity={activity} />
    </Section>
  );
};
