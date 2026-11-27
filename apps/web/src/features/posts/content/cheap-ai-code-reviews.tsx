import type { ReactNode } from 'react';
import {
  MDXCallToAction,
  MDXSection,
} from '@/shared/content/presentation/components/mdx-layout-components';
import {
  MDXAnchor,
  MDXHeadingOne,
  MDXParagraph,
  MDXStrong,
} from '@/shared/content/presentation/components/mdx-markdown-elements';
import { FigureNumbers, PostFigure } from './figures/post-figure';
import { ReviewCostChart } from './figures/review-cost-chart';
import sievePicture from './images/cheap-ai-code-reviews-object.jpg';
import type { Post } from './post-meta';

const setups = [
  {
    name: 'Luna for everything',
    detail: 'GPT-5.6 Luna leads, reviews, and fixes.',
  },
  {
    name: 'Spark for everything',
    detail: 'Muse Spark 1.3 leads, reviews, and fixes.',
  },
  {
    name: 'Astra for everything',
    detail: 'GPT-6 Astra leads, reviews, and fixes.',
  },
  {
    name: 'Astra leads, Luna works',
    detail: 'Astra leads. Luna reviews and fixes.',
  },
] as const;

const found = [
  { value: '3', label: 'bugs that only Astra found by itself' },
  { value: '2,494', label: 'calls in five seconds, in one of them' },
  { value: '1', label: 'cheap fix that brought an old failure back' },
] as const;

const Setups = (): ReactNode => (
  <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
    {setups.map((setup) => (
      <div key={setup.name}>
        <dt className="font-bold">{setup.name}</dt>
        <dd className="text-muted-foreground">{setup.detail}</dd>
      </div>
    ))}
  </dl>
);

const CheapAiCodeReviewsBody = (): ReactNode => (
  <>
    <MDXSection>
      <MDXParagraph>
        I wanted to spend less on AI. Code review looked like the place to save:
        let a cheap model read the change, and call in an expensive one only
        when it gets hard.
      </MDXParagraph>
      <MDXParagraph>
        From September 5 to 7, 2026 I tested that on nine real changes in two of
        my projects. It didn’t work. The cheap reviews missed bugs that broke
        normal use, one cheap fix broke something that had just been repaired,
        and the setup that was meant to save money cost the most.
      </MDXParagraph>
    </MDXSection>

    <MDXSection>
      <MDXHeadingOne>The test</MDXHeadingOne>
      <MDXParagraph>
        My review workflow, <MDXStrong>review-fix</MDXStrong>, has a lead agent
        that hands a change to separate reviewing agents, has the problems they
        find fixed, and has the fixes checked. In the last and cleanest round I
        ran it in four setups on the same two changes. Each setup started from
        the same code and the same instructions.
      </MDXParagraph>
      <PostFigure caption="Astra ran at medium effort and Luna at its maximum. Spark was asked for its maximum.">
        <Setups />
      </PostFigure>
    </MDXSection>

    <MDXSection>
      <MDXHeadingOne>What only the expensive model found</MDXHeadingOne>
      <PostFigure caption="From the last round: two changes, four setups. This is what I saw, not a count of every bug in the two changes.">
        <FigureNumbers numbers={found} />
      </PostFigure>
      <MDXParagraph>
        Astra found and fixed three bugs that none of the cheaper setups found
        by itself. All three broke normal, intended use, not a rare corner case.
      </MDXParagraph>
      <MDXParagraph>
        Two of them were in an internal tool that I haven’t published, so I
        can’t show them. The third was in Rota, my app for keeping track of
        clothes. After an error it could start loading its data again and again
        without ever stopping. A test in the browser counted 2,494 calls of the
        loading function in five seconds.
      </MDXParagraph>
      <MDXParagraph>
        Luna caused the opposite kind of damage. While making a repair in Rota,
        it let errors from the server look like successful answers again. That
        was the very failure the original change had been written to remove. I
        reproduced it separately against the real framework. The fix never left
        my machine.
      </MDXParagraph>
      <MDXParagraph>
        The earlier rounds had shown the same thing in smaller ways: code that
        nobody needed, and tests that looked reassuring and tested nothing. One
        test still passed after I had broken, on purpose, the behavior it was
        supposed to protect.
      </MDXParagraph>
    </MDXSection>

    <MDXSection>
      <MDXHeadingOne>
        A strong supervisor doesn’t repair weak reviewers
      </MDXHeadingOne>
      <MDXParagraph>
        The obvious compromise was Astra as the lead, with Luna doing the
        reading and the fixing. Astra was good at throwing out weak findings.
        But it could only judge what was reported to it, and the Luna reviewers
        never reported the two bugs in the internal tool. A supervisor can’t
        weigh a finding that nobody made.
      </MDXParagraph>
      <MDXParagraph>
        In Rota the mixed setup did report the endless loading. Its reviewer had
        read Astra’s finished fix before it did, so I don’t count that. It tells
        me that my test had a leak, not that the reviewer found the bug.
      </MDXParagraph>
      <MDXParagraph>
        It was not all one-sided. The mixed setup produced one useful fix in
        Rota that Astra had missed, and Spark improved a test. I kept both.
      </MDXParagraph>
    </MDXSection>

    <MDXSection>
      <MDXHeadingOne>What it cost</MDXHeadingOne>
      <PostFigure
        title="Estimated cost of the two changes, in US dollars"
        caption="Calculated from the recorded token counts at the list prices of September 5, 2026. These are estimates, not bills. Every bar starts at zero on a scale that ends at 50 dollars."
      >
        <ReviewCostChart />
      </PostFigure>
      <MDXParagraph>
        The figure for the mixed setup is a minimum, because some of its runs
        recorded no usage. It is already higher than the figure for Astra alone.
        The setup that was meant to save money was the most expensive of the
        four.
      </MDXParagraph>
      <MDXParagraph>
        Luna cost a sixteenth of what Astra cost. It also left one of its two
        reviews unfinished, and one of its fixes was broken. The cheapest review
        was not the cheapest way to get a change that works. My own time for
        supervising and the cost of a bug that slips through are in none of
        these figures.
      </MDXParagraph>
    </MDXSection>

    <MDXSection>
      <MDXHeadingOne>
        Why I don’t choose the model for each change
      </MDXHeadingOne>
      <MDXParagraph>
        “Use the cheap model and switch when it fails” sounds sensible. But a
        review that missed a bug reads exactly like a review of a change without
        bugs. Nothing tells me when to switch. If I need the expensive model to
        find out whether I can trust the cheap one, I have saved nothing.
      </MDXParagraph>
      <MDXParagraph>
        So I decided on one setting: Astra at medium effort for the lead, the
        reviewers, and the fixers. I did not compare effort levels, so medium is
        a choice and not a result. I also no longer ask myself before each
        review whether a change is hard enough to deserve the good model.
      </MDXParagraph>
    </MDXSection>

    <MDXSection>
      <MDXHeadingOne>What this does not show</MDXHeadingOne>
      <MDXParagraph>
        This was three days of real work, not a benchmark: nine changes, two
        projects, and tools that differ from one vendor to the next. I have no
        list of every bug in those changes, so I claim no detection rate. Part
        of the evidence is in a project I haven’t published. The{' '}
        <MDXAnchor href="/posts/cheap-ai-code-reviews/evidence.md">
          methods and cost notes
        </MDXAnchor>{' '}
        say what was counted and what was not.
      </MDXParagraph>
      <MDXParagraph>
        Update, November 2026: the reviewers still run on Astra at medium
        effort, now in version 6.2. The fixes are made by whichever model leads
        the work, and that is no longer always Astra.
      </MDXParagraph>
    </MDXSection>

    <MDXCallToAction
      title="The workflow that was tested"
      description="What review-fix found in two changes in which a commercial reviewer found nothing."
      href="/posts/review-fix-versus-coderabbit"
      linkText="Read the comparison"
    />
  </>
);

export const cheapAiCodeReviewsPost: Post = {
  meta: {
    title: 'Cheaper AI reviews missed the bugs that mattered.',
    subtitle:
      'The cheapest setup found none of three real bugs. The one that found them cost sixteen times as much, and I now use it for every review.',
    slug: 'cheap-ai-code-reviews',
    date: '2026-09-07',
    category: 'Engineering',
    readTime: '4 min read',
    excerpt:
      'I tested four model setups for reviewing and fixing code. The cheap ones missed three real bugs, one cheap fix brought an old failure back, and letting the strong model supervise cheap ones cost more than using it for everything.',
    picture: {
      src: sievePicture,
      alt: 'A kitchen sieve with a coarse wire mesh.',
    },
  },
  body: CheapAiCodeReviewsBody,
};
