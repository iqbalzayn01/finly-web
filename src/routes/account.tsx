import { createFileRoute } from '@tanstack/react-router'
import {
  User,
  Mail,
  Shield,
  Key,
  Camera,
  Check,
  ShieldAlert,
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { motion } from 'motion/react'
import { useState } from 'react'
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar'
import { AlertModal } from '../components/ui/alert-modal'
import { Modal } from '../components/ui/modal'

export const Route = createFileRoute('/account')({
  component: Account,
})

function Account() {
  const [avatarModalOpen, setAvatarModalOpen] = useState(false)
  const [saveModalOpen, setSaveModalOpen] = useState(false)
  const [passwordModalOpen, setPasswordModalOpen] = useState(false)
  const [twoFactorModalOpen, setTwoFactorModalOpen] = useState(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl space-y-8"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Account
        </h1>
        <p className="mt-1.5 text-muted-foreground text-sm">
          Manage your profile and security settings.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.1 }}
        className="border border-border bg-card p-8 rounded-2xl shadow-none"
      >
        <h2 className="text-xl font-semibold text-foreground mb-6">
          Profile Information
        </h2>

        <div className="flex items-center gap-6 mb-8">
          <Avatar className="h-20 w-20 border border-border shadow-none">
            <AvatarImage
              src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
              alt="Avatar"
            />
            <AvatarFallback>AU</AvatarFallback>
          </Avatar>
          <div>
            <Button
              variant="outline"
              size="sm"
              className="mb-1.5"
              onClick={() => setAvatarModalOpen(true)}
            >
              Change Avatar
            </Button>
            <p className="text-xs text-muted-foreground">
              JPG, GIF or PNG. 1MB max.
            </p>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground">
              Full Name
            </label>
            <div className="relative mt-1">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10 pointer-events-none" />
              <input
                type="text"
                placeholder="Full Name"
                defaultValue="Admin User"
                className="h-11 w-full border border-border bg-background rounded-xl pl-10 pr-4 text-sm font-medium outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground">
              Email Address
            </label>
            <div className="relative mt-1">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10 pointer-events-none" />
              <input
                type="email"
                placeholder="Email Address"
                defaultValue="admin@acmecorp.com"
                className="h-11 w-full border border-border bg-background rounded-xl pl-10 pr-4 text-sm font-medium outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <Button className="px-6" onClick={() => setSaveModalOpen(true)}>
            Save Changes
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.2 }}
        className="border border-border bg-card p-8 rounded-2xl shadow-none"
      >
        <h2 className="text-xl font-semibold text-foreground mb-6">Security</h2>

        <div className="space-y-6">
          <div className="flex items-center justify-between py-4 border-b border-border">
            <div>
              <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
                <Key className="h-4 w-4 text-muted-foreground" /> Password
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Last changed 3 months ago.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPasswordModalOpen(true)}
            >
              Change Password
            </Button>
          </div>
          <div className="flex items-center justify-between py-4">
            <div>
              <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
                <Shield
                  className={`h-4 w-4 ${twoFactorEnabled ? 'text-emerald-500' : 'text-amber-500'}`}
                />
                Two-Factor Authentication
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {twoFactorEnabled
                  ? 'Active: Authenticator app verification enabled.'
                  : 'Add an extra layer of security to your account.'}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTwoFactorModalOpen(true)}
            >
              {twoFactorEnabled ? 'Manage 2FA' : 'Enable 2FA'}
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Upload Avatar Modal */}
      <AlertModal
        open={avatarModalOpen}
        onOpenChange={setAvatarModalOpen}
        type="info"
        title="Upload Profile Picture"
        description="Choose a high-resolution image in PNG, JPEG, or GIF format up to 1MB."
        confirmText="Done"
      />

      {/* Save Settings Success Modal */}
      <AlertModal
        open={saveModalOpen}
        onOpenChange={setSaveModalOpen}
        type="success"
        title="Settings Saved"
        description="Your profile information and contact details have been updated successfully."
        confirmText="Got it"
      />

      {/* Password Update Modal */}
      <Modal
        open={passwordModalOpen}
        onOpenChange={setPasswordModalOpen}
        title="Change Account Password"
        description="Enter your current password and choose a strong new password."
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
            <Button size="sm" onClick={() => setPasswordModalOpen(false)}>
              Update Password
            </Button>
          </div>
        }
      >
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Current Password
            </label>
            <input
              type="password"
              placeholder="••••••••••••"
              className="h-10 w-full border border-border bg-background rounded-xl px-3 text-sm font-medium outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              New Password
            </label>
            <input
              type="password"
              placeholder="Minimum 8 characters"
              className="h-10 w-full border border-border bg-background rounded-xl px-3 text-sm font-medium outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground"
            />
          </div>
        </div>
      </Modal>

      {/* 2FA Setup Modal */}
      <Modal
        open={twoFactorModalOpen}
        onOpenChange={setTwoFactorModalOpen}
        title="Two-Factor Authentication"
        description="Protect your account with Time-based One-Time Password (TOTP)."
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
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-muted/40 border border-border">
            <ShieldAlert className="h-6 w-6 text-primary shrink-0" />
            <p className="text-xs leading-relaxed text-muted-foreground">
              Scan the QR code with your authenticator app (Google
              Authenticator, 1Password, or Authy) and enter the 6-digit code.
            </p>
          </div>
          <div className="flex justify-center p-4 bg-white dark:bg-card border border-border rounded-xl">
            <div className="h-28 w-28 bg-muted rounded-lg flex items-center justify-center font-mono text-xs text-muted-foreground border border-dashed border-border">
              [ QR Code ]
            </div>
          </div>
        </div>
      </Modal>
    </motion.div>
  )
}
