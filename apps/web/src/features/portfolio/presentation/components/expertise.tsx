import { easing } from '@portfolio/ui/easing';
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
        ease: easing,
        delay: index * expertiseCardStaggerSeconds,
      }}
      className="border border-border p-6 transition-colors hover:border-primary/40"
    >
      <div className="mb-4 flex items-center gap-3">
        <Icon className="size-5 text-primary" />
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
      ease: easing,
      delay: languageInitialDelaySeconds + index * languageStaggerSeconds,
    }}
    className="flex items-center justify-between border-border border-b py-4 last:border-b-0"
  >
    <div className="flex items-center gap-3">
      <Globe className="size-4 text-muted-foreground" />
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
  <section
    id="expertise"
    className="border-border border-t px-6 py-24 md:py-32"
  >
    <div className="mx-auto max-w-6xl">
      <MotionHeader
        {...fadeInUp}
        transition={{ duration: 0.6, ease: easing }}
        className="mb-16"
      >
        <p className="mb-2 font-medium text-primary text-sm uppercase tracking-widest">
          Capabilities
        </p>
        <h2 className="font-semibold font-serif text-4xl text-foreground md:text-5xl">
          Expertise & competencies
        </h2>
      </MotionHeader>

      <div className="mb-16 grid gap-6 md:grid-cols-2">
        {expertiseCategories.map((category, index) => (
          <ExpertiseCard key={category.id} category={category} index={index} />
        ))}
      </div>

      <MotionDiv
        {...fadeInUp}
        transition={{ duration: 0.6, ease: easing, delay: 0.3 }}
        className="mb-16"
      >
        <div className="mb-4 flex items-center gap-3">
          <Globe className="size-5 text-primary" />
          <div>
            <h3 className="font-semibold font-serif text-foreground text-lg">
              The polyglot advantage
            </h3>
            <p className="text-muted-foreground text-sm">
              Languages bridge cultures and enable global collaboration
            </p>
          </div>
        </div>

        <div className="divide-y divide-border border-border border-t">
          {languages.map((language, index) => (
            <LanguageItem
              key={language.name}
              language={language}
              index={index}
            />
          ))}
        </div>
      </MotionDiv>

      <MotionDiv
        {...fadeInUp}
        transition={{ duration: 0.6, ease: easing, delay: 0.4 }}
      >
        <div className="mb-6 flex items-center gap-3">
          <Award className="size-5 text-primary" />
          <div>
            <h3 className="font-semibold font-serif text-foreground text-lg">
              Verified expertise
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
