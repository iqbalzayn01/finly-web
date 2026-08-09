import { createFileRoute } from '@tanstack/react-router'
import { Building2, FileText, Image as ImageIcon } from 'lucide-react'
import { Button } from '../components/ui/button'
import { motion } from 'motion/react'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../components/ui/select'

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
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Workspace Settings
        </h1>
        <p className="mt-1.5 text-muted-foreground text-sm">
          Manage your business preferences, branding, and defaults.
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
          Business Profile
        </h2>

        <div className="flex items-center gap-6 mb-8">
          <div className="h-20 w-20 border border-border bg-accent/40 rounded-2xl flex items-center justify-center shadow-xs">
            <ImageIcon className="h-7 w-7 text-muted-foreground" />
          </div>
          <div>
            <Button variant="outline" size="sm" className="mb-1.5" onClick={() => alert("Upload logo dialog opened")}>
              Upload Logo
            </Button>
            <p className="text-xs text-muted-foreground">
              Suggested: 512x512px. Used on invoices.
            </p>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground">
              Business Name
            </label>
            <div className="relative mt-1">
              <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10 pointer-events-none" />
              <input
                type="text"
                placeholder="Workspace Name"
                defaultValue="Finly HQ"
                className="h-11 w-full border border-border bg-background rounded-xl pl-10 pr-4 text-sm font-medium outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground">
              Tax Number / EIN
            </label>
            <div className="relative mt-1">
              <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10 pointer-events-none" />
              <input
                type="text"
                placeholder="Tax ID"
                defaultValue="00-1234567"
                className="h-11 w-full border border-border bg-background rounded-xl pl-10 pr-4 text-sm font-medium outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground"
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
        className="border border-border bg-card p-8 rounded-2xl shadow-sm"
      >
        <h2 className="text-xl font-semibold text-foreground mb-6">
          Regional & Defaults
        </h2>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground">
              Base Currency
            </label>
            <Select defaultValue="IDR">
              <SelectTrigger className="w-full h-11 border border-border rounded-xl shadow-xs">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
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
            <label className="text-xs font-semibold text-foreground">
              Invoice Prefix
            </label>
            <div className="relative mt-1">
              <input
                type="text"
                placeholder="Prefix"
                defaultValue="INV"
                className="h-11 w-full border border-border bg-background rounded-xl px-4 text-sm font-medium outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground"
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
