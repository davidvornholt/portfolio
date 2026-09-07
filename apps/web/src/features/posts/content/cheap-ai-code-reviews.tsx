import type { ReactNode } from 'react';
import type { Post } from './post-meta';
import { StudyDecision, StudyLimits, StudyRouting } from './review-fix-study/study-conclusion';
import { StudyEconomics } from './review-fix-study/study-economics';
import { StudyFindings, StudyTransportRegression } from './review-fix-study/study-findings';
import { StudyIntroduction, StudyScope } from './review-fix-study/study-introduction';
import { StudyContamination, StudyCoordination, StudyTests } from './review-fix-study/study-workflow';

const CheapAiCodeReviewsBody = (): ReactNode => (
  <>
    <StudyIntroduction />
    <StudyScope />
    <StudyFindings />
    <StudyTransportRegression />
    <StudyTests />
    <StudyCoordination />
    <StudyContamination />
    <StudyEconomics />
    <StudyRouting />
    <StudyLimits />
    <StudyDecision />
  </>
);

export const cheapAiCodeReviewsPost: Post = {
  meta: {
    title: 'I tried cheaper AI code reviews. They missed the bugs I needed them to catch.',
    subtitle: 'Real defects, a broken repair, and a mixed-model workflow that failed to save money.',
    slug: 'cheap-ai-code-reviews',
    date: '2026-09-07',
    category: 'Engineering',
    readTime: '16 min read',
    excerpt: 'Nine source changes across ProsaBridge and Rota changed my default: Astra medium for every review-fix role. The latest round exposed three missed defects, a repair regression, and the limits of cheaper reviewers.',
  },
  body: CheapAiCodeReviewsBody,
};
