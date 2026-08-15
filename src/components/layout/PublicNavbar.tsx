import { Link, useLocation } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { ThemeToggle } from '../ThemeToggle'
import { cn } from '../../lib/utils'

export function PublicNavbar() {
  const location = useLocation()

  return (
    <header className="sticky top-0 z-40 flex h-20 items-center justify-between px-6 md:px-12 bg-card/80 backdrop-blur-md border-b border-border shadow-xs">
      <Link to="/landing" className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-primary text-primary-foreground rounded-2xl shadow-sm">
          <svg
            width="22"
            height="22"
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
        <div>
          <h1 className="font-bold text-lg text-foreground tracking-tight leading-none">Finly</h1>
          <p className="text-[10px] font-semibold text-muted-foreground mt-0.5">Cashflow OS</p>
        </div>
      </Link>

      <nav className="hidden md:flex items-center gap-8 text-sm font-semibold">
        <Link
          to="/landing"
          className={cn(
            'transition-colors',
            location.pathname === '/landing' ? 'text-primary font-bold' : 'text-muted-foreground hover:text-foreground'
          )}
        >
          Overview
        </Link>
        <Link
          to="/pricing"
          className={cn(
            'transition-colors',
            location.pathname === '/pricing' ? 'text-primary font-bold' : 'text-muted-foreground hover:text-foreground'
          )}
        >
          Pricing
        </Link>
      </nav>

      <div className="flex items-center gap-3">
        <ThemeToggle />
        <Link
          to="/"
          className="px-4 py-2 text-xs font-bold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-xs flex items-center gap-1.5"
        >
          Open Dashboard
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </header>
  )
}
