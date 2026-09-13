import { describe, it, expect } from 'vitest'
import {
  quickEntrySchema,
  invoiceBuilderSchema,
  customerFormSchema,
  itemFormSchema,
  businessProfileSchema,
  accountProfileSchema,
  changePasswordSchema,
  fxConverterSchema,
} from './schemas'
import { runValidation } from './validator-runner'

describe('validation schemas', () => {
  describe('quickEntrySchema', () => {
    it('accepts valid income and expense entries', () => {
      const validIncome = {
        type: 'income',
        amount: 5000,
        category: 'Client Retainer',
        scope: 'business',
        description: 'Monthly consulting fee',
      }
      expect(runValidation(quickEntrySchema, validIncome).success).toBe(true)

      const validExpense = {
        type: 'expense',
        amount: 120,
        category: 'Software, apps, games',
        scope: 'personal',
        description: '',
      }
      expect(runValidation(quickEntrySchema, validExpense).success).toBe(true)
    })

    it('rejects zero or negative amount', () => {
      const zero = {
        type: 'expense',
        amount: 0,
        category: 'Rent',
        scope: 'business',
      }
      const negative = {
        type: 'income',
        amount: -50,
        category: 'General',
        scope: 'business',
      }

      const zeroRes = runValidation(quickEntrySchema, zero)
      expect(zeroRes.success).toBe(false)
      if (!zeroRes.success) {
        expect(zeroRes.errors.amount).toBe('Amount must be greater than zero')
      }

      const negRes = runValidation(quickEntrySchema, negative)
      expect(negRes.success).toBe(false)
    })

    it('rejects empty category', () => {
      const invalid = {
        type: 'expense',
        amount: 100,
        category: '   ',
        scope: 'business',
      }
      const res = runValidation(quickEntrySchema, invalid)
      expect(res.success).toBe(false)
      if (!res.success) {
        expect(res.errors.category).toBe('Category is required')
      }
    })
  })

  describe('invoiceBuilderSchema', () => {
    const validInvoice = {
      customerId: 'acme-corp',
      issueDate: '2026-08-01',
      dueDate: '2026-08-15',
      items: [
        {
          description: 'Web Architecture Audit',
          qty: 1,
          price: 3500,
        },
      ],
      taxRate: 11,
      discountRate: 0,
    }

    it('validates a correct invoice specification', () => {
      const res = runValidation(invoiceBuilderSchema, validInvoice)
      expect(res.success).toBe(true)
    })

    it('rejects when dueDate is prior to issueDate', () => {
      const invalidDates = {
        ...validInvoice,
        issueDate: '2026-08-20',
        dueDate: '2026-08-10',
      }
      const res = runValidation(invoiceBuilderSchema, invalidDates)
      expect(res.success).toBe(false)
      if (!res.success) {
        expect(res.errors.dueDate).toBe(
          'Due date must be on or after the issue date',
        )
      }
    })

    it('rejects when items array is empty', () => {
      const noItems = {
        ...validInvoice,
        items: [],
      }
      const res = runValidation(invoiceBuilderSchema, noItems)
      expect(res.success).toBe(false)
      if (!res.success) {
        expect(res.errors.items).toBe(
          'Invoice must contain at least one line item',
        )
      }
    })

    it('validates each line item in items array', () => {
      const invalidLine = {
        ...validInvoice,
        items: [
          {
            description: '',
            qty: 0,
            price: -10,
          },
        ],
      }
      const res = runValidation(invoiceBuilderSchema, invalidLine)
      expect(res.success).toBe(false)
      if (!res.success) {
        expect(res.errors['items.0.description']).toBe(
          'Line item description is required',
        )
        expect(res.errors['items.0.qty']).toBe(
          'Quantity must be greater than zero',
        )
        expect(res.errors['items.0.price']).toBe(
          'Unit price cannot be negative',
        )
      }
    })
  })

  describe('customerFormSchema', () => {
    it('accepts valid customer profile with terms', () => {
      const valid = {
        name: 'Starlight Media Inc.',
        email: 'billing@starlight.io',
        term: 'net14',
        phone: '+1 555 234 5678',
        address: '742 Evergreen Terrace',
      }
      const res = runValidation(customerFormSchema, valid)
      expect(res.success).toBe(true)
    })

    it('rejects invalid email address', () => {
      const invalid = {
        name: 'Acme Corp',
        email: 'not-an-email',
      }
      const res = runValidation(customerFormSchema, invalid)
      expect(res.success).toBe(false)
      if (!res.success) {
        expect(res.errors.email).toBe(
          'Please provide a valid business email address',
        )
      }
    })

    it('rejects short customer name', () => {
      const invalid = {
        name: 'A',
        email: 'hello@acme.com',
      }
      const res = runValidation(customerFormSchema, invalid)
      expect(res.success).toBe(false)
      if (!res.success) {
        expect(res.errors.name).toBe(
          'Customer name must be at least 2 characters',
        )
      }
    })
  })

  describe('itemFormSchema', () => {
    it('accepts valid catalog items', () => {
      const valid = {
        name: 'Senior Advisory Consulting',
        price: 250,
        unit: 'hour',
        taxRate: 11,
        active: true,
      }
      const res = runValidation(itemFormSchema, valid)
      expect(res.success).toBe(true)
    })

    it('rejects zero or negative price', () => {
      const invalid = {
        name: 'Audit',
        price: 0,
        unit: 'audit',
      }
      const res = runValidation(itemFormSchema, invalid)
      expect(res.success).toBe(false)
      if (!res.success) {
        expect(res.errors.price).toBe('Price must be greater than zero')
      }
    })

    it('rejects taxRate exceeding 100%', () => {
      const invalid = {
        name: 'High Tax Service',
        price: 100,
        unit: 'month',
        taxRate: 150,
      }
      const res = runValidation(itemFormSchema, invalid)
      expect(res.success).toBe(false)
      if (!res.success) {
        expect(res.errors.taxRate).toBe('Tax rate cannot exceed 100%')
      }
    })
  })

  describe('businessProfileSchema', () => {
    it('accepts valid business workspace settings', () => {
      const valid = {
        businessName: 'Finly Global Labs',
        taxId: '01.234.567.8-901.000',
        currency: 'USD',
        invoicePrefix: 'INV-2026',
      }
      const res = runValidation(businessProfileSchema, valid)
      expect(res.success).toBe(true)
    })

    it('rejects invalid invoice prefix with illegal characters', () => {
      const invalid = {
        businessName: 'Finly Global Labs',
        taxId: '01.234.567.8-901.000',
        currency: 'USD',
        invoicePrefix: 'INV @#$',
      }
      const res = runValidation(businessProfileSchema, invalid)
      expect(res.success).toBe(false)
      if (!res.success) {
        expect(res.errors.invoicePrefix).toBe(
          'Invoice prefix can only contain alphanumeric characters, hyphens, or underscores',
        )
      }
    })
  })

  describe('accountProfileSchema', () => {
    it('validates account profile details', () => {
      const res = runValidation(accountProfileSchema, {
        fullName: 'Jordan Bell',
        email: 'jordan@finly.io',
      })
      expect(res.success).toBe(true)
    })
  })

  describe('changePasswordSchema', () => {
    it('accepts matching secure password', () => {
      const valid = {
        currentPassword: 'OldPassword123',
        newPassword: 'SuperSecurePassword2026',
        confirmPassword: 'SuperSecurePassword2026',
      }
      const res = runValidation(changePasswordSchema, valid)
      expect(res.success).toBe(true)
    })

    it('rejects mismatch between newPassword and confirmPassword', () => {
      const mismatch = {
        currentPassword: 'OldPassword123',
        newPassword: 'SuperSecurePassword2026',
        confirmPassword: 'DifferentPassword2026',
      }
      const res = runValidation(changePasswordSchema, mismatch)
      expect(res.success).toBe(false)
      if (!res.success) {
        expect(res.errors.confirmPassword).toBe(
          'New password and confirmation do not match',
        )
      }
    })
  })

  describe('fxConverterSchema', () => {
    it('accepts positive conversion amount', () => {
      expect(runValidation(fxConverterSchema, { amount: 2500 }).success).toBe(
        true,
      )
    })

    it('rejects zero or negative conversion amount', () => {
      expect(runValidation(fxConverterSchema, { amount: 0 }).success).toBe(
        false,
      )
    })
  })
})
