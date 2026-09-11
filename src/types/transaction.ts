export type TransactionType = 'income' | 'expense' | 'all'

export type TransactionScope = 'Business' | 'Personal' | 'all'

export interface Transaction {
  id: number
  date: string
  desc: string
  category: string
  scope: 'Business' | 'Personal'
  amount: number
  type: 'income' | 'expense'
  receipt: boolean
}

export interface CategoryGroup {
  group: string
  items: string[]
  badge: string
  dot: string
}
