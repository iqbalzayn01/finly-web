import * as React from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import { Bell, Sparkles } from '../ui/icon'
import { motion, AnimatePresence } from 'motion/react'
import { ThemeToggle } from '../ThemeToggle'
import { TooltipSimple } from '../ui/tooltip'
import { useSubscription } from '../../lib/subscription'
import { SidebarTrigger } from '../ui/sidebar'
import { Separator } from '../ui/separator'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../ui/breadcrumb'

function getBreadcrumbInfo(pathname: string): {
  section: string
  page: string
} {
  if (pathname === '/dashboard')
    return { section: 'Finly OS', page: 'Dashboard' }
  if (pathname === '/cashbook') return { section: 'Ledger', page: 'Cashbook' }
  if (pathname === '/invoices/builder')
    return { section: 'Invoicing', page: 'Create Invoice' }
  if (pathname.startsWith('/invoices'))
    return { section: 'Invoicing', page: 'Invoice Directory' }
  if (pathname === '/customers') return { section: 'CRM', page: 'Customers' }
  if (pathname === '/items')
    return { section: 'Inventory', page: 'Catalog Items' }
  if (pathname === '/settings')
    return { section: 'Management', page: 'Settings' }
  if (pathname === '/account')
    return { section: 'User', page: 'Account Profile' }
  if (pathname === '/pricing')
    return { section: 'Finly', page: 'Plans & Pricing' }
  return { section: 'Finly OS', page: 'Overview' }
}

export function Topbar() {
  const location = useLocation()
  const { isPro } = useSubscription()
  const [notifOpen, setNotifOpen] = React.useState(false)
  const notifRef = React.useRef<HTMLDivElement>(null)

  const { section, page } = getBreadcrumbInfo(location.pathname)

  // Close notifications dropdown on click outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notifRef.current &&
        !notifRef.current.contains(event.target as Node)
      ) {
        setNotifOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-14 border-b border-border bg-card/60 backdrop-blur-md px-4 sm:px-6 sticky top-0 z-20">
      {/* Left: Sidebar Trigger & Dynamic Breadcrumbs */}
      <div className="flex items-center gap-2 min-w-0">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden sm:block">
              <BreadcrumbLink href="/dashboard" className="text-xs font-medium">
                {section}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden sm:block" />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-xs font-bold truncate">
                {page}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Right Section: Pro Upgrade / Active status, ThemeToggle, Notifications */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Pro Plan Indicator */}
        {isPro ? (
          <Link
            to="/pricing"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all cursor-pointer shadow-none"
          >
            <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
            <span>Pro Plan Active</span>
          </Link>
        ) : (
          <Link
            to="/pricing"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all cursor-pointer shadow-none"
          >
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>Upgrade to Pro</span>
          </Link>
        )}

        {/* Theme Switcher Toggle */}
        <ThemeToggle />

        {/* Notifications Popover */}
        <div ref={notifRef} className="relative">
          <TooltipSimple content="Notifications">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-foreground hover:bg-accent hover:border-primary/40 transition-colors outline-none cursor-pointer"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary ring-2 ring-card" />
            </button>
          </TooltipSimple>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 450, damping: 28 }}
                className="absolute right-0 mt-2.5 w-80 bg-card border border-border rounded-2xl shadow-xl z-50 flex flex-col overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-muted/40">
                  <h3 className="font-bold text-foreground text-xs">
                    Notifications
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                    2 Unread
                  </span>
                </div>

                <div className="divide-y divide-border max-h-80 overflow-y-auto">
                  <div className="p-3.5 hover:bg-accent/30 transition-colors cursor-pointer space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-foreground">
                        Invoice #INV-2026-004 Paid
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        10m ago
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground line-clamp-2">
                      Acme Corp completed payment of $4,500.00 via wire
                      transfer.
                    </p>
                  </div>

                  <div className="p-3.5 hover:bg-accent/30 transition-colors cursor-pointer space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-foreground">
                        Overdue Alert: Client Billing
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        2h ago
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground line-clamp-2">
                      Invoice #INV-2026-002 is past due date by 3 days.
                    </p>
                  </div>
                </div>

                <div className="p-2.5 border-t border-border bg-muted/20 text-center">
                  <button
                    onClick={() => setNotifOpen(false)}
                    className="text-xs font-semibold text-primary hover:underline cursor-pointer"
                  >
                    Mark all as read
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}
