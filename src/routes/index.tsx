import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState, useId, useMemo } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  Sparkles,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Globe,
  TrendingUp,
  Calculator,
  Bot,
  Play,
  Star,
  Lock,
  Wallet,
  RefreshCw,
  Activity,
  ShieldCheck,
  Receipt,
} from 'lucide-react'
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
  ChartTooltipContent
  
} from '../components/ui/chart'
import type { ChartConfig } from '../components/ui/chart'
import { XAxis, YAxis, CartesianGrid, AreaChart, Area } from 'recharts'
import { cn } from '../lib/utils'
import { Button } from '../components/ui/button'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

const cashflowChartConfig = {
  income: {
    label: 'Revenue Inflow',
    color: 'var(--primary)',
  },
  expense: {
    label: 'Operating Expenses',
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

function LandingPage() {
  const navigate = useNavigate()
  const [monthlyRevenue, setMonthlyRevenue] = useState<number>(45000)
  const [activeTab, setActiveTab] = useState<'overview' | 'ai' | 'fx'>(
    'overview',
  )
  const [cashflowTimeframe, setCashflowTimeframe] = useState<
    '6m' | 'ytd' | '1y'
  >('6m')
  const [recentTxFilter, setRecentTxFilter] = useState<
    'all' | 'income' | 'expense'
  >('all')
  const [fxAmount, setFxAmount] = useState<number>(1000)
  const [fxInput, setFxInput] = useState<number>(100)
  const sliderId = useId()

  const m3Transition = {
    type: 'tween' as const,
    ease: [0.2, 0, 0, 1] as [number, number, number, number],
    duration: 0.5,
  }

  const filteredCashflowData = useMemo(() => {
    if (cashflowTimeframe === '6m') {
      return fullCashflowData.slice(-6)
    }
    if (cashflowTimeframe === 'ytd') {
      return fullCashflowData.filter((d) => d.year === 2026)
    }
    return fullCashflowData
  }, [cashflowTimeframe])

  const allRecentTx = [
    {
      name: 'Acme Corp Web Dev',
      category: 'Income / Services',
      date: 'Today, 2:45 PM',
      amount: 5000,
      type: 'income',
      icon: ArrowUpRight,
      color:
        'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    },
    {
      name: 'AWS Infrastructure',
      category: 'Software & Hosting',
      date: 'Yesterday, 10:20 AM',
      amount: 120,
      type: 'expense',
      icon: ArrowDownRight,
      color:
        'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    },
    {
      name: 'Q3 Retainer GlobalTech',
      category: 'Income / Retainer',
      date: 'Jul 28, 2026',
      amount: 3500,
      type: 'income',
      icon: ArrowUpRight,
      color:
        'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    },
    {
      name: 'Facebook Ads Campaign',
      category: 'Marketing & Ads',
      date: 'Jul 26, 2026',
      amount: 450,
      type: 'expense',
      icon: ArrowDownRight,
      color:
        'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    },
    {
      name: 'Slack Team Subscription',
      category: 'Software & SaaS',
      date: 'Jul 24, 2026',
      amount: 85,
      type: 'expense',
      icon: ArrowDownRight,
      color:
        'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    },
  ]

  const filteredTx = useMemo(() => {
    if (recentTxFilter === 'all') return allRecentTx
    return allRecentTx.filter((tx) => tx.type === recentTxFilter)
  }, [recentTxFilter, allRecentTx])

  // Calculated ROI values
  const hoursSaved = Math.round((monthlyRevenue / 1000) * 0.4)
  const moneySaved = Math.round(monthlyRevenue * 0.08)

  // JSON-LD Structured Data for SEO
  const jsonLdData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Finly B2B Cashflow OS',
    operatingSystem: 'Web',
    applicationCategory: 'BusinessApplication',
    offers: {
      '@type': 'Offer',
      price: '29.00',
      priceCurrency: 'USD',
    },
    description:
      'Operating System for B2B agency cashflow, AI invoice drafting, live multi-currency FX rates, and integer-precision financial ledgers.',
  }

  return (
    <div className="space-y-20 pb-20 overflow-hidden">
      {/* Inject Structured Data Script for Google Search Indexing */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
      />

      {/* Hero Section */}
      <section
        aria-labelledby="hero-heading"
        className="relative pt-6 md:pt-10 pb-8 text-center max-w-6xl mx-auto space-y-6"
      >
        {/* Ambient Glow Backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-primary/10 blur-[120px] rounded-full pointer-events-none -z-10" />

        {/* Eyebrow Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={m3Transition}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-wide"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>ZERO-JARGON CASHFLOW OPERATING SYSTEM</span>
        </motion.div>

        {/* Main H1 Headline */}
        <motion.h1
          id="hero-heading"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...m3Transition, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.08] max-w-4xl mx-auto"
        >
          Stop guessing your agency runway. Take control of your cashflow.
        </motion.h1>

        {/* Hero Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...m3Transition, delay: 0.2 }}
          className="text-base sm:text-xl text-muted-foreground max-w-[55ch] mx-auto leading-relaxed font-medium"
        >
          Eliminate floating-point ledger errors, turn vendor receipts into
          clean invoices in seconds, and track real-time multi-currency
          cashflow.
        </motion.p>

        {/* Dual Primary & Secondary CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...m3Transition, delay: 0.3 }}
          className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/pricing"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm shadow-none transition-all flex items-center justify-center gap-2 outline-none cursor-pointer active:scale-[0.98]"
          >
            <span>Start Free Trial</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/dashboard"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-card border border-border hover:bg-accent/60 text-foreground font-bold text-sm transition-all flex items-center justify-center gap-2 outline-none cursor-pointer shadow-none active:scale-[0.98]"
          >
            <Play className="h-4 w-4 fill-current text-primary" />
            <span>Explore Live Demo</span>
          </Link>
        </motion.div>

        {/* Product Interactive Demo Showcase Window */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...m3Transition, delay: 0.4 }}
          className="pt-8 max-w-6xl mx-auto"
        >
          <div className="rounded-3xl border border-border bg-card shadow-none overflow-hidden text-left">
            {/* Mac Browser Window Header */}
            <div className="px-5 py-3.5 border-b border-border bg-muted/40 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                <span className="ml-2 text-xs font-mono font-medium text-muted-foreground">
                  app.finly.io/dashboard
                </span>
              </div>

              {/* Interactive Showcase Tabs */}
              <div className="flex items-center gap-1 p-1 bg-background rounded-xl border border-border">
                {(['overview', 'ai', 'fx'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      'px-3 py-1 text-xs font-bold rounded-lg uppercase transition-all cursor-pointer outline-none',
                      activeTab === tab
                        ? 'bg-primary text-primary-foreground shadow-none'
                        : 'text-muted-foreground hover:text-foreground',
                    )}
                  >
                    {tab === 'overview'
                      ? 'Cashflow'
                      : tab === 'ai'
                        ? 'AI Parse'
                        : 'Live FX'}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Preview Content */}
            <div className="p-5 md:p-7 bg-card min-h-[320px] flex flex-col justify-between overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <AnimatePresence mode="wait">
                {activeTab === 'overview' && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={m3Transition}
                    className="space-y-5 min-w-[840px] xl:min-w-0 w-full"
                  >
                    {/* Dashboard Header Area */}
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-foreground">
                            Analytics &amp; Cashflow
                          </h2>
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                            Live OS
                          </span>
                        </div>
                        <p className="text-muted-foreground text-xs">
                          Real-time business health, operating cashflow, and AI
                          forecast.
                        </p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <Select defaultValue="this_year">
                          <SelectTrigger className="w-[150px] h-9 rounded-xl border border-border bg-card shadow-none text-foreground font-semibold text-xs">
                            <SelectValue placeholder="Select Period" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl border border-border shadow-none">
                            <SelectItem
                              value="this_month"
                              className="font-medium rounded-lg text-xs"
                            >
                              This Month
                            </SelectItem>
                            <SelectItem
                              value="this_quarter"
                              className="font-medium rounded-lg text-xs"
                            >
                              This Quarter
                            </SelectItem>
                            <SelectItem
                              value="this_year"
                              className="font-medium rounded-lg text-xs"
                            >
                              This Year
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Top Metrics Cards - Fixed 4-Column Layout */}
                    <div className="grid grid-cols-4 gap-3.5">
                      {[
                        {
                          title: 'Total Net Balance',
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
                        },
                        {
                          title: 'Total Income',
                          value: '$34,120.00',
                          trend: '+8.2%',
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
                        },
                        {
                          title: 'Total Expenses',
                          value: '$12,450.00',
                          trend: '-2.4%',
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
                        },
                      ].map((stat, i) => (
                        <div
                          key={i}
                          className={`relative flex flex-col justify-between overflow-hidden p-5 ${stat.containerClass}`}
                        >
                          <div className="flex items-center justify-between">
                            <div
                              className={`flex h-10 w-10 shrink-0 items-center justify-center ${stat.iconClass}`}
                            >
                              <stat.icon className="h-5 w-5" />
                            </div>
                            <span
                              className={`flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold ${stat.trendClass}`}
                            >
                              {stat.isUp ? (
                                <ArrowUpRight className="h-3.5 w-3.5" />
                              ) : (
                                <ArrowDownRight className="h-3.5 w-3.5" />
                              )}
                              {stat.trend}
                            </span>
                          </div>

                          <div className="mt-4 mb-3">
                            <h3 className="font-mono text-xl lg:text-2xl font-bold tracking-tight">
                              {stat.value}
                            </h3>
                            <p className="text-xs font-semibold opacity-75 mt-0.5 tracking-wide">
                              {stat.title}
                            </p>
                          </div>

                          <div className="space-y-1">
                            <div
                              className={`h-1.5 w-full rounded-full ${stat.progressBg} overflow-hidden`}
                            >
                              <div
                                className={`h-full rounded-full ${stat.progressFill} transition-all duration-500`}
                                style={{ width: `${stat.progress}%` }}
                              />
                            </div>
                            <div className="flex items-center justify-between text-[10px] font-medium opacity-75">
                              <span>{stat.progress}% of monthly target</span>
                              <span>vs last month</span>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* 4th Metric Card: Cash Health & Runway */}
                      <div className="relative flex flex-col justify-between overflow-hidden p-5 bg-card text-foreground border border-border shadow-none rounded-2xl">
                        <div className="flex items-center justify-between">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            <ShieldCheck className="h-5 w-5" />
                          </div>
                          <span className="flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Healthy (94/100)
                          </span>
                        </div>

                        <div className="mt-4 mb-3">
                          <div className="flex items-baseline justify-between gap-2 flex-wrap">
                            <h3 className="font-mono text-xl lg:text-2xl font-bold tracking-tight">
                              14.2 Months
                            </h3>
                            <span className="flex items-center gap-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                              <ArrowUpRight className="h-3.5 w-3.5" />
                              +1.5 mo
                            </span>
                          </div>
                          <p className="text-xs font-semibold opacity-75 mt-0.5 tracking-wide">
                            Cash Health &amp; Runway
                          </p>
                        </div>

                        <div className="space-y-1">
                          <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-indigo-500 transition-all duration-500"
                              style={{ width: '74%' }}
                            />
                          </div>
                          <div className="flex items-center justify-between text-[10px] font-medium opacity-75">
                            <span>Fortress Zone (&gt;6 Mo)</span>
                            <span>74% of target</span>
                          </div>
                        </div>

                        <div className="pt-2.5 border-t border-border mt-2.5 grid grid-cols-2 gap-2 text-xs">
                          <div className="space-y-0.5">
                            <p className="text-[10px] font-medium opacity-75">
                              Monthly Burn
                            </p>
                            <p className="font-mono text-[11px] font-bold text-foreground">
                              $12,450.00
                            </p>
                          </div>
                          <div className="space-y-0.5 text-right">
                            <p className="text-[10px] font-medium opacity-75">
                              Liquid Cash
                            </p>
                            <p className="font-mono text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                              $148,250.00
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Main Chart Area: Smooth Gradient Area Spline Monotone Bezier using ShadCN UI */}
                    <Card className="rounded-2xl border border-border shadow-none bg-card">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6 flex-wrap gap-3 p-5 pb-4">
                        <div>
                          <CardTitle className="text-base sm:text-lg font-semibold text-foreground">
                            Cashflow Dynamics
                          </CardTitle>
                          <CardDescription className="text-xs text-muted-foreground mt-0.5">
                            Real-time revenue inflow vs. operating burn trajectory
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-4 flex-wrap">
                          {/* Legend Dots */}
                          <div className="flex items-center gap-3 text-xs font-semibold mr-1">
                            <div className="flex items-center gap-1.5 text-foreground">
                              <div className="w-2.5 h-2.5 rounded-full bg-primary" />{' '}
                              Revenue Inflow
                            </div>
                            <div className="flex items-center gap-1.5 text-foreground">
                              <div className="w-2.5 h-2.5 rounded-full bg-black/25 dark:bg-white/25" />{' '}
                              <span className="text-black/25 dark:text-white/25 font-semibold">
                                Operating Expenses
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
                                  'px-2.5 py-1 text-xs font-bold rounded-lg uppercase transition-all cursor-pointer outline-none',
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

                      <CardContent className="px-5 pb-3">
                        <ChartContainer
                          config={cashflowChartConfig}
                          className="h-[280px] w-full"
                        >
                          <AreaChart
                            accessibilityLayer
                            data={filteredCashflowData}
                            margin={{
                              top: 10,
                              right: 10,
                              left: -10,
                              bottom: 0,
                            }}
                          >
                            <defs>
                              <linearGradient id="landingFillIncome" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-income)" stopOpacity={0.45} />
                                <stop offset="95%" stopColor="var(--color-income)" stopOpacity={0.02} />
                              </linearGradient>
                              <linearGradient id="landingFillExpense" x1="0" y1="0" x2="0" y2="1">
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
                              tickMargin={8}
                              axisLine={false}
                              tick={{
                                fill: 'var(--muted-foreground)',
                                fontSize: 12,
                                fontWeight: 500,
                              }}
                              dy={4}
                            />
                            <YAxis
                              axisLine={false}
                              tickLine={false}
                              tick={{
                                fill: 'var(--muted-foreground)',
                                fontSize: 11,
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
                              content={
                                <ChartTooltipContent indicator="dot" />
                              }
                            />
                            <Area
                              dataKey="expense"
                              type="monotone"
                              fill="url(#landingFillExpense)"
                              fillOpacity={1}
                              stroke="var(--color-expense)"
                              strokeWidth={2.5}
                              dot={false}
                              activeDot={{
                                r: 4.5,
                                strokeWidth: 2,
                                fill: 'var(--card)',
                                stroke: 'var(--color-expense)',
                              }}
                            />
                            <Area
                              dataKey="income"
                              type="monotone"
                              fill="url(#landingFillIncome)"
                              fillOpacity={1}
                              stroke="var(--color-income)"
                              strokeWidth={2.5}
                              dot={false}
                              activeDot={{
                                r: 4.5,
                                strokeWidth: 2,
                                fill: 'var(--card)',
                                stroke: 'var(--color-income)',
                              }}
                            />
                          </AreaChart>
                        </ChartContainer>
                      </CardContent>
                      <CardFooter className="flex-col items-start gap-1 border-t border-border px-5 py-3 text-xs">
                        <div className="flex items-center gap-2 font-bold text-foreground">
                          Net cashflow is trending up by +12.5% this month{' '}
                          <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div className="text-muted-foreground font-medium">
                          Inflow consistently outpaced operating expenses over the selected timeframe.
                        </div>
                      </CardFooter>
                    </Card>

                    {/* 3-Column Bottom Grid: Financial Statistics | FX Exchange | Recent Transactions with Filter */}
                    <div className="grid grid-cols-3 gap-3.5">
                      {/* Card 1: Financial Statistics & Health */}
                      <div className="bg-card border border-border shadow-none rounded-2xl p-5 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
                                <Activity className="h-4 w-4" />
                              </div>
                              <h4 className="text-sm font-semibold text-foreground">
                                Financial Statistics
                              </h4>
                            </div>
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                              Score: 94/100
                            </span>
                          </div>

                          <div className="space-y-3">
                            <div className="p-3 bg-muted/40 rounded-xl border border-border flex items-center justify-between">
                              <div>
                                <p className="text-[11px] text-muted-foreground font-medium">
                                  Operating Margin
                                </p>
                                <p className="font-mono text-base font-bold text-foreground mt-0.5">
                                  63.4%
                                </p>
                              </div>
                              <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                                <TrendingUp className="h-3 w-3" /> +4.1%
                              </span>
                            </div>

                            <div className="p-3 bg-muted/40 rounded-xl border border-border flex items-center justify-between">
                              <div>
                                <p className="text-[11px] text-muted-foreground font-medium">
                                  Avg. Invoice Settled
                                </p>
                                <p className="font-mono text-base font-bold text-foreground mt-0.5">
                                  $4,250.00
                                </p>
                              </div>
                              <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                                Net 14 Avg
                              </span>
                            </div>

                            <div className="p-3 bg-muted/40 rounded-xl border border-border flex items-center justify-between">
                              <div>
                                <p className="text-[11px] text-muted-foreground font-medium">
                                  On-Time Payment
                                </p>
                                <p className="font-mono text-base font-bold text-foreground mt-0.5">
                                  96.5%
                                </p>
                              </div>
                              <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                                High Reliability
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-border mt-3 flex items-center justify-between text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />{' '}
                            Audit Ledger Verified
                          </span>
                          <span className="font-mono text-[11px]">
                            v5.0 Ledger
                          </span>
                        </div>
                      </div>

                      {/* Card 2: Interactive FX Currency Converter */}
                      <div className="bg-card border border-border shadow-none rounded-2xl p-5 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
                                <Globe className="h-4 w-4" />
                              </div>
                              <h4 className="text-sm font-semibold text-foreground">
                                FX Currency Converter
                              </h4>
                            </div>
                            <span className="flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />{' '}
                              Live FX
                            </span>
                          </div>

                          {/* Interactive Amount Converter Input */}
                          <div className="relative mb-3">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">
                              $
                            </span>
                            <input
                              type="number"
                              value={fxInput || ''}
                              onChange={(e) =>
                                setFxInput(
                                  Math.max(0, parseFloat(e.target.value) || 0),
                                )
                              }
                              className="w-full h-9 bg-background border border-border rounded-xl pl-7 pr-14 text-xs font-bold font-mono outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground"
                              placeholder="Enter USD amount..."
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-primary">
                              USD
                            </span>
                          </div>

                          <div className="space-y-1.5">
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
                                className="flex items-center justify-between p-2 rounded-xl hover:bg-accent/40 transition-colors"
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
                                  <p className="font-mono text-xs font-bold text-foreground">
                                    {fx.rate}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="pt-3 border-t border-border mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <RefreshCw className="h-3 w-3" /> 60s live rate
                          </span>
                          <span className="font-mono text-primary font-semibold">
                            1 USD = 16,250 IDR
                          </span>
                        </div>
                      </div>

                      {/* Card 3: Recent Transactions with Filter */}
                      <div className="bg-card border border-border shadow-none rounded-2xl p-5 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
                                <Receipt className="h-4 w-4" />
                              </div>
                              <h4 className="text-sm font-semibold text-foreground">
                                Recent Activity
                              </h4>
                            </div>
                            <Link
                              to="/cashbook"
                              className="text-xs font-semibold text-primary hover:underline"
                            >
                              View All
                            </Link>
                          </div>

                          {/* Filter Pills Header */}
                          <div className="flex items-center gap-1 p-0.5 bg-muted/50 rounded-xl mb-3">
                            {(['all', 'income', 'expense'] as const).map(
                              (filterType) => (
                                <button
                                  key={filterType}
                                  onClick={() => setRecentTxFilter(filterType)}
                                  className={`flex-1 py-1 text-[11px] font-semibold rounded-lg capitalize transition-all ${
                                    recentTxFilter === filterType
                                      ? 'bg-card text-foreground shadow-none'
                                      : 'text-muted-foreground hover:text-foreground'
                                  }`}
                                >
                                  {filterType}
                                </button>
                              ),
                            )}
                          </div>

                          {/* Filtered Transaction List */}
                          <div className="space-y-1.5">
                            {filteredTx.slice(0, 4).map((tx, i) => (
                              <div
                                key={i}
                                className="flex items-center justify-between p-2 rounded-xl hover:bg-accent/40 transition-colors"
                              >
                                <div className="flex items-center gap-2.5">
                                  <div
                                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border ${tx.color}`}
                                  >
                                    <tx.icon className="h-3.5 w-3.5" />
                                  </div>
                                  <div className="overflow-hidden">
                                    <h5 className="font-semibold text-xs text-foreground truncate max-w-[130px] sm:max-w-[180px]">
                                      {tx.name}
                                    </h5>
                                    <p className="text-[10px] text-muted-foreground truncate">
                                      {tx.category}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right shrink-0">
                                  <p
                                    className={`font-mono text-xs font-semibold ${tx.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-foreground'}`}
                                  >
                                    {tx.type === 'income' ? '+' : '-'}$
                                    {tx.amount.toLocaleString()}
                                  </p>
                                  <p className="text-[10px] text-muted-foreground">
                                    {tx.date.split(',')[0]}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="pt-3 border-t border-border mt-3 flex items-center justify-between text-xs">
                          <span className="text-muted-foreground text-[11px]">
                            Showing {Math.min(4, filteredTx.length)} entries
                          </span>
                          <Link
                            to="/cashbook"
                            className="font-semibold text-primary flex items-center gap-1 hover:underline text-xs"
                          >
                            Open Cashbook <ArrowUpRight className="h-3 w-3" />
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Verification Banner */}
                    <div className="p-4 rounded-2xl bg-muted/20 border border-border flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                          <TrendingUp className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground">
                            Integer Minor-Unit Accuracy
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Stored as minor units (Scale 100) preventing
                            floating point ledger errors.
                          </p>
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20">
                        100% Audit Verified
                      </span>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'ai' && (
                  <motion.div
                    key="ai"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={m3Transition}
                    className="space-y-4"
                  >
                    <div className="p-5 rounded-2xl bg-primary/5 border border-primary/20 flex items-start gap-4">
                      <Bot className="h-6 w-6 text-primary shrink-0 mt-1 animate-bounce" />
                      <div>
                        <h4 className="text-sm font-bold text-foreground">
                          AI Human-in-the-Loop Invoice Parser
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                          "Parsed PDF invoice #INV-2026-88. Customer: Acme Corp.
                          Subtotal: $5,000.00. Tax: $550.00 (11%). Ready for
                          1-click confirmation."
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <Button variant="outline" size="sm">
                        Edit Items
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => navigate({ to: '/invoices' })}
                      >
                        Approve &amp; Draft
                      </Button>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'fx' && (
                  <motion.div
                    key="fx"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={m3Transition}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/40 border border-border">
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground font-medium">
                          Input USD Amount
                        </p>
                        <input
                          type="number"
                          value={fxAmount}
                          onChange={(e) => setFxAmount(Number(e.target.value))}
                          className="font-mono text-xl font-bold bg-transparent text-foreground outline-none w-32 border-b border-primary/50 focus:border-primary"
                        />
                      </div>
                      <div className="text-right space-y-1">
                        <p className="text-xs text-muted-foreground font-medium">
                          IDR Live Conversion
                        </p>
                        <p className="font-mono text-xl font-bold text-primary">
                          Rp {(fxAmount * 15850).toLocaleString('id-ID')}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Trusted By Logo Wall Section */}
      <section
        aria-label="Trusted by companies"
        className="py-7 border-y border-border bg-muted/20"
      >
        <div className="max-w-6xl mx-auto px-6 text-center space-y-4">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
            TRUSTED BY 500+ CLIENT-SERVICE AGENCIES &amp; CONSULTANCIES
          </p>
          <div className="flex items-center justify-center gap-8 md:gap-14 flex-wrap opacity-75 grayscale hover:grayscale-0 transition-all">
            {[
              'Monolith Agency',
              'HyperScale Digital',
              'Nexus Growth',
              'BrandCraft Studio',
              'Vanguard Creative',
              'Pulse Media',
            ].map((logo, i) => (
              <span
                key={i}
                className="text-sm md:text-base font-bold text-foreground font-mono tracking-tight"
              >
                {logo}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Cashflow ROI & Time Savings Calculator */}
      <section
        id="calculator-section"
        aria-labelledby="calculator-heading"
        className="max-w-5xl mx-auto px-6"
      >
        <div className="p-8 md:p-10 rounded-3xl bg-card border border-border shadow-none space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
              <Calculator className="h-3.5 w-3.5" /> Instant Cashflow Calculator
            </div>
            <h2
              id="calculator-heading"
              className="text-2xl md:text-3xl font-bold text-foreground"
            >
              See how much time and money Finly protects each month
            </h2>
          </div>

          <div className="space-y-4 max-w-xl mx-auto">
            <div className="flex justify-between items-center text-sm font-bold text-foreground">
              <label htmlFor={sliderId}>Monthly Agency Revenue:</label>
              <span className="font-mono text-xl text-primary">
                ${monthlyRevenue.toLocaleString()}/mo
              </span>
            </div>
            <input
              id={sliderId}
              type="range"
              min={10000}
              max={200000}
              step={5000}
              value={monthlyRevenue}
              onChange={(e) => setMonthlyRevenue(Number(e.target.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border">
            <div className="p-6 rounded-2xl bg-muted/40 border border-border text-center space-y-1">
              <p className="text-xs text-muted-foreground font-semibold">
                Estimated Monthly Time Reclaimed
              </p>
              <p className="text-3xl font-mono font-extrabold text-foreground">
                {hoursSaved} Hours / mo
              </p>
              <p className="text-[11px] text-muted-foreground">
                Automating invoice drafts, payment tracking, and receipt logging
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-primary/10 border border-primary/20 text-center space-y-1">
              <p className="text-xs text-primary font-semibold">
                Estimated Cashflow Protected
              </p>
              <p className="text-3xl font-mono font-extrabold text-primary">
                ${moneySaved.toLocaleString()} / mo
              </p>
              <p className="text-[11px] text-muted-foreground">
                Preventing payment delays, rounding errors, and unbilled
                expenses
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Asymmetric Bento Grid Features Section */}
      <section
        id="features-section"
        aria-labelledby="features-heading"
        className="max-w-6xl mx-auto px-6 space-y-8"
      >
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2
            id="features-heading"
            className="text-3xl font-bold text-foreground"
          >
            Financial clarity without enterprise bloat
          </h2>
          <p className="text-sm text-muted-foreground">
            Engineered specifically for client-service businesses,
            consultancies, and digital agencies.
          </p>
        </div>

        {/* 3-Cell Asymmetric Bento Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-7 rounded-3xl bg-card border border-border shadow-none space-y-4">
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
              <Zap className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-foreground">
              Zero Floating-Point Drift
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Every cent is stored as an exact integer minor unit
              (`*_in_cents`). Eliminates JavaScript rounding errors, decimal
              drift, and unbalanced ledgers.
            </p>
          </div>

          <div className="p-7 rounded-3xl bg-card border border-border shadow-none space-y-4 md:col-span-2">
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
              <Bot className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-foreground">
              Human-in-the-Loop AI Invoicing
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Drop in client contracts or vendor receipts. Finly parses line
              items, taxes, and customer totals in seconds. Review and approve
              with one click.
            </p>
          </div>
        </div>

        {/* 2-Cell Equal Bento Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-7 rounded-3xl bg-card border border-border shadow-none space-y-4">
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
              <Globe className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-foreground">
              Live Multi-Currency Settlement
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Bill global clients in USD, EUR, or GBP while settling expenses in
              IDR. Real-time central-bank FX rates prevent conversion losses.
            </p>
          </div>

          <div className="p-7 rounded-3xl bg-card border border-border shadow-none space-y-4">
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
              <Lock className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-foreground">
              PostgreSQL Row-Level Security
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Every query executes with strict tenant-scoped session policies.
              Your financial ledgers and client data remain completely isolated
              and private.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        aria-labelledby="testimonials-heading"
        className="max-w-6xl mx-auto px-6 space-y-8"
      >
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2
            id="testimonials-heading"
            className="text-2xl md:text-3xl font-bold text-foreground"
          >
            Proven by founders and finance operators
          </h2>
          <p className="text-xs text-muted-foreground">
            Real agencies saving hours and securing their cashflow every week.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              quote:
                'We were losing hours reconciling multi-currency invoices in spreadsheets. Finly exact integer ledger eliminated calculation errors overnight.',
              author: 'Alexander Wright',
              role: 'Managing Partner @ Monolith Studio',
            },
            {
              quote:
                'The AI receipt parser cuts our monthly close from 3 days to 45 minutes. Our project managers just drop PDF bills in and keep moving.',
              author: 'Elena Rostova',
              role: 'Operations Director @ HyperScale',
            },
            {
              quote:
                'Having our runway forecast directly tied to actual receivables and cash burn gave us the confidence to hire two senior developers.',
              author: 'Julian Thorne',
              role: 'Principal @ BrandCraft Studio',
            },
          ].map((t, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-card border border-border shadow-none space-y-4"
            >
              <div className="flex gap-1 text-amber-500">
                {[...Array(5)].map((_, s) => (
                  <Star key={s} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="text-xs text-foreground font-medium leading-relaxed">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="border-t border-border pt-3">
                <p className="text-xs font-bold text-foreground">{t.author}</p>
                <p className="text-[11px] text-muted-foreground">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="max-w-5xl mx-auto px-6">
        <div className="p-10 md:p-14 rounded-3xl bg-primary text-primary-foreground text-center space-y-6 shadow-none relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight max-w-2xl mx-auto leading-tight">
            Ready to run your agency on exact numbers?
          </h2>
          <p className="text-sm md:text-base text-primary-foreground/85 max-w-xl mx-auto leading-relaxed">
            Set up your workspace in under 2 minutes. Free 14-day trial with
            full access to automated invoice parsing and real-time cashflow
            analytics.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-2">
            <Link
              to="/pricing"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-background text-foreground hover:bg-background/90 font-bold text-sm shadow-none transition-all outline-none cursor-pointer active:scale-[0.98]"
            >
              Start Free 14-Day Trial
            </Link>
            <Link
              to="/dashboard"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white/15 text-white hover:bg-white/20 border border-white/20 font-bold text-sm shadow-none transition-all outline-none cursor-pointer active:scale-[0.98]"
            >
              Explore Live Demo
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
