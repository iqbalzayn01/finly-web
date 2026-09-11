export interface Item {
  id: number
  name: string
  price: number
  unit: string
  taxRate: number
  active: boolean
}

export type ItemStatusFilter = 'all' | 'active' | 'inactive'
