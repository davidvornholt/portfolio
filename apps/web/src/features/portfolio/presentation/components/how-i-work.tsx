import snapshot from '../../activity/snapshot.json' with { type: 'json' };
import { ReviewPath } from './review-path';
import { rules, sourceRevision } from './rules';
export const HowIWork = () => (
  <section id="method" className="bg-deep py-10 text-deep-foreground md:py-14">
    <div className="folio-wrap">
      <div className="edition-line border-current border-b pb-3">
        <span>Engineering practice</span>
        <span>Review &amp; repair</span>
      </div>
      <div className="method-spread">
        <div className="method-intro">
          <h2 className="folio-heading">
            Before I <br />
            sign off.
          </h2>
          <p>
            I wrote code by hand for six years before I used AI. Today an agent
            can draft a repair. I still have to decide whether it solves the
            problem.
          </p>
          <p>
            Reading both editions of Clean Code and studying Design Patterns
            shaped how I review a change. Here’s one repair I took through to
            release.
          </p>
        </div>
        <ReviewPath />
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
