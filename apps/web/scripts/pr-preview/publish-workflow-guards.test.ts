import { describe, expect, it } from 'bun:test';
import { mainBranchCheck } from './publish-workflow-contract';
import {
  alsoOn,
  type Edit,
  parsedPublishWorkflow,
  stepOf,
  stepsOf,
  tree,
  violationsAfter,
} from './publish-workflow-edits';
import { at, expression, type Tree } from './workflow-tree';

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

const releaseStep = (workflow: Tree, name: string): Tree =>
  stepOf(workflow, 'release', name);

// A release step that is skipped leaves the job green and production on
// yesterday's chart.
const releaseStepEdits: ReadonlyArray<Edit> = [
  {
    name: 'the release runs only on a push, so a daily publish skips it',
    reports: 'the keys of jobs.release.steps[2] is',
    apply: (workflow) => {
      releaseStep(workflow, 'Release the gated image to production').if =
        "github.event_name == 'push'";
    },
  },
  {
    name: 'the checkout of the release may fail without failing the job',
    reports: 'the keys of jobs.release.steps[1] is',
    apply: (workflow) => {
      releaseStep(workflow, 'Checkout the commit being released')[
        'continue-on-error'
      ] = true;
    },
  },
  {
    name: 'the login after the release runs on another condition',
    reports: 'jobs.release.steps[3].if is',
    apply: (workflow) => {
      releaseStep(workflow, 'Log in to the GitHub Container Registry').if =
        "steps.release.outputs.result == 'released'";
    },
  },
  {
    name: 'the main tag moves whatever the release reported',
    reports: 'the keys of jobs.release.steps[4] is',
    apply: (workflow) => {
      Reflect.deleteProperty(
        releaseStep(workflow, 'Point the main tag at the released image'),
        'if',
      );
    },
  },
  {
    name: 'the release job gets another step',
    reports: 'the steps of jobs.release is',
    apply: (workflow) => {
      stepsOf(workflow, 'release').push({ name: 'More', run: 'echo more' });
    },
  },
];

const pullRequestJobEdits: ReadonlyArray<Edit> = [
  {
    name: 'the pull request job also runs on the schedule',
    reports: 'jobs.container-smoke.if is',
    apply: (workflow) => alsoOn(workflow, 'container-smoke', 'schedule'),
  },
  {
    name: 'the pull request job may write checks',
    reports: 'jobs.container-smoke.permissions is',
    apply: (workflow) => {
      tree(workflow, 'jobs', 'container-smoke', 'permissions').checks = 'write';
    },
  },
];

const buildLine = (workflow: Tree): Tree =>
  tree(stepOf(workflow, 'build', 'Write the build line of the release'), 'env');

// The runner looks up `steps`, `secrets` and the id of a step without regard
// to case, so a reference in other letters reads the same value.
const mixedCaseEdits: ReadonlyArray<Edit> = [
  {
    name: 'another step reads a minted token in other letters',
    reports: 'holds a minted token outside the env of the step that fetches',
    apply: (workflow) => {
      buildLine(workflow).LEAK = expression(
        'STEPS.changes-token-prosabridge.OUTPUTS.token',
      );
    },
  },
  {
    name: 'another step reads the private key of the App in other letters',
    reports: 'holds a credential of the App outside a step that mints a token',
    apply: (workflow) => {
      buildLine(workflow).LEAK = expression(
        'Steps.CHANGES-APP-PRIVATE-KEY.Outputs.value',
      );
    },
  },
  {
    name: 'every step output is written out at once in other letters',
    reports: 'reads the steps other than by one named output',
    apply: (workflow) => {
      buildLine(workflow).LEAK = expression('toJSON(STEPS)');
    },
  },
  {
    name: 'the dispatching job reads a secret in other letters',
    reports: 'jobs.daily-dispatch.steps[0].env.LEAK reads a secret',
    apply: (workflow) => {
      const [step] = stepsOf(workflow, 'daily-dispatch');
      tree(step, 'env').LEAK = expression('SECRETS.SOPS_AGE_KEY');
    },
  },
];

describe('publish workflow contract for the guards of a job', () => {
  for (const edit of [
    ...guardEdits,
    ...releaseStepEdits,
    ...pullRequestJobEdits,
    ...mixedCaseEdits,
  ]) {
    it(`reports when ${edit.name}`, () => {
      expect(violationsAfter(edit).join('\n')).toContain(edit.reports);
    });
  }
});
