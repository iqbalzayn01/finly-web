import { createFileRoute, Link } from '@tanstack/react-router'
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
          <div className="inline-flex items-center gap-1.5 border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 rounded-full">
            <CheckCircle2 className="h-4 w-4" /> Paid
          </div>
        )
      case 'unpaid':
        return (
          <div className="inline-flex items-center gap-1.5 border border-amber-500/20 bg-amber-500/10 px-3.5 py-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400 rounded-full">
            <Clock className="h-4 w-4" /> Unpaid
          </div>
        )
      case 'void':
        return (
          <div className="inline-flex items-center gap-1.5 border border-border bg-muted px-3.5 py-1.5 text-xs font-semibold text-muted-foreground rounded-full">
            <XCircle className="h-4 w-4" /> Void
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-8 max-w-[1000px] mx-auto pb-12">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/invoices">
            <div className="flex h-10 w-10 items-center justify-center border border-border bg-card rounded-full text-foreground hover:bg-accent transition-colors shadow-none">
              <ArrowLeft className="h-4 w-4" />
            </div>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Invoice {invoice.id}
          </h1>
          <div>
            <StatusBadge status={invoice.status} />
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="px-4"
            onClick={() => window.print()}
          >
            <Printer className="h-3.5 w-3.5 mr-2" /> Print
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="px-4"
            onClick={() => alert("Downloading invoice PDF...")}
          >
            <Download className="h-3.5 w-3.5 mr-2" /> PDF
          </Button>

          <Button size="sm" className="px-5" onClick={() => alert("Invoice emailed to " + invoice.client.email)}>
            <Mail className="h-3.5 w-3.5 mr-2" /> Send Email
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Main Document Paper */}
        <div className="md:col-span-2 border border-border bg-card p-8 md:p-10 rounded-2xl shadow-none">
          <div className="grid grid-cols-2 gap-12 pb-10 border-b border-border">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                From
              </p>
              <h3 className="font-semibold text-base text-foreground">
                Finly HQ
              </h3>
              <p className="text-muted-foreground mt-1.5 text-xs font-normal leading-relaxed">
                123 Business Rd.
                <br />
                Tech City, TC 90210
              </p>
              <p className="text-muted-foreground mt-3 text-xs font-mono">
                Tax ID: 00-1234567
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                To
              </p>
              <h3 className="font-semibold text-base text-foreground">
                {invoice.client.name}
              </h3>
              <p className="text-muted-foreground mt-1.5 text-xs font-normal leading-relaxed">
                {invoice.client.address}
              </p>
              <p className="text-muted-foreground mt-3 text-xs font-mono">
                Tax ID: {invoice.client.taxId}
              </p>
            </div>
          </div>

          <div className="py-8">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border text-muted-foreground text-xs uppercase tracking-wider">
                  <th className="pb-3 font-semibold w-1/2">
                    Description
                  </th>
                  <th className="pb-3 font-semibold text-right">
                    Qty
                  </th>
                  <th className="pb-3 font-semibold text-right">
                    Price
                  </th>
                  <th className="pb-3 font-semibold text-right">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {invoice.items.map((item, i) => (
                  <tr 
                    key={i}
                    className="transition-colors"
                  >
                    <td className="py-4 text-sm font-semibold text-foreground">
                      {item.desc}
                    </td>
                    <td className="py-4 text-right font-mono text-sm text-muted-foreground">
                      {item.qty}
                    </td>
                    <td className="py-4 text-right font-mono text-sm text-muted-foreground">
                      ${item.price.toLocaleString()}
                    </td>
                    <td className="py-4 text-right font-mono font-semibold text-sm text-foreground">
                      ${item.total.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-8 flex justify-end">
              <div className="w-[300px] border border-border bg-background p-6 rounded-2xl shadow-none">
                <div className="space-y-3">
                  <div className="flex justify-between text-xs font-medium text-muted-foreground">
                    <span>Subtotal</span>
                    <span className="font-mono text-foreground font-semibold">
                      ${invoice.subtotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs font-medium text-muted-foreground">
                    <span>Tax (11%)</span>
                    <span className="font-mono text-foreground font-semibold">
                      ${invoice.tax.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="mt-4 border-t border-border pt-4 flex justify-between items-end">
                  <span className="text-xs font-semibold uppercase tracking-wider text-foreground">
                    Total
                  </span>
                  <span className="font-mono text-3xl font-bold tracking-tight text-primary">
                    ${invoice.total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Info & Action Cards */}
        <div className="space-y-6">
          <div className="border border-border bg-card p-6 rounded-2xl shadow-none">
            <h3 className="font-semibold text-sm text-foreground mb-4">
              Invoice Details
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Issue Date
                </p>
                <p className="text-sm font-semibold text-foreground">
                  {invoice.issueDate}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Due Date
                </p>
                <p className="text-sm font-semibold text-foreground">
                  {invoice.dueDate}
                </p>
              </div>
            </div>
          </div>

          <div className="border border-border bg-card p-6 rounded-2xl shadow-none">
            <h3 className="font-semibold text-sm text-foreground mb-4">
              Actions
            </h3>
            <div className="space-y-2.5">
              <Button className="w-full" onClick={() => alert("Invoice marked as paid!")}>
                <DollarSign className="w-4 h-4 mr-2" /> Mark as Paid
              </Button>

              <Button variant="outline" className="w-full" onClick={() => { navigator.clipboard.writeText(window.location.href); alert("Invoice link copied to clipboard!"); }}>
                <Share2 className="w-4 h-4 mr-2" /> Copy Link
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
