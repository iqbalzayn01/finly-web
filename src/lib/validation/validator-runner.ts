import type { z } from 'zod'

export interface ValidationSuccess<T> {
  success: true
  data: T
  errors: Record<string, string>
  firstError?: undefined
  errorList: string[]
}

export interface ValidationFailure {
  success: false
  data?: undefined
  errors: Record<string, string>
  firstError: string
  errorList: string[]
}

export type ValidationResult<T> = ValidationSuccess<T> | ValidationFailure

export interface FieldValidationResult {
  isValid: boolean
  error?: string
}

export interface BatchValidationResult<T> {
  allValid: boolean
  results: ValidationResult<T>[]
  validItems: T[]
  failedIndices: number[]
}

export function formatZodIssues(issues: z.ZodIssue[]): {
  errors: Record<string, string>
  firstError: string
  errorList: string[]
} {
  const errors: Record<string, string> = {}
  const errorList: string[] = []

  for (const issue of issues) {
    const key = issue.path.length > 0 ? issue.path.join('.') : '_form'
    if (!errors[key]) {
      errors[key] = issue.message
      errorList.push(issue.message)
    }
  }

  return {
    errors,
    firstError: errorList[0] || 'Validation failed',
    errorList,
  }
}

export function runValidation<T>(
  schema: z.ZodType<T>,
  data: unknown,
): ValidationResult<T> {
  const result = schema.safeParse(data)

  if (result.success) {
    return {
      success: true,
      data: result.data,
      errors: {},
      errorList: [],
    }
  }

  const { errors, firstError, errorList } = formatZodIssues(result.error.issues)
  return {
    success: false,
    errors,
    firstError,
    errorList,
  }
}

export function validateField<T extends z.ZodRawShape>(
  schema: z.ZodObject<T>,
  field: string,
  value: unknown,
): FieldValidationResult {
  const shape = schema.shape as unknown as Record<
    string,
    z.ZodTypeAny | undefined
  >
  const fieldSchema = shape[field]
  if (!fieldSchema) {
    return { isValid: true }
  }

  const result = fieldSchema.safeParse(value)
  if (result.success) {
    return { isValid: true }
  }

  const firstMessage = result.error.issues[0]?.message || 'Invalid field'
  return {
    isValid: false,
    error: firstMessage,
  }
}

export function createValidatorRunner<T>(
  schema: z.ZodType<T>,
): (input: unknown) => ValidationResult<T> {
  return (input: unknown) => runValidation(schema, input)
}

export function runBatchValidation<T>(
  schema: z.ZodType<T>,
  items: unknown[],
): BatchValidationResult<T> {
  const results: ValidationResult<T>[] = []
  const validItems: T[] = []
  const failedIndices: number[] = []

  items.forEach((item, index) => {
    const res = runValidation(schema, item)
    results.push(res)
    if (res.success) {
      validItems.push(res.data)
    } else {
      failedIndices.push(index)
    }
  })

  return {
    allValid: failedIndices.length === 0,
    results,
    validItems,
    failedIndices,
  }
}
