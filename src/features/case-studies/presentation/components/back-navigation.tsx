'use client';

import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';

type BackNavigationProps = {
  readonly href: string;
  readonly label: string;
};

export const BackNavigation = ({
  href,
  label,
}: BackNavigationProps): ReactNode => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, ease: 'easeOut' }}
    className="mx-auto mb-12 max-w-4xl px-6"
  >
    <Link
      href={href}
      className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </Link>
  </motion.div>
);
