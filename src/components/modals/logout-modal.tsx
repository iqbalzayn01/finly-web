import * as React from 'react'
import { LogOut } from '../ui/icon'
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

export interface LogoutModalProps {
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onLogout?: () => void
}

export function LogoutModal({
  trigger,
  open,
  onOpenChange,
  onLogout,
}: LogoutModalProps) {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const isControlled = open !== undefined
  const isOpen = isControlled ? open : internalOpen
  const setIsOpen = isControlled
    ? (onOpenChange ?? (() => {}))
    : setInternalOpen

  const handleConfirm = () => {
    onLogout?.()
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
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-2">
            <LogOut className="h-6 w-6" />
          </div>
          <DialogTitle className="text-center font-semibold text-lg text-foreground">
            Sign out of Finly?
          </DialogTitle>
          <DialogDescription className="text-center text-xs leading-relaxed text-muted-foreground">
            End your current active session? You will need to sign in again to
            access your workspace.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex w-full items-center justify-end gap-2.5 pt-2">
          <Button variant="outline" size="sm" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" size="sm" onClick={handleConfirm}>
            Sign Out
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
