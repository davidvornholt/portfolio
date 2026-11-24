import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const BackNavigation = ({
  href,
  label,
}: {
  readonly href: string;
  readonly label: string;
}) => (
  <Link href={href} className="ink-link my-3 text-sm">
    <ArrowLeft size={16} />
    {label}
  </Link>
);
