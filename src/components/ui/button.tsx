import * as React from 'react'
import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'
import { Slot } from 'radix-ui'

import { cn } from '#/lib/utils.ts'

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-none border-2 border-transparent text-sm font-bold whitespace-nowrap transition-all outline-none focus-visible:border-ring focus-visible:ring-0 focus-visible:shadow-none focus-visible:translate-y-[2px] focus-visible:translate-x-[2px] disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground border-border shadow-brutal hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-none',
        destructive:
          'bg-destructive text-white border-border shadow-brutal hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-none focus-visible:ring-0 dark:bg-destructive dark:focus-visible:ring-0',
        outline:
          'border-border bg-background shadow-brutal hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-none hover:bg-accent hover:text-accent-foreground dark:bg-card dark:hover:bg-accent',
        secondary:
          'bg-secondary text-secondary-foreground border-border shadow-brutal hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-none',
        ghost:
          'hover:bg-accent hover:border-border hover:shadow-brutal hover:text-accent-foreground dark:hover:bg-accent hover:translate-y-[-2px]',
        link: 'text-primary underline-offset-4 hover:underline border-transparent',
      },
      size: {
        default: 'h-10 px-5 py-2 has-[>svg]:px-4',
        xs: "h-7 gap-1 px-3 text-xs has-[>svg]:px-2 [&_svg:not([class*='size-'])]:size-3",
        sm: 'h-9 gap-1.5 px-4 has-[>svg]:px-3',
        lg: 'h-12 px-8 has-[>svg]:px-6',
        icon: 'size-10',
        'icon-xs': "size-7 [&_svg:not([class*='size-'])]:size-3",
        'icon-sm': 'size-8',
        'icon-lg': 'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : 'button'

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
