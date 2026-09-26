import * as React from 'react'
import { AlertCircle, AlertTriangle, CheckCircle2, Info } from '../ui/icon'
import { Button } from '../ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'

export type AlertType = 'info' | 'success' | 'warning' | 'error'

export interface AlertModalProps {
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  title: React.ReactNode
  description?: React.ReactNode
  type?: AlertType
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
  onCancel?: () => void
  children?: React.ReactNode
}

const alertConfig: Record<
  AlertType,
  {
    icon: React.ReactNode
    iconContainerClass: string
    buttonVariant: 'default' | 'destructive'
  }
> = {
  info: {
    icon: <Info className="h-6 w-6" />,
    iconContainerClass: 'bg-primary/10 text-primary',
    buttonVariant: 'default',
  },
  success: {
    icon: <CheckCircle2 className="h-6 w-6" />,
    iconContainerClass:
      'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
    buttonVariant: 'default',
  },
  warning: {
    icon: <AlertTriangle className="h-6 w-6" />,
    iconContainerClass: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
    buttonVariant: 'default',
  },
  error: {
    icon: <AlertCircle className="h-6 w-6" />,
    iconContainerClass: 'bg-destructive/15 text-destructive',
    buttonVariant: 'destructive',
  },
}

export function AlertModal({
  trigger,
  open,
  onOpenChange,
  title,
  description,
  type = 'info',
  confirmText = 'OK',
  cancelText,
  onConfirm,
  onCancel,
  children,
}: AlertModalProps) {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const isControlled = open !== undefined
  const isOpen = isControlled ? open : internalOpen
  const setIsOpen = isControlled
    ? (onOpenChange ?? (() => {}))
    : setInternalOpen

  const cfg = alertConfig[type]

  const handleConfirm = () => {
    onConfirm?.()
    setIsOpen(false)
  }

  const handleCancel = () => {
    onCancel?.()
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {trigger && (
        <DialogTrigger
          render={(props) => {
            if (React.isValidElement(trigger)) {
              return React.cloneElement(
                trigger as React.ReactElement<any>,
                props,
              )
            }
            return <button {...props}>{trigger}</button>
          }}
        />
      )}
      <DialogContent className="max-w-sm text-center">
        <DialogHeader className="items-center text-center">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-full mb-2 ${cfg.iconContainerClass}`}
          >
            {cfg.icon}
          </div>
          <DialogTitle className="text-center font-semibold text-lg text-foreground">
            {title}
          </DialogTitle>
          {description && (
            <DialogDescription className="text-center text-xs leading-relaxed text-muted-foreground">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        {children && <div className="mt-2 text-left">{children}</div>}

        <DialogFooter className="flex w-full items-center justify-end gap-2.5 pt-2">
          {cancelText && (
            <Button variant="outline" size="sm" onClick={handleCancel}>
              {cancelText}
            </Button>
          )}
          <Button variant={cfg.buttonVariant} size="sm" onClick={handleConfirm}>
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
