import { createFileRoute, Link } from '@tanstack/react-router'
import { motion } from 'motion/react'
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  TrendingDown,
  Receipt,
  Activity,
  ShieldCheck,
} from '../components/ui/icon'
import { useState, useMemo, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '../components/ui/chart'
import type { ChartConfig } from '../components/ui/chart'
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Bar,
  ComposedChart,
  Line,
  LineChart,
  PolarGrid,
  RadialBar,
  RadialBarChart,
  ReferenceLine,
} from 'recharts'
import { useCurrency } from '../lib/currency'
import { NumberTicker } from '../components/ui/number-ticker'
import dashboardData from '../data/dashboard.json'

export const Route = createFileRoute('/dashboard')({ component: Dashboard })

const runwayChartConfig = {
  runway: {
    label: 'Runway (Months)',
    color: 'var(--primary)',
  },
} satisfies ChartConfig

const healthChartConfig = {
  score: {
    label: 'Health Score',
  },
  health: {
    label: 'Cash Health',
    color: 'var(--primary)',
  },
} satisfies ChartConfig

const cashflowChartConfig = {
  income: {
    label: 'Inflow / Income',
    color: 'var(--primary)',
  },
  expense: {
    label: 'Outflow / Expense',
    color: 'rgba(100, 116, 139, 0.20)',
    theme: {
      light: 'rgba(100, 116, 139, 0.20)',
      dark: 'rgba(148, 163, 184, 0.25)',
    },
  },
  expenseNegative: {
    label: 'Outflow / Expense',
    color: 'rgba(100, 116, 139, 0.20)',
    theme: {
      light: 'rgba(100, 116, 139, 0.20)',
      dark: 'rgba(148, 163, 184, 0.25)',
    },
  },
  net: {
    label: 'Net Cashflow',
    color: '#6366F1',
  },
} satisfies ChartConfig

type CashflowTimeframe = '1d' | '7d' | '30d' | '1m' | '3m' | '6m' | '1y' | '5y'

const TIMEFRAME_OPTIONS: { label: string; value: CashflowTimeframe }[] = [
  { label: '1D', value: '1d' },
  { label: '7D', value: '7d' },
  { label: '30D', value: '30d' },
  { label: '1M', value: '1m' },
  { label: '3M', value: '3m' },
  { label: '6M', value: '6m' },
  { label: '1Y', value: '1y' },
  { label: '5Y', value: '5y' },
]

type CashflowViewMode = 'grouped' | 'split'

const VIEW_MODE_OPTIONS: {
  label: string
  value: CashflowViewMode
  description: string
}[] = [
  {
    label: 'Grouped',
    value: 'grouped',
    description: 'Side-by-side inflow and outflow bars',
  },
  {
    label: 'Split Axis',
    value: 'split',
    description: 'Bi-directional surplus & deficit split at $0',
  },
]

interface CashflowTooltipPayloadItem {
  dataKey?: string | number
  name?: string
  value?: number
  payload?: {
    name?: string
    income?: number
    expense?: number
    net?: number
    expenseNegative?: number
    [key: string]: unknown
  }
}

interface CashflowTooltipProps {
  active?: boolean
  payload?: CashflowTooltipPayloadItem[]
  label?: string
}

function CashflowTooltip({ active, payload, label }: CashflowTooltipProps) {
  const { formatAmount } = useCurrency()

  if (!active || !payload || !payload.length) {
    return null
  }

  const raw = payload[0]?.payload
  const income = typeof raw?.income === 'number' ? raw.income : 0
  const expense = typeof raw?.expense === 'number' ? raw.expense : 0
  const net = income - expense
  const isSurplus = net >= 0
  const marginPct = income > 0 ? ((net / income) * 100).toFixed(1) : '0.0'

  return (
    <div className="min-w-56 rounded-md border border-border/80 bg-card/95 p-3 text-xs shadow-xl text-foreground backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-border/60 pb-2 mb-2">
        <span className="font-semibold text-foreground text-xs">{label}</span>
        <span
          className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
            isSurplus
              ? 'bg-primary/20 text-lime-900 dark:text-lime-300 border border-primary/40'
              : 'bg-slate-500/15 text-slate-700 dark:text-slate-300 border border-slate-500/30'
          }`}
        >
          {isSurplus ? 'Net Surplus' : 'Net Deficit'}
        </span>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-xs bg-primary border border-black/10 shrink-0" />
            <span className="text-muted-foreground font-medium">
              Income (Inflow)
            </span>
          </div>
          <span className="font-mono font-bold text-foreground">
            {formatAmount(income)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-xs bg-slate-500/20 border border-slate-500/30 shrink-0" />
            <span className="text-muted-foreground font-medium">
              Expense (Outflow)
            </span>
          </div>
          <span className="font-mono font-bold text-foreground">
            {formatAmount(expense)}
          </span>
        </div>

        <div className="border-t border-border/60 pt-2 mt-1 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-xs bg-[#6366F1] shrink-0" />
            <span className="font-semibold text-foreground">Net Cashflow</span>
          </div>
          <div className="text-right">
            <span
              className={`font-mono font-bold ${
                isSurplus
                  ? 'text-lime-700 dark:text-lime-400'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {isSurplus
                ? `+${formatAmount(net)}`
                : `-${formatAmount(Math.abs(net))}`}
            </span>
            <span className="block text-[10px] text-muted-foreground">
              {isSurplus ? '+' : ''}
              {marginPct}% margin
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

const KPI_CARDS = [
  {
    title: 'My Balance',
    amount: 164850,
    trend: '+14.2%',
    isUp: true,
    icon: Wallet,
    containerClass:
      'bg-primary text-primary-foreground border border-primary/20 shadow-none rounded-2xl',
    iconClass: 'bg-black/10 text-primary-foreground rounded-md',
    trendClass: 'bg-black/10 text-primary-foreground rounded-md',
    progress: 85,
    progressBg: 'bg-black/10',
    progressFill: 'bg-primary-foreground',
    subtext: 'Liquid cash across bank accounts',
  },
  {
    title: 'My Income',
    amount: 34800,
    trend: '+9.4% vs last month',
    isUp: true,
    icon: ArrowUpRight,
    containerClass:
      'bg-card text-foreground border border-border shadow-none rounded-2xl',
    iconClass:
      'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-md',
    trendClass:
      'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-md',
    progress: 72,
    progressBg: 'bg-muted',
    progressFill: 'bg-emerald-500',
    subtext: 'Collected revenue and receipts',
  },
  {
    title: 'Total Expenses',
    amount: 20400,
    trend: '-3.1% vs last month',
    isUp: false,
    icon: ArrowDownRight,
    containerClass:
      'bg-card text-foreground border border-border shadow-none rounded-2xl',
    iconClass:
      'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 rounded-md',
    trendClass: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-md',
    progress: 58,
    progressBg: 'bg-muted',
    progressFill: 'bg-rose-500',
    subtext: 'Operating expenses and payouts',
  },
]

const {
  runwayChartData,
  healthChartData,
  cashflowDataMap,
  recentTransactions,
} = dashboardData

function Dashboard() {
  const { symbol, formatAmount } = useCurrency()
  const [cashflowTimeframe, setCashflowTimeframe] =
    useState<CashflowTimeframe>('6m')
  const [cashflowViewMode, setCashflowViewMode] =
    useState<CashflowViewMode>('grouped')
  const [recentTxFilter, setRecentTxFilter] = useState<
    'all' | 'income' | 'expense'
  >('all')
  const [animatedHealthScore, setAnimatedHealthScore] = useState<number>(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedHealthScore(healthChartData[0].score)
    }, 120)
    return () => clearTimeout(timer)
  }, [])

  const currentHealthChartData = useMemo(() => {
    return [
      {
        ...healthChartData[0],
        score: animatedHealthScore,
      },
    ]
  }, [animatedHealthScore])

  const filteredCashflowData = useMemo(() => {
    return cashflowDataMap[cashflowTimeframe]
  }, [cashflowTimeframe])

  const computedCashflowData = useMemo(() => {
    return filteredCashflowData.map((d) => ({
      ...d,
      net: d.income - d.expense,
      expenseNegative: -d.expense,
    }))
  }, [filteredCashflowData])

  const periodSummary = useMemo(() => {
    const totalIncome = filteredCashflowData.reduce(
      (acc, item) => acc + (item.income || 0),
      0,
    )
    const totalExpense = filteredCashflowData.reduce(
      (acc, item) => acc + (item.expense || 0),
      0,
    )
    const netCashflow = totalIncome - totalExpense
    const avgIncome = Math.round(
      totalIncome / (filteredCashflowData.length || 1),
    )
    const avgExpense = Math.round(
      totalExpense / (filteredCashflowData.length || 1),
    )
    const margin =
      totalIncome > 0 ? Math.round((netCashflow / totalIncome) * 100) : 0

    return {
      totalIncome,
      totalExpense,
      netCashflow,
      avgIncome,
      avgExpense,
      margin,
    }
  }, [filteredCashflowData])

  const m3Transition = {
    duration: 0.35,
    ease: [0.2, 0, 0, 1] as [number, number, number, number],
  }

  const allRecentTx = useMemo(() => {
    return recentTransactions.map((tx) => ({
      ...tx,
      icon: tx.type === 'income' ? ArrowUpRight : ArrowDownRight,
      color:
        tx.type === 'income'
          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
          : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    }))
  }, [])

  const filteredTx = useMemo(() => {
    return allRecentTx.filter((tx) => {
      if (recentTxFilter === 'all') return true
      return tx.type === recentTxFilter
    })
  }, [allRecentTx, recentTxFilter])

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-2">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={m3Transition}
        >
          <div className="flex items-center gap-2.5 mb-1">
            <h1 className="text-3xl sm:text-4xl font-medium tracking-tight text-foreground">
              Financial Overview
            </h1>
          </div>
          <p className="text-muted-foreground">
            Track cashflow, runway, and operating liquidity.
          </p>
        </motion.div>
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-3">
        {KPI_CARDS.map((card, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...m3Transition, delay: 0.15 + idx * 0.05 }}
          >
            <div
              className={`p-4 sm:p-6 ${card.containerClass} transition-colors flex flex-col justify-between min-h-43.75 sm:min-h-48.75 h-full`}
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <div className="space-y-1 min-w-0">
                    <span className="sm:text-xs md:text-base font-semibold truncate block">
                      {card.title}
                    </span>
                    <h3 className="font-mono text-3xl sm:text-3xl lg:text-4xl xl:text-5xl font-medium tracking-tight truncate">
                      <NumberTicker
                        value={card.amount}
                        formatter={(v) => formatAmount(v)}
                      />
                    </h3>
                  </div>
                  <div
                    className={`flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center ${card.iconClass}`}
                  >
                    <card.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                </div>
              </div>

              <div className="space-y-2.5 sm:space-y-3 pt-3">
                <div className="flex items-center justify-between text-xs gap-2">
                  <span className="opacity-75 font-medium truncate">
                    {card.subtext}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 font-semibold px-2 py-0.5 shrink-0 ${card.trendClass}`}
                  >
                    {card.isUp ? (
                      <ArrowUpRight className="h-3 w-3" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3" />
                    )}
                    {card.trend}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...m3Transition, delay: 0.25 }}
        className="w-full"
      >
        <Card className="rounded-2xl border-border bg-card shadow-none">
          <CardHeader className="flex flex-col lg:flex-row lg:items-center justify-between pb-4 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-xl font-medium tracking-tight text-foreground">
                  Cashflow Overview
                </CardTitle>
              </div>
              <CardDescription className="text-xs text-muted-foreground mt-0.5">
                Operating cash inflows vs. outflows with mathematical zero
                baseline ($0)
              </CardDescription>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
              <div className="flex items-center gap-1 p-1 bg-muted/60 rounded-md">
                {VIEW_MODE_OPTIONS.map((mode) => (
                  <button
                    key={mode.value}
                    type="button"
                    onClick={() => setCashflowViewMode(mode.value)}
                    title={mode.description}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                      cashflowViewMode === mode.value
                        ? 'bg-card text-foreground shadow-xs font-bold border border-border/80'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1 p-1 bg-muted/60 rounded-md overflow-x-auto max-w-full">
                {TIMEFRAME_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setCashflowTimeframe(opt.value)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-md uppercase transition-all cursor-pointer shrink-0 ${
                      cashflowTimeframe === opt.value
                        ? 'bg-primary text-primary-foreground shadow-xs font-bold'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>

          <CardContent className="px-2 pt-0 sm:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-muted/30 rounded-md border border-border/60 mb-5">
              <div className="flex items-center gap-3 p-2.5 rounded-md bg-card border border-border/50">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/20 text-lime-900 dark:text-lime-300 border border-primary/30">
                  <ArrowUpRight className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[11px] font-medium text-muted-foreground block truncate">
                    Total Inflow
                  </span>
                  <span className="font-mono text-base sm:text-lg font-bold text-foreground block truncate">
                    <NumberTicker
                      value={periodSummary.totalIncome}
                      formatter={(v) => formatAmount(v)}
                    />
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2.5 rounded-md bg-card border border-border/50">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-slate-500/15 text-slate-700 dark:text-slate-300 border border-slate-500/30">
                  <ArrowDownRight className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[11px] font-medium text-muted-foreground block truncate">
                    Total Outflow
                  </span>
                  <span className="font-mono text-base sm:text-lg font-bold text-foreground block truncate">
                    <NumberTicker
                      value={periodSummary.totalExpense}
                      formatter={(v) => formatAmount(v)}
                    />
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2.5 rounded-md bg-card border border-border/50">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md border ${
                    periodSummary.netCashflow >= 0
                      ? 'bg-primary/20 text-lime-900 dark:text-lime-300 border border-primary/30'
                      : 'bg-slate-500/15 text-slate-700 dark:text-slate-300 border border-slate-500/30'
                  }`}
                >
                  {periodSummary.netCashflow >= 0 ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[11px] font-medium text-muted-foreground block truncate">
                    Ending Net Balance
                  </span>
                  <span
                    className={`font-mono text-base sm:text-lg font-bold block truncate ${
                      periodSummary.netCashflow >= 0
                        ? 'text-lime-700 dark:text-lime-400'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <NumberTicker
                      value={periodSummary.netCashflow}
                      formatter={(v) =>
                        `${v >= 0 ? '+' : ''}${formatAmount(v)}`
                      }
                    />
                  </span>
                </div>
              </div>
            </div>

            <div className="w-full overflow-x-auto">
              <div className="min-w-170 sm:min-w-0">
                <ChartContainer
                  config={cashflowChartConfig}
                  className="aspect-auto h-85 w-full"
                >
                  <ComposedChart
                    key={`cashflow-chart-${cashflowViewMode}`}
                    accessibilityLayer
                    data={computedCashflowData}
                    margin={{
                      left: 0,
                      right: 12,
                      top: 12,
                      bottom: 0,
                    }}
                    barGap={4}
                    barCategoryGap="3%"
                  >
                    <CartesianGrid
                      vertical={false}
                      strokeDasharray="7 7"
                      className="stroke-border!"
                    />
                    <XAxis
                      dataKey="name"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      className="text-[11px] font-medium fill-muted-foreground"
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tickCount={5}
                      domain={
                        cashflowViewMode === 'split'
                          ? ['auto', 'auto']
                          : [0, 'auto']
                      }
                      tickFormatter={(val: number) =>
                        `${val < 0 ? '-' : ''}${symbol}${Math.abs(val) >= 1000 ? `${(Math.abs(val) / 1000).toFixed(0)}k` : Math.abs(val)}`
                      }
                      className="text-[11px] font-mono fill-muted-foreground/70"
                    />
                    <ReferenceLine
                      y={0}
                      stroke="var(--border)"
                      strokeWidth={1.5}
                    />
                    <ChartTooltip
                      content={<CashflowTooltip />}
                      cursor={{ fill: 'var(--accent)', opacity: 0.12 }}
                    />
                    <Bar
                      key="bar-income"
                      dataKey="income"
                      name="Inflow"
                      radius={[6, 6, 0, 0]}
                      maxBarSize={80}
                      className="fill-primary"
                    />
                    <Bar
                      key={`bar-expense-${cashflowViewMode}`}
                      dataKey={
                        cashflowViewMode === 'split'
                          ? 'expenseNegative'
                          : 'expense'
                      }
                      name="Outflow"
                      radius={[6, 6, 0, 0]}
                      maxBarSize={80}
                      className="fill-slate-500/10 dark:fill-slate-500/50"
                    />
                  </ComposedChart>
                </ChartContainer>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-border/50 text-xs mt-2">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-xs bg-primary border border-black/10" />
                  <span className="font-medium text-foreground">
                    Total Inflow (Income)
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-xs bg-slate-500/20 border border-slate-500/30" />
                  <span className="font-medium text-foreground">
                    Total Outflow (Expense)
                  </span>
                </div>
              </div>
              <span className="text-[11px] text-muted-foreground">
                {filteredCashflowData.length} periods in view
              </span>
            </div>
          </CardContent>

          <CardFooter className="pt-2 pb-4">
            <div className="flex flex-col sm:flex-row w-full sm:items-center justify-between gap-3 text-xs">
              <div className="grid gap-1">
                <div className="flex items-center gap-2 leading-none font-semibold text-foreground">
                  <span>
                    {periodSummary.netCashflow >= 0
                      ? `Net operating surplus of ${formatAmount(periodSummary.netCashflow)} (${periodSummary.margin}% retention)`
                      : `Net operating deficit of ${formatAmount(Math.abs(periodSummary.netCashflow))}`}
                  </span>
                  {periodSummary.netCashflow >= 0 ? (
                    <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                  )}
                </div>
                <div className="flex items-center gap-2 leading-none text-[11px] text-muted-foreground">
                  Average period inflow: {formatAmount(periodSummary.avgIncome)}{' '}
                  · Average period outflow:{' '}
                  {formatAmount(periodSummary.avgExpense)}
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground bg-muted/40 px-2.5 py-1 rounded-md border border-border/60 self-start sm:self-auto">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                <span>Accounting-Grade Ledger Logic</span>
              </div>
            </div>
          </CardFooter>
        </Card>
      </motion.div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 items-stretch">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...m3Transition, delay: 0.3 }}
          className="flex flex-col"
        >
          <div className="bg-card text-foreground border border-border shadow-none rounded-2xl p-4 sm:p-6 flex-1 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between mb-4 gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground border border-primary/20">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div className="truncate">
                    <h3 className="font-semibold text-sm text-foreground truncate">
                      Cash Runway
                    </h3>
                    <p className="text-[11px] text-muted-foreground truncate">
                      Runway at zero revenue
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
                  Coverage: 8.1 Mo
                </span>
              </div>

              <div className="my-4 sm:my-5">
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
                    <NumberTicker value={8.1} decimalPlaces={1} />
                  </span>
                  <span className="text-sm sm:text-base font-semibold text-muted-foreground">
                    Months
                  </span>
                </div>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" /> +
                  <NumberTicker value={0.4} decimalPlaces={1} /> mo vs previous
                  month
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-muted-foreground">
                    Historical Trend (6 Months)
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                    8.1 months
                  </span>
                </div>
                <ChartContainer
                  config={runwayChartConfig}
                  className="aspect-auto h-[120px] w-full"
                >
                  <LineChart
                    accessibilityLayer
                    data={runwayChartData}
                    margin={{
                      left: 12,
                      right: 12,
                      top: 8,
                      bottom: 4,
                    }}
                  >
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={6}
                      tickFormatter={(value) => value.slice(0, 3)}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Line
                      dataKey="runway"
                      type="natural"
                      stroke="var(--color-runway)"
                      strokeWidth={2}
                      dot={{
                        fill: 'var(--color-runway)',
                      }}
                      activeDot={{
                        r: 5,
                      }}
                    />
                  </LineChart>
                </ChartContainer>
                <p className="text-[11px] text-muted-foreground leading-relaxed pt-1">
                  8.1 months of operating expenses covered at current burn rate.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-border mt-5 grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-0.5">
                <p className="text-[11px] font-medium opacity-75">
                  Monthly Burn Rate
                </p>
                <p className="font-mono text-sm font-bold text-foreground">
                  <NumberTicker
                    value={20400}
                    formatter={(v) => formatAmount(v)}
                  />
                </p>
              </div>
              <div className="space-y-0.5 text-right">
                <p className="text-[11px] font-medium opacity-75">
                  Liquid Cash
                </p>
                <p className="font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  <NumberTicker
                    value={164850}
                    formatter={(v) => formatAmount(v)}
                  />
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...m3Transition, delay: 0.35 }}
          className="flex flex-col"
        >
          <Card className="flex flex-col border border-border bg-card shadow-none rounded-2xl p-0 h-full justify-between">
            <CardHeader className="items-center pb-0 pt-6 px-6 text-center">
              <div className="flex items-center gap-2 mb-1">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground border border-primary/20">
                  <Activity className="h-3.5 w-3.5" />
                </div>
                <CardTitle className="text-lg font-semibold text-foreground">
                  Cash Health
                </CardTitle>
              </div>
              <CardDescription className="text-xs text-muted-foreground">
                Liquidity, operating margin, and payment collection rate
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0 px-6 pt-2">
              <div className="relative mx-auto aspect-square max-h-62.5 w-full flex items-center justify-center">
                <ChartContainer
                  config={healthChartConfig}
                  className="mx-auto aspect-square max-h-62.5 w-full select-none outline-none"
                >
                  <RadialBarChart
                    data={currentHealthChartData}
                    startAngle={0}
                    endAngle={250}
                    outerRadius={90}
                    innerRadius={68}
                  >
                    <PolarGrid
                      gridType="circle"
                      radialLines={false}
                      stroke="none"
                      className="first:fill-muted last:fill-background"
                      polarRadius={[90, 68]}
                    />
                    <RadialBar
                      dataKey="score"
                      background
                      cornerRadius={10}
                      isAnimationActive={true}
                      animationDuration={1500}
                      animationEasing="ease-out"
                      animationBegin={100}
                    />
                  </RadialBarChart>
                </ChartContainer>

                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none text-center">
                  <span className="text-4xl font-bold tracking-tight font-mono text-foreground flex items-center justify-center">
                    <NumberTicker
                      value={healthChartData[0].score}
                      suffix="%"
                      delay={0.12}
                    />
                  </span>
                  <span className="text-xs text-muted-foreground font-medium mt-1">
                    Health Score
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-1 pb-2">
                <div className="p-2.5 bg-muted/40 rounded-md border border-border text-center">
                  <p className="text-[11px] text-muted-foreground font-medium">
                    Operating Margin
                  </p>
                  <p className="font-mono text-sm font-bold text-foreground mt-0.5">
                    <NumberTicker value={41.4} decimalPlaces={1} suffix="%" />
                  </p>
                </div>
                <div className="p-2.5 bg-muted/40 rounded-md border border-border text-center">
                  <p className="text-[11px] text-muted-foreground font-medium">
                    Collection Rate
                  </p>
                  <p className="font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                    <NumberTicker value={98.2} decimalPlaces={1} suffix="%" />
                  </p>
                </div>
                <div className="p-2.5 bg-muted/40 rounded-md border border-border text-center">
                  <p className="text-[11px] text-muted-foreground font-medium">
                    DSO
                  </p>
                  <p className="font-mono text-sm font-bold text-foreground mt-0.5">
                    <NumberTicker value={12} suffix=" Days" />
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between text-xs border-t border-border pt-4 px-6 pb-6 mt-2">
              <div className="flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="h-4 w-4" />
                <span>Improved 4.1% this quarter</span>
              </div>
              <span className="flex items-center gap-1 text-muted-foreground text-[11px]">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                Calculated from ledger
              </span>
            </CardFooter>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...m3Transition, delay: 0.4 }}
        className="w-full"
      >
        <div className="bg-card border border-border shadow-none rounded-2xl p-4 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary border border-primary/20 shrink-0">
                  <Receipt className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-semibold text-foreground">
                    Recent Transactions
                  </h2>
                  <p className="text-[11px] sm:text-xs text-muted-foreground">
                    Latest operating cash entries and settled invoices
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap sm:flex-nowrap items-center justify-between sm:justify-end gap-2.5 sm:gap-3 w-full sm:w-auto">
                <div className="flex items-center gap-1 sm:gap-1.5 p-1 bg-muted/50 rounded-md overflow-x-auto">
                  {(['all', 'income', 'expense'] as const).map((filterType) => (
                    <button
                      key={filterType}
                      onClick={() => setRecentTxFilter(filterType)}
                      className={`px-2.5 sm:px-3 py-1 text-xs font-semibold rounded-lg capitalize transition-all cursor-pointer ${
                        recentTxFilter === filterType
                          ? 'bg-primary text-primary-foreground shadow-xs font-bold'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {filterType === 'all'
                        ? 'All'
                        : filterType === 'income'
                          ? 'Income'
                          : 'Expenses'}
                    </button>
                  ))}
                </div>

                <Link
                  to="/cashbook"
                  className="text-xs font-bold text-foreground hover:underline px-2.5 py-1 rounded-md hover:bg-muted transition-colors flex items-center gap-1 shrink-0"
                >
                  <span>View All</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            <div className="divide-y divide-border rounded-md border border-border overflow-hidden bg-background/50">
              {filteredTx.length === 0 ? (
                <p className="py-10 text-center text-xs text-muted-foreground font-medium">
                  No transactions recorded.
                </p>
              ) : (
                filteredTx.map((tx, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 sm:p-4 hover:bg-accent/40 transition-colors gap-2.5 sm:gap-3 group"
                  >
                    <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 flex-1">
                      <div
                        className={`flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-md border ${tx.color}`}
                      >
                        <tx.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm font-semibold text-foreground truncate">
                          {tx.name}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <p className="text-[11px] sm:text-xs text-muted-foreground truncate">
                            {tx.category}
                          </p>
                          <span className="text-[10px] text-muted-foreground sm:hidden">
                            • {tx.date}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2.5 sm:gap-6 shrink-0">
                      <span
                        className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                          tx.status === 'Paid'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                            : 'bg-muted text-muted-foreground border-border'
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            tx.status === 'Paid'
                              ? 'bg-emerald-500'
                              : 'bg-muted-foreground'
                          }`}
                        />
                        {tx.status}
                      </span>

                      <span className="text-xs font-medium text-muted-foreground hidden md:inline-block">
                        {tx.date}
                      </span>

                      <span
                        className={`font-mono text-xs sm:text-sm font-bold text-right ${
                          tx.type === 'income'
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-foreground'
                        }`}
                      >
                        <NumberTicker
                          value={tx.amount}
                          formatter={(v) =>
                            `${tx.type === 'income' ? '+' : '-'}${formatAmount(v)}`
                          }
                        />
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-border mt-4 flex items-center justify-between text-xs">
            <span className="text-muted-foreground font-medium">
              Showing {filteredTx.length} of {allRecentTx.length} recent
              transactions
            </span>
            <Link
              to="/cashbook"
              className="font-semibold text-foreground flex items-center gap-1 hover:underline"
            >
              Open Cashbook <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
