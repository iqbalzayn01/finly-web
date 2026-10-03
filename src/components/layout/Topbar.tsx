import * as React from 'react'
import { cn } from '#/lib'
import {
  Bell,
  Records,
  Sparkles,
  LayoutDashboard,
  Wallet,
  ReceiptLong,
  Users,
} from '../ui/icon'
import { motion, AnimatePresence } from 'motion/react'
import { ThemeToggle } from '../ThemeToggle'
import { TooltipSimple } from '../ui/tooltip'
import { useSubscription } from '../../lib/subscription'
import { FinlyLogo } from './logo'
import { SearchInput } from './search-input'
import notificationsData from '../../data/notifications.json'
import teamsData from '../../data/teams.json'
import { NavUser } from './nav-user'
import { NavMain } from './nav-main'
import type { UserProfile } from './nav-user'
import type { NavigationItem } from './nav-main'

const finlyNavigationItems: NavigationItem[] = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Records',
    url: '/records',
    icon: Records,
  },
  {
    title: 'Invoices',
    url: '/invoices',
    icon: ReceiptLong,
  },
  {
    title: 'Customers',
    url: '/customers',
    icon: Users,
  },
]

export function Topbar({
  user = teamsData.currentUser,
}: {
  user?: UserProfile
} = {}) {
  const { isPro } = useSubscription()
  const [notifOpen, setNotifOpen] = React.useState(false)
  const notifRef = React.useRef<HTMLDivElement>(null)

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
    <header className="flex h-14 sm:h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-14 bg-card/60 backdrop-blur-md px-3 sm:px-6 sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <FinlyLogo className="text-primary" />
          <span className="truncate text-xl font-semibold">Finly</span>
        </div>

        <SearchInput />
      </div>

      <NavMain items={finlyNavigationItems} />

      <div className="flex items-center gap-2 sm:gap-3">
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
                        notif.unread && 'bg-primary/3',
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
