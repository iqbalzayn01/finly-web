import * as React from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'motion/react'
import { ChevronsUpDown, Plus } from './ui/icon'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from './ui/sidebar'
import { useSubscription } from '../lib/subscription'
import { cn } from '../lib/utils'

export interface BusinessTeam {
  name: string
  logo: React.ElementType
  plan: string
}

type DropdownSide = 'right' | 'left' | 'bottom' | 'top'

interface Coords {
  top?: number
  bottom?: number
  left: number
  width: number
  side: DropdownSide
}

export function TeamSwitcher({ teams }: { teams: BusinessTeam[] }) {
  const { isMobile, state } = useSidebar()
  const { isPro } = useSubscription()
  const [activeTeam, setActiveTeam] = React.useState(teams[0])
  const [isOpen, setIsOpen] = React.useState(false)
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const menuRef = React.useRef<HTMLDivElement>(null)
  const [coords, setCoords] = React.useState<Coords>({
    left: 0,
    width: 240,
    side: 'bottom',
  })

  const isCollapsed = state === 'collapsed' && !isMobile
  const ActiveLogo = activeTeam.logo

  // Dynamically calculate flexible floating position
  const updatePosition = React.useCallback(() => {
    if (!triggerRef.current) return
    const rect = triggerRef.current.getBoundingClientRect()
    const isSmallScreen = isMobile || window.innerWidth < 768
    const collapsed = state === 'collapsed' && !isSmallScreen
    const menuWidth = isSmallScreen
      ? Math.min(window.innerWidth - 24, Math.max(rect.width, 260))
      : 240
    const menuHeight = 280

    if (isSmallScreen) {
      // On smaller screens, dropdown appears at the bottom
      const safeLeft = Math.max(
        12,
        Math.min(rect.left, window.innerWidth - menuWidth - 12),
      )
      setCoords({
        top: rect.bottom + 8,
        left: safeLeft,
        width: menuWidth,
        side: 'bottom',
      })
    } else if (collapsed) {
      // Desktop collapsed: appear on right (or left if near right viewport edge)
      const fitsOnRight = rect.right + 10 + menuWidth <= window.innerWidth - 12
      const side: DropdownSide = fitsOnRight ? 'right' : 'left'
      const left = fitsOnRight ? rect.right + 10 : rect.left - menuWidth - 10
      const top = Math.max(
        12,
        Math.min(rect.top, window.innerHeight - menuHeight - 12),
      )

      setCoords({
        top,
        left,
        width: menuWidth,
        side,
      })
    } else {
      // Desktop expanded: appear below header
      setCoords({
        top: rect.bottom + 8,
        left: rect.left,
        width: Math.max(rect.width, 240),
        side: 'bottom',
      })
    }
  }, [state, isMobile])

  React.useEffect(() => {
    if (isOpen) {
      updatePosition()
      window.addEventListener('resize', updatePosition)
      window.addEventListener('scroll', updatePosition, true)
      return () => {
        window.removeEventListener('resize', updatePosition)
        window.removeEventListener('scroll', updatePosition, true)
      }
    }
  }, [isOpen, updatePosition])

  // Close on outside click or Escape key
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        triggerRef.current &&
        !triggerRef.current.contains(target)
      ) {
        setIsOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleKeyDown)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
        document.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [isOpen])

  const getInitialAnimation = (side: DropdownSide) => {
    switch (side) {
      case 'right':
        return { opacity: 0, x: -8, scale: 0.96 }
      case 'left':
        return { opacity: 0, x: 8, scale: 0.96 }
      case 'top':
        return { opacity: 0, y: 8, scale: 0.96 }
      case 'bottom':
      default:
        return { opacity: 0, y: -8, scale: 0.96 }
    }
  }

  const getExitAnimation = (side: DropdownSide) => {
    switch (side) {
      case 'right':
        return { opacity: 0, x: -6, scale: 0.96 }
      case 'left':
        return { opacity: 0, x: 6, scale: 0.96 }
      case 'top':
        return { opacity: 0, y: 6, scale: 0.96 }
      case 'bottom':
      default:
        return { opacity: 0, y: -6, scale: 0.96 }
    }
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          ref={triggerRef}
          size="lg"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          className={cn(
            'group-data-[collapsible=icon]:!size-10 group-data-[collapsible=icon]:!p-0 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:mx-auto cursor-pointer rounded-xl h-12 transition-all duration-150',
            isOpen
              ? 'bg-sidebar-accent text-sidebar-accent-foreground border border-primary/20'
              : 'hover:bg-accent/50',
          )}
        >
          <div
            className={cn(
              'flex aspect-square size-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-indigo-600 text-white font-black shrink-0 shadow-xs transition-all',
              isPro
                ? 'border-2 border-primary ring-2 ring-primary/20'
                : 'border border-border',
            )}
          >
            <ActiveLogo className="size-4 shrink-0 text-white" />
          </div>
          {!isCollapsed && (
            <>
              <div className="grid flex-1 text-left text-xs leading-tight min-w-0">
                <div className="flex items-center gap-1.5 truncate">
                  <span className="truncate font-bold text-foreground tracking-tight">
                    {activeTeam.name}
                  </span>
                  {isPro && (
                    <span className="px-1.5 py-0.2 rounded-md bg-primary text-primary-foreground text-[9px] font-black tracking-wider uppercase shrink-0">
                      PRO
                    </span>
                  )}
                </div>
                <span className="truncate text-[10px] text-muted-foreground font-medium">
                  {isPro ? 'Pro Workspace' : activeTeam.plan}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-3.5 text-muted-foreground shrink-0" />
            </>
          )}
        </SidebarMenuButton>

        {typeof document !== 'undefined' &&
          createPortal(
            <AnimatePresence>
              {isOpen && (
                <div ref={menuRef}>
                  <motion.div
                    initial={getInitialAnimation(coords.side)}
                    animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                    exit={getExitAnimation(coords.side)}
                    transition={{
                      type: 'spring',
                      stiffness: 450,
                      damping: 28,
                    }}
                    style={{
                      position: 'fixed',
                      top:
                        coords.top !== undefined
                          ? `${coords.top}px`
                          : undefined,
                      bottom:
                        coords.bottom !== undefined
                          ? `${coords.bottom}px`
                          : undefined,
                      left: `${coords.left}px`,
                      width: `${coords.width}px`,
                      zIndex: 9999,
                    }}
                    className="bg-card/95 backdrop-blur-xl border border-border/80 rounded-2xl shadow-xl p-1.5 flex flex-col gap-1 select-none overflow-hidden"
                  >
                    <div className="px-2.5 py-1.5 text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                      Businesses
                    </div>
                    {teams.map((team, index) => {
                      const TeamLogo = team.logo
                      const isCurrent = team.name === activeTeam.name

                      return (
                        <button
                          key={team.name}
                          onClick={() => {
                            setActiveTeam(team)
                            setIsOpen(false)
                          }}
                          className={cn(
                            'flex items-center gap-2.5 p-2 rounded-xl cursor-pointer text-left transition-all duration-150 w-full',
                            isCurrent
                              ? 'bg-primary/10 text-primary font-bold border border-primary/20'
                              : 'hover:bg-accent/60 hover:text-foreground text-foreground border border-transparent',
                          )}
                        >
                          <div className="flex size-6.5 items-center justify-center rounded-lg border border-border bg-background shrink-0 shadow-2xs">
                            <TeamLogo className="size-3.5" />
                          </div>
                          <div className="flex flex-col min-w-0 flex-1">
                            <span className="font-semibold text-xs truncate">
                              {team.name}
                            </span>
                            <span className="text-[10px] text-muted-foreground truncate font-medium">
                              {team.plan}
                            </span>
                          </div>
                          <span className="ml-auto text-[10px] font-mono tracking-widest text-muted-foreground font-medium">
                            ⌘{index + 1}
                          </span>
                        </button>
                      )
                    })}
                    <div className="-mx-1.5 my-0.5 h-px bg-border/60" />
                    <button
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2 p-2 rounded-xl cursor-pointer hover:bg-accent hover:text-accent-foreground text-muted-foreground text-left w-full transition-colors text-xs font-semibold"
                    >
                      <div className="flex size-6.5 items-center justify-center rounded-lg border border-border bg-background shrink-0">
                        <Plus className="size-3.5 text-muted-foreground" />
                      </div>
                      <span>Add business</span>
                    </button>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>,
            document.body,
          )}
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
