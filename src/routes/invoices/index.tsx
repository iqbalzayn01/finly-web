import { createFileRoute, Link  } from '@tanstack/react-router'
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
import { motion } from 'motion/react'
import { useState } from 'react'
import { Button } from '../../components/ui/button'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../../components/ui/select'

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
  switch (status) {
    case 'paid':
      return (
        <span className="inline-flex items-center gap-1.5 border-2 border-border bg-accent px-3 py-1 text-xs font-bold text-accent-foreground shadow-brutal-sm">
          <CheckCircle2 className="h-3.5 w-3.5" /> PAID
        </span>
      )
    case 'unpaid':
      return (
        <span className="inline-flex items-center gap-1.5 border-2 border-border bg-accent px-3 py-1 text-xs font-bold text-accent-foreground shadow-brutal-sm">
          <Clock className="h-3.5 w-3.5" /> UNPAID
        </span>
      )
    case 'void':
      return (
        <span className="inline-flex items-center gap-1.5 border-2 border-border bg-muted px-3 py-1 text-xs font-bold text-muted-foreground shadow-brutal-sm">
          <XCircle className="h-3.5 w-3.5" /> VOID
        </span>
      )
    default:
      return (
        <span className="inline-flex items-center gap-1.5 border-2 border-border bg-muted px-3 py-1 text-xs font-bold text-muted-foreground shadow-brutal-sm">
          DRAFT
        </span>
      )
  }
}

function Invoices() {
  const [openKebab, setOpenKebab] = useState<string | null>(null)

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            Invoices
          </h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Create and track billing documents.
          </p>
        </div>
        <Link to="/invoices/builder">
          <Button>
            <Plus className="h-5 w-5 mr-2" /> New Invoice
          </Button>
        </Link>
      </div>

      <div className="border-2 border-border bg-card shadow-brutal min-h-[500px] overflow-hidden">
        <div className="p-4 border-b-2 border-border flex flex-col md:flex-row gap-4">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground" />
            <input
              type="text"
              placeholder="Search by ID or Client..."
              className="w-full h-11 border-2 border-border bg-card pl-11 pr-4 text-sm font-bold outline-none shadow-brutal-sm focus:shadow-none focus:translate-y-[2px] focus:translate-x-[2px] transition-all text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <div className="w-40">
            <Select defaultValue="all">
              <SelectTrigger className="w-full h-11 border-2 border-border shadow-brutal-sm text-sm font-bold bg-card text-foreground">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
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
          <thead className="bg-muted text-muted-foreground border-b-2 border-border">
            <tr>
              <th className="px-6 py-5 font-semibold">Invoice Number</th>
              <th className="px-6 py-5 font-semibold">Client</th>
              <th className="px-6 py-5 font-semibold">Issue & Due Date</th>
              <th className="px-6 py-5 font-semibold text-right">Amount</th>
              <th className="px-6 py-5 font-semibold">Status</th>
              <th className="px-6 py-5"></th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-border">
            {initialInvoices.map((inv) => (
              <tr
                key={inv.id}
                className="transition-colors hover:bg-slate-50 dark:hover:bg-white/[0.02]"
              >
                <td className="px-6 py-4 font-mono font-bold text-foreground flex items-center gap-3">
                  <div className="p-2.5 border-2 border-border bg-accent text-accent-foreground shadow-brutal-sm">
                    <FileText className="h-5 w-5" />
                  </div>
                  <Link
                    to={`/invoices/$id`}
                    params={{ id: inv.id }}
                    className="hover:text-emerald-500 transition-colors"
                  >
                    {inv.id}
                  </Link>
                </td>
                <td className="px-6 py-4 font-bold text-foreground">
                  {inv.client}
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-900 dark:text-white">
                    {inv.date}
                  </div>
                  <div className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
                    Due: {inv.due}
                  </div>
                </td>
                <td className="px-6 py-4 text-right font-mono font-bold text-lg text-foreground">
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
                    className="p-2 border-2 border-transparent hover:border-border hover:shadow-brutal-sm transition-all hover:bg-accent text-muted-foreground hover:text-accent-foreground"
                  >
                    <MoreVertical className="h-5 w-5" />
                  </button>
                  {openKebab === inv.id && (
                    <div className="absolute right-12 top-10 w-40 border-2 border-border bg-card p-1.5 shadow-brutal z-20 flex flex-col gap-1 text-left">
                      <Link
                        to={`/invoices/$id`}
                        params={{ id: inv.id }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground font-bold border-2 border-transparent hover:border-border transition-all"
                      >
                        <Eye className="h-4 w-4" /> View Details
                      </Link>
                      <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground font-bold border-2 border-transparent hover:border-border transition-all">
                        <Edit2 className="h-4 w-4" /> Edit
                      </button>
                      <div className="my-1 h-px bg-border border-t-2 border-border border-dashed" />
                      <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive hover:text-destructive-foreground font-bold border-2 border-transparent hover:border-border transition-all">
                        <Trash2 className="h-4 w-4" /> Void
                      </button>
                    </div>
                  )}
                  {openKebab === inv.id && (
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
  )
}
