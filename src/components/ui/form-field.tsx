import * as React from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { AlertCircle } from './icon'
import { cn } from '../../lib/utils'

export interface FormFieldProps {
  label?: string
  required?: boolean
  error?: string
  helperText?: string
  className?: string
  children: React.ReactNode
  htmlFor?: string
}

export function FormField({
  label,
  required,
  error,
  helperText,
  className,
  children,
  htmlFor,
}: FormFieldProps) {
  return (
    <div className={cn('space-y-1.5 w-full', className)}>
      {label && (
        <div className="flex items-center justify-between">
          <label
            htmlFor={htmlFor}
            className="block text-xs font-semibold text-foreground tracking-tight"
          >
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>
        </div>
      )}

      <div className="relative">{children}</div>

      <AnimatePresence mode="wait">
        {error ? (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-1.5 text-[11px] font-medium text-destructive mt-1"
            role="alert"
          >
            <AlertCircle className="h-3 w-3 shrink-0" />
            <span>{error}</span>
          </motion.div>
        ) : helperText ? (
          <p className="text-[11px] text-muted-foreground mt-1">{helperText}</p>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
