import { Braces, Cloud, Code2, type LucideIcon, Sparkles } from 'lucide-react';
import type { Certification } from './certification';

export type ExpertiseCategory = {
  readonly id: string;
  readonly icon: LucideIcon;
  readonly title: string;
  readonly description: string;
  readonly items: ReadonlyArray<string>;
};

export type Language = {
  readonly name: string;
  readonly level: string;
  readonly proficiency: string;
};

export const expertiseCategories: ReadonlyArray<ExpertiseCategory> = [
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
];

export const languages: ReadonlyArray<Language> = [
  { name: 'German', level: 'Native', proficiency: 'C2' },
  { name: 'English', level: 'Full Professional', proficiency: 'C2' },
  { name: 'French', level: 'Intermediate', proficiency: 'B1' },
  { name: 'Spanish', level: 'Intermediate', proficiency: 'B1' },
];

export const certifications: ReadonlyArray<Certification> = [
  {
    issuer: 'Meta',
    title: 'Front-End Professional Certificate',
    description:
      'Specialization in building scalable, accessible web applications and complex UI architectures.',
    href: 'https://www.coursera.org/account/accomplishments/professional-cert/CLARJJOBU3KW',
  },
  {
    issuer: 'IBM',
    title: 'DevOps and Software Engineering Professional',
    description:
      'Certified in CI/CD pipelines, Docker, Kubernetes, and Cloud-native development.',
    href: 'https://www.coursera.org/account/accomplishments/verify/ZUBODAYX2VM5',
  },
  {
    issuer: 'UC Irvine',
    title: 'Specialized Go Programming',
    description:
      'Expertise in concurrent systems programming and scalable back-end architecture.',
    href: 'https://www.coursera.org/account/accomplishments/verify/M0MK09J5OSBX',
  },
];
