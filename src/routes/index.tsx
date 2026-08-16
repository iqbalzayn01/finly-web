import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState, useId } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  Sparkles,
  ArrowRight,
  Zap,
  Globe,
  TrendingUp,
  Calculator,
  Bot,
  Play,
  Star,
  Lock,
} from 'lucide-react'
import { cn } from '../lib/utils'
import { Button } from '../components/ui/button'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

function LandingPage() {
  const navigate = useNavigate()
  const [monthlyRevenue, setMonthlyRevenue] = useState<number>(45000)
  const [activeTab, setActiveTab] = useState<'overview' | 'ai' | 'fx'>('overview')
  const [fxAmount, setFxAmount] = useState<number>(1000)
  const sliderId = useId()

  const m3Transition = {
    type: 'tween' as const,
    ease: [0.2, 0, 0, 1] as [number, number, number, number],
    duration: 0.4,
  }

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
        className="relative pt-6 md:pt-10 pb-8 text-center max-w-5xl mx-auto space-y-6"
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
          <span>INTRODUCING FINLY V2.2 • NEXT-GEN CASHFLOW OS</span>
        </motion.div>

        {/* Main H1 Headline */}
        <motion.h1
          id="hero-heading"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...m3Transition, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.08] max-w-4xl mx-auto"
        >
          Master your agency cashflow with intelligent automation.
        </motion.h1>

        {/* Hero Subtext (Max 20 words for strict conversion impact) */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...m3Transition, delay: 0.2 }}
          className="text-base sm:text-xl text-muted-foreground max-w-[55ch] mx-auto leading-relaxed font-medium"
        >
          Eliminate ledger errors, parse invoices in seconds, and track real-time multi-currency cashflow effortlessly.
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
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm shadow-none hover:shadow-none transition-all flex items-center justify-center gap-2 outline-none cursor-pointer"
          >
            Start 14-Day Free Trial
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/dashboard"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-card border border-border hover:bg-accent/60 text-foreground font-bold text-sm transition-all flex items-center justify-center gap-2 outline-none cursor-pointer shadow-none"
          >
            <Play className="h-4 w-4 fill-current text-primary" />
            Launch Live App
          </Link>
        </motion.div>

        {/* Product Interactive Demo Showcase Window */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...m3Transition, delay: 0.4 }}
          className="pt-8 max-w-5xl mx-auto"
        >
          <div className="rounded-3xl border border-border bg-card shadow-none overflow-hidden text-left">
            {/* Mac Browser Window Header */}
            <div className="px-5 py-3.5 border-b border-border bg-muted/40 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                <span className="ml-2 text-xs font-mono font-medium text-muted-foreground">app.finly.io/dashboard</span>
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
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {tab === 'overview' ? 'Cashflow' : tab === 'ai' ? 'AI Parse' : 'Live FX'}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Preview Content */}
            <div className="p-6 md:p-8 bg-card min-h-[320px] flex flex-col justify-between">
              <AnimatePresence mode="wait">
                {activeTab === 'overview' && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={m3Transition}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="p-4 rounded-2xl bg-muted/40 border border-border">
                        <p className="text-xs text-muted-foreground font-medium">Monthly Revenue</p>
                        <p className="text-2xl font-mono font-bold text-foreground mt-1">$45,200.00</p>
                        <span className="text-[11px] font-bold text-emerald-500 flex items-center gap-1 mt-1">
                          +18.4% vs last month
                        </span>
                      </div>
                      <div className="p-4 rounded-2xl bg-muted/40 border border-border">
                        <p className="text-xs text-muted-foreground font-medium">Expenses</p>
                        <p className="text-2xl font-mono font-bold text-foreground mt-1">$14,800.00</p>
                        <span className="text-[11px] font-bold text-black/40 dark:text-white/40 flex items-center gap-1 mt-1">
                          -4.2% budget optimized
                        </span>
                      </div>
                      <div className="p-4 rounded-2xl bg-muted/40 border border-border">
                        <p className="text-xs text-muted-foreground font-medium">Net Runway</p>
                        <p className="text-2xl font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-1">+$30,400.00</p>
                        <span className="text-[11px] font-bold text-primary flex items-center gap-1 mt-1">
                          18.2 Months Safe
                        </span>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-muted/20 border border-border flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                          <TrendingUp className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground">Integer Minor-Unit Accuracy</p>
                          <p className="text-xs text-muted-foreground">Stored as minor units (Scale 100) preventing floating point ledger errors.</p>
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
                        <h4 className="text-sm font-bold text-foreground">AI Human-in-the-Loop Invoice Parser</h4>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                          "Parsed PDF invoice #INV-2026-88. Customer: Acme Corp. Subtotal: $5,000.00. Tax: $550.00 (11%). Ready for 1-click confirmation."
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <Button variant="outline" size="sm">Edit Items</Button>
                      <Button size="sm" onClick={() => navigate({ to: '/invoices' })}>Approve & Draft</Button>
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
                        <p className="text-xs text-muted-foreground font-medium">Input USD Amount</p>
                        <input
                          type="number"
                          value={fxAmount}
                          onChange={(e) => setFxAmount(Number(e.target.value))}
                          className="font-mono text-xl font-bold bg-transparent text-foreground outline-none w-32 border-b border-primary/50 focus:border-primary"
                        />
                      </div>
                      <div className="text-right space-y-1">
                        <p className="text-xs text-muted-foreground font-medium">IDR Live Conversion</p>
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
      <section aria-label="Trusted by companies" className="py-6 border-y border-border bg-muted/20">
        <div className="max-w-6xl mx-auto px-6 text-center space-y-4">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
            Trusted by 500+ Modern B2B Agencies & Consultants Worldwide
          </p>
          <div className="flex items-center justify-center gap-8 md:gap-16 flex-wrap opacity-70 grayscale hover:grayscale-0 transition-all">
            {['Acme Corp', 'GlobalTech', 'Stark Industries', 'Wayne Ent', 'Vercel Partner', 'Supabase Agency'].map((logo, i) => (
              <span key={i} className="text-sm font-bold text-foreground font-mono tracking-tight">
                {logo}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Cashflow ROI & Time Savings Calculator */}
      <section id="calculator-section" aria-labelledby="calculator-heading" className="max-w-5xl mx-auto px-6">
        <div className="p-8 md:p-10 rounded-3xl bg-card border border-border shadow-none space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
              <Calculator className="h-3.5 w-3.5" /> Interactive ROI Calculator
            </div>
            <h2 id="calculator-heading" className="text-2xl md:text-3xl font-bold text-foreground">
              Calculate how much time & money Finly saves your agency
            </h2>
          </div>

          <div className="space-y-4 max-w-xl mx-auto">
            <div className="flex justify-between items-center text-sm font-bold text-foreground">
              <label htmlFor={sliderId}>Monthly Agency Revenue:</label>
              <span className="font-mono text-xl text-primary">${monthlyRevenue.toLocaleString()}/mo</span>
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
              <p className="text-xs text-muted-foreground font-semibold">Estimated Monthly Time Saved</p>
              <p className="text-3xl font-mono font-extrabold text-foreground">{hoursSaved} Hours / mo</p>
              <p className="text-[11px] text-muted-foreground">Automated invoice creation & receipt tracking</p>
            </div>
            <div className="p-6 rounded-2xl bg-primary/10 border border-primary/20 text-center space-y-1">
              <p className="text-xs text-primary font-semibold">Estimated Cashflow Recovered</p>
              <p className="text-3xl font-mono font-extrabold text-primary">${moneySaved.toLocaleString()} / mo</p>
              <p className="text-[11px] text-muted-foreground">From faster invoice payments & automated follow-ups</p>
            </div>
          </div>
        </div>
      </section>

      {/* Asymmetric Bento Grid Features Section */}
      <section id="features-section" aria-labelledby="features-heading" className="max-w-6xl mx-auto px-6 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 id="features-heading" className="text-3xl font-bold text-foreground">
            Everything your agency needs to scale profitably
          </h2>
          <p className="text-sm text-muted-foreground">
            Purpose-built for consultancy firms, freelancers, micro-SMEs, and modern B2B teams.
          </p>
        </div>

        {/* 3-Cell Asymmetric Bento Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-7 rounded-3xl bg-card border border-border shadow-none space-y-4">
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
              <Zap className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Integer Minor-Unit Money Engine</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              All money values stored as integer minor units (`*_in_cents`). Eliminates floating-point calculation errors completely.
            </p>
          </div>

          <div className="p-7 rounded-3xl bg-card border border-border shadow-none space-y-4 md:col-span-2">
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
              <Bot className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-foreground">AI Invoice & Receipt Parser</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Human-in-the-Loop workflow allows you to scan receipts, parse line items automatically, and confirm before writing to ledger.
            </p>
          </div>
        </div>

        {/* 2-Cell Equal Bento Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-7 rounded-3xl bg-card border border-border shadow-none space-y-4">
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
              <Globe className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Live FX Multi-Currency Engine</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Convert between USD, IDR, EUR, GBP, and 150+ currencies seamlessly using hourly central bank FX rates.
            </p>
          </div>

          <div className="p-7 rounded-3xl bg-card border border-border shadow-none space-y-4">
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
              <Lock className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-foreground">PostgreSQL Row-Level Security (RLS)</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Multi-tenant architecture enforces strict data isolation per tenant using `set_config` transaction mode.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section aria-labelledby="testimonials-heading" className="max-w-6xl mx-auto px-6 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 id="testimonials-heading" className="text-2xl md:text-3xl font-bold text-foreground">
            Loved by founders & financial operators
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              quote: 'Finly solved our multi-currency invoice calculation issues instantly. The integer ledger precision is bulletproof.',
              author: 'Alexander Wright',
              role: 'Founder @ Acme Studio',
            },
            {
              quote: 'The AI receipt parser saves our finance team over 20 hours every month. Can not imagine running our agency without it.',
              author: 'Sophia Chen',
              role: 'Managing Partner @ GlobalTech',
            },
            {
              quote: 'Self-hosting with PostgreSQL RLS gives us full control over client data while enjoying a sleek modern UI.',
              author: 'David Miller',
              role: 'CTO @ Stark Media',
            },
          ].map((t, i) => (
            <div key={i} className="p-6 rounded-2xl bg-card border border-border shadow-none space-y-4">
              <div className="flex gap-1 text-amber-500">
                {[...Array(5)].map((_, s) => (
                  <Star key={s} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="text-xs text-foreground font-medium leading-relaxed">"{t.quote}"</p>
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
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Ready to streamline your agency cashflow?
          </h2>
          <p className="text-sm md:text-base text-primary-foreground/80 max-w-xl mx-auto leading-relaxed">
            Get started in under 2 minutes. Free 14-day trial with full access to AI parsing and Live FX engine.
          </p>
          <div className="flex justify-center gap-4 pt-2">
            <Link
              to="/pricing"
              className="px-8 py-3.5 rounded-xl bg-background text-foreground hover:bg-background/90 font-bold text-sm shadow-none transition-all outline-none cursor-pointer"
            >
              Start Free 14-Day Trial
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
