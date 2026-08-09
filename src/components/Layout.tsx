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
  Menu,
} from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
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

function V2Tooltip({
  children,
  content,
}: {
  children: React.ReactNode
  content: string
}) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="relative flex items-center justify-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, x: -6, scale: 0.92 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -4, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            className="absolute left-full ml-3 px-3 py-1.5 rounded-lg bg-foreground text-background text-xs font-semibold tracking-wide shadow-md whitespace-nowrap pointer-events-none z-50"
          >
            {content}
            <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 rotate-45 bg-foreground" />
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
    duration: 0.4,
  }

  return (
    <>
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-xs"
          onClick={useSidebarStore.getState().toggle}
        />
      )}
      <motion.aside
        initial={false}
        animate={{ width: 80 }}
        transition={m3Transition}
        className={cn(
          'fixed inset-y-0 left-0 flex flex-col items-center justify-between py-6 bg-card border-r border-border overflow-visible z-50 lg:z-0 shadow-sm transition-transform duration-300 w-20',
          'max-lg:-translate-x-full',
          isExpanded && 'max-lg:translate-x-0 max-lg:!w-20',
        )}
      >
        <div className="flex flex-col items-center gap-6 w-full">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-primary text-primary-foreground rounded-2xl shadow-sm">
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

          <nav className="flex flex-col items-center gap-3 w-full px-2 mt-4">
            {navItems.map((item) => {
              const isActive =
                location.pathname === item.to ||
                (item.to !== '/' && location.pathname.startsWith(item.to))
              return (
                <V2Tooltip key={item.to} content={item.label}>
                  <Link
                    to={item.to}
                    onClick={() => {
                      if (window.innerWidth < 1024) {
                        useSidebarStore.getState().setExpanded(false)
                      }
                    }}
                    className={cn(
                      'relative flex h-12 w-12 items-center justify-center font-semibold transition-all rounded-full',
                      isActive
                        ? 'text-accent-foreground'
                        : 'text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground',
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="v2-sidebar-active"
                        className="absolute inset-0 bg-accent rounded-full z-0"
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
                  </Link>
                </V2Tooltip>
              )
            })}
          </nav>
        </div>

        <div className="flex flex-col items-center gap-3 w-full px-2">
          <V2Tooltip content="Settings">
            <Link
              to="/settings"
              onClick={() => {
                if (window.innerWidth < 1024) {
                  useSidebarStore.getState().setExpanded(false)
                }
              }}
              className={cn(
                'relative flex h-12 w-12 items-center justify-center font-semibold transition-all rounded-full',
                location.pathname === '/settings' ||
                  location.pathname.startsWith('/settings')
                  ? 'text-accent-foreground'
                  : 'text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground',
              )}
            >
              {(location.pathname === '/settings' ||
                location.pathname.startsWith('/settings')) && (
                <motion.div
                  layoutId="v2-sidebar-active"
                  className="absolute inset-0 bg-accent rounded-full z-0"
                  transition={m3Transition}
                />
              )}
              <Settings
                className={cn(
                  'relative z-10 h-5 w-5 shrink-0 transition-transform duration-300',
                  location.pathname === '/settings' ||
                    location.pathname.startsWith('/settings')
                    ? 'text-accent-foreground'
                    : 'text-muted-foreground',
                )}
                strokeWidth={
                  location.pathname === '/settings' ||
                  location.pathname.startsWith('/settings')
                    ? 2.5
                    : 2
                }
              />
            </Link>
          </V2Tooltip>

          <V2Tooltip content="Account Profile">
            <Link to="/account">
              <Avatar
                className={cn(
                  'h-10 w-10 shrink-0 transition-all hover:opacity-90',
                  location.pathname === '/account'
                    ? 'border-2 border-primary ring-2 ring-primary/20 shadow-sm'
                    : 'border border-border',
                )}
              >
                <AvatarImage
                  src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
                  alt="Admin User"
                />
                <AvatarFallback>AU</AvatarFallback>
              </Avatar>
            </Link>
          </V2Tooltip>
        </div>
      </motion.aside>
    </>
  )
}

export function Topbar() {
  const { toggle } = useSidebarStore()
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
        <button
          onClick={toggle}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card shadow-xs hover:border-primary/50 transition-all outline-none"
        >
          <Menu className="h-5 w-5 text-foreground" />
        </button>
        <div className="relative w-full max-w-2xl hidden md:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10 pointer-events-none" />
          <input
            type="text"
            value={topbarSearch}
            onChange={(e) => setTopbarSearch(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder="Search invoices, transactions, clients..."
            className="h-11 w-full bg-background border border-border rounded-full pl-11 pr-6 text-sm font-medium outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>
      <div className="flex items-center gap-3 relative z-40">
        <ThemeToggle />
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => {
              setNotifOpen(!notifOpen)
              if (menuOpen) setMenuOpen(false)
            }}
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card shadow-xs hover:border-primary/50 transition-all outline-none"
          >
            <Bell className="h-5 w-5 text-foreground" />
            <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-primary ring-2 ring-card" />
          </button>

          {notifOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 450, damping: 28 }}
              className="absolute right-0 mt-3 w-80 bg-card border border-border rounded-2xl shadow-xl z-50 flex flex-col overflow-hidden"
            >
              <div className="px-5 py-4 border-b border-border flex justify-between items-center bg-muted/40">
                <p className="font-semibold text-foreground text-sm">
                  Notifications
                </p>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary text-primary-foreground">
                  2 New
                </span>
              </div>
              <div className="flex flex-col divide-y divide-border">
                <div className="p-4 hover:bg-accent/40 cursor-pointer transition-colors">
                  <p className="text-sm font-semibold text-foreground">
                    Invoice #INV-2023-001 Paid
                  </p>
                  <p className="text-xs font-normal text-muted-foreground mt-1">
                    Acme Corp has paid $4,500.00
                  </p>
                  <p className="text-xs font-medium text-primary mt-2">
                    10 minutes ago
                  </p>
                </div>
                <div className="p-4 hover:bg-accent/40 cursor-pointer transition-colors">
                  <p className="text-sm font-semibold text-foreground">
                    New Team Member
                  </p>
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
            className="flex items-center justify-center transition-all outline-none"
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
  const m3Transition = {
    type: 'tween' as const,
    ease: [0.2, 0, 0, 1] as [number, number, number, number],
    duration: 0.4,
  }

  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary/20">
      <Sidebar />
      <motion.main
        initial={false}
        animate={{ marginLeft: 80 }}
        transition={m3Transition}
        className="relative z-10 min-h-screen flex flex-col max-lg:!ml-0"
      >
        <Topbar />
        <div className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </div>
      </motion.main>
    </div>
  )
}
