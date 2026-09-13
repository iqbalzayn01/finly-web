import { createFileRoute } from '@tanstack/react-router'
import { User, Mail, Shield, Key, ShieldAlert } from '../components/ui/icon'
import { Button } from '../components/ui/button'
import { motion } from 'motion/react'
import { useState } from 'react'
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar'
import { AlertModal } from '../components/ui/alert-modal'
import { Modal } from '../components/ui/modal'
import { useSubscription } from '../lib/subscription'
import { cn } from '../lib/utils'
import {
  runValidation,
  accountProfileSchema,
  changePasswordSchema,
} from '../lib/validation'

export const Route = createFileRoute('/account')({
  component: Account,
})

function Account() {
  const { isPro } = useSubscription()
  const [avatarModalOpen, setAvatarModalOpen] = useState(false)
  const [saveModalOpen, setSaveModalOpen] = useState(false)
  const [passwordModalOpen, setPasswordModalOpen] = useState(false)
  const [passwordSuccessModal, setPasswordSuccessModal] = useState(false)
  const [twoFactorModalOpen, setTwoFactorModalOpen] = useState(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)

  const [fullName, setFullName] = useState('Alex Morgan')
  const [email, setEmail] = useState('alex.morgan@finly.io')
  const [profileErrors, setProfileErrors] = useState<Record<string, string>>({})

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>(
    {},
  )

  const handleSaveProfile = () => {
    const res = runValidation(accountProfileSchema, { fullName, email })
    if (!res.success) {
      setProfileErrors(res.errors)
      return
    }

    setProfileErrors({})
    setSaveModalOpen(true)
  }

  const handleUpdatePassword = () => {
    const res = runValidation(changePasswordSchema, passwordForm)
    if (!res.success) {
      setPasswordErrors(res.errors)
      return
    }

    setPasswordErrors({})
    setPasswordModalOpen(false)
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    })
    setPasswordSuccessModal(true)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl space-y-6 sm:space-y-8"
    >
      <div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
          Account
        </h1>
        <p className="mt-1 sm:mt-1.5 text-xs sm:text-sm text-muted-foreground">
          Manage user credentials, personal details, and authentication
          security.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.1 }}
        className="border border-border bg-card p-4 sm:p-6 md:p-8 rounded-2xl shadow-none"
      >
        <div className="flex items-center justify-between mb-5 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-foreground">
            Profile Information
          </h2>
          {isPro && (
            <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20 flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-primary animate-pulse" />
              Pro Account
            </span>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Avatar
            className={cn(
              'h-16 w-16 sm:h-20 sm:w-20 shadow-none transition-all',
              isPro
                ? 'border-2 border-primary ring-4 ring-primary/20'
                : 'border border-border',
            )}
          >
            <AvatarImage
              src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
              alt="Avatar"
            />
            <AvatarFallback>AM</AvatarFallback>
          </Avatar>
          <div>
            <Button
              variant="outline"
              size="sm"
              className="mb-1.5 text-xs"
              onClick={() => setAvatarModalOpen(true)}
            >
              Change Avatar
            </Button>
            <p className="text-xs text-muted-foreground">
              PNG or JPG up to 1 MB.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
          <div className="space-y-1.5 sm:space-y-2">
            <label className="text-xs font-semibold text-foreground">
              Full Name <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10 pointer-events-none" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value)
                  if (profileErrors.fullName) {
                    setProfileErrors((prev) => {
                      const updated = { ...prev }
                      delete updated.fullName
                      return updated
                    })
                  }
                }}
                placeholder="Full Name"
                className={`h-11 w-full border bg-background rounded-md pl-10 pr-4 text-xs sm:text-sm font-medium outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground ${
                  profileErrors.fullName
                    ? 'border-destructive'
                    : 'border-border'
                }`}
              />
            </div>
            {profileErrors.fullName && (
              <p className="text-[11px] font-semibold text-destructive mt-1">
                {profileErrors.fullName}
              </p>
            )}
          </div>
          <div className="space-y-1.5 sm:space-y-2">
            <label className="text-xs font-semibold text-foreground">
              Email Address <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10 pointer-events-none" />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (profileErrors.email) {
                    setProfileErrors((prev) => {
                      const updated = { ...prev }
                      delete updated.email
                      return updated
                    })
                  }
                }}
                placeholder="Email Address"
                className={`h-11 w-full border bg-background rounded-md pl-10 pr-4 text-xs sm:text-sm font-medium outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground ${
                  profileErrors.email ? 'border-destructive' : 'border-border'
                }`}
              />
            </div>
            {profileErrors.email && (
              <p className="text-[11px] font-semibold text-destructive mt-1">
                {profileErrors.email}
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 sm:mt-8 flex justify-end">
          <Button
            className="w-full sm:w-auto px-6 font-semibold"
            onClick={handleSaveProfile}
          >
            Save Changes
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.2 }}
        className="border border-border bg-card p-4 sm:p-6 md:p-8 rounded-2xl shadow-none"
      >
        <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-4 sm:mb-6">
          Security
        </h2>

        <div className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3 sm:py-4 border-b border-border">
            <div>
              <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
                <Key className="h-4 w-4 text-muted-foreground" /> Password
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Updated 90 days ago.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="self-start sm:self-auto text-xs"
              onClick={() => {
                setPasswordErrors({})
                setPasswordModalOpen(true)
              }}
            >
              Change Password
            </Button>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3 sm:py-4">
            <div>
              <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
                <Shield
                  className={`h-4 w-4 ${twoFactorEnabled ? 'text-emerald-500' : 'text-amber-500'}`}
                />
                Two-Factor Authentication
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {twoFactorEnabled
                  ? 'Enabled with authenticator app.'
                  : 'Require TOTP verification code on sign-in.'}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="self-start sm:self-auto text-xs"
              onClick={() => setTwoFactorModalOpen(true)}
            >
              {twoFactorEnabled ? 'Manage 2FA' : 'Enable 2FA'}
            </Button>
          </div>
        </div>
      </motion.div>

      <AlertModal
        open={avatarModalOpen}
        onOpenChange={setAvatarModalOpen}
        type="info"
        title="Upload Profile Picture"
        description="Upload a photo in PNG or JPG format under 1 MB."
        confirmText="Done"
      />

      <AlertModal
        open={saveModalOpen}
        onOpenChange={setSaveModalOpen}
        type="success"
        title="Settings Saved"
        description="Your profile information and contact details have been updated."
        confirmText="Got it"
      />

      <AlertModal
        open={passwordSuccessModal}
        onOpenChange={setPasswordSuccessModal}
        type="success"
        title="Password Updated"
        description="Your account password has been successfully changed."
        confirmText="Got it"
      />

      <Modal
        open={passwordModalOpen}
        onOpenChange={setPasswordModalOpen}
        title="Change Account Password"
        description="Enter your current password followed by your new password."
        size="md"
        footer={
          <div className="flex w-full items-center justify-end gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPasswordModalOpen(false)}
            >
              Cancel
            </Button>
            <Button size="sm" onClick={handleUpdatePassword}>
              Update Password
            </Button>
          </div>
        }
      >
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Current Password <span className="text-destructive">*</span>
            </label>
            <input
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) => {
                setPasswordForm((prev) => ({
                  ...prev,
                  currentPassword: e.target.value,
                }))
                if (passwordErrors.currentPassword) {
                  setPasswordErrors((prev) => {
                    const updated = { ...prev }
                    delete updated.currentPassword
                    return updated
                  })
                }
              }}
              placeholder="••••••••••••"
              className={`h-10 w-full border bg-background rounded-md px-3 text-sm font-medium outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground ${
                passwordErrors.currentPassword
                  ? 'border-destructive'
                  : 'border-border'
              }`}
            />
            {passwordErrors.currentPassword && (
              <p className="text-[11px] font-semibold text-destructive mt-1">
                {passwordErrors.currentPassword}
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              New Password <span className="text-destructive">*</span>
            </label>
            <input
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) => {
                setPasswordForm((prev) => ({
                  ...prev,
                  newPassword: e.target.value,
                }))
                if (passwordErrors.newPassword) {
                  setPasswordErrors((prev) => {
                    const updated = { ...prev }
                    delete updated.newPassword
                    return updated
                  })
                }
              }}
              placeholder="Minimum 8 characters (mixed case + number)"
              className={`h-10 w-full border bg-background rounded-md px-3 text-sm font-medium outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground ${
                passwordErrors.newPassword
                  ? 'border-destructive'
                  : 'border-border'
              }`}
            />
            {passwordErrors.newPassword && (
              <p className="text-[11px] font-semibold text-destructive mt-1">
                {passwordErrors.newPassword}
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Confirm New Password <span className="text-destructive">*</span>
            </label>
            <input
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) => {
                setPasswordForm((prev) => ({
                  ...prev,
                  confirmPassword: e.target.value,
                }))
                if (passwordErrors.confirmPassword) {
                  setPasswordErrors((prev) => {
                    const updated = { ...prev }
                    delete updated.confirmPassword
                    return updated
                  })
                }
              }}
              placeholder="Re-enter new password"
              className={`h-10 w-full border bg-background rounded-md px-3 text-sm font-medium outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground ${
                passwordErrors.confirmPassword
                  ? 'border-destructive'
                  : 'border-border'
              }`}
            />
            {passwordErrors.confirmPassword && (
              <p className="text-[11px] font-semibold text-destructive mt-1">
                {passwordErrors.confirmPassword}
              </p>
            )}
          </div>
        </div>
      </Modal>

      <Modal
        open={twoFactorModalOpen}
        onOpenChange={setTwoFactorModalOpen}
        title="Two-Factor Authentication"
        description="Require a TOTP verification code from your authenticator app on sign-in."
        size="md"
        footer={
          <div className="flex w-full items-center justify-end gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTwoFactorModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setTwoFactorEnabled(!twoFactorEnabled)
                setTwoFactorModalOpen(false)
              }}
            >
              {twoFactorEnabled ? 'Disable 2FA' : 'Verify & Enable'}
            </Button>
          </div>
        }
      >
        <div className="space-y-4 py-2">
          <div className="flex items-center gap-3 p-3.5 rounded-md bg-muted/40 border border-border">
            <ShieldAlert className="h-6 w-6 text-primary shrink-0" />
            <p className="text-xs leading-relaxed text-muted-foreground">
              Scan this code with an authenticator app (such as Google
              Authenticator or 1Password), then confirm.
            </p>
          </div>
          <div className="flex justify-center p-4 bg-white dark:bg-card border border-border rounded-md">
            <div className="h-28 w-28 bg-muted rounded-lg flex items-center justify-center font-mono text-xs text-muted-foreground border border-dashed border-border">
              [ QR Code ]
            </div>
          </div>
        </div>
      </Modal>
    </motion.div>
  )
}
