'use client';

import { cn } from '@/shared/ui/services/utils';

function Label({
  className,
  htmlFor,
  children,
  ...props
}: React.ComponentProps<'label'>) {
  if (!(htmlFor || children)) {
    throw new Error(
      'Label must have either a htmlFor prop or children containing a form control.',
    );
  }

  return (
    <label
      data-slot="label"
      className={cn(
        'flex select-none items-center gap-2 font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50 group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50',
        className,
      )}
      htmlFor={htmlFor}
      {...props}
    >
      {children}
    </label>
  );
}

export { Label };
