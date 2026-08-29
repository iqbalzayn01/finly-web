import * as React from 'react'
import { AlertCircle, AlertTriangle, CheckCircle2, Info } from './icon'
import { Button } from '#/components/ui/button'
import { Modal } from '#/components/ui/modal'

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

/**
 * Modern Motion-powered replacement for browser alert() and confirm() dialogs.
 */
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
    <Modal
      trigger={trigger}
      open={isOpen}
      onOpenChange={setIsOpen}
      size="sm"
      className="max-w-sm text-center"
      footer={
        <div className="flex w-full items-center justify-end gap-2.5 pt-2">
          {cancelText && (
            <Button variant="outline" size="sm" onClick={handleCancel}>
              {cancelText}
            </Button>
          )}
          <Button variant={cfg.buttonVariant} size="sm" onClick={handleConfirm}>
            {confirmText}
          </Button>
        </div>
      }
    >
      <div className="flex flex-col items-center text-center gap-3 pt-1 pb-2">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-full ${cfg.iconContainerClass}`}
        >
          {cfg.icon}
        </div>
        <div className="flex flex-col gap-1.5">
          <h3 className="font-semibold text-lg text-foreground">{title}</h3>
          {description && (
            <p className="text-xs leading-relaxed text-muted-foreground">
              {description}
            </p>
          )}
          {children && <div className="mt-2 text-left">{children}</div>}
        </div>
      </div>
    </Modal>
  )
}
