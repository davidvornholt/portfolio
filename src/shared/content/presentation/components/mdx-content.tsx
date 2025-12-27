'use client';

import type { ReactNode } from 'react';
// skipcq: JS-C1003
import * as runtime from 'react/jsx-runtime';
import { mdxComponents } from './mdx-components';

type MDXContentProps = Readonly<{
  code: string;
}>;

type MDXComponent = React.ComponentType<{
  components?: Record<string, React.ComponentType<unknown>>;
}>;

const useMDXComponent = (code: string): MDXComponent => {
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
