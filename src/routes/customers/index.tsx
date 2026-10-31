import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import {
  Plus,
  Search,
  Mail,
  Phone,
  MapPin,
  MoreVertical,
  Edit2,
  Trash2,
} from '../../components/ui/icon'
import { motion, AnimatePresence } from 'motion/react'
import { Button } from '../../components/ui/button'
import { AlertModal } from '../../components/ui/alert-modal'
import { Dialog, DialogTrigger } from '../../components/ui/dialog'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../../components/ui/select'
import { useDebouncedSearch } from '../../hooks/use-debounced-search'
import { NumberTicker } from '../../components/ui/number-ticker'
import { useCurrency } from '../../lib/currency'
import { CreateCustomerModal } from './-create-customer-modal'
import type { CreatedCustomer, CreatedRecord } from './-create-customer-modal'
import initialCustomers from '../../data/customers.json'

export const Route = createFileRoute('/customers/')({
  component: Customers,
})

const TERM_OPTIONS = [
  { value: 'all', label: 'All Terms' },
  { value: '7', label: 'Net 7' },
  { value: '14', label: 'Net 14' },
  { value: '30', label: 'Net 30' },
]

function Customers() {
  const { formatAmount } = useCurrency()
  const [showForm, setShowForm] = useState(false)
  const [customersList, setCustomersList] = useState(initialCustomers)
  const [openKebab, setOpenKebab] = useState<number | null>(null)
  const [termFilter, setTermFilter] = useState('all')
  const [successModal, setSuccessModal] = useState<{
    open: boolean
    title: string
    desc: string
  }>({
    open: false,
    title: '',
    desc: '',
  })
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean
    customerName?: string
  }>({
    open: false,
  })

  const handleCustomerCreated = (
    customer: CreatedCustomer,
    record?: CreatedRecord | null,
  ) => {
    const newCustomer = {
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      term: customer.term,
      spent: customer.spent ?? 0,
    }
    setCustomersList((prev) => [newCustomer, ...prev])
    setShowForm(false)
    setSuccessModal({
      open: true,
      title: record ? 'Customer & Record Created' : 'Customer Added',
      desc: record
        ? `Customer ${customer.name} created and initial ${record.type} record of ${formatAmount(record.amount, record.currency as any)} recorded.`
        : `Customer ${customer.name} created and saved to directory.`,
    })
  }

  const {
    inputQuery,
    setInputQuery,
    isTooShort,
    results: filteredCustomers,
  } = useDebouncedSearch({
    resourceKey: 'customers-list',
    data: customersList,
    extraFilters: { termFilter },
    filterFn: (items, query, filters) => {
      return items.filter((c) => {
        const matchesSearch =
          !query ||
          c.name.toLowerCase().includes(query) ||
          c.email.toLowerCase().includes(query) ||
          c.phone.toLowerCase().includes(query) ||
          c.address.toLowerCase().includes(query)

        const matchesTerm =
          filters?.termFilter === 'all' ||
          c.term.toString() === filters?.termFilter

        return matchesSearch && matchesTerm
      })
    },
  })

  return (
    <div className="space-y-6 sm:space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
            Customers
          </h1>
          <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-muted-foreground">
            Manage client profiles, contact information, and billing terms.
          </p>
        </div>
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogTrigger
            render={
              <Button className="w-full sm:w-auto h-11 font-semibold shadow-none">
                <Plus className="h-5 w-5" /> Add Customer
              </Button>
            }
          />
          <CreateCustomerModal
            onSuccess={handleCustomerCreated}
            onCancel={() => setShowForm(false)}
          />
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 max-w-2xl">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10 pointer-events-none" />
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full h-11 border border-border bg-background rounded-md pl-10 pr-24 text-xs sm:text-sm font-medium outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground"
          />
          {isTooShort && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] sm:text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 border border-amber-300 dark:border-amber-800 rounded-full">
              Min 3 chars
            </span>
          )}
        </div>
        <div className="w-full sm:w-44 shrink-0">
          <Select
            items={TERM_OPTIONS}
            value={termFilter}
            onValueChange={(val) => setTermFilter(val || 'all')}
          >
            <SelectTrigger className="w-full h-11 border border-border shadow-none text-xs sm:text-sm font-medium bg-card text-foreground rounded-md">
              <SelectValue placeholder="Payment Terms" />
            </SelectTrigger>
            <SelectContent className="rounded-md">
              {TERM_OPTIONS.map((opt) => (
                <SelectItem
                  key={opt.value}
                  value={opt.value}
                  className="rounded-md"
                >
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredCustomers.length === 0 ? (
        <div className="border border-border bg-card p-8 sm:p-12 text-center rounded-2xl shadow-none flex flex-col items-center justify-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/60 text-muted-foreground border border-border">
            <Search className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-base text-foreground">
              No customers found
            </h3>
            <p className="text-xs text-muted-foreground max-w-sm">
              No customer profiles match the active search query.
            </p>
          </div>
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
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredCustomers.map((c, i) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: 'spring',
                stiffness: 350,
                damping: 25,
                delay: i * 0.06,
              }}
              key={c.id}
              className="group relative border border-border bg-card p-4 sm:p-6 rounded-2xl shadow-none"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center border border-border bg-accent/40 text-accent-foreground text-lg font-bold rounded-2xl">
                  {c.name.charAt(0)}
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1.5 border border-border bg-accent/40 px-3 py-1 text-xs font-semibold text-accent-foreground rounded-full">
                    Net <NumberTicker value={c.term} />
                  </span>
                  <div className="relative">
                    <button
                      onClick={() =>
                        setOpenKebab(openKebab === c.id ? null : c.id)
                      }
                      className="flex h-8 w-8 items-center justify-center border border-transparent rounded-full hover:bg-accent/50 text-muted-foreground hover:text-foreground transition-all cursor-pointer outline-none"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                    <AnimatePresence>
                      {openKebab === c.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: -5 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -5 }}
                          transition={{
                            type: 'spring',
                            stiffness: 450,
                            damping: 28,
                          }}
                          className="absolute right-0 top-10 w-36 border border-border bg-card p-1.5 rounded-md shadow-none z-20 flex flex-col gap-0.5"
                        >
                          <button
                            onClick={() => {
                              setOpenKebab(null)
                              setSuccessModal({
                                open: true,
                                title: 'Customer Updated',
                                desc: `Customer ${c.name} has been updated.`,
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
                                customerName: c.name,
                              })
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-destructive hover:bg-destructive/10 font-medium rounded-lg transition-all"
                          >
                            <Trash2 className="h-3.5 w-3.5" /> Delete
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              <h3 className="mt-5 text-xl font-bold tracking-tight text-foreground transition-colors">
                {c.name}
              </h3>

              <div className="mt-5 space-y-2.5">
                <div className="flex items-center gap-2.5 text-muted-foreground">
                  <Mail className="h-4 w-4 shrink-0" />
                  <span className="text-xs font-medium">{c.email}</span>
                </div>
                <div className="flex items-center gap-2.5 text-muted-foreground">
                  <Phone className="h-4 w-4 shrink-0" />
                  <span className="text-xs font-medium">{c.phone}</span>
                </div>
                <div className="flex items-start gap-2.5 text-muted-foreground">
                  <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                  <span className="text-xs font-medium leading-tight">
                    {c.address}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AlertModal
        open={successModal.open}
        onOpenChange={(open) => setSuccessModal((prev) => ({ ...prev, open }))}
        type="success"
        title={successModal.title}
        description={successModal.desc}
        confirmText="Got it"
      />

      <AlertModal
        open={deleteModal.open}
        onOpenChange={(open) => setDeleteModal((prev) => ({ ...prev, open }))}
        type="error"
        title="Delete Customer"
        description={`Permanently delete ${deleteModal.customerName || 'this customer'}? Associated invoices will remain in your archive.`}
        confirmText="Delete Customer"
        cancelText="Cancel"
        onConfirm={() => {
          setSuccessModal({
            open: true,
            title: 'Customer Deleted',
            desc: 'Customer profile deleted.',
          })
        }}
      />
    </div>
  )
}
