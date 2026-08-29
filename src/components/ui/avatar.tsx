import * as React from 'react'
import { cn } from '../../lib/utils'

export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: 'default' | 'sm' | 'lg'
}

export function Avatar({ className, size = 'default', ...props }: AvatarProps) {
  const sizeClass = {
    sm: 'size-6',
    default: 'size-8',
    lg: 'size-10',
  }[size]

  return (
    <span
      data-slot="avatar"
      className={cn(
        'relative flex shrink-0 overflow-hidden rounded-full select-none',
        sizeClass,
        className,
      )}
      {...props}
    />
  )
}

export interface AvatarImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {}

export function AvatarImage({
  className,
  src,
  alt = '',
  ...props
}: AvatarImageProps) {
  const [hasError, setHasError] = React.useState(false)

  if (!src || hasError) return null

  return (
    <img
      data-slot="avatar-image"
      src={src}
      alt={alt}
      onError={() => setHasError(true)}
      className={cn('aspect-square size-full object-cover', className)}
      {...props}
    />
  )
}

export interface AvatarFallbackProps extends React.HTMLAttributes<HTMLSpanElement> {}

export function AvatarFallback({
  className,
  children,
  ...props
}: AvatarFallbackProps) {
  return (
    <span
      data-slot="avatar-fallback"
      className={cn(
        'flex size-full items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground',
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}
