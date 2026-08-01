import { useEffect, useState } from 'react'
import { Sun, Moon, Monitor } from 'lucide-react'
import { cn } from '../lib/utils'

type ThemeMode = 'light' | 'dark' | 'auto'

function getInitialMode(): ThemeMode {
  if (typeof window === 'undefined') return 'auto'
  const stored = window.localStorage.getItem('theme')
  if (stored === 'light' || stored === 'dark' || stored === 'auto')
    return stored
  return 'auto'
}

function applyThemeMode(mode: ThemeMode) {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const resolved = mode === 'auto' ? (prefersDark ? 'dark' : 'light') : mode
  document.documentElement.classList.remove('light', 'dark')
  document.documentElement.classList.add(resolved)
  if (mode === 'auto') document.documentElement.removeAttribute('data-theme')
  else document.documentElement.setAttribute('data-theme', mode)
  document.documentElement.style.colorScheme = resolved
}

export default function ThemeToggle() {
  const [mode, setMode] = useState<ThemeMode>('auto')
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const initialMode = getInitialMode()
    setMode(initialMode)
    applyThemeMode(initialMode)
  }, [])

  useEffect(() => {
    if (mode !== 'auto') return
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => applyThemeMode('auto')
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [mode])

  function selectMode(nextMode: ThemeMode) {
    setMode(nextMode)
    applyThemeMode(nextMode)
    window.localStorage.setItem('theme', nextMode)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-12 w-12 items-center justify-center border-2 border-border bg-card shadow-brutal-sm hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-none transition-all outline-none"
      >
        {mode === 'light' ? (
          <Sun className="h-5 w-5" />
        ) : mode === 'dark' ? (
          <Moon className="h-5 w-5" />
        ) : (
          <Monitor className="h-5 w-5" />
        )}
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-32 border-2 border-border bg-card shadow-brutal p-1 z-50 flex flex-col gap-1">
          <button
            onClick={() => selectMode('light')}
            className={cn(
              'flex w-full items-center gap-2 px-3 py-2 text-sm font-bold transition-all border-2',
              mode === 'light'
                ? 'bg-accent text-accent-foreground border-border shadow-brutal-sm'
                : 'border-transparent hover:border-border hover:shadow-brutal-sm'
            )}
          >
            <Sun className="h-4 w-4" /> Light
          </button>
          <button
            onClick={() => selectMode('dark')}
            className={cn(
              'flex w-full items-center gap-2 px-3 py-2 text-sm font-bold transition-all border-2',
              mode === 'dark'
                ? 'bg-accent text-accent-foreground border-border shadow-brutal-sm'
                : 'border-transparent hover:border-border hover:shadow-brutal-sm'
            )}
          >
            <Moon className="h-4 w-4" /> Dark
          </button>
          <button
            onClick={() => selectMode('auto')}
            className={cn(
              'flex w-full items-center gap-2 px-3 py-2 text-sm font-bold transition-all border-2',
              mode === 'auto'
                ? 'bg-accent text-accent-foreground border-border shadow-brutal-sm'
                : 'border-transparent hover:border-border hover:shadow-brutal-sm'
            )}
          >
            <Monitor className="h-4 w-4" /> System
          </button>
        </div>
      )}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  )
}
