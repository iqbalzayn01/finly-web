import { createFileRoute, Link } from '@tanstack/react-router'
import {
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  MoreHorizontal,
} from 'lucide-react'
import { motion } from 'motion/react'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../components/ui/select'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
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

const incomeValues = cashflowData.map((d) => d.income)
const maxIncome = Math.max(...incomeValues)
const minIncome = Math.min(...incomeValues)

const renderIncomeExtrema = (props: any) => {
  const { cx, cy, value } = props
  if (value === maxIncome) {
    return (
      <g>
        <circle
          cx={cx}
          cy={cy}
          r={5}
          fill="var(--background)"
          stroke="var(--primary)"
          strokeWidth={2.5}
        />
        <text
          x={cx}
          y={cy - 12}
          textAnchor="middle"
          fill="var(--primary)"
          fontSize={11}
          fontWeight="bold"
        >
          MAX ${value / 1000}k
        </text>
      </g>
    )
  }
  if (value === minIncome) {
    return (
      <g>
        <circle
          cx={cx}
          cy={cy}
          r={5}
          fill="var(--background)"
          stroke="var(--primary)"
          strokeWidth={2.5}
        />
        <text
          x={cx}
          y={cy + 18}
          textAnchor="middle"
          fill="var(--primary)"
          fontSize={11}
          fontWeight="bold"
        >
          MIN ${value / 1000}k
        </text>
      </g>
    )
  }
  return null
}

const categoryData = [
  { name: 'Software', value: 4500 },
  { name: 'Marketing', value: 3200 },
  { name: 'Office', value: 1800 },
  { name: 'Travel', value: 1300 },
]

function Dashboard() {
  const m3Transition = {
    type: 'tween' as const,
    ease: [0.2, 0, 0, 1] as [number, number, number, number],
    duration: 0.5,
  }

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
            className={`relative overflow-hidden p-6 ${stat.containerClass}`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[14px] font-medium opacity-80 mb-1.5">
                  {stat.title}
                </p>
                <h3 className="font-mono text-2xl lg:text-3xl font-bold tracking-tight">
                  {stat.value}
                </h3>
              </div>
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center ${stat.iconClass}`}
              >
                <stat.icon className="h-5 w-5" />
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-5 space-y-2">
              <div className={`h-1.5 w-full rounded-full ${stat.progressBg} overflow-hidden`}>
                <div
                  className={`h-full rounded-full ${stat.progressFill}`}
                  style={{ width: `${stat.progress}%` }}
                />
              </div>
              <div className="flex items-center justify-between">
                <span
                  className={`flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold ${stat.trendClass}`}
                >
                  {stat.isUp ? (
                    <ArrowUpRight className="h-3 w-3" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3" />
                  )}
                  {stat.trend}
                </span>
                <span className="text-[11px] font-medium opacity-70">
                  Target: 100%
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Chart Area */}
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
                <div className="w-3 h-3 rounded-full bg-muted-foreground/30" />{' '}
                Expense
              </div>
            </div>
          </div>

          <div className="h-[340px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={cashflowData}
                margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--primary)"
                      stopOpacity={0.15}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--primary)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="4 4"
                  vertical={false}
                  stroke="currentColor"
                  className="text-border"
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
                  dy={15}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: 'var(--muted-foreground)',
                    fontSize: 13,
                    fontWeight: 500,
                  }}
                  tickFormatter={(val) => `$${val / 1000}k`}
                  dx={-15}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid var(--border)',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
                    backgroundColor: 'var(--card)',
                    color: 'var(--foreground)',
                    padding: '12px 16px',
                    fontWeight: 'bold',
                  }}
                  itemStyle={{ color: 'var(--foreground)', fontWeight: 700 }}
                  cursor={{
                    stroke: 'var(--muted-foreground)',
                    strokeWidth: 1,
                    strokeDasharray: '4 4',
                  }}
                  formatter={(value: any, name: any) => [
                    `$${Number(value || 0).toLocaleString()}`,
                    String(name || '')
                      .charAt(0)
                      .toUpperCase() + String(name || '').slice(1),
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="income"
                  stroke="var(--primary)"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorIncome)"
                  dot={renderIncomeExtrema}
                  activeDot={{
                    r: 6,
                    fill: 'var(--primary)',
                    stroke: 'var(--background)',
                    strokeWidth: 2,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="expense"
                  stroke="var(--muted-foreground)"
                  strokeWidth={2.5}
                  fill="none"
                  activeDot={{
                    r: 6,
                    fill: 'var(--muted-foreground)',
                    stroke: 'var(--background)',
                    strokeWidth: 2,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Breakdown Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...m3Transition, delay: 0.3 }}
          className="bg-card border border-border shadow-sm rounded-2xl p-6 flex flex-col"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Expenses</h2>
            </div>
            <button className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card hover:bg-accent transition-all">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 min-h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categoryData}
                layout="vertical"
                margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
              >
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" hide />
                <Tooltip
                  cursor={{ fill: 'var(--accent)', opacity: 0.2 }}
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid var(--border)',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
                    backgroundColor: 'var(--card)',
                    color: 'var(--foreground)',
                    padding: '12px',
                    fontWeight: 'bold',
                  }}
                  formatter={(value: any) => [
                    `$${Number(value || 0).toLocaleString()}`,
                    'Amount',
                  ]}
                />
                <Bar dataKey="value" radius={8} barSize={28}>
                  {categoryData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={`var(--chart-${(index % 9) + 1})`}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 space-y-2">
            {categoryData.map((cat, i) => (
              <div
                key={cat.name}
                className="flex items-center justify-between py-2"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="h-3 w-3 rounded-full border border-border"
                    style={{ backgroundColor: `var(--chart-${(i % 9) + 1})` }}
                  />
                  <span className="text-[15px] font-medium text-muted-foreground">
                    {cat.name}
                  </span>
                </div>
                <span className="font-mono text-[15px] font-medium text-foreground">
                  ${cat.value.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Transactions List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...m3Transition, delay: 0.4 }}
        className="bg-card border border-border shadow-sm rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">
            Recent Transactions
          </h2>
          <Link
            to="/cashbook"
            className="flex h-9 items-center justify-center rounded-full border border-border bg-accent text-accent-foreground px-4 text-xs font-semibold hover:bg-accent/80 transition-all"
          >
            View All
          </Link>
        </div>

        <div className="space-y-1">
          {[
            {
              name: 'Acme Corp Web Dev',
              date: 'Today, 2:45 PM',
              amount: 5000,
              type: 'income',
              icon: ArrowUpRight,
              color: 'bg-accent/20 text-accent-foreground',
            },
            {
              name: 'AWS Hosting',
              date: 'Yesterday, 10:20 AM',
              amount: -120,
              type: 'expense',
              icon: ArrowDownRight,
              color: 'bg-muted text-muted-foreground',
            },
            {
              name: 'Q3 Retainer GlobalTech',
              date: 'Jul 28, 2026',
              amount: 3500,
              type: 'income',
              icon: ArrowUpRight,
              color: 'bg-accent/20 text-accent-foreground',
            },
          ].map((tx, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3.5 rounded-xl hover:bg-accent/40 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border border-border ${tx.color}`}
                >
                  <tx.icon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                    {tx.name}
                  </h4>
                  <p className="text-xs text-muted-foreground">{tx.date}</p>
                </div>
              </div>
              <div
                className={`font-mono text-base font-semibold ${tx.type === 'income' ? 'text-foreground' : 'text-muted-foreground'}`}
              >
                {tx.type === 'income' ? '+' : ''}
                {tx.amount.toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  maximumFractionDigits: 0,
                })}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
