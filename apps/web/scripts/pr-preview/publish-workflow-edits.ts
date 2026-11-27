import { publishWorkflowViolations } from './publish-workflow-contract';
import { readWorkflow } from './workflow-test-helpers';
import { at, isTree, type Tree } from './workflow-tree';

// What the tests of the publish workflow's contract share: the parsed
// workflow and the means to edit a copy of it.

export const parsedPublishWorkflow: unknown = globalThis.Bun.YAML.parse(
  await readWorkflow('publish-container.yml'),
);

// The mapping at `path`. An edit that can't find what it changes throws, so
// a case can't pass because its edit did nothing.
export const tree = (
  value: unknown,
  ...path: ReadonlyArray<string | number>
): Tree => {
  const found = at(value, ...path);
  if (!isTree(found)) {
    throw new Error(`No mapping at ${path.join('.')}`);
  }
  return found;
};

export const stepsOf = (workflow: Tree, job: string): Array<Tree> => {
  const steps = at(workflow, 'jobs', job, 'steps');
  if (!Array.isArray(steps)) {
    throw new Error(`No steps in ${job}`);
  }
  return steps;
};

export const stepOf = (workflow: Tree, job: string, name: string): Tree => {
  const step = stepsOf(workflow, job).find((entry) => entry.name === name);
  if (step === undefined) {
    throw new Error(`No step "${name}" in ${job}`);
  }
  return step;
};

export const alsoOn = (workflow: Tree, job: string, event: string): void => {
  const body = tree(workflow, 'jobs', job);
  body.if = `${String(body.if)} || github.event_name == '${event}'`;
};

/** One edit of the workflow and a part of the violation it has to produce. */
export type Edit = Readonly<{
  name: string;
  reports: string;
  apply: (workflow: Tree) => void;
}>;

export const violationsAfter = (edit: Edit): ReadonlyArray<string> => {
  const copy = structuredClone(parsedPublishWorkflow);
  if (!isTree(copy)) {
    throw new Error('The workflow is not a mapping');
  }
  edit.apply(copy);
  return publishWorkflowViolations(copy);
};
