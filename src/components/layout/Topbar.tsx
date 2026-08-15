import { Link, useLocation } from '@tanstack/react-router'
import {
  Bell,
  PanelLeft,
  Settings as SettingsIcon,
  User,
  LogOut,
  ChevronDown,
} from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { useState, useRef, useEffect } from 'react'
import { ThemeToggle } from '../ThemeToggle'
import { V2Tooltip } from '../ui/v2-tooltip'
import { useSidebarStore } from './Sidebar'
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar'

// Map of active page titles & subtitles
const PAGE_TITLES: Record<string, { title: string; subtitle: string } | undefined> = {
  '/': {
    title: 'Dashboard',
    subtitle: 'Real-time cashflow management & financial health forecasting',
  },
  '/cashbook': {
    title: 'Cashbook',
    subtitle: 'Track business income, expenses, and digital receipts',
  },
  '/invoices': {
    title: 'Invoices',
    subtitle: 'Create, approve, and send automated client invoices',
  },
  '/invoices/builder': {
    title: 'Invoice Builder',
    subtitle: 'Compose professional multi-currency invoices',
  },
  '/customers': {
    title: 'Customers',
    subtitle: 'Manage client profiles, billing addresses, and payment terms',
  },
  '/items': {
    title: 'Items & Catalog',
    subtitle: 'Manage product items, services, and default tax rates',
  },
  '/pricing': {
    title: 'Finly Pro Pricing',
    subtitle: 'Flexible plans for modern agencies and consultants',
  },
  '/settings': {
    title: 'Workspace Settings',
    subtitle: 'Manage business profile, defaults, and AI Agent connections',
  },
}

export function Topbar() {
  const location = useLocation()
  const { toggleMobile } = useSidebarStore()
  const [notifOpen, setNotifOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

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

  // Resolve current title & subtitle
  const currentRouteInfo =
    PAGE_TITLES[location.pathname] ?? {
      title: 'Workspace',
      subtitle: 'B2B Cashflow Operating System',
    }

  return (
    <header className="sticky top-0 z-30 flex h-18 w-full items-center justify-between border-b border-border bg-card/80 px-6 md:px-8 backdrop-blur-md transition-all shadow-xs">
      {/* Left Section: Active Page Title & Subtitle */}
      <div className="flex items-center gap-4">
        {/* Mobile Hamburger Toggle */}
        <button
          onClick={toggleMobile}
          className="lg:hidden flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-foreground shadow-xs hover:bg-accent transition-all outline-none cursor-pointer"
          aria-label="Toggle Sidebar"
        >
          <PanelLeft className="h-5 w-5" />
        </button>

          <div className="flex flex-col justify-center">
            <h1 className="text-lg md:text-xl font-bold tracking-tight text-foreground leading-tight">
              {currentRouteInfo.title}
            </h1>
            <p className="text-xs text-muted-foreground font-medium hidden sm:block">
              {currentRouteInfo.subtitle}
            </p>
          </div>
        </div>

        {/* Right Section: Theme Toggle, Notifications, Account Profile */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle Button */}
          <ThemeToggle />

        {/* Notifications Dropdown */}
        <div ref={notifRef} className="relative">
          <V2Tooltip content="Notifications">
            <button
              onClick={() => {
                setNotifOpen(!notifOpen)
                if (menuOpen) setMenuOpen(false)
              }}
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-xs hover:border-primary/50 hover:bg-accent/40 transition-all outline-none cursor-pointer"
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
                className="absolute right-0 mt-3 w-80 bg-card border border-border rounded-2xl shadow-xl z-50 flex flex-col overflow-hidden"
              >
                <div className="px-5 py-3.5 border-b border-border flex items-center justify-between bg-muted/40">
                  <h3 className="font-semibold text-foreground text-sm">
                    Notifications
                  </h3>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                    2 New
                  </span>
                </div>
                <div className="divide-y divide-border max-h-72 overflow-y-auto">
                  <div className="p-3.5 hover:bg-accent/30 transition-all cursor-pointer">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-foreground">
                        Invoice #INV-2026-004 Paid
                      </p>
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    </div>
                    <p className="text-xs font-normal text-muted-foreground mt-1">
                      Acme Corp paid $5,400.00 via Bank Transfer
                    </p>
                    <p className="text-xs font-medium text-primary mt-2">
                      10 mins ago
                    </p>
                  </div>
                  <div className="p-3.5 hover:bg-accent/30 transition-all cursor-pointer">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-foreground">
                        New Member Added
                      </p>
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    </div>
                    <p className="text-xs font-normal text-muted-foreground mt-1">
                      Sarah joined as Editor
                    </p>
                    <p className="text-xs font-medium text-primary mt-2">
                      2 hours ago
                    </p>
                  </div>
                </div>
                <div className="p-2 border-t border-border">
                  <button
                    onClick={() => {
                      alert('All notifications marked as read')
                      setNotifOpen(false)
                    }}
                    className="w-full py-2 text-center text-xs font-bold text-primary hover:bg-accent/50 rounded-xl transition-all"
                  >
                    Mark all as read
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Account Profile Avatar Dropdown */}
        <div ref={menuRef} className="relative">
          <button
            onClick={() => {
              setMenuOpen(!menuOpen)
              if (notifOpen) setNotifOpen(false)
            }}
            className="flex items-center gap-2 rounded-full border border-border bg-card p-1 pr-2.5 shadow-xs hover:border-primary/50 transition-all outline-none cursor-pointer"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://github.com/shadcn.png" alt="Avatar" />
              <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary">
                IZ
              </AvatarFallback>
            </Avatar>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-foreground leading-tight">
                M. Iqbal Zayn
              </span>
              <span className="text-[10px] font-semibold text-muted-foreground">
                Owner
              </span>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground hidden sm:block" />
          </button>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 450, damping: 28 }}
                className="absolute right-0 mt-3 w-56 bg-card border border-border rounded-2xl shadow-xl z-50 p-2 flex flex-col gap-1"
              >
                <div className="px-3 py-2 border-b border-border mb-1">
                  <p className="text-xs font-bold text-foreground">
                    M. Iqbal Zayn
                  </p>
                  <p className="text-[11px] font-medium text-muted-foreground">
                    iqbal@finly.io
                  </p>
                </div>
                <Link
                  to="/settings"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-foreground hover:bg-accent/60 rounded-xl transition-all"
                >
                  <User className="h-3.5 w-3.5 text-muted-foreground" /> Account Profile
                </Link>
                <Link
                  to="/settings"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-foreground hover:bg-accent/60 rounded-xl transition-all"
                >
                  <SettingsIcon className="h-3.5 w-3.5 text-muted-foreground" /> Workspace Settings
                </Link>
                <div className="border-t border-border pt-1 mt-1">
                  <button
                    onClick={() => {
                      alert('Logged out successfully')
                      setMenuOpen(false)
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-destructive hover:bg-destructive/10 rounded-xl transition-all text-left"
                  >
                    <LogOut className="h-3.5 w-3.5" /> Sign out
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
