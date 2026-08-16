import { ShieldCheck, ArrowUpRight } from 'lucide-react'
import { motion } from 'motion/react'

export interface CashHealthRunwayCardProps {
  runwayMonths?: number
  runwayDeltaMonths?: number
  healthScore?: number
  avgMonthlyBurnInCents?: number
  liquidCashInCents?: number
  className?: string
}

export function CashHealthRunwayCard({
  runwayMonths = 14.2,
  runwayDeltaMonths = 1.5,
  healthScore = 94,
  avgMonthlyBurnInCents = 1_245_000,
  liquidCashInCents = 14_825_000,
  className = '',
}: CashHealthRunwayCardProps) {
  // Format minor units safely with zero floating-point arithmetic drift
  const formatMoney = (cents: number): string => {
    const isNegative = cents < 0
    const abs = Math.abs(cents)
    const dollars = Math.floor(abs / 100)
    const remainder = abs % 100
    const formattedDollars = dollars.toLocaleString('en-US')
    const formattedCents = remainder.toString().padStart(2, '0')
    return `${isNegative ? '-' : ''}$${formattedDollars}.${formattedCents}`
  }

  // Progress percentage mapped to a 20-month scale (14.2 months = 71%)
  const progressPercent = Math.min(100, Math.max(0, Math.round((runwayMonths / 20) * 100)))

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'tween', ease: [0.2, 0, 0, 1], duration: 0.5, delay: 0.24 }}
      className={`group relative flex flex-col justify-between overflow-hidden rounded-xl bg-black border border-white/10 p-5 shadow-none hover:border-white/20 transition-all cursor-pointer active:scale-[0.98] ${className}`}
    >
      {/* 1. Header: Left Icon + Label, Right Status Pill */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <span className="text-xs uppercase tracking-wider text-neutral-400 font-medium">
            Cash Health & Runway
          </span>
        </div>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Healthy ({healthScore}/100)
        </span>
      </div>

      {/* 2. Main Metric: Value + Micro Delta */}
      <div className="my-4">
        <div className="flex items-baseline gap-2.5 flex-wrap">
          <h3 className="font-mono text-3xl font-bold text-white tracking-tight">
            {runwayMonths.toFixed(1)} Months
          </h3>
          <span className="text-xs font-medium text-neutral-400 flex items-center gap-0.5">
            <ArrowUpRight className="h-3.5 w-3.5 text-emerald-400 inline" />
            <span className="text-emerald-400 font-semibold">+{runwayDeltaMonths.toFixed(1)} mo</span> vs last month
          </span>
        </div>
      </div>

      {/* 3. Visual Safety Gauge: Emerald-to-Indigo Gradient + Fortress Zone Label */}
      <div className="space-y-1.5 my-1">
        <div className="h-2 w-full rounded-full bg-neutral-900 overflow-hidden border border-white/5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-indigo-500 transition-all duration-700 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[11px] text-neutral-400 font-medium">
          <span className="flex items-center gap-1">
            <span className="inline-block h-1 w-1 rounded-full bg-emerald-400" />
            Fortress Zone (&gt;6 Mo Runway)
          </span>
          <span className="font-mono text-neutral-500">{progressPercent}% of target</span>
        </div>
      </div>

      {/* 4. Footer Breakdown: 2-Column Micro Grid */}
      <div className="mt-3 pt-3 border-t border-white/10 grid grid-cols-2 gap-3 text-xs">
        <div className="space-y-0.5">
          <p className="text-[11px] text-neutral-400 font-medium">Avg Monthly Burn</p>
          <p className="font-mono font-bold text-neutral-200">
            {formatMoney(avgMonthlyBurnInCents)}
          </p>
        </div>
        <div className="space-y-0.5 text-right">
          <p className="text-[11px] text-neutral-400 font-medium">Liquid Cash</p>
          <p className="font-mono font-bold text-emerald-400">
            {formatMoney(liquidCashInCents)}
          </p>
        </div>
      </div>
    </motion.div>
  )
}
