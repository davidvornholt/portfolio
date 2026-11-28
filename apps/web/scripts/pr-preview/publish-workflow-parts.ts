import { at, expression, type Step, stepsOf } from './workflow-tree';

/** The owners the build mints a token for, in the order the fetch reads. */
export const changesOwners = [
  'davidvornholt',
  'prosabridge',
  'atrium-schule',
  'fes-kirchheim',
  'cg-bibi',
];

export const sopsAgeKey = expression('secrets.SOPS_AGE_KEY');
export const mintAction = 'actions/create-github-app-token';
export const sopsAction = './.github/actions/sops-secret';
export const releaseAction = './.github/actions/app-release';
export const fetchCommand = 'bun run --cwd apps/web changes:fetch';
export const tokensVariable = 'CHANGES_GITHUB_TOKENS';
export const ownersVariable = 'CHANGES_OWNERS';
export const siteVerdictsVariable = 'CHANGES_SITE_VERDICTS';

export const credentialSteps = [
  { id: 'changes-app-client-id', input: 'client-id', key: 'client_id' },
  { id: 'changes-app-private-key', input: 'private-key', key: 'private_key' },
];

const uses = (step: Step, action: string): boolean =>
  String(at(step.step, 'uses') ?? '').startsWith(action);

// The steps the rules are about, wherever an edit may have put them.
export const partsOf = (workflow: unknown) => {
  const steps = stepsOf(workflow);
  return {
    steps,
    mints: steps.filter((step) => uses(step, mintAction)),
    credentials: steps.filter((step) => uses(step, sopsAction)),
    releases: steps.filter((step) => uses(step, releaseAction)),
    fetches: steps.filter(
      (step) =>
        at(step.step, 'env', tokensVariable) !== undefined ||
        String(at(step.step, 'run') ?? '').includes('changes:fetch'),
    ),
  };
};

export type Parts = ReturnType<typeof partsOf>;
