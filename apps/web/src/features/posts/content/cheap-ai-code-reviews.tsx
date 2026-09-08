import type { ReactNode } from 'react';
import type { Post } from './post-meta';
import { StudyDecision } from './review-fix-study/study-conclusion';
import { StudyEconomics } from './review-fix-study/study-economics';
import { StudyFindings } from './review-fix-study/study-findings';
import { StudyIntroduction } from './review-fix-study/study-introduction';
import { StudyCoordination } from './review-fix-study/study-workflow';

const CheapAiCodeReviewsBody = (): ReactNode => (
  <>
    <StudyIntroduction />
    <StudyFindings />
    <StudyCoordination />
    <StudyEconomics />
    <StudyDecision />
  </>
);

export const cheapAiCodeReviewsPost: Post = {
  meta: {
    title: 'Cheaper AI reviews missed the bugs that mattered',
    subtitle: 'Why I chose a stronger default instead of cheaper reviews.',
    slug: 'cheap-ai-code-reviews',
    date: '2026-09-07',
    category: 'Engineering',
    readTime: '5 min read',
    excerpt:
      'I tested cheaper AI models for reviewing and fixing code. They missed important bugs, one repair brought a failure back, and mixing models did not deliver the saving I hoped for.',
  },
  body: CheapAiCodeReviewsBody,
};
