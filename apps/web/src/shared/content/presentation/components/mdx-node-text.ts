import { isValidElement, type ReactNode } from 'react';

export const getMdxNodeText = (node: ReactNode): string => {
  if (typeof node === 'string') {
    return node;
  }
  if (typeof node === 'number') {
    // biome-ignore lint/nursery/noBaseToString: the typeof guard proves this value is a number primitive.
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map(getMdxNodeText).join('');
  }
  if (isValidElement(node)) {
    const props = node.props as { children?: ReactNode };
    return props.children === undefined || props.children === null
      ? ''
      : getMdxNodeText(props.children);
  }
  return '';
};
