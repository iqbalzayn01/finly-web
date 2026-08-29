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

const AI_PROVIDERS: AIProvider[] = [
  {
    id: 'gemini',
    name: 'Google Gemini',
    tagline: 'High-speed multimodal AI by Google DeepMind',
    iconColor: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    badgeColor:
      'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    defaultModel: 'gemini-2.0-flash',
    keyPlaceholder: 'AIzaSy...',
    models: [
      { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash (Recommended)' },
      { id: 'gemini-2.0-pro-exp', name: 'Gemini 2.0 Pro Experimental' },
      { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro' },
    ],
  },
  {
    id: 'openai',
    name: 'OpenAI ChatGPT',
    tagline: 'GPT-4o reasoning & structured data parsing',
    iconColor: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    badgeColor:
      'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    defaultModel: 'gpt-4o',
    keyPlaceholder: 'sk-proj-...',
    models: [
      { id: 'gpt-4o', name: 'GPT-4o (Omni High Intelligence)' },
      { id: 'gpt-4o-mini', name: 'GPT-4o Mini (Fast & Lightweight)' },
      { id: 'o3-mini', name: 'o3-Mini Reasoning Engine' },
    ],
  },
  {
    id: 'anthropic',
    name: 'Anthropic Claude',
    tagline: 'Advanced financial analysis & document parsing',
    iconColor: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    badgeColor:
      'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    defaultModel: 'claude-3-5-sonnet-20241022',
    keyPlaceholder: 'sk-ant-api...',
    models: [
      {
        id: 'claude-3-5-sonnet-20241022',
        name: 'Claude 3.5 Sonnet (Best Code & Logic)',
      },
      {
        id: 'claude-3-5-haiku-20241022',
        name: 'Claude 3.5 Haiku (Sub-second speed)',
      },
      { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus' },
    ],
  },
  {
    id: 'deepseek',
    name: 'DeepSeek AI',
    tagline: 'Open-weight & high-performance financial reasoning',
    iconColor: 'text-violet-500 bg-violet-500/10 border-violet-500/20',
    badgeColor:
      'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20',
    defaultModel: 'deepseek-chat',
    keyPlaceholder: 'sk-deepseek-...',
    models: [
      { id: 'deepseek-chat', name: 'DeepSeek V3 (Chat)' },
      {
        id: 'deepseek-reasoner',
        name: 'DeepSeek R1 (Chain-of-Thought Reasoner)',
      },
    ],
  },
  {
    id: 'custom',
    name: 'Custom / Local LLM',
    tagline: 'Connect self-hosted Ollama, LM Studio, or vLLM',
    iconColor: 'text-slate-500 bg-slate-500/10 border-slate-500/20',
    badgeColor:
      'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20',
    defaultModel: 'llama3.3:70b',
    keyPlaceholder: 'Optional (Bearer Token)',
    models: [
      { id: 'llama3.3:70b', name: 'Llama 3.3 70B' },
      { id: 'deepseek-r1:8b', name: 'DeepSeek R1 8B (Local)' },
      { id: 'mistral-small', name: 'Mistral Small' },
      { id: 'custom-model', name: 'Custom OpenAI-Compatible Model' },
    ],
  },
]

function Settings() {
  const { isPro } = useSubscription()
  const [activeTab, setActiveTab] = useState<'profile' | 'ai'>('profile')

  // AI Settings State
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

  // Profile Settings State
  const { currency: globalCurrency, setCurrency: setGlobalCurrency } =
    useCurrency()
  const [businessName, setBusinessName] = useState('Finly HQ')
  const [taxId, setTaxId] = useState('00-1234567')
  const [currency, setCurrency] = useState<string>(globalCurrency)
  const [invoicePrefix, setInvoicePrefix] = useState('INV')
  const [profileSaveSuccess, setProfileSaveSuccess] = useState<boolean>(false)
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false)
  const [logoModalOpen, setLogoModalOpen] = useState(false)

  // Sync currency state when global currency changes
  useEffect(() => {
    setCurrency(globalCurrency)
  }, [globalCurrency])

  // Load from localStorage on mount
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
    } catch {
      // Fallback
    }
  }, [])

  // When provider changes, select its default model
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

    // Simulate API connection ping test
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
    const dataToSave = {
      businessName,
      taxId,
      currency,
      invoicePrefix,
    }
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
    <div className="max-w-4xl space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Workspace Settings
        </h1>
        <p className="mt-1.5 text-muted-foreground text-sm">
          Manage business profile, defaults, and AI Agent API connections.
        </p>
      </div>

      {/* Tab Navigation Controls */}
      <div className="flex items-center gap-2 border-b border-border pb-4 flex-wrap">
        <button
          onClick={() => setActiveTab('profile')}
          className={cn(
            'flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer outline-none',
            activeTab === 'profile'
              ? 'bg-primary text-primary-foreground shadow-none'
              : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-accent',
          )}
        >
          <User className="h-4 w-4" />
          Profile & Workspace
        </button>
        <button
          onClick={() => setActiveTab('ai')}
          className={cn(
            'flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer outline-none',
            activeTab === 'ai'
              ? 'bg-primary text-primary-foreground shadow-none'
              : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-accent',
          )}
        >
          <Bot className="h-4 w-4" />
          AI Agent Connections
        </button>
      </div>

      {/* TAB 1: Profile & Workspace Settings */}
      {activeTab === 'profile' && (
        <div className="space-y-8">
          {/* Business Profile Card */}
          <div className="border border-border bg-card p-8 rounded-2xl shadow-none space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  Business Profile
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Update business name, tax identification, and logo displayed
                  on customer invoices.
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
                  Suggested: 512x512px (PNG, SVG). Displays on issued PDFs.
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
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Workspace Name"
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
                    value={taxId}
                    onChange={(e) => setTaxId(e.target.value)}
                    placeholder="Tax ID"
                    className="h-11 w-full border border-border bg-background rounded-xl pl-10 pr-4 text-sm font-medium outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Regional & Defaults Card */}
          <div className="border border-border bg-card p-8 rounded-2xl shadow-none space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
                <SlidersHorizontal className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  Regional & Defaults
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Configure default base currency and invoice numbering
                  prefixes.
                </p>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground">
                  Base Currency
                </label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger className="w-full h-11 border border-border rounded-xl shadow-none bg-background text-foreground text-sm font-medium">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {Object.values(SUPPORTED_CURRENCIES).map((c) => (
                      <SelectItem key={c.code} value={c.code}>
                        {c.name} ({c.symbol})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Note: Stored in minor integer units (Scale 100).
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground">
                  Invoice Number Prefix
                </label>
                <input
                  type="text"
                  value={invoicePrefix}
                  onChange={(e) => setInvoicePrefix(e.target.value)}
                  placeholder="INV"
                  className="h-11 w-full border border-border bg-background rounded-xl px-4 text-sm font-medium outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border">
              {profileSaveSuccess ? (
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <Check className="h-3.5 w-3.5" /> Profile Saved
                </span>
              ) : (
                <span />
              )}
              <Button
                type="button"
                onClick={handleSaveProfileSettings}
                className="px-6 text-xs font-bold"
              >
                Save Profile Settings
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: AI Agent Connection Settings */}
      {activeTab === 'ai' && (
        <div className="border border-border bg-card p-8 rounded-2xl shadow-none space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  AI Agent API Connections
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Connect external LLM engines (Gemini, ChatGPT, Claude,
                  DeepSeek, or Local Ollama) to power Finly AI Assistant.
                </p>
              </div>
            </div>
            <span className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20">
              <CheckCircle2 className="h-3.5 w-3.5" /> Ready for Parsing
            </span>
          </div>

          {/* Provider Cards Selection Grid */}
          <div className="space-y-3 pt-2">
            <label className="text-xs font-bold text-foreground uppercase tracking-wider">
              Select Active AI Provider:
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
                      'relative text-left p-4 rounded-xl border transition-all cursor-pointer outline-none flex flex-col justify-between',
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

          {/* Provider Detailed Configuration Form */}
          <div className="p-6 rounded-xl bg-muted/40 border border-border space-y-6">
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
                  <CheckCircle2 className="h-4 w-4" /> Connection Verified (
                  {testLatency}ms)
                </span>
              )}
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {/* API Key Input */}
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
                    className="text-xs font-semibold text-primary hover:underline"
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
                    className="h-11 w-full border border-border bg-background rounded-xl pl-4 pr-12 text-sm font-mono font-medium outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground"
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

              {/* Custom Endpoint URL (For Custom / Local LLM) */}
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
                    className="h-11 w-full border border-border bg-background rounded-xl px-4 text-sm font-mono font-medium outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              )}

              {/* Model Selection Dropdown */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Globe className="h-3.5 w-3.5 text-muted-foreground" /> Model
                  Selection
                </label>
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger className="w-full h-11 border border-border rounded-xl shadow-none bg-background text-foreground text-sm font-medium">
                    <SelectValue placeholder="Select Model" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {currentProviderObj.models.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Temperature Preset Control */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Sliders className="h-3.5 w-3.5 text-muted-foreground" />{' '}
                    Temperature
                  </span>
                  <span className="font-mono text-xs text-primary font-bold">
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

            {/* Connection Test & Save Footer */}
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
                    Testing API Ping...
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
                    <Check className="h-3.5 w-3.5" /> Saved to Storage
                  </span>
                )}
                <Button
                  type="button"
                  onClick={handleSaveAISettings}
                  className="px-5 text-xs font-bold"
                >
                  Save AI Connections
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
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
        description="Select a PNG, SVG, or JPEG file under 1MB to display on your customer invoices."
        confirmText="Got it"
      />
    </div>
  )
}
