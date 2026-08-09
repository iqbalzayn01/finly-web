import { createFileRoute } from '@tanstack/react-router'
import { User, Mail, Shield, Key } from 'lucide-react'
import { Button } from '../components/ui/button'
import { motion } from 'motion/react'
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar'

export const Route = createFileRoute('/account')({
  component: Account,
})

function Account() {
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
        whileHover={{ y: -2 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.1 }}
        className="border border-border bg-card p-8 rounded-2xl shadow-sm"
      >
        <h2 className="text-xl font-semibold text-foreground mb-6">
          Profile Information
        </h2>

        <div className="flex items-center gap-6 mb-8">
          <Avatar className="h-20 w-20 border border-border shadow-xs">
            <AvatarImage
              src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
              alt="Avatar"
            />
            <AvatarFallback>AU</AvatarFallback>
          </Avatar>
          <div>
            <Button variant="outline" size="sm" className="mb-1.5" onClick={() => alert("Upload avatar dialog opened")}>
              Change Avatar
            </Button>
            <p className="text-xs text-muted-foreground">JPG, GIF or PNG. 1MB max.</p>
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
          <Button className="px-6" onClick={() => alert("Account settings saved successfully!")}>
            Save Changes
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.2 }}
        className="border border-border bg-card p-8 rounded-2xl shadow-sm"
      >
        <h2 className="text-xl font-semibold text-foreground mb-6">
          Security
        </h2>

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
            <Button variant="outline" size="sm" onClick={() => alert("Password update dialog opened")}>Change Password</Button>
          </div>
          <div className="flex items-center justify-between py-4">
            <div>
              <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
                <Shield className="h-4 w-4 text-emerald-500" /> Two-Factor
                Authentication
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Add an extra layer of security to your account.
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => alert("2FA setup initiated")}>Enable 2FA</Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
