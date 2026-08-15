import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '../../lib/utils'

export function V2Tooltip({
  children,
  content,
  preferredSide = 'auto',
}: {
  children: React.ReactNode
  content: string
  preferredSide?: 'auto' | 'right' | 'left' | 'top' | 'bottom'
}) {
  const [isHovered, setIsHovered] = useState(false)
  const [adjustedSide, setAdjustedSide] = useState<
    'right' | 'left' | 'top' | 'bottom'
  >('right')
  const containerRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isHovered && containerRef.current && tooltipRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect()
      const tooltipRect = tooltipRef.current.getBoundingClientRect()
      const vw = window.innerWidth
      const vh = window.innerHeight
      const padding = 12

      let side: 'right' | 'left' | 'top' | 'bottom' =
        preferredSide === 'auto' ? 'right' : preferredSide

      // Collision checks
      if (
        (side === 'right' || preferredSide === 'auto') &&
        containerRect.right + tooltipRect.width + padding > vw
      ) {
        if (containerRect.left - tooltipRect.width - padding >= 0) {
          side = 'left'
        } else {
          side = containerRect.top > vh / 2 ? 'top' : 'bottom'
        }
      } else if (
        side === 'left' &&
        containerRect.left - tooltipRect.width - padding < 0
      ) {
        side = 'right'
      }

      if (
        side === 'top' &&
        containerRect.top - tooltipRect.height - padding < 0
      ) {
        side = 'bottom'
      } else if (
        side === 'bottom' &&
        containerRect.bottom + tooltipRect.height + padding > vh
      ) {
        side = 'top'
      }

      setAdjustedSide(side)
    }
  }, [isHovered, preferredSide])

  const getPositionClasses = () => {
    switch (adjustedSide) {
      case 'left':
        return 'right-full mr-3 top-1/2 -translate-y-1/2'
      case 'top':
        return 'bottom-full mb-3 left-1/2 -translate-x-1/2'
      case 'bottom':
        return 'top-full mt-3 left-1/2 -translate-x-1/2'
      case 'right':
      default:
        return 'left-full ml-3 top-1/2 -translate-y-1/2'
    }
  }

  const getArrowClasses = () => {
    switch (adjustedSide) {
      case 'left':
        return '-right-1 top-1/2 -translate-y-1/2 border-r border-t'
      case 'top':
        return '-bottom-1 left-1/2 -translate-x-1/2 border-r border-b'
      case 'bottom':
        return '-top-1 left-1/2 -translate-x-1/2 border-l border-t'
      case 'right':
      default:
        return '-left-1 top-1/2 -translate-y-1/2 border-l border-b'
    }
  }

  const getInitialAnimation = () => {
    switch (adjustedSide) {
      case 'left':
        return { opacity: 0, x: 6, scale: 0.95 }
      case 'top':
        return { opacity: 0, y: 6, scale: 0.95 }
      case 'bottom':
        return { opacity: 0, y: -6, scale: 0.95 }
      case 'right':
      default:
        return { opacity: 0, x: -6, scale: 0.95 }
    }
  }

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            ref={tooltipRef}
            initial={getInitialAnimation()}
            animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 450, damping: 28 }}
            className={cn(
              'absolute px-2.5 py-1.5 rounded-lg bg-card border border-border text-foreground text-[11px] font-semibold shadow-none whitespace-nowrap z-50 pointer-events-none',
              getPositionClasses()
            )}
          >
            {content}
            <div
              className={cn(
                'absolute w-2 h-2 rotate-45 bg-card border-border',
                getArrowClasses()
              )}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
