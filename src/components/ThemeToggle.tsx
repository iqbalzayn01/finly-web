import { useState, useEffect, useRef } from 'react'
import { Sun, Moon, Monitor } from './ui/icon'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '../lib/utils'
import { TooltipSimple } from './ui/tooltip'

export type ThemeMode = 'light' | 'dark' | 'auto'

export function ThemeToggle() {
  const [mode, setMode] = useState<ThemeMode>('auto')
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const stored = window.localStorage.getItem('theme')
    const savedTheme: ThemeMode =
      stored === 'light' || stored === 'dark' || stored === 'auto'
        ? stored
        : 'auto'
    setMode(savedTheme)
    applyThemeMode(savedTheme)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const applyThemeMode = (newMode: ThemeMode) => {
    if (newMode === 'dark') {
      document.documentElement.classList.add('dark')
    } else if (newMode === 'light') {
      document.documentElement.classList.remove('dark')
    } else {
      // Auto / System
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  }

  const selectMode = (nextMode: ThemeMode) => {
    setMode(nextMode)
    applyThemeMode(nextMode)
    window.localStorage.setItem('theme', nextMode)
    setIsOpen(false)
  }

  const toggleButton = (
    <button
      onClick={() => setIsOpen(!isOpen)}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-none hover:bg-accent transition-all outline-none cursor-pointer"
      aria-label="Toggle Theme"
    >
      {mode === 'light' ? (
        <Sun className="h-4 w-4" />
      ) : mode === 'dark' ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Monitor className="h-4 w-4" />
      )}
    </button>
  )

  const tooltipLabel = `Theme: ${mode === 'light' ? 'Light' : mode === 'dark' ? 'Dark' : 'System'}`

  return (
    <div className="relative" ref={menuRef}>
      {!isOpen ? (
        <TooltipSimple content={tooltipLabel}>{toggleButton}</TooltipSimple>
      ) : (
        toggleButton
      )}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 450, damping: 28 }}
            className="absolute right-0 mt-2 w-36 border border-border bg-card rounded-xl shadow-none p-1 z-50 flex flex-col gap-0.5"
          >
            <button
              onClick={() => selectMode('light')}
              className={cn(
                'flex w-full items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg transition-all',
                mode === 'light'
                  ? 'bg-primary text-primary-foreground font-semibold'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/50',
              )}
            >
              <Sun className="h-3.5 w-3.5" /> Light
            </button>
            <button
              onClick={() => selectMode('dark')}
              className={cn(
                'flex w-full items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg transition-all',
                mode === 'dark'
                  ? 'bg-primary text-primary-foreground font-semibold'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/50',
              )}
            >
              <Moon className="h-3.5 w-3.5" /> Dark
            </button>
            <button
              onClick={() => selectMode('auto')}
              className={cn(
                'flex w-full items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg transition-all',
                mode === 'auto'
                  ? 'bg-primary text-primary-foreground font-semibold'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/50',
              )}
            >
              <Monitor className="h-3.5 w-3.5" /> System
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
