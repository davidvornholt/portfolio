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
import {
  div as MotionDiv,
  section as MotionSection,
} from 'motion/react-client';
import { Children, isValidElement, type ReactNode } from 'react';

import { Badge } from '@/shared/ui/presentation/components/badge';
import { Separator } from '@/shared/ui/presentation/components/separator';

// =============================================================================
// Animation Presets
// =============================================================================

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

// =============================================================================
// Icon Map (for string-based icon references in JSX components)
// =============================================================================

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

// =============================================================================
// Utility: Parse Section Header (# NN Title)
// =============================================================================

const extractTextContent = (children: ReactNode): string => {
  if (typeof children === 'string') return children;
  if (typeof children === 'number') return String(children);
  if (Array.isArray(children)) return children.map(extractTextContent).join('');
  if (isValidElement(children)) {
    const props = children.props as { children?: ReactNode };
    if (props.children) {
      return extractTextContent(props.children);
    }
  }
  return '';
};

const parseSectionHeader = (
  children: ReactNode,
): { number: string; title: string } | null => {
  const text = extractTextContent(children);
  if (!text) return null;

  // Match pattern: "NN Title" where NN is typically 01, 02, etc.
  const match = text.match(/^(\d{2})\s+(.+)$/);
  if (match) {
    return { number: match[1], title: match[2] };
  }
  return null;
};

// =============================================================================
// Markdown Element Overrides
// =============================================================================

// H1 → Section with SectionHeader (# 01 The Challenge)
const H1 = ({ children }: { readonly children: ReactNode }): ReactNode => {
  const parsed = parseSectionHeader(children);

  if (parsed) {
    return (
      <div className="mb-8 flex items-baseline gap-4">
        <span className="font-mono text-sm font-medium text-primary">
          {parsed.number}
        </span>
        <h2 className="font-serif text-3xl font-semibold text-foreground md:text-4xl">
          {parsed.title}
        </h2>
      </div>
    );
  }

  // Fallback for non-numbered H1s
  return (
    <h1 className="mb-6 font-serif text-4xl font-semibold text-foreground md:text-5xl">
      {children}
    </h1>
  );
};

// H2 → Lead paragraph styling
const H2 = ({ children }: { readonly children: ReactNode }): ReactNode => (
  <p className="mb-6 text-lg font-medium text-foreground">{children}</p>
);

// H3 → Subheading
const H3 = ({ children }: { readonly children: ReactNode }): ReactNode => (
  <h3 className="mb-4 mt-8 text-xl font-semibold text-foreground">
    {children}
  </h3>
);

// Paragraph → Prose styling
const Paragraph = ({
  children,
}: {
  readonly children: ReactNode;
}): ReactNode => (
  <p className="mb-6 leading-relaxed text-foreground/80">{children}</p>
);

// Strong → Highlight
const Strong = ({ children }: { readonly children: ReactNode }): ReactNode => (
  <strong className="font-semibold text-foreground">{children}</strong>
);

// Emphasis → Italic with serif
const Emphasis = ({
  children,
}: {
  readonly children: ReactNode;
}): ReactNode => <em className="font-serif italic">{children}</em>;

// Blockquote → Editorial quote card
const BlockquoteElement = ({
  children,
}: {
  readonly children: ReactNode;
}): ReactNode => {
  // Extract author from cite element if present
  let author: string | undefined;
  let quoteContent: ReactNode = children;

  Children.forEach(children, (child) => {
    if (isValidElement(child) && child.type === 'cite') {
      const props = child.props as { children?: ReactNode };
      author = extractTextContent(props.children);
    }
  });

  // Filter out cite from quote content
  if (author) {
    quoteContent = Children.toArray(children).filter(
      (child) => !(isValidElement(child) && child.type === 'cite'),
    );
  }

  return (
    <blockquote className="relative mt-8 rounded-lg border border-border bg-card p-8">
      <div className="absolute -top-3 left-6 bg-background px-2">
        <span className="font-serif text-4xl text-primary">&ldquo;</span>
      </div>
      <div className="font-serif text-lg italic text-foreground">
        {quoteContent}
      </div>
      {author && (
        <footer className="mt-4 text-sm text-muted-foreground">
          — {author}
        </footer>
      )}
    </blockquote>
  );
};

// Unordered List
const UnorderedList = ({
  children,
}: {
  readonly children: ReactNode;
}): ReactNode => (
  <ul className="mb-6 list-disc space-y-2 pl-6 text-foreground/80">
    {children}
  </ul>
);

// Ordered List
const OrderedList = ({
  children,
}: {
  readonly children: ReactNode;
}): ReactNode => (
  <ol className="mb-6 list-decimal space-y-2 pl-6 text-foreground/80">
    {children}
  </ol>
);

// List Item
const ListItem = ({
  children,
}: {
  readonly children: ReactNode;
}): ReactNode => <li>{children}</li>;

// Link
const Anchor = ({
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
);

// Horizontal Rule
const HorizontalRule = (): ReactNode => <Separator className="my-8" />;

// =============================================================================
// Section Wrapper (for animated sections in MDX)
// =============================================================================

type SectionProps = Readonly<{
  children: ReactNode;
  className?: string;
}>;

const Section = ({ children, className = '' }: SectionProps): ReactNode => (
  <MotionSection
    {...fadeInUp}
    transition={{ duration: 0.6, ease: 'easeOut' }}
    className={`mx-auto mb-20 max-w-4xl px-6 ${className}`}
  >
    {children}
  </MotionSection>
);

// =============================================================================
// Complex JSX Components (remain as explicit tags)
// =============================================================================

// Callout
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

// Blockquote (explicit JSX version with author prop)
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

// StatCard
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
  <MotionDiv
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
  </MotionDiv>
);

// StatGrid
type StatGridProps = Readonly<{
  children: ReactNode;
}>;

const StatGrid = ({ children }: StatGridProps): ReactNode => (
  <MotionDiv
    variants={staggerContainer}
    initial="initial"
    whileInView="whileInView"
    viewport={{ once: true, margin: '-100px' }}
    className="my-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
  >
    {children}
  </MotionDiv>
);

// FeatureCard
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
  <MotionDiv
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
  </MotionDiv>
);

// FeatureGrid
type FeatureGridProps = Readonly<{
  children: ReactNode;
}>;

const FeatureGrid = ({ children }: FeatureGridProps): ReactNode => (
  <div className="mt-8 grid gap-6 md:grid-cols-3">{children}</div>
);

// CheckItem
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

// CheckList
type CheckListProps = Readonly<{
  children: ReactNode;
}>;

const CheckList = ({ children }: CheckListProps): ReactNode => (
  <div className="mt-8 space-y-4">{children}</div>
);

// CTA
type CTAProps = Readonly<{
  title: string;
  description: string;
  href: string;
  linkText: string;
}>;

const CTA = ({ title, description, href, linkText }: CTAProps): ReactNode => (
  <MotionSection
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
  </MotionSection>
);

// =============================================================================
// MDX Component Map Export
// =============================================================================

export const mdxComponents = {
  // Markdown element overrides (auto-applied to standard syntax)
  h1: H1,
  h2: H2,
  h3: H3,
  p: Paragraph,
  strong: Strong,
  em: Emphasis,
  blockquote: BlockquoteElement,
  ul: UnorderedList,
  ol: OrderedList,
  li: ListItem,
  a: Anchor,
  hr: HorizontalRule,

  // Explicit JSX components (for complex structured content)
  Section,
  Callout,
  Blockquote,
  StatGrid,
  StatCard,
  FeatureGrid,
  FeatureCard,
  CheckList,
  CheckItem,
  CTA,
  Separator,
  Badge,
};

export type MDXComponents = typeof mdxComponents;
