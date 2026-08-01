import * as React from 'react'

import { cn } from '#/lib/utils.ts'

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'flex field-sizing-content min-h-16 w-full rounded-none border-2 border-border bg-card px-3 py-2 text-base font-bold shadow-brutal transition-[all] outline-none placeholder:text-muted-foreground focus-visible:border-border focus-visible:shadow-none focus-visible:translate-y-[2px] focus-visible:translate-x-[2px] disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 md:text-sm dark:bg-card dark:aria-invalid:ring-destructive/40',
        className,
      )}
      {...props}
    />
  )
}

export { Textarea }
