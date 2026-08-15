import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Plus, Search, Box, MoreVertical, Edit2, Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { Button } from '../components/ui/button'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../components/ui/select'
import { useDebouncedSearch } from '../hooks/use-debounced-search'

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

      <div className="border border-border bg-card shadow-sm rounded-2xl min-h-[600px] overflow-hidden">
        <div className="p-4 border-b border-border flex flex-col md:flex-row gap-4">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10 pointer-events-none" />
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Search catalog (min 3 chars)..."
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap min-w-[800px]">
          <thead className="bg-muted/40 text-muted-foreground border-b border-border">
            <tr>
              <th className="px-6 py-4 font-semibold text-xs">Item Name</th>
              <th className="px-6 py-4 font-semibold text-xs">Unit</th>
              <th className="px-6 py-4 font-semibold text-xs text-right">
                Default Price
              </th>
              <th className="px-6 py-4 font-semibold text-xs text-right">Tax Rate</th>
              <th className="px-6 py-4 font-semibold text-xs text-center">Status</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
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
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center border border-border bg-accent/40 text-accent-foreground rounded-xl transition-all">
                      <Box className="h-4 w-4" />
                    </div>
                    <span className="font-semibold text-sm text-foreground">
                      {item.name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="border border-border bg-accent/40 px-2.5 py-0.5 text-xs font-medium text-accent-foreground rounded-full uppercase tracking-wider">
                    {item.unit}
                  </span>
                </td>
                <td className="px-6 py-4 text-right font-mono font-semibold text-base text-foreground">
                  ${item.price.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-right font-medium text-muted-foreground">
                  {item.taxRate}%
                </td>
                <td className="px-6 py-4 text-center">
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold border px-2.5 py-0.5 rounded-full ${item.active ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' : 'bg-muted text-muted-foreground border-border'}`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${item.active ? 'bg-emerald-500' : 'bg-muted-foreground'}`}
                    />
                    {item.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right relative">
                  <button
                    onClick={() =>
                      setOpenKebab(openKebab === item.id ? null : item.id)
                    }
                    className="p-1.5 border border-transparent rounded-full hover:bg-accent/50 text-muted-foreground hover:text-foreground transition-all"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>
                  <AnimatePresence>
                    {openKebab === item.id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -5 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -5 }}
                        transition={{ type: 'spring', stiffness: 450, damping: 28 }}
                        className="absolute right-12 top-10 w-36 border border-border bg-card p-1.5 rounded-xl shadow-lg z-20 text-left flex flex-col gap-0.5"
                      >
                        <button onClick={() => { alert("Item updated successfully"); setOpenKebab(null); }} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-foreground hover:bg-accent/50 font-medium rounded-lg transition-all">
                          <Edit2 className="h-3.5 w-3.5" /> Edit
                        </button>
                        <button onClick={() => { alert("Item deleted"); setOpenKebab(null); }} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-destructive hover:bg-destructive/10 font-medium rounded-lg transition-all">
                          <Trash2 className="h-3.5 w-3.5" /> Delete
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
              className="absolute inset-0 bg-black/40 backdrop-blur-xs"
              onClick={() => setShowForm(false)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg border border-border bg-card p-8 rounded-2xl shadow-xl"
            >
              <h2 className="text-xl font-bold text-foreground mb-6">
                New Item
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-foreground">
                    Item Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter item name"
                    className="mt-1.5 h-11 w-full border border-border bg-background rounded-xl px-4 text-sm font-medium outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-foreground">
                      Price (USD)
                    </label>
                    <input
                      type="number"
                      placeholder="0.00"
                      className="mt-1.5 h-11 w-full border border-border bg-background rounded-xl px-4 text-sm font-medium outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground">
                      Unit
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. hour, month"
                      className="mt-1.5 h-11 w-full border border-border bg-background rounded-xl px-4 text-sm font-medium outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-8">
                  <Button variant="outline" onClick={() => setShowForm(false)}>
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
