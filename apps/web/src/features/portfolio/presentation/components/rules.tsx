import type { ReactNode } from 'react';
import { type QuotedRule, quotedRules } from './quoted-rules';
import { Section, textLinkClassName } from './section';

const repositoryPath = (rule: QuotedRule): string =>
  rule.firstLine === rule.lastLine
    ? `${rule.path}, line ${rule.firstLine}`
    : `${rule.path}, lines ${rule.firstLine} to ${rule.lastLine}`;

const whitespacePattern = /(\s+)/u;

// A word of code stays whole when a line wraps. Otherwise the browser breaks
// after any hyphen, and `--error-on-warnings` ends one line with a dash.
const Words = ({ text }: { readonly text: string }): ReactNode =>
  text.split(whitespacePattern).map((part, position) =>
    part.trim() === '' ? (
      part
    ) : (
      <span
        // biome-ignore lint/suspicious/noArrayIndexKey: the words of a fixed quote never reorder, and a word can repeat.
        key={position}
        className="wrap-anywhere inline-block max-w-full"
      >
        {part}
      </span>
    ),
  );

// The quoted code with the part that enforces the rule marked.
const Code = ({ rule }: { readonly rule: QuotedRule }): ReactNode => {
  const start = rule.code.indexOf(rule.emphasis);
  return (
    <pre className="mt-2 whitespace-pre-wrap font-mono text-muted-foreground text-sm leading-relaxed">
      <Words text={rule.code.slice(0, start)} />
      <mark className="bg-transparent font-medium text-foreground underline decoration-2 underline-offset-4">
        <Words text={rule.emphasis} />
      </mark>
      <Words text={rule.code.slice(start + rule.emphasis.length)} />
    </pre>
  );
};

/**
 * Five rules of this repository, each in plain words beside the line that
 * enforces it. `record` is the sentence under the table, which the page shows
 * only while every change to this repository passed its checks.
 */
export const Rules = ({
  record,
}: {
  readonly record: ReactNode;
}): ReactNode => (
  <Section
    id="rules"
    heading="Every rule is written twice"
    lede="Once in plain words for people, and once in code for the machine. These are five rules from the project this site is built from, each next to the line that enforces it."
  >
    <div className="mt-10 md:mt-13">
      <div
        aria-hidden="true"
        className="hidden pb-3 font-semibold text-muted-foreground text-sm md:grid md:grid-cols-13"
      >
        <span className="md:col-span-6">In plain words</span>
        <span className="md:col-span-7 md:pl-8">In this site’s code</span>
      </div>
      <ul>
        {quotedRules.map((rule) => (
          <li
            key={rule.plain}
            className="grid border-foreground border-t-2 md:grid-cols-13"
          >
            <p className="max-w-lg py-6 font-bold text-xl leading-snug tracking-tight md:col-span-6 md:py-8 md:pr-12 md:text-2xl">
              {rule.plain}
            </p>
            <div className="min-w-0 bg-muted px-5 py-5 md:col-span-7 md:px-8 md:py-7">
              <p className="text-muted-foreground text-sm">
                {repositoryPath(rule)}
              </p>
              <Code rule={rule} />
            </div>
          </li>
        ))}
      </ul>
    </div>
    <p className="mt-6 text-muted-foreground">
      {record}{' '}
      <a
        href="https://github.com/davidvornholt/standards"
        target="_blank"
        rel="noopener noreferrer"
        data-umami-event="standards-open"
        className={`${textLinkClassName} text-foreground`}
      >
        Read the full rulebook on GitHub
      </a>
    </p>
  </Section>
);
