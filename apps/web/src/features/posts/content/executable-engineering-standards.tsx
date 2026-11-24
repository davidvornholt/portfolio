import type { Post } from './post-meta';

export const executableEngineeringStandardsPost: Post = {
  meta: {
    title: 'What happens when an agent weakens a rule?',
    slug: 'executable-engineering-standards',
    date: '2026-08-31',
    category: 'Engineering',
    readTime: '2 min read',
    excerpt:
      'I keep one source for the rules my projects share. The repository checks its own copy before it checks my work.',
  },
  body: () => (
    <div className="essay">
      <p>
        I can tell an agent to fix every warning and still get back a clean
        build for the wrong reason. It can change the configuration that defines
        a warning. The next agent inherits that decision without ever seeing the
        conversation.
      </p>
      <h2>Who owns the rule?</h2>
      <p>
        I keep shared rules in a public standards repository. Each project
        records which version it uses. Before the project runs its own tests, a
        separate check compares the shared files with that version. A change to
        a copied rule stops the build.
      </p>
      <p>
        When a rule is genuinely wrong, I change it at the source. The fix
        reaches each project as a reviewable update. When a rule cannot apply to
        one file, I give that file a narrow exception and record the reason
        there.
      </p>
      <h2>What still needs review?</h2>
      <p>
        A compiler can catch a broken contract between a client and a server. It
        cannot tell me whether I chose the right contract for the school office.
        I review those decisions separately, ask for repairs, and run the suite
        on the exact version I intend to land.
      </p>
      <a href="https://github.com/davidvornholt/standards">
        Inspect the shared rules ↗
      </a>
    </div>
  ),
};
