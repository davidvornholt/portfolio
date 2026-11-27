import {
  credentialSteps,
  type Parts,
  sopsAgeKey,
  tokensVariable,
} from './publish-workflow-parts';
import { at, type Leaf, leavesOf, type Step, unless } from './workflow-tree';

// The runner looks up `steps`, `secrets`, `outputs` and the id of a step
// without regard to case, so the patterns and the ids ignore case too.
const expressionPattern = /\$\{\{(?<body>.*?)\}\}/gsu;
const stepReference =
  /\bsteps\.(?<id>[\w-]+)\.(?:outputs\.[\w-]+|outcome|conclusion)\b/giu;
// `steps` read in any other way, such as `toJSON(steps)` or `steps.*`, which
// would reach a token without naming its step.
const otherUseOfSteps =
  /\bsteps\b(?!\.[\w-]+\.(?:outputs\.[\w-]+|outcome|conclusion)\b)/iu;
const useOfSecrets = /\bsecrets\s*(?:\.|\[|\))/iu;
const jobOfPath = /^jobs\.(?<job>[\w-]+)\./u;

// The expressions a string holds. An `if` is an expression as a whole.
const expressionsOf = (leaf: Leaf): ReadonlyArray<string> =>
  leaf.path.endsWith('.if')
    ? [leaf.text]
    : [...leaf.text.matchAll(expressionPattern)].map(
        (match) => match.groups?.body ?? '',
      );

// Where each guarded value may stand: in the steps of the one job that may
// hold it. Anywhere else is a violation.
const placesOf = (parts: Parts) => {
  const ids = (steps: ReadonlyArray<Step>): ReadonlyArray<string> =>
    steps.map((step) => String(at(step.step, 'id') ?? '').toLowerCase());
  const paths = (steps: ReadonlyArray<Step>, job: string, suffix: string) =>
    steps
      .filter((step) => step.job === job)
      .map((step) => `${step.path}.${suffix}`);
  return {
    stepIds: (job: string) =>
      ids(parts.steps.filter((step) => step.job === job)),
    mintIds: ids(parts.mints),
    tokens: paths(parts.fetches, 'build', `env.${tokensVariable}`),
    credentialOf: (id: string) =>
      paths(
        parts.mints,
        'build',
        `with.${credentialSteps.find((step) => step.id === id)?.input}`,
      ),
    secrets: [
      ...paths(parts.credentials, 'build', 'with.age-key'),
      ...paths(parts.releases, 'release', 'with.age-key'),
    ],
    credentialKeys: paths(parts.credentials, 'build', 'with.secret-key'),
  };
};

type Places = ReturnType<typeof placesOf>;

const stepReferenceViolations = (
  leaf: Leaf,
  places: Places,
): ReadonlyArray<string> => {
  const job = jobOfPath.exec(leaf.path)?.groups?.job ?? '';
  return expressionsOf(leaf).flatMap((body) => [
    ...unless(
      !otherUseOfSteps.test(body),
      `${leaf.path} reads the steps other than by one named output`,
    ),
    ...[...body.matchAll(stepReference)].flatMap((match) => {
      const id = (match.groups?.id ?? '').toLowerCase();
      const isCredential = credentialSteps.some((step) => step.id === id);
      return [
        ...unless(
          places.stepIds(job).includes(id),
          `${leaf.path} refers to the step ${id}, which its job doesn't have`,
        ),
        ...unless(
          !isCredential || places.credentialOf(id).includes(leaf.path),
          `${leaf.path} holds a credential of the App outside a step that mints a token`,
        ),
        ...unless(
          !places.mintIds.includes(id) || places.tokens.includes(leaf.path),
          `${leaf.path} holds a minted token outside the env of the step that fetches`,
        ),
      ];
    }),
  ]);
};

/**
 * Where a secret, a credential of the App or a minted token stands outside
 * the one place it may.
 */
export const referenceViolations = (
  workflow: unknown,
  parts: Parts,
): ReadonlyArray<string> => {
  const places = placesOf(parts);
  return leavesOf(workflow, '').flatMap((leaf) => [
    ...stepReferenceViolations(leaf, places),
    ...unless(
      !useOfSecrets.test(leaf.text) ||
        (leaf.text === sopsAgeKey && places.secrets.includes(leaf.path)),
      `${leaf.path} reads a secret`,
    ),
    ...unless(
      !leaf.text.includes('broker_app'),
      `${leaf.path} names the broker App`,
    ),
    ...unless(
      !leaf.text.includes('changes_app') ||
        places.credentialKeys.includes(leaf.path),
      `${leaf.path} names the App that reads the changes`,
    ),
  ]);
};
