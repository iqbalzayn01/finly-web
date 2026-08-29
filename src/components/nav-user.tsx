import * as React from 'react'
import { createPortal } from 'react-dom'
import { Link } from '@tanstack/react-router'
import { motion, AnimatePresence } from 'motion/react'
import {
  BadgeCheck,
  ChevronsUpDown,
  LogOut,
  Sparkles,
  Settings2,
} from './ui/icon'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from './ui/sidebar'
import { useSubscription } from '../lib/subscription'
import { LogoutModal } from './ui/logout-modal'
import { cn } from '../lib/utils'

export interface UserProfile {
  name: string
  email: string
  avatar: string
  role?: string
}

type DropdownSide = 'right' | 'left' | 'top' | 'bottom'

interface Coords {
  top?: number
  bottom?: number
  left: number
  width: number
  side: DropdownSide
}

export function NavUser({ user }: { user: UserProfile }) {
  const { isMobile, state } = useSidebar()
  const { isPro } = useSubscription()
  const [isOpen, setIsOpen] = React.useState(false)
  const [logoutOpen, setLogoutOpen] = React.useState(false)
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const menuRef = React.useRef<HTMLDivElement>(null)
  const [coords, setCoords] = React.useState<Coords>({
    left: 0,
    width: 240,
    side: 'top',
  })

  const isCollapsed = state === 'collapsed' && !isMobile

  const userInitials = user.name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  // Dynamically calculate flexible floating position
  const updatePosition = React.useCallback(() => {
    if (!triggerRef.current) return
    const rect = triggerRef.current.getBoundingClientRect()
    const isSmallScreen = isMobile || window.innerWidth < 768
    const collapsed = state === 'collapsed' && !isSmallScreen
    const menuWidth = isSmallScreen
      ? Math.min(window.innerWidth - 24, Math.max(rect.width, 260))
      : 240
    const menuHeight = 260

    if (isSmallScreen) {
      // On smaller screens, appear at bottom if room, or neatly docked above the trigger
      const safeLeft = Math.max(
        12,
        Math.min(rect.left, window.innerWidth - menuWidth - 12),
      )
      const fitsBelow = rect.bottom + 8 + menuHeight <= window.innerHeight - 12

      if (fitsBelow) {
        setCoords({
          top: rect.bottom + 8,
          left: safeLeft,
          width: menuWidth,
          side: 'bottom',
        })
      } else {
        setCoords({
          bottom: Math.max(12, window.innerHeight - rect.top + 8),
          left: safeLeft,
          width: menuWidth,
          side: 'top',
        })
      }
    } else if (collapsed) {
      // Desktop collapsed: appear on right (or left if near right viewport edge)
      const fitsOnRight = rect.right + 10 + menuWidth <= window.innerWidth - 12
      const side: DropdownSide = fitsOnRight ? 'right' : 'left'
      const left = fitsOnRight ? rect.right + 10 : rect.left - menuWidth - 10
      const top = Math.max(
        12,
        Math.min(
          rect.bottom - menuHeight,
          window.innerHeight - menuHeight - 12,
        ),
      )

      setCoords({
        top,
        left,
        width: menuWidth,
        side,
      })
    } else {
      // Desktop expanded: appear above footer
      const fitsAbove = rect.top - menuHeight - 8 >= 12
      if (fitsAbove) {
        setCoords({
          bottom: window.innerHeight - rect.top + 8,
          left: rect.left,
          width: Math.max(rect.width, 240),
          side: 'top',
        })
      } else {
        setCoords({
          top: rect.bottom + 8,
          left: rect.left,
          width: Math.max(rect.width, 240),
          side: 'bottom',
        })
      }
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
    <>
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
            <Avatar
              className={cn(
                'size-8.5 rounded-xl shrink-0 shadow-2xs transition-all',
                isPro
                  ? 'border-2 border-primary ring-2 ring-primary/20'
                  : 'border border-border',
              )}
            >
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="rounded-xl bg-primary/10 text-primary font-bold text-xs">
                {userInitials || 'US'}
              </AvatarFallback>
            </Avatar>
            {!isCollapsed && (
              <>
                <div className="grid flex-1 text-left text-xs leading-tight min-w-0">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="truncate font-bold text-foreground tracking-tight">
                      {user.name}
                    </span>
                    {isPro && (
                      <span className="px-1.5 py-0.2 rounded-md bg-primary text-primary-foreground text-[9px] font-black tracking-wider uppercase shrink-0">
                        PRO
                      </span>
                    )}
                  </div>
                  <span className="truncate text-[10px] text-muted-foreground font-medium">
                    {user.email}
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
                      <div className="flex items-center gap-2.5 px-2.5 py-2 text-left text-xs border-b border-border/60 mb-0.5">
                        <Avatar
                          className={cn(
                            'size-8 rounded-xl shrink-0 shadow-2xs transition-all',
                            isPro
                              ? 'border-2 border-primary ring-2 ring-primary/20'
                              : 'border border-border',
                          )}
                        >
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback className="rounded-xl bg-primary/10 text-primary font-bold text-xs">
                            {userInitials || 'US'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-xs leading-tight min-w-0">
                          <div className="flex items-center gap-1.5 truncate">
                            <span className="truncate font-bold text-foreground">
                              {user.name}
                            </span>
                            {isPro && (
                              <span className="px-1.5 py-0.2 rounded-md bg-primary text-primary-foreground text-[9px] font-black tracking-wider uppercase shrink-0">
                                PRO
                              </span>
                            )}
                          </div>
                          <span className="truncate text-[10px] text-muted-foreground font-medium">
                            {user.email}
                          </span>
                        </div>
                      </div>

                      <Link
                        to="/pricing"
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          'flex items-center gap-2 px-2.5 py-2 text-xs font-semibold rounded-xl transition-colors cursor-pointer w-full border',
                          isPro
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                            : 'bg-primary/5 text-primary border-primary/15 hover:bg-primary/15',
                        )}
                      >
                        <Sparkles className="size-3.5 shrink-0" />
                        <span>
                          {isPro ? 'Manage Pro Plan' : 'Upgrade to Pro'}
                        </span>
                      </Link>

                      <div className="-mx-1.5 my-0.5 h-px bg-border/60" />

                      <Link
                        to="/account"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-2 px-2.5 py-2 text-xs font-semibold text-foreground rounded-xl hover:bg-accent/60 transition-colors cursor-pointer w-full"
                      >
                        <BadgeCheck className="size-3.5 text-muted-foreground shrink-0" />
                        <span>Account Profile</span>
                      </Link>

                      <Link
                        to="/settings"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-2 px-2.5 py-2 text-xs font-semibold text-foreground rounded-xl hover:bg-accent/60 transition-colors cursor-pointer w-full"
                      >
                        <Settings2 className="size-3.5 text-muted-foreground shrink-0" />
                        <span>Settings</span>
                      </Link>

                      <div className="-mx-1.5 my-0.5 h-px bg-border/60" />

                      <button
                        onClick={() => {
                          setIsOpen(false)
                          setLogoutOpen(true)
                        }}
                        className="flex items-center gap-2 px-2.5 py-2 text-xs text-destructive font-semibold rounded-xl hover:bg-destructive/10 transition-colors cursor-pointer w-full text-left"
                      >
                        <LogOut className="size-3.5 shrink-0" />
                        <span>Sign out</span>
                      </button>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>,
              document.body,
            )}
        </SidebarMenuItem>
      </SidebarMenu>

      <LogoutModal
        open={logoutOpen}
        onOpenChange={setLogoutOpen}
        onLogout={() => {
          window.location.href = '/'
        }}
      />
    </>
  )
}
