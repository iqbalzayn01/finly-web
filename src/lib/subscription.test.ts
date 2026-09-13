import { describe, it, expect, beforeEach, afterAll } from 'vitest'
import { getStoredPlan, setStoredPlan } from './subscription'

describe('subscription utilities', () => {
  let mockStorage: Record<string, string> = {}
  const originalWindow = (globalThis as any).window
  const originalLocalStorage = (globalThis as any).localStorage

  beforeEach(() => {
    mockStorage = {}
    ;(globalThis as any).window = {
      dispatchEvent: () => true,
    }
    ;(globalThis as any).localStorage = {
      getItem: (key: string) => mockStorage[key] || null,
      setItem: (key: string, value: string) => {
        mockStorage[key] = value
      },
      clear: () => {
        mockStorage = {}
      },
    }
  })

  afterAll(() => {
    ;(globalThis as any).window = originalWindow
    ;(globalThis as any).localStorage = originalLocalStorage
  })

  it('defaults to starter plan when nothing is stored', () => {
    expect(getStoredPlan()).toBe('starter')
  })

  it('retrieves pro plan when stored in localStorage', () => {
    setStoredPlan('pro')
    expect(getStoredPlan()).toBe('pro')
  })

  it('retrieves enterprise plan when stored in localStorage', () => {
    setStoredPlan('enterprise')
    expect(getStoredPlan()).toBe('enterprise')
  })

  it('falls back to starter on unrecognized plan strings', () => {
    mockStorage['finly_user_plan'] = 'unknown_plan'
    expect(getStoredPlan()).toBe('starter')
  })
})
