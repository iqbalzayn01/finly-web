import * as React from 'react'
import {
  LayoutDashboard,
  Wallet,
  FileText,
  Users,
  Package,
  Settings2,
  Briefcase,
} from './ui/icon'
import { NavMain } from './nav-main'
import type { NavigationItem } from './nav-main'
import { NavUser } from './nav-user'
import type { UserProfile } from './nav-user'
import { TeamSwitcher } from './team-switcher'
import type { BusinessTeam } from './team-switcher'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from './ui/sidebar'

const finlyTeams: BusinessTeam[] = [
  {
    name: 'Finly Technologies',
    logo: Wallet,
    plan: 'Enterprise Pro',
  },
  {
    name: 'Nexus Studio',
    logo: Briefcase,
    plan: 'Agency Growth',
  },
  {
    name: 'Acme Consulting',
    logo: FileText,
    plan: 'Free Starter',
  },
]

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

const currentUserProfile: UserProfile = {
  name: 'Iqbal Zayn',
  email: 'iqbal@finly.io',
  avatar: '',
  role: 'Owner',
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={finlyTeams} />
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
