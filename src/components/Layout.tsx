import React from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import { Topbar } from './layout/Topbar'
import { PublicNavbar } from './layout/PublicNavbar'
import { AiChatAssistant } from './AiChatAssistant'

// Re-export V2Tooltip for backwards compatibility
export { V2Tooltip } from './ui/v2-tooltip'

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const isPublicPage = location.pathname === '/landing' || location.pathname === '/pricing'

  if (isPublicPage) {
    return (
      <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary/20 flex flex-col">
        <PublicNavbar />
        <main className="flex-1 p-6 md:p-10 max-w-7xl w-full mx-auto">
          {children}
        </main>
        <footer className="border-t border-border bg-card py-8 text-center text-xs text-muted-foreground">
          <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>© 2026 Finly Inc. All rights reserved. B2B Cashflow Operating System.</p>
            <div className="flex items-center gap-6 font-semibold">
              <Link to="/landing" className="hover:text-foreground">Home</Link>
              <a href="/landing#features-section" className="hover:text-foreground">Features</a>
              <Link to="/pricing" className="hover:text-foreground">Pricing</Link>
              <Link to="/" className="hover:text-foreground">Dashboard</Link>
            </div>
          </div>
        </footer>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary/20 flex flex-col">
      <Topbar />
      <main className="flex-1 p-6 md:p-8 w-full max-w-[1920px] mx-auto space-y-8">
        {children}
      </main>
      <AiChatAssistant />
    </div>
  )
}
