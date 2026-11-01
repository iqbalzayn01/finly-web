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
    <div className="bento-card bento-card-static col-span-12 flex flex-col justify-between border border-border bg-card p-5 sm:p-6 lg:col-span-8 dark:border-zinc-800">
      {/* Header & Interactive Time Range Pills */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-border/70 pb-4">
        <div className="space-y-0.5">
          <h2 className="font-mono text-sm font-bold uppercase tracking-wider text-foreground">
            Cashflow Dynamics
          </h2>
          <p className="font-mono text-xs text-muted-foreground">
            {terminology.inflow} vs {terminology.outflow} Area Comparison (USD)
          </p>
        </div>

        <fieldset
          aria-label="Select cashflow chart time range"
          className="m-0 flex min-w-0 items-center gap-2 lg:gap-4 rounded-lg bg-white p-1 dark:border-zinc-800 dark:bg-background"
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
                  'min-h-8 rounded-md p-2 font-mono text-xs font-semibold transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  active
                    ? 'bg-primary font-bold text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground',
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
              className="stroke-border/70"
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

            {/* Elevated Sky Accented Popover Tooltip (PRD v2.1.0 §3.1) */}
            <ChartTooltip
              cursor={{ stroke: 'var(--info)', strokeWidth: 1.25 }}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const point = payload[0]?.payload as
                  AreaChartDataPoint | undefined;
                if (!point) return null;

                const isPositiveNet = point.net >= 0;

                return (
                  <div className="min-w-52 rounded-2xl border border-info-border bg-popover p-3 font-mono text-xs text-foreground shadow-2xl">
                    <div className="mb-2 flex items-center gap-2 border-b border-border pb-1.5">
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

                      <div className="flex items-center justify-between gap-4 border-t border-border pt-1.5">
                        <span className="font-semibold text-muted-foreground">
                          Net Diff
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
              stroke="#34D399"
              strokeWidth={2.25}
            />
            <Area
              dataKey="expenses"
              type="monotone"
              fill={`url(#${expensesGradientId})`}
              stroke="#FB7185"
              strokeWidth={2.25}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </div>
    </div>
  );
}
