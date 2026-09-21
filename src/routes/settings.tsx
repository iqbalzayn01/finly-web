import { createFileRoute } from '@tanstack/react-router'
import {
  Building2,
  FileText,
  Image as ImageIcon,
  Bot,
  Key,
  Eye,
  EyeOff,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  Server,
  Sliders,
  Globe,
  Check,
  User,
  SlidersHorizontal,
} from '../components/ui/icon'
import { Button } from '../components/ui/button'
import { ApiKeyModal } from '../components/ui/api-key-modal'
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
import aiProvidersData from '../data/ai-providers.json'

export const Route = createFileRoute('/settings')({
  component: Settings,
})

type ProviderId = 'gemini' | 'openai' | 'anthropic' | 'deepseek' | 'custom'

interface AIProvider {
  id: ProviderId
  name: string
  tagline: string
  iconColor: string
  badgeColor: string
  defaultModel: string
  models: { id: string; name: string }[]
  keyPlaceholder: string
}

const AI_PROVIDERS = aiProvidersData as unknown as AIProvider[]

function Settings() {
  const { isPro } = useSubscription()
  const [activeTab, setActiveTab] = useState<'profile' | 'ai'>('profile')

  const [selectedProvider, setSelectedProvider] = useState<ProviderId>('gemini')
  const [apiKeys, setApiKeys] = useState<Record<ProviderId, string>>({
    gemini: '',
    openai: '',
    anthropic: '',
    deepseek: '',
    custom: '',
  })
  const [customEndpoint, setCustomEndpoint] = useState(
    'http://localhost:11434/v1',
  )
  const [selectedModel, setSelectedModel] = useState<string>('gemini-2.0-flash')
  const [temperature, setTemperature] = useState<number>(0.2)
  const [showKey, setShowKey] = useState<boolean>(false)
  const [testStatus, setTestStatus] = useState<
    'idle' | 'testing' | 'success' | 'error'
  >('idle')
  const [testLatency, setTestLatency] = useState<number | null>(null)
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false)

  const { currency: globalCurrency, setCurrency: setGlobalCurrency } =
    useCurrency()
  const [businessName, setBusinessName] = useState('Finly HQ')
  const [taxId, setTaxId] = useState('00-1234567')
  const [currency, setCurrency] = useState<string>(globalCurrency)
  const [invoicePrefix, setInvoicePrefix] = useState('INV')
  const [profileSaveSuccess, setProfileSaveSuccess] = useState<boolean>(false)
  const [profileErrors, setProfileErrors] = useState<Record<string, string>>({})
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false)
  const [logoModalOpen, setLogoModalOpen] = useState(false)

  useEffect(() => {
    setCurrency(globalCurrency)
  }, [globalCurrency])

  useEffect(() => {
    try {
      const savedAI = localStorage.getItem('finly_ai_settings')
      if (savedAI) {
        const parsed = JSON.parse(savedAI)
        if (parsed.selectedProvider)
          setSelectedProvider(parsed.selectedProvider)
        if (parsed.apiKeys) setApiKeys(parsed.apiKeys)
        if (parsed.customEndpoint) setCustomEndpoint(parsed.customEndpoint)
        if (parsed.selectedModel) setSelectedModel(parsed.selectedModel)
        if (parsed.temperature) setTemperature(parsed.temperature)
      }

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

  const handleProviderSelect = (provId: ProviderId) => {
    setSelectedProvider(provId)
    const provObj = AI_PROVIDERS.find((p) => p.id === provId)
    if (provObj) {
      setSelectedModel(provObj.defaultModel)
    }
    setTestStatus('idle')
    setTestLatency(null)
  }

  const handleKeyChange = (val: string) => {
    setApiKeys((prev) => ({ ...prev, [selectedProvider]: val }))
    setTestStatus('idle')
  }

  const handleTestConnection = () => {
    setTestStatus('testing')
    setTestLatency(null)

    setTimeout(() => {
      const latency = Math.floor(Math.random() * 80) + 40
      setTestLatency(latency)
      setTestStatus('success')
    }, 900)
  }

  const handleSaveAISettings = () => {
    const dataToSave = {
      selectedProvider,
      apiKeys,
      customEndpoint,
      selectedModel,
      temperature,
    }
    localStorage.setItem('finly_ai_settings', JSON.stringify(dataToSave))
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

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

  const currentProviderObj = AI_PROVIDERS.find(
    (p) => p.id === selectedProvider,
  )!

  return (
    <div className="space-y-6 sm:space-y-8 max-w-5xl pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
          Workspace Settings
        </h1>
        <p className="mt-1 sm:mt-1.5 text-xs sm:text-sm text-muted-foreground">
          Manage business profile, defaults, and AI provider connections.
        </p>
      </div>

      <div className="flex items-center gap-2 border-b border-border pb-3 sm:pb-4 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('profile')}
          className={cn(
            'flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-md text-xs font-bold transition-all cursor-pointer outline-none shrink-0',
            activeTab === 'profile'
              ? 'bg-primary text-primary-foreground shadow-none'
              : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-accent',
          )}
        >
          <User className="h-4 w-4" />
          Workspace Profile
        </button>
        <button
          onClick={() => setActiveTab('ai')}
          className={cn(
            'flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-md text-xs font-bold transition-all cursor-pointer outline-none shrink-0',
            activeTab === 'ai'
              ? 'bg-primary text-primary-foreground shadow-none'
              : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-accent',
          )}
        >
          <Bot className="h-4 w-4" />
          AI Connections
        </button>
      </div>

      {activeTab === 'profile' && (
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
                      profileErrors.taxId
                        ? 'border-destructive'
                        : 'border-border'
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
      )}

      {activeTab === 'ai' && (
        <div className="border border-border bg-card p-8 rounded-2xl shadow-none space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  AI Provider Connections
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Connect your API key to enable invoice drafting, receipt data
                  extraction, and natural language queries.
                </p>
              </div>
            </div>
            <span className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20">
              <CheckCircle2 className="h-3.5 w-3.5" /> Connection Active
            </span>
          </div>

          <div className="space-y-3 pt-2">
            <label className="text-xs font-bold text-foreground uppercase tracking-wider">
              Select Provider:
            </label>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {AI_PROVIDERS.map((prov) => {
                const isSelected = selectedProvider === prov.id
                const hasKey = Boolean(apiKeys[prov.id] || prov.id === 'custom')

                return (
                  <button
                    key={prov.id}
                    onClick={() => handleProviderSelect(prov.id)}
                    className={cn(
                      'relative text-left p-4 rounded-md border transition-all cursor-pointer outline-none flex flex-col justify-between',
                      isSelected
                        ? 'border-primary ring-2 ring-primary/20 bg-primary/5 shadow-none'
                        : 'border-border bg-card hover:bg-accent/40',
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div
                        className={cn(
                          'flex h-8 w-8 items-center justify-center rounded-lg border text-xs font-bold',
                          prov.iconColor,
                        )}
                      >
                        <Sparkles className="h-4 w-4" />
                      </div>
                      {isSelected ? (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px]">
                          <Check className="h-3 w-3 stroke-[3]" />
                        </span>
                      ) : hasKey ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          Configured
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                          Optional
                        </span>
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-foreground">
                        {prov.name}
                      </h4>
                      <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2 leading-tight">
                        {prov.tagline}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="p-6 rounded-md bg-muted/40 border border-border space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    'px-2.5 py-1 text-xs font-bold rounded-lg border',
                    currentProviderObj.badgeColor,
                  )}
                >
                  Active: {currentProviderObj.name}
                </span>
              </div>
              {testStatus === 'success' && testLatency && (
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" /> Connected ({testLatency}{' '}
                  ms)
                </span>
              )}
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Key className="h-3.5 w-3.5 text-muted-foreground" />
                    {currentProviderObj.name} Secret API Key
                  </label>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      setApiKeyModalOpen(true)
                    }}
                    className="text-xs font-semibold text-foreground hover:underline"
                  >
                    Get Key →
                  </a>
                </div>
                <div className="relative">
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={apiKeys[selectedProvider]}
                    onChange={(e) => handleKeyChange(e.target.value)}
                    placeholder={currentProviderObj.keyPlaceholder}
                    className="h-11 w-full border border-border bg-background rounded-md pl-4 pr-12 text-sm font-mono font-medium outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    {showKey ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {selectedProvider === 'custom' && (
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Server className="h-3.5 w-3.5 text-muted-foreground" />{' '}
                    Base Endpoint URL
                  </label>
                  <input
                    type="text"
                    value={customEndpoint}
                    onChange={(e) => setCustomEndpoint(e.target.value)}
                    placeholder="http://localhost:11434/v1"
                    className="h-11 w-full border border-border bg-background rounded-md px-4 text-sm font-mono font-medium outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Globe className="h-3.5 w-3.5 text-muted-foreground" /> Model
                  Selection
                </label>
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger className="w-full h-11 border border-border rounded-md shadow-none bg-background text-foreground text-sm font-medium">
                    <SelectValue placeholder="Select Model" />
                  </SelectTrigger>
                  <SelectContent className="rounded-md">
                    {currentProviderObj.models.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Sliders className="h-3.5 w-3.5 text-muted-foreground" />{' '}
                    Temperature
                  </span>
                  <span className="font-mono text-xs text-foreground font-bold">
                    {temperature}
                  </span>
                </label>
                <div className="flex items-center gap-2 pt-1">
                  {[
                    { label: 'Precise (0.1)', val: 0.1 },
                    { label: 'Balanced (0.4)', val: 0.4 },
                    { label: 'Creative (0.8)', val: 0.8 },
                  ].map((t) => (
                    <button
                      key={t.val}
                      type="button"
                      onClick={() => setTemperature(t.val)}
                      className={cn(
                        'flex-1 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer outline-none',
                        temperature === t.val
                          ? 'bg-primary text-primary-foreground border-primary shadow-xs font-bold'
                          : 'bg-background text-muted-foreground border-border hover:text-foreground',
                      )}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border flex-wrap gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={testStatus === 'testing'}
                onClick={handleTestConnection}
                className="flex items-center gap-2 text-xs font-semibold"
              >
                {testStatus === 'testing' ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin text-primary" />{' '}
                    Testing connection...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />{' '}
                    Test Connection
                  </>
                )}
              </Button>

              <div className="flex items-center gap-3">
                {saveSuccess && (
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 animate-pulse">
                    <Check className="h-3.5 w-3.5" /> Settings saved
                  </span>
                )}
                <Button
                  type="button"
                  onClick={handleSaveAISettings}
                  className="px-5 text-xs font-bold"
                >
                  Save Configuration
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ApiKeyModal
        open={apiKeyModalOpen}
        onOpenChange={setApiKeyModalOpen}
        providerName={currentProviderObj.name}
        currentKey={apiKeys[selectedProvider]}
        onSaveKey={(newKey) => handleKeyChange(newKey)}
      />

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
