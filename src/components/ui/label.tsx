import * as React from 'react'
import { Field } from '@base-ui/react'
import { cn } from '#/lib/utils.ts'

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => {
    return (
      <Field.Label
        ref={ref}
        data-slot="label"
        className={cn(
          'flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 cursor-pointer',
          className,
        )}
        {...props}
      />
    )
  },
)

Label.displayName = 'Label'

export { Label }
