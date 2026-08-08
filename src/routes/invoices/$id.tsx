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
import { motion } from 'motion/react'

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
              className="flex h-10 w-10 items-center justify-center border-2 border-border bg-card text-foreground transition-all hover:bg-accent hover:shadow-brutal-sm"
            >
              <ArrowLeft className="h-5 w-5" />
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
          <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }}>
            <Button
              variant="outline"
              className="rounded-none px-5 shadow-brutal-sm"
              onClick={() => window.print()}
            >
              <Printer className="h-4 w-4 mr-2" /> Print
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }}>
            <Button
              variant="outline"
              className="rounded-none px-5 shadow-brutal-sm"
              onClick={() => alert("Downloading invoice PDF...")}
            >
              <Download className="h-4 w-4 mr-2" /> PDF
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }}>
            <Button className="px-6 rounded-none shadow-brutal-sm" onClick={() => alert("Invoice emailed to " + invoice.client.email)}>
              <Mail className="h-4 w-4 mr-2" /> Send Email
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
          className="md:col-span-2 border-2 border-border bg-card p-10 shadow-brutal-lg"
        >
          <div className="grid grid-cols-2 gap-12 pb-10 border-b-2 border-border border-dashed">
            <motion.div
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
                From
              </p>
              <h3 className="font-bold text-lg text-foreground">
                Finly HQ
              </h3>
              <p className="text-muted-foreground mt-2 font-medium">
                123 Business Rd.
                <br />
                Tech City, TC 90210
              </p>
              <p className="text-muted-foreground mt-4 text-sm font-mono">
                Tax ID: 00-1234567
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.25 }}
            >
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
                To
              </p>
              <h3 className="font-bold text-lg text-foreground">
                {invoice.client.name}
              </h3>
              <p className="text-muted-foreground mt-2 font-medium">
                {invoice.client.address}
              </p>
              <p className="text-muted-foreground mt-4 text-sm font-mono">
                Tax ID: {invoice.client.taxId}
              </p>
            </motion.div>
          </div>

          <div className="py-10">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b-2 border-border">
                  <th className="pb-4 text-sm font-bold uppercase tracking-widest text-foreground w-1/2">
                    Description
                  </th>
                  <th className="pb-4 text-sm font-bold uppercase tracking-widest text-foreground text-right">
                    Qty
                  </th>
                  <th className="pb-4 text-sm font-bold uppercase tracking-widest text-foreground text-right">
                    Price
                  </th>
                  <th className="pb-4 text-sm font-bold uppercase tracking-widest text-foreground text-right">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-border divide-dashed">
                {invoice.items.map((item, i) => (
                  <motion.tr 
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25, delay: 0.3 + i * 0.08 }}
                    whileHover={{ backgroundColor: 'rgba(70, 60, 255, 0.04)' }}
                    className="transition-colors cursor-pointer"
                  >
                    <td className="py-6 font-semibold dark:text-white">
                      {item.desc}
                    </td>
                    <td className="py-6 text-right font-mono font-medium dark:text-white">
                      {item.qty}
                    </td>
                    <td className="py-6 text-right font-mono font-medium dark:text-white">
                      ${item.price.toLocaleString()}
                    </td>
                    <td className="py-6 text-right font-mono font-bold text-foreground">
                      ${item.total.toLocaleString()}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>

            <div className="mt-12 flex justify-end">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -2 }}
                transition={{ type: 'spring', stiffness: 350, damping: 25, delay: 0.35 }}
                className="w-[320px] border-2 border-border bg-card p-8 shadow-brutal"
              >
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
            className="border-2 border-border bg-card p-6 shadow-brutal"
          >
            <h3 className="font-bold text-foreground mb-4">
              Invoice Details
            </h3>
            <div className="space-y-4">
              <motion.div whileHover={{ x: 2 }} transition={{ type: 'spring', stiffness: 400 }}>
                <p className="text-sm font-bold text-muted-foreground">
                  Issue Date
                </p>
                <p className="font-bold text-foreground">
                  {invoice.issueDate}
                </p>
              </motion.div>
              <motion.div whileHover={{ x: 2 }} transition={{ type: 'spring', stiffness: 400 }}>
                <p className="text-sm font-bold text-muted-foreground">
                  Due Date
                </p>
                <p className="font-bold text-foreground">
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
            className="border-2 border-border bg-card p-6 shadow-brutal"
          >
            <h3 className="font-bold text-foreground mb-4">
              Actions
            </h3>
            <div className="space-y-3">
              <motion.div whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }}>
                <Button className="w-full shadow-brutal-sm" onClick={() => alert("Invoice marked as paid!")}>
                  <DollarSign className="w-4 h-4 mr-2" /> Mark as Paid
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }}>
                <Button variant="outline" className="w-full shadow-brutal-sm" onClick={() => { navigator.clipboard?.writeText(window.location.href); alert("Invoice link copied to clipboard!"); }}>
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
