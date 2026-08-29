import * as React from 'react'
import { Dialog as BaseDialog } from '@base-ui/react'
import { AnimatePresence, motion } from 'motion/react'
import { X } from './icon'
import { cn } from '#/lib/utils'

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'

const sizeClasses: Record<ModalSize, string> = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)] md:max-w-5xl',
}

export interface ModalProps {
  /** Optional trigger element (button, link, custom component). */
  trigger?: React.ReactNode
  /** Controlled open state. */
  open?: boolean
  /** Controlled open change handler. */
  onOpenChange?: (open: boolean) => void
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean
  /** Modal header title. */
  title?: React.ReactNode
  /** Modal header description/subtitle. */
  description?: React.ReactNode
  /** Main modal content. */
  children: React.ReactNode
  /** Optional footer content (buttons, action links). */
  footer?: React.ReactNode
  /** Modal width size. Defaults to 'md'. */
  size?: ModalSize
  /** Additional classes for the modal container card. */
  className?: string
  /** Whether to show top-right close icon. Defaults to true. */
  showCloseButton?: boolean
}

/**
 * Universal Motion Modal component powered by Base UI & Motion.
 * Supports smooth spring-physics scale & opacity transitions, backdrop blur,
 * keyboard ESC, focus trapping, and responsive sizing.
 */
export function Modal({
  trigger,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  defaultOpen = false,
  title,
  description,
  children,
  footer,
  size = 'md',
  className,
  showCloseButton = true,
}: ModalProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)

  const isControlled = controlledOpen !== undefined
  const isOpen = isControlled ? controlledOpen : uncontrolledOpen

  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(nextOpen)
      }
      setControlledOpen?.(nextOpen)
    },
    [isControlled, setControlledOpen],
  )

  return (
    <BaseDialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      {trigger && (
        <BaseDialog.Trigger
          data-slot="modal-trigger"
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
      <AnimatePresence>
        {isOpen && (
          <BaseDialog.Portal keepMounted data-slot="modal-portal">
            {/* Backdrop Overlay */}
            <BaseDialog.Backdrop
              render={(props: any) => (
                <motion.div
                  {...props}
                  data-slot="modal-overlay"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md"
                />
              )}
            />

            {/* Modal Dialog Card */}
            <BaseDialog.Popup
              render={(props: any) => (
                <motion.div
                  {...props}
                  data-slot="modal-content"
                  initial={{ opacity: 0, scale: 0.94, y: 12, x: '-50%' }}
                  animate={{ opacity: 1, scale: 1, y: 0, x: '-50%' }}
                  exit={{ opacity: 0, scale: 0.96, y: 8, x: '-50%' }}
                  transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 28,
                    mass: 0.8,
                  }}
                  className={cn(
                    'fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-y-[-50%] gap-4 overflow-hidden rounded-2xl border border-border bg-card p-6 text-foreground shadow-2xl outline-none focus:outline-hidden',
                    sizeClasses[size],
                    className,
                  )}
                >
                  {(title || description) && (
                    <div className="flex flex-col gap-1.5 text-left pr-8">
                      {title && (
                        <BaseDialog.Title className="font-semibold text-lg leading-tight tracking-tight text-foreground">
                          {title}
                        </BaseDialog.Title>
                      )}
                      {description && (
                        <BaseDialog.Description className="text-sm leading-relaxed text-muted-foreground">
                          {description}
                        </BaseDialog.Description>
                      )}
                    </div>
                  )}

                  <div className="max-h-[70vh] overflow-y-auto text-sm leading-relaxed">
                    {children}
                  </div>

                  {footer && (
                    <div className="mt-2 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end border-t border-border pt-4">
                      {footer}
                    </div>
                  )}

                  {showCloseButton && (
                    <BaseDialog.Close
                      data-slot="modal-close"
                      className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground opacity-70 transition-all hover:bg-accent hover:text-foreground hover:opacity-100 focus:outline-hidden focus:ring-2 focus:ring-primary cursor-pointer"
                      aria-label="Close modal"
                    >
                      <X className="h-4 w-4" />
                    </BaseDialog.Close>
                  )}
                </motion.div>
              )}
            />
          </BaseDialog.Portal>
        )}
      </AnimatePresence>
    </BaseDialog.Root>
  )
}
