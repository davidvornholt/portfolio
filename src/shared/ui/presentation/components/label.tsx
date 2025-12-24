'use client';

import { cn } from '@/shared/ui/services/utils';

function Label({
  className,
  htmlFor,
  children,
  ...props
}: React.ComponentProps<'label'>) {
  if (!htmlFor && !children) {
    throw new Error(
      'Label must have either a htmlFor prop or children containing a form control.',
    );
  }

  return (
    <label
      data-slot="label"
      className={cn(
        'gap-2 text-sm leading-none font-medium group-data-[disabled=true]:opacity-50 peer-disabled:opacity-50 flex items-center select-none group-data-[disabled=true]:pointer-events-none peer-disabled:cursor-not-allowed',
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
