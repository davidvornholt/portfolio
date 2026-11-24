import snapshot from '../../activity/snapshot.json' with { type: 'json' };
import { ReviewPath } from './review-path';
import { rules, sourceRevision } from './rules';
export const HowIWork = () => (
  <section id="method" className="method-section py-12 md:py-18">
    <div className="folio-wrap">
      <div className="section-sign">
        <span className="line-symbol key-method">M</span>
        <h2>How I work</h2>
      </div>
      <div className="method-grid">
        <div>
          <h3 className="method-title">From an issue to a release.</h3>
          <p className="mt-5 max-w-md text-lg">
            I wrote code by hand for six years before I used AI. Today I give an
            agent a problem, then check its work. Follow a real repair through
            my review loop.
          </p>
          <p className="mt-4 max-w-md text-muted-foreground">
            Reading both editions of <i>Clean Code</i> and studying{' '}
            <i>Design Patterns</i> shaped the questions I ask. Every change goes
            through automated checks and review.
          </p>
        </div>
        <ReviewPath />
      </div>
      <details className="mt-5 border-border border-y">
        <summary className="cursor-pointer py-4 font-medium">
          Inspect five rules that protect this site
        </summary>
        <ol>
          {rules.map((rule) => (
            <li
              key={rule.title}
              className="grid gap-2 border-border border-t py-4 md:grid-cols-2"
            >
              <p>{rule.title}</p>
              <div className="min-w-0">
                <a
                  className="break-all font-mono text-primary text-xs underline"
                  href={`https://github.com/davidvornholt/portfolio/blob/${sourceRevision}/${rule.path}#L${rule.line}`}
                >
                  {rule.path}:{rule.line}
                </a>
                <code className="mt-1 block break-words text-muted-foreground text-xs">
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
        <p className="max-w-lg text-muted-foreground">
          I describe the server I want in code. An agent can read the same
          configuration I do, propose a change, and show me the difference
          before it reaches a running machine. I can rebuild the setup from that
          record.
        </p>
      </div>
    </div>
  </section>
);
