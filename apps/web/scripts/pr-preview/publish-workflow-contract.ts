// The rules the publish workflow keeps around the production release and the
// tokens that read the chart's data, as checks of the parsed workflow. Checks
// of the workflow's text can't see where a value is: a token moved into the
// environment of a whole job reads the same as one in a single step.

import {
  changesOwners,
  credentialSteps,
  fetchCommand,
  mintAction,
  ownersVariable,
  type Parts,
  partsOf,
  releaseAction,
  sopsAction,
  sopsAgeKey,
  tokensVariable,
} from './publish-workflow-parts';
import { referenceViolations } from './publish-workflow-references';
import {
  at,
  expression,
  keysOf,
  type Step,
  same,
  sorted,
  unless,
} from './workflow-tree';

const canonicalRepository = "github.repository == 'davidvornholt/portfolio'";
const mainRef = "github.ref == 'refs/heads/main'";
const pushOrDispatch =
  "(github.event_name == 'push' || github.event_name == 'workflow_dispatch')";

const triggers = ['pull_request', 'push', 'schedule', 'workflow_dispatch'];
const pullRequestTypes = [
  'opened',
  'synchronize',
  'reopened',
  'ready_for_review',
  'labeled',
  'edited',
];
const jobNames = [
  'container-smoke',
  'daily-dispatch',
  'gate',
  'build',
  'release',
];

// The whole job the schedule runs. It starts this workflow again on main and
// does nothing else.
const dailyDispatchJob = {
  if: `github.event_name == 'schedule' && ${canonicalRepository}`,
  'runs-on': 'ubuntu-latest',
  'timeout-minutes': 5,
  permissions: { actions: 'write' },
  steps: [
    {
      name: 'Start the daily publish on main',
      env: Object.fromEntries([
        ['GH_TOKEN', expression('github.token')],
        ['REPOSITORY', expression('github.repository')],
      ]),
      run: 'gh workflow run publish-container.yml --repo "$REPOSITORY" --ref main',
    },
  ],
};

/**
 * The first step of each job that builds or releases. An `if` compares
 * strings without regard to case, so it also holds on a branch named `Main`.
 * The shell compares exactly.
 */
export const mainBranchCheck = {
  name: 'Require the main branch exactly',
  run: 'test "$GITHUB_REF" = refs/heads/main',
};

// The pull request job runs code from a pull request, so it runs only for a
// labelled pull request of this repository into main and may only read.
const pullRequestCondition = [
  "github.event_name == 'pull_request'",
  "github.event.pull_request.state == 'open'",
  '!github.event.pull_request.draft',
  'github.event.pull_request.base.repo.full_name == github.repository',
  "github.event.pull_request.base.ref == 'main'",
  'github.event.pull_request.head.repo.full_name == github.repository',
  "contains(github.event.pull_request.labels.*.name, 'pr-preview')",
  "(github.event.action != 'labeled' || github.event.label.name == 'pr-preview')",
].join(' && ');

const guardedJobs = ['gate', 'build', 'release'];

const jobRules = [
  {
    name: 'container-smoke',
    if: pullRequestCondition,
    needs: undefined,
    permissions: { contents: 'read' },
  },
  {
    name: 'gate',
    if: `${pushOrDispatch} && ${canonicalRepository} && ${mainRef}`,
    needs: undefined,
    permissions: { actions: 'read' },
  },
  {
    name: 'build',
    if: `${pushOrDispatch} && ${canonicalRepository} && ${mainRef}`,
    needs: undefined,
    permissions: { contents: 'read', packages: 'write' },
  },
  {
    name: 'release',
    if: `${pushOrDispatch} && ${canonicalRepository} && ${mainRef} && needs.gate.outputs.gated-sha == github.sha`,
    needs: ['gate', 'build'],
    permissions: { contents: 'read', 'id-token': 'write', packages: 'write' },
  },
];
const mintInputs = (owner: unknown) => ({
  'client-id': expression('steps.changes-app-client-id.outputs.value'),
  'private-key': expression('steps.changes-app-private-key.outputs.value'),
  owner,
  'permission-actions': 'read',
  'permission-checks': 'read',
  'permission-metadata': 'read',
  'permission-pull-requests': 'read',
  'permission-statuses': 'read',
});

const releaseInputs = {
  unit: 'portfolio',
  host: 'prod-1.vornholt.online',
  'known-host':
    'prod-1.vornholt.online ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIFkom7Y24gnBa9X+gUDBZvlCnXiuKTo87ROOtlMpgNH5',
  images: `portfolio@${expression('needs.build.outputs.digest')}`,
  'age-key': sopsAgeKey,
};

const triggerViolations = (workflow: unknown): ReadonlyArray<string> => [
  ...same('the list of triggers', keysOf(at(workflow, 'on')), sorted(triggers)),
  ...same('on.pull_request', at(workflow, 'on', 'pull_request'), {
    types: pullRequestTypes,
  }),
  ...same('on.push', at(workflow, 'on', 'push'), { branches: ['main'] }),
  ...same('on.schedule', at(workflow, 'on', 'schedule'), [
    { cron: '17 4 * * *' },
  ]),
  ...same(
    'on.workflow_dispatch',
    at(workflow, 'on', 'workflow_dispatch'),
    null,
  ),
  ...same('permissions', at(workflow, 'permissions'), {}),
];

const jobViolations = (workflow: unknown): ReadonlyArray<string> => {
  const jobs = at(workflow, 'jobs');
  return [
    ...same('the list of jobs', keysOf(jobs), sorted(jobNames)),
    ...same(
      'jobs.daily-dispatch',
      at(jobs, 'daily-dispatch'),
      dailyDispatchJob,
    ),
    ...guardedJobs.flatMap((job) =>
      same(`jobs.${job}.steps[0]`, at(jobs, job, 'steps', 0), mainBranchCheck),
    ),
    ...jobRules.flatMap((job) => [
      ...same(`jobs.${job.name}.if`, at(jobs, job.name, 'if'), job.if),
      ...same(`jobs.${job.name}.needs`, at(jobs, job.name, 'needs'), job.needs),
      ...same(
        `jobs.${job.name}.permissions`,
        at(jobs, job.name, 'permissions'),
        job.permissions,
      ),
    ]),
    // A job that calls another workflow could hand it every secret.
    ...keysOf(jobs).flatMap((job) =>
      unless(
        at(jobs, job, 'uses') === undefined &&
          at(jobs, job, 'secrets') === undefined,
        `jobs.${job} calls another workflow`,
      ),
    ),
  ];
};

const stepKeys = ['id', 'name', 'uses', 'with'];

const releasedOrUnchanged =
  "steps.release.outputs.result == 'released' || steps.release.outputs.result == 'unchanged'";

// Every step of the release job, with the keys it may have. A condition or
// `continue-on-error` on a step before the last two would let the job end
// green without a release.
const releaseSteps = [
  { name: mainBranchCheck.name, keys: ['name', 'run'], if: undefined },
  {
    name: 'Checkout the commit being released',
    keys: ['name', 'uses', 'with'],
    if: undefined,
  },
  {
    name: 'Release the gated image to production',
    keys: stepKeys,
    if: undefined,
  },
  {
    name: 'Log in to the GitHub Container Registry',
    keys: ['if', 'name', 'uses', 'with'],
    if: releasedOrUnchanged,
  },
  {
    name: 'Point the main tag at the released image',
    keys: ['env', 'if', 'name', 'run'],
    if: releasedOrUnchanged,
  },
];

const releaseStepViolations = (workflow: unknown): ReadonlyArray<string> => {
  const found = at(workflow, 'jobs', 'release', 'steps');
  const steps: ReadonlyArray<unknown> = Array.isArray(found) ? found : [];
  return [
    ...same(
      'the steps of jobs.release',
      steps.map((step) => at(step, 'name')),
      releaseSteps.map((step) => step.name),
    ),
    ...releaseSteps.flatMap((expected, index) => {
      const path = `jobs.release.steps[${index}]`;
      return [
        ...same(
          `the keys of ${path}`,
          keysOf(steps[index]),
          sorted(expected.keys),
        ),
        ...same(`${path}.if`, at(steps[index], 'if'), expected.if),
      ];
    }),
  ];
};

const credentialViolations = (parts: Parts): ReadonlyArray<string> => [
  ...same(
    'the steps that read a SOPS secret',
    parts.credentials.map((step) => `${step.job}: ${at(step.step, 'id')}`),
    credentialSteps.map((step) => `build: ${step.id}`),
  ),
  ...parts.credentials.flatMap((step) => [
    ...same(`the keys of ${step.path}`, keysOf(step.step), sorted(stepKeys)),
    ...same(`${step.path}.uses`, at(step.step, 'uses'), sopsAction),
    ...same(`${step.path}.with`, at(step.step, 'with'), {
      'age-key': sopsAgeKey,
      'secret-file': 'secrets/ci.yaml',
      'secret-key': `changes_app.${credentialSteps.find((credential) => credential.id === at(step.step, 'id'))?.key}`,
    }),
  ]),
  ...same(
    'the steps that release',
    parts.releases.map((step) => step.job),
    ['release'],
  ),
  ...parts.releases.flatMap((step) => [
    ...same(`${step.path}.uses`, at(step.step, 'uses'), releaseAction),
    ...same(`${step.path}.with`, at(step.step, 'with'), releaseInputs),
  ]),
];

const mintViolations = (parts: Parts): ReadonlyArray<string> => [
  ...parts.mints.flatMap((step) =>
    unless(step.job === 'build', `${step.path} mints an App token`),
  ),
  ...same(
    'the owners the build mints a token for',
    parts.mints
      .filter((step) => step.job === 'build')
      .map((step) => at(step.step, 'with', 'owner')),
    changesOwners,
  ),
  ...parts.mints.flatMap((step) => [
    ...same(`the keys of ${step.path}`, keysOf(step.step), sorted(stepKeys)),
    ...same(`${step.path}.uses`, at(step.step, 'uses'), `${mintAction}@v3`),
    ...same(
      `${step.path}.with`,
      at(step.step, 'with'),
      mintInputs(at(step.step, 'with', 'owner')),
    ),
  ]),
];

const tokenReference = /^\$\{\{ steps\.(?<id>[\w-]+)\.outputs\.token \}\}$/u;

// Each token the fetch is given has to be the one an earlier step of the
// build mints for the owner at the same place of the owners list.
const tokenViolations = (fetch: Step, parts: Parts): ReadonlyArray<string> => {
  const entries = String(at(fetch.step, 'env', tokensVariable) ?? '')
    .split(',')
    .map((entry) => entry.trim());
  return [
    ...same('the number of tokens', entries.length, changesOwners.length),
    ...entries.flatMap((entry, index) => {
      const id = tokenReference.exec(entry)?.groups?.id;
      const mint = parts.mints.find(
        (step) =>
          step.job === fetch.job &&
          step.index < fetch.index &&
          at(step.step, 'id') === id,
      );
      return unless(
        mint !== undefined &&
          at(mint.step, 'with', 'owner') === changesOwners[index],
        `token ${index + 1} of ${fetch.path} is not the token an earlier step mints for ${changesOwners[index]}`,
      );
    }),
  ];
};

const fetchViolations = (parts: Parts): ReadonlyArray<string> => [
  ...same(
    'the steps that fetch the changes',
    parts.fetches.map((step) => step.job),
    ['build'],
  ),
  ...parts.fetches.flatMap((step) => [
    ...same(`the keys of ${step.path}`, keysOf(step.step), [
      'env',
      'name',
      'run',
    ]),
    ...same(`${step.path}.run`, at(step.step, 'run'), fetchCommand),
    ...same(
      `the keys of ${step.path}.env`,
      keysOf(at(step.step, 'env')),
      sorted([tokensVariable, ownersVariable]),
    ),
    ...same(
      `${step.path}.env.${ownersVariable}`,
      at(step.step, 'env', ownersVariable),
      changesOwners.join(','),
    ),
    ...tokenViolations(step, parts),
  ]),
];
/**
 * What `workflow`, the parsed publish workflow, does against its rules. An
 * empty list means it keeps them all.
 */
export const publishWorkflowViolations = (
  workflow: unknown,
): ReadonlyArray<string> => {
  const parts = partsOf(workflow);
  const violations = [
    ...triggerViolations(workflow),
    ...jobViolations(workflow),
    ...releaseStepViolations(workflow),
    ...credentialViolations(parts),
    ...mintViolations(parts),
    ...fetchViolations(parts),
    ...referenceViolations(workflow, parts),
  ];
  return [...new Set(violations)];
};
