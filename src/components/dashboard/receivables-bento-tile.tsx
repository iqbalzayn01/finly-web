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
      <div className="flex items-center justify-between gap-2 border-b border-border pb-4">
        <div className="space-y-0.5">
          <h2 className="text-sm font-bold tracking-tight text-foreground sm:text-base">
            {terminology.unpaidBills}
          </h2>
          <p className="text-xs text-muted-foreground">
            Money clients owe you
          </p>
        </div>
      </div>

      {/* Primary Pending Figure */}
      <div className="space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
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
            className="block text-3xl font-extrabold tracking-tight text-foreground tabular-nums sm:text-4xl"
          />
        </div>

        {/* Overdue & Collected Breakdown Boxes */}
        <div className="space-y-2.5">
          <div
            className={cn(
              'flex items-center justify-between gap-2 rounded-2xl border px-3.5 py-3 text-xs backdrop-blur-md',
              hasOverdue
                ? 'border-outflow-border bg-outflow-bg'
                : 'border-border bg-background/50',
            )}
          >
            <span className="inline-flex items-center gap-2 font-semibold text-foreground">
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
                'font-bold tabular-nums',
                hasOverdue ? 'text-outflow' : 'text-muted-foreground',
              )}
            />
          </div>

          <div className="flex items-center justify-between gap-2 rounded-2xl border border-inflow-border bg-inflow-bg px-3.5 py-3 text-xs backdrop-blur-md">
            <span className="inline-flex items-center gap-2 font-semibold text-foreground">
              <CheckCircle2 className="size-4 shrink-0 text-inflow" />
              <span>Paid This Month</span>
            </span>
            <MoneyValue
              amount={summary.collectedThisMonthAmount}
              className="font-bold text-inflow tabular-nums"
            />
          </div>
        </div>
      </div>

      {/* Action Link Button */}
      <Button
        asChild
        variant="outline"
        className="group h-10 w-full justify-between rounded-full border-[#6366F1]/30 bg-[#6366F1]/10 px-4 text-xs font-bold text-[#6366F1] hover:border-[#6366F1] hover:bg-[#6366F1]/20 hover:text-[#818CF8]"
      >
        <Link to="/invoices">
          <span>Manage Invoices</span>
          <ArrowUpRight className="size-4 text-[#6366F1] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#818CF8]" />
        </Link>
      </Button>
    </div>
  );
}
