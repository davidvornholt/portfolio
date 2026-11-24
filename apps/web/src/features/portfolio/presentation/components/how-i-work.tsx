import snapshot from '../../activity/snapshot.json' with { type: 'json' };
import { ReviewPath } from './review-path';
import { rules, sourceRevision } from './rules';
export const HowIWork = () => (
  <section id="method" className="film-ground py-12 md:py-20">
    <div className="folio-wrap">
      <div className="method-heading">
        <p className="credit-label">
          <span className="cue" />
          Engineering · Standards #598
        </p>
        <h2>When access should end.</h2>
      </div>
      <ReviewPath />
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        <h3 className="font-normal font-serif text-2xl">
          How I review software
        </h3>
        <p className="max-w-lg text-deep-muted-foreground">
          I wrote code by hand for six years before using AI. Both editions of
          Clean Code and the examples in Design Patterns shaped how I read a
          change. Today I give agents the constraints. Every change goes through
          automated checks and review.
        </p>
      </div>
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
