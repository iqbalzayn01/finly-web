import * as React from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from '@tanstack/react-router'
import { motion, AnimatePresence } from 'motion/react'
import { SidebarInput, useSidebar } from '../ui/sidebar'
import {
  Search,
  X,
  FileText,
  Wallet,
  Users,
  Package,
  ArrowRight,
} from '../ui/icon'
import { cn } from '../../lib/utils'
import { formatAmount } from '../../lib/currency'
import invoicesData from '../../data/invoices.json'
import transactionsData from '../../data/transactions.json'
import customersData from '../../data/customers.json'
import itemsData from '../../data/items.json'

interface FlatResult {
  category: 'invoice' | 'transaction' | 'customer' | 'item' | 'quick'
  id: string
  title: string
  subtitle?: string
  badge?: string
  badgeClass?: string
  amount?: string
  amountClass?: string
  action: () => void
}

export function SidebarSearch() {
  const navigate = useNavigate()
  const { state, isMobile, setOpen } = useSidebar()
  const [searchQuery, setSearchQuery] = React.useState('')
  const [isOpen, setIsOpen] = React.useState(false)
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const [coords, setCoords] = React.useState({ top: 0, left: 0, width: 380 })
  const [mounted, setMounted] = React.useState(false)

  const triggerRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const trimmedQuery = searchQuery.trim().toLowerCase()

  const matchedInvoices = React.useMemo(() => {
    if (!trimmedQuery) return []
    return invoicesData.invoices.filter((inv) => {
      return (
        inv.id.toLowerCase().includes(trimmedQuery) ||
        inv.client.toLowerCase().includes(trimmedQuery) ||
        inv.status.toLowerCase().includes(trimmedQuery) ||
        inv.amount.toString().includes(trimmedQuery) ||
        inv.date.includes(trimmedQuery)
      )
    })
  }, [trimmedQuery])

  const matchedTransactions = React.useMemo(() => {
    if (!trimmedQuery) return []
    return transactionsData.filter((tx) => {
      return (
        tx.desc.toLowerCase().includes(trimmedQuery) ||
        tx.category.toLowerCase().includes(trimmedQuery) ||
        tx.type.toLowerCase().includes(trimmedQuery) ||
        tx.amount.toString().includes(trimmedQuery) ||
        tx.date.includes(trimmedQuery)
      )
    })
  }, [trimmedQuery])

  const matchedCustomers = React.useMemo(() => {
    if (!trimmedQuery) return []
    return customersData.filter((c) => {
      return (
        c.name.toLowerCase().includes(trimmedQuery) ||
        c.email.toLowerCase().includes(trimmedQuery) ||
        (c.phone && c.phone.toLowerCase().includes(trimmedQuery)) ||
        (c.address && c.address.toLowerCase().includes(trimmedQuery))
      )
    })
  }, [trimmedQuery])

  const matchedItems = React.useMemo(() => {
    if (!trimmedQuery) return []
    return itemsData.filter((item) => {
      return (
        item.name.toLowerCase().includes(trimmedQuery) ||
        item.unit.toLowerCase().includes(trimmedQuery) ||
        item.price.toString().includes(trimmedQuery)
      )
    })
  }, [trimmedQuery])

  const totalMatches =
    matchedInvoices.length +
    matchedTransactions.length +
    matchedCustomers.length +
    matchedItems.length

  const flattenedResults = React.useMemo<FlatResult[]>(() => {
    if (!trimmedQuery) {
      return [
        {
          category: 'quick',
          id: 'quick-invoices',
          title: 'Invoices',
          subtitle: `${invoicesData.invoices.length} total records`,
          action: () => {
            navigate({ to: '/invoices' })
            setIsOpen(false)
            setSearchQuery('')
          },
        },
        {
          category: 'quick',
          id: 'quick-cashbook',
          title: 'Cashbook Ledger',
          subtitle: `${transactionsData.length} total transactions`,
          action: () => {
            navigate({ to: '/cashbook' })
            setIsOpen(false)
            setSearchQuery('')
          },
        },
        {
          category: 'quick',
          id: 'quick-customers',
          title: 'Customers',
          subtitle: `${customersData.length} client accounts`,
          action: () => {
            navigate({ to: '/customers' })
            setIsOpen(false)
            setSearchQuery('')
          },
        },
        {
          category: 'quick',
          id: 'quick-items',
          title: 'Catalog Items',
          subtitle: `${itemsData.length} services & products`,
          action: () => {
            navigate({ to: '/items' })
            setIsOpen(false)
            setSearchQuery('')
          },
        },
      ]
    }

    const results: FlatResult[] = []

    matchedInvoices.slice(0, 3).forEach((inv) => {
      results.push({
        category: 'invoice',
        id: `inv-${inv.id}`,
        title: inv.id,
        subtitle: inv.client,
        badge: inv.status.toUpperCase(),
        badgeClass:
          inv.status === 'paid'
            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
            : inv.status === 'unpaid'
              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
              : 'bg-muted text-muted-foreground border-border',
        amount: formatAmount(inv.amount),
        action: () => {
          navigate({ to: '/invoices/$id', params: { id: inv.id } })
          setIsOpen(false)
          setSearchQuery('')
        },
      })
    })

    matchedTransactions.slice(0, 3).forEach((tx) => {
      results.push({
        category: 'transaction',
        id: `tx-${tx.id}`,
        title: tx.desc,
        subtitle: `${tx.category} • ${tx.date}`,
        badge: tx.type.toUpperCase(),
        badgeClass:
          tx.type === 'income'
            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
            : 'bg-muted text-muted-foreground border-border',
        amount:
          tx.type === 'income'
            ? `+${formatAmount(tx.amount)}`
            : `-${formatAmount(tx.amount)}`,
        amountClass:
          tx.type === 'income'
            ? 'text-emerald-600 dark:text-emerald-400'
            : 'text-foreground',
        action: () => {
          navigate({ to: '/cashbook' })
          setIsOpen(false)
          setSearchQuery('')
        },
      })
    })

    matchedCustomers.slice(0, 3).forEach((c) => {
      results.push({
        category: 'customer',
        id: `cust-${c.id}`,
        title: c.name,
        subtitle: c.email,
        amount: `Spent: ${formatAmount(c.spent)}`,
        action: () => {
          navigate({ to: '/customers' })
          setIsOpen(false)
          setSearchQuery('')
        },
      })
    })

    matchedItems.slice(0, 3).forEach((item) => {
      results.push({
        category: 'item',
        id: `item-${item.id}`,
        title: item.name,
        subtitle: `${formatAmount(item.price)} / ${item.unit}`,
        action: () => {
          navigate({ to: '/items' })
          setIsOpen(false)
          setSearchQuery('')
        },
      })
    })

    return results
  }, [
    trimmedQuery,
    matchedInvoices,
    matchedTransactions,
    matchedCustomers,
    matchedItems,
    navigate,
  ])

  const updatePosition = React.useCallback(() => {
    if (typeof window === 'undefined' || !triggerRef.current) return
    const rect = triggerRef.current.getBoundingClientRect()
    const isMobileView = window.innerWidth < 768
    const targetWidth = isMobileView
      ? Math.min(window.innerWidth - 32, 380)
      : 380
    const safeLeft = Math.max(
      16,
      Math.min(rect.left, window.innerWidth - targetWidth - 16),
    )
    const safeTop = rect.bottom + 6
    setCoords({
      top: safeTop,
      left: safeLeft,
      width: targetWidth,
    })
  }, [])

  React.useEffect(() => {
    if (!isOpen) return
    updatePosition()
    const handleScrollOrResize = () => updatePosition()
    window.addEventListener('resize', handleScrollOrResize)
    window.addEventListener('scroll', handleScrollOrResize, true)
    return () => {
      window.removeEventListener('resize', handleScrollOrResize)
      window.removeEventListener('scroll', handleScrollOrResize, true)
    }
  }, [isOpen, updatePosition])

  React.useEffect(() => {
    setSelectedIndex(0)
  }, [trimmedQuery])

  React.useEffect(() => {
    if (!isOpen) return
    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as Node
      if (
        triggerRef.current?.contains(target) ||
        dropdownRef.current?.contains(target)
      ) {
        return
      }
      setIsOpen(false)
    }
    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [isOpen])

  React.useEffect(() => {
    if (state === 'collapsed' && !isMobile) {
      setIsOpen(false)
    }
  }, [state, isMobile])

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        if (state === 'collapsed') {
          setOpen(true)
        }
        setTimeout(() => {
          inputRef.current?.focus()
          setIsOpen(true)
          updatePosition()
        }, 50)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [state, setOpen, updatePosition])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (!isOpen) {
        setIsOpen(true)
        return
      }
      setSelectedIndex((prev) =>
        prev < flattenedResults.length - 1 ? prev + 1 : 0,
      )
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (!isOpen) {
        setIsOpen(true)
        return
      }
      setSelectedIndex((prev) =>
        prev > 0 ? prev - 1 : flattenedResults.length - 1,
      )
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (flattenedResults.length > 0) {
        const target = flattenedResults[selectedIndex] || flattenedResults[0]
        target.action()
      }
    } else if (e.key === 'Escape') {
      e.preventDefault()
      setIsOpen(false)
      inputRef.current?.blur()
    }
  }

  return (
    <div ref={triggerRef} className="relative w-full">
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault()
          if (flattenedResults.length > 0) {
            const target =
              flattenedResults[selectedIndex] || flattenedResults[0]
            target.action()
          }
        }}
        className="relative w-full"
      >
        <label htmlFor="sidebar-data-search" className="sr-only">
          Search Data
        </label>
        <SidebarInput
          ref={inputRef}
          id="sidebar-data-search"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            if (!isOpen) setIsOpen(true)
          }}
          onFocus={() => {
            setIsOpen(true)
            updatePosition()
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search data..."
          className="pl-8 pr-12 text-xs h-9 bg-background/60 dark:bg-background/40 border-sidebar-border focus-visible:ring-1 focus-visible:ring-primary/40 rounded-md"
        />
        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 select-none text-muted-foreground" />
        {searchQuery ? (
          <button
            type="button"
            onClick={() => {
              setSearchQuery('')
              inputRef.current?.focus()
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
            aria-label="Clear search"
          >
            <X className="size-3" />
          </button>
        ) : (
          <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded border border-sidebar-border bg-background/50 font-mono text-[9px] text-muted-foreground select-none">
            ⌘K
          </kbd>
        )}
      </form>

      {mounted &&
        typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <motion.div
                ref={dropdownRef}
                initial={{ opacity: 0, scale: 0.96, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -4 }}
                transition={{ duration: 0.16, ease: 'easeOut' }}
                style={{
                  position: 'fixed',
                  top: coords.top,
                  left: coords.left,
                  width: coords.width,
                  zIndex: 70,
                }}
                className="rounded-xl border border-border bg-card shadow-2xl overflow-hidden backdrop-blur-md flex flex-col max-h-[440px]"
              >
                <div className="px-3.5 py-2.5 border-b border-border bg-muted/40 flex items-center justify-between">
                  <span className="font-semibold text-xs text-foreground">
                    {trimmedQuery ? 'Search Results' : 'Quick Data Search'}
                  </span>
                  {trimmedQuery ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/15 text-foreground border border-primary/30">
                      {totalMatches} found
                    </span>
                  ) : (
                    <span className="text-[10px] text-muted-foreground">
                      Finly Records
                    </span>
                  )}
                </div>

                <div className="overflow-y-auto no-scrollbar p-1.5 space-y-2 divide-y divide-border/40">
                  {!trimmedQuery ? (
                    <div className="p-1 space-y-1">
                      <p className="px-2 py-1 text-[11px] font-medium text-muted-foreground">
                        Jump directly to records:
                      </p>
                      {flattenedResults.map((item, idx) => {
                        const isSelected = selectedIndex === idx
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={item.action}
                            onMouseEnter={() => setSelectedIndex(idx)}
                            className={cn(
                              'w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors cursor-pointer text-xs',
                              isSelected
                                ? 'bg-accent text-accent-foreground font-semibold'
                                : 'text-foreground hover:bg-accent/50',
                            )}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span className="flex items-center justify-center size-6 rounded-md bg-primary/10 text-foreground shrink-0">
                                {item.id === 'quick-invoices' && (
                                  <FileText className="size-3.5" />
                                )}
                                {item.id === 'quick-cashbook' && (
                                  <Wallet className="size-3.5" />
                                )}
                                {item.id === 'quick-customers' && (
                                  <Users className="size-3.5" />
                                )}
                                {item.id === 'quick-items' && (
                                  <Package className="size-3.5" />
                                )}
                              </span>
                              <div className="truncate">
                                <p className="truncate font-medium">
                                  {item.title}
                                </p>
                                <p className="text-[10px] text-muted-foreground truncate">
                                  {item.subtitle}
                                </p>
                              </div>
                            </div>
                            <ArrowRight className="size-3.5 text-muted-foreground shrink-0" />
                          </button>
                        )
                      })}
                    </div>
                  ) : totalMatches === 0 ? (
                    <div className="py-8 px-4 text-center">
                      <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground mb-2.5">
                        <Search className="h-4 w-4" />
                      </div>
                      <p className="text-xs font-bold text-foreground">
                        No matching data
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-1 max-w-[280px] mx-auto">
                        No invoices, transactions, clients, or items match
                        &ldquo;
                        {searchQuery}&rdquo;.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {matchedInvoices.length > 0 && (
                        <div className="space-y-1">
                          <div className="px-2 pt-1 pb-0.5 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                            <span className="flex items-center gap-1.5">
                              <FileText className="size-3" />
                              Invoices ({matchedInvoices.length})
                            </span>
                            {matchedInvoices.length > 3 && (
                              <button
                                type="button"
                                onClick={() => {
                                  navigate({ to: '/invoices' })
                                  setIsOpen(false)
                                  setSearchQuery('')
                                }}
                                className="hover:text-foreground cursor-pointer"
                              >
                                View all
                              </button>
                            )}
                          </div>
                          {matchedInvoices.slice(0, 3).map((inv) => {
                            const flatIdx = flattenedResults.findIndex(
                              (r) => r.id === `inv-${inv.id}`,
                            )
                            const isSelected = selectedIndex === flatIdx
                            return (
                              <button
                                key={inv.id}
                                type="button"
                                onClick={() => {
                                  navigate({
                                    to: '/invoices/$id',
                                    params: { id: inv.id },
                                  })
                                  setIsOpen(false)
                                  setSearchQuery('')
                                }}
                                onMouseEnter={() => setSelectedIndex(flatIdx)}
                                className={cn(
                                  'w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors cursor-pointer text-xs',
                                  isSelected
                                    ? 'bg-accent text-accent-foreground font-semibold'
                                    : 'text-foreground hover:bg-accent/50',
                                )}
                              >
                                <div className="truncate min-w-0 pr-2">
                                  <p className="truncate font-semibold text-foreground">
                                    {inv.id}
                                    <span className="font-normal text-muted-foreground ml-1.5">
                                      {inv.client}
                                    </span>
                                  </p>
                                  <p className="text-[10px] text-muted-foreground">
                                    {inv.date}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                  <span
                                    className={cn(
                                      'text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase',
                                      inv.status === 'paid'
                                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                                        : inv.status === 'unpaid'
                                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                                          : 'bg-muted text-muted-foreground border-border',
                                    )}
                                  >
                                    {inv.status}
                                  </span>
                                  <span className="font-mono font-bold text-xs text-foreground">
                                    {formatAmount(inv.amount)}
                                  </span>
                                </div>
                              </button>
                            )
                          })}
                        </div>
                      )}

                      {matchedTransactions.length > 0 && (
                        <div className="space-y-1 pt-1">
                          <div className="px-2 pt-1 pb-0.5 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                            <span className="flex items-center gap-1.5">
                              <Wallet className="size-3" />
                              Transactions ({matchedTransactions.length})
                            </span>
                            {matchedTransactions.length > 3 && (
                              <button
                                type="button"
                                onClick={() => {
                                  navigate({ to: '/cashbook' })
                                  setIsOpen(false)
                                  setSearchQuery('')
                                }}
                                className="hover:text-foreground cursor-pointer"
                              >
                                View all
                              </button>
                            )}
                          </div>
                          {matchedTransactions.slice(0, 3).map((tx) => {
                            const flatIdx = flattenedResults.findIndex(
                              (r) => r.id === `tx-${tx.id}`,
                            )
                            const isSelected = selectedIndex === flatIdx
                            return (
                              <button
                                key={tx.id}
                                type="button"
                                onClick={() => {
                                  navigate({ to: '/cashbook' })
                                  setIsOpen(false)
                                  setSearchQuery('')
                                }}
                                onMouseEnter={() => setSelectedIndex(flatIdx)}
                                className={cn(
                                  'w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors cursor-pointer text-xs',
                                  isSelected
                                    ? 'bg-accent text-accent-foreground font-semibold'
                                    : 'text-foreground hover:bg-accent/50',
                                )}
                              >
                                <div className="truncate min-w-0 pr-2">
                                  <p className="truncate font-semibold text-foreground">
                                    {tx.desc}
                                  </p>
                                  <p className="text-[10px] text-muted-foreground truncate">
                                    {tx.category} • {tx.date}
                                  </p>
                                </div>
                                <span
                                  className={cn(
                                    'font-mono font-bold text-xs shrink-0',
                                    tx.type === 'income'
                                      ? 'text-emerald-600 dark:text-emerald-400'
                                      : 'text-foreground',
                                  )}
                                >
                                  {tx.type === 'income'
                                    ? `+${formatAmount(tx.amount)}`
                                    : `-${formatAmount(tx.amount)}`}
                                </span>
                              </button>
                            )
                          })}
                        </div>
                      )}

                      {matchedCustomers.length > 0 && (
                        <div className="space-y-1 pt-1">
                          <div className="px-2 pt-1 pb-0.5 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                            <span className="flex items-center gap-1.5">
                              <Users className="size-3" />
                              Customers ({matchedCustomers.length})
                            </span>
                            {matchedCustomers.length > 3 && (
                              <button
                                type="button"
                                onClick={() => {
                                  navigate({ to: '/customers' })
                                  setIsOpen(false)
                                  setSearchQuery('')
                                }}
                                className="hover:text-foreground cursor-pointer"
                              >
                                View all
                              </button>
                            )}
                          </div>
                          {matchedCustomers.slice(0, 3).map((c) => {
                            const flatIdx = flattenedResults.findIndex(
                              (r) => r.id === `cust-${c.id}`,
                            )
                            const isSelected = selectedIndex === flatIdx
                            return (
                              <button
                                key={c.id}
                                type="button"
                                onClick={() => {
                                  navigate({ to: '/customers' })
                                  setIsOpen(false)
                                  setSearchQuery('')
                                }}
                                onMouseEnter={() => setSelectedIndex(flatIdx)}
                                className={cn(
                                  'w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors cursor-pointer text-xs',
                                  isSelected
                                    ? 'bg-accent text-accent-foreground font-semibold'
                                    : 'text-foreground hover:bg-accent/50',
                                )}
                              >
                                <div className="truncate min-w-0 pr-2">
                                  <p className="truncate font-semibold text-foreground">
                                    {c.name}
                                  </p>
                                  <p className="text-[10px] text-muted-foreground truncate">
                                    {c.email}
                                  </p>
                                </div>
                                <span className="text-[11px] font-mono text-muted-foreground shrink-0">
                                  {formatAmount(c.spent)}
                                </span>
                              </button>
                            )
                          })}
                        </div>
                      )}

                      {matchedItems.length > 0 && (
                        <div className="space-y-1 pt-1">
                          <div className="px-2 pt-1 pb-0.5 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                            <span className="flex items-center gap-1.5">
                              <Package className="size-3" />
                              Catalog Items ({matchedItems.length})
                            </span>
                            {matchedItems.length > 3 && (
                              <button
                                type="button"
                                onClick={() => {
                                  navigate({ to: '/items' })
                                  setIsOpen(false)
                                  setSearchQuery('')
                                }}
                                className="hover:text-foreground cursor-pointer"
                              >
                                View all
                              </button>
                            )}
                          </div>
                          {matchedItems.slice(0, 3).map((item) => {
                            const flatIdx = flattenedResults.findIndex(
                              (r) => r.id === `item-${item.id}`,
                            )
                            const isSelected = selectedIndex === flatIdx
                            return (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => {
                                  navigate({ to: '/items' })
                                  setIsOpen(false)
                                  setSearchQuery('')
                                }}
                                onMouseEnter={() => setSelectedIndex(flatIdx)}
                                className={cn(
                                  'w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors cursor-pointer text-xs',
                                  isSelected
                                    ? 'bg-accent text-accent-foreground font-semibold'
                                    : 'text-foreground hover:bg-accent/50',
                                )}
                              >
                                <div className="truncate min-w-0 pr-2">
                                  <p className="truncate font-semibold text-foreground">
                                    {item.name}
                                  </p>
                                  <p className="text-[10px] text-muted-foreground">
                                    Per {item.unit}
                                  </p>
                                </div>
                                <span className="font-mono font-bold text-xs text-foreground shrink-0">
                                  {formatAmount(item.price)}
                                </span>
                              </button>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="px-3 py-2 border-t border-border bg-muted/20 flex items-center justify-between text-[10px] text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1">
                      <kbd className="px-1 py-0.5 rounded bg-muted border border-border font-mono text-[9px]">
                        ↑↓
                      </kbd>
                      navigate
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <kbd className="px-1 py-0.5 rounded bg-muted border border-border font-mono text-[9px]">
                        ↵
                      </kbd>
                      select
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1">
                    <kbd className="px-1 py-0.5 rounded bg-muted border border-border font-mono text-[9px]">
                      esc
                    </kbd>
                    close
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </div>
  )
}
