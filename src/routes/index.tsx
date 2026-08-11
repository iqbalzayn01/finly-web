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
} from 'lucide-react'
import { useState } from 'react'
import { motion } from 'motion/react'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../components/ui/select'
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from 'recharts'

export const Route = createFileRoute('/')({ component: Dashboard })

const cashflowData = [
  { name: 'Jan', income: 12400, expense: 8200 },
  { name: 'Feb', income: 15600, expense: 9400 },
  { name: 'Mar', income: 14200, expense: 11000 },
  { name: 'Apr', income: 21800, expense: 13500 },
  { name: 'May', income: 18900, expense: 12100 },
  { name: 'Jun', income: 24500, expense: 10800 },
  { name: 'Jul', income: 28400, expense: 14200 },
]

const financeScoreRadialData = [
  { name: 'Income Growth', value: 85, fill: 'var(--primary)' },
  { name: 'Savings Rate', value: 72, fill: '#10b981' },
  { name: 'Budget Control', value: 90, fill: '#f59e0b' },
  { name: 'Cash Runway', value: 94, fill: '#6366f1' },
]

function Dashboard() {
  const [recentTxFilter, setRecentTxFilter] = useState<'all' | 'income' | 'expense'>('all')
  const [fxInput, setFxInput] = useState<number>(100)

  const m3Transition = {
    type: 'tween' as const,
    ease: [0.2, 0, 0, 1] as [number, number, number, number],
    duration: 0.5,
  }

  const allRecentTx = [
    {
      name: 'Acme Corp Web Dev',
      category: 'Income / Services',
      date: 'Today, 2:45 PM',
      amount: 5000,
      type: 'income',
      icon: ArrowUpRight,
      color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    },
    {
      name: 'AWS Infrastructure',
      category: 'Software & Hosting',
      date: 'Yesterday, 10:20 AM',
      amount: 120,
      type: 'expense',
      icon: ArrowDownRight,
      color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    },
    {
      name: 'Q3 Retainer GlobalTech',
      category: 'Income / Retainer',
      date: 'Jul 28, 2026',
      amount: 3500,
      type: 'income',
      icon: ArrowUpRight,
      color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    },
    {
      name: 'Facebook Ads Campaign',
      category: 'Marketing & Ads',
      date: 'Jul 26, 2026',
      amount: 450,
      type: 'expense',
      icon: ArrowDownRight,
      color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    },
    {
      name: 'Slack Team Subscription',
      category: 'Software & SaaS',
      date: 'Jul 24, 2026',
      amount: 85,
      type: 'expense',
      icon: ArrowDownRight,
      color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    },
  ]

  const filteredTx = allRecentTx.filter((tx) => {
    if (recentTxFilter === 'all') return true
    return tx.type === recentTxFilter
  })

  return (
    <div className="space-y-6 pb-12">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={m3Transition}
        >
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-4xl md:text-[44px] font-medium tracking-tight text-foreground">
              Analytics & Cashflow
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
              Live OS
            </span>
          </div>
          <p className="text-muted-foreground text-[15px]">
            Real-time business health, operating cashflow, and AI forecast.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...m3Transition, delay: 0.1 }}
          className="flex items-center gap-3"
        >
          <Select defaultValue="this_year">
            <SelectTrigger className="w-[180px] h-11 rounded-xl border border-border bg-card shadow-sm text-foreground font-semibold">
              <SelectValue placeholder="Select Period" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border border-border shadow-lg">
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

      {/* Top Metrics Cards - M3 Tonal Surfaces */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: 'Total Net Balance',
            value: '$148,250.00',
            trend: '+12.5%',
            isUp: true,
            icon: Wallet,
            containerClass:
              'bg-primary text-primary-foreground border border-primary/20 shadow-md rounded-2xl',
            iconClass: 'bg-white/20 text-white rounded-xl',
            trendClass:
              'bg-white/20 text-white rounded-full',
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
              'bg-card text-foreground border border-border shadow-sm rounded-2xl',
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
              'bg-card text-foreground border border-border shadow-sm rounded-2xl',
            iconClass:
              'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 rounded-xl',
            trendClass:
              'bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-full',
            progress: 35,
            progressBg: 'bg-muted',
            progressFill: 'bg-rose-500',
          },
          {
            title: 'Net Cash Runway',
            value: '14.2 Months',
            trend: '+1.5 mo',
            isUp: true,
            icon: ArrowUpRight,
            containerClass:
              'bg-card text-foreground border border-border shadow-sm rounded-2xl',
            iconClass:
              'bg-primary/10 text-primary border border-primary/20 rounded-xl',
            trendClass:
              'bg-primary/10 text-primary rounded-full',
            progress: 74,
            progressBg: 'bg-muted',
            progressFill: 'bg-primary',
          },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -4, scale: 1.01 }}
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
              <div className={`h-1.5 w-full rounded-full ${stat.progressBg} overflow-hidden`}>
                <div
                  className={`h-full rounded-full ${stat.progressFill} transition-all duration-500`}
                  style={{ width: `${stat.progress}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] font-medium opacity-75">
                <span>{stat.progress}% of monthly target</span>
                <span>vs last month</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Chart Area: Dual Bar Chart (Income vs Expense) with Smooth Rounded Bars */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...m3Transition, delay: 0.2 }}
          className="lg:col-span-2 bg-card border border-border shadow-sm rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-8 px-2">
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                Cashflow Dynamics
              </h2>
            </div>
            <div className="flex items-center gap-6 text-sm font-medium">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" /> Income
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-muted-foreground/40" />{' '}
                Expense
              </div>
            </div>
          </div>

          <div className="h-[340px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={cashflowData}
                barCategoryGap="12%"
                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                  vertical={false}
                  stroke="currentColor"
                  className="text-border opacity-50"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: 'var(--muted-foreground)',
                    fontSize: 13,
                    fontWeight: 500,
                  }}
                  dy={10}
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
                <Tooltip
                  wrapperStyle={{ zIndex: 100 }}
                  allowEscapeViewBox={{ x: false, y: false }}
                  content={({ active, payload, label }) => {
                    if (!active || !payload || !payload.length) return null
                    const incomeItem = payload.find((p) => p.dataKey === 'income')
                    const expenseItem = payload.find((p) => p.dataKey === 'expense')
                    const incomeVal = Number(incomeItem?.value || 0)
                    const expenseVal = Number(expenseItem?.value || 0)
                    const netVal = incomeVal - expenseVal

                    return (
                      <div className="rounded-xl border border-border bg-card p-3.5 shadow-xl text-foreground text-xs space-y-1.5 min-w-[180px]">
                        <p className="font-semibold text-muted-foreground border-b border-border pb-1">
                          Month: <span className="text-foreground font-bold">{label}</span>
                        </p>
                        <div className="flex justify-between items-center pt-0.5">
                          <span className="font-semibold text-primary flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-primary" /> Income:
                          </span>
                          <span className="font-mono font-bold">${incomeVal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-muted-foreground flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-muted-foreground" /> Expense:
                          </span>
                          <span className="font-mono font-bold">${expenseVal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center border-t border-border pt-1.5 mt-1 text-[11px]">
                          <span className="font-medium text-muted-foreground">Net Cashflow:</span>
                          <span className={`font-mono font-bold ${netVal >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'}`}>
                            {netVal >= 0 ? '+' : ''}${netVal.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    )
                  }}
                  cursor={{ fill: 'var(--accent)', opacity: 0.15 }}
                />
                <Bar
                  dataKey="expense"
                  name="Expense"
                  stackId="cashflowStack"
                  fill="var(--muted-foreground)"
                  radius={[0, 0, 4, 4]}
                  maxBarSize={72}
                />
                <Bar
                  dataKey="income"
                  name="Income"
                  stackId="cashflowStack"
                  fill="var(--primary)"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={72}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Finance Score Card: Radial Bar Chart (Stacked) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...m3Transition, delay: 0.3 }}
          className="bg-card border border-border shadow-sm rounded-2xl p-6 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Finance Health</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Overall Health Rating</p>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
              94% Excellent
            </span>
          </div>

          <div className="relative h-[220px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="30%"
                outerRadius="95%"
                barSize={10}
                data={financeScoreRadialData}
                startAngle={180}
                endAngle={0}
              >
                <PolarAngleAxis
                  type="number"
                  domain={[0, 100]}
                  angleAxisId={0}
                  tick={false}
                />
                <RadialBar
                  background={{ fill: 'var(--muted)' }}
                  dataKey="value"
                  cornerRadius={10}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid var(--border)',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
                    backgroundColor: 'var(--card)',
                    color: 'var(--foreground)',
                    padding: '10px 14px',
                    fontWeight: 'bold',
                  }}
                  labelFormatter={(label) => `Metric: ${label}`}
                  formatter={(val: any) => [`${val}%`, 'Score']}
                />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center pointer-events-none">
              <span className="font-mono text-3xl font-bold text-foreground">94</span>
              <span className="text-xs text-muted-foreground block font-semibold uppercase tracking-wider">Health Index</span>
            </div>
          </div>

          <div className="mt-2 space-y-2 pt-2 border-t border-border">
            {financeScoreRadialData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.fill }} />
                  <span className="font-medium text-muted-foreground">{item.name}</span>
                </div>
                <span className="font-mono font-bold text-foreground">{item.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* 3-Column Bottom Grid: Financial Statistics | FX Exchange | Recent Transactions with Filter */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Card 1: Financial Statistics & Health */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...m3Transition, delay: 0.4 }}
          className="bg-card border border-border shadow-sm rounded-2xl p-6 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
                  <Activity className="h-4 w-4" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">
                  Financial Statistics
                </h2>
              </div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Score: 94/100
              </span>
            </div>

            <div className="space-y-4">
              <div className="p-3.5 bg-muted/40 rounded-xl border border-border flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Operating Profit Margin</p>
                  <p className="font-mono text-lg font-bold text-foreground mt-0.5">63.4%</p>
                </div>
                <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  <TrendingUp className="h-3 w-3" /> +4.1%
                </span>
              </div>

              <div className="p-3.5 bg-muted/40 rounded-xl border border-border flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Avg. Invoice Settled</p>
                  <p className="font-mono text-lg font-bold text-foreground mt-0.5">$4,250.00</p>
                </div>
                <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  Net 14 Avg
                </span>
              </div>

              <div className="p-3.5 bg-muted/40 rounded-xl border border-border flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">On-Time Payment Rate</p>
                  <p className="font-mono text-lg font-bold text-foreground mt-0.5">96.5%</p>
                </div>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  High Reliability
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border mt-4 flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> Audit Ledger Verified
            </span>
            <span className="font-mono">v5.0 Ledger</span>
          </div>
        </motion.div>

        {/* Card 2: Interactive FX Currency Converter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...m3Transition, delay: 0.45 }}
          className="bg-card border border-border shadow-sm rounded-2xl p-6 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
                  <Globe className="h-4 w-4" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">
                  FX Currency Converter
                </h2>
              </div>
              <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live FX
              </span>
            </div>

            {/* Interactive Amount Converter Input */}
            <div className="relative mb-4">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">$</span>
              <input
                type="number"
                value={fxInput || ''}
                onChange={(e) => setFxInput(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full h-10 bg-background border border-border rounded-xl pl-8 pr-16 text-sm font-bold font-mono outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground"
                placeholder="Enter USD amount..."
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-primary">USD</span>
            </div>

            <div className="space-y-2.5">
              {[
                { pair: 'USD / IDR', label: 'Indonesian Rupiah', rate: `Rp ${(fxInput * 16250).toLocaleString()}` },
                { pair: 'EUR / USD', label: 'Euro', rate: `€ ${(fxInput * 0.915).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
                { pair: 'GBP / USD', label: 'British Pound', rate: `£ ${(fxInput * 0.780).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
                { pair: 'SGD / IDR', label: 'Singapore Dollar', rate: `S$ ${(fxInput * 1.340).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
              ].map((fx, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-accent/40 transition-colors"
                >
                  <div>
                    <span className="text-xs font-semibold text-foreground block">{fx.pair}</span>
                    <span className="text-[10px] text-muted-foreground">{fx.label}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-sm font-bold text-foreground">{fx.rate}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-border mt-4 flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <RefreshCw className="h-3 w-3" /> Auto-updates every 60s
            </span>
            <span className="font-mono text-primary font-semibold">1 USD = 16,250 IDR</span>
          </div>
        </motion.div>

        {/* Card 3: Recent Transactions with Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...m3Transition, delay: 0.5 }}
          className="bg-card border border-border shadow-sm rounded-2xl p-6 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
                  <Receipt className="h-4 w-4" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">
                  Recent Activity
                </h2>
              </div>
              <Link
                to="/cashbook"
                className="text-xs font-semibold text-primary hover:underline"
              >
                View All
              </Link>
            </div>

            {/* Filter Pills Header */}
            <div className="flex items-center gap-1.5 p-1 bg-muted/50 rounded-xl mb-4">
              {(['all', 'income', 'expense'] as const).map((filterType) => (
                <button
                  key={filterType}
                  onClick={() => setRecentTxFilter(filterType)}
                  className={`flex-1 py-1 text-xs font-semibold rounded-lg capitalize transition-all ${
                    recentTxFilter === filterType
                      ? 'bg-card text-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {filterType}
                </button>
              ))}
            </div>

            {/* Filtered Transaction List */}
            <div className="space-y-2">
              {filteredTx.length === 0 ? (
                <p className="py-8 text-center text-xs text-muted-foreground font-medium">
                  No {recentTxFilter} transactions recorded.
                </p>
              ) : (
                filteredTx.map((tx, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-accent/40 transition-colors cursor-pointer group border border-transparent hover:border-border"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${tx.color}`}
                      >
                        <tx.icon className="h-4 w-4" />
                      </div>
                      <div className="overflow-hidden">
                        <h4 className="font-semibold text-xs text-foreground truncate group-hover:text-primary transition-colors">
                          {tx.name}
                        </h4>
                        <p className="text-[11px] text-muted-foreground truncate">{tx.category}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p
                        className={`font-mono text-sm font-semibold ${tx.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-foreground'}`}
                      >
                        {tx.type === 'income' ? '+' : '-'}
                        ${tx.amount.toLocaleString()}
                      </p>
                      <p className="text-[10px] text-muted-foreground">{tx.date.split(',')[0]}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-border mt-4 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Showing {filteredTx.length} of {allRecentTx.length} entries</span>
            <Link to="/cashbook" className="font-semibold text-primary flex items-center gap-1 hover:underline">
              Open Cashbook <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
