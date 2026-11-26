import { Schema } from 'effect';
import { GraphQL, GraphQLGroup } from 'effect/graphql';

const Instant = Schema.DateTimeUtcFromString;

const CheckContext = Schema.Union([
  Schema.Struct({
    __typename: Schema.Literal('CheckRun'),
    name: Schema.String,
    conclusion: Schema.NullOr(Schema.String),
    startedAt: Schema.NullOr(Instant),
    completedAt: Schema.NullOr(Instant),
    checkSuite: Schema.NullOr(
      Schema.Struct({
        app: Schema.NullOr(Schema.Struct({ slug: Schema.String })),
        workflowRun: Schema.NullOr(
          Schema.Struct({
            workflow: Schema.Struct({ name: Schema.String }),
          }),
        ),
      }),
    ),
  }),
  Schema.Struct({
    __typename: Schema.Literal('StatusContext'),
    context: Schema.String,
    state: Schema.String,
    createdAt: Instant,
  }),
]);

const PageInfo = Schema.Struct({
  hasNextPage: Schema.Boolean,
  endCursor: Schema.NullOr(Schema.String),
});

const CheckContexts = Schema.Struct({
  totalCount: Schema.Int,
  pageInfo: PageInfo,
  nodes: Schema.NullOr(Schema.Array(Schema.NullOr(CheckContext))),
});

const finalCommit = {
  commits: Schema.Struct({
    nodes: Schema.NullOr(
      Schema.Array(
        Schema.NullOr(
          Schema.Struct({
            commit: Schema.Struct({
              id: Schema.String,
              oid: Schema.String,
              statusCheckRollup: Schema.NullOr(
                Schema.Struct({ contexts: CheckContexts }),
              ),
            }),
          }),
        ),
      ),
    ),
  }),
};

const size = {
  mergedAt: Instant,
  additions: Schema.Int,
  deletions: Schema.Int,
};

const PublicPullRequest = Schema.Struct({
  ...size,
  ...finalCommit,
  number: Schema.Int,
  title: Schema.String,
  url: Schema.String,
  repository: Schema.Struct({
    databaseId: Schema.Int,
    nameWithOwner: Schema.String,
  }),
});

// The private query asks for nothing that names the change or its
// repository, so a private name or title never leaves GitHub.
const PrivatePullRequest = Schema.Struct({
  ...size,
  ...finalCommit,
  repository: Schema.Struct({ databaseId: Schema.Int }),
});

const searchResult = <Node extends Schema.Top>(node: Node) =>
  Schema.Struct({
    search: Schema.Struct({
      issueCount: Schema.Int,
      pageInfo: PageInfo,
      nodes: Schema.NullOr(Schema.Array(Schema.NullOr(node))),
    }),
  });

const pagedSearch = {
  query: Schema.String,
  after: Schema.optional(Schema.NullOr(Schema.String)),
};

// Every list is asked for its length (`totalCount`, and `issueCount` for a
// search) together with each page, so a list that arrives short is noticed.
const contextSelection =
  'totalCount pageInfo{hasNextPage endCursor}nodes{__typename ...on CheckRun{name conclusion startedAt completedAt checkSuite{app{slug}workflowRun{workflow{name}}}}...on StatusContext{context state createdAt}}';
const sharedSelection = `mergedAt additions deletions commits(last:1){nodes{commit{id oid statusCheckRollup{contexts(first:100){${contextSelection}}}}}}`;
const searchDocument = (name: string, selection: string): string =>
  `query ${name}($query:String!,$after:String){search(query:$query,type:ISSUE,first:25,after:$after){issueCount pageInfo{hasNextPage endCursor}nodes{...on PullRequest{${selection}}}}}`;

export const countMergedChanges = GraphQL.query('countMergedChanges', {
  document:
    'query countMergedChanges($query:String!){search(query:$query,type:ISSUE,first:1){issueCount}}',
  variables: { query: Schema.String },
  result: Schema.Struct({
    search: Schema.Struct({ issueCount: Schema.Int }),
  }),
});

export const publicMergedChanges = GraphQL.query('publicMergedChanges', {
  document: searchDocument(
    'publicMergedChanges',
    `number title url repository{databaseId nameWithOwner} ${sharedSelection}`,
  ),
  variables: pagedSearch,
  result: searchResult(PublicPullRequest),
});

export const privateMergedChanges = GraphQL.query('privateMergedChanges', {
  document: searchDocument(
    'privateMergedChanges',
    `repository{databaseId} ${sharedSelection}`,
  ),
  variables: pagedSearch,
  result: searchResult(PrivatePullRequest),
});

// Every repository a change merged into, with what the token's owner may do
// there: `READ` on a public repository means it belongs to someone else.
export const mergedRepositories = GraphQL.query('mergedRepositories', {
  document:
    'query mergedRepositories($query:String!,$after:String){search(query:$query,type:ISSUE,first:100,after:$after){issueCount pageInfo{hasNextPage endCursor}nodes{...on PullRequest{repository{nameWithOwner viewerPermission}}}}}',
  variables: pagedSearch,
  result: searchResult(
    Schema.Struct({
      repository: Schema.Struct({
        nameWithOwner: Schema.String,
        viewerPermission: Schema.NullOr(Schema.String),
      }),
    }),
  ),
});

/** The rest of a commit's check list when it has more than one page. */
export const commitChecks = GraphQL.query('commitChecks', {
  document: `query commitChecks($commit:ID!,$after:String){node(id:$commit){...on Commit{statusCheckRollup{contexts(first:100,after:$after){${contextSelection}}}}}}`,
  variables: {
    commit: Schema.String,
    after: Schema.optional(Schema.NullOr(Schema.String)),
  },
  result: Schema.Struct({
    node: Schema.NullOr(
      Schema.Struct({
        statusCheckRollup: Schema.optional(
          Schema.NullOr(Schema.Struct({ contexts: CheckContexts })),
        ),
      }),
    ),
  }),
});

export const operations = GraphQLGroup.make(
  countMergedChanges,
  publicMergedChanges,
  privateMergedChanges,
  mergedRepositories,
  commitChecks,
);

export type PublicPullRequestNode = typeof PublicPullRequest.Type;
export type PrivatePullRequestNode = typeof PrivatePullRequest.Type;

const runKeys = {
  headSha: 'head_sha',
  startedAt: 'run_started_at',
  updatedAt: 'updated_at',
} as const;

const runTimes = {
  headSha: Schema.String,
  startedAt: Instant,
  updatedAt: Instant,
};

const runsPage = <Run extends Schema.Top>(run: Run) =>
  Schema.Struct({ total: Schema.Int, runs: Schema.Array(run) }).pipe(
    Schema.encodeKeys({ total: 'total_count', runs: 'workflow_runs' }),
  );

export const PublicRunsPage = runsPage(
  Schema.Struct({
    ...runTimes,
    workflow: Schema.NullOr(Schema.String),
    title: Schema.String,
    url: Schema.String,
  }).pipe(
    Schema.encodeKeys({
      ...runKeys,
      workflow: 'name',
      title: 'display_title',
      url: 'html_url',
    }),
  ),
);

// Decoding a private repository's runs keeps only the commit and the times.
export const PrivateRunsPage = runsPage(
  Schema.Struct(runTimes).pipe(Schema.encodeKeys(runKeys)),
);
