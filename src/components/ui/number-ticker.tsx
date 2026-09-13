import * as React from 'react'
import { useInView, useMotionValue, useSpring } from 'motion/react'
import { cn } from '#/lib/utils'

export interface NumberTickerProps extends React.ComponentPropsWithoutRef<'span'> {
  value: number
  startValue?: number
  direction?: 'up' | 'down'
  delay?: number
  decimalPlaces?: number
  prefix?: string
  suffix?: string
  damping?: number
  stiffness?: number
  mass?: number
  formatter?: (val: number) => string
}

export function NumberTicker({
  value,
  startValue = 0,
  direction = 'up',
  delay = 0,
  className,
  decimalPlaces = 0,
  prefix = '',
  suffix = '',
  damping = 26,
  stiffness = 260,
  mass = 0.7,
  formatter,
  ...props
}: NumberTickerProps) {
  const ref = React.useRef<HTMLSpanElement>(null)
  const motionValue = useMotionValue(direction === 'down' ? value : startValue)
  const springValue = useSpring(motionValue, {
    damping,
    stiffness,
    mass,
  })
  const isInView = useInView(ref, { once: true, margin: '0px' })

  const defaultIntlFormatter = React.useMemo(() => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces,
    })
  }, [decimalPlaces])

  React.useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null

    if (isInView) {
      if (delay > 0) {
        timer = setTimeout(() => {
          motionValue.set(direction === 'down' ? startValue : value)
        }, delay * 1000)
      } else {
        motionValue.set(direction === 'down' ? startValue : value)
      }
    }

    return () => {
      if (timer !== null) {
        clearTimeout(timer)
      }
    }
  }, [motionValue, isInView, delay, value, direction, startValue])

  React.useEffect(() => {
    return springValue.on('change', (latest) => {
      if (ref.current) {
        const num = Number(latest)
        if (formatter) {
          ref.current.textContent = `${prefix}${formatter(num)}${suffix}`
        } else {
          ref.current.textContent = `${prefix}${defaultIntlFormatter.format(Number(num.toFixed(decimalPlaces)))}${suffix}`
        }
      }
    })
  }, [
    springValue,
    decimalPlaces,
    formatter,
    prefix,
    suffix,
    defaultIntlFormatter,
  ])

  const initialRenderText = formatter
    ? `${prefix}${formatter(direction === 'down' ? value : startValue)}${suffix}`
    : `${prefix}${defaultIntlFormatter.format(Number((direction === 'down' ? value : startValue).toFixed(decimalPlaces)))}${suffix}`

  return (
    <span
      ref={ref}
      className={cn('inline-block tabular-nums', className)}
      {...props}
    >
      {initialRenderText}
    </span>
  )
}
