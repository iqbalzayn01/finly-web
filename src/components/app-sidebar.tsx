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

import teamsData from '../data/teams.json'

const ICONS: Record<string, React.ElementType> = {
  Wallet,
  Briefcase,
  FileText,
}

const finlyTeams: BusinessTeam[] = teamsData.teams.map((t) => ({
  name: t.name,
  logo: ICONS[t.iconName] || Wallet,
  plan: t.plan,
}))

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

const currentUserProfile: UserProfile = teamsData.currentUser as UserProfile

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
