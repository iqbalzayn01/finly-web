import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, Plus, Save, Send, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Button } from '../../components/ui/button'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../../components/ui/select'

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
  const navigate = useNavigate()
  const [items, setItems] = useState<LineItem[]>([
    { id: '1', description: 'Web Application Development', qty: 1, price: 4000 },
    { id: '2', description: 'UI/UX Design & Branding', qty: 1, price: 1000 },
  ])

  const updateItem = (id: string, field: keyof LineItem, value: any) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
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
            className="flex h-10 w-10 items-center justify-center border-2 border-border bg-card text-foreground transition-all hover:bg-accent hover:shadow-brutal-sm hover:translate-y-[-2px]"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Create Invoice
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="rounded-none px-5"
            onClick={() => alert("Draft invoice saved successfully!")}
          >
            <Save className="h-4 w-4 mr-2" /> Save Draft
          </Button>
          <Button className="px-6 rounded-none" onClick={() => navigate({ to: "/invoices/$id", params: { id: "INV-2026-001" } })}>
            <Send className="h-4 w-4 mr-2" /> Issue Document
          </Button>
        </div>
      </div>

      <div className="border-2 border-border bg-card shadow-brutal-lg">
        {/* Document Header */}
        <div className="p-10 border-b-2 border-border border-dashed">
          <div className="grid grid-cols-2 gap-12">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
                From
              </p>
              <div className="border-2 border-border bg-card p-6 shadow-brutal-sm">
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
              </div>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
                To
              </p>
              <Select>
                <SelectTrigger className="w-full h-14 border-2 border-border bg-card px-5 font-semibold text-lg shadow-brutal-sm focus:shadow-none focus:translate-y-[2px] focus:translate-x-[2px] transition-all">
                  <SelectValue placeholder="Select a Customer..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="acme">Acme Corp</SelectItem>
                  <SelectItem value="global">GlobalTech</SelectItem>
                  <SelectItem value="stark">Stark Industries</SelectItem>
                </SelectContent>
              </Select>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-foreground">
                    Issue Date
                  </label>
                  <input
                    type="date"
                    defaultValue="2026-08-01"
                    className="mt-2 w-full h-12 border-2 border-border bg-card px-4 font-mono font-medium outline-none shadow-brutal-sm focus:shadow-none focus:translate-y-[2px] focus:translate-x-[2px] transition-all text-foreground"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-foreground">
                    Due Date
                  </label>
                  <input
                    type="date"
                    defaultValue="2026-08-15"
                    className="mt-2 w-full h-12 border-2 border-border bg-card px-4 font-mono font-medium outline-none shadow-brutal-sm focus:shadow-none focus:translate-y-[2px] focus:translate-x-[2px] transition-all text-foreground"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Line Items */}
        <div className="p-10">
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
                <th className="pb-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-border divide-dashed">
              <AnimatePresence initial={false}>
                {items.map((item) => (
                  <motion.tr
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                    className="group"
                  >
                    <td className="py-6">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                        placeholder="Item description"
                        className="w-full bg-transparent text-lg font-bold outline-none placeholder:font-normal text-foreground"
                      />
                    </td>
                    <td className="py-6 text-right">
                      <input
                        type="number"
                        value={item.qty}
                        onChange={(e) => updateItem(item.id, 'qty', parseFloat(e.target.value) || 0)}
                        placeholder="Qty"
                        className="w-16 bg-transparent text-right font-mono text-lg font-bold outline-none text-foreground"
                      />
                    </td>
                    <td className="py-6 text-right">
                      <input
                        type="number"
                        value={item.price}
                        onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                        placeholder="Price"
                        className="w-32 bg-transparent text-right font-mono text-lg font-bold outline-none text-foreground"
                      />
                    </td>
                    <td className="py-6 text-right font-mono text-lg font-bold text-foreground">
                      ${(item.qty * item.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-6 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 border-2 border-transparent hover:border-border hover:shadow-brutal-sm transition-all text-destructive hover:bg-destructive hover:text-destructive-foreground font-bold"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>

          <Button
            onClick={addItem}
            variant="outline"
            className="mt-6 h-12 border-2 border-border border-dashed hover:border-solid hover:shadow-brutal-sm"
          >
            <Plus className="h-4 w-4 mr-2" /> Add Line Item
          </Button>

          {/* Totals */}
          <div className="mt-12 flex justify-end">
            <div className="w-[320px] border-2 border-border bg-card p-8 shadow-brutal">
              <div className="space-y-4">
                <div className="flex justify-between font-medium text-foreground">
                  <span>Subtotal</span>
                  <span className="font-mono text-foreground font-bold">
                    ${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between font-medium text-foreground">
                  <span>Tax (11%)</span>
                  <span className="font-mono text-foreground font-bold">
                    ${tax.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
              <div className="mt-6 border-t-2 border-border pt-6 flex justify-between items-end border-dashed">
                <span className="text-sm font-bold uppercase tracking-widest text-foreground">
                  Total
                </span>
                <span className="font-mono text-4xl font-bold tracking-tighter text-foreground">
                  ${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
