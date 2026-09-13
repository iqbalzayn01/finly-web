export interface InvoiceLineItemInput {
  description: string
  quantityMilli: number
  unitPriceInCents: number
  taxBps?: number
}

export interface CalculatedLineItem {
  description: string
  quantityMilli: number
  unitPriceInCents: number
  lineTotalInCents: number
  taxBps: number
}

export interface InvoiceTotalsInput {
  items: InvoiceLineItemInput[]
  discountBps?: number
  taxBps?: number
}

export interface InvoiceTotalsResult {
  items: CalculatedLineItem[]
  subtotalInCents: number
  discountBps: number
  discountInCents: number
  taxableBaseInCents: number
  taxBps: number
  taxAmountInCents: number
  totalInCents: number
}

export function calculateLineTotal(
  unitPriceInCents: number,
  quantityMilli: number,
): number {
  if (unitPriceInCents <= 0 || quantityMilli <= 0) return 0
  return Math.round((unitPriceInCents * quantityMilli) / 1000)
}

export function calculateInvoiceTotals(
  input: InvoiceTotalsInput,
): InvoiceTotalsResult {
  const discountBps = Math.max(
    0,
    Math.min(10000, Math.round(input.discountBps ?? 0)),
  )
  const taxBps = Math.max(0, Math.min(10000, Math.round(input.taxBps ?? 1100)))

  const items: CalculatedLineItem[] = input.items.map((item) => {
    const quantityMilli = Math.max(0, Math.round(item.quantityMilli))
    const unitPriceInCents = Math.max(0, Math.round(item.unitPriceInCents))
    const lineTotalInCents = calculateLineTotal(unitPriceInCents, quantityMilli)
    const itemTaxBps =
      item.taxBps !== undefined
        ? Math.max(0, Math.min(10000, Math.round(item.taxBps)))
        : taxBps

    return {
      description: item.description.trim(),
      quantityMilli,
      unitPriceInCents,
      lineTotalInCents,
      taxBps: itemTaxBps,
    }
  })

  const subtotalInCents = items.reduce(
    (acc, curr) => acc + curr.lineTotalInCents,
    0,
  )
  const discountInCents = Math.round((subtotalInCents * discountBps) / 10000)
  const taxableBaseInCents = Math.max(0, subtotalInCents - discountInCents)
  const taxAmountInCents = Math.round((taxableBaseInCents * taxBps) / 10000)
  const totalInCents = taxableBaseInCents + taxAmountInCents

  return {
    items,
    subtotalInCents,
    discountBps,
    discountInCents,
    taxableBaseInCents,
    taxBps,
    taxAmountInCents,
    totalInCents,
  }
}
