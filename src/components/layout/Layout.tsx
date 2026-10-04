import * as React from 'react'
import { Topbar } from './topbar'

const AiChatAssistant = React.lazy(() =>
  import('../AiChatAssistant').then((m) => ({ default: m.AiChatAssistant })),
)

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex w-full flex-1 flex-col bg-background md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-md md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2">
      <Topbar />
      <main className="flex-1 p-3.5 sm:p-6 md:p-8 w-full max-w-[1920px] mx-auto space-y-6 sm:space-y-8 min-w-0 overflow-x-hidden">
        {children}
      </main>
      <React.Suspense fallback={null}>
        <AiChatAssistant />
      </React.Suspense>
    </div>
  )
}
