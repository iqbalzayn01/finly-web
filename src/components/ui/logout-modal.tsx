import * as React from 'react'
import { LogOut } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Modal } from '#/components/ui/modal'

export interface LogoutModalProps {
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onLogout?: () => void
}

export function LogoutModal({ trigger, open, onOpenChange, onLogout }: LogoutModalProps) {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const isControlled = open !== undefined
  const isOpen = isControlled ? open : internalOpen
  const setIsOpen = isControlled ? (onOpenChange ?? (() => {})) : setInternalOpen

  const handleConfirm = () => {
    onLogout?.()
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
          <Button variant="outline" size="sm" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" size="sm" onClick={handleConfirm}>
            Sign Out
          </Button>
        </div>
      }
    >
      <div className="flex flex-col items-center text-center gap-3 pt-1 pb-2">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <LogOut className="h-6 w-6" />
        </div>
        <div className="flex flex-col gap-1.5">
          <h3 className="font-semibold text-lg text-foreground">Sign out of Finly?</h3>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Are you sure you want to end your active session? You will be redirected to the sign-in
            screen.
          </p>
        </div>
      </div>
    </Modal>
  )
}
