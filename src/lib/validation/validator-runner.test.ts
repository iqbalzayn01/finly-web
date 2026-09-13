import { describe, it, expect } from 'vitest'
import { z } from 'zod'
import {
  runValidation,
  validateField,
  createValidatorRunner,
  runBatchValidation,
  formatZodIssues,
} from './validator-runner'

describe('validator-runner', () => {
  const userSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    age: z.number().positive('Age must be greater than zero').optional(),
  })

  describe('runValidation', () => {
    it('returns success and data for valid input', () => {
      const input = { name: 'Finly User', email: 'user@finly.io', age: 30 }
      const result = runValidation(userSchema, input)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual(input)
        expect(result.errors).toEqual({})
        expect(result.errorList).toHaveLength(0)
        expect(result.firstError).toBeUndefined()
      }
    })

    it('returns structured errors and firstError for invalid input', () => {
      const input = { name: 'A', email: 'invalid-email', age: -5 }
      const result = runValidation(userSchema, input)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.errors.name).toBe('Name must be at least 2 characters')
        expect(result.errors.email).toBe('Invalid email address')
        expect(result.errors.age).toBe('Age must be greater than zero')
        expect(result.errorList.length).toBeGreaterThanOrEqual(3)
        expect(result.firstError).toBe('Name must be at least 2 characters')
      }
    })

    it('handles root/form-level refinement errors gracefully', () => {
      const formSchema = z
        .object({
          password: z.string(),
          confirmPassword: z.string(),
        })
        .refine((data) => data.password === data.confirmPassword, {
          message: 'Passwords do not match',
          path: ['confirmPassword'],
        })

      const result = runValidation(formSchema, {
        password: 'Password123',
        confirmPassword: 'MismatchPassword',
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.errors.confirmPassword).toBe('Passwords do not match')
      }
    })
  })

  describe('validateField', () => {
    it('validates a single valid field correctly', () => {
      const result = validateField(userSchema, 'email', 'valid@finly.io')
      expect(result.isValid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it('validates a single invalid field and extracts error message', () => {
      const result = validateField(userSchema, 'email', 'bad-email')
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Invalid email address')
    })

    it('returns valid true when field does not exist in schema', () => {
      const result = validateField(userSchema, 'nonExistent' as any, 'any')
      expect(result.isValid).toBe(true)
    })
  })

  describe('createValidatorRunner', () => {
    it('creates a reusable validation executor function', () => {
      const runner = createValidatorRunner(userSchema)
      expect(typeof runner).toBe('function')

      const validRes = runner({ name: 'Jane Doe', email: 'jane@finly.io' })
      expect(validRes.success).toBe(true)

      const invalidRes = runner({ name: '', email: '' })
      expect(invalidRes.success).toBe(false)
    })
  })

  describe('runBatchValidation', () => {
    it('returns allValid true when every element passes schema', () => {
      const items = [
        { name: 'Alpha', email: 'alpha@finly.io' },
        { name: 'Beta', email: 'beta@finly.io' },
      ]
      const result = runBatchValidation(userSchema, items)

      expect(result.allValid).toBe(true)
      expect(result.validItems).toHaveLength(2)
      expect(result.failedIndices).toEqual([])
    })

    it('tracks failed indices and preserves valid items', () => {
      const items = [
        { name: 'Alpha', email: 'alpha@finly.io' },
        { name: 'X', email: 'invalid' },
        { name: 'Gamma', email: 'gamma@finly.io' },
      ]
      const result = runBatchValidation(userSchema, items)

      expect(result.allValid).toBe(false)
      expect(result.validItems).toHaveLength(2)
      expect(result.failedIndices).toEqual([1])
    })
  })

  describe('formatZodIssues', () => {
    it('joins nested paths into dot-notated keys', () => {
      const issues: z.ZodIssue[] = [
        {
          code: 'custom',
          path: ['items', 0, 'price'],
          message: 'Price must be positive',
        },
        {
          code: 'custom',
          path: [],
          message: 'Form validation failed',
        },
      ]

      const formatted = formatZodIssues(issues)
      expect(formatted.errors['items.0.price']).toBe('Price must be positive')
      expect(formatted.errors._form).toBe('Form validation failed')
      expect(formatted.firstError).toBe('Price must be positive')
    })
  })
})
