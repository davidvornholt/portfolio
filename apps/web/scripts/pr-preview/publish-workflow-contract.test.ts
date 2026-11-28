import { describe, expect, it } from 'bun:test';
import { publishWorkflowViolations } from './publish-workflow-contract';
import {
  alsoOn,
  type Edit,
  parsedPublishWorkflow,
  stepOf,
  stepsOf,
  tree,
  violationsAfter,
} from './publish-workflow-edits';
import { expression, type Tree } from './workflow-tree';

const tokensVariable = 'CHANGES_GITHUB_TOKENS';
const sopsAgeKey = expression('secrets.SOPS_AGE_KEY');
const firstToken = expression(
  'steps.changes-token-davidvornholt.outputs.token',
);

const mintOf = (workflow: Tree, owner: string): Tree =>
  stepOf(workflow, 'build', `Mint the token that reads ${owner}`);

const fetchOf = (workflow: Tree): Tree =>
  stepOf(workflow, 'build', "Fetch the day's merged changes");

// The edits the reviewers of the text checks found to pass unnoticed.
const reviewedEdits: ReadonlyArray<Edit> = [
  {
    name: 'the tokens move from the fetch step to the env of the whole build job',
    reports: `jobs.build.env.${tokensVariable} holds a minted token outside the env of the step that fetches`,
    apply: (workflow) => {
      const env = tree(fetchOf(workflow), 'env');
      tree(workflow, 'jobs', 'build').env = {
        [tokensVariable]: env[tokensVariable],
      };
      Reflect.deleteProperty(env, tokensVariable);
    },
  },
  {
    name: 'the build job also runs on pull requests',
    reports: 'jobs.build.if is',
    apply: (workflow) => alsoOn(workflow, 'build', 'pull_request'),
  },
  {
    name: 'one mint step asks for contents instead of checks',
    reports: '.with is',
    apply: (workflow) => {
      const inputs = tree(mintOf(workflow, 'prosabridge'), 'with');
      Reflect.deleteProperty(inputs, 'permission-checks');
      inputs['permission-contents'] = 'read';
    },
  },
  {
    name: 'one mint step is renamed and the fetch step still refers to the old id',
    reports: 'is not the token an earlier step mints for atrium-schule',
    apply: (workflow) => {
      mintOf(workflow, 'atrium-schule').id = 'changes-token-renamed';
    },
  },
  ...['gate', 'build', 'release'].map(
    (job): Edit => ({
      name: `the ${job} job also runs on the schedule`,
      reports: `jobs.${job}.if is`,
      apply: (workflow) => alsoOn(workflow, job, 'schedule'),
    }),
  ),
  {
    name: 'the dispatching job is given the key that decrypts the secrets',
    reports: 'jobs.daily-dispatch.steps[0].env.SOPS_AGE_KEY reads a secret',
    apply: (workflow) => {
      const [step] = stepsOf(workflow, 'daily-dispatch');
      tree(step, 'env').SOPS_AGE_KEY = sopsAgeKey;
    },
  },
];

const furtherEdits: ReadonlyArray<Edit> = [
  {
    name: 'the release job mints a token',
    reports: 'mints an App token',
    apply: (workflow) => {
      stepsOf(workflow, 'release').push(
        structuredClone(mintOf(workflow, 'cg-bibi')),
      );
    },
  },
  {
    name: 'the pull request job reads the private key of the App',
    reports: 'the steps that read a SOPS secret is',
    apply: (workflow) => {
      stepsOf(workflow, 'container-smoke').push(
        structuredClone(
          stepOf(
            workflow,
            'build',
            'Resolve the private key of the App that reads the changes',
          ),
        ),
      );
    },
  },
  {
    name: 'a sixth token is minted, with write access',
    reports: 'the owners the build mints a token for is',
    apply: (workflow) => {
      const mint = structuredClone(mintOf(workflow, 'cg-bibi'));
      tree(mint, 'with')['permission-contents'] = 'write';
      stepsOf(workflow, 'build').push(mint);
    },
  },
  {
    name: 'a token leaves the build job as an output',
    reports: 'jobs.build.outputs.token holds a minted token',
    apply: (workflow) => {
      tree(workflow, 'jobs', 'build', 'outputs').token = firstToken;
    },
  },
  {
    name: 'every step output of the build job is written out at once',
    reports: 'reads the steps other than by one named output',
    apply: (workflow) => {
      tree(fetchOf(workflow), 'env').CHANGES_OWNERS =
        expression('toJSON(steps)');
    },
  },
  {
    name: 'the fetch may record verdicts instead of only reading them',
    reports: 'env.CHANGES_SITE_VERDICTS is',
    apply: (workflow) => {
      tree(fetchOf(workflow), 'env').CHANGES_SITE_VERDICTS = 'record';
    },
  },
  {
    name: 'the tokens stand in another order than the owners',
    reports: 'is not the token an earlier step mints for davidvornholt',
    apply: (workflow) => {
      const env = tree(fetchOf(workflow), 'env');
      const [first, second, ...rest] = String(env[tokensVariable]).split(',');
      env[tokensVariable] = [second, first, ...rest].join(',');
    },
  },
  {
    name: 'a failed fetch no longer fails the build',
    reports: 'the keys of jobs.build.steps',
    apply: (workflow) => {
      fetchOf(workflow)['continue-on-error'] = true;
    },
  },
  {
    name: 'the workflow gets another trigger',
    reports: 'the list of triggers is',
    apply: (workflow) => {
      tree(workflow, 'on').pull_request_target = null;
    },
  },
  {
    name: 'the dispatching job does something more',
    reports: 'jobs.daily-dispatch is',
    apply: (workflow) => {
      stepsOf(workflow, 'daily-dispatch').push({ run: 'echo more' });
    },
  },
  {
    name: 'the release reads another key of the secrets file',
    reports: '.with is',
    apply: (workflow) => {
      const release = stepOf(
        workflow,
        'release',
        'Release the gated image to production',
      );
      tree(release, 'with')['ssh-key-path'] = 'ci.changes_app.private_key';
    },
  },
  {
    name: 'the broker App comes back',
    reports: 'names the broker App',
    apply: (workflow) => {
      tree(fetchOf(workflow), 'env').BROKER = 'ci.broker_app.private_key';
    },
  },
];

describe('publish workflow contract', () => {
  it('holds for the workflow as it is', () => {
    expect(publishWorkflowViolations(parsedPublishWorkflow)).toEqual([]);
  });

  for (const edit of [...reviewedEdits, ...furtherEdits]) {
    it(`reports when ${edit.name}`, () => {
      expect(violationsAfter(edit).join('\n')).toContain(edit.reports);
    });
  }
});
