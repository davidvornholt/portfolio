import {
  Cloud,
  Code2,
  type LucideIcon,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
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
    id: 'product',
    icon: Code2,
    title: 'Product engineering',
    description:
      'Typed end to end. Untrusted input is validated at the boundary, expected failures are typed errors, and the compiler enforces the contract between server and screen.',
    items: [
      'TypeScript',
      'Effect',
      'Bun',
      'Next.js',
      'TanStack Start',
      'PostgreSQL',
      'Tailwind CSS v4',
    ],
  },
  {
    id: 'ai',
    icon: Sparkles,
    title: 'AI engineering',
    description:
      'Agents write most of my code under strict quality gates, and LLM pipelines run in my products. Nothing ships on a model’s word.',
    items: [
      'LLM pipelines',
      'MCP servers',
      'Agent skills',
      'Review loops',
      'Structured outputs',
    ],
  },
  {
    id: 'infrastructure',
    icon: Cloud,
    title: 'Declarative infrastructure',
    description:
      'Servers are described in code, changed through reviewed pull requests, and converged to match the repository. Secrets stay encrypted at rest.',
    items: ['NixOS', 'OpenTofu', 'Podman', 'SOPS', 'GitHub Actions', 'Caddy'],
  },
  {
    id: 'quality',
    icon: ShieldCheck,
    title: 'Quality gates',
    description:
      'Lint, types, tests, and accessibility run as one command that must pass before anything merges. The gates strengthen over time and never weaken.',
    items: [
      'Strict TypeScript',
      'Biome',
      'Playwright + Axe',
      'WCAG 2.2 AA',
      'Fail-closed CI',
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
      'Building scalable, accessible web applications and complex UI architectures.',
    href: 'https://www.coursera.org/account/accomplishments/professional-cert/CLARJJOBU3KW',
  },
  {
    issuer: 'IBM',
    title: 'DevOps and Software Engineering Professional',
    description:
      'CI/CD pipelines, Docker, Kubernetes, and cloud-native development.',
    href: 'https://www.coursera.org/account/accomplishments/verify/ZUBODAYX2VM5',
  },
  {
    issuer: 'UC Irvine',
    title: 'Specialized Go Programming',
    description: 'Concurrent programming and back-end architecture in Go.',
    href: 'https://www.coursera.org/account/accomplishments/verify/M0MK09J5OSBX',
  },
];
