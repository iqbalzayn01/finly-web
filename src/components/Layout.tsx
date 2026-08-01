import { Link, useLocation } from '@tanstack/react-router'
import {
  LayoutDashboard,
  Wallet,
  FileText,
  Users,
  Package,
  Bell,
  Search,
  Menu,
} from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import { cn } from '../lib/utils'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { create } from 'zustand'

export const useSidebarStore = create<{
  isExpanded: boolean;
  toggle: () => void;
}>((set) => ({
  isExpanded: true,
  toggle: () => set((state) => ({ isExpanded: !state.isExpanded })),
}))

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/' },
  { icon: Wallet, label: 'Cashbook', to: '/cashbook' },
  { icon: FileText, label: 'Invoices', to: '/invoices' },
  { icon: Users, label: 'Customers', to: '/customers' },
  { icon: Package, label: 'Items', to: '/items' },
]

export function Sidebar() {
  const location = useLocation()
  const { isExpanded } = useSidebarStore()

  // Material Design 3 easing
  const m3Transition = { type: 'tween', ease: [0.2, 0, 0, 1], duration: 0.4 }

  return (
    <>
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={useSidebarStore.getState().toggle} 
        />
      )}
      <motion.aside 
        initial={false}
        animate={{ width: isExpanded ? 300 : 96 }}
        transition={m3Transition}
        className={cn(
          "fixed inset-y-0 left-0 flex flex-col bg-background border-r-2 border-border overflow-hidden z-50 shadow-brutal-lg transition-transform duration-300",
          "max-lg:!w-[300px] max-lg:-translate-x-full",
          isExpanded && "max-lg:translate-x-0"
        )}
      >
      <div className={cn("flex h-20 items-center relative overflow-hidden transition-all duration-300 border-b-2 border-border bg-card", isExpanded ? "px-6" : "px-0 justify-center")}>
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-primary text-primary-foreground border-2 border-border shadow-brutal-sm">
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
          <AnimatePresence>
            {isExpanded && (
              <motion.span 
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={m3Transition}
                className="text-2xl font-medium tracking-tight text-foreground truncate whitespace-nowrap"
              >
                Finly
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      <nav className="flex-1 space-y-2 px-4 py-4 overflow-x-hidden mt-4">
        {navItems.map((item) => {
          const isActive =
            location.pathname === item.to ||
            (item.to !== '/' && location.pathname.startsWith(item.to))
          return (
            <Link
              key={item.to}
              to={item.to}
              title={!isExpanded ? item.label : undefined}
              className={cn(
                'group relative flex items-center gap-4 py-4 font-bold transition-all border-2 border-transparent',
                isActive
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:border-border hover:shadow-brutal-sm hover:translate-y-[-2px] hover:text-accent-foreground',
                isExpanded ? 'px-6 mx-4' : 'px-0 justify-center mx-2'
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-accent border-2 border-border shadow-brutal-sm z-0"
                  transition={m3Transition}
                />
              )}
              <item.icon
                className={cn(
                  'relative z-10 h-6 w-6 shrink-0 transition-transform duration-300',
                  isActive ? 'text-accent-foreground' : 'text-foreground',
                )}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <AnimatePresence>
                {isExpanded && (
                  <motion.span 
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={m3Transition}
                    className="relative z-10 truncate whitespace-nowrap text-[15px]"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 mb-4">
        <div className={cn("bg-card p-4 border-2 border-border shadow-brutal-sm flex items-center transition-all", isExpanded ? "justify-between" : "justify-center p-2")}>
          <div className="flex items-center gap-4">
            <img
              src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
              alt="User"
              className="h-10 w-10 shrink-0 border-2 border-border"
            />
            <AnimatePresence>
              {isExpanded && (
                <motion.div 
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="flex flex-col truncate"
                >
                  <span className="text-sm font-medium text-foreground truncate">
                    Acme Corp
                  </span>
                  <span className="text-xs text-muted-foreground truncate">
                    Admin
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.aside>
    </>
  )
}

export function Topbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { toggle } = useSidebarStore()

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between px-6 bg-background border-b-2 border-border">
      <div className="flex flex-1 items-center gap-4">
        <button 
          onClick={toggle}
          className="flex h-12 w-12 items-center justify-center border-2 border-border bg-card shadow-brutal-sm hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-none transition-all outline-none"
        >
          <Menu className="h-6 w-6" />
        </button>
        <div className="relative w-full max-w-2xl hidden md:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground" />
          <input
            type="text"
            placeholder="Search"
            className="h-12 w-full bg-card border-2 border-border shadow-brutal-sm pl-12 pr-6 text-[15px] font-bold outline-none transition-all focus:shadow-none focus:translate-y-[2px] focus:translate-x-[2px] text-foreground"
          />
        </div>
      </div>
      <div className="flex items-center gap-2 relative z-40">
        <ThemeToggle />
        <button className="relative flex h-12 w-12 items-center justify-center border-2 border-border bg-card shadow-brutal-sm hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-none transition-all outline-none">
          <Bell className="h-6 w-6 text-foreground" />
          <span className="absolute right-2 top-2 h-3 w-3 border-2 border-border bg-accent shadow-brutal-sm" />
        </button>
        <div className="relative ml-2">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="h-12 w-12 overflow-hidden border-2 border-border bg-card shadow-brutal-sm hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-none transition-all outline-none"
          >
            <img
              src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
              alt="User"
              className="h-full w-full object-cover"
            />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-3 w-64 bg-card border-2 border-border shadow-brutal z-50 flex flex-col">
              <div className="px-6 py-3 border-b-2 border-border">
                <p className="font-bold text-foreground">
                  Admin User
                </p>
                <p className="text-sm font-medium text-foreground truncate">
                  admin@acmecorp.com
                </p>
              </div>
              <div className="py-2 px-3 flex flex-col gap-1">
                <Link
                  to="/account"
                  onClick={() => setMenuOpen(false)}
                  className="flex w-full items-center gap-4 px-4 py-3 text-[15px] font-bold text-foreground hover:bg-accent border-2 border-transparent hover:border-border hover:shadow-brutal-sm transition-all"
                >
                  <Users className="h-5 w-5" /> Account
                </Link>
                <Link
                  to="/settings"
                  onClick={() => setMenuOpen(false)}
                  className="flex w-full items-center gap-4 px-4 py-3 text-[15px] font-bold text-foreground hover:bg-accent border-2 border-transparent hover:border-border hover:shadow-brutal-sm transition-all"
                >
                  <LayoutDashboard className="h-5 w-5" /> Settings
                </Link>
              </div>
              <div className="border-t-2 border-border p-3">
                <button className="flex w-full items-center gap-4 px-4 py-3 text-[15px] font-bold text-destructive hover:bg-destructive hover:text-destructive-foreground border-2 border-transparent hover:border-border hover:shadow-brutal-sm transition-all">
                  Log Out
                </button>
              </div>
            </div>
          )}
          {menuOpen && (
            <div
              className="fixed inset-0 z-40"
              onClick={() => setMenuOpen(false)}
            />
          )}
        </div>
      </div>
    </header>
  )
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { isExpanded } = useSidebarStore()
  
  const m3Transition = { type: 'tween', ease: [0.2, 0, 0, 1], duration: 0.4 }

  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-accent/30">
      <Sidebar />
      <motion.main 
        initial={false}
        animate={{ marginLeft: isExpanded ? 300 : 96 }}
        transition={m3Transition}
        className="relative z-10 min-h-screen flex flex-col max-lg:!ml-0"
      >
        <Topbar />
        <div className="flex-1 p-4 md:p-6 lg:p-10 max-w-[1600px] mx-auto w-full">{children}</div>
      </motion.main>
    </div>
  )
}
