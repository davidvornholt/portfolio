import snapshot from '../../activity/snapshot.json' with { type: 'json' };
import { ReviewPath } from './review-path';
import { rules, sourceRevision } from './rules';
export const HowIWork = () => (
  <section id="method" className="bg-deep py-16 text-deep-foreground md:py-24">
    <div className="folio-wrap">
      <p className="folio-label mb-4 text-deep-primary">How I work</p>
      <div className="grid gap-6 md:grid-cols-2">
        <h2 className="folio-heading">
          From an issue
          <br />
          to a release.
        </h2>
        <p className="max-w-lg self-end text-deep-muted-foreground text-lg">
          I wrote code by hand for six years before I used AI. Reading both
          editions of Clean Code and studying Design Patterns shaped the
          questions I ask in review. Today I give an agent the problem and the
          constraints. Every change goes through automated checks and review.
        </p>
      </div>
      <ReviewPath />
      <details className="mt-5 border-deep-border border-y">
        <summary className="cursor-pointer py-4 font-medium">
          Inspect five rules that protect this site
        </summary>
        <ol>
          {rules.map((rule) => (
            <li
              key={rule.title}
              className="grid gap-2 border-deep-border border-t py-4 md:grid-cols-2"
            >
              <p>{rule.title}</p>
              <div className="min-w-0">
                <a
                  className="break-all font-mono text-deep-primary text-xs underline"
                  href={`https://github.com/davidvornholt/portfolio/blob/${sourceRevision}/${rule.path}#L${rule.line}`}
                >
                  {rule.path}:{rule.line}
                </a>
                <code className="mt-1 block break-words text-deep-muted-foreground text-xs">
                  {rule.quote}
                </code>
              </div>
            </li>
          ))}
        </ol>
      </details>
      {snapshot.portfolioAllPassed !== null && (
        <p className="mt-3 text-sm">
          {snapshot.portfolioAllPassed} changes I’ve merged in this repository
          since its first change. All passed their checks.
        </p>
      )}
      <div className="mt-8 grid gap-3 md:grid-cols-2">
        <h3 className="font-normal font-serif text-2xl">
          My servers have a source file, too.
        </h3>
        <p className="max-w-lg text-deep-muted-foreground">
          I describe the server I want in code. An agent can read the same
          configuration I do, propose a change, and show me the difference
          before it reaches a running machine. I can rebuild the setup from that
          record.
        </p>
      </div>
    </div>
  </section>
);
