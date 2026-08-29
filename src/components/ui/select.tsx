import * as React from 'react'
import { Select as BaseSelect } from '@base-ui/react'
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from './icon'
import { cn } from '#/lib/utils'

/**
 * Context that enables SelectValue to automatically resolve and render
 * human-readable labels from registered SelectItems or provided items config.
 */
interface SelectLabelContextValue {
  labels: Record<string, React.ReactNode>
  registerLabel: (value: any, label: React.ReactNode) => void
  items?: any
}

const SelectLabelContext = React.createContext<SelectLabelContextValue>({
  labels: {},
  registerLabel: () => {},
})

export interface SelectProps extends Omit<
  React.ComponentProps<typeof BaseSelect.Root>,
  'onValueChange'
> {
  items?: any
  onValueChange?: (value: any, eventDetails?: any) => void
}

/**
 * Root Select component powered by @base-ui/react.
 * Wraps BaseSelect.Root and provides label context for its children.
 */
function Select({ items, children, ...props }: SelectProps) {
  const [labels, setLabels] = React.useState<Record<string, React.ReactNode>>(
    {},
  )

  const registerLabel = React.useCallback(
    (value: any, label: React.ReactNode) => {
      if (value !== undefined && value !== null) {
        setLabels((prev) =>
          prev[String(value)] === label
            ? prev
            : { ...prev, [String(value)]: label },
        )
      }
    },
    [],
  )

  return (
    <SelectLabelContext.Provider value={{ labels, registerLabel, items }}>
      <BaseSelect.Root data-slot="select" items={items} {...props}>
        {children}
      </BaseSelect.Root>
    </SelectLabelContext.Provider>
  )
}

function SelectGroup({
  className,
  ...props
}: React.ComponentProps<typeof BaseSelect.Group>) {
  return (
    <BaseSelect.Group
      data-slot="select-group"
      className={cn('scroll-my-1 p-1', className)}
      {...props}
    />
  )
}

export interface SelectValueProps extends React.ComponentProps<
  typeof BaseSelect.Value
> {
  placeholder?: React.ReactNode
}

/**
 * Select value display component.
 * Automatically resolves and displays the item label matching the selected value.
 */
function SelectValue({
  placeholder,
  className,
  children,
  ...props
}: SelectValueProps) {
  const { labels, items } = React.useContext(SelectLabelContext)

  return (
    <BaseSelect.Value
      data-slot="select-value"
      placeholder={placeholder}
      className={cn('truncate', className)}
      {...props}
    >
      {typeof children === 'function'
        ? children
        : (val) => {
            if (val === null || val === undefined || val === '') {
              return placeholder
            }
            if (items && Array.isArray(items)) {
              const found = items.find((i: any) => i.value === val)
              if (found && found.label) return found.label
            }
            if (items && typeof items === 'object') {
              if (items[val]) return items[val]
            }
            const registered = labels[String(val)]
            return registered ?? val
          }}
    </BaseSelect.Value>
  )
}

function SelectTrigger({
  className,
  size = 'default',
  children,
  ...props
}: React.ComponentProps<typeof BaseSelect.Trigger> & {
  size?: 'sm' | 'default'
}) {
  return (
    <BaseSelect.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        "flex w-fit items-center justify-between gap-1.5 rounded-xl border border-input bg-transparent py-2 pr-3 pl-3.5 text-sm whitespace-nowrap transition-colors outline-none select-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 data-placeholder:text-muted-foreground data-[size=default]:h-10 data-[size=sm]:h-8 data-[size=sm]:rounded-lg *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-1.5 dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 cursor-pointer",
        className,
      )}
      {...props}
    >
      {children}
      <BaseSelect.Icon>
        <ChevronDownIcon className="pointer-events-none size-4 text-muted-foreground" />
      </BaseSelect.Icon>
    </BaseSelect.Trigger>
  )
}

interface SelectContentProps extends React.ComponentProps<
  typeof BaseSelect.Popup
> {
  sideOffset?: number
  align?: 'start' | 'center' | 'end'
  side?: 'top' | 'bottom' | 'left' | 'right'
}

function SelectContent({
  className,
  children,
  sideOffset = 4,
  align = 'center',
  side = 'bottom',
  ...props
}: SelectContentProps) {
  return (
    <BaseSelect.Portal>
      <BaseSelect.Positioner
        sideOffset={sideOffset}
        align={align}
        side={side}
        className="z-50"
      >
        <BaseSelect.Popup
          data-slot="select-content"
          className={cn(
            'relative z-50 max-h-96 min-w-36 overflow-x-hidden overflow-y-auto rounded-xl border border-border bg-card p-1 text-card-foreground shadow-xl ring-1 ring-foreground/5 duration-100 outline-none select-none',
            'transition-all data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0',
            className,
          )}
          {...props}
        >
          {children}
        </BaseSelect.Popup>
      </BaseSelect.Positioner>
    </BaseSelect.Portal>
  )
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof BaseSelect.GroupLabel>) {
  return (
    <BaseSelect.GroupLabel
      data-slot="select-label"
      className={cn(
        'px-2.5 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider',
        className,
      )}
      {...props}
    />
  )
}

function SelectItem({
  className,
  children,
  value,
  ...props
}: React.ComponentProps<typeof BaseSelect.Item>) {
  const { registerLabel } = React.useContext(SelectLabelContext)

  React.useEffect(() => {
    if (value !== undefined && value !== null) {
      registerLabel(value, children)
    }
  }, [value, children, registerLabel])

  return (
    <BaseSelect.Item
      value={value}
      data-slot="select-item"
      className={cn(
        "relative flex w-full cursor-pointer items-center justify-between gap-2 rounded-lg py-2 pr-8 pl-3 text-sm font-medium outline-hidden select-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[selected]:bg-primary/10 data-[selected]:text-primary data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      <BaseSelect.ItemText className="flex items-center gap-2 truncate">
        {children}
      </BaseSelect.ItemText>
      <span className="pointer-events-none absolute right-2.5 flex size-4 items-center justify-center">
        <BaseSelect.ItemIndicator>
          <CheckIcon className="size-4 text-primary" />
        </BaseSelect.ItemIndicator>
      </span>
    </BaseSelect.Item>
  )
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof BaseSelect.Separator>) {
  return (
    <BaseSelect.Separator
      data-slot="select-separator"
      className={cn('pointer-events-none -mx-1 my-1 h-px bg-border', className)}
      {...props}
    />
  )
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof BaseSelect.ScrollUpArrow>) {
  return (
    <BaseSelect.ScrollUpArrow
      data-slot="select-scroll-up-button"
      className={cn(
        "z-10 flex cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      <ChevronUpIcon />
    </BaseSelect.ScrollUpArrow>
  )
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof BaseSelect.ScrollDownArrow>) {
  return (
    <BaseSelect.ScrollDownArrow
      data-slot="select-scroll-down-button"
      className={cn(
        "z-10 flex cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      <ChevronDownIcon />
    </BaseSelect.ScrollDownArrow>
  )
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
