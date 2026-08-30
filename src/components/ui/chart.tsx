import * as React from 'react'
import * as RechartsPrimitive from 'recharts'
import { cn } from '@/lib/utils'

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: '', dark: '.dark' } as const

export type ChartConfig = {
  [k in string]?: {
    label?: React.ReactNode
    icon?: React.ComponentType
    color?: string
    theme?: Record<keyof typeof THEMES, string>
  }
}

type ChartContextProps = {
  config: ChartConfig
}

const ChartContext = React.createContext<ChartContextProps | null>(null)

function useChart() {
  const context = React.useContext(ChartContext)

  if (!context) {
    throw new Error('useChart must be used within a <ChartContainer />')
  }

  return context
}

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & {
    config: ChartConfig
    children: React.ComponentProps<
      typeof RechartsPrimitive.ResponsiveContainer
    >['children']
  }
>(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId()
  const chartId = `chart-${id || uniqueId.replace(/:/g, '')}`

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-slot="chart"
        data-chart={chartId}
        ref={ref}
        className={cn(
          "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-accent/15 [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none",
          className,
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
})
ChartContainer.displayName = 'Chart'

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([, itemConfig]) => itemConfig?.theme || itemConfig?.color,
  ) as [string, NonNullable<ChartConfig[string]>][]

  if (!colorConfig.length) {
    return null
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color =
      itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ||
      itemConfig.color
    return color ? `  --color-${key}: ${color};` : null
  })
  .filter(Boolean)
  .join('\n')}
}
`,
          )
          .join(''),
      }}
    />
  )
}

const ChartTooltip = RechartsPrimitive.Tooltip

const RECHARTS_INTERNAL_PROPS = new Set([
  'accessibilityLayer',
  'activeIndex',
  'active',
  'activeCoordinate',
  'activeLabel',
  'activePayload',
  'activeTooltipIndex',
  'align',
  'allowEscapeViewBox',
  'animationDuration',
  'animationEasing',
  'axisId',
  'brushBottom',
  'chartHeight',
  'chartWidth',
  'content',
  'contentStyle',
  'coordinate',
  'cursor',
  'cursorStyle',
  'defaultIndex',
  'filterNull',
  'iconSize',
  'iconType',
  'inactiveColor',
  'includeHidden',
  'isAnimationActive',
  'isCustomRadius',
  'itemSorter',
  'itemStyle',
  'label',
  'labelFormatter',
  'labelStyle',
  'layout',
  'legendType',
  'margin',
  'offset',
  'payload',
  'payloadUniqBy',
  'portal',
  'position',
  'reverseDirection',
  'separator',
  'shared',
  'stackOffset',
  'syncId',
  'tooltipAxisType',
  'tooltipTicks',
  'trigger',
  'useTranslate3d',
  'verticalAlign',
  'viewBox',
  'wrapperStyle',
])

function filterDOMProps<T extends Record<string, unknown>>(
  props: T,
): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(props)) {
    if (!RECHARTS_INTERNAL_PROPS.has(key)) {
      result[key] = value
    }
  }
  return result
}

export type ChartTooltipPayloadItem = {
  dataKey?: string | number
  name?: string
  value?: unknown
  payload?: Record<string, unknown>
  color?: string
  fill?: string
  [key: string]: unknown
}

export interface ChartTooltipContentProps extends Omit<
  React.ComponentProps<'div'>,
  'color'
> {
  active?: boolean
  payload?: ChartTooltipPayloadItem[]
  label?: React.ReactNode
  labelFormatter?: (
    label: React.ReactNode,
    payload: ChartTooltipPayloadItem[],
  ) => React.ReactNode
  labelClassName?: string
  formatter?: (
    value: unknown,
    name: unknown,
    item: ChartTooltipPayloadItem,
    index: number,
    payload: unknown,
  ) => React.ReactNode
  color?: string
  hideLabel?: boolean
  hideIndicator?: boolean
  indicator?: 'line' | 'dot' | 'dashed'
  nameKey?: string
  labelKey?: string
  defaultIndex?: number
  axisId?: string | number
  includeHidden?: boolean
}

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  ChartTooltipContentProps
>(
  (
    {
      active,
      payload,
      className,
      indicator = 'dot',
      hideLabel = false,
      hideIndicator = false,
      label,
      labelFormatter,
      labelClassName,
      formatter,
      color,
      nameKey,
      labelKey,
      ...props
    },
    ref,
  ) => {
    const { config } = useChart()
    const domProps = React.useMemo(() => filterDOMProps(props), [props])

    const tooltipLabel = React.useMemo(() => {
      if (hideLabel || !payload?.length) {
        return null
      }

      const [item] = payload
      const key = `${labelKey || item.dataKey || item.name || 'value'}`
      const itemConfig = getPayloadConfigFromPayload(config, item, key)
      const value =
        !labelKey && typeof label === 'string'
          ? (config[label]?.label ?? label)
          : (itemConfig?.label ?? label)

      if (labelFormatter) {
        return (
          <div className={cn('font-medium text-foreground', labelClassName)}>
            {labelFormatter(value, payload)}
          </div>
        )
      }

      if (!value) {
        return null
      }

      return (
        <div className={cn('font-medium text-foreground', labelClassName)}>
          {value}
        </div>
      )
    }, [
      label,
      labelFormatter,
      payload,
      hideLabel,
      labelClassName,
      config,
      labelKey,
    ])

    if (!active || !payload?.length) {
      return null
    }

    const nestLabel = payload.length === 1 && indicator !== 'dot'

    return (
      <div
        ref={ref}
        className={cn(
          'grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/80 bg-card/95 backdrop-blur-md px-3 py-2 text-xs shadow-xl text-foreground',
          className,
        )}
        {...domProps}
      >
        {!nestLabel ? tooltipLabel : null}
        <div className="grid gap-1.5">
          {payload.map((item, index) => {
            const key = `${nameKey || item.name || item.dataKey || 'value'}`
            const itemConfig = getPayloadConfigFromPayload(config, item, key)
            const indicatorColor =
              color ||
              (item.payload && typeof item.payload.fill === 'string'
                ? item.payload.fill
                : item.color)

            return (
              <div
                key={String(item.dataKey || index)}
                className={cn(
                  'flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground',
                  indicator === 'dot' && 'items-center',
                )}
              >
                {formatter && item.value !== undefined && item.name ? (
                  formatter(item.value, item.name, item, index, item.payload)
                ) : (
                  <>
                    {itemConfig?.icon ? (
                      <itemConfig.icon />
                    ) : (
                      !hideIndicator && (
                        <div
                          className={cn(
                            'shrink-0 rounded-[2px] border-(--leader-border)',
                            {
                              'h-2.5 w-2.5 rounded-full': indicator === 'dot',
                              'w-1': indicator === 'line',
                              'w-0 border-[1.5px] border-dashed bg-transparent':
                                indicator === 'dashed',
                              'my-0.5': nestLabel && indicator === 'dashed',
                            },
                          )}
                          style={
                            {
                              '--leader-border': indicatorColor,
                              backgroundColor:
                                indicator === 'dashed'
                                  ? 'transparent'
                                  : indicatorColor,
                              borderColor: indicatorColor,
                            } as React.CSSProperties
                          }
                        />
                      )
                    )}
                    <div
                      className={cn(
                        'flex flex-1 justify-between leading-none',
                        nestLabel ? 'items-end' : 'items-center',
                      )}
                    >
                      <div className="grid gap-1.5">
                        {nestLabel ? tooltipLabel : null}
                        <span className="text-muted-foreground font-medium">
                          {itemConfig?.label || item.name}
                        </span>
                      </div>
                      {item.value !== undefined && (
                        <span className="font-mono font-bold text-foreground tabular-nums ml-2">
                          {typeof item.value === 'number'
                            ? `$${item.value.toLocaleString()}`
                            : String(item.value)}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  },
)
ChartTooltipContent.displayName = 'ChartTooltip'

const ChartLegend = RechartsPrimitive.Legend

export type ChartLegendPayloadItem = {
  value?: unknown
  id?: string
  type?: string
  color?: string
  dataKey?: string | number
  [key: string]: unknown
}

export interface ChartLegendContentProps extends Omit<
  React.ComponentProps<'div'>,
  'content' | 'color'
> {
  payload?: ChartLegendPayloadItem[]
  verticalAlign?: 'top' | 'middle' | 'bottom'
  hideIcon?: boolean
  nameKey?: string
}

const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  ChartLegendContentProps
>(
  (
    {
      className,
      hideIcon = false,
      payload,
      verticalAlign = 'bottom',
      nameKey,
      ...props
    },
    ref,
  ) => {
    const { config } = useChart()
    const domProps = React.useMemo(() => filterDOMProps(props), [props])

    if (!payload?.length) {
      return null
    }

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center justify-center gap-4',
          verticalAlign === 'top' ? 'pb-3' : 'pt-3',
          className,
        )}
        {...domProps}
      >
        {payload.map((item, index) => {
          const key = `${nameKey || item.dataKey || 'value'}`
          const itemConfig = getPayloadConfigFromPayload(config, item, key)

          return (
            <div
              key={String(item.value || item.dataKey || index)}
              className={cn(
                'flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground text-xs font-semibold',
              )}
            >
              {itemConfig?.icon && !hideIcon ? (
                <itemConfig.icon />
              ) : (
                <div
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{
                    backgroundColor: item.color,
                  }}
                />
              )}
              {itemConfig?.label || String(item.value)}
            </div>
          )
        })}
      </div>
    )
  },
)
ChartLegendContent.displayName = 'ChartLegend'

// Helper to extract item config from a payload.
function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: unknown,
  key: string,
) {
  if (typeof payload !== 'object' || payload === null) {
    return undefined
  }

  const payloadPayload =
    'payload' in payload &&
    typeof (payload as { payload?: unknown }).payload === 'object' &&
    (payload as { payload?: unknown }).payload !== null
      ? ((payload as { payload?: Record<string, unknown> }).payload ?? {})
      : undefined

  let configLabelKey: string = key

  if (
    key in payload &&
    typeof (payload as Record<string, unknown>)[key] === 'string'
  ) {
    configLabelKey = (payload as Record<string, unknown>)[key] as string
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key] === 'string'
  ) {
    configLabelKey = payloadPayload[key]
  }

  return configLabelKey in config ? config[configLabelKey] : config[key]
}

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
}
