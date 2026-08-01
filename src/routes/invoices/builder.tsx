import { createFileRoute, Link  } from '@tanstack/react-router'
import { ArrowLeft, Plus, Save, Send, Trash2 } from 'lucide-react'
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

function InvoiceBuilder() {
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
            Create Invoice
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="rounded-none px-5"
          >
            <Save className="h-4 w-4 mr-2" /> Save Draft
          </Button>
          <Button className="px-6 rounded-none">
            <Send className="h-4 w-4 mr-2" /> Issue Document
          </Button>
        </div>
      </div>

      <div className="border-2 border-border bg-card shadow-brutal-lg">
        {/* Document Header */}
        <div className="p-10 border-b-2 border-border border-dashed">
          <div className="grid grid-cols-2 gap-12">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
                From
              </p>
              <div className="border-2 border-border bg-card p-6 shadow-brutal-sm">
                <h3 className="font-bold text-lg text-foreground">
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
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
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
                <th className="pb-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-border divide-dashed">
              <tr className="group">
                <td className="py-6">
                  <input
                    type="text"
                    placeholder="Item description"
                    className="w-full bg-transparent text-lg font-bold outline-none placeholder:font-normal text-foreground"
                  />
                </td>
                <td className="py-6 text-right">
                  <input
                    type="number"
                    placeholder="Qty"
                    defaultValue={1}
                    className="w-16 bg-transparent text-right font-mono text-lg font-bold outline-none text-foreground"
                  />
                </td>
                <td className="py-6 text-right">
                  <input
                    type="text"
                    placeholder="Price"
                    defaultValue="0.00"
                    className="w-32 bg-transparent text-right font-mono text-lg font-bold outline-none text-foreground"
                  />
                </td>
                <td className="py-6 text-right font-mono text-lg font-bold text-foreground">
                  $0.00
                </td>
                <td className="py-6 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 border-2 border-transparent hover:border-border hover:shadow-brutal-sm transition-all text-destructive hover:bg-destructive hover:text-destructive-foreground font-bold">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          <Button
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
                    $0.00
                  </span>
                </div>
                <div className="flex justify-between font-medium text-foreground">
                  <span>Tax (11%)</span>
                  <span className="font-mono text-foreground font-bold">
                    $0.00
                  </span>
                </div>
              </div>
              <div className="mt-6 border-t-2 border-border pt-6 flex justify-between items-end border-dashed">
                <span className="text-sm font-bold uppercase tracking-widest text-foreground">
                  Total
                </span>
                <span className="font-mono text-4xl font-bold tracking-tighter text-foreground">
                  $0.00
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
