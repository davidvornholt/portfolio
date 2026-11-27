import { isDeepStrictEqual } from 'node:util';

// Reading a parsed workflow as a tree of mappings, lists and strings.

export type Tree = Record<string, unknown>;

export const isTree = (value: unknown): value is Tree =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

/** The value at `path` of a parsed document, or undefined if nothing is there. */
export const at = (
  value: unknown,
  ...path: ReadonlyArray<string | number>
): unknown =>
  path.reduce<unknown>((current, key) => {
    if (Array.isArray(current)) {
      return typeof key === 'number' ? current[key] : undefined;
    }
    return isTree(current) ? current[String(key)] : undefined;
  }, value);

export const expression = (text: string): string => `\${{ ${text} }}`;

export type Step = Readonly<{
  job: string;
  index: number;
  path: string;
  step: Tree;
}>;
export type Leaf = Readonly<{ path: string; text: string }>;

export const stepsOf = (workflow: unknown): ReadonlyArray<Step> => {
  const jobs = at(workflow, 'jobs');
  return Object.entries(isTree(jobs) ? jobs : {}).flatMap(([job, body]) => {
    const steps = at(body, 'steps');
    return (Array.isArray(steps) ? steps : []).flatMap((step, index) =>
      isTree(step)
        ? [{ job, index, path: `jobs.${job}.steps[${index}]`, step }]
        : [],
    );
  });
};

// Every string of the document with where it stands.
export const leavesOf = (value: unknown, path: string): ReadonlyArray<Leaf> => {
  if (typeof value === 'string') {
    return [{ path, text: value }];
  }
  if (Array.isArray(value)) {
    return value.flatMap((entry, index) =>
      leavesOf(entry, `${path}[${index}]`),
    );
  }
  return Object.entries(isTree(value) ? value : {}).flatMap(([key, entry]) =>
    leavesOf(entry, path === '' ? key : `${path}.${key}`),
  );
};

export const unless = (
  holds: boolean,
  violation: string,
): ReadonlyArray<string> => (holds ? [] : [violation]);

export const same = (
  what: string,
  actual: unknown,
  expected: unknown,
): ReadonlyArray<string> =>
  unless(
    isDeepStrictEqual(actual, expected),
    `${what} is ${JSON.stringify(actual)}, not ${JSON.stringify(expected)}`,
  );

export const sorted = (values: ReadonlyArray<string>): ReadonlyArray<string> =>
  values.toSorted((a, b) => a.localeCompare(b));

export const keysOf = (value: unknown): ReadonlyArray<string> =>
  sorted(Object.keys(isTree(value) ? value : {}));
