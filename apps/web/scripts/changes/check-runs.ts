import type { DateTime } from 'effect';
import type {
  CheckOutcome,
  CheckRun,
} from '@/features/changes/services/verdict';

/** One entry of a commit's check list as GitHub's GraphQL API returns it. */
export type CheckContext =
  | Readonly<{
      __typename: 'CheckRun';
      name: string;
      conclusion: string | null;
      startedAt: DateTime.Utc | null;
      completedAt: DateTime.Utc | null;
      checkSuite: Readonly<{
        app: Readonly<{ slug: string }> | null;
        workflowRun: Readonly<{
          workflow: Readonly<{ name: string }>;
        }> | null;
      }> | null;
    }>
  | Readonly<{
      __typename: 'StatusContext';
      context: string;
      state: string;
      createdAt: DateTime.Utc;
    }>;

// A check that asks for action has finished without passing, and GitHub
// holds a merge back for it as it does for a failure.
const failedConclusions: ReadonlySet<string> = new Set([
  'FAILURE',
  'TIMED_OUT',
  'STARTUP_FAILURE',
  'ACTION_REQUIRED',
]);
const failedStates: ReadonlySet<string> = new Set(['FAILURE', 'ERROR']);
const unfinishedStates: ReadonlySet<string> = new Set(['PENDING', 'EXPECTED']);

const outcomeOf = (
  result: string | null,
  failed: ReadonlySet<string>,
): CheckOutcome => {
  if (result === 'SUCCESS') {
    return 'passed';
  }
  return result !== null && failed.has(result) ? 'failed' : 'neutral';
};

const toCheckRun = (context: CheckContext): ReadonlyArray<CheckRun> => {
  if (context.__typename === 'StatusContext') {
    // A commit status has no duration: it reports its result when it is
    // created, unless it only announces a result that is still to come.
    return [
      {
        check: `status:${context.context}`,
        label: context.context,
        startedAt: context.createdAt,
        finishedAt: unfinishedStates.has(context.state)
          ? undefined
          : context.createdAt,
        outcome: outcomeOf(context.state, failedStates),
      },
    ];
  }
  const startedAt = context.startedAt ?? context.completedAt;
  if (startedAt === null) {
    // Queued and never started, so it cannot have finished before the merge.
    return [];
  }
  const workflow = context.checkSuite?.workflowRun?.workflow.name;
  const app = context.checkSuite?.app?.slug ?? '';
  return [
    {
      check: `run:${app}/${workflow ?? ''}/${context.name}`,
      label:
        workflow === undefined ? context.name : `${workflow} / ${context.name}`,
      startedAt,
      finishedAt: context.completedAt ?? undefined,
      outcome: outcomeOf(context.conclusion, failedConclusions),
    },
  ];
};

/**
 * Turns a commit's check list into check runs. Runs of the same job in the
 * same workflow share one `check`, so a later run replaces an earlier one.
 */
export const toCheckRuns = (
  contexts: ReadonlyArray<CheckContext>,
): ReadonlyArray<CheckRun> => contexts.flatMap(toCheckRun);
