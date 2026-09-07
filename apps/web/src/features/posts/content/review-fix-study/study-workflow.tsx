import type { ReactNode } from 'react';
import { MDXSection } from '@/shared/content/presentation/components/mdx-layout-components';
import { MDXHeadingOne, MDXParagraph, MDXStrong } from '@/shared/content/presentation/components/mdx-markdown-elements';
import { ContaminationFigure, MockTestFigure } from './study-outcomes';

export const StudyTests = (): ReactNode => (
  <MDXSection>
    <MDXHeadingOne>05 A green test can confirm its own assumption</MDXHeadingOne>
<MDXParagraph>The earlier rounds supplied a different warning: a reviewer can identify a valid mechanism, overstate its importance, and then build far too much around it.</MDXParagraph>
<MDXParagraph>In one Rota retry review, Luna made worthwhile suggestions about bounded storage/failure work and an excessive shared cooldown. But the repair also added a <MDXStrong>501-line custom PNG validator</MDXStrong>. The entire PR added 798 lines and removed 43 across nine files. The parsing concern predated the PR, and the skill explicitly prohibited adding a new parser for one finding.</MDXParagraph>
<MDXParagraph>I kept the modest timeout and cooldown safeguards. I did not keep the parser.</MDXParagraph>
<MDXParagraph>Another repair added persistent generation identity and migration-sized machinery for scenarios whose material impact had not been established. Its new tests exercised ID-equality helpers rather than the database attachment boundary that mattered.</MDXParagraph>
<MDXParagraph>The sharpest test-quality example came from a small, otherwise useful session-expiry fix. The implementation used <code>greatest(current_expiry, requested_expiry)</code> to prevent an older write from moving expiry backward. But the database mock recognized the SQL-expression shape and applied <code>Math.max</code> itself.</MDXParagraph>
<MDXParagraph>Deliberately replacing <code>greatest(...)</code> with the wrong <code>least(...)</code> still passed the test.</MDXParagraph>
<MockTestFigure />
<MDXParagraph>The test rejected the old assignment shape while assuming the important behavior of the new one. A green result looked more persuasive than the evidence justified.</MDXParagraph>
<MDXParagraph>The lesson is not that regression tests are unhelpful. It is that <MDXStrong>a test can verify the model's assumption instead of the application's behavior</MDXStrong>. Mutation probes and checks at the actual framework or persistence boundary can distinguish those cases.</MDXParagraph>
  </MDXSection>
);

export const StudyCoordination = (): ReactNode => (
  <MDXSection>
    <MDXHeadingOne>06 Better triage was not better detection</MDXHeadingOne>
<MDXParagraph>The mixed configuration was an appealing idea: use Astra to make the difficult judgment calls, but let inexpensive Luna reviewers do most of the investigation.</MDXParagraph>
<MDXParagraph>There was a real benefit. On ProsaBridge, Astra challenged a reviewer's claim that synthetic fixture data represented the preserved historical run. It also avoided restoring an obsolete importer that conflicted with the intended product behavior. The final triage was better than the all-Luna result.</MDXParagraph>
<MDXParagraph>But both material ProsaBridge defects were still present when the mixed run finished.</MDXParagraph>
<MDXParagraph><MDXStrong>Better adjudication did not become equivalent detection.</MDXStrong> A coordinator can reject a weak finding without discovering the important bug that was never reported. It could investigate independently, of course. In these runs, the strong-coordinator architecture did not supply that missing coverage.</MDXParagraph>
<MDXParagraph>There was also a genuine mixed-run success: its Rota header repair restored the private/no-store response policy at the final fetch adapter while preserving the serialized error contract. All-Astra had missed that issue, and I retained the mixed repair alongside Astra's loop fix.</MDXParagraph>
<MDXParagraph>That is important counterevidence, not a footnote to hide. The best merged result combined work from more than one candidate. But one useful complementary fix does not establish the proposed tradeoff of all-Astra detection at a lower cost.</MDXParagraph>
  </MDXSection>
);

export const StudyContamination = (): ReactNode => (
  <MDXSection>
    <MDXHeadingOne>07 The reviewer that read the other solution</MDXHeadingOne>
<MDXParagraph>The mixed Rota run had another problem. Its behavior reviewer inspected sibling Git refs and read the all-Astra fix before completing its own investigation.</MDXParagraph>
<MDXParagraph>The recorded sequence on September 7, in UTC, included:</MDXParagraph>
<ContaminationFigure />
<MDXParagraph>The mixed fixture was identical to the all-Astra version. Its final report did not disclose the exposure to the other solution's fix and tests.</MDXParagraph>
<MDXParagraph>That does not make the bug imaginary or the repair useless. It means the run cannot count as an independent rediscovery. The commands establish exposure, not intent; I am not claiming the agent deliberately tried to cheat.</MDXParagraph>
<MDXParagraph>The setup made this possible. Separate Git worktrees shared the same object database and sibling refs. They were separate working directories, not isolated evidence environments. A prohibition on reading “findings” also left fixes and tests insufficiently explicit.</MDXParagraph>
<MDXParagraph>For future comparisons, I would use separate histories containing only the source and base, and prevent access to sibling reports, code, and tests. Separate clones alone would not be enough while an agent retained unrestricted network access to the other PRs.</MDXParagraph>
<MDXParagraph>This is an evaluation lesson in its own right: <MDXStrong>matching starting commits is not the same as preserving independent discovery</MDXStrong>.</MDXParagraph>
  </MDXSection>
);
