import type { ReactNode } from 'react';
import { MDXSection } from '@/shared/content/presentation/components/mdx-layout-components';
import { MDXAnchor, MDXHeadingOne, MDXParagraph, MDXStrong } from '@/shared/content/presentation/components/mdx-markdown-elements';

export const StudyRouting = (): ReactNode => (
  <MDXSection>
    <MDXHeadingOne>09 The cost of choosing a model</MDXHeadingOne>
<MDXParagraph>I do not want to make a model-routing decision before every review: is this PR complicated enough to justify Astra?</MDXParagraph>
<MDXParagraph>That decision has its own cognitive cost. More importantly, the failure mode I am trying to avoid is difficult to use as an escalation signal. A review that misses a defect can return a confident, plausible report without telling me it needs help.</MDXParagraph>
<MDXParagraph>“Retry with a stronger model when the cheaper one fails” is therefore not a complete review policy. Someone or something still has to notice the miss. If I need a stronger review to establish whether I can trust the cheap review, the cheap stage has not replaced the stronger one.</MDXParagraph>
<MDXParagraph>The intended behavior in these examples also crossed boundaries: historical versus active rows, method revisions versus selected candidates, transient UI state versus router invalidation, and middleware wrappers versus returned values. A superficially modest change can depend on a contract outside its immediate diff.</MDXParagraph>
<MDXParagraph>For my workflow, a single stronger default removes a repeated decision rather than adding another layer of automation to make that decision for me.</MDXParagraph>
<MDXParagraph>That is an operational choice beyond the measured sample. It does not mean every trivial PR requires Astra. It means I am choosing not to spend attention identifying all the occasions when I might get away without it.</MDXParagraph>
  </MDXSection>
);

export const StudyLimits = (): ReactNode => (
  <MDXSection>
    <MDXHeadingOne>10 What the evidence establishes</MDXHeadingOne>
<MDXParagraph>This was a field study of complete workflows on active projects, not a randomized leaderboard. The nine source changes were heterogeneous, not nine repetitions of one controlled task. Tools, effort settings, delegation, environment conditions, and human interventions varied. An early run also modified its source worktree, compromising that baseline. There is no independently exhaustive bug list, so I cannot calculate recall or treat raw blocker counts as a quality score.</MDXParagraph>
<MDXParagraph>Some early Spark reviews did not use the required independent reviewer agents. The latest Spark runs did, and they still missed the central defects; the early delegation problem cannot explain away the later result. Native Spark records confirm the model, but do not independently prove the historical effort setting for every run.</MDXParagraph>
<MDXParagraph>Timeouts and thread-capacity problems occurred in Codex, including Astra runs. They affected elapsed time and intervention burden; I do not treat an unproven environment failure as evidence of inferior model reasoning. The separately reproduced middleware regression is a different matter.</MDXParagraph>
<MDXParagraph>Astra was not exhaustive. Spark contributed a useful revision-test guardrail to the final ProsaBridge merge. The mixed run contributed the Rota response-header fix. Those contributions remain part of the result.</MDXParagraph>
<MDXParagraph>None of this weakens the concrete observations: the defects existed, the cheap reviews did not independently recover them, one repair demonstrably regressed behavior, and the mixed subtotal exceeded all-Astra. The limitations define which conclusions those observations support. They do not erase them.</MDXParagraph>
  </MDXSection>
);

export const StudyDecision = (): ReactNode => (
  <MDXSection>
    <MDXHeadingOne>11 One default for every review-fix role</MDXHeadingOne>
<MDXParagraph>I will use <MDXStrong>Astra medium for the coordinator, reviewers, and repair workers</MDXStrong> as my normal review-fix configuration. Medium is a working default, not an experimentally proven optimum: I did not run an Astra effort-level sweep.</MDXParagraph>
<MDXParagraph>I will also make the model choice explicit for every role. An earlier “Astra” run actually used Luna reviewers despite the prepared prompt, and the checked-in skill still had Luna defaults when the study ended. Naming a model in a prompt is not evidence that every agent used it.</MDXParagraph>
<MDXParagraph>Muse Spark demonstrated useful restraint, low latency, and some worthwhile observations. Luna found several sound safeguards. But neither established that it could take over this job with the reliability and supervision burden I want. The mixed approach did not rescue the economics.</MDXParagraph>
<MDXParagraph>The conclusion is not that cheaper models have no use. It is that <MDXStrong>a low-cost review report is not the same product as a dependable review-and-repair result</MDXStrong>.</MDXParagraph>
<MDXParagraph>I was hoping to save money on reviews. What I learned is that this is precisely where I want to avoid false reassurance—and where I least want another decision to make before I can get back to building.</MDXParagraph>

<MDXParagraph><MDXStrong>Evidence:</MDXStrong> The accompanying <MDXAnchor href="/posts/cheap-ai-code-reviews/evidence.md">experiment appendix</MDXAnchor> records the source changes, latest input hashes, findings, cost assumptions, contamination trace, and selected outcomes. It is derived from the September 7 study report and links to the underlying PR records. Repository links may require access. The public appendix preserves the measurements and provenance without private document contents, credentials, or raw session transcripts.</MDXParagraph>
  </MDXSection>
);
