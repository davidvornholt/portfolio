import type { ReactNode } from 'react';
import { MDXSection } from '@/shared/content/presentation/components/mdx-layout-components';
import { MDXHeadingOne, MDXParagraph, MDXStrong } from '@/shared/content/presentation/components/mdx-markdown-elements';
import { StudyConfigurations, StudyScorecard } from './study-outcomes';

export const StudyIntroduction = (): ReactNode => (
  <MDXSection>
    <MDXHeadingOne>01 The result</MDXHeadingOne>
<MDXParagraph>I wanted to spend less on AI-assisted development. Code review and repair seemed like a reasonable place to try: keep a stronger model available, but let a cheaper one handle the routine <code>review-fix</code> cycle.</MDXParagraph>
<MDXParagraph>After comparing workflows on two of my projects, I am going in the opposite direction. My default will be GPT-6 Astra at medium effort—not just as the coordinator, but for the reviewers and repair workers as well.</MDXParagraph>
<MDXParagraph>The decisive evidence was not that Astra wrote a more impressive report. In the latest comparison, it found three material defects in intended application behavior that the cheaper configurations did not independently recover. One browser reproduction produced <MDXStrong>2,494 loader calls in five seconds</MDXStrong>. In another candidate, a repair reintroduced the very class of error the pull request was meant to remove.</MDXParagraph>
<MDXParagraph>I also tried the obvious compromise: a strong coordinator supervising cheaper reviewers. On the two latest tasks, that workflow missed both of Astra's ProsaBridge findings, and its recorded cost already exceeded all-Astra before all of its usage could be counted.</MDXParagraph>
<MDXParagraph>These are findings about real review-and-repair workflows, not a universal ranking of model intelligence. They are strong enough to change how I work—and specific enough to be useful beyond my own model preferences.</MDXParagraph>
<StudyScorecard />
  </MDXSection>
);

export const StudyScope = (): ReactNode => (
  <MDXSection>
    <MDXHeadingOne>02 What I actually compared</MDXHeadingOne>
<MDXParagraph>Between September 5 and 7, I compared workflows across nine source changes in <MDXStrong>ProsaBridge</MDXStrong>, my translation software project, and <MDXStrong>Rota</MDXStrong>, my clothing-tracker application. The early rounds used GPT-5.6 Luna in Codex, Muse Spark 1.3 in Muse Code, and SWE-1.7 in Devin CLI. Astra entered later.</MDXParagraph>
<MDXParagraph>The task was more demanding than “read this diff and list possible bugs.” My <code>review-fix</code> procedure establishes the baseline, runs separate review perspectives, judges which findings genuinely block the merge, repairs accepted blockers, verifies the repairs, runs the quality gate, and stops. It is one bounded cycle, not permission to keep reviewing until every imaginable concern has acquired a patch.</MDXParagraph>
<MDXParagraph>A finding can be real without being a blocker. A pre-existing issue may deserve a follow-up rather than an unrelated rewrite. A correct small fix can be worth retaining even when its author exaggerates the severity. Those distinctions matter because these agents modify the code, not merely comment on it.</MDXParagraph>
<MDXParagraph>The latest round used two source PRs and four configurations:</MDXParagraph>
<StudyConfigurations />
<MDXParagraph>Each source had four draft copies with matching initial code and matching relevant instruction files. The prompts explicitly selected models for every role and prohibited reading other PRs' findings. SWE was not part of this final four-configuration comparison; the latest results should not be presented as a direct Astra-versus-SWE test.</MDXParagraph>
<MDXParagraph>There were imperfect controls and one important contamination incident. I will get to those. First, the bugs.</MDXParagraph>
  </MDXSection>
);
