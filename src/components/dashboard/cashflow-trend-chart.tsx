import { useId, useMemo, useState } from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import type { ChartConfig } from '#/components/ui/chart';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
} from '#/components/ui/chart';
import { useFinly } from '#/context/finly-context';
import { buildAreaChartSeries } from '#/lib/cashflow';
import { formatCurrency, formatUSD } from '#/lib/format';
import { cn } from '#/lib/utils';
import type { AreaChartDataPoint, ChartTimeRange } from '#/types/finly';

const TIME_RANGES: ChartTimeRange[] = ['1W', '1M', '3M', '6M', '1Y'];

/**
 * Tile 4: Cashflow Dynamics Interactive Area Chart (PRD v2.1.0 §3.1 & DESIGN.md §6.3)
 * Spans 8 columns on desktop with Emerald (#34D399) & Rose (#FB7185) dual gradients,
 * Electric Lime (#C9F31D) active time-range pills, and Sky (#38BDF8) accented tooltip.
 */
export function CashflowTrendChart() {
  const { transactions, todayISO, profile, terminology, selectedWalletId } =
    useFinly();
  const rawId = useId().replace(/:/g, '');
  const [timeRange, setTimeRange] = useState<ChartTimeRange>('1M');

  const series = useMemo(
    () =>
      buildAreaChartSeries(transactions, todayISO, timeRange, selectedWalletId),
    [selectedWalletId, timeRange, todayISO, transactions],
  );

  const chartConfig = useMemo<ChartConfig>(
    () => ({
      income: {
        label: terminology.inflow,
        color: '#34D399',
      },
      expenses: {
        label: terminology.outflow,
        color: '#FB7185',
      },
    }),
    [terminology.inflow, terminology.outflow],
  );

  const incomeGradientId = `fillIncome_${rawId}`;
  const expensesGradientId = `fillExpenses_${rawId}`;
  const isMasked = profile.privacyBlurEnabled;

  return (
    <div className="bento-card bento-card-static col-span-12 flex h-full flex-col justify-between bg-card p-6 lg:col-span-8">
      {/* Header & Interactive Time Range Pills */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b-2 border-border pb-4">
        <div className="space-y-0.5">
          <h2 className="font-mono text-xs font-extrabold uppercase tracking-wider text-foreground sm:text-sm">
            {terminology.inflow} vs. {terminology.outflow}
          </h2>
          <p className="font-mono text-xs text-muted-foreground">
            Compare what came in and what went out over time
          </p>
        </div>

        <fieldset
          aria-label="Select chart time range"
          className="brutal-surface m-0 flex min-w-0 items-center gap-1 rounded-xl bg-background p-1"
        >
          {TIME_RANGES.map((range) => {
            const active = timeRange === range;
            return (
              <button
                key={range}
                type="button"
                aria-pressed={active}
                onClick={() => setTimeRange(range)}
                className={cn(
                  'h-7 rounded-lg border-2 px-2.5 font-mono text-xs transition-all duration-150 active:scale-95 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  active
                    ? 'border-border bg-primary font-extrabold text-primary-foreground'
                    : 'border-transparent font-semibold text-muted-foreground hover:bg-accent hover:text-foreground',
                )}
              >
                {range}
              </button>
            );
          })}
        </fieldset>
      </div>

      {/* Dual Gradient Area Chart */}
      <div className="pt-1">
        <ChartContainer
          config={chartConfig}
          className={cn(
            'aspect-auto h-68 w-full',
            isMasked && 'privacy-masked',
          )}
        >
          <AreaChart
            data={series}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id={incomeGradientId} x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--inflow)"
                  stopOpacity={0.42}
                />
                <stop
                  offset="95%"
                  stopColor="var(--inflow)"
                  stopOpacity={0.02}
                />
              </linearGradient>
              <linearGradient
                id={expensesGradientId}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="var(--outflow)"
                  stopOpacity={0.38}
                />
                <stop
                  offset="95%"
                  stopColor="var(--outflow)"
                  stopOpacity={0.02}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              className="stroke-border"
            />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={24}
              className="font-mono text-[11px]"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={54}
              tickFormatter={(val: number) =>
                formatCurrency(val, 'USD', { compact: true })
              }
              className="font-mono text-[11px] tabular-nums"
            />

            <ChartTooltip
              cursor={{ stroke: 'var(--info)', strokeWidth: 1.5 }}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const point = payload[0]?.payload as
                  AreaChartDataPoint | undefined;
                if (!point) return null;

                const isPositiveNet = point.net >= 0;

                return (
                  <div className="brutal-surface min-w-52 rounded-2xl border-2 border-border bg-popover p-3.5 font-mono text-xs text-foreground">
                    <div className="mb-2 flex items-center gap-2 border-b-2 border-border pb-1.5">
                      <span className="size-2 rounded-full bg-info" />
                      <span className="text-[11px] font-bold text-info">
                        {point.tooltipDate}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-4">
                        <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                          <span className="size-2 rounded-full bg-inflow" />
                          <span>{terminology.inflow}</span>
                        </span>
                        <span className="font-bold text-inflow tabular-nums">
                          {isMasked
                            ? '+$ ••••••'
                            : `+${formatUSD(point.income)}`}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-4">
                        <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                          <span className="size-2 rounded-full bg-outflow" />
                          <span>{terminology.outflow}</span>
                        </span>
                        <span className="font-bold text-outflow tabular-nums">
                          {isMasked
                            ? '-$ ••••••'
                            : `-${formatUSD(point.expenses)}`}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-4 border-t-2 border-border pt-1.5">
                        <span className="font-semibold text-muted-foreground">
                          Net
                        </span>
                        <span
                          className={cn(
                            'font-extrabold tabular-nums',
                            isPositiveNet ? 'text-inflow' : 'text-outflow',
                          )}
                        >
                          {isMasked
                            ? `${isPositiveNet ? '+' : '-'}$ ••••••`
                            : `${isPositiveNet ? '+' : '-'}${formatUSD(Math.abs(point.net))}`}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              }}
            />

            <Area
              dataKey="income"
              type="monotone"
              fill={`url(#${incomeGradientId})`}
              stroke="var(--inflow)"
              strokeWidth={2.5}
            />
            <Area
              dataKey="expenses"
              type="monotone"
              fill={`url(#${expensesGradientId})`}
              stroke="var(--outflow)"
              strokeWidth={2.5}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </div>
    </div>
  );
}
