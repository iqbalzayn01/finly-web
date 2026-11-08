import { Link } from '@tanstack/react-router';
import { ArrowUpRight, CheckCircle2, Clock, TriangleAlert } from 'lucide-react';
import { useMemo } from 'react';
import { MoneyValue } from '#/components/money-value';
import { Button } from '#/components/ui/button';
import { useFinly } from '#/context/finly-context';
import { calculateInvoiceSummary } from '#/lib/cashflow';
import { cn } from '#/lib/utils';

/**
 * Tile 5: Unpaid Receivables & Invoices Quick Insight Tile (PRD v2.1.0 §3.1)
 * Spans 4 columns on desktop right next to the Cashflow Dynamics chart.
 */
export function ReceivablesBentoTile() {
  const { invoices, todayISO, terminology } = useFinly();

  const summary = useMemo(
    () => calculateInvoiceSummary(invoices, todayISO),
    [invoices, todayISO],
  );

  const hasOverdue = summary.overdueCount > 0;

  return (
    <div className="bento-card col-span-12 flex h-full flex-col justify-between gap-5 bg-card p-6 lg:col-span-4">
      {/* Header Row aligned with Chart Header */}
      <div className="flex items-center justify-between gap-2 border-b-2 border-border pb-4">
        <div className="space-y-0.5">
          <h2 className="font-mono text-xs font-extrabold uppercase tracking-wider text-foreground sm:text-sm">
            {terminology.unpaidBills}
          </h2>
          <p className="font-mono text-xs text-muted-foreground">
            Money clients owe you
          </p>
        </div>
      </div>

      {/* Primary Pending Figure */}
      <div className="space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 font-mono text-xs font-semibold text-muted-foreground">
            <Clock className="size-3.5 text-info" />
            <span>
              {summary.waitingCount}{' '}
              {summary.waitingCount === 1
                ? 'unpaid invoice'
                : 'unpaid invoices'}
            </span>
          </div>
          <MoneyValue
            amount={summary.waitingAmount}
            className="block font-mono text-3xl font-black tracking-tight text-foreground tabular-nums sm:text-4xl"
          />
        </div>

        {/* Overdue & Collected Breakdown Boxes */}
        <div className="space-y-2.5">
          <div
            className={cn(
              'flex items-center justify-between gap-2 rounded-xl border-2 px-3.5 py-3 text-xs',
              hasOverdue
                ? 'border-outflow-border bg-outflow-bg'
                : 'border-border bg-muted/40',
            )}
          >
            <span className="inline-flex items-center gap-2 font-mono font-bold text-foreground">
              <TriangleAlert
                className={cn(
                  'size-4 shrink-0',
                  hasOverdue ? 'text-outflow' : 'text-muted-foreground',
                )}
              />
              <span>
                Overdue {hasOverdue ? `(${summary.overdueCount})` : '(None)'}
              </span>
            </span>
            <MoneyValue
              amount={summary.overdueAmount}
              className={cn(
                'font-mono font-extrabold tabular-nums',
                hasOverdue ? 'text-outflow' : 'text-muted-foreground',
              )}
            />
          </div>

          <div className="flex items-center justify-between gap-2 rounded-xl border-2 border-inflow-border bg-inflow-bg px-3.5 py-3 text-xs">
            <span className="inline-flex items-center gap-2 font-mono font-bold text-foreground">
              <CheckCircle2 className="size-4 shrink-0 text-inflow" />
              <span>Paid This Month</span>
            </span>
            <MoneyValue
              amount={summary.collectedThisMonthAmount}
              className="font-mono font-extrabold text-inflow tabular-nums"
            />
          </div>
        </div>
      </div>

      {/* Action Link Button */}
      <Button
        asChild
        variant="outline"
        className="group h-10 w-full justify-between rounded-xl border-[#6366F1]/30 bg-[#6366F1]/10 font-mono text-xs font-extrabold uppercase tracking-wider text-[#6366F1] hover:border-[#6366F1] hover:bg-[#6366F1]/25 hover:text-[#818CF8]"
      >
        <Link to="/invoices">
          <span>Manage Invoices</span>
          <ArrowUpRight className="size-4 text-[#6366F1] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#818CF8]" />
        </Link>
      </Button>
    </div>
  );
}
