import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, Plus, Save, Send, Trash2 } from '../../components/ui/icon'
import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Button } from '../../components/ui/button'
import { AlertModal } from '../../components/ui/alert-modal'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../../components/ui/select'
import { useCurrency } from '../../lib/currency'

export const Route = createFileRoute('/invoices/builder')({
  component: InvoiceBuilder,
})

interface LineItem {
  id: string
  description: string
  qty: number
  price: number
}

function InvoiceBuilder() {
  const { formatAmount } = useCurrency()
  const navigate = useNavigate()
  const [draftSavedModal, setDraftSavedModal] = useState(false)
  const [items, setItems] = useState<LineItem[]>([
    {
      id: '1',
      description: 'Web Application Development',
      qty: 1,
      price: 4000,
    },
    { id: '2', description: 'UI/UX Design & Branding', qty: 1, price: 1000 },
  ])

  const updateItem = (id: string, field: keyof LineItem, value: any) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    )
  }

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      { id: Date.now().toString(), description: '', qty: 1, price: 0 },
    ])
  }

  const removeItem = (id: string) => {
    if (items.length <= 1) return
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const subtotal = items.reduce((acc, item) => acc + item.qty * item.price, 0)
  const tax = Math.round(subtotal * 0.11)
  const total = subtotal + tax

  return (
    <div className="space-y-8 max-w-[1000px] mx-auto pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/invoices"
            className="flex h-10 w-10 items-center justify-center border border-border bg-card rounded-full text-foreground transition-all hover:bg-accent shadow-none"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Create Invoice
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="px-5"
            onClick={() => setDraftSavedModal(true)}
          >
            <Save className="h-4 w-4 mr-2" /> Save Draft
          </Button>
          <Button
            className="px-6"
            onClick={() =>
              navigate({ to: '/invoices/$id', params: { id: 'INV-2026-001' } })
            }
          >
            <Send className="h-4 w-4 mr-2" /> Issue Document
          </Button>
        </div>
      </div>

      <div className="border border-border bg-card shadow-none rounded-2xl overflow-hidden">
        {/* Document Header */}
        <div className="p-6 md:p-10 border-b border-border">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-12">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                From
              </p>
              <div className="border border-border bg-background p-6 rounded-2xl shadow-none">
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
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                To
              </p>
              <Select>
                <SelectTrigger className="w-full h-12 border border-border bg-background px-4 font-semibold text-base rounded-xl shadow-none">
                  <SelectValue placeholder="Select a Customer..." />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="acme">Acme Corp</SelectItem>
                  <SelectItem value="global">GlobalTech</SelectItem>
                  <SelectItem value="stark">Stark Industries</SelectItem>
                </SelectContent>
              </Select>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-foreground">
                    Issue Date
                  </label>
                  <input
                    type="date"
                    defaultValue="2026-08-01"
                    className="mt-1.5 w-full h-11 border border-border bg-background px-3 font-mono text-sm font-medium outline-none rounded-xl text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-foreground">
                    Due Date
                  </label>
                  <input
                    type="date"
                    defaultValue="2026-08-15"
                    className="mt-1.5 w-full h-11 border border-border bg-background px-3 font-mono text-sm font-medium outline-none rounded-xl text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Line Items */}
        <div className="p-6 md:p-10">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left min-w-[600px]">
              <thead>
                <tr className="border-b border-border text-muted-foreground text-xs uppercase tracking-wider">
                  <th className="pb-3 font-semibold w-1/2">Description</th>
                  <th className="pb-3 font-semibold text-right">Qty</th>
                  <th className="pb-3 font-semibold text-right">Price</th>
                  <th className="pb-3 font-semibold text-right">Total</th>
                  <th className="pb-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <AnimatePresence initial={false}>
                  {items.map((item) => (
                    <motion.tr
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 28,
                      }}
                      className="group"
                    >
                      <td className="py-4">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) =>
                            updateItem(item.id, 'description', e.target.value)
                          }
                          placeholder="Item description"
                          className="w-full bg-transparent text-sm font-semibold outline-none placeholder:font-normal text-foreground focus:border-b focus:border-primary"
                        />
                      </td>
                      <td className="py-4 text-right">
                        <input
                          type="number"
                          value={item.qty}
                          onChange={(e) =>
                            updateItem(
                              item.id,
                              'qty',
                              parseFloat(e.target.value) || 0,
                            )
                          }
                          placeholder="Qty"
                          className="w-16 bg-transparent text-right font-mono text-sm font-medium outline-none text-foreground focus:border-b focus:border-primary"
                        />
                      </td>
                      <td className="py-4 text-right">
                        <input
                          type="number"
                          value={item.price}
                          onChange={(e) =>
                            updateItem(
                              item.id,
                              'price',
                              parseFloat(e.target.value) || 0,
                            )
                          }
                          placeholder="Price"
                          className="w-32 bg-transparent text-right font-mono text-sm font-medium outline-none text-foreground focus:border-b focus:border-primary"
                        />
                      </td>
                      <td className="py-4 text-right font-mono text-sm font-semibold text-foreground">
                        {formatAmount(item.qty * item.price)}
                      </td>
                      <td className="py-4 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="flex h-8 w-8 items-center justify-center ml-auto border border-transparent rounded-full hover:bg-destructive/10 text-destructive transition-all cursor-pointer outline-none"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          <Button
            onClick={addItem}
            variant="outline"
            className="mt-6 h-10 border border-border border-dashed hover:border-solid text-xs font-semibold"
          >
            <Plus className="h-3.5 w-3.5 mr-2" /> Add Line Item
          </Button>

          {/* Totals */}
          <div className="mt-12 flex justify-end">
            <div className="w-[300px] border border-border bg-background p-6 rounded-2xl shadow-none">
              <div className="space-y-3">
                <div className="flex justify-between text-xs font-medium text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="font-mono text-foreground font-semibold">
                    {formatAmount(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-xs font-medium text-muted-foreground">
                  <span>Tax (11%)</span>
                  <span className="font-mono text-foreground font-semibold">
                    {formatAmount(tax)}
                  </span>
                </div>
              </div>
              <div className="mt-4 border-t border-border pt-4 flex justify-between items-end">
                <span className="text-xs font-semibold uppercase tracking-wider text-foreground">
                  Total
                </span>
                <span className="font-mono text-3xl font-bold tracking-tight text-primary">
                  {formatAmount(total)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AlertModal
        open={draftSavedModal}
        onOpenChange={setDraftSavedModal}
        type="success"
        title="Draft Saved"
        description="Invoice draft has been saved to your workspace records."
        confirmText="Got it"
      />
    </div>
  )
}
