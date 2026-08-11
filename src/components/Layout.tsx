import { Link, useLocation, useNavigate } from '@tanstack/react-router'
import {
  LayoutDashboard,
  Wallet,
  FileText,
  Users,
  Package,
  Settings,
  Bell,
  Search,
  PanelLeft,
  PanelLeftClose,
  Sparkles,
  CheckCircle2,
} from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import { AiChatAssistant } from './AiChatAssistant'
import { cn } from '../lib/utils'
import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { create } from 'zustand'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'

export const useSidebarStore = create<{
  isExpanded: boolean
  toggle: () => void
  setExpanded: (val: boolean) => void
}>((set) => ({
  isExpanded: typeof window !== 'undefined' ? window.innerWidth >= 1024 : true,
  toggle: () => set((state) => ({ isExpanded: !state.isExpanded })),
  setExpanded: (val) => set({ isExpanded: val }),
}))

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/' },
  { icon: Wallet, label: 'Cashbook', to: '/cashbook' },
  { icon: FileText, label: 'Invoices', to: '/invoices' },
  { icon: Users, label: 'Customers', to: '/customers' },
  { icon: Package, label: 'Items', to: '/items' },
]

export function V2Tooltip({
  children,
  content,
  preferredSide = 'auto',
}: {
  children: React.ReactNode
  content: string
  preferredSide?: 'auto' | 'right' | 'left' | 'top' | 'bottom'
}) {
  const [isHovered, setIsHovered] = useState(false)
  const [adjustedSide, setAdjustedSide] = useState<'right' | 'left' | 'top' | 'bottom'>('right')
  const containerRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isHovered && containerRef.current && tooltipRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect()
      const tooltipRect = tooltipRef.current.getBoundingClientRect()
      const vw = window.innerWidth
      const vh = window.innerHeight
      const padding = 12

      let side: 'right' | 'left' | 'top' | 'bottom' = preferredSide === 'auto' ? 'right' : preferredSide

      // Collision checks
      if ((side === 'right' || preferredSide === 'auto') && containerRect.right + tooltipRect.width + padding > vw) {
        if (containerRect.left - tooltipRect.width - padding >= 0) {
          side = 'left'
        } else {
          side = containerRect.top > vh / 2 ? 'top' : 'bottom'
        }
      } else if (side === 'left' && containerRect.left - tooltipRect.width - padding < 0) {
        side = 'right'
      }

      if (side === 'top' && containerRect.top - tooltipRect.height - padding < 0) {
        side = 'bottom'
      } else if (side === 'bottom' && containerRect.bottom + tooltipRect.height + padding > vh) {
        side = 'top'
      }

      setAdjustedSide(side)
    }
  }, [isHovered, preferredSide])

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            ref={tooltipRef}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 450, damping: 28 }}
            className={cn(
              'absolute px-3 py-1.5 rounded-lg bg-foreground text-background text-xs font-semibold tracking-wide shadow-md whitespace-nowrap pointer-events-none z-50',
              adjustedSide === 'right' && 'left-full ml-3 top-1/2 -translate-y-1/2',
              adjustedSide === 'left' && 'right-full mr-3 top-1/2 -translate-y-1/2',
              adjustedSide === 'top' && 'bottom-full mb-3 left-1/2 -translate-x-1/2',
              adjustedSide === 'bottom' && 'top-full mt-3 left-1/2 -translate-x-1/2',
            )}
          >
            {content}
            <div
              className={cn(
                'absolute w-2 h-2 rotate-45 bg-foreground',
                adjustedSide === 'right' && '-left-1 top-1/2 -translate-y-1/2',
                adjustedSide === 'left' && '-right-1 top-1/2 -translate-y-1/2',
                adjustedSide === 'top' && '-bottom-1 left-1/2 -translate-x-1/2',
                adjustedSide === 'bottom' && '-top-1 left-1/2 -translate-x-1/2',
              )}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function ProHoverCard() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="relative flex items-center justify-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button className="relative flex h-11 w-11 items-center justify-center font-semibold transition-all rounded-full bg-muted/60 hover:bg-accent border border-border text-foreground shadow-xs outline-none cursor-pointer">
        <Sparkles className="h-5 w-5 text-primary" />
      </button>
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, x: -10, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -6, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 450, damping: 28 }}
            className="absolute left-full ml-3 w-64 p-4 rounded-2xl bg-card border border-border text-foreground shadow-2xl z-50 pointer-events-auto"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-foreground">Finly Pro</span>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-primary/10 text-primary border border-primary/20">
                PRO
              </span>
            </div>
            <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
              Supercharge your agency cashflow with advanced features.
            </p>
            <ul className="space-y-2 text-xs text-foreground font-medium mb-4">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" /> Unlimited AI Parse & Drafts
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" /> Live FX Multi-Currency Engine
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" /> Multi-Tenant Role Governance
              </li>
            </ul>
            <Link
              to="/pricing"
              className="w-full py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center"
            >
              Upgrade Now • $29/mo
            </Link>
            <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rotate-45 bg-card border-l border-b border-border" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function Sidebar() {
  const location = useLocation()
  const { isExpanded } = useSidebarStore()

  const m3Transition = {
    type: 'tween' as const,
    ease: [0.2, 0, 0, 1] as [number, number, number, number],
    duration: 0.35,
  }

  return (
    <>
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-xs"
          onClick={() => useSidebarStore.getState().setExpanded(false)}
        />
      )}
      <motion.aside
        initial={false}
        animate={{ width: isExpanded ? 240 : 80 }}
        transition={m3Transition}
        className={cn(
          'fixed inset-y-0 left-0 flex flex-col justify-between py-6 bg-card border-r border-border overflow-visible z-50 shadow-sm transition-transform duration-300',
          'max-lg:-translate-x-full max-lg:!w-60',
          isExpanded && 'max-lg:translate-x-0',
        )}
      >
        <div className="flex flex-col gap-6 w-full px-3">
          {/* Logo & Brand Header */}
          <div className="flex items-center gap-3 px-2">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-primary text-primary-foreground rounded-2xl shadow-sm">
              <svg
                width="24"
                height="24"
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
                transition={m3Transition}
                className="overflow-hidden whitespace-nowrap"
              >
                <h1 className="font-bold text-lg text-foreground tracking-tight">Finly</h1>
                <p className="text-[11px] font-medium text-muted-foreground -mt-0.5">Cashflow OS</p>
              </motion.div>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-2 w-full mt-2">
            {navItems.map((item) => {
              const isActive =
                location.pathname === item.to ||
                (item.to !== '/' && location.pathname.startsWith(item.to))

              const linkContent = (
                <Link
                  to={item.to}
                  onClick={() => {
                    if (window.innerWidth < 1024) {
                      useSidebarStore.getState().setExpanded(false)
                    }
                  }}
                  className={cn(
                    'relative flex h-11 items-center gap-3 px-3 font-semibold transition-all rounded-xl w-full',
                    isActive
                      ? 'text-accent-foreground'
                      : 'text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground',
                    !isExpanded && 'justify-center px-0 h-11 w-11 mx-auto rounded-full',
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="v2-sidebar-active"
                      className={cn(
                        'absolute inset-0 bg-accent z-0',
                        isExpanded ? 'rounded-xl' : 'rounded-full'
                      )}
                      transition={m3Transition}
                    />
                  )}
                  <item.icon
                    className={cn(
                      'relative z-10 h-5 w-5 shrink-0 transition-transform duration-300',
                      isActive ? 'text-accent-foreground' : 'text-muted-foreground',
                    )}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  {isExpanded && (
                    <span className="relative z-10 text-sm font-semibold whitespace-nowrap truncate">
                      {item.label}
                    </span>
                  )}
                </Link>
              )

              return isExpanded ? (
                <React.Fragment key={item.to}>{linkContent}</React.Fragment>
              ) : (
                <V2Tooltip key={item.to} content={item.label}>
                  {linkContent}
                </V2Tooltip>
              )
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
                  <span className="font-bold text-xs text-foreground">Finly Pro</span>
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
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    useSidebarStore.getState().setExpanded(false)
                  }
                }}
                className="w-full py-1.5 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center"
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
              onClick={() => {
                if (window.innerWidth < 1024) {
                  useSidebarStore.getState().setExpanded(false)
                }
              }}
              className={cn(
                'relative flex h-11 items-center gap-3 px-3 font-semibold transition-all rounded-xl w-full',
                location.pathname === '/settings' || location.pathname.startsWith('/settings')
                  ? 'text-accent-foreground'
                  : 'text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground',
              )}
            >
              {(location.pathname === '/settings' || location.pathname.startsWith('/settings')) && (
                <motion.div
                  layoutId="v2-sidebar-active"
                  className="absolute inset-0 bg-accent rounded-xl z-0"
                  transition={m3Transition}
                />
              )}
              <Settings
                className={cn(
                  'relative z-10 h-5 w-5 shrink-0',
                  location.pathname === '/settings' || location.pathname.startsWith('/settings')
                    ? 'text-accent-foreground'
                    : 'text-muted-foreground',
                )}
              />
              <span className="relative z-10 text-sm font-semibold whitespace-nowrap truncate">
                Settings
              </span>
            </Link>
          ) : (
            <V2Tooltip content="Settings">
              <Link
                to="/settings"
                className={cn(
                  'relative flex h-11 w-11 items-center justify-center font-semibold transition-all rounded-full mx-auto',
                  location.pathname === '/settings' || location.pathname.startsWith('/settings')
                    ? 'text-accent-foreground'
                    : 'text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground',
                )}
              >
                {(location.pathname === '/settings' || location.pathname.startsWith('/settings')) && (
                  <motion.div
                    layoutId="v2-sidebar-active"
                    className="absolute inset-0 bg-accent rounded-full z-0"
                    transition={m3Transition}
                  />
                )}
                <Settings className="relative z-10 h-5 w-5 shrink-0 text-muted-foreground" />
              </Link>
            </V2Tooltip>
          )}

          {/* User Profile */}
          {isExpanded ? (
            <Link
              to="/account"
              className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-accent/40 transition-colors w-full"
            >
              <Avatar className="h-9 w-9 shrink-0 border border-border">
                <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026024d" alt="Admin User" />
                <AvatarFallback>AU</AvatarFallback>
              </Avatar>
              <div className="overflow-hidden whitespace-nowrap text-left">
                <p className="font-semibold text-xs text-foreground truncate">Admin User</p>
                <p className="text-[10px] text-muted-foreground truncate">admin@acmecorp.com</p>
              </div>
            </Link>
          ) : (
            <V2Tooltip content="Account Profile">
              <Link to="/account" className="mx-auto">
                <Avatar className="h-9 w-9 shrink-0 border border-border">
                  <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026024d" alt="Admin User" />
                  <AvatarFallback>AU</AvatarFallback>
                </Avatar>
              </Link>
            </V2Tooltip>
          )}
        </div>
      </motion.aside>
    </>
  )
}

export function Topbar() {
  const { isExpanded, toggle } = useSidebarStore()
  const [topbarSearch, setTopbarSearch] = useState('')
  const [notifOpen, setNotifOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const notifRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && topbarSearch.trim().length >= 3) {
      navigate({
        to: '/cashbook',
      })
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notifOpen &&
        notifRef.current &&
        !notifRef.current.contains(event.target as Node)
      ) {
        setNotifOpen(false)
      }
      if (
        menuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [notifOpen, menuOpen])

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between px-6 bg-card border-b border-border shadow-xs">
      <div className="flex flex-1 items-center gap-4">
        {/* Best UX Sidebar Panel Toggle Button */}
        <V2Tooltip content={isExpanded ? 'Collapse Sidebar' : 'Expand Sidebar'}>
          <button
            onClick={toggle}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card shadow-xs hover:border-primary/50 hover:bg-accent/40 text-foreground transition-all outline-none cursor-pointer"
            aria-label="Toggle Sidebar"
          >
            {isExpanded ? (
              <PanelLeftClose className="h-5 w-5" />
            ) : (
              <PanelLeft className="h-5 w-5" />
            )}
          </button>
        </V2Tooltip>
        <div className="relative w-full max-w-2xl hidden md:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10 pointer-events-none" />
          <input
            type="text"
            value={topbarSearch}
            onChange={(e) => setTopbarSearch(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder="Search transactions, customers, or invoices... (Press Enter to search)"
            className="w-full h-11 pl-11 pr-4 bg-muted/40 border border-border rounded-xl text-sm font-medium focus:bg-card focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>
      <div className="flex items-center gap-3 relative z-40">
        <ThemeToggle />
        <div className="relative" ref={notifRef}>
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
                    setNotifOpen(false)
                    navigate({ to: '/cashbook' })
                  }}
                  className="w-full py-2 text-xs font-semibold text-center text-foreground hover:bg-accent/50 rounded-xl transition-all"
                >
                  View All Activity
                </button>
              </div>
            </motion.div>
          )}
        </div>
        <div className="relative ml-2" ref={menuRef}>
          <button
            onClick={() => {
              setMenuOpen(!menuOpen)
              if (notifOpen) setNotifOpen(false)
            }}
            className="flex items-center justify-center transition-all outline-none cursor-pointer"
          >
            <Avatar className="h-10 w-10 border border-border shadow-xs hover:border-primary/50 transition-all">
              <AvatarImage
                src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
                alt="Admin User"
              />
              <AvatarFallback>AU</AvatarFallback>
            </Avatar>
          </button>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 450, damping: 28 }}
                className="absolute right-0 mt-3 w-64 bg-card border border-border rounded-2xl shadow-xl z-50 flex flex-col overflow-hidden"
              >
                <div className="px-5 py-3.5 border-b border-border flex items-center gap-3 bg-muted/40">
                  <Avatar className="h-9 w-9 border border-border">
                    <AvatarImage
                      src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
                      alt="Admin User"
                    />
                    <AvatarFallback>AU</AvatarFallback>
                  </Avatar>
                  <div className="overflow-hidden">
                    <p className="font-semibold text-foreground truncate text-sm">
                      Admin User
                    </p>
                    <p className="text-xs font-normal text-muted-foreground truncate">
                      admin@acmecorp.com
                    </p>
                  </div>
                </div>
                <div className="py-2 px-2 flex flex-col gap-0.5">
                  <Link
                    to="/account"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-foreground hover:bg-accent/50 rounded-xl transition-all"
                  >
                    <Settings className="h-4 w-4 text-muted-foreground" />
                    Account Settings
                  </Link>
                  <Link
                    to="/settings"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-foreground hover:bg-accent/50 rounded-xl transition-all"
                  >
                    <Settings className="h-4 w-4 text-muted-foreground" />
                    Business Profile
                  </Link>
                </div>
                <div className="p-2 border-t border-border">
                  <button
                    onClick={() => setMenuOpen(false)}
                    className="w-full text-left px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-xl transition-all"
                  >
                    Sign Out
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

export function Layout({ children }: { children: React.ReactNode }) {
  const { isExpanded } = useSidebarStore()
  const m3Transition = {
    type: 'tween' as const,
    ease: [0.2, 0, 0, 1] as [number, number, number, number],
    duration: 0.35,
  }

  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary/20">
      <Sidebar />
      <motion.main
        initial={false}
        animate={{ marginLeft: isExpanded ? 240 : 80 }}
        transition={m3Transition}
        className="relative z-10 min-h-screen flex flex-col max-lg:!ml-0"
      >
        <Topbar />
        <div className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </div>
      </motion.main>
      <AiChatAssistant />
    </div>
  )
}
