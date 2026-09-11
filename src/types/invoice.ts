export type InvoiceStatus = 'paid' | 'unpaid' | 'void' | 'draft'

export interface InvoiceListItem {
  id: string
  client: string
  date: string
  due: string
  amount: number
  status: InvoiceStatus
}

export interface InvoiceClient {
  name: string
  email: string
  address: string
  taxId: string
}

export interface InvoiceLineItem {
  desc: string
  qty: number
  price: number
  total: number
}

export interface InvoiceDetail {
  id: string
  status: InvoiceStatus
  issueDate: string
  dueDate: string
  subtotal: number
  tax: number
  total: number
  client: InvoiceClient
  items: InvoiceLineItem[]
}
