import * as React from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '../ui/sidebar'
import { SidebarSearch } from './sidebar-search'
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

  return (
    <div className="flex flex-col gap-1 w-full">
      <SidebarGroup className="p-0 w-full mb-1 group-data-[collapsible=icon]:hidden">
        <SidebarGroupContent className="relative">
          <SidebarSearch />
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarGroup className="p-0 w-full">
        <SidebarGroupLabel>Platform</SidebarGroupLabel>
        <SidebarMenu className="gap-1.5 w-full">
          {items.map((item) => {
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
                      ? 'bg-primary text-primary-foreground font-bold hover:bg-primary hover:text-primary-foreground'
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
        </SidebarMenu>
      </SidebarGroup>
    </div>
  )
}
