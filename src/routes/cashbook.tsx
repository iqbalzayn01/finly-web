import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import {
  Plus,
  Search,
  Camera,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  Edit2,
  Trash2,
} from '../components/ui/icon'
import { motion, AnimatePresence } from 'motion/react'
import { Button } from '../components/ui/button'
import { AlertModal } from '../components/ui/alert-modal'
import { QuickEntryModal } from '../components/ui/quick-entry-modal'
import { useCurrency } from '../lib/currency'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from '../components/ui/select'
import { useDebouncedSearch } from '../hooks/use-debounced-search'

export const Route = createFileRoute('/cashbook')({
  component: Cashbook,
})

const CATEGORIES = [
  {
    group: 'Income',
    badge:
      'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300',
    dot: 'bg-emerald-500',
    items: [
      'General / Primary Income',
      'Checks, coupons',
      'Child Support (Income)',
      'Dues & grants',
      'Gifts (Income)',
      'Interests, dividends',
      'Lending, renting',
      'Lottery, gambling (Income)',
      'Refunds (tax, purchase)',
    ],
  },
  {
    group: 'Communication, PC',
    badge: 'bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300',
    dot: 'bg-blue-500',
    items: [
      'Internet',
      'Phone, cell phone',
      'Postal services',
      'Software, apps, games',
    ],
  },
  {
    group: 'Financial Expenses',
    badge: 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300',
    dot: 'bg-red-500',
    items: [
      'Advisory',
      'Charges, Fees',
      'Child Support (Expense)',
      'Fines',
      'Insurances',
      'Loan, interests',
      'Taxes',
    ],
  },
  {
    group: 'Food & Drinks',
    badge:
      'bg-orange-100 text-orange-800 dark:bg-orange-500/20 dark:text-orange-300',
    dot: 'bg-orange-500',
    items: ['Bar, cafe', 'Groceries', 'Restaurant, fast-food'],
  },
  {
    group: 'Housing',
    badge:
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-300',
    dot: 'bg-yellow-500',
    items: [
      'Energy, utilities',
      'Maintenance, repairs',
      'Mortgage',
      'Property insurance',
      'Rent',
      'Services',
    ],
  },
  {
    group: 'Investments',
    badge:
      'bg-indigo-100 text-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-300',
    dot: 'bg-indigo-500',
    items: [
      'Collections',
      'Financial investments',
      'Realty',
      'Savings',
      'Vehicles, chattels',
    ],
  },
  {
    group: 'Life & Entertainment',
    badge:
      'bg-purple-100 text-purple-800 dark:bg-purple-500/20 dark:text-purple-300',
    dot: 'bg-purple-500',
    items: [
      'Active sport, fitness',
      'Alcohol, tobacco',
      'Books, audio, subscriptions',
      'Charity, gifts',
      'Culture, sport events',
      'Education, development',
      'Health care, doctor',
      'Hobbies',
      'Holiday, trips, hotels',
      'Life events',
      'Lottery, gambling',
      'TV, Streaming',
      'Wellness, beauty',
    ],
  },
  {
    group: 'Shopping',
    badge: 'bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-300',
    dot: 'bg-rose-500',
    items: [
      'Clothes & shoes',
      'Drug-store, chemist',
      'Electronics, accessories',
      'Free time',
      'Gifts, joy',
      'Health and beauty',
      'Home, garden',
      'Jewels, accessories',
      'Kids',
      'Pets, animals',
      'Stationery, tools',
    ],
  },
  {
    group: 'Transportation',
    badge: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-500/20 dark:text-cyan-300',
    dot: 'bg-cyan-500',
    items: [
      'Business trips',
      'Long distance',
      'Public transport',
      'Taxi',
      'Vehicle',
      'Fuel',
      'Leasing',
      'Parking',
      'Rentals',
      'Vehicle insurance',
      'Vehicle maintenance',
    ],
  },
  {
    group: 'Others',
    badge:
      'bg-slate-100 text-slate-800 dark:bg-slate-500/20 dark:text-slate-300',
    dot: 'bg-slate-500',
    items: ['General', 'Missing'],
  },
]

const getCategoryBadge = (categoryName: string) => {
  for (const group of CATEGORIES) {
    if (group.items.includes(categoryName)) return group.badge
  }
  return 'bg-slate-100 text-slate-800 dark:bg-slate-500/20 dark:text-slate-300'
}

const getCategoryDot = (categoryName: string) => {
  for (const group of CATEGORIES) {
    if (group.items.includes(categoryName)) return group.dot
  }
  return 'bg-slate-500'
}

const initialTransactions = [
  {
    id: 1,
    date: '2026-08-01',
    desc: 'Acme Corp Web Dev',
    category: 'General / Primary Income',
    scope: 'Business',
    amount: 5000,
    type: 'income',
    receipt: true,
  },
  {
    id: 2,
    date: '2026-07-28',
    desc: 'AWS Hosting',
    category: 'Software, apps, games',
    scope: 'Business',
    amount: 120,
    type: 'expense',
    receipt: true,
  },
  {
    id: 3,
    date: '2026-07-25',
    desc: 'Lunch meeting with client',
    category: 'Restaurant, fast-food',
    scope: 'Business',
    amount: 45,
    type: 'expense',
    receipt: false,
  },
  {
    id: 4,
    date: '2026-07-20',
    desc: 'Q3 Retainer GlobalTech',
    category: 'General / Primary Income',
    scope: 'Business',
    amount: 3500,
    type: 'income',
    receipt: true,
  },
  {
    id: 5,
    date: '2026-07-15',
    desc: 'Office Supplies Depot',
    category: 'Stationery, tools',
    scope: 'Business',
    amount: 210,
    type: 'expense',
    receipt: false,
  },
  {
    id: 6,
    date: '2026-07-10',
    desc: 'Personal Coffee',
    category: 'Bar, cafe',
    scope: 'Personal',
    amount: 5,
    type: 'expense',
    receipt: false,
  },
]

const m3Transition = {
  type: 'tween' as const,
  ease: [0.2, 0, 0, 1] as [number, number, number, number],
  duration: 0.35,
}

const TYPE_OPTIONS = [
  { value: 'all', label: 'All Types' },
  { value: 'income', label: 'Income' },
  { value: 'expense', label: 'Expense' },
]

const SCOPE_OPTIONS = [
  { value: 'all', label: 'All Scopes' },
  { value: 'business', label: 'Business' },
  { value: 'personal', label: 'Personal' },
]

function Cashbook() {
  const { currency, formatAmount } = useCurrency()
  const [quickEntryOpen, setQuickEntryOpen] = useState(false)
  const [openKebab, setOpenKebab] = useState<number | null>(null)
  const [typeFilter, setTypeFilter] = useState('all')
  const [scopeFilter, setScopeFilter] = useState('all')
  const [feedbackModal, setFeedbackModal] = useState<{
    open: boolean
    type: 'info' | 'success' | 'warning' | 'error'
    title: string
    desc: string
  }>({
    open: false,
    type: 'info',
    title: '',
    desc: '',
  })
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean
    txDesc?: string
  }>({
    open: false,
  })

  // Summary Metrics calculations
  const totalInflow = initialTransactions
    .filter((tx) => tx.type === 'income')
    .reduce((acc, tx) => acc + tx.amount, 0)

  const totalOutflow = initialTransactions
    .filter((tx) => tx.type === 'expense')
    .reduce((acc, tx) => acc + tx.amount, 0)

  const netCashflow = totalInflow - totalOutflow

  const {
    inputQuery,
    setInputQuery,
    isTooShort,
    results: filteredTransactions,
  } = useDebouncedSearch({
    resourceKey: 'cashbook-transactions',
    data: initialTransactions,
    extraFilters: { typeFilter, scopeFilter },
    filterFn: (items, query, filters) => {
      return items.filter((tx) => {
        const matchesSearch =
          !query ||
          tx.desc.toLowerCase().includes(query) ||
          tx.category.toLowerCase().includes(query) ||
          tx.date.toLowerCase().includes(query) ||
          tx.amount.toString().includes(query)

        const matchesType =
          filters?.typeFilter === 'all' || tx.type === filters?.typeFilter
        const matchesScope =
          filters?.scopeFilter === 'all' ||
          tx.scope.toLowerCase() === filters?.scopeFilter?.toLowerCase()

        return matchesSearch && matchesType && matchesScope
      })
    },
  })

  return (
    <div className="space-y-6 sm:space-y-8 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
            Cashbook
          </h1>
          <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-muted-foreground">
            Ledger of all business and personal transactions.
          </p>
        </div>
        <Button
          onClick={() => setQuickEntryOpen(true)}
          className="w-full sm:w-auto h-11 px-6 rounded-full font-semibold shadow-none"
        >
          <Plus className="h-5 w-5 mr-2" /> Quick Entry
        </Button>
      </div>

      {/* Cashbook Summary Cards with Staggered Entrance */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...m3Transition, delay: 0.05 }}
          className="border border-border bg-card p-4 sm:p-5 rounded-2xl shadow-none"
        >
          <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Total Inflow (Income)
          </p>
          <p className="font-mono text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            {formatAmount(totalInflow)}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5 sm:mt-1">
            2 Income Entries
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...m3Transition, delay: 0.1 }}
          className="border border-border bg-card p-4 sm:p-5 rounded-2xl shadow-none"
        >
          <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Total Outflow (Expense)
          </p>
          <p className="font-mono text-xl sm:text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1">
            {formatAmount(totalOutflow)}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5 sm:mt-1">
            4 Expense Entries
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...m3Transition, delay: 0.15 }}
          className="border border-border bg-card p-4 sm:p-5 rounded-2xl shadow-none"
        >
          <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Net Ledger Balance
          </p>
          <p className="font-mono text-xl sm:text-2xl font-bold text-foreground mt-1">
            {formatAmount(netCashflow)}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5 sm:mt-1">
            Cash Surplus Across Accounts
          </p>
        </motion.div>
      </div>

      {/* Main Ledger Table Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...m3Transition, delay: 0.2 }}
        className="border border-border bg-card shadow-none rounded-2xl min-h-[500px] overflow-hidden"
      >
        <div className="p-3.5 sm:p-4 border-b border-border flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10 pointer-events-none" />
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Search transactions..."
              className="w-full h-11 border border-border bg-background rounded-xl pl-10 pr-24 text-xs sm:text-sm font-medium outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground"
            />
            {isTooShort && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] sm:text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 border border-amber-300 dark:border-amber-800 rounded-full">
                Min 3 chars
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 sm:gap-3 shrink-0">
            <div className="w-full sm:w-36">
              <Select
                items={TYPE_OPTIONS}
                value={typeFilter}
                onValueChange={(val) => setTypeFilter(val || 'all')}
              >
                <SelectTrigger className="w-full h-11 border border-border shadow-none text-xs sm:text-sm font-medium bg-card text-foreground rounded-xl">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {TYPE_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full sm:w-36">
              <Select
                items={SCOPE_OPTIONS}
                value={scopeFilter}
                onValueChange={(val) => setScopeFilter(val || 'all')}
              >
                <SelectTrigger className="w-full h-11 border border-border shadow-none text-xs sm:text-sm font-medium bg-card text-foreground rounded-xl">
                  <SelectValue placeholder="All Scopes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {SCOPE_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap min-w-[800px]">
            <thead className="bg-muted/40 text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-4 font-semibold text-xs">Date & Desc</th>
                <th className="px-6 py-4 font-semibold text-xs">Category</th>
                <th className="px-6 py-4 font-semibold text-xs">Scope</th>
                <th className="px-6 py-4 font-semibold text-xs text-right">
                  Amount
                </th>
                <th className="px-6 py-4 font-semibold text-xs text-center">
                  Receipt
                </th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 max-w-sm mx-auto">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
                        <Search className="h-4 w-4" />
                      </div>
                      <p className="font-semibold text-sm text-foreground">
                        No transactions found
                      </p>
                      <p className="text-xs text-muted-foreground">
                        No ledger transactions matched your active search query
                        and scope.
                      </p>
                      {inputQuery && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setInputQuery('')}
                          className="mt-2 text-xs"
                        >
                          Clear Search
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx, i) => (
                  <motion.tr
                    key={tx.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25, delay: i * 0.05 }}
                    whileHover={{
                      backgroundColor: 'rgba(70, 60, 255, 0.04)',
                    }}
                    className="group transition-colors"
                  >
                    <td className="px-6 py-4">
                      <p className="font-semibold text-foreground text-sm">
                        {tx.desc}
                      </p>
                      <p className="text-muted-foreground text-xs mt-0.5">
                        {tx.date}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full ${getCategoryBadge(tx.category)}`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${getCategoryDot(tx.category)}`}
                        />
                        {tx.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-xs">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${tx.scope === 'Business' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-muted text-muted-foreground border-border'}`}
                      >
                        {tx.scope}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div
                        className={`flex items-center justify-end gap-1.5 font-mono text-base font-semibold ${tx.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-foreground'}`}
                      >
                        {tx.type === 'income' ? (
                          <ArrowUpRight className="h-4 w-4" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4 text-rose-500" />
                        )}
                        {formatAmount(tx.amount)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {tx.receipt ? (
                        <button
                          onClick={() =>
                            setFeedbackModal({
                              open: true,
                              type: 'info',
                              title: 'Receipt Verified',
                              desc: `Receipt attachment for ${tx.desc} is verified and encrypted in secure storage.`,
                            })
                          }
                          className="flex h-8 w-8 items-center justify-center mx-auto border border-transparent rounded-full hover:bg-accent/50 text-muted-foreground hover:text-foreground transition-all cursor-pointer outline-none"
                        >
                          <Camera className="h-4 w-4" />
                        </button>
                      ) : (
                        <span className="text-slate-300 dark:text-slate-600">
                          -
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right relative">
                      <button
                        onClick={() =>
                          setOpenKebab(openKebab === tx.id ? null : tx.id)
                        }
                        className="flex h-8 w-8 items-center justify-center ml-auto border border-transparent rounded-full hover:bg-accent/50 text-muted-foreground hover:text-foreground transition-all cursor-pointer outline-none"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>

                      <AnimatePresence>
                        {openKebab === tx.id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -5 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -5 }}
                            transition={{
                              type: 'spring',
                              stiffness: 450,
                              damping: 28,
                            }}
                            className="absolute right-12 top-10 w-36 border border-border bg-card p-1.5 rounded-xl shadow-none z-20 text-left flex flex-col gap-0.5"
                          >
                            <button
                              onClick={() => {
                                setOpenKebab(null)
                                setFeedbackModal({
                                  open: true,
                                  type: 'success',
                                  title: 'Transaction Updated',
                                  desc: `Transaction ${tx.desc} has been updated.`,
                                })
                              }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-foreground hover:bg-accent/50 font-medium rounded-lg transition-all"
                            >
                              <Edit2 className="h-3.5 w-3.5" /> Edit
                            </button>
                            <button
                              onClick={() => {
                                setOpenKebab(null)
                                setDeleteModal({
                                  open: true,
                                  txDesc: tx.desc,
                                })
                              }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-destructive hover:bg-destructive/10 font-medium rounded-lg transition-all"
                            >
                              <Trash2 className="h-3.5 w-3.5" /> Delete
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      {openKebab === tx.id && (
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setOpenKebab(null)}
                        />
                      )}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Quick Entry Modal */}
      <QuickEntryModal
        open={quickEntryOpen}
        onOpenChange={setQuickEntryOpen}
        currency={currency}
        onSave={(data) => {
          setFeedbackModal({
            open: true,
            type: 'success',
            title: 'Transaction Saved',
            desc: `Ledger entry of ${formatAmount(data.amount)} (${data.type.toUpperCase()}) has been recorded to cashbook.`,
          })
        }}
      />

      {/* Feedback Modal */}
      <AlertModal
        open={feedbackModal.open}
        onOpenChange={(open) => setFeedbackModal((prev) => ({ ...prev, open }))}
        type={feedbackModal.type}
        title={feedbackModal.title}
        description={feedbackModal.desc}
        confirmText="Got it"
      />

      {/* Delete Transaction Confirmation Modal */}
      <AlertModal
        open={deleteModal.open}
        onOpenChange={(open) => setDeleteModal((prev) => ({ ...prev, open }))}
        type="error"
        title="Delete Transaction"
        description={`Are you sure you want to delete ${deleteModal.txDesc || 'this entry'}? This will adjust your ledger cash balance.`}
        confirmText="Delete Entry"
        cancelText="Cancel"
        onConfirm={() => {
          setFeedbackModal({
            open: true,
            type: 'success',
            title: 'Transaction Deleted',
            desc: 'The ledger entry was deleted and balances updated.',
          })
        }}
      />
    </div>
  )
}
