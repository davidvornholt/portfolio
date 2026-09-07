import type { ReactNode } from 'react';
import { MDXSection } from '@/shared/content/presentation/components/mdx-layout-components';
import { MDXAnchor, MDXHeadingOne, MDXHeadingThree, MDXParagraph, MDXStrong } from '@/shared/content/presentation/components/mdx-markdown-elements';
import { FindingsMatrix, RequestLoopFigure } from './study-outcomes';

const CorpusHistoryFinding = (): ReactNode => (
  <>
<MDXHeadingThree>Retiring data broke later corpus changes</MDXHeadingThree>
<MDXParagraph>ProsaBridge's TranslationBench was gaining incremental updates: add documents or translation candidates without throwing away valid translations and quality judgments. Retiring documents preserved their historical artifacts.</MDXParagraph>
<MDXParagraph>The preview and execution paths disagreed about that history. Preview considered active rows; execution validated against all historical rows, including retired ones. After an initial retirement, a later corpus change could be rejected as a stale plan even though it followed the intended workflow.</MDXParagraph>
<MDXParagraph>All-Astra made the preview use the same history as execution and added regression coverage. Spark, Luna, and the mixed workflow missed it.</MDXParagraph>
<MDXParagraph>This was not a request to support arbitrary legacy data or an exotic concurrency schedule. It was a normal sequence of edits the new feature was supposed to support. An unchanged no-op could exit early, so the precise claim is not that literally every subsequent operation failed.</MDXParagraph>
  </>
);

const AffectedCandidatesFinding = (): ReactNode => (
  <>
<MDXHeadingThree>“None of these candidates is affected” was not an allowed answer</MDXHeadingThree>
<MDXParagraph>The same feature separated translation-method revisions from judging-method revisions. After a method change, an operator could select which existing candidates actually needed refreshing.</MDXParagraph>
<MDXParagraph>But a run with candidates could not confirm an empty affected set.</MDXParagraph>
<MDXParagraph>Consider a run containing only DeepL candidates after a ProsaBridge prompt change. None of those candidates needs retranslation. Nevertheless, the interface and server required a nonempty selection, effectively forcing the operator to invalidate results that were still valid.</MDXParagraph>
<MDXParagraph>All-Astra added explicit confirmation that no candidates were affected. Its tests checked that translations and judgments were preserved and that no provider calls occurred. Again, the other three configurations missed the defect.</MDXParagraph>
<MDXParagraph>The practical distinction is important: this repair restored the product's stated behavior. It did not invent a new product requirement to justify a finding. Both ProsaBridge fixes were retained in the <MDXAnchor href="https://github.com/prosabridge/prosabridge/pull/450">selected PR, #450</MDXAnchor>.</MDXParagraph>
  </>
);

const RequestLoopFinding = (): ReactNode => (
  <>
<MDXHeadingThree>Error recovery became an automatic request loop</MDXHeadingThree>
<MDXParagraph>Rota's source PR changed how failed server responses and proposal actions were handled. All-Astra found a new loop involving an application-level problem returned as a successful mutation value.</MDXParagraph>
<MDXParagraph>The component applied the problem and invalidated the router. The loader returned a view without that transient problem. That reset the automatic-decision guard, which started another decision. The same sequence repeated.</MDXParagraph>
<MDXParagraph>The browser fixture measured <MDXStrong>2,494 loader calls in five seconds</MDXStrong>. Those were loader calls in a reproduction—not 2,494 demonstrated paid AI-provider requests, and not a measured production bill. The result nevertheless established a severe request loop in the error-handling path.</MDXParagraph>
<RequestLoopFigure />
<MDXParagraph>The repair preserved the transient problem while the serialized loader payload remained unchanged and reset the guard when the context changed. Explicit retry remained available. Coverage exercised the actual component, router, and query behavior, including desktop/mobile and recovery after a day-context change.</MDXParagraph>
<MDXParagraph>That focused repair became the basis of <MDXAnchor href="https://github.com/davidvornholt/rota/pull/34">Rota #34</MDXAnchor>. Spark missed the loop. The mixed workflow later produced a loop repair too—but its reviewer had already inspected the all-Astra solution, so I do not count that as independent discovery.</MDXParagraph>
  </>
);

export const StudyFindings = (): ReactNode => (
  <MDXSection>
    <MDXHeadingOne>03 Three failures in intended behavior</MDXHeadingOne>
<FindingsMatrix />
    <CorpusHistoryFinding />
    <AffectedCandidatesFinding />
    <RequestLoopFinding />
  </MDXSection>
);

export const StudyTransportRegression = (): ReactNode => (
  <MDXSection>
    <MDXHeadingOne>04 When a repair brings the bug back</MDXHeadingOne>
<MDXParagraph>The all-Luna Rota run found genuine issues. One concerned response headers being lost when errors were serialized. But its attempted repair restored raw failed HTTP responses and added a client middleware check equivalent to this:</MDXParagraph>
<pre className="my-6 overflow-x-auto bg-muted p-4 font-mono text-sm"><code>{"const result = await next();\nif (result instanceof Response && !result.ok) {\n  // Convert the failed response into an error.\n}"}</code></pre>
<MDXParagraph>In the installed TanStack implementation, <code>next()</code> returned a context wrapper. The actual return value lived in <code>.result</code>.</MDXParagraph>
<MDXParagraph>The check examined the wrong object. A failed HTTP response could therefore reach the caller as a successful value again—the same class of failure the original PR was intended to eliminate.</MDXParagraph>
<MDXParagraph>An independent probe ran the actual middleware callback through the installed framework implementation. It returned:</MDXParagraph>
<pre className="my-6 overflow-x-auto bg-muted p-4 font-mono text-sm"><code>{"{\"error\":null,\"returnedResponse\":true,\"status\":401}"}</code></pre>
<MDXParagraph>This is more concrete than a competing model saying the patch looked suspicious. The framework-boundary probe demonstrated the wrong behavior. The new server-helper tests had not exercised that client boundary.</MDXParagraph>
<MDXParagraph>Those repairs stayed local and were never pushed or merged. This was an intercepted regression, not a claim that Luna broke production. It still matters enormously when deciding whether a review-fix workflow can be left with less supervision.</MDXParagraph>
  </MDXSection>
);
