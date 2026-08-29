import * as React from 'react'
import { Slider as BaseSlider } from '@base-ui/react'
import { cn } from '#/lib/utils.ts'

export interface SliderProps extends React.ComponentPropsWithoutRef<
  typeof BaseSlider.Root
> {}

const Slider = React.forwardRef<
  React.ElementRef<typeof BaseSlider.Root>,
  SliderProps
>(({ className, ...props }, ref) => {
  return (
    <BaseSlider.Root
      ref={ref}
      data-slot="slider"
      className={cn(
        'relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50',
        className,
      )}
      {...props}
    >
      <BaseSlider.Control className="relative flex w-full items-center py-2">
        <BaseSlider.Track
          data-slot="slider-track"
          className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-muted"
        >
          <BaseSlider.Indicator
            data-slot="slider-range"
            className="absolute h-full bg-primary"
          />
        </BaseSlider.Track>
        <BaseSlider.Thumb
          data-slot="slider-thumb"
          className="block size-4 shrink-0 rounded-full border border-primary bg-white shadow-none ring-ring/50 transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
        />
      </BaseSlider.Control>
    </BaseSlider.Root>
  )
})

Slider.displayName = 'Slider'

export { Slider }
