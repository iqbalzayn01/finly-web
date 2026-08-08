import { createFileRoute } from '@tanstack/react-router'
import { Plus, Search, Box, MoreVertical, Edit2, Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { useState, useMemo, useDeferredValue } from 'react'
import { Button } from '../components/ui/button'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../components/ui/select'

import { useUIStore } from '../store/ui-store'

export const Route = createFileRoute('/items')({
  component: Items,
})

const initialItems = [
  {
    id: 1,
    name: 'Web Development (Hourly)',
    price: 150,
    unit: 'hour',
    taxRate: 11,
    active: true,
  },
  {
    id: 2,
    name: 'SEO Retainer',
    price: 1500,
    unit: 'month',
    taxRate: 11,
    active: true,
  },
  {
    id: 3,
    name: 'Logo Design',
    price: 800,
    unit: 'pcs',
    taxRate: 11,
    active: true,
  },
  {
    id: 4,
    name: 'Server Hosting',
    price: 50,
    unit: 'month',
    taxRate: 11,
    active: false,
  },
  {
    id: 5,
    name: 'Copywriting',
    price: 75,
    unit: 'hour',
    taxRate: 11,
    active: true,
  },
  {
    id: 6,
    name: 'Social Media Management',
    price: 1200,
    unit: 'month',
    taxRate: 11,
    active: true,
  },
]

import { useDebouncedSearch } from '../hooks/use-debounced-search'

function Items() {
  const [showForm, setShowForm] = useState(false)
  const [openKebab, setOpenKebab] = useState<number | null>(null)
  const [statusFilter, setStatusFilter] = useState('all')

  const {
    inputQuery,
    setInputQuery,
    isTooShort,
    results: filteredItems,
  } = useDebouncedSearch({
    resourceKey: 'items-catalog',
    data: initialItems,
    extraFilters: { statusFilter },
    filterFn: (items, query, filters) => {
      return items.filter((item) => {
        const matchesSearch =
          !query ||
          item.name.toLowerCase().includes(query) ||
          item.unit.toLowerCase().includes(query) ||
          item.price.toString().includes(query)

        const matchesStatus =
          filters?.statusFilter === 'all' ||
          (filters?.statusFilter === 'active' && item.active) ||
          (filters?.statusFilter === 'inactive' && !item.active)

        return matchesSearch && matchesStatus
      })
    },
  })

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Product Catalog
          </h1>
          <p className="mt-2 text-muted-foreground">
            Manage products, services, and default pricing.
          </p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
        >
          <Plus className="h-5 w-5 mr-2" /> Add Item
        </Button>
      </div>

      <div className="border-2 border-border bg-card shadow-brutal min-h-[600px] overflow-hidden">
        <div className="p-4 border-b-2 border-border flex flex-col md:flex-row gap-4">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground z-10 pointer-events-none" />
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Search catalog (min 3 chars)..."
              className="w-full h-11 border-2 border-border bg-card pl-11 pr-24 text-sm font-bold outline-none shadow-brutal-sm focus:shadow-none focus:translate-y-[2px] focus:translate-x-[2px] transition-all text-foreground placeholder:text-muted-foreground"
            />
            {isTooShort && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 border border-amber-300 dark:border-amber-800 rounded">
                Min 3 chars
              </span>
            )}
          </div>
          <div className="w-40">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full h-11 border-2 border-border shadow-brutal-sm text-sm font-bold bg-card text-foreground">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap min-w-[800px]">
          <thead className="bg-muted text-muted-foreground border-b-2 border-border">
            <tr>
              <th className="px-6 py-5 font-semibold">Item Name</th>
              <th className="px-6 py-5 font-semibold">Unit</th>
              <th className="px-6 py-5 font-semibold text-right">
                Default Price
              </th>
              <th className="px-6 py-5 font-semibold text-right">Tax Rate</th>
              <th className="px-6 py-5 font-semibold text-center">Status</th>
              <th className="px-6 py-5"></th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-border">
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-muted-foreground font-medium">
                  No catalog items found matching criteria.
                </td>
              </tr>
            ) : (
              filteredItems.map((item, i) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: i * 0.05 }}
                  whileHover={{ backgroundColor: 'rgba(70, 60, 255, 0.04)' }}
                  className="group transition-colors"
                >
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center border-2 border-border bg-accent text-accent-foreground shadow-brutal-sm group-hover:translate-y-[-2px] transition-all">
                      <Box className="h-5 w-5" />
                    </div>
                    <span className="font-bold text-base text-foreground">
                      {item.name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className="border-2 border-border bg-accent px-3 py-1 text-xs font-bold text-accent-foreground shadow-brutal-sm uppercase tracking-wider">
                    {item.unit}
                  </span>
                </td>
                <td className="px-6 py-5 text-right font-mono font-bold text-lg text-foreground">
                  ${item.price.toLocaleString()}
                </td>
                <td className="px-6 py-5 text-right font-medium text-muted-foreground">
                  {item.taxRate}%
                </td>
                <td className="px-6 py-5 text-center">
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-bold border-2 px-3 py-1 shadow-brutal-sm ${item.active ? 'bg-primary text-primary-foreground border-border' : 'bg-muted text-muted-foreground border-border'}`}
                  >
                    <span
                      className={`h-2 w-2 border-2 border-border ${item.active ? 'bg-accent' : 'bg-card'}`}
                    />
                    {item.active ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                </td>
                <td className="px-6 py-5 text-right relative">
                  <button
                    onClick={() =>
                      setOpenKebab(openKebab === item.id ? null : item.id)
                    }
                    className="p-2 border-2 border-transparent hover:border-border hover:shadow-brutal-sm transition-all hover:bg-accent text-muted-foreground hover:text-accent-foreground"
                  >
                    <MoreVertical className="h-5 w-5" />
                  </button>
                  <AnimatePresence>
                    {openKebab === item.id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -5 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -5 }}
                        transition={{ type: 'spring', stiffness: 450, damping: 28 }}
                        className="absolute right-12 top-10 w-32 border-2 border-border bg-card p-1.5 shadow-brutal z-20 text-left flex flex-col gap-1"
                      >
                        <button onClick={() => { alert("Item updated successfully"); setOpenKebab(null); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground font-bold border-2 border-transparent hover:border-border transition-all">
                          <Edit2 className="h-4 w-4" /> Edit
                        </button>
                        <button onClick={() => { alert("Item deleted"); setOpenKebab(null); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive hover:text-destructive-foreground font-bold border-2 border-transparent hover:border-border transition-all">
                          <Trash2 className="h-4 w-4" /> Delete
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {openKebab === item.id && (
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

      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setShowForm(false)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg border-2 border-border bg-card p-8 shadow-brutal-lg"
            >
              <h2 className="text-2xl font-bold text-foreground mb-6">
                New Item
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-bold text-foreground">
                    Item Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter item name"
                    className="mt-1.5 h-11 w-full border-2 border-border bg-card px-4 text-sm font-bold outline-none shadow-brutal-sm focus:shadow-none focus:translate-y-[2px] focus:translate-x-[2px] transition-all text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-bold text-foreground">
                      Price (USD)
                    </label>
                    <input
                      type="number"
                      placeholder="0.00"
                      className="mt-1.5 h-11 w-full border-2 border-border bg-card px-4 text-sm font-bold outline-none shadow-brutal-sm focus:shadow-none focus:translate-y-[2px] focus:translate-x-[2px] transition-all text-foreground placeholder:text-muted-foreground font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-foreground">
                      Unit
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. hour, month"
                      className="mt-1.5 h-11 w-full border-2 border-border bg-card px-4 text-sm font-bold outline-none shadow-brutal-sm focus:shadow-none focus:translate-y-[2px] focus:translate-x-[2px] transition-all text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-8">
                  <Button variant="ghost" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                  <Button className="px-6" onClick={() => { alert("Item saved successfully!"); setShowForm(false); }}>
                    Save Item
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
