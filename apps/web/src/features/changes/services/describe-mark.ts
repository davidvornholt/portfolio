import type { Snapshot } from './snapshot';

/** A square of the chart: a change that went live or an attempt sent back. */
export type MarkAddress = Readonly<{
  date: string;
  kind: 'change' | 'attempt';
  /** The mark's place among the day's changes or attempts. */
  position: number;
}>;

export type MarkDescription = Readonly<{
  /** What happened, in a few plain words. */
  verdict: string;
  /** The key that explains the square: passed, failed, unchecked or caught. */
  key: 'passed' | 'failed' | 'unchecked' | 'caught';
  project: string;
  title: string | undefined;
  /** More on a failed check or a sent-back attempt. */
  reason: string | undefined;
  linesChanged: number | undefined;
  href: string | undefined;
}>;

const privateProject = 'A private project';

const failedCheckInPlainWords = (checks: ReadonlyArray<string>): string => {
  if (checks.some((check) => check.toLowerCase().includes('preview'))) {
    return 'The preview deployment had failed.';
  }
  if (checks.some((check) => check.startsWith('testing-farm'))) {
    return 'A test run on Fedora had failed, and the project’s maintainers merged the change.';
  }
  const [first] = checks;
  return first === undefined
    ? 'A check had failed.'
    : `The check “${first}” had failed.`;
};

const verdicts = {
  passed: 'Its checks had passed',
  failed: 'It went live with a failed check',
  unchecked: 'No check had finished',
} as const;

/**
 * Says what one square stands for. Undefined when the snapshot has no such
 * mark, which happens only if the page and the snapshot are out of step.
 */
export const describeMark = (
  snapshot: Snapshot,
  address: MarkAddress,
): MarkDescription | undefined => {
  const day = snapshot.days.find((entry) => entry.date === address.date);
  if (address.kind === 'attempt') {
    const attempt = day?.sentBack[address.position];
    return attempt === undefined
      ? undefined
      : {
          verdict: 'Sent back by the checks',
          key: 'caught',
          project: attempt.source?.repository ?? privateProject,
          title: attempt.source?.title,
          reason:
            attempt.source === null
              ? undefined
              : `The “${attempt.source.workflow}” checks failed.`,
          linesChanged: undefined,
          href: attempt.source?.url,
        };
  }
  const change = day?.changes[address.position];
  return change === undefined
    ? undefined
    : {
        verdict: verdicts[change.verdict],
        key: change.verdict,
        project: change.source?.repository ?? privateProject,
        title: change.source?.title,
        reason:
          change.verdict === 'failed'
            ? failedCheckInPlainWords(change.source.failedChecks)
            : undefined,
        linesChanged: change.linesChanged,
        href: change.source?.url,
      };
};
