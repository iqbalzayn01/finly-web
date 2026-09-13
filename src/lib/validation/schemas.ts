import { z } from 'zod'

export const quickEntrySchema = z.object({
  type: z.enum(['income', 'expense']),
  amount: z
    .number({ message: 'Amount must be a valid number' })
    .positive('Amount must be greater than zero')
    .max(999999999999, 'Amount exceeds maximum allowable transaction limit'),
  category: z.string().trim().min(1, 'Category is required'),
  scope: z.enum(['business', 'personal']),
  description: z
    .string()
    .trim()
    .max(255, 'Description cannot exceed 255 characters')
    .default(''),
  currency: z
    .enum(['USD', 'IDR', 'EUR', 'GBP', 'SGD', 'AUD', 'CAD', 'JPY'])
    .optional(),
})

export type QuickEntryInput = z.infer<typeof quickEntrySchema>

export const invoiceLineItemSchema = z.object({
  id: z.string().optional(),
  description: z
    .string()
    .trim()
    .min(1, 'Line item description is required')
    .max(200, 'Description cannot exceed 200 characters'),
  qty: z
    .number({ message: 'Quantity must be a valid number' })
    .positive('Quantity must be greater than zero'),
  price: z
    .number({ message: 'Price must be a valid number' })
    .min(0, 'Unit price cannot be negative'),
})

export type InvoiceLineItemFormInput = z.infer<typeof invoiceLineItemSchema>

export const invoiceBuilderSchema = z
  .object({
    customerId: z.string().trim().min(1, 'Customer selection is required'),
    issueDate: z
      .string()
      .trim()
      .regex(
        /^\d{4}-\d{2}-\d{2}$/,
        'Valid issue date (YYYY-MM-DD) is required',
      ),
    dueDate: z
      .string()
      .trim()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Valid due date (YYYY-MM-DD) is required'),
    items: z
      .array(invoiceLineItemSchema)
      .min(1, 'Invoice must contain at least one line item'),
    discountRate: z
      .number({ message: 'Discount rate must be a number' })
      .min(0, 'Discount rate cannot be negative')
      .max(100, 'Discount rate cannot exceed 100%')
      .default(0),
    taxRate: z
      .number({ message: 'Tax rate must be a number' })
      .min(0, 'Tax rate cannot be negative')
      .max(100, 'Tax rate cannot exceed 100%')
      .default(11),
    notes: z
      .string()
      .trim()
      .max(500, 'Notes cannot exceed 500 characters')
      .optional()
      .default(''),
  })
  .refine(
    (data) => {
      if (!data.issueDate || !data.dueDate) return true
      return new Date(data.dueDate) >= new Date(data.issueDate)
    },
    {
      message: 'Due date must be on or after the issue date',
      path: ['dueDate'],
    },
  )

export type InvoiceBuilderInput = z.infer<typeof invoiceBuilderSchema>

export const customerFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Customer name must be at least 2 characters')
    .max(100, 'Customer name cannot exceed 100 characters'),
  email: z
    .string()
    .trim()
    .email('Please provide a valid business email address'),
  phone: z
    .string()
    .trim()
    .max(30, 'Phone number cannot exceed 30 characters')
    .optional()
    .default(''),
  term: z.enum(['net7', 'net14', 'net30']).default('net30'),
  address: z
    .string()
    .trim()
    .max(255, 'Address cannot exceed 255 characters')
    .optional()
    .default(''),
  taxId: z
    .string()
    .trim()
    .max(50, 'Tax ID cannot exceed 50 characters')
    .optional()
    .default(''),
})

export type CustomerFormInput = z.infer<typeof customerFormSchema>

export const itemFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Item name must be at least 2 characters')
    .max(100, 'Item name cannot exceed 100 characters'),
  price: z
    .number({ message: 'Price must be a valid number' })
    .positive('Price must be greater than zero'),
  unit: z
    .string()
    .trim()
    .min(1, 'Billing unit is required')
    .max(30, 'Billing unit cannot exceed 30 characters'),
  taxRate: z
    .number({ message: 'Tax rate must be a number' })
    .min(0, 'Tax rate cannot be negative')
    .max(100, 'Tax rate cannot exceed 100%')
    .default(11),
  active: z.boolean().default(true),
})

export type ItemFormInput = z.infer<typeof itemFormSchema>

export const businessProfileSchema = z.object({
  businessName: z
    .string()
    .trim()
    .min(2, 'Business legal name must be at least 2 characters')
    .max(100, 'Business legal name cannot exceed 100 characters'),
  taxId: z
    .string()
    .trim()
    .min(3, 'Tax identification number must be at least 3 characters')
    .max(50, 'Tax ID cannot exceed 50 characters'),
  currency: z.enum(['USD', 'IDR', 'EUR', 'GBP', 'SGD', 'AUD', 'CAD', 'JPY']),
  invoicePrefix: z
    .string()
    .trim()
    .min(2, 'Invoice prefix must be at least 2 characters')
    .max(10, 'Invoice prefix cannot exceed 10 characters')
    .regex(
      /^[A-Za-z0-9_-]+$/,
      'Invoice prefix can only contain alphanumeric characters, hyphens, or underscores',
    ),
})

export type BusinessProfileInput = z.infer<typeof businessProfileSchema>

export const accountProfileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, 'Full name must be at least 2 characters')
    .max(80, 'Full name cannot exceed 80 characters'),
  email: z.string().trim().email('Valid business email address is required'),
})

export type AccountProfileInput = z.infer<typeof accountProfileSchema>

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'New password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number',
      ),
    confirmPassword: z.string().min(1, 'Password confirmation is required'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'New password and confirmation do not match',
    path: ['confirmPassword'],
  })

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>

export const fxConverterSchema = z.object({
  amount: z
    .number({ message: 'Amount must be a number' })
    .positive('Conversion amount must be greater than zero')
    .max(1000000000, 'Amount exceeds conversion limit'),
})

export type FxConverterInput = z.infer<typeof fxConverterSchema>
