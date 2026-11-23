import type { ReactNode } from 'react';
import { repositoryUrl } from '@/config/site';
import type { BuildInfo } from '@/shared/build/services/build-info';
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
 * Says which commit the page was built from. Only a released build claims
 * that the commit's checks passed, because the publishing workflow releases
 * nothing else. A preview is built before its checks have finished.
 */
export const BuildLine = ({
  build,
}: {
  readonly build: BuildInfo | null;
}): ReactNode => {
  if (build === null) {
    return (
      <p>
        This page was built from a working copy, not from a released change.
      </p>
    );
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
      This page is one of the squares. It was built from{' '}
      <Commit build={build} />, which went live on{' '}
      <time dateTime={build.committedOn}>
        {formatPostDate(build.committedOn)}
      </time>{' '}
      after its checks passed.{' '}
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
