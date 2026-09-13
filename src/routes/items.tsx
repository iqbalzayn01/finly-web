import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import {
  Plus,
  Search,
  Box,
  MoreVertical,
  Edit2,
  Trash2,
} from '../components/ui/icon'
import { motion, AnimatePresence } from 'motion/react'
import { Button } from '../components/ui/button'
import { AlertModal } from '../components/ui/alert-modal'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../components/ui/select'
import { useDebouncedSearch } from '../hooks/use-debounced-search'
import { useCurrency } from '../lib/currency'
import { NumberTicker } from '../components/ui/number-ticker'
import { runValidation, itemFormSchema } from '../lib/validation'
import initialItems from '../data/items.json'

export const Route = createFileRoute('/items')({
  component: Items,
})

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
]

function Items() {
  const { formatAmount } = useCurrency()
  const [showForm, setShowForm] = useState(false)
  const [openKebab, setOpenKebab] = useState<number | null>(null)
  const [statusFilter, setStatusFilter] = useState('all')
  const [itemModal, setItemModal] = useState<{
    open: boolean
    type: 'info' | 'success' | 'warning' | 'error'
    title: string
    desc: string
  }>({
    open: false,
    type: 'info',
    title: '',
    desc: '',
  })
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean
    itemName?: string
  }>({
    open: false,
  })
  const [newItem, setNewItem] = useState({
    name: '',
    price: 0,
    unit: '',
    taxRate: 11,
    active: true,
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const handleCreateItem = () => {
    const res = runValidation(itemFormSchema, newItem)
    if (!res.success) {
      setFormErrors(res.errors)
      return
    }

    setFormErrors({})
    setShowForm(false)
    setItemModal({
      open: true,
      type: 'success',
      title: 'Item Created',
      desc: `Catalog item ${res.data.name} added.`,
    })
  }

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
    <div className="space-y-6 sm:space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
            Items Catalog
          </h1>
          <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-muted-foreground">
            Manage products, services, and default pricing.
          </p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="w-full sm:w-auto h-11 px-6 rounded-full font-semibold shadow-none"
        >
          <Plus className="h-5 w-5 mr-2" /> Add Item
        </Button>
      </div>

      <div className="border border-border bg-card shadow-none rounded-2xl min-h-[500px] overflow-hidden">
        <div className="p-3.5 sm:p-4 border-b border-border flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10 pointer-events-none" />
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Search catalog..."
              className="w-full h-11 border border-border bg-background rounded-md pl-10 pr-24 text-xs sm:text-sm font-medium outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground"
            />
            {isTooShort && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] sm:text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 border border-amber-300 dark:border-amber-800 rounded-full">
                Min 3 chars
              </span>
            )}
          </div>
          <div className="w-full sm:w-40 shrink-0">
            <Select
              items={STATUS_OPTIONS}
              value={statusFilter}
              onValueChange={(val) => setStatusFilter(val || 'all')}
            >
              <SelectTrigger className="w-full h-11 border border-border shadow-none text-xs sm:text-sm font-medium bg-card text-foreground rounded-md">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent className="rounded-md">
                {STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
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
                <th className="px-6 py-4 font-semibold text-xs text-right">
                  Tax Rate
                </th>
                <th className="px-6 py-4 font-semibold text-xs text-center">
                  Status
                </th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 max-w-sm mx-auto">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
                        <Search className="h-4 w-4" />
                      </div>
                      <p className="font-semibold text-sm text-foreground">
                        No items found
                      </p>
                      <p className="text-xs text-muted-foreground">
                        No catalog items match the active filters.
                      </p>
                      {inputQuery && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setInputQuery('')}
                          className="mt-2 text-xs"
                        >
                          Clear Search
                        </Button>
                      )}
                    </div>
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
                        <div className="flex h-10 w-10 items-center justify-center border border-border bg-accent/40 text-accent-foreground rounded-md transition-all">
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
                      <NumberTicker
                        value={item.price}
                        formatter={(v) => formatAmount(v)}
                      />
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-muted-foreground">
                      <NumberTicker value={item.taxRate} suffix="%" />
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
                        className="flex h-8 w-8 items-center justify-center border border-transparent rounded-full hover:bg-accent/50 text-muted-foreground hover:text-foreground transition-all cursor-pointer outline-none"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                      <AnimatePresence>
                        {openKebab === item.id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -5 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -5 }}
                            transition={{
                              type: 'spring',
                              stiffness: 450,
                              damping: 28,
                            }}
                            className="absolute right-12 top-10 w-36 border border-border bg-card p-1.5 rounded-md shadow-none z-20 text-left flex flex-col gap-0.5"
                          >
                            <button
                              onClick={() => {
                                setOpenKebab(null)
                                setItemModal({
                                  open: true,
                                  type: 'success',
                                  title: 'Item Updated',
                                  desc: `Item ${item.name} updated.`,
                                })
                              }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-foreground hover:bg-accent/50 font-medium rounded-lg transition-all"
                            >
                              <Edit2 className="h-3.5 w-3.5" /> Edit
                            </button>
                            <button
                              onClick={() => {
                                setOpenKebab(null)
                                setDeleteModal({
                                  open: true,
                                  itemName: item.name,
                                })
                              }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-destructive hover:bg-destructive/10 font-medium rounded-lg transition-all"
                            >
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
                ))
              )}
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
              className="relative w-full max-w-lg border border-border bg-card p-6 sm:p-8 rounded-2xl shadow-none max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-xl font-bold text-foreground mb-6">
                New Item
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-foreground">
                    Item Name <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    value={newItem.name}
                    onChange={(e) => {
                      setNewItem((prev) => ({ ...prev, name: e.target.value }))
                      if (formErrors.name) {
                        setFormErrors((prev) => {
                          const updated = { ...prev }
                          delete updated.name
                          return updated
                        })
                      }
                    }}
                    placeholder="Enter item name"
                    className={`mt-1.5 h-11 w-full border bg-background rounded-md px-4 text-sm font-medium outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground ${
                      formErrors.name ? 'border-destructive' : 'border-border'
                    }`}
                  />
                  {formErrors.name && (
                    <p className="text-[11px] font-semibold text-destructive mt-1">
                      {formErrors.name}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-foreground">
                      Price <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="number"
                      value={newItem.price || ''}
                      onChange={(e) => {
                        setNewItem((prev) => ({
                          ...prev,
                          price: parseFloat(e.target.value) || 0,
                        }))
                        if (formErrors.price) {
                          setFormErrors((prev) => {
                            const updated = { ...prev }
                            delete updated.price
                            return updated
                          })
                        }
                      }}
                      placeholder="0.00"
                      className={`mt-1.5 h-11 w-full border bg-background rounded-md px-4 text-sm font-medium outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground font-mono ${
                        formErrors.price
                          ? 'border-destructive'
                          : 'border-border'
                      }`}
                    />
                    {formErrors.price && (
                      <p className="text-[11px] font-semibold text-destructive mt-1">
                        {formErrors.price}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground">
                      Unit <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      value={newItem.unit}
                      onChange={(e) => {
                        setNewItem((prev) => ({
                          ...prev,
                          unit: e.target.value,
                        }))
                        if (formErrors.unit) {
                          setFormErrors((prev) => {
                            const updated = { ...prev }
                            delete updated.unit
                            return updated
                          })
                        }
                      }}
                      placeholder="e.g. hour, project, month"
                      className={`mt-1.5 h-11 w-full border bg-background rounded-md px-4 text-sm font-medium outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground ${
                        formErrors.unit ? 'border-destructive' : 'border-border'
                      }`}
                    />
                    {formErrors.unit && (
                      <p className="text-[11px] font-semibold text-destructive mt-1">
                        {formErrors.unit}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-8">
                  <Button variant="outline" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                  <Button className="px-6" onClick={handleCreateItem}>
                    Save Item
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AlertModal
        open={itemModal.open}
        onOpenChange={(open) => setItemModal((prev) => ({ ...prev, open }))}
        type={itemModal.type}
        title={itemModal.title}
        description={itemModal.desc}
        confirmText="Got it"
      />

      <AlertModal
        open={deleteModal.open}
        onOpenChange={(open) => setDeleteModal((prev) => ({ ...prev, open }))}
        type="error"
        title="Delete Item"
        description={`Permanently delete ${deleteModal.itemName || 'this item'}? Existing issued invoices will retain snapshot pricing.`}
        confirmText="Delete Item"
        cancelText="Cancel"
        onConfirm={() => {
          setItemModal({
            open: true,
            type: 'success',
            title: 'Item Deleted',
            desc: 'Catalog item deleted.',
          })
        }}
      />
    </div>
  )
}
