'use client';

import { motion } from 'framer-motion';
import {
  ArrowUpRight,
  CheckCircle2,
  Gauge,
  LineChart,
  Search,
  Server,
  TrendingDown,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import type { ReactNode } from 'react';

import { Badge } from '@/shared/ui/presentation/components/badge';
import { Separator } from '@/shared/ui/presentation/components/separator';

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

// Section wrapper with animation
type SectionProps = Readonly<{
  children: ReactNode;
  className?: string;
}>;

const Section = ({ children, className = '' }: SectionProps): ReactNode => (
  <motion.section
    {...fadeInUp}
    transition={{ duration: 0.6, ease: 'easeOut' }}
    className={`mx-auto mb-20 max-w-4xl px-6 ${className}`}
  >
    {children}
  </motion.section>
);

// Section Header
type SectionHeaderProps = Readonly<{
  number: string;
  title: string;
}>;

const SectionHeader = ({ number, title }: SectionHeaderProps): ReactNode => (
  <div className="mb-8 flex items-baseline gap-4">
    <span className="font-mono text-sm font-medium text-primary">{number}</span>
    <h2 className="font-serif text-3xl font-semibold text-foreground md:text-4xl">
      {title}
    </h2>
  </div>
);

// Callout component
type CalloutProps = Readonly<{
  title?: string;
  children: ReactNode;
}>;

const Callout = ({ title, children }: CalloutProps): ReactNode => (
  <div className="mt-8 rounded-lg border-l-4 border-primary bg-primary/5 p-6">
    {title && <p className="font-medium text-foreground">{title}</p>}
    <div className="mt-2 text-foreground/80">{children}</div>
  </div>
);

// Blockquote component
type BlockquoteProps = Readonly<{
  children: ReactNode;
  author?: string;
}>;

const Blockquote = ({ children, author }: BlockquoteProps): ReactNode => (
  <blockquote className="relative mt-8 rounded-lg border border-border bg-card p-8">
    <div className="absolute -top-3 left-6 bg-background px-2">
      <span className="font-serif text-4xl text-primary">&ldquo;</span>
    </div>
    <div className="font-serif text-lg italic text-foreground">{children}</div>
    {author && (
      <footer className="mt-4 text-sm text-muted-foreground">— {author}</footer>
    )}
  </blockquote>
);

// Icon map for string-based icon references
const iconMap: Record<string, ReactNode> = {
  zap: <Zap className="h-5 w-5" />,
  gauge: <Gauge className="h-5 w-5" />,
  lineChart: <LineChart className="h-5 w-5" />,
  search: <Search className="h-5 w-5" />,
  trendingUp: <TrendingUp className="h-5 w-5" />,
  server: <Server className="h-5 w-5" />,
  users: <Users className="h-5 w-5" />,
  checkCircle: <CheckCircle2 className="h-5 w-5" />,
};

type StatCardProps = Readonly<{
  label: string;
  value: string;
  subtext: string;
  trend: 'up' | 'down';
  icon: string;
}>;

const StatCard = ({
  label,
  value,
  subtext,
  trend,
  icon,
}: StatCardProps): ReactNode => (
  <motion.div
    variants={{
      initial: { opacity: 0, y: 20 },
      whileInView: { opacity: 1, y: 0 },
    }}
    transition={{ duration: 0.5, ease: 'easeOut' }}
    className="group relative overflow-hidden rounded-lg border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-sm"
  >
    <div className="mb-4 flex items-center justify-between">
      <span className="text-primary">{iconMap[icon]}</span>
      {trend === 'up' ? (
        <TrendingUp className="h-4 w-4 text-green-600" />
      ) : (
        <TrendingDown className="h-4 w-4 text-green-600" />
      )}
    </div>
    <p className="font-mono text-3xl font-bold text-foreground">{value}</p>
    <p className="mt-1 text-sm font-medium text-foreground">{label}</p>
    <p className="text-xs text-muted-foreground">{subtext}</p>
  </motion.div>
);

type StatGridProps = Readonly<{
  children: ReactNode;
}>;

const StatGrid = ({ children }: StatGridProps): ReactNode => (
  <motion.div
    variants={staggerContainer}
    initial="initial"
    whileInView="whileInView"
    viewport={{ once: true, margin: '-100px' }}
    className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
  >
    {children}
  </motion.div>
);

// Feature Card
type FeatureCardProps = Readonly<{
  icon: string;
  title: string;
  description: string;
  delay?: number;
}>;

const FeatureCard = ({
  icon,
  title,
  description,
  delay = 0,
}: FeatureCardProps): ReactNode => (
  <motion.div
    variants={{
      initial: { opacity: 0, y: 20 },
      whileInView: { opacity: 1, y: 0 },
    }}
    transition={{ duration: 0.5, delay }}
    className="rounded-lg border border-border bg-card p-6"
  >
    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
      <span className="text-primary">{iconMap[icon]}</span>
    </div>
    <h3 className="mb-2 font-semibold text-foreground">{title}</h3>
    <p className="text-sm text-muted-foreground">{description}</p>
  </motion.div>
);

type FeatureGridProps = Readonly<{
  children: ReactNode;
}>;

const FeatureGrid = ({ children }: FeatureGridProps): ReactNode => (
  <div className="mt-8 grid gap-6 md:grid-cols-3">{children}</div>
);

// Check item for lists
type CheckItemProps = Readonly<{
  title: string;
  description: string;
}>;

const CheckItem = ({ title, description }: CheckItemProps): ReactNode => (
  <div className="flex gap-4">
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
      <CheckCircle2 className="h-4 w-4 text-primary" />
    </div>
    <div>
      <p className="font-medium text-foreground">{title}</p>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  </div>
);

type CheckListProps = Readonly<{
  children: ReactNode;
}>;

const CheckList = ({ children }: CheckListProps): ReactNode => (
  <div className="mt-8 space-y-4">{children}</div>
);

// CTA Section
type CTAProps = Readonly<{
  title: string;
  description: string;
  href: string;
  linkText: string;
}>;

const CTA = ({ title, description, href, linkText }: CTAProps): ReactNode => (
  <motion.section
    {...fadeInUp}
    transition={{ duration: 0.6, ease: 'easeOut' }}
    className="mx-auto max-w-4xl px-6"
  >
    <Separator className="mb-16" />
    <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
      <div>
        <p className="font-serif text-xl font-semibold text-foreground">
          {title}
        </p>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
      >
        {linkText}
        <ArrowUpRight className="h-4 w-4" />
      </a>
    </div>
  </motion.section>
);

// Lead paragraph
type LeadProps = Readonly<{
  children: ReactNode;
}>;

const Lead = ({ children }: LeadProps): ReactNode => (
  <p className="mb-6 text-lg font-medium text-foreground">{children}</p>
);

// Prose wrapper for body text
type ProseProps = Readonly<{
  children: ReactNode;
}>;

const Prose = ({ children }: ProseProps): ReactNode => (
  <div className="mt-4 space-y-6 leading-relaxed text-foreground/80">
    {children}
  </div>
);

// Highlight span
type HighlightProps = Readonly<{
  children: ReactNode;
}>;

const Highlight = ({ children }: HighlightProps): ReactNode => (
  <span className="font-semibold text-foreground">{children}</span>
);

// Paragraph subheading
type SubheadingProps = Readonly<{
  children: ReactNode;
}>;

const Subheading = ({ children }: SubheadingProps): ReactNode => (
  <h3 className="mb-4 text-xl font-semibold text-foreground">{children}</h3>
);

// Export all MDX components
export const mdxComponents = {
  // Layout
  Section,
  SectionHeader,
  Separator,

  // Typography
  Lead,
  Prose,
  Highlight,
  Subheading,

  // Content blocks
  Callout,
  Blockquote,

  // Stats
  StatGrid,
  StatCard,

  // Features
  FeatureGrid,
  FeatureCard,

  // Check items
  CheckList,
  CheckItem,

  // CTA
  CTA,

  // Standard HTML overrides
  p: ({ children }: { readonly children: ReactNode }): ReactNode => (
    <p className="leading-relaxed text-foreground/80">{children}</p>
  ),
  h1: ({ children }: { readonly children: ReactNode }): ReactNode => (
    <h1 className="mb-6 font-serif text-4xl font-semibold text-foreground md:text-5xl">
      {children}
    </h1>
  ),
  h2: ({ children }: { readonly children: ReactNode }): ReactNode => (
    <h2 className="mb-4 font-serif text-3xl font-semibold text-foreground md:text-4xl">
      {children}
    </h2>
  ),
  h3: ({ children }: { readonly children: ReactNode }): ReactNode => (
    <h3 className="mb-3 text-xl font-semibold text-foreground">{children}</h3>
  ),
  strong: ({ children }: { readonly children: ReactNode }): ReactNode => (
    <strong className="font-semibold text-foreground">{children}</strong>
  ),
  em: ({ children }: { readonly children: ReactNode }): ReactNode => (
    <em className="font-serif italic">{children}</em>
  ),
  ul: ({ children }: { readonly children: ReactNode }): ReactNode => (
    <ul className="list-disc space-y-2 pl-6 text-foreground/80">{children}</ul>
  ),
  ol: ({ children }: { readonly children: ReactNode }): ReactNode => (
    <ol className="list-decimal space-y-2 pl-6 text-foreground/80">
      {children}
    </ol>
  ),
  li: ({ children }: { readonly children: ReactNode }): ReactNode => (
    <li>{children}</li>
  ),
  a: ({
    href,
    children,
  }: {
    readonly href?: string;
    readonly children: ReactNode;
  }): ReactNode => (
    <a
      href={href}
      className="font-medium text-primary underline decoration-primary/30 underline-offset-4 transition-colors hover:text-primary/80"
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
    >
      {children}
    </a>
  ),
  hr: (): ReactNode => <Separator className="my-8" />,
  Badge,
};

export type MDXComponents = typeof mdxComponents;
