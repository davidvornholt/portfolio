import Link from 'next/link';
import type { ReactNode } from 'react';
import { Section } from './section';
import { textLinkClassName } from './text-link';

const linkClassName = `${textLinkClassName} text-foreground`;

/**
 * What the rules rest on: one rulebook shared by every project, and servers
 * that are described in files like the code is.
 */
export const Foundations = (): ReactNode => (
  <Section
    id="foundations"
    heading="One rulebook for every project, and for the servers"
    lede="The rules above are not this site’s alone, and they don’t stop at the code."
  >
    <ul className="mt-10 grid gap-x-14 border-foreground border-t-2 md:mt-13 lg:grid-cols-3">
      <li className="border-border border-b py-7 lg:border-b-0 lg:py-9">
        <h3 className="font-bold text-2xl tracking-tight">
          Every project copies the same rules
        </h3>
        <p className="mt-3 max-w-xl text-lg text-muted-foreground leading-relaxed">
          The rulebook is a public project of its own. Every project of mine
          holds a copy, and a check fails as soon as a file of that copy is
          changed by hand. A better rule reaches every project with its next
          sync.
        </p>
        <p className="mt-4">
          <Link
            href="/posts/executable-engineering-standards"
            className={linkClassName}
          >
            Read how the rulebook works
          </Link>
        </p>
      </li>
      <li className="border-border border-b py-7 lg:border-b-0 lg:py-9">
        <h3 className="font-bold text-2xl tracking-tight">
          A server is written down like code
        </h3>
        <p className="mt-3 max-w-xl text-lg text-muted-foreground leading-relaxed">
          Which programs run on a server, in which version, and who may reach
          them stands in files. Building from the same files gives the same
          server, so a bad change is undone by going back one version.
        </p>
        <p className="mt-4">
          <a
            href="https://github.com/davidvornholt/portfolio/blob/main/.github/workflows/roll-back.yml"
            target="_blank"
            rel="noopener noreferrer"
            data-umami-event="roll-back-open"
            className={linkClassName}
          >
            See how this site goes back a version
          </a>
        </p>
      </li>
      <li className="py-7 lg:py-9">
        <h3 className="font-bold text-2xl tracking-tight">
          That is what lets AI agents work on it
        </h3>
        <p className="mt-3 max-w-xl text-lg text-muted-foreground leading-relaxed">
          An agent can read all of it. Nothing hides in a dashboard or in
          someone’s memory, so a change to a server arrives like any other
          change: as text that has to pass the checks and a review before it
          touches anything real.
        </p>
      </li>
    </ul>
  </Section>
);
