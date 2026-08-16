import { Link, useLocation } from '@tanstack/react-router'
import {
  LayoutDashboard,
  Wallet,
  FileText,
  Users,
  Package,
  Settings,
  Search,
  PanelLeft,
  PanelLeftClose,
  Sparkles,
  X,
} from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { create } from 'zustand'
import { useState, useEffect } from 'react'
import { cn } from '../../lib/utils'
import { V2Tooltip } from '../ui/v2-tooltip'
import { ProHoverCard } from './ProHoverCard'

export const useSidebarStore = create<{
  isExpanded: boolean
  isMobileOpen: boolean
  toggle: () => void
  toggleMobile: () => void
  setExpanded: (val: boolean) => void
  setMobileOpen: (val: boolean) => void
}>((set) => ({
  isExpanded: typeof window !== 'undefined' ? window.innerWidth >= 1024 : true,
  isMobileOpen: false,
  toggle: () => set((state) => ({ isExpanded: !state.isExpanded })),
  toggleMobile: () => set((state) => ({ isMobileOpen: !state.isMobileOpen })),
  setExpanded: (val) => set({ isExpanded: val }),
  setMobileOpen: (val) => set({ isMobileOpen: val }),
}))

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/dashboard' },
  { icon: Wallet, label: 'Cashbook', to: '/cashbook' },
  { icon: FileText, label: 'Invoices', to: '/invoices' },
  { icon: Users, label: 'Customers', to: '/customers' },
  { icon: Package, label: 'Items', to: '/items' },
]

export function Sidebar() {
  const location = useLocation()
  const { isExpanded, isMobileOpen, toggle, setMobileOpen } = useSidebarStore()
  const [searchQuery, setSearchQuery] = useState('')

  // Listen for Ctrl+K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        const searchInput = document.getElementById('sidebar-search-input')
        if (searchInput) {
          searchInput.focus()
        } else if (!isExpanded) {
          useSidebarStore.getState().setExpanded(true)
          setTimeout(() => {
            document.getElementById('sidebar-search-input')?.focus()
          }, 150)
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isExpanded])

  const m3Transition = {
    type: 'tween' as const,
    ease: [0.2, 0, 0, 1] as [number, number, number, number],
    duration: 0.35,
  }

  return (
    <>
      {/* Desktop Sidebar (lg screens and above) */}
      <motion.aside
        initial={false}
        animate={{ width: isExpanded ? 240 : 80 }}
        transition={m3Transition}
        className="fixed left-0 top-0 z-40 h-screen border-r border-border bg-card flex flex-col justify-between pb-5 overflow-visible select-none shadow-none max-lg:hidden"
      >
        {/* Floating Sidebar Toggle Button on Margin Border */}
        <div className="absolute -right-3.5 top-[22px] z-50">
          <V2Tooltip
            content={isExpanded ? 'Collapse Sidebar' : 'Expand Sidebar'}
            preferredSide="right"
          >
            <button
              onClick={toggle}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-accent shadow-none transition-all cursor-pointer outline-none hover:scale-110"
              aria-label={isExpanded ? 'Collapse Sidebar' : 'Expand Sidebar'}
            >
              {isExpanded ? (
                <PanelLeftClose className="h-3.5 w-3.5" />
              ) : (
                <PanelLeft className="h-3.5 w-3.5" />
              )}
            </button>
          </V2Tooltip>
        </div>

        <div className="flex flex-col gap-5 w-full">
          {/* Brand Header (aligned with Topbar height h-18) */}
          <div className="flex h-18 shrink-0 items-center px-4 border-b border-border/50">
            <Link
              to="/dashboard"
              className={cn(
                'flex items-center gap-3 overflow-hidden',
                !isExpanded && 'mx-auto',
              )}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-primary text-primary-foreground rounded-2xl shadow-none transition-all">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex flex-col whitespace-nowrap"
                >
                  <span className="font-bold text-base tracking-tight text-foreground leading-none">
                    Finly
                  </span>
                  <span className="text-[10px] font-semibold text-muted-foreground mt-0.5">
                    B2B Cashflow OS
                  </span>
                </motion.div>
              )}
            </Link>
          </div>

          {/* Integrated Search Input in Sidebar */}
          <div className="px-3">
            {isExpanded ? (
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10 pointer-events-none" />
                <input
                  id="sidebar-search-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search... (Ctrl+K)"
                  className="h-11 w-full border border-border bg-background rounded-2xl pl-10 pr-12 text-xs font-semibold outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground"
                />
                <kbd className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none hidden sm:inline-flex h-5 select-none items-center gap-0.5 rounded-md border border-border bg-muted/60 px-1.5 font-mono text-[10px] font-bold text-muted-foreground opacity-80">
                  ⌘K
                </kbd>
              </div>
            ) : (
              <V2Tooltip content="Search (Ctrl+K)" preferredSide="right">
                <button
                  onClick={() => {
                    useSidebarStore.getState().setExpanded(true)
                    setTimeout(() => {
                      document.getElementById('sidebar-search-input')?.focus()
                    }, 150)
                  }}
                  className="flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-accent transition-all cursor-pointer outline-none shadow-none mx-auto"
                >
                  <Search className="h-4 w-4" />
                </button>
              </V2Tooltip>
            )}
          </div>

          {/* Navigation Items */}
          <nav className="flex flex-col gap-1 w-full px-3">
            {navItems.map((item) => {
              const isActive = location.pathname === item.to
              const Icon = item.icon

              const linkContent = (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    'flex items-center gap-3.5 h-11 rounded-2xl text-xs font-semibold transition-all relative outline-none',
                    isExpanded
                      ? 'px-3.5 w-full'
                      : 'justify-center w-11 mx-auto',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-none font-bold'
                      : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground',
                  )}
                >
                  <Icon
                    className={cn(
                      'h-4 w-4 shrink-0',
                      isActive && 'text-primary-foreground',
                    )}
                  />
                  {isExpanded && (
                    <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                      {item.label}
                    </span>
                  )}
                </Link>
              )

              if (!isExpanded) {
                return (
                  <V2Tooltip
                    key={item.to}
                    content={item.label}
                    preferredSide="right"
                  >
                    {linkContent}
                  </V2Tooltip>
                )
              }

              return linkContent
            })}
          </nav>
        </div>

        {/* Bottom Section Actions */}
        <div className="flex flex-col gap-3 w-full px-3">
          {/* Pro Upgrade Card */}
          {isExpanded ? (
            <div className="p-3.5 rounded-2xl bg-muted/40 border border-border text-foreground">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-primary shrink-0" />
                  <span className="font-bold text-xs text-foreground">
                    Finly Pro
                  </span>
                </div>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-primary/10 text-primary border border-primary/20">
                  PRO
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground mb-3 leading-relaxed">
                Unlock AI Assistant & Live FX Engine
              </p>
              <Link
                to="/pricing"
                className="w-full py-1.5 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold rounded-xl shadow-none transition-all cursor-pointer flex items-center justify-center"
              >
                Upgrade • $29/mo
              </Link>
            </div>
          ) : (
            <ProHoverCard />
          )}

          {/* Settings Link */}
          {isExpanded ? (
            <Link
              to="/settings"
              className={cn(
                'flex items-center gap-3.5 h-11 px-3.5 rounded-2xl text-xs font-semibold transition-all outline-none',
                location.pathname === '/settings'
                  ? 'bg-primary text-primary-foreground font-bold shadow-none'
                  : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground',
              )}
            >
              <Settings className="h-4 w-4 shrink-0" />
              <span className="whitespace-nowrap">Settings</span>
            </Link>
          ) : (
            <V2Tooltip content="Settings" preferredSide="right">
              <Link
                to="/settings"
                className={cn(
                  'flex h-11 w-11 items-center justify-center rounded-2xl text-xs font-semibold transition-all outline-none',
                  location.pathname === '/settings'
                    ? 'bg-primary text-primary-foreground font-bold shadow-none'
                    : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground',
                )}
              >
                <Settings className="h-4 w-4 shrink-0" />
              </Link>
            </V2Tooltip>
          )}
        </div>
      </motion.aside>

      {/* Mobile Drawer Sidebar (<lg screens) */}
      <AnimatePresence>
        {isMobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
              onClick={() => setMobileOpen(false)}
            />

            {/* Mobile Drawer Panel */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              className="absolute left-0 top-0 bottom-0 w-72 max-w-[80vw] bg-card border-r border-border p-5 flex flex-col justify-between shadow-none z-50 overflow-y-auto"
            >
              <div className="flex flex-col gap-6 w-full">
                {/* Mobile Brand Header */}
                <div className="flex items-center justify-between">
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-primary text-primary-foreground rounded-2xl shadow-none">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                      </svg>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-base tracking-tight text-foreground leading-none">
                        Finly
                      </span>
                      <span className="text-[10px] font-semibold text-muted-foreground mt-0.5">
                        B2B Cashflow OS
                      </span>
                    </div>
                  </Link>

                  <button
                    onClick={() => setMobileOpen(false)}
                    className="flex h-8 w-8 items-center justify-center rounded-xl border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-accent transition-all cursor-pointer outline-none"
                    aria-label="Close Mobile Menu"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Mobile Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search in Finly..."
                    className="h-11 w-full border border-border bg-background rounded-2xl pl-10 pr-4 text-xs font-semibold outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground"
                  />
                </div>

                {/* Mobile Navigation Links */}
                <nav className="flex flex-col gap-1 w-full">
                  {navItems.map((item) => {
                    const isActive = location.pathname === item.to
                    const Icon = item.icon

                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          'flex items-center gap-3.5 h-11 px-3.5 rounded-2xl text-xs font-semibold transition-all outline-none',
                          isActive
                            ? 'bg-primary text-primary-foreground font-bold shadow-none'
                            : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground',
                        )}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        <span>{item.label}</span>
                      </Link>
                    )
                  })}
                </nav>
              </div>

              {/* Mobile Bottom Pro Upgrade & Settings */}
              <div className="flex flex-col gap-3 w-full pt-6">
                <div className="p-3.5 rounded-2xl bg-muted/40 border border-border text-foreground">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 text-primary shrink-0" />
                      <span className="font-bold text-xs text-foreground">
                        Finly Pro
                      </span>
                    </div>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-primary/10 text-primary border border-primary/20">
                      PRO
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mb-3 leading-relaxed">
                    Unlock AI Assistant & Live FX Engine
                  </p>
                  <Link
                    to="/pricing"
                    onClick={() => setMobileOpen(false)}
                    className="w-full py-1.5 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold rounded-xl shadow-none transition-all cursor-pointer flex items-center justify-center"
                  >
                    Upgrade • $29/mo
                  </Link>
                </div>

                <Link
                  to="/settings"
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'flex items-center gap-3.5 h-11 px-3.5 rounded-2xl text-xs font-semibold transition-all outline-none',
                    location.pathname === '/settings'
                      ? 'bg-primary text-primary-foreground font-bold shadow-none'
                      : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground',
                  )}
                >
                  <Settings className="h-4 w-4 shrink-0" />
                  <span>Settings</span>
                </Link>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
