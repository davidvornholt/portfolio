import Image from 'next/image';

const Register = () => (
  <div className="register" aria-hidden="true">
    <div className="flex items-center justify-between border-current border-b pb-1">
      <strong>Class register</strong>
      <span className="font-mono text-[8px]">MON</span>
    </div>
    {['08:00', '08:50', '09:55'].map((time, i) => (
      <div
        key={time}
        className="mt-2 grid grid-cols-[3em_1fr] items-center gap-2 text-[9px]"
      >
        <span>{time}</span>
        <span className="border-primary border-l-2 bg-secondary px-2 py-1">
          {['Literature', 'Biology', 'Mathematics'][i]}
        </span>
      </div>
    ))}
  </div>
);
export const WorkPlate = ({ slug }: { readonly slug: string }) => (
  <div className="work-plate" data-plate={slug} aria-hidden="true">
    {slug === 'prosabridge' && (
      <Image
        src="/stills/turn.webp"
        alt=""
        sizes="(max-width: 760px) 92vw"
        fill={true}
        className="object-cover"
      />
    )}{' '}
    {slug === 'atrium' && <Register />}{' '}
    {slug === 'fes-kirchheim' && (
      <div className="search-print">
        <span>Search impressions</span>
        <strong>
          +300<span>%</span>
        </strong>
        <span>Year over year</span>
      </div>
    )}
  </div>
);
