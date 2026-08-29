import * as React from 'react'
import { Menu as BaseMenu } from '@base-ui/react'
import { cn } from '../../lib/utils'

export interface DropdownMenuProps extends React.ComponentProps<
  typeof BaseMenu.Root
> {
  modal?: boolean
}

/**
 * DropdownMenu built on @base-ui/react.
 * Default `modal={false}` prevents scroll-locking and layout shifts across the UI.
 */
export function DropdownMenu({ modal = false, ...props }: DropdownMenuProps) {
  return <BaseMenu.Root modal={modal} {...props} />
}

export interface DropdownMenuTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

export const DropdownMenuTrigger = React.forwardRef<
  HTMLButtonElement,
  DropdownMenuTriggerProps
>(({ className, asChild, children, ...props }, ref) => {
  return (
    <BaseMenu.Trigger
      ref={ref}
      render={
        asChild && React.isValidElement(children) ? (
          (children as React.ReactElement)
        ) : (
          <button
            type="button"
            className={cn('outline-none cursor-pointer', className)}
            {...props}
          >
            {children}
          </button>
        )
      }
    />
  )
})
DropdownMenuTrigger.displayName = 'DropdownMenuTrigger'

export const DropdownMenuGroup = BaseMenu.Group

export interface DropdownMenuContentProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: 'top' | 'bottom' | 'left' | 'right'
  align?: 'start' | 'center' | 'end'
  sideOffset?: number
  alignOffset?: number
}

export const DropdownMenuContent = React.forwardRef<
  HTMLDivElement,
  DropdownMenuContentProps
>(
  (
    {
      className,
      side = 'bottom',
      align = 'start',
      sideOffset = 6,
      alignOffset = 0,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <BaseMenu.Portal>
        <BaseMenu.Positioner
          side={side}
          align={align}
          sideOffset={sideOffset}
          alignOffset={alignOffset}
          positionMethod="fixed"
          className="z-50 outline-none"
        >
          <BaseMenu.Popup
            ref={ref}
            data-slot="dropdown-menu-content"
            className={cn(
              'min-w-[12rem] overflow-hidden rounded-2xl border border-border bg-card p-1 text-card-foreground shadow-xl focus:outline-none select-none z-50',
              className,
            )}
            {...props}
          >
            {children}
          </BaseMenu.Popup>
        </BaseMenu.Positioner>
      </BaseMenu.Portal>
    )
  },
)
DropdownMenuContent.displayName = 'DropdownMenuContent'

export interface DropdownMenuItemProps extends React.HTMLAttributes<HTMLDivElement> {
  inset?: boolean
  disabled?: boolean
  asChild?: boolean
  onClick?: React.MouseEventHandler<HTMLDivElement>
}

export const DropdownMenuItem = React.forwardRef<
  HTMLDivElement,
  DropdownMenuItemProps
>(
  (
    { className, inset, disabled, asChild, children, onClick, ...props },
    ref,
  ) => {
    const itemClass = cn(
      'relative flex cursor-pointer select-none items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-semibold outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0',
      inset && 'pl-8',
      className,
    )

    if (asChild && React.isValidElement(children)) {
      return (
        <BaseMenu.Item
          ref={ref}
          disabled={disabled}
          onClick={onClick}
          render={React.cloneElement(children as React.ReactElement<any>, {
            className: cn(
              (children as React.ReactElement<any>).props.className,
              itemClass,
            ),
          })}
        />
      )
    }

    return (
      <BaseMenu.Item
        ref={ref}
        disabled={disabled}
        onClick={onClick}
        className={itemClass}
        {...props}
      >
        {children}
      </BaseMenu.Item>
    )
  },
)
DropdownMenuItem.displayName = 'DropdownMenuItem'

export function DropdownMenuLabel({
  className,
  inset,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { inset?: boolean }) {
  return (
    <div
      data-slot="dropdown-menu-label"
      className={cn(
        'px-2.5 py-1.5 text-xs font-bold text-muted-foreground select-none',
        inset && 'pl-8',
        className,
      )}
      {...props}
    />
  )
}

export function DropdownMenuSeparator({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <BaseMenu.Separator
      className={cn('-mx-1 my-1 h-px bg-border', className)}
      {...props}
    />
  )
}

export function DropdownMenuShortcut({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        'ml-auto text-[10px] font-mono tracking-widest text-muted-foreground',
        className,
      )}
      {...props}
    />
  )
}
