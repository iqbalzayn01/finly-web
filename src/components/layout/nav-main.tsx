import * as React from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '../ui/sidebar'
import { Search, X } from '../ui/icon'
import { cn } from '../../lib/utils'

export interface NavigationItem {
  title: string
  url: string
  icon?: React.ElementType
  isActive?: boolean
}

export function NavMain({ items }: { items: NavigationItem[] }) {
  const location = useLocation()
  const { isMobile, state } = useSidebar()
  const isCollapsed = state === 'collapsed' && !isMobile
  const [searchQuery, setSearchQuery] = React.useState('')

  const filteredItems = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return items
    return items.filter((item) => item.title.toLowerCase().includes(q))
  }, [items, searchQuery])

  return (
    <div className="flex flex-col gap-1 w-full">
      <SidebarGroup className="p-0 w-full mb-1 group-data-[collapsible=icon]:hidden">
        <SidebarGroupContent className="relative">
          <form
            role="search"
            onSubmit={(e) => e.preventDefault()}
            className="relative w-full"
          >
            <label htmlFor="sidebar-search" className="sr-only">
              Search Platform
            </label>
            <SidebarInput
              id="sidebar-search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="pl-8 pr-7 text-xs h-8 bg-background/60 dark:bg-background/40 border-sidebar-border focus-visible:ring-1 focus-visible:ring-primary/40 rounded-md"
            />
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 select-none text-muted-foreground" />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                aria-label="Clear search"
              >
                <X className="size-3" />
              </button>
            ) : null}
          </form>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarGroup className="p-0 w-full">
        <SidebarGroupLabel>Platform</SidebarGroupLabel>
        <SidebarMenu className="gap-1.5 w-full">
          {filteredItems.map((item) => {
            const Icon = item.icon
            const isActive =
              item.isActive ??
              (location.pathname === item.url ||
                (item.url !== '/dashboard' &&
                  location.pathname.startsWith(item.url)))

            return (
              <SidebarMenuItem
                key={item.title}
                className="w-full list-none m-0 p-0"
              >
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  className={cn(
                    'w-full h-9 sm:h-10 px-3 text-xs sm:text-sm font-semibold rounded-md transition-colors cursor-pointer select-none group-data-[collapsible=icon]:px-0',
                    isActive
                      ? 'bg-primary/50 text-primary-foreground font-bold hover:bg-primary hover:text-primary-foreground'
                      : 'text-muted-foreground hover:bg-slate-500/10 dark:hover:bg-slate-500/20 hover:text-foreground',
                  )}
                >
                  <Link
                    to={item.url}
                    className="flex items-center gap-3 w-full group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0"
                  >
                    {Icon && (
                      <Icon
                        className={cn(
                          'h-4 w-4 shrink-0 transition-transform duration-200',
                        )}
                      />
                    )}
                    <span
                      className={cn(
                        'truncate text-xs font-semibold tracking-tight',
                        isCollapsed && 'hidden',
                      )}
                    >
                      {item.title}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
          {filteredItems.length === 0 && (
            <li className="px-2 py-3 text-center text-xs text-muted-foreground">
              No menu found
            </li>
          )}
        </SidebarMenu>
      </SidebarGroup>
    </div>
  )
}
