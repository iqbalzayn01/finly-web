import { createFileRoute, Link } from '@tanstack/react-router'
import {
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  RefreshCw,
  TrendingUp,
  Globe,
  Activity,
  ShieldCheck,
  Receipt,
  FileText,
} from 'lucide-react'
import { useState, useMemo } from 'react'
import { motion } from 'motion/react'
import { cn } from '../lib/utils'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
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
import { XAxis, YAxis, CartesianGrid, AreaChart, Area } from 'recharts'

export const Route = createFileRoute('/dashboard')({ component: Dashboard })

const cashflowChartConfig = {
  income: {
    label: 'Revenue Inflow',
    color: 'var(--primary)',
  },
  expense: {
    label: 'Operating Burn',
    color: 'rgba(15, 23, 42, 0.25)',
    theme: {
      light: 'rgba(15, 23, 42, 0.25)',
      dark: 'rgba(255, 255, 255, 0.25)',
    },
  },
} satisfies ChartConfig

const fullCashflowData = [
  { name: 'Aug', income: 14500, expense: 9100, year: 2025 },
  { name: 'Sep', income: 16200, expense: 9800, year: 2025 },
  { name: 'Oct', income: 18400, expense: 11200, year: 2025 },
  { name: 'Nov', income: 15100, expense: 8900, year: 2025 },
  { name: 'Dec', income: 22400, expense: 14500, year: 2025 },
  { name: 'Jan', income: 12400, expense: 8200, year: 2026 },
  { name: 'Feb', income: 15600, expense: 9400, year: 2026 },
  { name: 'Mar', income: 14200, expense: 11000, year: 2026 },
  { name: 'Apr', income: 21800, expense: 13500, year: 2026 },
  { name: 'May', income: 18900, expense: 12100, year: 2026 },
  { name: 'Jun', income: 24500, expense: 10800, year: 2026 },
  { name: 'Jul', income: 28400, expense: 14200, year: 2026 },
]

function Dashboard() {
  const [cashflowTimeframe, setCashflowTimeframe] = useState<
    '6m' | 'ytd' | '1y'
  >('6m')
  const [recentTxFilter, setRecentTxFilter] = useState<
    'all' | 'income' | 'expense'
  >('all')
  const [fxInput, setFxInput] = useState<number>(100)

  const filteredCashflowData = useMemo(() => {
    if (cashflowTimeframe === '6m') {
      return fullCashflowData.slice(-6)
    }
    if (cashflowTimeframe === 'ytd') {
      return fullCashflowData.filter((d) => d.year === 2026)
    }
    return fullCashflowData
  }, [cashflowTimeframe])

  const m3Transition = {
    type: 'tween' as const,
    ease: [0.2, 0, 0, 1] as [number, number, number, number],
    duration: 0.5,
  }

  const allRecentTx = [
    {
      name: 'Acme Corporation',
      category: 'Client Retainer · Milestone #3',
      date: 'Today, 2:45 PM',
      amount: 5000,
      type: 'income',
      status: 'Settled',
      icon: ArrowUpRight,
      color:
        'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    },
    {
      name: 'AWS Cloud Infrastructure',
      category: 'Production Hosting & Storage',
      date: 'Yesterday, 10:20 AM',
      amount: 120,
      type: 'expense',
      status: 'Receipt',
      icon: ArrowDownRight,
      color:
        'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    },
    {
      name: 'GlobalTech Solutions',
      category: 'Consulting & Advisory Services',
      date: 'Jul 28, 2026',
      amount: 3500,
      type: 'income',
      status: 'Settled',
      icon: ArrowUpRight,
      color:
        'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    },
    {
      name: 'Meta Ads Campaign',
      category: 'Client Growth & Acquisition',
      date: 'Jul 25, 2026',
      amount: 450,
      type: 'expense',
      status: 'Missing Receipt',
      icon: ArrowDownRight,
      color:
        'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    },
    {
      name: 'Slack Enterprise Grid',
      category: 'Workspace & Communication',
      date: 'Jul 24, 2026',
      amount: 85,
      type: 'expense',
      status: 'Receipt',
      icon: ArrowDownRight,
      color:
        'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    },
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
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
              Live Ledger
            </span>
          </div>
          <p className="text-muted-foreground text-sm sm:text-[15px]">
            Real-time cashflow, runway health, and multi-currency operations.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...m3Transition, delay: 0.1 }}
          className="flex items-center gap-3"
        >
          <Select defaultValue="this_year">
            <SelectTrigger className="w-[180px] h-11 rounded-xl border border-border bg-card shadow-none text-foreground font-semibold">
              <SelectValue placeholder="Select Period" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border border-border shadow-none">
              <SelectItem value="this_month" className="font-medium rounded-lg">
                This Month
              </SelectItem>
              <SelectItem
                value="this_quarter"
                className="font-medium rounded-lg"
              >
                This Quarter
              </SelectItem>
              <SelectItem value="this_year" className="font-medium rounded-lg">
                This Year
              </SelectItem>
            </SelectContent>
          </Select>
        </motion.div>
      </div>

      {/* ROW 1: TOP METRIC CARDS (3 COLUMNS) */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        {[
          {
            title: 'Net Cash Balance',
            value: '$148,250.00',
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
            subtext: 'Liquid capital across operating accounts',
          },
          {
            title: 'Total Inflow',
            value: '$34,120.00',
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
            subtext: 'Settled customer invoices & receivables',
          },
          {
            title: 'Total Outflow',
            value: '$12,450.00',
            trend: '-2.4% vs last month',
            isUp: false,
            icon: ArrowDownRight,
            containerClass:
              'bg-card text-foreground border border-border shadow-none rounded-2xl',
            iconClass:
              'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 rounded-xl',
            trendClass:
              'bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-full',
            progress: 35,
            progressBg: 'bg-muted',
            progressFill: 'bg-rose-500',
            subtext: 'Operating expenses & vendor settlements',
          },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ...m3Transition, delay: i * 0.08 }}
            className={`relative flex flex-col justify-between overflow-hidden p-6 ${stat.containerClass}`}
          >
            {/* Top Bar: Icon on Left, Trend Badge on Right */}
            <div className="flex items-center justify-between">
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center ${stat.iconClass}`}
              >
                <stat.icon className="h-5 w-5" />
              </div>
              <span
                className={`flex items-center gap-1 px-3 py-1 text-xs font-semibold ${stat.trendClass}`}
              >
                {stat.isUp ? (
                  <ArrowUpRight className="h-3.5 w-3.5" />
                ) : (
                  <ArrowDownRight className="h-3.5 w-3.5" />
                )}
                {stat.trend}
              </span>
            </div>

            {/* Middle Content: Big Value and Title */}
            <div className="mt-6 mb-4">
              <h3 className="font-mono text-2xl lg:text-3xl font-bold tracking-tight">
                {stat.value}
              </h3>
              <p className="text-[13px] font-semibold opacity-75 mt-1 tracking-wide">
                {stat.title}
              </p>
            </div>

            {/* Bottom Progress Bar */}
            <div className="space-y-1.5">
              <div
                className={`h-1.5 w-full rounded-full ${stat.progressBg} overflow-hidden`}
              >
                <div
                  className={`h-full rounded-full ${stat.progressFill} transition-all duration-500`}
                  style={{ width: `${stat.progress}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] font-medium opacity-75">
                <span>{stat.subtext}</span>
                <span>{stat.progress}%</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ROW 2: ASYMMETRIC CASHFLOW & HEALTH (65% : 35% / Col-Span 8 : Col-Span 4) */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-12">
        {/* Col-Span 8: Cashflow Dynamics Smooth Area Spline Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...m3Transition, delay: 0.2 }}
          className="lg:col-span-8 flex flex-col"
        >
          <Card className="rounded-2xl border border-border shadow-none bg-card flex-1 flex flex-col justify-between">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6 flex-wrap gap-4 px-6 pt-6">
              <div>
                <CardTitle className="text-xl font-semibold text-foreground">
                  Cashflow Trajectory
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground mt-1">
                  Monthly revenue inflow compared against operating burn
                </CardDescription>
              </div>
              <div className="flex items-center gap-4 flex-wrap">
                {/* Income / Expense Legend Dots */}
                <div className="flex items-center gap-4 text-xs font-semibold mr-1">
                  <div className="flex items-center gap-1.5 text-foreground">
                    <div className="w-2.5 h-2.5 rounded-full bg-primary" /> Revenue Inflow
                  </div>
                  <div className="flex items-center gap-1.5 text-foreground">
                    <div className="w-2.5 h-2.5 rounded-full bg-black/25 dark:bg-white/25" />{' '}
                    <span className="text-black/25 dark:text-white/25 font-semibold">
                      Operating Burn
                    </span>
                  </div>
                </div>

                {/* Timeframe Filter Pills */}
                <div className="flex items-center gap-1 p-1 bg-muted/60 rounded-xl border border-border">
                  {(['6m', 'ytd', '1y'] as const).map((tf) => (
                    <button
                      key={tf}
                      onClick={() => setCashflowTimeframe(tf)}
                      className={cn(
                        'px-3 py-1 text-xs font-bold rounded-lg uppercase transition-all cursor-pointer outline-none',
                        cashflowTimeframe === tf
                          ? 'bg-card text-foreground shadow-none'
                          : 'text-muted-foreground hover:text-foreground',
                      )}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-6 pb-4">
              <ChartContainer
                config={cashflowChartConfig}
                className="h-[320px] w-full"
              >
                <AreaChart
                  accessibilityLayer
                  data={filteredCashflowData}
                  margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="dashboardFillIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-income)" stopOpacity={0.45} />
                      <stop offset="95%" stopColor="var(--color-income)" stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="dashboardFillExpense" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-expense)" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="var(--color-expense)" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    vertical={false}
                    strokeDasharray="4 4"
                    strokeWidth={1.5}
                    className="stroke-border opacity-40"
                  />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tick={{
                      fill: 'var(--muted-foreground)',
                      fontSize: 13,
                      fontWeight: 500,
                    }}
                    dy={4}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: 'var(--muted-foreground)',
                      fontSize: 12,
                      fontWeight: 500,
                    }}
                    tickFormatter={(val) => `$${val / 1000}k`}
                    dx={-5}
                  />
                  <ChartTooltip
                    cursor={{
                      stroke: 'var(--border)',
                      strokeWidth: 1.5,
                      strokeDasharray: '3 3',
                    }}
                    content={<ChartTooltipContent indicator="dot" />}
                  />
                  <Area
                    dataKey="expense"
                    type="monotone"
                    fill="url(#dashboardFillExpense)"
                    fillOpacity={1}
                    stroke="var(--color-expense)"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{
                      r: 5,
                      strokeWidth: 2,
                      fill: 'var(--card)',
                      stroke: 'var(--color-expense)',
                    }}
                  />
                  <Area
                    dataKey="income"
                    type="monotone"
                    fill="url(#dashboardFillIncome)"
                    fillOpacity={1}
                    stroke="var(--color-income)"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{
                      r: 5,
                      strokeWidth: 2,
                      fill: 'var(--card)',
                      stroke: 'var(--color-income)',
                    }}
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-1.5 border-t border-border px-6 py-4 text-xs">
              <div className="flex items-center gap-2 font-bold text-foreground">
                Net positive cashflow: Inflow outpaced burn by $21,670.00 this month{' '}
                <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="text-muted-foreground font-medium">
                Trailing 6-month burn rate remains stable at $11,800/mo.
              </div>
            </CardFooter>
          </Card>
        </motion.div>

        {/* Col-Span 4: Cash Health & Runway Safety Index */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...m3Transition, delay: 0.28 }}
          className="lg:col-span-4 flex flex-col"
        >
          <div className="bg-card text-foreground border border-border shadow-none rounded-2xl p-6 flex-1 flex flex-col justify-between">
            {/* Top Bar */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <span className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Health Score: 94 / 100
                </span>
              </div>

              {/* Big Value, Delta, and Title */}
              <div className="mt-4 mb-5">
                <div className="flex items-baseline justify-between gap-2 flex-wrap">
                  <h3 className="font-mono text-3xl font-bold tracking-tight">
                    14.2 Months
                  </h3>
                  <span className="flex items-center gap-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    <ArrowUpRight className="h-3.5 w-3.5" />
                    +1.5 mo{' '}
                    <span className="opacity-75 font-normal text-foreground">
                      extension
                    </span>
                  </span>
                </div>
                <p className="text-[13px] font-semibold opacity-75 mt-1 tracking-wide">
                  Estimated Operating Runway
                </p>
              </div>

              {/* Runway Safety Index Meter */}
              <div className="space-y-2 p-4 rounded-xl bg-muted/40 border border-border">
                <div className="flex items-center justify-between text-xs font-semibold text-foreground">
                  <span>Runway Safety Index</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">Fortress Grade</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500 transition-all duration-500"
                    style={{ width: '78%' }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] font-medium opacity-75 pt-1">
                  <span>Target: &gt; 12 Months Safety Margin</span>
                  <span>78% of Target Cap</span>
                </div>
              </div>
            </div>

            {/* Footer Breakdown */}
            <div className="pt-4 border-t border-border mt-5 grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-0.5">
                <p className="text-[11px] font-medium opacity-75">
                  Monthly Burn Rate
                </p>
                <p className="font-mono text-sm font-bold text-foreground">
                  $12,450.00
                </p>
              </div>
              <div className="space-y-0.5 text-right">
                <p className="text-[11px] font-medium opacity-75">Liquid Reserves</p>
                <p className="font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  $148,250.00
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ROW 3: RECENT ACTIVITY (FULL WIDTH - COL-SPAN 12) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...m3Transition, delay: 0.35 }}
        className="w-full"
      >
        <div className="bg-card border border-border shadow-none rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
                  <Receipt className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">
                    Recent Transactions
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Verified ledger entries, invoice settlements, and operating expenses
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Filter Pills */}
                <div className="flex items-center gap-1.5 p-1 bg-muted/50 rounded-xl">
                  {(['all', 'income', 'expense'] as const).map((filterType) => (
                    <button
                      key={filterType}
                      onClick={() => setRecentTxFilter(filterType)}
                      className={`px-3 py-1 text-xs font-semibold rounded-lg capitalize transition-all cursor-pointer ${
                        recentTxFilter === filterType
                          ? 'bg-card text-foreground shadow-none'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {filterType === 'all'
                        ? 'All'
                        : filterType === 'income'
                          ? 'Inflow'
                          : 'Outflow'}
                    </button>
                  ))}
                </div>

                <Link
                  to="/cashbook"
                  className="text-xs font-bold text-primary hover:underline px-3 py-1 rounded-xl hover:bg-primary/5 transition-colors flex items-center gap-1"
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
                  No transactions recorded for this filter.
                </p>
              ) : (
                filteredTx.map((tx, i) => (
                  <div
                    key={i}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 sm:p-4 hover:bg-accent/40 transition-colors gap-3 group"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${tx.color}`}
                      >
                        <tx.icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-semibold text-sm text-foreground truncate group-hover:text-primary transition-colors">
                          {tx.name}
                        </h4>
                        <p className="text-xs text-muted-foreground truncate">
                          {tx.category}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-8 shrink-0">
                      {/* Status / Receipt Badge */}
                      <div>
                        {tx.status === 'Settled' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            Settled
                          </span>
                        )}
                        {tx.status === 'Receipt' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                            <FileText className="h-3 w-3" />
                            Receipt Attached
                          </span>
                        )}
                        {tx.status === 'Missing Receipt' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                            Missing Receipt
                          </span>
                        )}
                      </div>

                      {/* Date */}
                      <span className="text-xs text-muted-foreground font-medium w-28 text-left sm:text-right">
                        {tx.date}
                      </span>

                      {/* Amount */}
                      <div className="text-right w-24">
                        <p
                          className={`font-mono text-sm font-bold ${
                            tx.type === 'income'
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-foreground'
                          }`}
                        >
                          {tx.type === 'income' ? '+' : '-'}${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-border mt-4 flex items-center justify-between text-xs">
            <span className="text-muted-foreground font-medium">
              Showing {filteredTx.length} of {allRecentTx.length} reconciled ledger entries
            </span>
            <Link
              to="/cashbook"
              className="font-semibold text-primary flex items-center gap-1 hover:underline"
            >
              Open Full Cashbook <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </motion.div>

      {/* ROW 4: ANALYTICS & CONVERTER (2 COLUMNS - 50% : 50%) */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        {/* Col-Span 6: Financial Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...m3Transition, delay: 0.4 }}
          className="bg-card border border-border shadow-none rounded-2xl p-6 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
                  <Activity className="h-4 w-4" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">
                  Financial Performance
                </h2>
              </div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Health Score: 94 / 100
              </span>
            </div>

            <div className="space-y-4">
              <div className="p-3.5 bg-muted/40 rounded-xl border border-border flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">
                    Operating Margin
                  </p>
                  <p className="font-mono text-lg font-bold text-foreground mt-0.5">
                    63.4%
                  </p>
                </div>
                <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  <TrendingUp className="h-3 w-3" /> +4.1% MoM
                </span>
              </div>

              <div className="p-3.5 bg-muted/40 rounded-xl border border-border flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">
                    Average Invoice Size
                  </p>
                  <p className="font-mono text-lg font-bold text-foreground mt-0.5">
                    $4,250.00
                  </p>
                </div>
                <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  14-Day Velocity
                </span>
              </div>

              <div className="p-3.5 bg-muted/40 rounded-xl border border-border flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">
                    On-Time Settlement Rate
                  </p>
                  <p className="font-mono text-lg font-bold text-foreground mt-0.5">
                    96.5%
                  </p>
                </div>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  Tier-1 Reliability
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border mt-4 flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> Double-Entry
              Audit Verified
            </span>
            <span className="font-mono">v5.0 Ledger</span>
          </div>
        </motion.div>

        {/* Col-Span 6: FX Currency Converter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...m3Transition, delay: 0.45 }}
          className="bg-card border border-border shadow-none rounded-2xl p-6 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
                  <Globe className="h-4 w-4" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">
                  Multi-Currency Settlement
                </h2>
              </div>
              <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />{' '}
                Live Central Bank FX
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
                placeholder="Enter base USD amount..."
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-primary">
                USD
              </span>
            </div>

            <div className="space-y-2.5">
              {[
                {
                  pair: 'USD / IDR',
                  label: 'Indonesian Rupiah (BI Reference)',
                  rate: `Rp ${(fxInput * 16250).toLocaleString()}`,
                },
                {
                  pair: 'EUR / USD',
                  label: 'Euro (ECB Reference)',
                  rate: `€ ${(fxInput * 0.915).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                },
                {
                  pair: 'GBP / USD',
                  label: 'British Pound (BoE Reference)',
                  rate: `£ ${(fxInput * 0.78).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                },
                {
                  pair: 'SGD / IDR',
                  label: 'Singapore Dollar (MAS Reference)',
                  rate: `S$ ${(fxInput * 1.34).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                },
              ].map((fx, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-accent/40 transition-colors"
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
              <RefreshCw className="h-3 w-3" /> 60s auto-refresh
            </span>
            <span className="font-mono text-primary font-semibold">
              Mid-Market Reference Rate
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

