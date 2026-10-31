import { createFileRoute } from '@tanstack/react-router'
import {
  Building2,
  FileText,
  Image as ImageIcon,
  Check,
  SlidersHorizontal,
} from '../components/ui/icon'
import { Button } from '../components/ui/button'
import { AlertModal } from '../components/ui/alert-modal'
import { useState, useEffect } from 'react'
import { cn } from '../lib/utils'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../components/ui/select'
import { useCurrency, SUPPORTED_CURRENCIES } from '../lib/currency'
import type { CurrencyCode } from '../lib/currency'
import { useSubscription } from '../lib/subscription'
import { runValidation, businessProfileSchema } from '../lib/validation'

export const Route = createFileRoute('/settings')({
  component: Settings,
})

function Settings() {
  const { isPro } = useSubscription()
  const { currency: globalCurrency, setCurrency: setGlobalCurrency } =
    useCurrency()
  const [businessName, setBusinessName] = useState('Finly HQ')
  const [taxId, setTaxId] = useState('00-1234567')
  const [currency, setCurrency] = useState<string>(globalCurrency)
  const [invoicePrefix, setInvoicePrefix] = useState('INV')
  const [profileSaveSuccess, setProfileSaveSuccess] = useState<boolean>(false)
  const [profileErrors, setProfileErrors] = useState<Record<string, string>>({})
  const [logoModalOpen, setLogoModalOpen] = useState(false)

  useEffect(() => {
    setCurrency(globalCurrency)
  }, [globalCurrency])

  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem('finly_profile_settings')
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile)
        if (parsed.businessName) setBusinessName(parsed.businessName)
        if (parsed.taxId) setTaxId(parsed.taxId)
        if (parsed.currency) setCurrency(parsed.currency)
        if (parsed.invoicePrefix) setInvoicePrefix(parsed.invoicePrefix)
      }
    } catch {}
  }, [])

  const handleSaveProfileSettings = () => {
    const res = runValidation(businessProfileSchema, {
      businessName,
      taxId,
      currency,
      invoicePrefix,
    })

    if (!res.success) {
      setProfileErrors(res.errors)
      return
    }

    setProfileErrors({})
    const dataToSave = res.data
    localStorage.setItem('finly_profile_settings', JSON.stringify(dataToSave))
    if (currency in SUPPORTED_CURRENCIES) {
      setGlobalCurrency(currency as CurrencyCode)
    }
    setProfileSaveSuccess(true)
    setTimeout(() => setProfileSaveSuccess(false), 3000)
  }

  return (
    <div className="space-y-6 sm:space-y-8 max-w-5xl pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
          Workspace Settings
        </h1>
        <p className="mt-1 sm:mt-1.5 text-xs sm:text-sm text-muted-foreground">
          Manage business profile, legal registration, and invoicing defaults.
        </p>
      </div>

      <div className="space-y-6 sm:space-y-8">
        <div className="border border-border bg-card p-4 sm:p-6 md:p-8 rounded-2xl shadow-none space-y-5 sm:space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-foreground">
                Business Profile
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Business name, tax registration, and logo for client invoices
                and receipts.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 pt-2">
            <div
              className={cn(
                'h-20 w-20 bg-accent/40 rounded-2xl flex items-center justify-center shadow-none transition-all',
                isPro
                  ? 'border-2 border-primary ring-4 ring-primary/20'
                  : 'border border-border',
              )}
            >
              <ImageIcon className="h-7 w-7 text-muted-foreground" />
            </div>
            <div>
              <Button
                variant="outline"
                size="sm"
                className="mb-1.5"
                onClick={() => setLogoModalOpen(true)}
              >
                Upload Logo
              </Button>
              <p className="text-xs text-muted-foreground">
                PNG or SVG up to 1 MB. Rendered on issued invoice PDFs.
              </p>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground">
                Business Name <span className="text-destructive">*</span>
              </label>
              <div className="relative mt-1">
                <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10 pointer-events-none" />
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => {
                    setBusinessName(e.target.value)
                    if (profileErrors.businessName) {
                      setProfileErrors((prev) => {
                        const updated = { ...prev }
                        delete updated.businessName
                        return updated
                      })
                    }
                  }}
                  placeholder="Legal business name"
                  className={`h-11 w-full border bg-background rounded-md pl-10 pr-4 text-sm font-medium outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground ${
                    profileErrors.businessName
                      ? 'border-destructive'
                      : 'border-border'
                  }`}
                />
              </div>
              {profileErrors.businessName && (
                <p className="text-[11px] font-semibold text-destructive mt-1">
                  {profileErrors.businessName}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground">
                Tax Registration Number (VAT){' '}
                <span className="text-destructive">*</span>
              </label>
              <div className="relative mt-1">
                <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10 pointer-events-none" />
                <input
                  type="text"
                  value={taxId}
                  onChange={(e) => {
                    setTaxId(e.target.value)
                    if (profileErrors.taxId) {
                      setProfileErrors((prev) => {
                        const updated = { ...prev }
                        delete updated.taxId
                        return updated
                      })
                    }
                  }}
                  placeholder="e.g. 01.234.567.8-901.000"
                  className={`h-11 w-full border bg-background rounded-md pl-10 pr-4 text-sm font-medium outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground ${
                    profileErrors.taxId ? 'border-destructive' : 'border-border'
                  }`}
                />
              </div>
              {profileErrors.taxId && (
                <p className="text-[11px] font-semibold text-destructive mt-1">
                  {profileErrors.taxId}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="border border-border bg-card p-8 rounded-2xl shadow-none space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <SlidersHorizontal className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                Regional & Defaults
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Set default currency and invoice numbering sequence.
              </p>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground">
                Base Currency
              </label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger className="w-full h-11 border border-border rounded-md shadow-none bg-background text-foreground text-sm font-medium">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent className="rounded-md">
                  {Object.values(SUPPORTED_CURRENCIES).map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      {c.name} ({c.symbol})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Stored in integer minor units (scale 100) per currency.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground">
                Invoice Number Prefix{' '}
                <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={invoicePrefix}
                onChange={(e) => {
                  setInvoicePrefix(e.target.value)
                  if (profileErrors.invoicePrefix) {
                    setProfileErrors((prev) => {
                      const updated = { ...prev }
                      delete updated.invoicePrefix
                      return updated
                    })
                  }
                }}
                placeholder="INV"
                className={`h-11 w-full border bg-background rounded-md px-4 text-sm font-medium outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground ${
                  profileErrors.invoicePrefix
                    ? 'border-destructive'
                    : 'border-border'
                }`}
              />
              {profileErrors.invoicePrefix && (
                <p className="text-[11px] font-semibold text-destructive mt-1">
                  {profileErrors.invoicePrefix}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border">
            {profileSaveSuccess ? (
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <Check className="h-3.5 w-3.5" /> Settings saved
              </span>
            ) : (
              <span />
            )}
            <Button
              type="button"
              onClick={handleSaveProfileSettings}
              className="px-6 text-xs font-bold"
            >
              Save Profile
            </Button>
          </div>
        </div>
      </div>

      <AlertModal
        open={logoModalOpen}
        onOpenChange={setLogoModalOpen}
        type="info"
        title="Upload Business Logo"
        description="Select a PNG or SVG file under 1 MB to include on customer invoice headers."
        confirmText="Got it"
      />
    </div>
  )
}
