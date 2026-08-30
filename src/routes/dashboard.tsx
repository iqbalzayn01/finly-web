import { createFileRoute, Link } from '@tanstack/react-router'
import { motion } from 'motion/react'
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Receipt,
  Activity,
  Globe,
  RefreshCw,
  ShieldCheck,
} from '../components/ui/icon'
import { useState, useMemo } from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select'
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
  AreaChart,
  Area,
  Line,
  LineChart,
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from 'recharts'
import { useCurrency } from '../lib/currency'

export const Route = createFileRoute('/dashboard')({ component: Dashboard })

const runwayChartData = [
  { month: 'Feb', runway: 10.4 },
  { month: 'Mar', runway: 11.2 },
  { month: 'Apr', runway: 12.8 },
  { month: 'May', runway: 12.1 },
  { month: 'Jun', runway: 13.5 },
  { month: 'Jul', runway: 14.2 },
]

const runwayChartConfig = {
  runway: {
    label: 'Runway (Months)',
    color: 'var(--primary)',
  },
} satisfies ChartConfig

const healthChartData = [
  { metric: 'health', score: 94, fill: 'var(--primary)' },
]

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
    label: 'Income',
    color: 'var(--primary)',
  },
  expense: {
    label: 'Expenses',
    color: '#d4d4d4',
    theme: {
      light: '#d4d4d4',
      dark: '#525252',
    },
  },
} satisfies ChartConfig

type CashflowTimeframe = '1d' | '1m' | '3m' | '6m' | '1y' | '5y'

const TIMEFRAME_OPTIONS: { label: string; value: CashflowTimeframe }[] = [
  { label: '1D', value: '1d' },
  { label: '1M', value: '1m' },
  { label: '3M', value: '3m' },
  { label: '6M', value: '6m' },
  { label: '1Y', value: '1y' },
  { label: '5Y', value: '5y' },
]

const cashflowDataMap: Record<
  CashflowTimeframe,
  { name: string; income: number; expense: number }[]
> = {
  '1d': [
    { name: '00:00', income: 420, expense: 120 },
    { name: '04:00', income: 680, expense: 210 },
    { name: '08:00', income: 1950, expense: 640 },
    { name: '12:00', income: 3420, expense: 1480 },
    { name: '16:00', income: 2890, expense: 1120 },
    { name: '20:00', income: 1740, expense: 590 },
  ],
  '1m': [
    { name: 'Week 1', income: 6400, expense: 3100 },
    { name: 'Week 2', income: 7800, expense: 3900 },
    { name: 'Week 3', income: 5900, expense: 2800 },
    { name: 'Week 4', income: 8300, expense: 4400 },
  ],
  '3m': [
    { name: 'May', income: 18900, expense: 12100 },
    { name: 'Jun', income: 24500, expense: 10800 },
    { name: 'Jul', income: 28400, expense: 14200 },
  ],
  '6m': [
    { name: 'Feb', income: 15600, expense: 9400 },
    { name: 'Mar', income: 14200, expense: 11000 },
    { name: 'Apr', income: 21800, expense: 13500 },
    { name: 'May', income: 18900, expense: 12100 },
    { name: 'Jun', income: 24500, expense: 10800 },
    { name: 'Jul', income: 28400, expense: 14200 },
  ],
  '1y': [
    { name: 'Aug 25', income: 14500, expense: 9100 },
    { name: 'Sep 25', income: 16200, expense: 9800 },
    { name: 'Oct 25', income: 18400, expense: 11200 },
    { name: 'Nov 25', income: 15100, expense: 8900 },
    { name: 'Dec 25', income: 22400, expense: 14500 },
    { name: 'Jan 26', income: 12400, expense: 8200 },
    { name: 'Feb 26', income: 15600, expense: 9400 },
    { name: 'Mar 26', income: 14200, expense: 11000 },
    { name: 'Apr 26', income: 21800, expense: 13500 },
    { name: 'May 26', income: 18900, expense: 12100 },
    { name: 'Jun 26', income: 24500, expense: 10800 },
    { name: 'Jul 26', income: 28400, expense: 14200 },
  ],
  '5y': [
    { name: '2022', income: 142000, expense: 98000 },
    { name: '2023', income: 188000, expense: 122000 },
    { name: '2024', income: 236000, expense: 154000 },
    { name: '2025', income: 295000, expense: 186000 },
    { name: '2026', income: 198500, expense: 118400 },
  ],
}

function Dashboard() {
  const { symbol, formatAmount } = useCurrency()
  const [cashflowTimeframe, setCashflowTimeframe] =
    useState<CashflowTimeframe>('6m')
  const [recentTxFilter, setRecentTxFilter] = useState<
    'all' | 'income' | 'expense'
  >('all')
  const [fxInput, setFxInput] = useState<number>(100)

  const filteredCashflowData = useMemo(() => {
    return cashflowDataMap[cashflowTimeframe]
  }, [cashflowTimeframe])

  const m3Transition = {
    duration: 0.35,
    ease: [0.2, 0, 0, 1] as [number, number, number, number],
  }

  const allRecentTx = [
    {
      name: 'Acme Corp Q3 Retainer',
      category: 'Design Systems & Strategy',
      date: 'Jul 28, 2026',
      amount: 14500,
      type: 'income',
      status: 'Paid',
      icon: ArrowUpRight,
      color:
        'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    },
    {
      name: 'AWS Cloud Infrastructure',
      category: 'Server & Hosting Ops',
      date: 'Jul 27, 2026',
      amount: 1250,
      type: 'expense',
      status: 'Receipt',
      icon: ArrowDownRight,
      color:
        'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    },
    {
      name: 'Vercel Enterprise Plan',
      category: 'Frontend Edge Hosting',
      date: 'Jul 26, 2026',
      amount: 240,
      type: 'expense',
      status: 'Receipt',
      icon: ArrowDownRight,
      color:
        'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    },
    {
      name: 'Meta Ads Campaign',
      category: 'Online Marketing Ads',
      date: 'Jul 25, 2026',
      amount: 450,
      type: 'expense',
      status: 'Receipt',
      icon: ArrowDownRight,
      color:
        'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    },
    {
      name: 'Stripe Payout',
      category: 'E-commerce Store Sales',
      date: 'Jul 22, 2026',
      amount: 8200,
      type: 'income',
      status: 'Paid',
      icon: ArrowUpRight,
      color:
        'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    },
    {
      name: 'WeWork Office Space',
      category: 'Monthly Desk & Utilities',
      date: 'Jul 20, 2026',
      amount: 850,
      type: 'expense',
      status: 'No Receipt',
      icon: ArrowDownRight,
      color:
        'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    },
    {
      name: 'Slack Subscription',
      category: 'Team Chat Software',
      date: 'Jul 24, 2026',
      amount: 85,
      type: 'expense',
      status: 'Receipt',
      icon: ArrowDownRight,
      color:
        'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    },
  ]

  const period = [
    { label: 'Select a period', value: null },
    { label: 'This Month', value: 'this_month' },
    { label: 'This Quarter', value: 'this_quarter' },
    { label: 'This Year', value: 'this_year' },
  ]

  const filteredTx = allRecentTx.filter((tx) => {
    if (recentTxFilter === 'all') return true
    return tx.type === recentTxFilter
  })

  return (
    <div className="space-y-6 pb-12">
      {/* Header Area */}
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
            Track your cash flow, runway, and daily business activity.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...m3Transition, delay: 0.1 }}
          className="flex items-center gap-3"
        >
          <Select items={period}>
            <SelectTrigger className="w-full max-w-48 bg-card text-foreground font-semibold">
              <SelectValue placeholder="Select a Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {period.map((item) => (
                  <SelectItem key={item.label} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </motion.div>
      </div>

      {/* ROW 1: TOP METRIC CARDS (3 COLUMNS) */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-3">
        {[
          {
            title: 'Total Balance',
            value: formatAmount(148250),
            trend: '+12.5%',
            isUp: true,
            icon: Wallet,
            containerClass:
              'bg-primary text-primary-foreground border border-primary/20 shadow-none rounded-2xl',
            iconClass: 'bg-white/20 text-white rounded-xl',
            trendClass: 'bg-white/20 text-white rounded-full',
            progress: 82,
            progressBg: 'bg-white/20',
            progressFill: 'bg-white',
            subtext: 'Available cash across accounts',
          },
          {
            title: 'Total Income',
            value: formatAmount(34120),
            trend: '+8.2% vs last month',
            isUp: true,
            icon: ArrowUpRight,
            containerClass:
              'bg-card text-foreground border border-border shadow-none rounded-2xl',
            iconClass:
              'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-xl',
            trendClass:
              'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full',
            progress: 68,
            progressBg: 'bg-muted',
            progressFill: 'bg-emerald-500',
            subtext: 'Paid invoices & client payments',
          },
          {
            title: 'Total Expenses',
            value: formatAmount(12450),
            trend: '-2.4% vs last month',
            isUp: false,
            icon: ArrowDownRight,
            containerClass:
              'bg-card text-foreground border border-border shadow-none rounded-2xl',
            iconClass:
              'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 rounded-xl',
            trendClass:
              'bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-full',
            progress: 42,
            progressBg: 'bg-muted',
            progressFill: 'bg-rose-500',
            subtext: 'Bills, tools & operational spend',
          },
        ].map((card, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...m3Transition, delay: 0.15 + idx * 0.05 }}
          >
            <div
              className={`p-4 sm:p-6 ${card.containerClass} transition-colors flex flex-col justify-between min-h-[175px] sm:min-h-[195px] h-full`}
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <div className="space-y-1 min-w-0">
                    <span className="text-[11px] sm:text-xs font-semibold opacity-80 tracking-wide uppercase truncate block">
                      {card.title}
                    </span>
                    <h3 className="font-mono text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight truncate">
                      {card.value}
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
                {/* Progress bar */}
                <div
                  className={`h-2 sm:h-2.5 w-full rounded-full ${card.progressBg} overflow-hidden`}
                >
                  <div
                    className={`h-full rounded-full ${card.progressFill}`}
                    style={{ width: `${card.progress}%` }}
                  />
                </div>

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

      {/* ROW 2: CASH FLOW OVERVIEW CHART (FULL WIDTH) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...m3Transition, delay: 0.25 }}
        className="w-full"
      >
        <Card className="rounded-2xl border-border bg-card shadow-none">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-4">
            <div>
              <CardTitle className="text-xl font-medium tracking-tight text-foreground">
                Cash Flow Overview
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-0.5">
                Monthly cash influx vs outgoing expenditures
              </CardDescription>
            </div>

            {/* Timeframe selector pills */}
            <div className="flex items-center gap-1 p-1 bg-muted/60 rounded-xl self-start sm:self-auto overflow-x-auto max-w-full">
              {TIMEFRAME_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setCashflowTimeframe(opt.value)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg uppercase transition-all cursor-pointer shrink-0 ${
                    cashflowTimeframe === opt.value
                      ? 'bg-primary text-primary-foreground shadow-xs font-bold'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </CardHeader>

          <CardContent className="px-2 pt-0 sm:px-6">
            <ChartContainer
              config={cashflowChartConfig}
              className="aspect-auto h-[280px] w-full"
            >
              <AreaChart
                accessibilityLayer
                data={filteredCashflowData}
                margin={{
                  left: 0,
                  right: 12,
                  top: 10,
                  bottom: 0,
                }}
              >
                <CartesianGrid
                  vertical={false}
                  strokeDasharray="3 3"
                  className="stroke-border/50"
                />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickCount={4}
                  tickFormatter={(val: number) =>
                    `${symbol}${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`
                  }
                  className="text-[11px] font-mono fill-muted-foreground/70"
                />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  cursor={false}
                  defaultIndex={1}
                />
                <defs>
                  <linearGradient id="fillIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-income)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-income)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                  <linearGradient id="fillExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-expense)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-expense)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <Area
                  dataKey="expense"
                  type="natural"
                  fill="url(#fillExpense)"
                  fillOpacity={0.4}
                  stroke="var(--color-expense)"
                  stackId="a"
                />
                <Area
                  dataKey="income"
                  type="natural"
                  fill="url(#fillIncome)"
                  fillOpacity={0.4}
                  stroke="var(--color-income)"
                  stackId="a"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
          <CardFooter>
            <div className="flex w-full items-start gap-2 text-sm">
              <div className="grid gap-1">
                <div className="flex items-center gap-2 leading-none font-semibold text-foreground">
                  <span>Net cashflow trending up by +12.4% this period</span>
                  <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="flex items-center gap-2 leading-none text-xs text-muted-foreground">
                  Average monthly income: {formatAmount(18500)} · Average
                  spending: {formatAmount(11200)}
                </div>
              </div>
            </div>
          </CardFooter>
        </Card>
      </motion.div>

      {/* ROW 3: CASH RUNWAY & CASH HEALTH (COMBINED SINGLE ROW) */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 items-stretch">
        {/* Col 1: Cash Runway */}
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
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div className="truncate">
                    <h3 className="font-semibold text-sm text-foreground truncate">
                      Cash Runway
                    </h3>
                    <p className="text-[11px] text-muted-foreground truncate">
                      Zero Revenue Survival Horizon
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
                  Buffer: 14+ Mo
                </span>
              </div>

              {/* Big Metric */}
              <div className="my-4 sm:my-5">
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
                    14.2
                  </span>
                  <span className="text-sm sm:text-base font-semibold text-muted-foreground">
                    Months
                  </span>
                </div>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" /> +1.5 mo vs last month
                </p>
              </div>

              {/* Visual Runway Trend (Line Chart with Dots) */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-muted-foreground">
                    Historical Trend (6 Months)
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                    Strong (14.2 mo)
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
                  Your business can operate normally for{' '}
                  <strong className="text-foreground font-semibold">
                    14+ months
                  </strong>{' '}
                  with zero additional revenue.
                </p>
              </div>
            </div>

            {/* Footer Breakdown */}
            <div className="pt-4 border-t border-border mt-5 grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-0.5">
                <p className="text-[11px] font-medium opacity-75">
                  Monthly Spending
                </p>
                <p className="font-mono text-sm font-bold text-foreground">
                  {formatAmount(12450)}
                </p>
              </div>
              <div className="space-y-0.5 text-right">
                <p className="text-[11px] font-medium opacity-75">
                  Available Cash
                </p>
                <p className="font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  {formatAmount(148250)}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Col 2: Cash Health Radial Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...m3Transition, delay: 0.35 }}
          className="flex flex-col"
        >
          <Card className="flex flex-col border border-border bg-card shadow-none rounded-2xl p-0 h-full justify-between">
            <CardHeader className="items-center pb-0 pt-6 px-6 text-center">
              <div className="flex items-center gap-2 mb-1">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
                  <Activity className="h-3.5 w-3.5" />
                </div>
                <CardTitle className="text-lg font-semibold text-foreground">
                  Cash Health
                </CardTitle>
              </div>
              <CardDescription className="text-xs text-muted-foreground">
                Liquidity ratio, profit margin &amp; payment reliability
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0 px-6 pt-2">
              <ChartContainer
                config={healthChartConfig}
                className="mx-auto aspect-square max-h-[220px]"
              >
                <RadialBarChart
                  data={healthChartData}
                  startAngle={0}
                  endAngle={240}
                  outerRadius={90}
                  innerRadius={76}
                >
                  <PolarGrid
                    gridType="circle"
                    radialLines={false}
                    stroke="none"
                    className="first:fill-muted/60 last:fill-background"
                    polarRadius={[90, 76]}
                  />
                  <RadialBar dataKey="score" background cornerRadius={10} />
                  <PolarRadiusAxis
                    tick={false}
                    tickLine={false}
                    axisLine={false}
                  >
                    <Label
                      content={({ viewBox }) => {
                        if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                          return (
                            <text
                              x={viewBox.cx}
                              y={viewBox.cy}
                              textAnchor="middle"
                              dominantBaseline="middle"
                            >
                              <tspan
                                x={viewBox.cx}
                                y={viewBox.cy}
                                className="fill-foreground text-4xl font-bold tracking-tight"
                              >
                                {healthChartData[0].score}%
                              </tspan>
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) + 24}
                                className="fill-muted-foreground text-xs font-semibold uppercase tracking-wider"
                              >
                                Health Score
                              </tspan>
                            </text>
                          )
                        }
                      }}
                    />
                  </PolarRadiusAxis>
                </RadialBarChart>
              </ChartContainer>

              {/* Sub-metrics breakdown */}
              <div className="grid grid-cols-3 gap-2 pt-1 pb-2">
                <div className="p-2.5 bg-muted/40 rounded-xl border border-border text-center">
                  <p className="text-[11px] text-muted-foreground font-medium">
                    Margin
                  </p>
                  <p className="font-mono text-sm font-bold text-foreground mt-0.5">
                    63.4%
                  </p>
                </div>
                <div className="p-2.5 bg-muted/40 rounded-xl border border-border text-center">
                  <p className="text-[11px] text-muted-foreground font-medium">
                    On-Time
                  </p>
                  <p className="font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                    96.5%
                  </p>
                </div>
                <div className="p-2.5 bg-muted/40 rounded-xl border border-border text-center">
                  <p className="text-[11px] text-muted-foreground font-medium">
                    Avg Pay
                  </p>
                  <p className="font-mono text-sm font-bold text-primary mt-0.5">
                    14 Days
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between text-xs border-t border-border pt-4 px-6 pb-6 mt-2">
              <div className="flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="h-4 w-4" />
                <span>Trending up by +4.1% this quarter</span>
              </div>
              <span className="flex items-center gap-1 text-muted-foreground text-[11px]">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> Audited
                &amp; Verified
              </span>
            </CardFooter>
          </Card>
        </motion.div>
      </div>

      {/* ROW 4: RECENT ACTIVITY (FULL WIDTH) */}
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
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
                  <Receipt className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-semibold text-foreground">
                    Recent Transactions
                  </h2>
                  <p className="text-[11px] sm:text-xs text-muted-foreground">
                    Latest incoming payments and outgoing bills
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap sm:flex-nowrap items-center justify-between sm:justify-end gap-2.5 sm:gap-3 w-full sm:w-auto">
                {/* Filter Pills */}
                <div className="flex items-center gap-1 sm:gap-1.5 p-1 bg-muted/50 rounded-xl overflow-x-auto">
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
                  className="text-xs font-bold text-primary hover:underline px-2.5 py-1 rounded-xl hover:bg-primary/5 transition-colors flex items-center gap-1 shrink-0"
                >
                  <span>View All</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Filtered Transaction List (Full Width Rows) */}
            <div className="divide-y divide-border rounded-xl border border-border overflow-hidden bg-background/50">
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
                        className={`flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl border ${tx.color}`}
                      >
                        <tx.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
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
                      {/* Status / Receipt Badge */}
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

                      {/* Date */}
                      <span className="text-xs font-medium text-muted-foreground hidden md:inline-block">
                        {tx.date}
                      </span>

                      {/* Amount */}
                      <span
                        className={`font-mono text-xs sm:text-sm font-bold text-right ${
                          tx.type === 'income'
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-foreground'
                        }`}
                      >
                        {tx.type === 'income' ? '+' : '-'}
                        {formatAmount(tx.amount)}
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
              className="font-semibold text-primary flex items-center gap-1 hover:underline"
            >
              Open Cashbook <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </motion.div>

      {/* ROW 5: CURRENCY CONVERTER */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...m3Transition, delay: 0.45 }}
        className="w-full"
      >
        <div className="bg-card border border-border shadow-none rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
                  <Globe className="h-4 w-4" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">
                  Currency Converter
                </h2>
              </div>
              <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />{' '}
                Live Rates
              </span>
            </div>

            {/* Interactive Amount Converter Input */}
            <div className="relative mb-4">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">
                $
              </span>
              <input
                type="number"
                value={fxInput || ''}
                onChange={(e) =>
                  setFxInput(Math.max(0, parseFloat(e.target.value) || 0))
                }
                className="w-full h-10 bg-background border border-border rounded-xl pl-8 pr-16 text-sm font-bold font-mono outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground"
                placeholder="Enter USD amount..."
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-primary">
                USD
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                {
                  pair: 'USD / IDR',
                  label: 'Indonesian Rupiah',
                  rate: `Rp ${(fxInput * 16250).toLocaleString()}`,
                },
                {
                  pair: 'EUR / USD',
                  label: 'Euro',
                  rate: `€ ${(fxInput * 0.915).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                },
                {
                  pair: 'GBP / USD',
                  label: 'British Pound',
                  rate: `£ ${(fxInput * 0.78).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                },
                {
                  pair: 'SGD / IDR',
                  label: 'Singapore Dollar',
                  rate: `S$ ${(fxInput * 1.34).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                },
              ].map((fx, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/30 hover:bg-accent/40 transition-colors"
                >
                  <div>
                    <span className="text-xs font-semibold text-foreground block">
                      {fx.pair}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {fx.label}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-sm font-bold text-foreground">
                      {fx.rate}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-border mt-4 flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <RefreshCw className="h-3 w-3" /> Updated every minute
            </span>
            <span className="font-mono text-primary font-semibold">
              Live Market Rates
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
