import type { ReactNode } from 'react';
import { repositoryUrl } from '@/config/site';
import type { BuildInfo } from '@/shared/build-info/services/build-info';
import { formatPostDate } from '@/shared/content/services/format-post-date';

const shortShaLength = 7;

const Commit = ({ build }: { readonly build: BuildInfo }): ReactNode => (
  <>
    change{' '}
    <code className="font-mono text-[0.9em]">
      {build.sha.slice(0, shortShaLength)}
    </code>
    , “{build.title}”
  </>
);

/**
 * Says which commit the page was built from, in words that are true wherever
 * the build runs. The release image exists before its commit's checks have
 * finished, and only production waits for them, so the line says what
 * production does and not that the checks have passed.
 *
 * The date is the day the commit was made, which for a change on `main` is
 * the day it merged. The page can go live a day later, so the line doesn't
 * call it the day of the release.
 */
export const BuildLine = ({
  build,
}: {
  readonly build: BuildInfo | null;
}): ReactNode => {
  if (build === null) {
    return <p>This page was built from a working copy.</p>;
  }
  if (!build.released) {
    return (
      <p>
        This is a preview, built from <Commit build={build} />. That change has
        not gone live.
      </p>
    );
  }
  return (
    <p>
      This page was built from <Commit build={build} />, which merged on{' '}
      <time dateTime={build.committedOn}>
        {formatPostDate(build.committedOn)}
      </time>
      . A change goes live here only after its checks have passed.{' '}
      <a
        href={`${repositoryUrl}/commit/${build.sha}/checks`}
        target="_blank"
        rel="noopener noreferrer"
        data-umami-event="build-checks-open"
        className="font-semibold underline decoration-2 underline-offset-4 hover:decoration-4"
      >
        See the checks
      </a>
    </p>
  );
};
