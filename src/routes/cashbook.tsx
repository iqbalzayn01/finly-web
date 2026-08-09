import { createFileRoute } from '@tanstack/react-router'
import {
  Plus,
  Search,
  Camera,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  Edit2,
  Trash2,
} from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { useState } from 'react'
import { Button } from '../components/ui/button'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
} from '../components/ui/select'

export const Route = createFileRoute('/cashbook')({
  component: Cashbook,
})

const CATEGORIES = [
  {
    group: 'Income',
    badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300',
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
      'Refunds (tax, purchase)'
    ]
  },
  {
    group: 'Communication, PC',
    badge: 'bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300',
    dot: 'bg-blue-500',
    items: ['Internet', 'Phone, cell phone', 'Postal services', 'Software, apps, games']
  },
  {
    group: 'Financial Expenses',
    badge: 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300',
    dot: 'bg-red-500',
    items: ['Advisory', 'Charges, Fees', 'Child Support (Expense)', 'Fines', 'Insurances', 'Loan, interests', 'Taxes']
  },
  {
    group: 'Food & Drinks',
    badge: 'bg-orange-100 text-orange-800 dark:bg-orange-500/20 dark:text-orange-300',
    dot: 'bg-orange-500',
    items: ['Bar, cafe', 'Groceries', 'Restaurant, fast-food']
  },
  {
    group: 'Housing',
    badge: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-300',
    dot: 'bg-yellow-500',
    items: ['Energy, utilities', 'Maintenance, repairs', 'Mortgage', 'Property insurance', 'Rent', 'Services']
  },
  {
    group: 'Investments',
    badge: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-300',
    dot: 'bg-indigo-500',
    items: ['Collections', 'Financial investments', 'Realty', 'Savings', 'Vehicles, chattels']
  },
  {
    group: 'Life & Entertainment',
    badge: 'bg-purple-100 text-purple-800 dark:bg-purple-500/20 dark:text-purple-300',
    dot: 'bg-purple-500',
    items: ['Active sport, fitness', 'Alcohol, tobacco', 'Books, audio, subscriptions', 'Charity, gifts', 'Culture, sport events', 'Education, development', 'Health care, doctor', 'Hobbies', 'Holiday, trips, hotels', 'Life events', 'Lottery, gambling', 'TV, Streaming', 'Wellness, beauty']
  },
  {
    group: 'Shopping',
    badge: 'bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-300',
    dot: 'bg-rose-500',
    items: ['Clothes & shoes', 'Drug-store, chemist', 'Electronics, accessories', 'Free time', 'Gifts, joy', 'Health and beauty', 'Home, garden', 'Jewels, accessories', 'Kids', 'Pets, animals', 'Stationery, tools']
  },
  {
    group: 'Transportation',
    badge: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-500/20 dark:text-cyan-300',
    dot: 'bg-cyan-500',
    items: ['Business trips', 'Long distance', 'Public transport', 'Taxi', 'Vehicle', 'Fuel', 'Leasing', 'Parking', 'Rentals', 'Vehicle insurance', 'Vehicle maintenance']
  },
  {
    group: 'Others',
    badge: 'bg-slate-100 text-slate-800 dark:bg-slate-500/20 dark:text-slate-300',
    dot: 'bg-slate-500',
    items: ['General', 'Missing']
  }
];

const getCategoryBadge = (categoryName: string) => {
  for (const group of CATEGORIES) {
    if (group.items.includes(categoryName)) return group.badge;
  }
  return 'bg-slate-100 text-slate-800 dark:bg-slate-500/20 dark:text-slate-300';
};

const getCategoryDot = (categoryName: string) => {
  for (const group of CATEGORIES) {
    if (group.items.includes(categoryName)) return group.dot;
  }
  return 'bg-slate-500';
};

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

import { useDebouncedSearch } from '../hooks/use-debounced-search'

function Cashbook() {
  const [showNumpad, setShowNumpad] = useState(false)
  const [entryAmount, setEntryAmount] = useState('0')
  const [txType, setTxType] = useState<'income' | 'expense'>('expense')
  const [openKebab, setOpenKebab] = useState<number | null>(null)

  const [typeFilter, setTypeFilter] = useState('all')
  const [scopeFilter, setScopeFilter] = useState('all')

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

        const matchesType = filters?.typeFilter === 'all' || tx.type === filters?.typeFilter
        const matchesScope = filters?.scopeFilter === 'all' || tx.scope.toLowerCase() === filters?.scopeFilter?.toLowerCase()

        return matchesSearch && matchesType && matchesScope
      })
    },
  })

  const handleNumpad = (val: string) => {
    if (val === 'C') {
      setEntryAmount('0')
      return
    }
    if (val === '00') {
      setEntryAmount((prev) => (prev === '0' ? '0' : prev + '00'))
      return
    }
    setEntryAmount((prev) => (prev === '0' ? val : prev + val))
  }

  return (
    <div className="flex flex-col xl:flex-row gap-8 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 space-y-8"
      >
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground">
              Cashbook
            </h1>
            <p className="mt-2 text-muted-foreground">
              Ledger of all business and personal transactions.
            </p>
          </div>
          <Button
            onClick={() => setShowNumpad(true)}
          >
            <Plus className="h-5 w-5 mr-2" /> Quick Entry
          </Button>
        </div>

        <div className="border border-border bg-card shadow-sm rounded-2xl min-h-[600px]">
          <div className="p-4 border-b border-border flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10 pointer-events-none" />
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Search transactions (min 3 chars)..."
                className="w-full h-11 border border-border bg-background rounded-full pl-11 pr-24 text-sm font-medium outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground"
              />
              {isTooShort && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 border border-amber-300 dark:border-amber-800 rounded-full">
                  Min 3 chars
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-40">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full h-11 border border-border shadow-xs text-sm font-medium bg-card text-foreground rounded-xl">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-40">
                <Select value={scopeFilter} onValueChange={setScopeFilter}>
                  <SelectTrigger className="w-full h-11 border border-border shadow-xs text-sm font-medium bg-card text-foreground rounded-xl">
                    <SelectValue placeholder="All Scopes" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="all">All Scopes</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="personal">Personal</SelectItem>
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
                <th className="px-6 py-4 font-semibold text-xs text-right">Amount</th>
                <th className="px-6 py-4 font-semibold text-xs text-center">Receipt</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground font-medium">
                    No transactions found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx, i) => (
                  <motion.tr
                    key={tx.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25, delay: i * 0.05 }}
                    whileHover={{ backgroundColor: 'rgba(70, 60, 255, 0.04)' }}
                    className="transition-colors"
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
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full ${getCategoryBadge(tx.category)}`}>
                      <span className={`w-2 h-2 rounded-full ${getCategoryDot(tx.category)}`} />
                      {tx.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-xs">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${tx.scope === 'Business' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-muted text-muted-foreground border-border'}`}>
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
                      ${tx.amount.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {tx.receipt ? (
                      <button onClick={() => alert("Viewing uploaded receipt")} className="p-1.5 border border-transparent rounded-full hover:bg-accent/50 text-muted-foreground hover:text-foreground transition-all">
                        <Camera className="h-4 w-4 mx-auto" />
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
                      className="p-1.5 border border-transparent rounded-full hover:bg-accent/50 text-muted-foreground hover:text-foreground transition-all"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>

                    <AnimatePresence>
                      {openKebab === tx.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: -5 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -5 }}
                          transition={{ type: 'spring', stiffness: 450, damping: 28 }}
                          className="absolute right-12 top-10 w-36 border border-border bg-card p-1.5 rounded-xl shadow-lg z-20 text-left flex flex-col gap-0.5"
                        >
                          <button
                            onClick={() => { alert("Transaction updated"); setOpenKebab(null); }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-foreground hover:bg-accent/50 font-medium rounded-lg transition-all"
                          >
                            <Edit2 className="h-3.5 w-3.5" /> Edit
                          </button>
                          <button
                            onClick={() => { alert("Transaction deleted"); setOpenKebab(null); }}
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
              )))}
            </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showNumpad && (
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.95 }}
            transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
            className="w-full xl:w-[360px] shrink-0"
          >
            <div className="sticky top-24 border border-border bg-card p-6 rounded-2xl shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-base text-foreground">
                  Quick Entry
                </h3>
                <button
                  onClick={() => setShowNumpad(false)}
                  className="text-xs font-semibold text-muted-foreground hover:text-foreground"
                >
                  Close
                </button>
              </div>

              <div className="flex gap-2 mb-6 p-1 border border-border bg-muted/30 rounded-xl relative">
                <button
                  onClick={() => setTxType('expense')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all relative z-10 ${txType === 'expense' ? 'bg-card text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  Expense
                </button>
                <button
                  onClick={() => setTxType('income')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all relative z-10 ${txType === 'income' ? 'bg-card text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  Income
                </button>
              </div>

              <div className="text-center mb-8">
                <p className="text-muted-foreground text-xs font-medium mb-1.5">Amount (USD)</p>
                <motion.div
                  key={entryAmount}
                  initial={{ scale: 0.95, opacity: 0.8 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                  className={`font-mono text-4xl font-bold tracking-tight ${txType === 'income' ? 'text-emerald-500' : 'text-foreground'}`}
                >
                  ${parseInt(entryAmount).toLocaleString()}
                </motion.div>
              </div>

              <div className="grid grid-cols-3 gap-2.5 mb-6">
                {[
                  '1',
                  '2',
                  '3',
                  '4',
                  '5',
                  '6',
                  '7',
                  '8',
                  '9',
                  '00',
                  '0',
                  'C',
                ].map((key) => (
                  <motion.button
                    key={key}
                    whileHover={{ scale: 1.04, y: -1 }}
                    whileTap={{ scale: 0.93 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                    onClick={() => handleNumpad(key)}
                    className="h-12 border border-border bg-card text-base font-semibold text-foreground hover:bg-accent/50 rounded-xl shadow-xs transition-all"
                  >
                    {key}
                  </motion.button>
                ))}
              </div>

              <div className="space-y-3">
                <Select>
                  <SelectTrigger className="w-full h-11 border border-border shadow-xs text-sm font-medium bg-card text-foreground rounded-xl">
                    <SelectValue placeholder="Select Category..." />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {CATEGORIES.map((catGroup) => (
                      <SelectGroup key={catGroup.group}>
                        <SelectLabel className="font-semibold text-xs text-muted-foreground">{catGroup.group}</SelectLabel>
                        {catGroup.items.map((item) => (
                          <SelectItem key={item} value={item.toLowerCase().replace(/[\s,()]+/g, '-')}>
                            <div className="flex items-center gap-2">
                              <div className={`w-2.5 h-2.5 rounded-full border border-border ${catGroup.dot}`} />
                              <span>{item}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    ))}
                  </SelectContent>
                </Select>

                <Select>
                  <SelectTrigger className="w-full h-11 border border-border shadow-xs text-sm font-medium bg-card text-foreground rounded-xl">
                    <SelectValue placeholder="Select Scope..." />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="personal">Personal</SelectItem>
                  </SelectContent>
                </Select>

                <input
                  type="text"
                  placeholder="Description (Optional)"
                  className="w-full h-11 border border-border bg-background rounded-xl px-4 text-sm font-medium outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground"
                />

                <Button className="w-full mt-2" onClick={() => { alert("Transaction saved successfully!"); setShowNumpad(false); }}>
                  Save Transaction
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
