import * as React from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { format } from 'date-fns'
import {
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  ArrowUpRight,
  ArrowDownRight,
  ArrowDown,
  Receipt,
  Sparkles,
} from '#/components/ui/icon'
import {
  Button,
  Calendar,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
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
  Switch,
} from '#/components/ui'
import { useCurrency } from '../../lib/currency'
import { runValidation, customerFormSchema } from '../../lib/validation'
import CATEGORIES from '../../data/categories.json'

export interface CreatedCustomer {
  id: number
  name: string
  email: string
  phone: string
  term: number
  address: string
  spent?: number
}

export interface CreatedRecord {
  type: 'income' | 'expense'
  amount: number
  currency: string
  category: string
  scope: 'business' | 'personal'
  description: string
  date: string
}

export interface CreateCustomerModalProps {
  onSuccess?: (customer: CreatedCustomer, record?: CreatedRecord | null) => void
  onCancel?: () => void
}

export function CreateCustomerModal({
  onSuccess,
  onCancel,
}: CreateCustomerModalProps) {
  const { symbol, currency } = useCurrency()

  // Customer Profile State
  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [phone, setPhone] = React.useState('')
  const [term, setTerm] = React.useState<'net7' | 'net14' | 'net30'>('net30')
  const [address, setAddress] = React.useState('')

  // Create Record Option State
  const [createRecord, setCreateRecord] = React.useState(false)
  const [recordType, setRecordType] = React.useState<'income' | 'expense'>(
    'income',
  )
  const [recordAmount, setRecordAmount] = React.useState('')
  const [recordCategory, setRecordCategory] = React.useState(
    'General / Primary Income',
  )
  const [recordScope, setRecordScope] = React.useState<'business' | 'personal'>(
    'business',
  )
  const [recordDescription, setRecordDescription] = React.useState('')
  const [recordDate, setRecordDate] = React.useState<Date | undefined>(
    () => new Date(),
  )

  const [errors, setErrors] = React.useState<Record<string, string>>({})

  // Update default record description when customer name changes if untouched
  const handleNameChange = (val: string) => {
    setName(val)
    if (errors.name) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next.name
        return next
      })
    }
  }

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    const validation = runValidation(customerFormSchema, {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      term,
      address: address.trim(),
    })

    if (!validation.success) {
      setErrors(validation.errors)
      return
    }

    let parsedAmount = 0
    if (createRecord) {
      parsedAmount = parseFloat(recordAmount.replace(/[^0-9.]/g, '')) || 0
      if (parsedAmount <= 0) {
        setErrors((prev) => ({
          ...prev,
          recordAmount: 'Please enter a valid amount greater than 0',
        }))
        return
      }
    }

    setErrors({})

    const customerObj: CreatedCustomer = {
      id: Date.now(),
      name: validation.data.name,
      email: validation.data.email,
      phone: validation.data.phone || '-',
      term: term === 'net7' ? 7 : term === 'net14' ? 14 : 30,
      address: validation.data.address || '-',
      spent: 0,
    }

    let recordObj: CreatedRecord | null = null
    if (createRecord) {
      recordObj = {
        type: recordType,
        amount: parsedAmount,
        currency,
        category: recordCategory,
        scope: recordScope,
        description:
          recordDescription.trim() ||
          `${customerObj.name} - ${recordType === 'income' ? 'Client Payment' : 'Expense'}`,
        date: recordDate
          ? format(recordDate, 'yyyy-MM-dd')
          : format(new Date(), 'yyyy-MM-dd'),
      }
    }

    onSuccess?.(customerObj, recordObj)
  }

  return (
    <DialogContent className="max-w-md sm:max-w-xl max-h-[90vh] overflow-y-auto no-scrollbar p-5 sm:p-7">
      <DialogHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <DialogTitle className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
              New Customer
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Add a new client profile and optionally create an initial ledger
              record.
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 mt-2">
        {/* Customer Profile Fields */}
        <div className="space-y-3.5">
          <div>
            <label className="block text-[11px] font-semibold text-foreground mb-1">
              Company / Client Name <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Acme Studio, TechCorp Inc."
              className={`w-full h-10 border bg-background rounded-md px-3.5 text-xs sm:text-sm font-medium outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground ${
                errors.name
                  ? 'border-destructive ring-2 ring-destructive/20'
                  : 'border-border'
              }`}
            />
            {errors.name && (
              <p className="text-[11px] font-semibold text-destructive mt-1">
                {errors.name}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-foreground mb-1">
                Email Address <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (errors.email) {
                      setErrors((prev) => {
                        const next = { ...prev }
                        delete next.email
                        return next
                      })
                    }
                  }}
                  placeholder="billing@example.com"
                  className={`w-full h-10 border bg-background rounded-md pl-9 pr-3.5 text-xs sm:text-sm font-medium outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground ${
                    errors.email
                      ? 'border-destructive ring-2 ring-destructive/20'
                      : 'border-border'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-[11px] font-semibold text-destructive mt-1">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-foreground mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value)
                    if (errors.phone) {
                      setErrors((prev) => {
                        const next = { ...prev }
                        delete next.phone
                        return next
                      })
                    }
                  }}
                  placeholder="+1 (555) 000-0000"
                  className={`w-full h-10 border bg-background rounded-md pl-9 pr-3.5 text-xs sm:text-sm font-medium outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground ${
                    errors.phone ? 'border-destructive' : 'border-border'
                  }`}
                />
              </div>
              {errors.phone && (
                <p className="text-[11px] font-semibold text-destructive mt-1">
                  {errors.phone}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-foreground mb-1">
                Payment Terms
              </label>
              <Select
                value={term}
                onValueChange={(val: 'net7' | 'net14' | 'net30') =>
                  setTerm(val)
                }
              >
                <SelectTrigger className="w-full h-10 rounded-md border border-border bg-card text-xs font-semibold">
                  <SelectValue placeholder="Select terms" />
                </SelectTrigger>
                <SelectContent className="rounded-md">
                  <SelectItem value="net7">Net 7 Days</SelectItem>
                  <SelectItem value="net14">Net 14 Days</SelectItem>
                  <SelectItem value="net30">Net 30 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-foreground mb-1">
                Billing Address
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street address, City, Country"
                  className="w-full h-10 border border-border bg-background rounded-md pl-9 pr-3.5 text-xs sm:text-sm font-medium outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Option like "Create Record" */}
        <div className="border border-border rounded-xl p-3.5 sm:p-4 bg-muted/40 transition-colors">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/60 text-accent-foreground border border-border shrink-0">
                <Receipt className="h-4 w-4" />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-1.5">
                  Create Initial Record
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/25">
                    Optional
                  </span>
                </div>
                <div className="text-[11px] text-muted-foreground">
                  Record an upfront retainer, deposit, or opening ledger entry.
                </div>
              </div>
            </div>
            <Switch
              checked={createRecord}
              onCheckedChange={(checked) => {
                setCreateRecord(checked)
                if (checked && !recordDescription && name) {
                  setRecordDescription(`${name} - Retainer`)
                }
              }}
            />
          </div>

          <AnimatePresence>
            {createRecord && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden pt-4 space-y-3.5 border-t border-border mt-3.5"
              >
                {/* Transaction Type Buttons */}
                <div className="grid grid-cols-2 gap-1.5 p-1 bg-muted/60 border border-border rounded-md">
                  <button
                    type="button"
                    onClick={() => {
                      setRecordType('income')
                      setRecordCategory('General / Primary Income')
                    }}
                    className={`flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer outline-none ${
                      recordType === 'income'
                        ? 'bg-card text-emerald-600 dark:text-emerald-400 border border-border shadow-xs'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <ArrowUpRight className="h-3.5 w-3.5" />
                    Income Entry
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRecordType('expense')
                      setRecordCategory('Software, apps, games')
                    }}
                    className={`flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer outline-none ${
                      recordType === 'expense'
                        ? 'bg-card text-rose-600 dark:text-rose-400 border border-border shadow-xs'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <ArrowDownRight className="h-3.5 w-3.5" />
                    Expense Entry
                  </button>
                </div>

                {/* Amount Input */}
                <div>
                  <label className="block text-[11px] font-semibold text-foreground mb-1">
                    Amount ({currency}){' '}
                    <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold font-mono text-muted-foreground">
                      {symbol}
                    </span>
                    <input
                      type="number"
                      step="any"
                      min="0"
                      value={recordAmount}
                      onChange={(e) => {
                        setRecordAmount(e.target.value)
                        if (errors.recordAmount) {
                          setErrors((prev) => {
                            const next = { ...prev }
                            delete next.recordAmount
                            return next
                          })
                        }
                      }}
                      placeholder="0.00"
                      className={`w-full h-10 border bg-background rounded-md pl-10 pr-3.5 font-mono text-sm font-semibold outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground ${
                        errors.recordAmount
                          ? 'border-destructive ring-2 ring-destructive/20'
                          : 'border-border'
                      }`}
                    />
                  </div>
                  {errors.recordAmount && (
                    <p className="text-[11px] font-semibold text-destructive mt-1">
                      {errors.recordAmount}
                    </p>
                  )}
                </div>

                {/* Category & Scope */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-foreground mb-1">
                      Category
                    </label>
                    <Select
                      value={recordCategory}
                      onValueChange={setRecordCategory}
                    >
                      <SelectTrigger className="w-full h-10 rounded-md border border-border bg-card text-xs font-semibold">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent className="rounded-md">
                        {CATEGORIES.map((catGroup) => (
                          <SelectGroup key={catGroup.group}>
                            <SelectLabel className="font-bold text-[10px] text-muted-foreground uppercase">
                              {catGroup.group}
                            </SelectLabel>
                            {catGroup.items.map((item) => (
                              <SelectItem key={item} value={item}>
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

                  <div>
                    <label className="block text-[11px] font-semibold text-foreground mb-1">
                      Scope
                    </label>
                    <Select
                      value={recordScope}
                      onValueChange={(val: 'business' | 'personal') =>
                        setRecordScope(val)
                      }
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

                {/* Description & Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-foreground mb-1">
                      Record Description
                    </label>
                    <input
                      type="text"
                      value={recordDescription}
                      onChange={(e) => setRecordDescription(e.target.value)}
                      placeholder={
                        name ? `${name} - Deposit` : 'Client retainer payment'
                      }
                      className="w-full h-10 border border-border bg-background rounded-md px-3.5 text-xs font-medium outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-foreground mb-1">
                      Record Date
                    </label>
                    <Popover>
                      <PopoverTrigger
                        render={
                          <Button
                            type="button"
                            variant="outline"
                            data-empty={!recordDate}
                            className="w-full justify-between text-left font-normal h-10 text-xs data-[empty=true]:text-muted-foreground"
                          >
                            {recordDate ? (
                              format(recordDate, 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <ArrowDown
                              data-icon="inline-end"
                              className="h-3.5 w-3.5 opacity-60"
                            />
                          </Button>
                        }
                      />
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={recordDate}
                          onSelect={setRecordDate}
                          defaultMonth={recordDate}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border mt-5">
          <DialogClose
            render={
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="rounded-md h-10 text-xs px-4 font-semibold"
              >
                Cancel
              </Button>
            }
          />
          <Button
            type="submit"
            className="rounded-md h-10 text-xs px-5 font-bold"
          >
            {createRecord ? (
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                Create Customer & Record
              </span>
            ) : (
              'Create Customer'
            )}
          </Button>
        </div>
      </form>
    </DialogContent>
  )
}
