import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Check, Sparkles, Zap, Shield, HelpCircle, ChevronDown, ArrowRight } from 'lucide-react'
import { cn } from '../lib/utils'
import { useSubscription } from '../lib/subscription'
import { AlertModal } from '../components/ui/alert-modal'

export const Route = createFileRoute('/pricing')({
  component: PricingPage,
})

function PricingPage() {
  const { plan: currentPlan, isPro, upgradeToPro, downgradeToStarter } = useSubscription()
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual')
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [enterpriseModalOpen, setEnterpriseModalOpen] = useState(false)
  const navigate = useNavigate()

  const m3Transition = {
    type: 'tween' as const,
    ease: [0.2, 0, 0, 1] as [number, number, number, number],
    duration: 0.4,
  }

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      description: 'Essential cashbook and manual invoicing for freelancers & micro-SMEs.',
      monthlyPrice: 0,
      annualPrice: 0,
      popular: false,
      buttonText: 'Current Plan',
      buttonVariant: 'outline' as const,
      features: [
        'Up to 20 invoices / month',
        'Single-tenant Cashbook',
        'Manual FX Conversion',
        'Standard PDF Export',
        'Email Support',
      ],
    },
    {
      id: 'pro',
      name: 'Pro',
      description: 'Supercharge agency cashflow with AI assistant, live FX, and smart parsing.',
      monthlyPrice: 29,
      annualPrice: 23,
      popular: true,
      buttonText: 'Start 14-Day Free Trial',
      buttonVariant: 'primary' as const,
      features: [
        'Unlimited Invoices & Receipts',
        'Unlimited AI Invoice Parsing & Drafts',
        'Live Multi-Currency FX Engine (150+ FX)',
        'Real-time Cashflow Forecasting',
        'Custom PDF & Email Branding',
        'Role Governance (Owner, Admin, Editor)',
        'Priority 24/7 Support',
      ],
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'Dedicated infrastructure, audit logs, and custom integrations for scaling teams.',
      monthlyPrice: 79,
      annualPrice: 63,
      popular: false,
      buttonText: 'Contact Sales',
      buttonVariant: 'outline' as const,
      features: [
        'Everything in Pro',
        'Strict RLS Isolation & Audit Logs',
        'Multi-Business Account Management',
        'Custom Webhooks & REST API Access',
        'Dedicated Account Manager',
        '99.9% Uptime SLA',
      ],
    },
  ]

  const faqs = [
    {
      question: 'Can I upgrade or downgrade my plan at any time?',
      answer: 'Yes! You can upgrade, downgrade, or cancel your subscription at any time directly from your Account Settings. Changes take effect at the start of your next billing cycle.',
    },
    {
      question: 'How does the Live Multi-Currency FX Engine work?',
      answer: 'Finly automatically fetches live central bank exchange rates (USD, IDR, EUR, GBP, SGD, etc.) every hour. All ledger calculations are accurately computed using integer minor units.',
    },
    {
      question: 'Is my financial data secure and private?',
      answer: 'Absolutely. Finly enforces PostgreSQL Row-Level Security (RLS) and strict tenant-scoped repositories. Your invoice data is never used to train public AI models.',
    },
    {
      question: 'What happens when my 14-day free trial ends?',
      answer: 'You can test all Pro features for 14 days without entering a credit card. At the end of the trial, you can choose to subscribe to Pro or continue on the free Starter plan.',
    },
  ]

  return (
    <div className="space-y-12 pb-16">
      {/* Header Section */}
      <div className="text-center max-w-3xl mx-auto space-y-4 pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
          <Sparkles className="h-3.5 w-3.5" /> Simple, Transparent Pricing
        </div>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">
          Predictable plans for growing agencies & teams
        </h1>
        <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
          Scale your cashflow management with zero hidden fees. Switch between monthly and annual billing at any time.
        </p>

        {/* Billing Switcher */}
        <div className="pt-4 flex items-center justify-center gap-3">
          <span className={cn('text-xs font-semibold transition-colors', billingCycle === 'monthly' ? 'text-foreground' : 'text-muted-foreground')}>
            Monthly Billing
          </span>
          <button
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
            className="relative h-7 w-13 rounded-full bg-muted p-1 border border-border transition-colors outline-none cursor-pointer"
          >
            <motion.div
              animate={{ x: billingCycle === 'annual' ? 24 : 0 }}
              transition={m3Transition}
              className="h-5 w-5 rounded-full bg-primary shadow-none"
            />
          </button>
          <div className="flex items-center gap-1.5">
            <span className={cn('text-xs font-semibold transition-colors', billingCycle === 'annual' ? 'text-foreground' : 'text-muted-foreground')}>
              Annual Billing
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
              Save 20%
            </span>
          </div>
        </div>
      </div>

      {/* Pricing Grid */}
      <div className="grid gap-8 lg:grid-cols-3 max-w-6xl mx-auto items-stretch">
        {plans.map((plan) => {
          const price = billingCycle === 'annual' ? plan.annualPrice : plan.monthlyPrice
          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={m3Transition}
              className={cn(
                'relative flex flex-col justify-between p-7 rounded-3xl bg-card border transition-all duration-300',
                plan.popular
                  ? 'border-primary ring-2 ring-primary/20 shadow-none lg:-translate-y-2'
                  : 'border-border shadow-none hover:border-border/80'
              )}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-[11px] font-bold shadow-none tracking-wider uppercase flex items-center gap-1">
                  <Zap className="h-3 w-3 fill-current" /> Most Popular
                </div>
              )}

              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
                </div>
                <p className="text-xs text-muted-foreground mt-2 min-h-[36px] leading-relaxed">
                  {plan.description}
                </p>

                <div className="my-6 pt-4 border-t border-border flex items-baseline gap-1">
                  <span className="font-mono text-4xl font-extrabold text-foreground">
                    ${price}
                  </span>
                  <span className="text-xs text-muted-foreground font-medium">
                    / month {billingCycle === 'annual' && plan.monthlyPrice > 0 ? '(billed annually)' : ''}
                  </span>
                </div>

                {/* Features List */}
                <div className="space-y-3 mb-8">
                  <p className="text-xs font-bold text-foreground uppercase tracking-wider">Included Features:</p>
                  <ul className="space-y-2.5">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2.5 text-xs text-foreground font-medium">
                        <div className={cn(
                          'flex h-4 w-4 shrink-0 items-center justify-center rounded-full',
                          plan.popular ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'
                        )}>
                          <Check className="h-2.5 w-2.5 stroke-[3]" />
                        </div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Plan Action Button */}
              {plan.id === currentPlan ? (
                <button
                  disabled
                  className="w-full py-3 rounded-xl text-xs font-bold transition-all shadow-none outline-none flex items-center justify-center gap-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 cursor-default"
                >
                  <Check className="h-3.5 w-3.5" /> Current Plan
                </button>
              ) : (
                <button
                  onClick={() => {
                    setSelectedPlan(plan.name)
                    if (plan.id === 'pro') {
                      upgradeToPro()
                      setTimeout(() => {
                        navigate({ to: '/dashboard' })
                      }, 400)
                    } else if (plan.id === 'starter') {
                      downgradeToStarter()
                    } else {
                      setEnterpriseModalOpen(true)
                    }
                  }}
                  className={cn(
                    'w-full py-3 rounded-xl text-xs font-bold transition-all shadow-none outline-none cursor-pointer flex items-center justify-center gap-2 active:scale-[0.98]',
                    plan.id === 'pro'
                      ? 'bg-primary text-primary-foreground hover:opacity-95 shadow-none'
                      : 'bg-muted/60 hover:bg-accent text-foreground border border-border'
                  )}
                >
                  {plan.id === 'pro' ? 'Upgrade to Pro' : plan.buttonText}
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Selected Plan Banner / Toast */}
      {selectedPlan && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto p-4 rounded-2xl bg-card border border-primary/30 shadow-none text-center space-y-2"
        >
          <p className="text-xs font-bold text-foreground">
            Selected <span className="text-primary">{selectedPlan} Plan</span> ({billingCycle})
          </p>
          <p className="text-[11px] text-muted-foreground">
            Thank you for choosing Finly Pro! Redirecting to setup...
          </p>
        </motion.div>
      )}

      {/* Security Trust Banner */}
      <div className="max-w-4xl mx-auto p-6 rounded-2xl bg-muted/40 border border-border flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-card border border-border shadow-none text-primary">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-foreground">Enterprise-Grade Bank Security</h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Strict PostgreSQL RLS tenant isolation, encrypted Redis session tokens, and automated nightly backups.
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate({ to: '/settings' })}
          className="shrink-0 px-4 py-2 text-xs font-semibold rounded-xl bg-card border border-border hover:bg-accent text-foreground transition-all cursor-pointer"
        >
          Learn More
        </button>
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto space-y-6 pt-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Frequently Asked Questions</h2>
          <p className="text-xs text-muted-foreground">Everything you need to know about Finly plans and billing.</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index
            return (
              <div
                key={index}
                className="rounded-2xl bg-card border border-border overflow-hidden shadow-none transition-colors"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between p-4 text-left font-semibold text-sm text-foreground outline-none cursor-pointer"
                >
                  <span className="flex items-center gap-2.5">
                    <HelpCircle className="h-4 w-4 text-muted-foreground shrink-0" />
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={cn('h-4 w-4 text-muted-foreground transition-transform duration-300 shrink-0', isOpen && 'rotate-180')}
                  />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="px-4 pb-4 text-xs text-muted-foreground leading-relaxed border-t border-border/50 pt-3"
                    >
                      {faq.answer}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>

      <AlertModal
        open={enterpriseModalOpen}
        onOpenChange={setEnterpriseModalOpen}
        type="info"
        title="Enterprise Plan Inquiry"
        description="Our enterprise concierge team will contact you within 24 hours with custom volume pricing, dedicated VPC deployment, and SLA support."
        confirmText="Got it"
      />
    </div>
  )
}
