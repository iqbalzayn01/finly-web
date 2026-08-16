import { Link, useLocation } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { ThemeToggle } from '../ThemeToggle'
import { cn } from '../../lib/utils'

export function PublicNavbar() {
  const location = useLocation()

  return (
    <header className="sticky top-0 z-40 flex h-20 w-full items-center border-b border-border bg-card/80 backdrop-blur-md shadow-none">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center h-full w-full max-w-7xl mx-auto px-6 md:px-10 gap-4">
        {/* Left Column: Brand Logo */}
        <div className="flex items-center justify-start">
          <Link to="/" className="flex items-center gap-3 group outline-none">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-primary text-primary-foreground rounded-2xl shadow-none font-black text-lg">
              F
            </div>
            <div>
              <h1 className="font-bold text-lg text-foreground tracking-tight leading-none">Finly</h1>
              <p className="text-[10px] font-semibold text-muted-foreground mt-0.5">Cashflow OS</p>
            </div>
          </Link>
        </div>

        {/* Center Column: Perfectly Centered Navigation Links */}
        <nav className="hidden md:flex items-center justify-center gap-8 text-sm font-semibold">
          <Link
            to="/"
            className={cn(
              'transition-colors',
              location.pathname === '/' ? 'text-primary font-bold' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Overview
          </Link>
          <a
            href="/#features-section"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Features
          </a>
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

        {/* Right Column: Actions */}
        <div className="flex items-center justify-end gap-3">
          <ThemeToggle />
          <Link
            to="/dashboard"
            className="px-4 py-2 text-xs font-bold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-none flex items-center gap-1.5 cursor-pointer outline-none active:scale-[0.98]"
          >
            <span>Open Dashboard</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </header>
  )
}
