import * as React from 'react'

export type CurrencyCode =
  'USD' | 'IDR' | 'EUR' | 'GBP' | 'SGD' | 'AUD' | 'CAD' | 'JPY'

export interface CurrencyConfig {
  code: CurrencyCode
  symbol: string
  name: string
  locale: string
  maxDigits: number
  minorUnitScale: number
}

export const SUPPORTED_CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar (USD)',
    locale: 'en-US',
    maxDigits: 9,
    minorUnitScale: 100,
  },
  IDR: {
    code: 'IDR',
    symbol: 'Rp',
    name: 'Indonesian Rupiah (IDR)',
    locale: 'id-ID',
    maxDigits: 13,
    minorUnitScale: 100,
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro (EUR)',
    locale: 'de-DE',
    maxDigits: 9,
    minorUnitScale: 100,
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound (GBP)',
    locale: 'en-GB',
    maxDigits: 9,
    minorUnitScale: 100,
  },
  SGD: {
    code: 'SGD',
    symbol: 'S$',
    name: 'Singapore Dollar (SGD)',
    locale: 'en-SG',
    maxDigits: 9,
    minorUnitScale: 100,
  },
  AUD: {
    code: 'AUD',
    symbol: 'A$',
    name: 'Australian Dollar (AUD)',
    locale: 'en-AU',
    maxDigits: 9,
    minorUnitScale: 100,
  },
  CAD: {
    code: 'CAD',
    symbol: 'C$',
    name: 'Canadian Dollar (CAD)',
    locale: 'en-CA',
    maxDigits: 9,
    minorUnitScale: 100,
  },
  JPY: {
    code: 'JPY',
    symbol: '¥',
    name: 'Japanese Yen (JPY)',
    locale: 'ja-JP',
    maxDigits: 12,
    minorUnitScale: 100,
  },
}

const STORAGE_KEY = 'finly_profile_settings'
const EVENT_KEY = 'finly-currency-change'

/**
 * Reads stored base currency safely from localStorage.
 */
export function getSavedCurrency(): CurrencyCode {
  if (typeof window === 'undefined') return 'USD'
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed.currency && parsed.currency in SUPPORTED_CURRENCIES) {
        return parsed.currency as CurrencyCode
      }
    }
  } catch {
    // Fallback
  }
  return 'USD'
}

/**
 * Format money from integer minor units (Scale 100).
 * e.g., 5000 cents -> "$50.00" or "Rp 50.000"
 */
export function formatMoney(
  amountInCents: number,
  currencyCode: CurrencyCode = 'USD',
  options?: {
    showDecimals?: boolean
    compact?: boolean
  },
): string {
  const config = SUPPORTED_CURRENCIES[currencyCode]
  const majorUnits = (amountInCents || 0) / 100

  if (currencyCode === 'IDR') {
    const formatted = Math.round(majorUnits).toLocaleString('id-ID')
    return `Rp ${formatted}`
  }

  if (currencyCode === 'JPY') {
    const formatted = Math.round(majorUnits).toLocaleString('ja-JP')
    return `¥${formatted}`
  }

  const showDecimals = options?.showDecimals ?? true
  return new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: config.code,
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  }).format(majorUnits)
}

/**
 * Format money from standard major units (e.g. 148250 -> "$148,250.00" or "Rp 148.250").
 */
export function formatAmount(
  amountInMajor: number,
  currencyCode: CurrencyCode = 'USD',
  options?: {
    showDecimals?: boolean
  },
): string {
  return formatMoney(
    Math.round((amountInMajor || 0) * 100),
    currencyCode,
    options,
  )
}

export function getCurrencySymbol(currencyCode: CurrencyCode = 'USD'): string {
  return SUPPORTED_CURRENCIES[currencyCode].symbol
}

/**
 * Global reactive hook for tenant base currency synchronization across all pages and features.
 */
export function useCurrency() {
  const [currency, setCurrencyState] = React.useState<CurrencyCode>('USD')

  React.useEffect(() => {
    // Sync initial state on mount after hydration
    setCurrencyState(getSavedCurrency())

    const handleCustomEvent = (e: Event) => {
      const customEvent = e as CustomEvent<CurrencyCode>
      if (customEvent.detail in SUPPORTED_CURRENCIES) {
        setCurrencyState(customEvent.detail)
      } else {
        setCurrencyState(getSavedCurrency())
      }
    }

    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        setCurrencyState(getSavedCurrency())
      }
    }

    window.addEventListener(EVENT_KEY, handleCustomEvent)
    window.addEventListener('storage', handleStorage)

    return () => {
      window.removeEventListener(EVENT_KEY, handleCustomEvent)
      window.removeEventListener('storage', handleStorage)
    }
  }, [])

  const setCurrency = React.useCallback((newCurrency: CurrencyCode) => {
    if (!(newCurrency in SUPPORTED_CURRENCIES)) return
    setCurrencyState(newCurrency)

    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      const existing = raw ? JSON.parse(raw) : {}
      const updated = { ...existing, currency: newCurrency }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    } catch {
      // Ignored
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent<CurrencyCode>(EVENT_KEY, { detail: newCurrency }),
      )
    }
  }, [])

  const config = SUPPORTED_CURRENCIES[currency]

  const fmtMoney = React.useCallback(
    (amountInCents: number, options?: { showDecimals?: boolean }) => {
      return formatMoney(amountInCents, currency, options)
    },
    [currency],
  )

  const fmtAmount = React.useCallback(
    (amountInMajor: number, options?: { showDecimals?: boolean }) => {
      return formatAmount(amountInMajor, currency, options)
    },
    [currency],
  )

  return {
    currency,
    setCurrency,
    symbol: config.symbol,
    config,
    formatMoney: fmtMoney,
    formatAmount: fmtAmount,
  }
}
