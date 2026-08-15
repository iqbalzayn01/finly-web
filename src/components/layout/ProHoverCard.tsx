import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Link } from '@tanstack/react-router'
import { Sparkles, CheckCircle2 } from 'lucide-react'

export function ProHoverCard() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="relative flex items-center justify-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button className="relative flex h-11 w-11 items-center justify-center font-semibold transition-all rounded-full bg-muted/60 hover:bg-accent border border-border text-foreground shadow-xs outline-none cursor-pointer">
        <Sparkles className="h-5 w-5 text-primary" />
      </button>
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, x: -10, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -6, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 450, damping: 28 }}
            className="absolute left-full ml-3 w-64 p-4 rounded-2xl bg-card border border-border text-foreground shadow-2xl z-50 pointer-events-auto"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-foreground">Finly Pro</span>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-primary/10 text-primary border border-primary/20">
                PRO
              </span>
            </div>
            <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
              Supercharge your agency cashflow with advanced features.
            </p>
            <ul className="space-y-2 text-xs text-foreground font-medium mb-4">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" /> Unlimited AI Parse & Drafts
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" /> Live FX Multi-Currency Engine
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" /> Multi-Tenant Role Governance
              </li>
            </ul>
            <Link
              to="/pricing"
              className="w-full py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center"
            >
              Upgrade Now • $29/mo
            </Link>
            <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rotate-45 bg-card border-l border-b border-border" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
