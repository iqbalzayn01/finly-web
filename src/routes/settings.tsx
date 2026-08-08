import { createFileRoute } from '@tanstack/react-router'
import { Building2, Globe, FileText, Image as ImageIcon } from 'lucide-react'
import { Button } from '../components/ui/button'
import { motion } from 'motion/react'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../components/ui/select'

import { useUIStore } from '../store/ui-store'

export const Route = createFileRoute('/settings')({
  component: Settings,
})

function Settings() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl space-y-8"
    >
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Workspace Settings
        </h1>
        <p className="mt-2 text-muted-foreground">
          Manage your business preferences, branding, and defaults.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.1 }}
        className="border-2 border-border bg-card p-8 shadow-brutal"
      >
        <h2 className="text-xl font-bold text-foreground mb-6">
          Business Profile
        </h2>

        <div className="flex items-center gap-8 mb-8">
          <div className="h-24 w-24 border-2 border-border bg-accent flex items-center justify-center shadow-brutal-sm">
            <ImageIcon className="h-8 w-8 text-muted-foreground" />
          </div>
          <div>
            <Button variant="outline" className="mb-2" onClick={() => alert("Upload avatar dialog opened")}>
              Upload Logo
            </Button>
            <p className="text-sm text-muted-foreground">
              Suggested: 512x512px. Used on invoices.
            </p>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground">
              Business Name
            </label>
            <div className="relative mt-1.5">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground z-10 pointer-events-none" />
              <input
                type="text"
                placeholder="Workspace Name"
                defaultValue="Finly HQ"
                className="h-11 w-full border-2 border-border bg-card pl-10 pr-4 text-sm font-bold outline-none shadow-brutal-sm focus:shadow-none focus:translate-y-[2px] focus:translate-x-[2px] transition-all text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground">
              Tax Number / EIN
            </label>
            <div className="relative mt-1.5">
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground z-10 pointer-events-none" />
              <input
                type="text"
                placeholder="Tax ID"
                defaultValue="00-1234567"
                className="h-11 w-full border-2 border-border bg-card pl-10 pr-4 text-sm font-bold outline-none shadow-brutal-sm focus:shadow-none focus:translate-y-[2px] focus:translate-x-[2px] transition-all text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.2 }}
        className="border-2 border-border bg-card p-8 shadow-brutal"
      >
        <h2 className="text-xl font-bold text-foreground mb-6">
          Regional & Defaults
        </h2>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground">
              Base Currency
            </label>
            <Select defaultValue="IDR">
              <SelectTrigger className="w-full h-11 border-2 border-border shadow-brutal-sm">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="IDR">Indonesian Rupiah (IDR)</SelectItem>
                <SelectItem value="USD">US Dollar (USD)</SelectItem>
                <SelectItem value="EUR">Euro (EUR)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Note: Scale 100 is used globally internally.
            </p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground">
              Invoice Prefix
            </label>
            <div className="relative mt-1.5">
              <input
                type="text"
                placeholder="Prefix"
                defaultValue="INV"
                className="h-11 w-full border-2 border-border bg-card px-4 text-sm font-bold outline-none shadow-brutal-sm focus:shadow-none focus:translate-y-[2px] focus:translate-x-[2px] transition-all text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <Button className="px-6" onClick={() => alert("Settings saved successfully!")}>
            Save Preferences
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
}
