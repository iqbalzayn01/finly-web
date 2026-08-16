import { Link, useLocation } from '@tanstack/react-router'
import {
  Bell,
  Settings as SettingsIcon,
  User,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  Wallet,
  FileText,
  Users,
  Package,
  Menu,
  X,
  Sparkles,
} from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { useState, useRef, useEffect } from 'react'
import { ThemeToggle } from '../ThemeToggle'
import { V2Tooltip } from '../ui/v2-tooltip'
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar'
import { cn } from '../../lib/utils'
import { useSubscription } from '../../lib/subscription'

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/dashboard' },
  { icon: Wallet, label: 'Cashbook', to: '/cashbook' },
  { icon: FileText, label: 'Invoices', to: '/invoices' },
  { icon: Users, label: 'Customers', to: '/customers' },
  { icon: Package, label: 'Catalog', to: '/items' },
  { icon: SettingsIcon, label: 'Settings', to: '/settings' },
]

export function Topbar() {
  const location = useLocation()
  const { isPro } = useSubscription()
  const [notifOpen, setNotifOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  const notifRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close popovers on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false)
      }
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Auto-close mobile nav on route change
  useEffect(() => {
    setMobileNavOpen(false)
  }, [location.pathname])

  return (
    <header className="sticky top-0 z-40 flex h-18 w-full border-b border-border bg-card/80 backdrop-blur-md transition-all shadow-none">
      <div className="grid grid-cols-2 lg:grid-cols-[1fr_auto_1fr] items-center h-full w-full max-w-[1920px] mx-auto px-4 md:px-8 gap-4">
        {/* Left Section: Brand Logo, Mobile Toggle & Pro Badge / Upgrade Button */}
        <div className="flex items-center justify-start gap-3 sm:gap-4">
          {/* Mobile Navigation Toggle Button */}
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="lg:hidden flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-foreground shadow-none hover:bg-accent transition-colors outline-none cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          {/* Brand Header Logo */}
          <Link to="/dashboard" className="flex items-center gap-3 group outline-none">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground font-black text-lg shadow-none">
              F
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base tracking-tight text-foreground leading-tight">
                Finly
              </span>
              <span className="text-[10px] font-semibold text-muted-foreground leading-tight hidden sm:block">
                B2B Cashflow OS
              </span>
            </div>
          </Link>

          {/* Pro Badge (shown when user upgrades to Pro) or Upgrade to Pro Button */}
          {isPro ? (
            <Link
              to="/pricing"
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-gradient-to-r from-primary via-indigo-500 to-primary text-primary-foreground shadow-none ring-1 ring-primary/30 uppercase tracking-widest ml-1 cursor-pointer hover:opacity-90 transition-opacity"
              title="Active Subscription: Pro Plan"
            >
              <Sparkles className="h-3 w-3 fill-current" />
              <span>PRO</span>
            </Link>
          ) : (
            <Link
              to="/pricing"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-primary text-primary-foreground shadow-none hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer ml-1"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Upgrade to Pro</span>
            </Link>
          )}
        </div>

        {/* Center Section: Perfectly Centered Primary Navigation Links (Desktop) */}
        <div className="hidden lg:flex items-center justify-center">
          <nav className="flex items-center gap-1.5 bg-muted/50 p-1.5 rounded-2xl border border-border">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon
              const isActive =
                location.pathname === item.to ||
                (item.to !== '/dashboard' && location.pathname.startsWith(item.to))

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    'flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs transition-all cursor-pointer outline-none',
                    isActive
                      ? 'bg-primary text-primary-foreground font-extrabold border border-primary/30 shadow-none ring-2 ring-primary/20'
                      : 'text-muted-foreground font-semibold hover:text-foreground hover:bg-accent/60'
                  )}
                >
                  <Icon className={cn('h-4 w-4', isActive ? 'text-primary-foreground' : 'text-muted-foreground')} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Right Section: Theme Toggle, Notifications, Account Profile */}
        <div className="flex items-center justify-end gap-3">
          {/* Theme Switcher Toggle */}
          <ThemeToggle />

          {/* Notifications Dropdown */}
          <div ref={notifRef} className="relative">
            <V2Tooltip content="Notifications">
              <button
                onClick={() => {
                  setNotifOpen(!notifOpen)
                  if (menuOpen) setMenuOpen(false)
                }}
                className="relative flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-none hover:border-primary/50 hover:bg-accent/40 transition-colors outline-none cursor-pointer"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary ring-2 ring-card" />
              </button>
            </V2Tooltip>

            <AnimatePresence>
              {notifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 450, damping: 28 }}
                  className="absolute right-0 mt-3 w-80 bg-card border border-border rounded-2xl shadow-none z-50 flex flex-col overflow-hidden"
                >
                  <div className="px-5 py-3.5 border-b border-border flex items-center justify-between bg-muted/40">
                    <h3 className="font-semibold text-foreground text-sm">
                      Notifications
                    </h3>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                      2 Unread
                    </span>
                  </div>

                  <div className="divide-y divide-border max-h-80 overflow-y-auto">
                    <div className="p-4 hover:bg-accent/30 transition-colors cursor-pointer space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-foreground">
                          Invoice #INV-2026-004 Paid
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          10m ago
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        Acme Corp completed payment of $4,500.00 via wire transfer.
                      </p>
                    </div>

                    <div className="p-4 hover:bg-accent/30 transition-colors cursor-pointer space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-foreground">
                          Overdue Alert: Client Billing
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          2h ago
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        Invoice #INV-2026-002 is past due date by 3 days.
                      </p>
                    </div>
                  </div>

                  <div className="p-3 border-t border-border bg-muted/20 text-center">
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

          {/* User Account Profile Menu */}
          <div ref={menuRef} className="relative">
            <button
              onClick={() => {
                setMenuOpen(!menuOpen)
                if (notifOpen) setNotifOpen(false)
              }}
              className="flex items-center gap-2.5 p-1 pl-1.5 pr-2.5 rounded-full border border-border bg-card text-foreground shadow-none hover:bg-accent/50 transition-colors outline-none cursor-pointer"
            >
              <Avatar className="h-8 w-8 border border-border">
                <AvatarImage src="" alt="User Avatar" />
                <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                  IZ
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-bold leading-tight text-foreground">
                  Iqbal Zayn
                </span>
                <span className="text-[10px] font-medium text-muted-foreground leading-tight">
                  Owner
                </span>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground ml-0.5" />
            </button>

            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 450, damping: 28 }}
                  className="absolute right-0 mt-3 w-60 bg-card border border-border rounded-2xl shadow-none z-50 p-2 space-y-1"
                >
                  <div className="px-3 py-2 border-b border-border mb-1">
                    <p className="text-xs font-bold text-foreground">
                      Iqbal Zayn
                    </p>
                    <p className="text-[11px] text-muted-foreground truncate">
                      iqbal@finly.io
                    </p>
                  </div>

                  {/* Upgrade to Pro or Active Pro Subscription Menu Item */}
                  {isPro ? (
                    <Link
                      to="/pricing"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-between px-3 py-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 rounded-xl hover:bg-emerald-500/20 border border-emerald-500/20 transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-emerald-500" /> Pro Subscription
                      </span>
                      <span className="text-[10px] font-extrabold bg-emerald-500 text-white px-1.5 py-0.5 rounded-full">
                        ACTIVE
                      </span>
                    </Link>
                  ) : (
                    <Link
                      to="/pricing"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-between px-3 py-2 text-xs font-bold text-primary bg-primary/10 rounded-xl hover:bg-primary/20 border border-primary/20 transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-primary" /> Upgrade to Pro
                      </span>
                      <span className="text-[10px] font-extrabold bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full">
                        PRO
                      </span>
                    </Link>
                  )}

                  <Link
                    to="/account"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-foreground rounded-xl hover:bg-accent transition-colors"
                  >
                    <User className="h-4 w-4 text-muted-foreground" /> Account Profile
                  </Link>

                  <Link
                    to="/settings"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-foreground rounded-xl hover:bg-accent transition-colors"
                  >
                    <SettingsIcon className="h-4 w-4 text-muted-foreground" /> Settings
                  </Link>

                  <div className="border-t border-border pt-1 mt-1">
                    <button
                      onClick={() => {
                        setMenuOpen(false)
                        alert('Logged out successfully.')
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-destructive rounded-xl hover:bg-destructive/10 transition-colors cursor-pointer"
                    >
                      <LogOut className="h-4 w-4" /> Sign out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown Menu */}
      <AnimatePresence>
        {mobileNavOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.2, 0, 0, 1] }}
            className="lg:hidden absolute top-full left-0 w-full bg-card border-b border-border shadow-none overflow-hidden"
          >
            <nav className="p-4 space-y-1.5">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon
                const isActive =
                  location.pathname === item.to ||
                  (item.to !== '/dashboard' && location.pathname.startsWith(item.to))

                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileNavOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all',
                      isActive
                        ? 'bg-primary text-primary-foreground font-extrabold border border-primary/30 shadow-none ring-2 ring-primary/20'
                        : 'text-foreground hover:bg-accent font-medium'
                    )}
                  >
                    <Icon className={cn('h-5 w-5', isActive ? 'text-primary-foreground' : 'text-muted-foreground')} />
                    <span>{item.label}</span>
                  </Link>
                )
              })}

              {/* Mobile Upgrade to Pro Button or Active Pro Badge */}
              <div className="pt-2 border-t border-border mt-2">
                {isPro ? (
                  <Link
                    to="/pricing"
                    onClick={() => setMobileNavOpen(false)}
                    className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 transition-all shadow-none"
                  >
                    <span className="flex items-center gap-2.5">
                      <Sparkles className="h-4 w-4 text-emerald-500" /> Pro Subscription Active
                    </span>
                    <span className="text-xs bg-emerald-500 text-white px-2 py-0.5 rounded-full font-extrabold">
                      ACTIVE
                    </span>
                  </Link>
                ) : (
                  <Link
                    to="/pricing"
                    onClick={() => setMobileNavOpen(false)}
                    className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold bg-primary text-primary-foreground transition-all shadow-none"
                  >
                    <span className="flex items-center gap-2.5">
                      <Sparkles className="h-4 w-4" /> Upgrade to Pro
                    </span>
                    <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full font-extrabold">
                      PRO
                    </span>
                  </Link>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
