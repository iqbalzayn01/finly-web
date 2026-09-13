import { describe, it, expect } from 'vitest'
import {
  formatMoney,
  formatAmount,
  majorToMinor,
  minorToMajor,
  getCurrencySymbol,
  SUPPORTED_CURRENCIES,
} from './currency'

describe('currency utilities', () => {
  describe('majorToMinor & minorToMajor', () => {
    it('converts major units to minor integer cents (scale 100)', () => {
      expect(majorToMinor(50)).toBe(5000)
      expect(majorToMinor(12.5)).toBe(1250)
      expect(majorToMinor(0)).toBe(0)
    })

    it('converts minor integer cents to major units', () => {
      expect(minorToMajor(5000)).toBe(50)
      expect(minorToMajor(1250)).toBe(12.5)
      expect(minorToMajor(0)).toBe(0)
    })
  })

  describe('getCurrencySymbol', () => {
    it('returns the correct symbol for all supported currencies', () => {
      expect(getCurrencySymbol('USD')).toBe('$')
      expect(getCurrencySymbol('IDR')).toBe('Rp')
      expect(getCurrencySymbol('EUR')).toBe('€')
      expect(getCurrencySymbol('GBP')).toBe('£')
      expect(getCurrencySymbol('SGD')).toBe('S$')
      expect(getCurrencySymbol('AUD')).toBe('A$')
      expect(getCurrencySymbol('CAD')).toBe('C$')
      expect(getCurrencySymbol('JPY')).toBe('¥')
    })
  })

  describe('formatMoney', () => {
    it('formats USD correctly with 2 decimal places', () => {
      const formatted = formatMoney(5000, 'USD')
      expect(formatted).toContain('50.00')
    })

    it('formats IDR correctly without floating decimals', () => {
      const formatted = formatMoney(5000000, 'IDR')
      expect(formatted).toBe('Rp 50.000')
    })

    it('formats JPY without decimal cents', () => {
      const formatted = formatMoney(150000, 'JPY')
      expect(formatted).toBe('¥1,500')
    })

    it('handles zero or undefined amounts cleanly', () => {
      expect(formatMoney(0, 'USD')).toContain('0.00')
      expect(formatMoney(0, 'IDR')).toBe('Rp 0')
    })
  })

  describe('formatAmount', () => {
    it('formats amounts supplied in major units', () => {
      const formatted = formatAmount(100, 'USD')
      expect(formatted).toContain('100.00')
    })
  })

  describe('SUPPORTED_CURRENCIES', () => {
    it('has minorUnitScale of 100 for all supported currencies', () => {
      Object.values(SUPPORTED_CURRENCIES).forEach((config) => {
        expect(config.minorUnitScale).toBe(100)
      })
    })
  })
})
