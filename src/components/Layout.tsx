import * as React from 'react'
import { AppSidebar } from './app-sidebar'
import { Topbar } from './layout/Topbar'
import { SidebarInset, SidebarProvider } from './ui/sidebar'
import { AiChatAssistant } from './AiChatAssistant'

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
      <SidebarInset>
        <Topbar />
        <main className="flex-1 p-3.5 sm:p-6 md:p-8 w-full max-w-[1920px] mx-auto space-y-6 sm:space-y-8 min-w-0 overflow-x-hidden">
          {children}
        </main>
        <AiChatAssistant />
      </SidebarInset>
    </SidebarProvider>
  )
}
