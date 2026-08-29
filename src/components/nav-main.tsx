import * as React from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from './ui/sidebar'
import { cn } from '../lib/utils'

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
    <SidebarGroup className="p-0 w-full">
      <SidebarGroupLabel className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">
        {!isCollapsed && 'Platform'}
      </SidebarGroupLabel>
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
              className="w-full flex justify-center"
            >
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                isActive={isActive}
                className="h-10 rounded-xl w-full"
              >
                <Link
                  to={item.url}
                  className={cn(
                    'flex items-center rounded-xl text-xs font-semibold transition-all duration-150 outline-none select-none',
                    isCollapsed
                      ? 'justify-center size-10 mx-auto p-0'
                      : 'w-full px-3 py-2.5 gap-3',
                    isActive
                      ? 'bg-primary/10 text-primary font-bold border border-primary/20'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent/50',
                  )}
                >
                  {Icon && (
                    <Icon
                      className={cn(
                        'shrink-0 transition-transform duration-150',
                        isCollapsed ? 'size-5' : 'size-4.5',
                        isActive ? 'text-primary' : 'text-muted-foreground',
                      )}
                    />
                  )}
                  {!isCollapsed && (
                    <span className="truncate font-semibold tracking-tight">
                      {item.title}
                    </span>
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
