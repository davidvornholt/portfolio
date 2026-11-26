import { describe, expect, it } from 'bun:test';
import { mainBranchCheck } from './publish-workflow-contract';
import {
  type Edit,
  parsedPublishWorkflow,
  stepsOf,
  tree,
  violationsAfter,
} from './publish-workflow-edits';
import { at } from './workflow-tree';

const releaseJobs = ['gate', 'build', 'release'];

// Runs the check the way the runner does, on `ref`. The script is the one
// the contract requires, so this never runs another step of the workflow.
const branchCheck = (ref: string): number =>
  globalThis.Bun.spawnSync(['bash', '-e', '-c', mainBranchCheck.run], {
    env: {
      ...globalThis.Bun.env,
      ...Object.fromEntries([['GITHUB_REF', ref]]),
    },
  }).exitCode;

// An expression compares strings without regard to case, so the `if` of a
// job also holds on a branch named `Main`. The first step compares exactly.
describe('the first step of each job that builds or releases', () => {
  for (const job of releaseJobs) {
    it(`is the exact check of the branch in the ${job} job`, () => {
      expect(at(parsedPublishWorkflow, 'jobs', job, 'steps', 0)).toEqual(
        mainBranchCheck,
      );
    });
  }

  it('passes on the main branch', () => {
    expect(branchCheck('refs/heads/main')).toBe(0);
  });

  it('fails on any other ref', () => {
    for (const ref of [
      'refs/heads/Main',
      'refs/tags/main',
      'refs/heads/main-2',
      '',
    ]) {
      expect(branchCheck(ref)).not.toBe(0);
    }
  });
});

const withoutRepository = (workflow: unknown, job: string): void => {
  const body = tree(workflow, 'jobs', job);
  const condition = " && github.repository == 'davidvornholt/portfolio'";
  if (!String(body.if).includes(condition)) {
    throw new Error(`The ${job} job has no condition on the repository`);
  }
  body.if = String(body.if).replace(condition, '');
};

const guardEdits: ReadonlyArray<Edit> = [
  ...releaseJobs.map(
    (job): Edit => ({
      name: `the ${job} job no longer starts with the exact check of the branch`,
      reports: `jobs.${job}.steps[0] is`,
      apply: (workflow) => {
        stepsOf(workflow, job).shift();
      },
    }),
  ),
  {
    name: 'the build job checks the branch after it has checked out',
    reports: 'jobs.build.steps[0] is',
    apply: (workflow) => {
      const steps = stepsOf(workflow, 'build');
      const [check] = steps.splice(0, 1);
      steps.splice(1, 0, check ?? {});
    },
  },
  {
    name: 'the check of the branch ignores case',
    reports: 'jobs.build.steps[0] is',
    apply: (workflow) => {
      const [check] = stepsOf(workflow, 'build');
      tree(check).run = '[[ "$GITHUB_REF" == refs/heads/[Mm]ain ]]';
    },
  },
  ...['gate', 'build'].map(
    (job): Edit => ({
      name: `the ${job} job no longer requires this repository`,
      reports: `jobs.${job}.if is`,
      apply: (workflow) => withoutRepository(workflow, job),
    }),
  ),
];

describe('publish workflow contract for the guards of a job', () => {
  for (const edit of guardEdits) {
    it(`reports when ${edit.name}`, () => {
      expect(violationsAfter(edit).join('\n')).toContain(edit.reports);
    });
  }
});
