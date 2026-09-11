export interface Customer {
  id: number
  name: string
  email: string
  phone: string
  address: string
  term: number
  spent: number
}

export type CustomerTermFilter = 'all' | '7' | '14' | '30'
