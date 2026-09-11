export interface NotificationItem {
  id: string
  title: string
  description: string
  time: string
  unread: boolean
  indicator: 'primary' | 'amber' | null
}
