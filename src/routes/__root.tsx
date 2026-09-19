import * as React from 'react'
import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { Layout } from '../components/Layout'
import { TooltipProvider } from '../components/ui/tooltip'
import appCss from '../styles.css?url'
import type { QueryClient } from '@tanstack/react-query'
import { NotFound } from '../components/NotFound'

interface MyRouterContext {
  queryClient: QueryClient
}

const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');var mode=(stored==='light'||stored==='dark'||stored==='auto')?stored:'auto';var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=mode==='auto'?(prefersDark?'dark':'light'):mode;var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(resolved);if(mode==='auto'){root.removeAttribute('data-theme')}else{root.setAttribute('data-theme',mode)}root.style.colorScheme=resolved;}catch(e){}try{window.addEventListener('error',function(e){if(e&&e.message&&e.message.indexOf('startTime')!==-1){e.preventDefault();return true;}});window.addEventListener('unhandledrejection',function(e){if(e&&e.reason&&e.reason.message&&e.reason.message.indexOf('startTime')!==-1){e.preventDefault();}});}catch(e){}})();`

const Devtools = () => null

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Finly - B2B Cashflow OS',
      },
      {
        name: 'description',
        content:
          'Finly is a B2B cashflow and financial operating system for agencies, consultants, freelancers, and micro-SMEs.',
      },
      {
        name: 'theme-color',
        content: '#bef264',
      },
    ],
    links: [
      {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap',
      },
      {
        rel: 'icon',
        type: 'image/svg+xml',
        href: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2224%22 fill=%22%23bef264%22/><path d=%22M30 25 h40 v12 H44 v12 h22 v12 H44 v14 H30 Z%22 fill=%22%230f172a%22/></svg>',
      },
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  notFoundComponent: NotFound,
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <HeadContent />
      </head>
      <body className="font-sans antialiased wrap-anywhere selection:bg-primary/30 selection:text-foreground">
        <TooltipProvider delayDuration={0}>
          <Layout>{children}</Layout>
        </TooltipProvider>
        {import.meta.env.DEV && (
          <React.Suspense fallback={null}>
            <Devtools />
          </React.Suspense>
        )}
        <Scripts />
      </body>
    </html>
  )
}
