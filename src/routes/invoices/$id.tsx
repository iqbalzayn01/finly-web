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
import { motion } from 'motion/react'

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
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.2, 0, 0, 1] }}
      className="space-y-8 max-w-[1000px] mx-auto pb-12"
    >
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/invoices">
            <motion.div
              whileHover={{ scale: 1.05, x: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="flex h-10 w-10 items-center justify-center border border-border bg-card rounded-full text-foreground transition-all hover:bg-accent shadow-xs"
            >
              <ArrowLeft className="h-4 w-4" />
            </motion.div>
          </Link>
          <motion.h1 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="text-3xl font-bold tracking-tight text-foreground"
          >
            Invoice {invoice.id}
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.06 }}
            transition={{ type: 'spring', stiffness: 400, damping: 22, delay: 0.1 }}
          >
            <StatusBadge status={invoice.status} />
          </motion.div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="flex items-center gap-3"
        >
          <motion.div whileHover={{ scale: 1.03, y: -1 }} whileTap={{ scale: 0.97 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }}>
            <Button
              variant="outline"
              size="sm"
              className="px-4"
              onClick={() => window.print()}
            >
              <Printer className="h-3.5 w-3.5 mr-2" /> Print
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.03, y: -1 }} whileTap={{ scale: 0.97 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }}>
            <Button
              variant="outline"
              size="sm"
              className="px-4"
              onClick={() => alert("Downloading invoice PDF...")}
            >
              <Download className="h-3.5 w-3.5 mr-2" /> PDF
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.03, y: -1 }} whileTap={{ scale: 0.97 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }}>
            <Button size="sm" className="px-5" onClick={() => alert("Invoice emailed to " + invoice.client.email)}>
              <Mail className="h-3.5 w-3.5 mr-2" /> Send Email
            </Button>
          </motion.div>
        </motion.div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Main Document Paper */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.15 }}
          className="md:col-span-2 border border-border bg-card p-8 md:p-10 rounded-2xl shadow-sm"
        >
          <div className="grid grid-cols-2 gap-12 pb-10 border-b border-border">
            <motion.div
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
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
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.25 }}
            >
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
            </motion.div>
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
                  <motion.tr 
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25, delay: 0.3 + i * 0.08 }}
                    whileHover={{ backgroundColor: 'rgba(70, 60, 255, 0.04)' }}
                    className="transition-colors cursor-pointer"
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
                  </motion.tr>
                ))}
              </tbody>
            </table>

            <div className="mt-8 flex justify-end">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -2 }}
                transition={{ type: 'spring', stiffness: 350, damping: 25, delay: 0.35 }}
                className="w-[300px] border border-border bg-background p-6 rounded-2xl shadow-xs"
              >
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
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Sidebar Info & Action Cards */}
        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ y: -2 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.25 }}
            className="border border-border bg-card p-6 rounded-2xl shadow-sm"
          >
            <h3 className="font-semibold text-sm text-foreground mb-4">
              Invoice Details
            </h3>
            <div className="space-y-3">
              <motion.div whileHover={{ x: 2 }} transition={{ type: 'spring', stiffness: 400 }}>
                <p className="text-xs font-medium text-muted-foreground">
                  Issue Date
                </p>
                <p className="text-sm font-semibold text-foreground">
                  {invoice.issueDate}
                </p>
              </motion.div>
              <motion.div whileHover={{ x: 2 }} transition={{ type: 'spring', stiffness: 400 }}>
                <p className="text-xs font-medium text-muted-foreground">
                  Due Date
                </p>
                <p className="text-sm font-semibold text-foreground">
                  {invoice.dueDate}
                </p>
              </motion.div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ y: -2 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.35 }}
            className="border border-border bg-card p-6 rounded-2xl shadow-sm"
          >
            <h3 className="font-semibold text-sm text-foreground mb-4">
              Actions
            </h3>
            <div className="space-y-2.5">
              <motion.div whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }}>
                <Button className="w-full" onClick={() => alert("Invoice marked as paid!")}>
                  <DollarSign className="w-4 h-4 mr-2" /> Mark as Paid
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }}>
                <Button variant="outline" className="w-full" onClick={() => { navigator.clipboard.writeText(window.location.href); alert("Invoice link copied to clipboard!"); }}>
                  <Share2 className="w-4 h-4 mr-2" /> Copy Link
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
