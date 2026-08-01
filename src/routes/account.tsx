import { createFileRoute } from '@tanstack/react-router'
import { User, Mail, Shield, Key } from 'lucide-react'
import { Button } from '../components/ui/button'
import { motion } from 'motion/react'

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
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
          Account
        </h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Manage your profile and security settings.
        </p>
      </div>

      <div className="border-2 border-border bg-card p-8 shadow-brutal">
        <h2 className="text-xl font-bold text-foreground mb-6">
          Profile Information
        </h2>

        <div className="flex items-center gap-8 mb-8">
          <img
            src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
            alt="Avatar"
            className="h-24 w-24 border-2 border-border shadow-brutal-sm object-cover"
          />
          <div>
            <Button variant="outline" className="mb-2">
              Change Avatar
            </Button>
            <p className="text-sm text-slate-500">JPG, GIF or PNG. 1MB max.</p>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground">
              Full Name
            </label>
            <div className="relative mt-1.5">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground" />
              <input
                type="text"
                placeholder="Full Name"
                defaultValue="Admin User"
                className="h-11 w-full border-2 border-border bg-card pl-10 pr-4 text-sm font-bold outline-none shadow-brutal-sm focus:shadow-none focus:translate-y-[2px] focus:translate-x-[2px] transition-all text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground">
              Email Address
            </label>
            <div className="relative mt-1.5">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground" />
              <input
                type="email"
                placeholder="Email Address"
                defaultValue="admin@acmecorp.com"
                className="h-11 w-full border-2 border-border bg-card pl-10 pr-4 text-sm font-bold outline-none shadow-brutal-sm focus:shadow-none focus:translate-y-[2px] focus:translate-x-[2px] transition-all text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <Button className="px-6">
            Save Changes
          </Button>
        </div>
      </div>

      <div className="border-2 border-border bg-card p-8 shadow-brutal">
        <h2 className="text-xl font-bold text-foreground mb-6">
          Security
        </h2>

        <div className="space-y-6">
          <div className="flex items-center justify-between py-4 border-b-2 border-border">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Key className="h-4 w-4" /> Password
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                Last changed 3 months ago.
              </p>
            </div>
            <Button variant="outline">Change Password</Button>
          </div>
          <div className="flex items-center justify-between py-4">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Shield className="h-4 w-4 text-emerald-500" /> Two-Factor
                Authentication
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                Add an extra layer of security to your account.
              </p>
            </div>
            <Button variant="outline">Enable 2FA</Button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
