import { createFileRoute, Link  } from '@tanstack/react-router'
import { useState } from 'react'
import {
  Plus,
  Search,
  FileText,
  CheckCircle2,
  Clock,
  XCircle,
  MoreVertical,
  Edit2,
  Eye,
  Trash2,
} from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { Button } from '../../components/ui/button'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../../components/ui/select'
import { useDebouncedSearch } from '../../hooks/use-debounced-search'

export const Route = createFileRoute('/invoices/')({
  component: Invoices,
})

const initialInvoices = [
  {
    id: 'INV-2026-001',
    client: 'Acme Corp',
    date: '2026-08-01',
    due: '2026-08-15',
    amount: 5000,
    status: 'unpaid',
  },
  {
    id: 'INV-2026-002',
    client: 'GlobalTech',
    date: '2026-07-20',
    due: '2026-08-03',
    amount: 3500,
    status: 'paid',
  },
  {
    id: 'INV-2026-003',
    client: 'Stark Industries',
    date: '2026-07-15',
    due: '2026-07-29',
    amount: 12000,
    status: 'unpaid',
  },
  {
    id: 'INV-2026-004',
    client: 'Wayne Enterprises',
    date: '2026-07-10',
    due: '2026-07-24',
    amount: 850,
    status: 'void',
  },
  {
    id: 'INV-2026-005',
    client: 'Umbrella Corp',
    date: '2026-08-01',
    due: '2026-08-15',
    amount: 200,
    status: 'draft',
  },
]

const StatusBadge = ({ status }: { status: string }) => {
  if (status === 'paid') {
    return (
      <span className="inline-flex items-center gap-1.5 border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 rounded-full">
        <CheckCircle2 className="h-3.5 w-3.5" /> Paid
      </span>
    )
  }
  if (status === 'unpaid') {
    return (
      <span className="inline-flex items-center gap-1.5 border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400 rounded-full">
        <Clock className="h-3.5 w-3.5" /> Unpaid
      </span>
    )
  }
  if (status === 'draft') {
    return (
      <span className="inline-flex items-center gap-1.5 border border-border bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground rounded-full">
        <FileText className="h-3.5 w-3.5" /> Draft
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 border border-border bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground rounded-full">
      <XCircle className="h-3.5 w-3.5" /> Void
    </span>
  )
}

function Invoices() {
  const [openKebab, setOpenKebab] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState('all')

  const {
    inputQuery,
    setInputQuery,
    isTooShort,
    results: filteredInvoices,
  } = useDebouncedSearch({
    resourceKey: 'invoices-list',
    data: initialInvoices,
    extraFilters: { statusFilter },
    filterFn: (items, query, filters) => {
      return items.filter((inv) => {
        const matchesSearch =
          !query ||
          inv.id.toLowerCase().includes(query) ||
          inv.client.toLowerCase().includes(query) ||
          inv.amount.toString().includes(query) ||
          inv.date.toLowerCase().includes(query)

        const matchesStatus = filters?.statusFilter === 'all' || inv.status === filters?.statusFilter

        return matchesSearch && matchesStatus
      })
    },
  })

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Invoices & Billing
          </h1>
          <p className="mt-2 text-muted-foreground text-[15px]">
            Manage client billing, draft invoices, and automatic receivables.
          </p>
        </div>
        <Link to="/invoices/builder">
          <Button className="h-11 px-6 rounded-full font-semibold shadow-md">
            <Plus className="h-5 w-5 mr-2" /> New Invoice
          </Button>
        </Link>
      </div>

      {/* Invoice Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="border border-border bg-card p-5 rounded-2xl shadow-xs">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Receivables</p>
          <p className="font-mono text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">$17,000.00</p>
          <p className="text-xs text-muted-foreground mt-1">2 Unpaid Invoices</p>
        </div>
        <div className="border border-border bg-card p-5 rounded-2xl shadow-xs">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Paid This Month</p>
          <p className="font-mono text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">$3,500.00</p>
          <p className="text-xs text-muted-foreground mt-1">1 Settled Invoice</p>
        </div>
        <div className="border border-border bg-card p-5 rounded-2xl shadow-xs">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Draft Invoices</p>
          <p className="font-mono text-2xl font-bold text-primary mt-1">$200.00</p>
          <p className="text-xs text-muted-foreground mt-1">1 Pending Review</p>
        </div>
      </div>

      <div className="border border-border bg-card shadow-sm rounded-2xl min-h-[500px] overflow-hidden">
        <div className="p-4 border-b border-border flex flex-col md:flex-row gap-4">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10 pointer-events-none" />
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Search by ID or Client (min 3 chars)..."
              className="w-full h-11 border border-border bg-background rounded-full pl-11 pr-24 text-sm font-medium outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground"
            />
            {isTooShort && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 border border-amber-300 dark:border-amber-800 rounded-full">
                Min 3 chars
              </span>
            )}
          </div>
          <div className="w-40">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full h-11 border border-border shadow-xs text-sm font-medium bg-card text-foreground rounded-xl">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="unpaid">Unpaid</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="void">Void</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap min-w-[800px]">
          <thead className="bg-muted/40 text-muted-foreground border-b border-border">
            <tr>
              <th className="px-6 py-4 font-semibold text-xs">Invoice Number</th>
              <th className="px-6 py-4 font-semibold text-xs">Client</th>
              <th className="px-6 py-4 font-semibold text-xs">Issue & Due Date</th>
              <th className="px-6 py-4 font-semibold text-xs text-right">Amount</th>
              <th className="px-6 py-4 font-semibold text-xs">Status</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredInvoices.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-muted-foreground font-medium">
                  No invoices found matching criteria.
                </td>
              </tr>
            ) : (
              filteredInvoices.map((inv, i) => (
                <motion.tr
                  key={inv.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: i * 0.05 }}
                  whileHover={{ backgroundColor: 'rgba(70, 60, 255, 0.04)' }}
                  className="transition-colors"
                >
                <td className="px-6 py-4 font-mono font-semibold text-foreground flex items-center gap-3">
                  <div className="p-2 border border-border bg-accent/40 text-accent-foreground rounded-xl">
                    <FileText className="h-4 w-4" />
                  </div>
                  <Link
                    to={`/invoices/$id`}
                    params={{ id: inv.id }}
                    className="hover:text-primary transition-colors"
                  >
                    {inv.id}
                  </Link>
                </td>
                <td className="px-6 py-4 font-semibold text-foreground">
                  {inv.client}
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-foreground">
                    {inv.date}
                  </div>
                  <div className="text-muted-foreground text-xs mt-0.5">
                    Due: {inv.due}
                  </div>
                </td>
                <td className="px-6 py-4 text-right font-mono font-semibold text-base text-foreground">
                  ${inv.amount.toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={inv.status} />
                </td>
                <td className="px-6 py-4 text-right relative">
                  <button
                    onClick={() =>
                      setOpenKebab(openKebab === inv.id ? null : inv.id)
                    }
                    className="p-1.5 border border-transparent rounded-full hover:bg-accent/50 text-muted-foreground hover:text-foreground transition-all"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>
                  <AnimatePresence>
                    {openKebab === inv.id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -5 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -5 }}
                        transition={{ type: 'spring', stiffness: 450, damping: 28 }}
                        className="absolute right-12 top-10 w-40 border border-border bg-card p-1.5 rounded-xl shadow-lg z-20 flex flex-col gap-0.5 text-left"
                      >
                        <Link
                          to={`/invoices/$id`}
                          params={{ id: inv.id }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-foreground hover:bg-accent/50 font-medium rounded-lg transition-all"
                        >
                          <Eye className="h-3.5 w-3.5" /> View Details
                        </Link>
                        <button onClick={() => { alert("Invoice updated successfully"); setOpenKebab(null); }} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-foreground hover:bg-accent/50 font-medium rounded-lg transition-all">
                          <Edit2 className="h-3.5 w-3.5" /> Edit
                        </button>
                        <div className="my-1 h-px bg-border" />
                        <button onClick={() => { alert("Invoice voided"); setOpenKebab(null); }} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-destructive hover:bg-destructive/10 font-medium rounded-lg transition-all">
                          <Trash2 className="h-3.5 w-3.5" /> Void
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {openKebab === inv.id && (
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
    </div>
  )
}
