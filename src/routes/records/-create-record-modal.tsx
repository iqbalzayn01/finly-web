import { Link } from '@tanstack/react-router'
import { useEffect, useState, useRef, useCallback, useMemo } from 'react'
import type { SubmitEvent } from 'react'
import { motion } from 'motion/react'
import { format } from 'date-fns'
import {
  ArrowUpRight,
  ArrowDownRight,
  Building2,
  User,
  Keyboard,
  ArrowDown,
} from '#/components/ui/icon'
import {
  Button,
  Calendar,
  DialogContent,
  DialogHeader,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
} from '#/components/ui'
import { useCurrency } from '../../lib/currency'
import type { CurrencyCode } from '../../lib/currency'
import { runValidation, quickEntrySchema } from '../../lib/validation'

export const RECORD_CATEGORIES = [
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
      'Interests, dividends',
      'Refunds (tax, purchase)',
    ],
  },
  {
    group: 'Communication & Tech',
    badge: 'bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300',
    dot: 'bg-blue-500',
    items: [
      'Software, apps, games',
      'Cloud Infrastructure & Hosting',
      'Internet',
      'Phone, cell phone',
      'Hardware & Electronics',
    ],
  },
  {
    group: 'Financial & Legal',
    badge: 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300',
    dot: 'bg-red-500',
    items: [
      'Advisory',
      'Charges, Fees',
      'Insurances',
      'Taxes',
      'Loan, interests',
    ],
  },
  {
    group: 'Operations & Workspace',
    badge:
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-300',
    dot: 'bg-yellow-500',
    items: [
      'Rent',
      'Energy, utilities',
      'Maintenance, repairs',
      'Office Supplies',
      'Marketing & Advertising',
      'Services',
    ],
  },
  {
    group: 'Investments & Capital',
    badge:
      'bg-indigo-100 text-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-300',
    dot: 'bg-indigo-500',
    items: [
      'Equipment purchase',
      'Capital asset',
      'Reserve fund',
      'Financial investments',
    ],
  },
]

export interface RecordTransactionData {
  type: 'income' | 'expense'
  amount: number
  category: string
  scope: 'business' | 'personal'
  description: string
  currency?: CurrencyCode
}

export interface RecordProps {
  onSave?: (data: RecordTransactionData) => void
  currency?: CurrencyCode
}

export function CreateRecordModal({
  onSave,
  currency: propCurrency,
}: RecordProps) {
  const globalCurrency = useCurrency()
  const activeCurrency = propCurrency || globalCurrency.currency
  const activeConfig = globalCurrency.config
  const symbol = globalCurrency.symbol
  const [date, setDate] = useState<Date>()

  const [txType, setTxType] = useState<'expense' | 'income'>('expense')
  const [entryAmount, setEntryAmount] = useState<string>('0')
  const [category, setCategory] = useState<string>('')
  const [scope, setScope] = useState<'business' | 'personal'>('business')
  const [description, setDescription] = useState<string>('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const descriptionInputRef = useRef<HTMLInputElement>(null)

  const maxDigits = activeConfig.maxDigits || 9

  const handleNumpad = useCallback(
    (val: string) => {
      setErrors((prev) => {
        if (!prev.amount) return prev
        const updated = { ...prev }
        delete updated.amount
        return updated
      })

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

  const submitTransaction = useCallback(() => {
    const parsedAmount = parseInt(entryAmount, 10) || 0
    const selectedCategory =
      category ||
      (txType === 'income'
        ? 'General / Primary Income'
        : 'Software, apps, games')

    const validation = runValidation(quickEntrySchema, {
      type: txType,
      amount: parsedAmount,
      currency: activeCurrency,
      category: selectedCategory,
      scope,
      description: description.trim(),
    })

    if (!validation.success) {
      setErrors(validation.errors)
      return
    }

    setErrors({})
    onSave?.({
      type: validation.data.type,
      amount: validation.data.amount,
      currency: activeCurrency,
      category: selectedCategory,
      scope: validation.data.scope,
      description:
        description.trim() ||
        (txType === 'income' ? 'Client Payment' : 'Operating Expense'),
    })
  }, [
    entryAmount,
    txType,
    activeCurrency,
    category,
    scope,
    description,
    onSave,
  ])

  const handleSave = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    submitTransaction()
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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

      if (
        (e.key >= '0' && e.key <= '9') ||
        (e.code && e.code.startsWith('Numpad') && !isNaN(Number(e.key)))
      ) {
        e.preventDefault()
        handleNumpad(e.key)
        return
      }

      if (e.key === 'Backspace') {
        e.preventDefault()
        handleNumpad('BACK')
        return
      }

      if (e.key === 'c' || e.key === 'C' || e.key === 'Delete') {
        e.preventDefault()
        handleNumpad('C')
        return
      }

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
  }, [handleNumpad, submitTransaction, entryAmount])

  const displayFormatted = useMemo(() => {
    const num = parseInt(entryAmount || '0', 10)
    return `${symbol} ${num.toLocaleString(activeConfig.locale)}`
  }, [entryAmount, symbol, activeConfig.locale])

  return (
    <DialogContent className="max-w-sm md:max-w-lg">
      {/* <DialogHeader className="flex items-center justify-between pb-3 sm:pb-4 border-b border-border mb-4 sm:mb-5"> */}
      <DialogHeader>
        <div className="flex items-center gap-2.5">
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-md border shrink-0 ${
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
            <div className="text-base sm:text-lg font-bold tracking-tight text-foreground">
              Quick Entry
            </div>
            <div className="text-[11px] sm:text-xs text-muted-foreground">
              Record a cash transaction to your ledger.
            </div>
          </div>
        </div>
      </DialogHeader>

      <form onSubmit={handleSave} className="space-y-4 sm:space-y-5">
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-muted/50 border border-border rounded-md">
          <button
            type="button"
            onClick={() => setTxType('expense')}
            className={`flex items-center justify-center gap-1.5 py-1.5 sm:py-2 text-xs font-bold rounded-md transition-all cursor-pointer outline-none ${
              txType === 'expense'
                ? 'bg-card text-rose-600 dark:text-rose-400 shadow-none border border-border'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <ArrowDownRight className="h-3.5 w-3.5" />
            Expense{' '}
            <span className="text-[10px] opacity-70 font-mono">(E)</span>
          </button>
          <button
            type="button"
            onClick={() => setTxType('income')}
            className={`flex items-center justify-center gap-1.5 py-1.5 sm:py-2 text-xs font-bold rounded-lg transition-all cursor-pointer outline-none ${
              txType === 'income'
                ? 'bg-card text-emerald-600 dark:text-emerald-400 shadow-none border border-border'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <ArrowUpRight className="h-3.5 w-3.5" />
            Income <span className="text-[10px] opacity-70 font-mono">(I)</span>
          </button>
        </div>

        <div
          data-quick-entry="amount"
          className={`text-center py-2.5 sm:py-3 px-3 sm:px-4 rounded-md bg-muted/30 border transition-all ${
            errors.amount
              ? 'border-destructive ring-2 ring-destructive/20'
              : 'border-border'
          }`}
        >
          <div className="flex items-center justify-center gap-1.5 mb-0.5 sm:mb-1 text-muted-foreground">
            <Keyboard className="h-3.5 w-3.5" />
            <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider">
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
            className={`font-mono text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight truncate ${
              txType === 'income'
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-foreground'
            }`}
          >
            {displayFormatted}
          </motion.div>
          {errors.amount && (
            <p className="text-[11px] font-semibold text-destructive mt-1">
              {errors.amount}
            </p>
          )}
        </div>

        <div className="space-y-3 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="block text-[11px] font-semibold text-muted-foreground">
                Category
              </label>
              <Select
                value={category}
                onValueChange={setCategory}
                defaultValue={
                  txType === 'income'
                    ? 'general-primary-income'
                    : 'software-apps-games'
                }
              >
                <SelectTrigger className="w-full h-10 rounded-md border border-border bg-card text-xs font-semibold">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="rounded-md">
                  {RECORD_CATEGORIES.map((catGroup) => (
                    <SelectGroup key={catGroup.group}>
                      <SelectLabel className="font-bold text-[10px] text-muted-foreground uppercase">
                        {catGroup.group}
                      </SelectLabel>
                      {catGroup.items.map((item) => (
                        <SelectItem
                          key={item}
                          value={item.toLowerCase().replace(/[\s,()&]+/g, '-')}
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

            <div className="space-y-2">
              <label className="block text-[11px] font-semibold text-muted-foreground">
                Scope
              </label>
              <Select
                value={scope}
                onValueChange={(val: 'business' | 'personal') => setScope(val)}
                defaultValue="business"
              >
                <SelectTrigger className="w-full h-10 rounded-md border border-border bg-card text-xs font-semibold">
                  <SelectValue placeholder="Scope" />
                </SelectTrigger>
                <SelectContent className="rounded-md">
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

          <div className="space-y-2">
            <label className="block text-[11px] font-semibold text-muted-foreground">
              Description or counterparty (optional)
            </label>
            <input
              ref={descriptionInputRef}
              type="text"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value)
                if (errors.description) {
                  setErrors((prev) => {
                    const updated = { ...prev }
                    delete updated.description
                    return updated
                  })
                }
              }}
              placeholder="e.g. AWS Cloud, Client Retainer, Office Supplies"
              className={`w-full h-10 border bg-background rounded-md px-3.5 text-xs font-medium outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground ${
                errors.description ? 'border-destructive' : 'border-border'
              }`}
            />
            {errors.description && (
              <p className="text-[11px] font-semibold text-destructive mt-1">
                {errors.description}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-[11px] font-semibold text-muted-foreground">
              Recorded Date
            </label>
            <Popover>
              <PopoverTrigger
                render={
                  <Button
                    type="button"
                    variant="outline"
                    data-empty={!date}
                    className="w-full  justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
                  >
                    {date ? format(date, 'PPP') : <span>Pick a date</span>}
                    <ArrowDown data-icon="inline-end" />
                  </Button>
                }
              />
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  defaultMonth={date}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border mt-5">
          <Button
            asChild
            type="button"
            variant="outline"
            className="rounded-md h-10 text-xs px-4 font-semibold"
          >
            <Link to="/records">Cancel</Link>
          </Button>
          <Button
            type="submit"
            disabled={parseInt(entryAmount, 10) <= 0}
            className="rounded-md h-10 text-xs px-5 font-bold"
          >
            Record Transaction
          </Button>
        </div>
      </form>
    </DialogContent>
  )
}
