import { describe, expect, it } from 'bun:test';
import { getMdxNodeText } from './mdx-node-text';

const examplePort = 3000;

describe('getMdxNodeText', () => {
  it('extracts text from the nested nodes emitted by MDX', () => {
    const node = (
      <>
        01 <strong>The</strong> <em>architecture</em>
      </>
    );

    expect(getMdxNodeText(node)).toBe('01 The architecture');
  });

  it('preserves numeric code content and ignores empty nodes', () => {
    expect(getMdxNodeText(['port: ', examplePort, null, undefined])).toBe(
      'port: 3000',
    );
  });
});
