'use client';

import { motion } from 'framer-motion';
import {
  Braces,
  Cloud,
  Code2,
  Globe,
  type LucideIcon,
  Sparkles,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { Badge } from '@/shared/ui/presentation/components/badge';

type ExpertiseCategory = {
  readonly id: string;
  readonly icon: LucideIcon;
  readonly title: string;
  readonly description: string;
  readonly items: readonly string[];
};

type Language = {
  readonly name: string;
  readonly level: string;
  readonly proficiency: string;
};

const expertiseCategories: readonly ExpertiseCategory[] = [
  {
    id: 'principles',
    icon: Sparkles,
    title: 'Engineering Principles',
    description:
      'Deeply committed to the standards set by Robert C. Martin ("Uncle Bob"). I write code that is maintainable, testable, and self-documenting.',
    items: [
      'Clean Code',
      'SOLID Principles',
      'Functional Paradigm',
      'Test-Driven Development',
      'Domain-Driven Design',
    ],
  },
  {
    id: 'stack',
    icon: Code2,
    title: 'Technical Stack',
    description:
      'Proficient in modern web technologies with a focus on type safety and developer experience.',
    items: [
      'TypeScript',
      'Next.js 16',
      'TanStack Start',
      'Node.js',
      'Bun',
      'Tailwind CSS v4',
      'shadcn/ui',
    ],
  },
  {
    id: 'infrastructure',
    icon: Cloud,
    title: 'Infrastructure & DevOps',
    description:
      'IBM Certified CI/CD specialist with expertise in container orchestration and cloud deployment.',
    items: [
      'Docker',
      'Kubernetes',
      'OpenShift',
      'GitHub Actions',
      'Linux',
      'Performance Optimization',
    ],
  },
  {
    id: 'backend',
    icon: Braces,
    title: 'Systems Programming',
    description:
      'Specialized in Go programming with certifications from UC Irvine covering concurrency and interfaces.',
    items: [
      'Go',
      'Concurrency Patterns',
      'REST APIs',
      'GraphQL',
      'Database Design',
      'Scalable Architecture',
    ],
  },
] as const;

const languages: readonly Language[] = [
  { name: 'German', level: 'Native', proficiency: 'C2' },
  { name: 'English', level: 'Full Professional', proficiency: 'C2' },
  { name: 'French', level: 'Intermediate', proficiency: 'B1' },
  { name: 'Spanish', level: 'Intermediate', proficiency: 'B1' },
] as const;

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
};

const ExpertiseCard = ({
  category,
  index,
}: {
  readonly category: ExpertiseCategory;
  readonly index: number;
}): ReactNode => {
  const Icon = category.icon;

  return (
    <motion.div
      {...fadeInUp}
      transition={{ duration: 0.6, ease: 'easeOut', delay: index * 0.1 }}
      className="group rounded-lg border border-border bg-card p-6 transition-colors hover:border-primary/20"
    >
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <h3 className="font-serif text-lg font-semibold text-foreground">
          {category.title}
        </h3>
      </div>

      <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
        {category.description}
      </p>

      <div className="flex flex-wrap gap-2">
        {category.items.map((item) => (
          <Badge key={item} variant="secondary" className="font-mono text-xs">
            {item}
          </Badge>
        ))}
      </div>
    </motion.div>
  );
};

const LanguageItem = ({
  language,
  index,
}: {
  readonly language: Language;
  readonly index: number;
}): ReactNode => (
  <motion.div
    {...fadeInUp}
    transition={{ duration: 0.6, ease: 'easeOut', delay: 0.4 + index * 0.1 }}
    className="flex items-center justify-between border-b border-border py-4 last:border-b-0"
  >
    <div className="flex items-center gap-3">
      <Globe className="h-4 w-4 text-muted-foreground" />
      <span className="font-medium text-foreground">{language.name}</span>
    </div>
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">{language.level}</span>
      <Badge variant="outline" className="font-mono text-xs">
        {language.proficiency}
      </Badge>
    </div>
  </motion.div>
);

export const Expertise = (): ReactNode => (
  <section id="expertise" className="bg-muted/30 px-6 py-24 md:py-32">
    <div className="mx-auto max-w-6xl">
      <motion.header
        {...fadeInUp}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="mb-16"
      >
        <p className="mb-2 text-sm font-medium uppercase tracking-widest text-primary">
          Capabilities
        </p>
        <h2 className="font-serif text-4xl font-semibold text-foreground md:text-5xl">
          Expertise & Competencies
        </h2>
      </motion.header>

      <div className="mb-16 grid gap-6 md:grid-cols-2">
        {expertiseCategories.map((category, index) => (
          <ExpertiseCard key={category.id} category={category} index={index} />
        ))}
      </div>

      <motion.div
        {...fadeInUp}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.3 }}
        className="rounded-lg border border-border bg-card p-6"
      >
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
            <Globe className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-semibold text-foreground">
              The Polyglot Advantage
            </h3>
            <p className="text-sm text-muted-foreground">
              Languages bridge cultures and enable global collaboration
            </p>
          </div>
        </div>

        <div className="divide-y divide-border">
          {languages.map((language, index) => (
            <LanguageItem
              key={language.name}
              language={language}
              index={index}
            />
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);
