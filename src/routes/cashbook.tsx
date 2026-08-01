import { createFileRoute } from '@tanstack/react-router'
import {
  Plus,
  Search,
  Filter,
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
    color: 'bg-emerald-500',
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
    color: 'bg-blue-500',
    items: ['Internet', 'Phone, cell phone', 'Postal services', 'Software, apps, games']
  },
  {
    group: 'Financial Expenses',
    color: 'bg-red-500',
    items: ['Advisory', 'Charges, Fees', 'Child Support (Expense)', 'Fines', 'Insurances', 'Loan, interests', 'Taxes']
  },
  {
    group: 'Food & Drinks',
    color: 'bg-orange-500',
    items: ['Bar, cafe', 'Groceries', 'Restaurant, fast-food']
  },
  {
    group: 'Housing',
    color: 'bg-yellow-500',
    items: ['Energy, utilities', 'Maintenance, repairs', 'Mortgage', 'Property insurance', 'Rent', 'Services']
  },
  {
    group: 'Investments',
    color: 'bg-indigo-500',
    items: ['Collections', 'Financial investments', 'Realty', 'Savings', 'Vehicles, chattels']
  },
  {
    group: 'Life & Entertainment',
    color: 'bg-purple-500',
    items: ['Active sport, fitness', 'Alcohol, tobacco', 'Books, audio, subscriptions', 'Charity, gifts', 'Culture, sport events', 'Education, development', 'Health care, doctor', 'Hobbies', 'Holiday, trips, hotels', 'Life events', 'Lottery, gambling', 'TV, Streaming', 'Wellness, beauty']
  },
  {
    group: 'Shopping',
    color: 'bg-rose-500',
    items: ['Clothes & shoes', 'Drug-store, chemist', 'Electronics, accessories', 'Free time', 'Gifts, joy', 'Health and beauty', 'Home, garden', 'Jewels, accessories', 'Kids', 'Pets, animals', 'Stationery, tools']
  },
  {
    group: 'Transportation',
    color: 'bg-cyan-500',
    items: ['Business trips', 'Long distance', 'Public transport', 'Taxi', 'Vehicle', 'Fuel', 'Leasing', 'Parking', 'Rentals', 'Vehicle insurance', 'Vehicle maintenance']
  },
  {
    group: 'Others',
    color: 'bg-slate-500',
    items: ['General', 'Missing']
  }
];

const getCategoryColor = (categoryName: string) => {
  for (const group of CATEGORIES) {
    if (group.items.includes(categoryName)) return group.color;
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
    desc: 'Office Supplies',
    category: 'Stationery, tools',
    scope: 'Business',
    amount: 85,
    type: 'expense',
    receipt: true,
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

function Cashbook() {
  const [showNumpad, setShowNumpad] = useState(false)
  const [entryAmount, setEntryAmount] = useState('0')
  const [txType, setTxType] = useState<'income' | 'expense'>('expense')
  const [openKebab, setOpenKebab] = useState<number | null>(null)

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
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              Cashbook
            </h1>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              Ledger of all business and personal transactions.
            </p>
          </div>
          <Button
            onClick={() => setShowNumpad(true)}
          >
            <Plus className="h-5 w-5 mr-2" /> Quick Entry
          </Button>
        </div>

        <div className="border-2 border-border bg-card shadow-brutal min-h-[600px]">
          <div className="p-4 border-b-2 border-border flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground" />
              <input
                type="text"
                placeholder="Search transactions..."
                className="w-full h-11 border-2 border-border bg-card pl-11 pr-4 text-sm font-bold outline-none shadow-brutal-sm focus:shadow-none focus:translate-y-[2px] focus:translate-x-[2px] transition-all text-foreground placeholder:text-muted-foreground"
              />
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-40">
                <Select defaultValue="all">
                  <SelectTrigger className="w-full h-11 border-2 border-border shadow-brutal-sm text-sm font-bold bg-card text-foreground">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-40">
                <Select defaultValue="all">
                  <SelectTrigger className="w-full h-11 border-2 border-border shadow-brutal-sm text-sm font-bold bg-card text-foreground">
                    <SelectValue placeholder="All Scopes" />
                  </SelectTrigger>
                  <SelectContent>
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
            <thead className="bg-muted text-muted-foreground border-b-2 border-border">
              <tr>
                <th className="px-6 py-4 font-semibold">Date & Desc</th>
                <th className="px-6 py-4 font-semibold">Category</th>
                <th className="px-6 py-4 font-semibold">Scope</th>
                <th className="px-6 py-4 font-semibold text-right">Amount</th>
                <th className="px-6 py-4 font-semibold text-center">Receipt</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-border">
              {initialTransactions.map((tx) => (
                <tr
                  key={tx.id}
                  className="transition-colors hover:bg-slate-50 dark:hover:bg-white/[0.02]"
                >
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {tx.desc}
                    </p>
                    <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                      {tx.date}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center border-2 border-border px-3 py-1 text-xs font-bold shadow-brutal-sm text-black ${getCategoryColor(tx.category)}`}>
                      {tx.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 font-medium dark:text-slate-400">
                    {tx.scope}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div
                      className={`flex items-center justify-end gap-1.5 font-mono text-base font-semibold ${tx.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}
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
                      <button className="p-2 border-2 border-transparent hover:border-border hover:shadow-brutal-sm transition-all hover:bg-accent text-muted-foreground hover:text-accent-foreground">
                        <Camera className="h-5 w-5 mx-auto" />
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
                      className="p-2 border-2 border-transparent hover:border-border hover:shadow-brutal-sm transition-all hover:bg-accent text-muted-foreground hover:text-accent-foreground"
                    >
                      <MoreVertical className="h-5 w-5" />
                    </button>

                    {openKebab === tx.id && (
                      <div className="absolute right-12 top-10 w-40 border-2 border-border bg-card p-1.5 shadow-brutal z-20 text-left flex flex-col gap-1">
                        <button
                          onClick={() => setOpenKebab(null)}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground font-bold border-2 border-transparent hover:border-border transition-all"
                        >
                          <Edit2 className="h-4 w-4" /> Edit
                        </button>
                        <button
                          onClick={() => setOpenKebab(null)}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive hover:text-destructive-foreground font-bold border-2 border-transparent hover:border-border transition-all"
                        >
                          <Trash2 className="h-4 w-4" /> Delete
                        </button>
                      </div>
                    )}
                    {openKebab === tx.id && (
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setOpenKebab(null)}
                      />
                    )}
                  </td>
                </tr>
              ))}
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
            <div className="sticky top-24 border-2 border-border bg-card p-6 shadow-brutal-lg">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                  Quick Entry
                </h3>
                <button
                  onClick={() => setShowNumpad(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  Close
                </button>
              </div>

              <div className="flex gap-2 mb-6 p-1 border-2 border-border bg-card shadow-brutal-sm">
                <button
                  onClick={() => setTxType('expense')}
                  className={`flex-1 py-2 text-sm font-bold border-2 transition-all ${txType === 'expense' ? 'bg-accent text-accent-foreground border-border shadow-brutal-sm' : 'border-transparent text-muted-foreground hover:border-border hover:shadow-brutal-sm hover:translate-y-[-2px]'}`}
                >
                  Expense
                </button>
                <button
                  onClick={() => setTxType('income')}
                  className={`flex-1 py-2 text-sm font-bold border-2 transition-all ${txType === 'income' ? 'bg-accent text-accent-foreground border-border shadow-brutal-sm' : 'border-transparent text-muted-foreground hover:border-border hover:shadow-brutal-sm hover:translate-y-[-2px]'}`}
                >
                  Income
                </button>
              </div>

              <div className="text-center mb-8">
                <p className="text-slate-500 font-medium mb-2">Amount (USD)</p>
                <div
                  className={`font-mono text-5xl font-bold tracking-tighter ${txType === 'income' ? 'text-emerald-500' : 'text-slate-900 dark:text-white'}`}
                >
                  ${parseInt(entryAmount).toLocaleString()}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-6">
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
                  <button
                    key={key}
                    onClick={() => handleNumpad(key)}
                    className="h-14 border-2 border-border bg-card text-xl font-bold text-foreground hover:bg-accent hover:text-accent-foreground shadow-brutal-sm active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all"
                  >
                    {key}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                <Select>
                  <SelectTrigger className="w-full h-12 border-2 border-border shadow-brutal-sm text-base font-bold bg-card text-foreground">
                    <SelectValue placeholder="Select Category..." />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((catGroup) => (
                      <SelectGroup key={catGroup.group}>
                        <SelectLabel className="font-bold text-muted-foreground">{catGroup.group}</SelectLabel>
                        {catGroup.items.map((item) => (
                          <SelectItem key={item} value={item.toLowerCase().replace(/[\s,()]+/g, '-')}>
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full border-2 border-border ${catGroup.color}`} />
                              <span>{item}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    ))}
                  </SelectContent>
                </Select>

                <Select>
                  <SelectTrigger className="w-full h-12 border-2 border-border shadow-brutal-sm text-base font-bold bg-card text-foreground">
                    <SelectValue placeholder="Select Scope..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="personal">Personal</SelectItem>
                  </SelectContent>
                </Select>

                <input
                  type="text"
                  placeholder="Description (Optional)"
                  className="w-full h-12 border-2 border-border bg-card px-4 font-bold outline-none shadow-brutal-sm focus:shadow-none focus:translate-y-[2px] focus:translate-x-[2px] transition-all text-foreground placeholder:text-muted-foreground"
                />

                <Button className="w-full mt-2">
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
