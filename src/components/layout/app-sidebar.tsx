import * as React from 'react'
import {
  LayoutDashboard,
  Wallet,
  FileText,
  Users,
  Package,
  Settings2,
} from '../ui/icon'
import { NavMain } from './nav-main'
import type { NavigationItem } from './nav-main'
import { NavUser } from './nav-user'
import type { UserProfile } from './nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '../ui/sidebar'
import teamsData from '../../data/teams.json'

const finlyNavigationItems: NavigationItem[] = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Cashbook',
    url: '/cashbook',
    icon: Wallet,
  },
  {
    title: 'Invoices',
    url: '/invoices',
    icon: FileText,
  },
  {
    title: 'Customers',
    url: '/customers',
    icon: Users,
  },
  {
    title: 'Catalog Items',
    url: '/items',
    icon: Package,
  },
  {
    title: 'Settings',
    url: '/settings',
    icon: Settings2,
  },
]

const currentUserProfile: UserProfile = teamsData.currentUser

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="bg-primary aspect-square flex items-center justify-center rounded-md h-9 sm:h-10">
          <span className="font-black">F</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={finlyNavigationItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={currentUserProfile} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
