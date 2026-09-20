import * as React from 'react'
import { cn } from '#/lib'
import { Link, useLocation } from '@tanstack/react-router'
import { Bell, Sparkles } from '../ui/icon'
import { motion, AnimatePresence } from 'motion/react'
import { ThemeToggle } from '../ThemeToggle'
import { TooltipSimple } from '../ui/tooltip'
import { useSubscription } from '../../lib/subscription'
import { SidebarTrigger } from '../ui/sidebar'
import { Separator } from '../ui/separator'
import notificationsData from '../../data/notifications.json'
import teamsData from '../../data/teams.json'
import { NavUser } from './nav-user'
import type { UserProfile } from './nav-user'
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

export function Topbar({
  user = teamsData.currentUser,
}: {
  user?: UserProfile
} = {}) {
  const location = useLocation()
  const { isPro } = useSubscription()
  const [notifOpen, setNotifOpen] = React.useState(false)
  const notifRef = React.useRef<HTMLDivElement>(null)

  const { section, page } = getBreadcrumbInfo(location.pathname)

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
    <header className="flex h-14 sm:h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-14 border-b border-border bg-card/60 backdrop-blur-md px-3 sm:px-6 sticky top-0 z-20">
      <div className="flex items-center gap-2 min-w-0">
        <SidebarTrigger className="-ml-1 h-9 w-9" />
        <Separator
          orientation="vertical"
          className="mr-1 sm:mr-2 data-[orientation=vertical]:h-4"
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
              <BreadcrumbPage className="text-xs font-bold truncate max-w-[130px] sm:max-w-none">
                {page}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {isPro ? (
          <>
            <Link
              to="/pricing"
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all cursor-pointer shadow-none"
            >
              <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
              <span>Pro Plan Active</span>
            </Link>
            <Link
              to="/pricing"
              className="sm:hidden flex items-center justify-center h-9 w-9 rounded-md border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              aria-label="Pro Plan Active"
            >
              <Sparkles className="h-4 w-4" />
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/pricing"
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-bold bg-primary/15 text-foreground border border-primary/30 hover:bg-primary/25 transition-all cursor-pointer shadow-none"
            >
              <Sparkles className="h-3.5 w-3.5 text-foreground" />
              <span>Upgrade to Pro</span>
            </Link>
            <Link
              to="/pricing"
              className="sm:hidden flex items-center justify-center h-9 w-9 rounded-md border border-primary/20 bg-primary/10 text-primary"
              aria-label="Upgrade to Pro"
            >
              <Sparkles className="h-4 w-4" />
            </Link>
          </>
        )}

        <ThemeToggle />

        <div ref={notifRef} className="relative">
          {notifOpen ? (
            <button
              onClick={() => setNotifOpen(false)}
              className="relative flex h-9 w-9 items-center justify-center rounded-md border border-primary bg-primary/10 text-primary transition-colors outline-none cursor-pointer"
              aria-label="Close Notifications"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary ring-2 ring-card" />
            </button>
          ) : (
            <TooltipSimple content="Notifications">
              <button
                onClick={() => setNotifOpen(true)}
                className="relative flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card text-foreground hover:bg-accent hover:border-primary/40 transition-colors outline-none cursor-pointer"
                aria-label="Open Notifications"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary ring-2 ring-card" />
              </button>
            </TooltipSimple>
          )}

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.96 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                style={{ transformOrigin: 'top right' }}
                className="absolute right-0 mt-2.5 w-[calc(100vw-1.5rem)] max-w-sm sm:w-80 bg-card border border-border rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-muted/40">
                  <h3 className="font-bold text-foreground text-xs">
                    Notifications
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/15 text-foreground border border-primary/30">
                    {notificationsData.filter((n) => n.unread).length} Unread
                  </span>
                </div>

                <div className="divide-y divide-border max-h-80 overflow-y-auto">
                  {notificationsData.map((notif) => (
                    <div
                      key={notif.id}
                      className={cn(
                        'p-3.5 hover:bg-accent/30 transition-colors cursor-pointer space-y-1',
                        notif.unread && 'bg-primary/[0.03]',
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          {notif.indicator === 'primary' && (
                            <span className="size-1.5 rounded-full bg-primary shrink-0" />
                          )}
                          {notif.indicator === 'amber' && (
                            <span className="size-1.5 rounded-full bg-amber-500 shrink-0" />
                          )}
                          <span
                            className={cn(
                              'font-bold text-xs text-foreground',
                              !notif.indicator && 'pl-3',
                            )}
                          >
                            {notif.title}
                          </span>
                        </div>
                        <span className="text-[10px] text-muted-foreground">
                          {notif.time}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground line-clamp-2 pl-3">
                        {notif.description}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="p-2.5 border-t border-border bg-muted/20 text-center">
                  <button
                    onClick={() => setNotifOpen(false)}
                    className="text-xs font-semibold text-foreground hover:underline cursor-pointer"
                  >
                    Mark all as read
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <NavUser user={user} variant="topbar" />
      </div>
    </header>
  )
}
