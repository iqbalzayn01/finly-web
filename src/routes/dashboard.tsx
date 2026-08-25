import { createFileRoute, Link } from '@tanstack/react-router'
import { motion } from 'motion/react'
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Receipt,
  FileText,
  Activity,
  Globe,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react'
import { useState, useMemo } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
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
import { XAxis, YAxis, CartesianGrid, AreaChart, Area } from 'recharts'
import { useCurrency } from '../lib/currency'

export const Route = createFileRoute('/dashboard')({ component: Dashboard })

const cashflowChartConfig = {
  income: {
    label: 'Income',
    color: 'var(--primary)',
  },
  expense: {
    label: 'Expenses',
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
  const { symbol, formatAmount } = useCurrency()
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
      return fullCashflowData.filter((item) => item.year === 2026)
    }
    return fullCashflowData
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
              Live
            </span>
          </div>
          <p className="text-muted-foreground text-sm sm:text-[15px]">
            Track your cash flow, runway, and daily business activity.
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
              className={`p-6 ${card.containerClass} transition-colors flex flex-col justify-between h-[210px]`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-xs font-semibold opacity-80 tracking-wide uppercase">
                      {card.title}
                    </span>
                    <h3 className="font-mono text-3xl font-medium tracking-tight">
                      {card.value}
                    </h3>
                  </div>
                  <div className={`p-3 ${card.iconClass}`}>
                    <card.icon className="h-5 w-5" />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {/* Progress bar */}
                <div
                  className={`h-1.5 w-full rounded-full ${card.progressBg} overflow-hidden`}
                >
                  <div
                    className={`h-full rounded-full ${card.progressFill}`}
                    style={{ width: `${card.progress}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="opacity-75 font-medium">{card.subtext}</span>
                  <span
                    className={`inline-flex items-center gap-1 font-semibold px-2 py-0.5 ${card.trendClass}`}
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

      {/* ROW 2: ASYMMETRIC CASHFLOW & HEALTH (65% : 35% / Col-Span 8 : Col-Span 4) */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-12 items-stretch">
        {/* Col-Span 8: Cash Flow Smooth Monotone Area Spline Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...m3Transition, delay: 0.25 }}
          className="lg:col-span-8 flex flex-col"
        >
          <Card className="flex-1 flex flex-col justify-between rounded-2xl border-border bg-card shadow-none">
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
              <div className="flex items-center gap-1 p-1 bg-muted/60 rounded-xl self-start sm:self-auto">
                {(['6m', 'ytd', '1y'] as const).map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setCashflowTimeframe(tf)}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg uppercase transition-all cursor-pointer ${
                      cashflowTimeframe === tf
                        ? 'bg-card text-foreground shadow-none'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </CardHeader>

            <CardContent className="px-2 pt-0 sm:px-6">
              <ChartContainer
                config={cashflowChartConfig}
                className="aspect-auto h-[260px] w-full"
              >
                <AreaChart
                  data={filteredCashflowData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="dashboardFillIncome"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="var(--primary)"
                        stopOpacity={0.4}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--primary)"
                        stopOpacity={0.0}
                      />
                    </linearGradient>
                    <linearGradient
                      id="dashboardFillExpense"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="var(--color-expense)"
                        stopOpacity={0.25}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--color-expense)"
                        stopOpacity={0.0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    vertical={false}
                    strokeDasharray="3 3"
                    stroke="var(--border)"
                    opacity={0.6}
                  />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
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
                    tickFormatter={(val) => `${symbol}${val >= 1000 ? (val / 1000).toFixed(0) + 'k' : val}`}
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
                Net profit: +{formatAmount(21670)} this month{' '}
                <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="text-muted-foreground font-medium">
                Average monthly spending: {formatAmount(11800)}.
              </div>
            </CardFooter>
          </Card>
        </motion.div>

        {/* Col-Span 4: Cash Runway */}
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
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-foreground">
                      Cash Runway
                    </h3>
                    <p className="text-[11px] text-muted-foreground">
                      Zero Revenue Survival
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Healthy (94/100)
                </span>
              </div>

              {/* Big Metric */}
              <div className="my-6">
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-5xl font-extrabold tracking-tight text-foreground">
                    14.2
                  </span>
                  <span className="text-base font-semibold text-muted-foreground">
                    Months
                  </span>
                </div>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" /> +1.5 mo vs last month
                </p>
              </div>

              {/* Visual Safety Target Meter */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-muted-foreground">
                    Safety Target (6 mo)
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                    Strong (14.2 mo)
                  </span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-emerald-500 to-primary rounded-full transition-all duration-500"
                    style={{ width: '85%' }}
                  />
                </div>
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
                    Latest incoming payments and outgoing bills
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
                          ? 'Income'
                          : 'Expenses'}
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
                  No transactions recorded.
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
                        {tx.status === 'Paid' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            Paid
                          </span>
                        )}
                        {tx.status === 'Receipt' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                            <FileText className="h-3 w-3" />
                            Receipt
                          </span>
                        )}
                        {tx.status === 'No Receipt' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                            No Receipt
                          </span>
                        )}
                      </div>

                      {/* Date */}
                      <span className="text-xs text-muted-foreground font-medium w-28 text-left sm:text-right">
                        {tx.date}
                      </span>

                      {/* Amount */}
                      <div className="text-right w-28">
                        <p
                          className={`font-mono text-sm font-bold ${
                            tx.type === 'income'
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-foreground'
                          }`}
                        >
                          {tx.type === 'income' ? '+' : '-'}
                          {formatAmount(tx.amount)}
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

      {/* ROW 4: ANALYTICS & CONVERTER (2 COLUMNS - 50% : 50%) */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        {/* Col-Span 6: Business Health */}
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
                  Business Health
                </h2>
              </div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Score: 94 / 100
              </span>
            </div>

            <div className="space-y-4">
              <div className="p-3.5 bg-muted/40 rounded-xl border border-border flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">
                    Profit Margin
                  </p>
                  <p className="font-mono text-lg font-bold text-foreground mt-0.5">
                    63.4%
                  </p>
                </div>
                <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  <TrendingUp className="h-3 w-3" /> +4.1% vs last month
                </span>
              </div>

              <div className="p-3.5 bg-muted/40 rounded-xl border border-border flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">
                    Average Invoice
                  </p>
                  <p className="font-mono text-lg font-bold text-foreground mt-0.5">
                    {formatAmount(4250)}
                  </p>
                </div>
                <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  14-Day Average Pay
                </span>
              </div>

              <div className="p-3.5 bg-muted/40 rounded-xl border border-border flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">
                    On-Time Payments
                  </p>
                  <p className="font-mono text-lg font-bold text-foreground mt-0.5">
                    96.5%
                  </p>
                </div>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  Paid on Time
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border mt-4 flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> Audited
              &amp; Verified
            </span>
            <span className="font-mono">Finly OS v5.0</span>
          </div>
        </motion.div>

        {/* Col-Span 6: Currency Converter */}
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

            <div className="space-y-2.5">
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
              <RefreshCw className="h-3 w-3" /> Updated every minute
            </span>
            <span className="font-mono text-primary font-semibold">
              Live Market Rates
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
