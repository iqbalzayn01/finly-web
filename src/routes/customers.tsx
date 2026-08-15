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
} from 'lucide-react'
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

export const Route = createFileRoute('/customers')({
  component: Customers,
})

const initialCustomers = [
  {
    id: 1,
    name: 'Acme Corp',
    email: 'billing@acmecorp.com',
    phone: '+1 (555) 000-1234',
    address: '123 Acme Way, NY',
    term: 14,
    spent: 45000,
  },
  {
    id: 2,
    name: 'GlobalTech',
    email: 'accounts@globaltech.io',
    phone: '+1 (555) 999-8888',
    address: 'Tech Park, SF',
    term: 30,
    spent: 120500,
  },
  {
    id: 3,
    name: 'Stark Industries',
    email: 'invoices@stark.com',
    phone: '+1 (555) 123-4567',
    address: 'Malibu Point, CA',
    term: 7,
    spent: 89000,
  },
  {
    id: 4,
    name: 'Wayne Enterprises',
    email: 'finance@wayne.com',
    phone: '+1 (555) 000-0000',
    address: 'Gotham City',
    term: 30,
    spent: 15000,
  },
  {
    id: 5,
    name: 'Umbrella Corp',
    email: 'billing@umbrella.com',
    phone: '+1 (555) 666-7777',
    address: 'Raccoon City',
    term: 14,
    spent: 25000,
  },
]

function Customers() {
  const [showForm, setShowForm] = useState(false)
  const [openKebab, setOpenKebab] = useState<number | null>(null)
  const [termFilter, setTermFilter] = useState('all')

  const {
    inputQuery,
    setInputQuery,
    isTooShort,
    results: filteredCustomers,
  } = useDebouncedSearch({
    resourceKey: 'customers-list',
    data: initialCustomers,
    extraFilters: { termFilter },
    filterFn: (items, query, filters) => {
      return items.filter((c) => {
        const matchesSearch =
          !query ||
          c.name.toLowerCase().includes(query) ||
          c.email.toLowerCase().includes(query) ||
          c.phone.toLowerCase().includes(query) ||
          c.address.toLowerCase().includes(query)

        const matchesTerm = filters?.termFilter === 'all' || c.term.toString() === filters?.termFilter

        return matchesSearch && matchesTerm
      })
    },
  })

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Customers
          </h1>
          <p className="mt-2 text-muted-foreground">
            Manage client profiles and billing terms.
          </p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
        >
          <Plus className="h-5 w-5 mr-2" /> Add Customer
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 max-w-2xl">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10 pointer-events-none" />
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Search by name or email (min 3 chars)..."
            className="w-full h-11 border border-border bg-background rounded-full pl-11 pr-24 text-sm font-medium outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground"
          />
          {isTooShort && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 border border-amber-300 dark:border-amber-800 rounded-full">
              Min 3 chars
            </span>
          )}
        </div>
        <div className="w-48">
          <Select value={termFilter} onValueChange={setTermFilter}>
            <SelectTrigger className="w-full h-11 border border-border shadow-xs text-sm font-medium bg-card text-foreground rounded-xl">
              <SelectValue placeholder="Payment Terms" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all">All Terms</SelectItem>
              <SelectItem value="7">Net 7</SelectItem>
              <SelectItem value="14">Net 14</SelectItem>
              <SelectItem value="30">Net 30</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredCustomers.length === 0 ? (
        <div className="border border-border bg-card p-12 text-center text-muted-foreground font-medium rounded-2xl shadow-xs">
          No customers found matching search criteria.
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredCustomers.map((c, i) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25, delay: i * 0.06 }}
            key={c.id}
            className="group relative border border-border bg-card p-6 rounded-2xl shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center border border-border bg-accent/40 text-accent-foreground text-lg font-bold rounded-2xl">
                {c.name.charAt(0)}
              </div>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 border border-border bg-accent/40 px-3 py-1 text-xs font-semibold text-accent-foreground rounded-full">
                  Net {c.term}
                </span>
                <div className="relative">
                  <button
                    onClick={() =>
                      setOpenKebab(openKebab === c.id ? null : c.id)
                    }
                    className="p-1.5 border border-transparent rounded-full hover:bg-accent/50 text-muted-foreground hover:text-foreground transition-all"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>
                  <AnimatePresence>
                    {openKebab === c.id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -5 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -5 }}
                        transition={{ type: 'spring', stiffness: 450, damping: 28 }}
                        className="absolute right-0 top-10 w-36 border border-border bg-card p-1.5 rounded-xl shadow-lg z-20 flex flex-col gap-0.5"
                      >
                        <button onClick={() => { alert("Customer updated successfully"); setOpenKebab(null); }} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-foreground hover:bg-accent/50 font-medium rounded-lg transition-all">
                          <Edit2 className="h-3.5 w-3.5" /> Edit
                        </button>
                        <button onClick={() => { alert("Customer deleted"); setOpenKebab(null); }} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-destructive hover:bg-destructive/10 font-medium rounded-lg transition-all">
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
      </motion.div>
      )}

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
                New Customer
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-foreground">
                    Company Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter company name"
                    className="mt-1.5 h-11 w-full border border-border bg-background rounded-xl px-4 text-sm font-medium outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-foreground">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="email@example.com"
                      className="mt-1.5 h-11 w-full border border-border bg-background rounded-xl px-4 text-sm font-medium outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground">
                      Payment Terms
                    </label>
                    <div className="mt-1.5">
                      <Select defaultValue="net30">
                        <SelectTrigger className="w-full h-11 border border-border shadow-xs text-sm font-medium bg-background text-foreground rounded-xl">
                          <SelectValue placeholder="Select terms" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="net7">Net 7</SelectItem>
                          <SelectItem value="net14">Net 14</SelectItem>
                          <SelectItem value="net30">Net 30</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground">
                    Phone
                  </label>
                  <input
                    type="text"
                    placeholder="+1 (555) 000-0000"
                    className="mt-1.5 h-11 w-full border border-border bg-background rounded-xl px-4 text-sm font-medium outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground">
                    Address
                  </label>
                  <textarea
                    placeholder="Enter street address, city, country"
                    rows={2}
                    className="mt-1.5 w-full border border-border bg-background rounded-xl p-3 text-sm font-medium outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground resize-none"
                  />
                </div>
              </div>
              <div className="mt-8 flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    alert('Customer added successfully!')
                    setShowForm(false)
                  }}
                >
                  Create Customer
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
