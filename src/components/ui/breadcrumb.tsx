import * as React from 'react'
import { ChevronRight, MoreHorizontal } from './icon'
import { cn } from '../../lib/utils'

export function Breadcrumb({ ...props }: React.ComponentProps<'nav'>) {
  return <nav aria-label="breadcrumb" data-slot="breadcrumb" {...props} />
}

export function BreadcrumbList({
  className,
  ...props
}: React.ComponentProps<'ol'>) {
  return (
    <ol
      data-slot="breadcrumb-list"
      className={cn(
        'flex flex-wrap items-center gap-1.5 text-xs break-words text-muted-foreground sm:gap-2',
        className,
      )}
      {...props}
    />
  )
}

export function BreadcrumbItem({
  className,
  ...props
}: React.ComponentProps<'li'>) {
  return (
    <li
      data-slot="breadcrumb-item"
      className={cn('inline-flex items-center gap-1.5', className)}
      {...props}
    />
  )
}

export function BreadcrumbLink({
  asChild,
  className,
  children,
  ...props
}: React.ComponentProps<'a'> & {
  asChild?: boolean
}) {
  const linkClass = cn('transition-colors hover:text-foreground', className)

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      className: cn(
        (children as React.ReactElement<any>).props.className,
        linkClass,
      ),
    })
  }

  return (
    <a data-slot="breadcrumb-link" className={linkClass} {...props}>
      {children}
    </a>
  )
}

export function BreadcrumbPage({
  className,
  ...props
}: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="breadcrumb-page"
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn('font-semibold text-foreground', className)}
      {...props}
    />
  )
}

export function BreadcrumbSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<'li'>) {
  return (
    <li
      data-slot="breadcrumb-separator"
      role="presentation"
      aria-hidden="true"
      className={cn('text-muted-foreground/60', className)}
      {...props}
    >
      {children ?? <ChevronRight className="size-3.5" />}
    </li>
  )
}

export function BreadcrumbEllipsis({
  className,
  ...props
}: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      aria-hidden="true"
      className={cn('flex size-6 items-center justify-center', className)}
      {...props}
    >
      <MoreHorizontal className="size-3.5" />
      <span className="sr-only">More</span>
    </span>
  )
}
