import { Award, Globe } from 'lucide-react';
import { div as MotionDiv, header as MotionHeader } from 'motion/react-client';
import type { ReactNode } from 'react';
import { Badge } from '@/shared/ui/presentation/components/badge';
import { CertificationItem } from './certification-item';
import {
  certifications,
  type ExpertiseCategory,
  expertiseCategories,
  type Language,
  languages,
} from './expertise-data';

const expertiseCardStaggerSeconds = 0.1;
const languageInitialDelaySeconds = 0.4;
const languageStaggerSeconds = 0.1;

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
    <MotionDiv
      {...fadeInUp}
      transition={{
        duration: 0.6,
        ease: 'easeOut',
        delay: index * expertiseCardStaggerSeconds,
      }}
      className="group rounded-lg border border-border bg-card p-6 transition-colors hover:border-primary/20"
    >
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <h3 className="font-semibold font-serif text-foreground text-lg">
          {category.title}
        </h3>
      </div>

      <p className="mb-4 text-muted-foreground text-sm leading-relaxed">
        {category.description}
      </p>

      <div className="flex flex-wrap gap-2">
        {category.items.map((item) => (
          <Badge key={item} variant="secondary" className="font-mono text-xs">
            {item}
          </Badge>
        ))}
      </div>
    </MotionDiv>
  );
};

const LanguageItem = ({
  language,
  index,
}: {
  readonly language: Language;
  readonly index: number;
}): ReactNode => (
  <MotionDiv
    {...fadeInUp}
    transition={{
      duration: 0.6,
      ease: 'easeOut',
      delay: languageInitialDelaySeconds + index * languageStaggerSeconds,
    }}
    className="flex items-center justify-between border-border border-b py-4 last:border-b-0"
  >
    <div className="flex items-center gap-3">
      <Globe className="h-4 w-4 text-muted-foreground" />
      <span className="font-medium text-foreground">{language.name}</span>
    </div>
    <div className="flex items-center gap-2">
      <span className="text-muted-foreground text-sm">{language.level}</span>
      <Badge variant="outline" className="font-mono text-xs">
        {language.proficiency}
      </Badge>
    </div>
  </MotionDiv>
);

export const Expertise = (): ReactNode => (
  <section id="expertise" className="bg-muted/30 px-6 py-24 md:py-32">
    <div className="mx-auto max-w-6xl">
      <MotionHeader
        {...fadeInUp}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="mb-16"
      >
        <p className="mb-2 font-medium text-primary text-sm uppercase tracking-widest">
          Capabilities
        </p>
        <h2 className="font-semibold font-serif text-4xl text-foreground md:text-5xl">
          Expertise & Competencies
        </h2>
      </MotionHeader>

      <div className="mb-8 grid gap-6 md:grid-cols-2">
        {expertiseCategories.map((category, index) => (
          <ExpertiseCard key={category.id} category={category} index={index} />
        ))}
      </div>

      <MotionDiv
        {...fadeInUp}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.3 }}
        className="rounded-lg border border-border bg-card p-6"
      >
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
            <Globe className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold font-serif text-foreground text-lg">
              The Polyglot Advantage
            </h3>
            <p className="text-muted-foreground text-sm">
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
      </MotionDiv>

      {/* Verified Expertise */}
      <MotionDiv
        {...fadeInUp}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.4 }}
        className="mt-8"
      >
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
            <Award className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold font-serif text-foreground text-lg">
              Verified Expertise
            </h3>
            <p className="text-muted-foreground text-sm">
              Professional certifications as proof of competence
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {certifications.map((certification, index) => (
            <CertificationItem
              key={certification.title}
              certification={certification}
              index={index}
            />
          ))}
        </div>
      </MotionDiv>
    </div>
  </section>
);
