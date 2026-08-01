import { createFileRoute, Link, useParams } from '@tanstack/react-router'
import {
  ArrowLeft,
  Printer,
  Download,
  Mail,
  CheckCircle2,
  Clock,
  XCircle,
  Share2,
  DollarSign,
} from 'lucide-react'
import { Button } from '../../components/ui/button'

export const Route = createFileRoute('/invoices/$id')({
  component: InvoiceDetail,
})

function InvoiceDetail() {
  const { id } = Route.useParams()

  // Dummy detail data
  const invoice = {
    id: id || 'INV-2026-001',
    status: 'unpaid',
    issueDate: '2026-08-01',
    dueDate: '2026-08-15',
    subtotal: 5000,
    tax: 550,
    total: 5550,
    client: {
      name: 'Acme Corp',
      email: 'billing@acmecorp.com',
      address: '123 Acme Way, NY, USA',
      taxId: 'US-987654321',
    },
    items: [
      { desc: 'Web Application Development', qty: 1, price: 4000, total: 4000 },
      { desc: 'UI/UX Design', qty: 1, price: 1000, total: 1000 },
    ],
  }

  const StatusBadge = ({ status }: { status: string }) => {
    switch (status) {
      case 'paid':
        return (
          <div className="inline-flex items-center gap-2 border-2 border-border bg-accent px-4 py-2 font-bold text-accent-foreground shadow-brutal-sm">
            <CheckCircle2 className="h-5 w-5" /> PAID
          </div>
        )
      case 'unpaid':
        return (
          <div className="inline-flex items-center gap-2 border-2 border-border bg-accent px-4 py-2 font-bold text-accent-foreground shadow-brutal-sm">
            <Clock className="h-5 w-5" /> UNPAID
          </div>
        )
      case 'void':
        return (
          <div className="inline-flex items-center gap-2 border-2 border-border bg-muted px-4 py-2 font-bold text-muted-foreground shadow-brutal-sm">
            <XCircle className="h-5 w-5" /> VOID
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-8 max-w-[1000px] mx-auto pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/invoices"
            className="flex h-10 w-10 items-center justify-center border-2 border-border bg-card text-foreground transition-all hover:bg-accent hover:shadow-brutal-sm hover:translate-y-[-2px]"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Invoice {invoice.id}
          </h1>
          <StatusBadge status={invoice.status} />
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="rounded-none px-5"
          >
            <Printer className="h-4 w-4 mr-2" /> Print
          </Button>
          <Button
            variant="outline"
            className="rounded-none px-5"
          >
            <Download className="h-4 w-4 mr-2" /> PDF
          </Button>
          <Button className="px-6 rounded-none">
            <Mail className="h-4 w-4 mr-2" /> Send Email
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 border-2 border-border bg-card p-10 shadow-brutal-lg">
          <div className="grid grid-cols-2 gap-12 pb-10 border-b-2 border-border border-dashed">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
                From
              </p>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                Finly HQ
              </h3>
              <p className="text-slate-500 mt-2 font-medium">
                123 Business Rd.
                <br />
                Tech City, TC 90210
              </p>
              <p className="text-slate-500 mt-4 text-sm font-mono">
                Tax ID: 00-1234567
              </p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
                To
              </p>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                {invoice.client.name}
              </h3>
              <p className="text-slate-500 mt-2 font-medium">
                {invoice.client.address}
              </p>
              <p className="text-slate-500 mt-4 text-sm font-mono">
                Tax ID: {invoice.client.taxId}
              </p>
            </div>
          </div>

          <div className="py-10">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b-2 border-border">
                  <th className="pb-4 text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-white w-1/2">
                    Description
                  </th>
                  <th className="pb-4 text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-white text-right">
                    Qty
                  </th>
                  <th className="pb-4 text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-white text-right">
                    Price
                  </th>
                  <th className="pb-4 text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-white text-right">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-border divide-dashed">
                {invoice.items.map((item, i) => (
                  <tr key={i}>
                    <td className="py-6 font-semibold dark:text-white">
                      {item.desc}
                    </td>
                    <td className="py-6 text-right font-mono font-medium dark:text-white">
                      {item.qty}
                    </td>
                    <td className="py-6 text-right font-mono font-medium dark:text-white">
                      ${item.price.toLocaleString()}
                    </td>
                    <td className="py-6 text-right font-mono font-bold text-slate-900 dark:text-white">
                      ${item.total.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-12 flex justify-end">
              <div className="w-[320px] border-2 border-border bg-card p-8 shadow-brutal">
                <div className="space-y-4">
                  <div className="flex justify-between font-medium text-foreground">
                    <span>Subtotal</span>
                    <span className="font-mono text-foreground font-bold">
                      ${invoice.subtotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between font-medium text-foreground">
                    <span>Tax (11%)</span>
                    <span className="font-mono text-foreground font-bold">
                      ${invoice.tax.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="mt-6 border-t-2 border-border pt-6 flex justify-between items-end border-dashed">
                  <span className="text-sm font-bold uppercase tracking-widest text-foreground">
                    Total
                  </span>
                  <span className="font-mono text-4xl font-bold tracking-tighter text-foreground">
                    ${invoice.total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="border-2 border-border bg-card p-6 shadow-brutal">
            <h3 className="font-bold text-foreground mb-4">
              Invoice Details
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-bold text-muted-foreground">
                  Issue Date
                </p>
                <p className="font-bold text-foreground">
                  {invoice.issueDate}
                </p>
              </div>
              <div>
                <p className="text-sm font-bold text-muted-foreground">
                  Due Date
                </p>
                <p className="font-bold text-foreground">
                  {invoice.dueDate}
                </p>
              </div>
            </div>
          </div>

          <div className="border-2 border-border bg-card p-6 shadow-brutal">
            <h3 className="font-bold text-foreground mb-4">
              Actions
            </h3>
            <div className="space-y-3">
              <Button className="w-full">
                <DollarSign className="w-4 h-4 mr-2" /> Mark as Paid
              </Button>
              <Button variant="outline" className="w-full">
                <Share2 className="w-4 h-4 mr-2" /> Copy Link
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
