import { useEffect, useState, useRef } from 'react'
import { Paintbrush, Hexagon, Circle, Square, Sparkles } from 'lucide-react'
import { cn } from '../lib/utils'
import { useUIStore } from '../store/ui-store'

import { motion, AnimatePresence } from 'motion/react'

export default function StyleToggle() {
  const { styleMode, setStyleMode } = useUIStore()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  useEffect(() => {
    // Initialize class on mount
    setStyleMode(styleMode)
  }, [])

  function selectMode(nextMode: any) {
    setStyleMode(nextMode)
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        title="Toggle UI Style"
        className="flex h-12 w-12 items-center justify-center border-2 border-border bg-card shadow-brutal-sm hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-none transition-all outline-none"
      >
        <Paintbrush className="h-5 w-5" />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 450, damping: 28 }}
            className="absolute right-0 mt-2 w-56 border-2 border-border bg-card shadow-brutal p-1 z-50 flex flex-col gap-1"
          >
            <button
              onClick={() => selectMode('brutal')}
              className={cn(
                'flex w-full items-center gap-2 px-3 py-2 text-sm font-bold transition-all border-2',
                styleMode === 'brutal'
                  ? 'bg-accent text-accent-foreground border-border shadow-brutal-sm'
                  : 'border-transparent hover:border-border hover:shadow-brutal-sm'
              )}
            >
              <Square className="h-4 w-4" /> v1 Brutalist
            </button>
            <button
              onClick={() => selectMode('professional')}
              className={cn(
                'flex w-full items-center gap-2 px-3 py-2 text-sm font-bold transition-all border-2',
                styleMode === 'professional'
                  ? 'bg-accent text-accent-foreground border-border shadow-brutal-sm'
                  : 'border-transparent hover:border-border hover:shadow-brutal-sm'
              )}
            >
              <Circle className="h-4 w-4" /> v2 Professional
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
