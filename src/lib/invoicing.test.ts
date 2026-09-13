import { describe, it, expect } from 'vitest'
import { calculateLineTotal, calculateInvoiceTotals } from './invoicing'

describe('invoicing PRD 3.3 calculation engine', () => {
  describe('calculateLineTotal', () => {
    it('calculates line total from unit price in cents and milli quantity', () => {
      const unitPriceInCents = 10000
      const quantityMilli = 1500
      const total = calculateLineTotal(unitPriceInCents, quantityMilli)

      expect(total).toBe(15000)
    })

    it('handles rounding boundaries for fractional quantities', () => {
      const unitPriceInCents = 3333
      const quantityMilli = 333
      const total = calculateLineTotal(unitPriceInCents, quantityMilli)

      expect(total).toBe(Math.round((3333 * 333) / 1000))
    })

    it('returns 0 for negative or zero values', () => {
      expect(calculateLineTotal(0, 1000)).toBe(0)
      expect(calculateLineTotal(1000, 0)).toBe(0)
      expect(calculateLineTotal(-500, 1000)).toBe(0)
    })
  })

  describe('calculateInvoiceTotals', () => {
    it('calculates totals correctly with fixed 100 scale, discount bps, and tax bps', () => {
      const result = calculateInvoiceTotals({
        items: [
          {
            description: 'Item 1',
            quantityMilli: 1000,
            unitPriceInCents: 10000,
          },
          {
            description: 'Item 2',
            quantityMilli: 2000,
            unitPriceInCents: 5000,
          },
        ],
        discountBps: 1000,
        taxBps: 1100,
      })

      expect(result.subtotalInCents).toBe(20000)
      expect(result.discountInCents).toBe(2000)
      expect(result.taxableBaseInCents).toBe(18000)
      expect(result.taxAmountInCents).toBe(1980)
      expect(result.totalInCents).toBe(19980)
    })

    it('handles zero discount and zero tax gracefully', () => {
      const result = calculateInvoiceTotals({
        items: [
          {
            description: 'Flat Fee Service',
            quantityMilli: 1000,
            unitPriceInCents: 50000,
          },
        ],
        discountBps: 0,
        taxBps: 0,
      })

      expect(result.subtotalInCents).toBe(50000)
      expect(result.discountInCents).toBe(0)
      expect(result.taxableBaseInCents).toBe(50000)
      expect(result.taxAmountInCents).toBe(0)
      expect(result.totalInCents).toBe(50000)
    })

    it('handles empty item list', () => {
      const result = calculateInvoiceTotals({
        items: [],
      })

      expect(result.subtotalInCents).toBe(0)
      expect(result.discountInCents).toBe(0)
      expect(result.taxableBaseInCents).toBe(0)
      expect(result.taxAmountInCents).toBe(0)
      expect(result.totalInCents).toBe(0)
    })

    it('clamps basis points within 0 and 10000', () => {
      const result = calculateInvoiceTotals({
        items: [
          {
            description: 'Test Item',
            quantityMilli: 1000,
            unitPriceInCents: 10000,
          },
        ],
        discountBps: 15000,
        taxBps: -500,
      })

      expect(result.discountBps).toBe(10000)
      expect(result.taxBps).toBe(0)
    })
  })
})
