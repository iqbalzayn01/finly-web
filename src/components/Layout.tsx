import React from 'react'
import { Topbar } from './layout/Topbar'
import { AiChatAssistant } from './AiChatAssistant'

// Re-export V2Tooltip for backwards compatibility
export { V2Tooltip } from './ui/v2-tooltip'

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary/20 flex flex-col">
      <Topbar />
      <main className="flex-1 p-4 sm:p-6 md:p-8 w-full max-w-[1920px] mx-auto space-y-8">
        {children}
      </main>
      <AiChatAssistant />
    </div>
  )
}
