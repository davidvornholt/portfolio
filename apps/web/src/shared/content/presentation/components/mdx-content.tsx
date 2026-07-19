'use client';

import type { ReactNode } from 'react';
// biome-ignore lint/performance/noNamespaceImport: Velite's generated function expects the complete JSX runtime object.
import * as runtime from 'react/jsx-runtime';
import { mdxComponents } from './mdx-components';

type MDXContentProps = Readonly<{
  code: string;
}>;

type MDXComponent = React.ComponentType<{
  components?: Record<string, React.ComponentType<unknown>>;
}>;

const useMDXComponent = (code: string): MDXComponent => {
  // biome-ignore lint/nursery/noImpliedEval: Velite emits this trusted compiled MDX function at build time.
  const fn = new Function(code);
  return fn({ ...runtime }).default;
};

export const MDXContent = ({ code }: MDXContentProps): ReactNode => {
  const Component = useMDXComponent(code);
  return (
    <Component
      components={mdxComponents as Record<string, React.ComponentType<unknown>>}
    />
  );
};
