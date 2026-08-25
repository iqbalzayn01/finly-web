import * as React from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Dialog as DialogPrimitive } from 'radix-ui'
import {
  X,
  ArrowUpRight,
  ArrowDownRight,
  Building2,
  User,
  Delete as BackspaceIcon,
  Keyboard,
} from 'lucide-react'
import { Button } from './button'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
} from './select'
import { useCurrency, type CurrencyCode } from '../../lib/currency'

export const QUICK_ENTRY_CATEGORIES = [
  {
    group: 'Income',
    badge:
      'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300',
    dot: 'bg-emerald-500',
    items: [
      'General / Primary Income',
      'Client Retainer',
      'Project Milestone',
      'Consulting Services',
      'Checks, coupons',
      'Dues & grants',
      'Interests, dividends',
      'Refunds (tax, purchase)',
    ],
  },
  {
    group: 'Communication & Tech',
    badge: 'bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300',
    dot: 'bg-blue-500',
    items: [
      'Software, SaaS & Subscriptions',
      'Hosting & Cloud Servers',
      'Internet & Telecom',
      'Hardware & Electronics',
    ],
  },
  {
    group: 'Financial & Legal',
    badge: 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300',
    dot: 'bg-red-500',
    items: [
      'Advisory & Consulting',
      'Bank Charges & Processing Fees',
      'Insurances',
      'Taxes & Regulatory',
    ],
  },
  {
    group: 'Operations & Workspace',
    badge:
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-300',
    dot: 'bg-yellow-500',
    items: [
      'Office Rent & Utilities',
      'Equipment Maintenance',
      'Professional Services',
      'Marketing & Advertising',
      'Travel & Logistics',
      'Meals & Client Entertainment',
    ],
  },
  {
    group: 'Investments & Capital',
    badge:
      'bg-indigo-100 text-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-300',
    dot: 'bg-indigo-500',
    items: ['Equipment purchase', 'Capital asset', 'Reserve fund'],
  },
]

export interface QuickEntryTransactionData {
  type: 'income' | 'expense'
  amount: number
  category: string
  scope: 'business' | 'personal'
  description: string
  currency?: CurrencyCode
}

export interface QuickEntryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave?: (data: QuickEntryTransactionData) => void
  currency?: CurrencyCode
}

export function QuickEntryModal({
  open,
  onOpenChange,
  onSave,
  currency: propCurrency,
}: QuickEntryModalProps) {
  const globalCurrency = useCurrency()
  const activeCurrency = propCurrency || globalCurrency.currency
  const activeConfig = globalCurrency.config
  const symbol = globalCurrency.symbol

  const [txType, setTxType] = React.useState<'expense' | 'income'>('expense')
  const [entryAmount, setEntryAmount] = React.useState<string>('0')
  const [category, setCategory] = React.useState<string>('')
  const [scope, setScope] = React.useState<'business' | 'personal'>('business')
  const [description, setDescription] = React.useState<string>('')
  const [activeKey, setActiveKey] = React.useState<string | null>(null)

  const descriptionInputRef = React.useRef<HTMLInputElement>(null)

  // Reset form when modal opens
  React.useEffect(() => {
    if (open) {
      setEntryAmount('0')
      setDescription('')
      setActiveKey(null)
    }
  }, [open])

  const maxDigits = activeConfig.maxDigits || 9

  // Handle keypad and keyboard numbers with tactile feedback
  const handleNumpad = React.useCallback(
    (val: string) => {
      setActiveKey(val)
      setTimeout(() => {
        setActiveKey((curr) => (curr === val ? null : curr))
      }, 150)

      if (val === 'C') {
        setEntryAmount('0')
        return
      }
      if (val === 'BACK' || val === 'Backspace') {
        setEntryAmount((prev) => (prev.length <= 1 ? '0' : prev.slice(0, -1)))
        return
      }
      if (val === '00') {
        setEntryAmount((prev) => {
          if (prev === '0') return '0'
          if (prev.length >= maxDigits - 1) return prev
          return prev + '00'
        })
        return
      }
      setEntryAmount((prev) => {
        if (prev === '0') return val
        if (prev.length >= maxDigits) return prev
        return prev + val
      })
    },
    [maxDigits],
  )

  const submitTransaction = React.useCallback(() => {
    const parsedAmount = parseInt(entryAmount, 10) || 0
    if (parsedAmount <= 0) return

    onSave?.({
      type: txType,
      amount: parsedAmount,
      currency: activeCurrency,
      category:
        category ||
        (txType === 'income'
          ? 'General / Primary Income'
          : 'Software, SaaS & Subscriptions'),
      scope,
      description:
        description.trim() ||
        (txType === 'income' ? 'Client Payment' : 'Operating Expense'),
    })

    onOpenChange(false)
  }, [
    entryAmount,
    txType,
    activeCurrency,
    category,
    scope,
    description,
    onSave,
    onOpenChange,
  ])

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    submitTransaction()
  }

  // Global Keyboard & Numeric Keypad Listener
  React.useEffect(() => {
    if (!open) return

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept number keys if user is typing in the description text input
      const activeEl = document.activeElement
      if (
        activeEl === descriptionInputRef.current ||
        (activeEl &&
          activeEl.tagName === 'INPUT' &&
          activeEl !== document.body &&
          activeEl.getAttribute('data-quick-entry') !== 'amount')
      ) {
        if (e.key === 'Enter') {
          e.preventDefault()
          submitTransaction()
        }
        return
      }

      // Check numeric keys: top row (0-9) or Numeric Keypad (Numpad0-Numpad9)
      if (
        (e.key >= '0' && e.key <= '9') ||
        (e.code && e.code.startsWith('Numpad') && !isNaN(Number(e.key)))
      ) {
        e.preventDefault()
        handleNumpad(e.key)
        return
      }

      // Backspace: delete last entered digit
      if (e.key === 'Backspace') {
        e.preventDefault()
        handleNumpad('BACK')
        return
      }

      // Clear shortcut: 'c', 'C', 'Delete'
      if (e.key === 'c' || e.key === 'C' || e.key === 'Delete') {
        e.preventDefault()
        handleNumpad('C')
        return
      }

      // Fast toggle type: 'e' for Expense, 'i' for Income
      if (e.key === 'e' || e.key === 'E') {
        e.preventDefault()
        setTxType('expense')
        return
      }
      if (e.key === 'i' || e.key === 'I') {
        e.preventDefault()
        setTxType('income')
        return
      }

      // Enter key or NumpadEnter to submit
      if (e.key === 'Enter' || e.code === 'NumpadEnter') {
        const parsed = parseInt(entryAmount, 10) || 0
        if (parsed > 0) {
          e.preventDefault()
          submitTransaction()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, handleNumpad, submitTransaction, entryAmount])

  // Formatted amount preview
  const displayFormatted = React.useMemo(() => {
    const num = parseInt(entryAmount || '0', 10)
    return `${symbol} ${num.toLocaleString(activeConfig.locale)}`
  }, [entryAmount, symbol, activeConfig.locale])

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <DialogPrimitive.Portal forceMount>
            {/* Backdrop Blur Overlay */}
            <DialogPrimitive.Overlay asChild forceMount>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              />
            </DialogPrimitive.Overlay>

            {/* Modal Dialog Body */}
            <DialogPrimitive.Content asChild forceMount>
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 12 }}
                  transition={{ type: 'spring', damping: 26, stiffness: 350 }}
                  className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-card p-6 text-foreground shadow-none outline-none my-auto"
                >
                  {/* Header Bar */}
                  <div className="flex items-center justify-between pb-4 border-b border-border mb-5">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-xl border ${
                          txType === 'income'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                        }`}
                      >
                        {txType === 'income' ? (
                          <ArrowUpRight className="h-4 w-4" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <DialogPrimitive.Title className="text-lg font-bold tracking-tight text-foreground">
                          Quick Entry
                        </DialogPrimitive.Title>
                        <DialogPrimitive.Description className="text-xs text-muted-foreground">
                          Record a transaction to your ledger in {activeConfig.name}.
                        </DialogPrimitive.Description>
                      </div>
                    </div>

                    <DialogPrimitive.Close asChild>
                      <button
                        type="button"
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer outline-none"
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Close</span>
                      </button>
                    </DialogPrimitive.Close>
                  </div>

                  <form onSubmit={handleSave} className="space-y-5">
                    {/* Income vs Expense Pill Switcher */}
                    <div className="grid grid-cols-2 gap-1.5 p-1 bg-muted/50 border border-border rounded-xl">
                      <button
                        type="button"
                        onClick={() => setTxType('expense')}
                        className={`flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer outline-none ${
                          txType === 'expense'
                            ? 'bg-card text-rose-600 dark:text-rose-400 shadow-none border border-border'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        <ArrowDownRight className="h-3.5 w-3.5" />
                        Expense <span className="text-[10px] opacity-70 font-mono">(E)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setTxType('income')}
                        className={`flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer outline-none ${
                          txType === 'income'
                            ? 'bg-card text-emerald-600 dark:text-emerald-400 shadow-none border border-border'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        <ArrowUpRight className="h-3.5 w-3.5" />
                        Income <span className="text-[10px] opacity-70 font-mono">(I)</span>
                      </button>
                    </div>

                    {/* Prominent Amount Display with Keyboard / Numpad Guide */}
                    <div
                      data-quick-entry="amount"
                      className="text-center py-3 px-4 rounded-xl bg-muted/30 border border-border transition-all"
                    >
                      <div className="flex items-center justify-center gap-1.5 mb-1 text-muted-foreground">
                        <Keyboard className="h-3.5 w-3.5" />
                        <p className="text-[11px] font-semibold uppercase tracking-wider">
                          Amount ({activeCurrency})
                        </p>
                      </div>
                      <motion.div
                        key={entryAmount}
                        initial={{ scale: 0.96, opacity: 0.8 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                          type: 'spring',
                          stiffness: 500,
                          damping: 25,
                        }}
                        className={`font-mono text-3xl sm:text-4xl font-bold tracking-tight ${
                          txType === 'income'
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-foreground'
                        }`}
                      >
                        {displayFormatted}
                      </motion.div>
                    </div>

                    {/* Tactile Numpad Grid with Keyboard Synchronization */}
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { label: '1', val: '1' },
                        { label: '2', val: '2' },
                        { label: '3', val: '3' },
                        { label: '4', val: '4' },
                        { label: '5', val: '5' },
                        { label: '6', val: '6' },
                        { label: '7', val: '7' },
                        { label: '8', val: '8' },
                        { label: '9', val: '9' },
                        { label: 'C', val: 'C', isClear: true },
                        { label: '0', val: '0' },
                        { label: '⌫', val: 'BACK', isBack: true },
                      ].map((item) => {
                        const isPressed =
                          activeKey === item.val ||
                          (item.val === 'BACK' && activeKey === 'Backspace')
                        return (
                          <button
                            key={item.label}
                            type="button"
                            onClick={() => handleNumpad(item.val)}
                            className={`h-11 border border-border text-base font-semibold rounded-xl shadow-none transition-all cursor-pointer outline-none flex items-center justify-center ${
                              isPressed
                                ? 'bg-primary text-primary-foreground border-primary scale-95 ring-2 ring-primary/40'
                                : 'bg-card text-foreground hover:bg-accent hover:text-accent-foreground active:scale-95'
                            } ${item.isClear ? 'text-destructive font-bold' : ''}`}
                          >
                            {item.isBack ? (
                              <BackspaceIcon className="h-4 w-4" />
                            ) : (
                              item.label
                            )}
                          </button>
                        )
                      })}
                    </div>

                    {/* Keyboard Shortcuts Hint Bar */}
                    <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[11px] text-muted-foreground select-none">
                      <span className="inline-flex items-center gap-1">
                        <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border font-mono text-[10px] text-foreground font-semibold">
                          0-9 / NumPad
                        </kbd>
                        <span>Digits</span>
                      </span>
                      <span>•</span>
                      <span className="inline-flex items-center gap-1">
                        <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border font-mono text-[10px] text-foreground font-semibold">
                          ⌫
                        </kbd>
                        <span>Erase</span>
                      </span>
                      <span>•</span>
                      <span className="inline-flex items-center gap-1">
                        <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border font-mono text-[10px] text-foreground font-semibold">
                          C
                        </kbd>
                        <span>Clear</span>
                      </span>
                      <span>•</span>
                      <span className="inline-flex items-center gap-1">
                        <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border font-mono text-[10px] text-foreground font-semibold">
                          ↵ Enter
                        </kbd>
                        <span>Save</span>
                      </span>
                    </div>

                    {/* Metadata Form Controls: Category, Scope, Description */}
                    <div className="space-y-3 pt-1">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Category Selector */}
                        <div>
                          <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                            Category
                          </label>
                          <Select
                            value={category}
                            onValueChange={setCategory}
                            defaultValue={
                              txType === 'income'
                                ? 'general-primary-income'
                                : 'software-saas-subscriptions'
                            }
                          >
                            <SelectTrigger className="w-full h-10 rounded-xl border border-border bg-card text-xs font-semibold">
                              <SelectValue placeholder="Select Category..." />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                              {QUICK_ENTRY_CATEGORIES.map((catGroup) => (
                                <SelectGroup key={catGroup.group}>
                                  <SelectLabel className="font-bold text-[10px] text-muted-foreground uppercase">
                                    {catGroup.group}
                                  </SelectLabel>
                                  {catGroup.items.map((item) => (
                                    <SelectItem
                                      key={item}
                                      value={item
                                        .toLowerCase()
                                        .replace(/[\s,()&]+/g, '-')}
                                    >
                                      <div className="flex items-center gap-2">
                                        <div
                                          className={`w-2 h-2 rounded-full ${catGroup.dot}`}
                                        />
                                        <span className="truncate">{item}</span>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Scope Selector */}
                        <div>
                          <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                            Scope
                          </label>
                          <Select
                            value={scope}
                            onValueChange={(val: 'business' | 'personal') =>
                              setScope(val)
                            }
                            defaultValue="business"
                          >
                            <SelectTrigger className="w-full h-10 rounded-xl border border-border bg-card text-xs font-semibold">
                              <SelectValue placeholder="Scope" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                              <SelectItem value="business">
                                <div className="flex items-center gap-2">
                                  <Building2 className="h-3.5 w-3.5 text-primary" />
                                  <span>Business</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="personal">
                                <div className="flex items-center gap-2">
                                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                                  <span>Personal</span>
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Description / Notes */}
                      <div>
                        <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                          Description / Merchant (Optional)
                        </label>
                        <input
                          ref={descriptionInputRef}
                          type="text"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="e.g., Client Retainer, AWS Cloud Server, Coffee"
                          className="w-full h-10 border border-border bg-background rounded-xl px-3.5 text-xs font-medium outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground"
                        />
                      </div>
                    </div>

                    {/* Footer Action Buttons */}
                    <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border mt-5">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="rounded-xl h-10 text-xs px-4 font-semibold"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={parseInt(entryAmount, 10) <= 0}
                        className="rounded-xl h-10 text-xs px-5 font-bold"
                      >
                        Save Transaction
                      </Button>
                    </div>
                  </form>
                </motion.div>
              </div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  )
}
