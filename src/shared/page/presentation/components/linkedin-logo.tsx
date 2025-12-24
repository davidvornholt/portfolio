import Image from 'next/image';
import linkedIn from '@/../public/linkedin-black.png';

export const LinkedInLogo = ({ className }: { className?: string }) => (
  <Image src={linkedIn} alt="LinkedIn Logo" className={className} />
);
