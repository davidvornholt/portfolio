'use client';

import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  ExternalLink,
  Gauge,
  LineChart,
  Search,
  Server,
  TrendingDown,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { Badge } from '@/shared/ui/presentation/components/badge';
import { Separator } from '@/shared/ui/presentation/components/separator';

type StatItem = {
  readonly label: string;
  readonly value: string;
  readonly subtext: string;
  readonly trend: 'up' | 'down';
  readonly icon: ReactNode;
};

const stats: readonly StatItem[] = [
  {
    label: 'Cold Boot Time',
    value: '0s',
    subtext: 'Reduced from 5s',
    trend: 'down',
    icon: <Zap className="h-5 w-5" />,
  },
  {
    label: 'Lighthouse Score',
    value: '100',
    subtext: 'SEO & Best Practices',
    trend: 'up',
    icon: <Gauge className="h-5 w-5" />,
  },
  {
    label: 'Load Speed',
    value: '3x',
    subtext: 'Faster TTI',
    trend: 'up',
    icon: <LineChart className="h-5 w-5" />,
  },
  {
    label: 'Search Impressions',
    value: '300%',
    subtext: 'Growth YoY',
    trend: 'up',
    icon: <Search className="h-5 w-5" />,
  },
  {
    label: 'Click-Through Rate',
    value: '2.5x',
    subtext: 'Increase',
    trend: 'up',
    icon: <TrendingUp className="h-5 w-5" />,
  },
  {
    label: 'Infrastructure Cost',
    value: '-60%',
    subtext: 'Reduction (2.5x lower)',
    trend: 'down',
    icon: <Server className="h-5 w-5" />,
  },
] as const;

const techStack: readonly string[] = [
  'Next.js 16',
  'Tailwind CSS v4',
  'TypeScript',
] as const;

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
};

const staggerContainer = {
  initial: {},
  whileInView: {
    transition: {
      staggerChildren: 0.1,
    },
  },
  viewport: { once: true, margin: '-100px' },
};

const StatCard = ({ stat }: { readonly stat: StatItem }): ReactNode => (
  <motion.div
    variants={{
      initial: { opacity: 0, y: 20 },
      whileInView: { opacity: 1, y: 0 },
    }}
    transition={{ duration: 0.5, ease: 'easeOut' }}
    className="group relative overflow-hidden rounded-lg border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-sm"
  >
    <div className="mb-4 flex items-center justify-between">
      <span className="text-primary">{stat.icon}</span>
      {stat.trend === 'up' ? (
        <TrendingUp className="h-4 w-4 text-green-600" />
      ) : (
        <TrendingDown className="h-4 w-4 text-green-600" />
      )}
    </div>
    <p className="font-mono text-3xl font-bold text-foreground">{stat.value}</p>
    <p className="mt-1 text-sm font-medium text-foreground">{stat.label}</p>
    <p className="text-xs text-muted-foreground">{stat.subtext}</p>
  </motion.div>
);

const SectionHeader = ({
  number,
  title,
}: {
  readonly number: string;
  readonly title: string;
}): ReactNode => (
  <div className="mb-8 flex items-baseline gap-4">
    <span className="font-mono text-sm font-medium text-primary">{number}</span>
    <h2 className="font-serif text-3xl font-semibold text-foreground md:text-4xl">
      {title}
    </h2>
  </div>
);

const CaseStudyPage = (): ReactNode => (
  <article className="pb-24 pt-32">
    {/* Back Navigation */}
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="mx-auto mb-12 max-w-4xl px-6"
    >
      <Link
        href="/#works"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Works
      </Link>
    </motion.div>

    {/* Hero Section */}
    <motion.header
      {...fadeInUp}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="mx-auto mb-16 max-w-4xl px-6"
    >
      <p className="mb-4 text-sm font-medium uppercase tracking-widest text-primary">
        Case Study
      </p>
      <h1 className="mb-6 font-serif text-4xl font-semibold leading-tight text-foreground md:text-5xl lg:text-6xl">
        Freie Evangelische Schule Kirchheim
      </h1>
      <p className="mb-8 max-w-2xl font-serif text-xl italic text-muted-foreground md:text-2xl">
        Digital Transformation: From Static Legacy to High-Performance Platform
      </p>

      {/* Meta Information */}
      <div className="flex flex-wrap items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          <span className="text-muted-foreground">August 2024 – Present</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          <span className="text-muted-foreground">
            Lead Full Stack Developer & Digital Experience Architect
          </span>
        </div>
      </div>

      {/* Tech Stack */}
      <div className="mt-6 flex flex-wrap gap-2">
        {techStack.map((tech) => (
          <Badge key={tech} variant="secondary" className="font-mono text-xs">
            {tech}
          </Badge>
        ))}
      </div>

      {/* Action Buttons */}
      <a
        href="https://fes-kirchheim.de"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex mt-8 h-9 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
      >
        Visit Live Platform
        <ExternalLink className="h-4 w-4" />
      </a>
    </motion.header>

    <Separator className="mx-auto mb-16 max-w-4xl" />

    {/* The Challenge Section */}
    <motion.section
      {...fadeInUp}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="mx-auto mb-20 max-w-4xl px-6"
    >
      <SectionHeader number="01" title="The Challenge" />

      <div className="space-y-6">
        <p className="text-lg font-medium text-foreground">
          An institution slowed down by technical debt.
        </p>

        <p className="leading-relaxed text-foreground/80">
          The Freie Evangelische Schule Kirchheim (FESK) provides excellent
          education, but its digital presence did not reflect this quality. The
          legacy system was plagued by high operational costs, slow load times,
          and a complex admin interface that frustrated staff.
        </p>

        <p className="leading-relaxed text-foreground/80">
          The most critical technical bottleneck was a{' '}
          <span className="font-semibold text-foreground">
            5-second cold boot time
          </span>
          , which led to high bounce rates. Parents looking to register their
          children faced a confusing UI, and the school&apos;s visibility in
          search engines was suboptimal.
        </p>

        <div className="rounded-lg border-l-4 border-primary bg-primary/5 p-6">
          <p className="font-medium text-foreground">My Mission:</p>
          <p className="mt-2 text-foreground/80">
            To architect a cost-effective, scalable, and inclusive digital
            ecosystem that empowers the administration and welcomes new
            families.
          </p>
        </div>
      </div>
    </motion.section>

    {/* Impact Section */}
    <motion.section
      {...fadeInUp}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="mx-auto mb-20 max-w-4xl px-6"
    >
      <SectionHeader number="02" title="The Impact by Numbers" />

      <p className="mb-8 text-muted-foreground">
        Optimizing for both machines and humans.
      </p>

      <motion.div
        variants={staggerContainer}
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true, margin: '-100px' }}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {stats.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </motion.div>
    </motion.section>

    {/* Architecture Section */}
    <motion.section
      {...fadeInUp}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="mx-auto mb-20 max-w-4xl px-6"
    >
      <SectionHeader number="03" title="Architecture & Engineering" />

      <p className="mb-8 text-lg font-medium text-foreground">
        Clean Code Principles meets Modern Web Performance.
      </p>

      <div className="space-y-8">
        <div className="space-y-4">
          <p className="leading-relaxed text-foreground/80">
            To solve the performance issues, I migrated the architecture to{' '}
            <span className="font-semibold text-foreground">Next.js 16</span>.
            The move allowed us to leverage{' '}
            <span className="font-semibold text-foreground">
              Server-Side Rendering (SSR)
            </span>{' '}
            and{' '}
            <span className="font-semibold text-foreground">
              Incremental Static Regeneration (ISR)
            </span>
            , eliminating the cold boot issue entirely.
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-xl font-semibold text-foreground">
            Applying Clean Code
          </h3>
          <p className="mb-6 leading-relaxed text-foreground/80">
            As this project relies on voluntary maintenance, code readability
            was paramount. I enforced{' '}
            <span className="font-semibold text-foreground">
              Uncle Bob&apos;s Clean Code standards
            </span>
            :
          </p>

          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle2 className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">Strict Typing</p>
                <p className="text-sm text-muted-foreground">
                  A comprehensive TypeScript schema ensures that 95% of
                  potential runtime errors are caught at compile time.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle2 className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">
                  Component Composition
                </p>
                <p className="text-sm text-muted-foreground">
                  Instead of monolithic page files, the UI is built from atomic,
                  reusable components (Atomic Design).
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle2 className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">
                  Separation of Concerns
                </p>
                <p className="text-sm text-muted-foreground">
                  Business logic is strictly separated from the UI layer via
                  custom hooks.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>

    {/* UX & Accessibility Section */}
    <motion.section
      {...fadeInUp}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="mx-auto mb-20 max-w-4xl px-6"
    >
      <SectionHeader number="04" title="User Experience & Accessibility" />

      <p className="mb-8 text-lg font-medium text-foreground">
        Building for the Community.
      </p>

      <p className="mb-8 leading-relaxed text-foreground/80">
        A school website must be accessible to everyone—grandparents on older
        tablets, parents on mobile data, and users with visual impairments.
      </p>

      <div className="grid gap-6 md:grid-cols-3">
        <motion.div
          variants={{
            initial: { opacity: 0, y: 20 },
            whileInView: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.5, delay: 0 }}
          className="rounded-lg border border-border bg-card p-6"
        >
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <h3 className="mb-2 font-semibold text-foreground">
            Accessibility First
          </h3>
          <p className="text-sm text-muted-foreground">
            Improved semantic HTML structure and ARIA labels, achieving
            significantly better screen reader compatibility.
          </p>
        </motion.div>

        <motion.div
          variants={{
            initial: { opacity: 0, y: 20 },
            whileInView: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-lg border border-border bg-card p-6"
        >
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Zap className="h-5 w-5 text-primary" />
          </div>
          <h3 className="mb-2 font-semibold text-foreground">
            Intuitive Registration
          </h3>
          <p className="text-sm text-muted-foreground">
            Redesigned student registration into a multi-step wizard with
            real-time validation, reducing drop-offs significantly.
          </p>
        </motion.div>

        <motion.div
          variants={{
            initial: { opacity: 0, y: 20 },
            whileInView: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="rounded-lg border border-border bg-card p-6"
        >
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Server className="h-5 w-5 text-primary" />
          </div>
          <h3 className="mb-2 font-semibold text-foreground">
            Empowering Staff
          </h3>
          <p className="text-sm text-muted-foreground">
            Custom Admin Dashboard built for non-technical staff to update
            content and manage events without touching code.
          </p>
        </motion.div>
      </div>
    </motion.section>

    {/* Verdict Section */}
    <motion.section
      {...fadeInUp}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="mx-auto mb-20 max-w-4xl px-6"
    >
      <SectionHeader number="05" title="The Verdict" />

      <p className="mb-8 text-lg font-medium text-foreground">
        &ldquo;Digital Sovereignty restored.&rdquo;
      </p>

      <p className="mb-8 leading-relaxed text-foreground/80">
        This project was more than a redesign; it was a restructuring of how the
        school presents itself digitally. By cutting technical costs by a factor
        of 2.5 and tripling search impressions, we proved that high-end
        engineering directly translates to institutional success.
      </p>

      <blockquote className="relative rounded-lg border border-border bg-card p-8">
        <div className="absolute -top-3 left-6 bg-background px-2">
          <span className="font-serif text-4xl text-primary">&ldquo;</span>
        </div>
        <p className="font-serif text-lg italic text-foreground">
          The new platform didn&apos;t just save us money; it gave us a voice
          that is finally heard clearly online.
        </p>
        <footer className="mt-4 text-sm text-muted-foreground">
          — Feedback from the Administration
        </footer>
      </blockquote>
    </motion.section>

    {/* CTA Section */}
    <motion.section
      {...fadeInUp}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="mx-auto max-w-4xl px-6"
    >
      <Separator className="mb-16" />

      <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
        <div>
          <p className="font-serif text-xl font-semibold text-foreground">
            Interested in the platform?
          </p>
          <p className="text-muted-foreground">
            Visit the live website to see it in action.
          </p>
        </div>
        <a
          href="https://fes-kirchheim.de"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
        >
          Visit Live Platform
          <ArrowUpRight className="h-4 w-4" />
        </a>
      </div>
    </motion.section>
  </article>
);

export default CaseStudyPage;
