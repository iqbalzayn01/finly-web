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
    <div className="bento-card col-span-12 flex flex-col justify-between border border-border bg-card p-6 lg:col-span-4 dark:border-zinc-800">
      {/* Header Row */}
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          {terminology.unpaidBills}
        </span>
        <Link
          to="/invoices"
          aria-label="Open Invoices workspace"
          className="inline-flex size-8 items-center justify-center rounded-xl border border-border bg-white text-foreground transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring dark:border-zinc-700 dark:bg-muted"
        >
          <ArrowUpRight className="size-4" />
        </Link>
      </div>

      {/* Primary Pending Figure */}
      <div className="my-5 space-y-4">
        <div>
          <div className="flex items-center gap-1.5 font-mono text-xs font-semibold text-muted-foreground">
            <Clock className="size-3.5 text-info" />
            <span>
              {summary.waitingCount}{' '}
              {summary.waitingCount === 1
                ? 'Invoice Pending'
                : 'Invoices Pending'}
            </span>
          </div>
          <MoneyValue
            amount={summary.waitingAmount}
            className="mt-1.5 font-mono text-3xl font-black tracking-tighter text-foreground tabular-nums sm:text-4xl"
          />
        </div>

        {/* Overdue & Collected Breakdown Pills */}
        <div className="space-y-2">
          <div
            className={cn(
              'flex items-center justify-between gap-2 rounded-2xl border px-3.5 py-2.5 text-xs',
              hasOverdue
                ? 'border-outflow-border bg-outflow-bg'
                : 'border-border/80 bg-white/80 dark:border-zinc-700/60 dark:bg-muted/80',
            )}
          >
            <span className="inline-flex items-center gap-2 font-mono font-semibold text-foreground">
              <TriangleAlert
                className={cn(
                  'size-3.5 shrink-0',
                  hasOverdue ? 'text-outflow' : 'text-muted-foreground',
                )}
              />
              <span>
                Overdue{' '}
                {hasOverdue ? `(${summary.overdueCount})` : '(All clear)'}
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

          <div className="flex items-center justify-between gap-2 rounded-2xl border border-inflow-border bg-inflow-bg px-3.5 py-2.5 text-xs">
            <span className="inline-flex items-center gap-2 font-mono font-semibold text-foreground">
              <CheckCircle2 className="size-3.5 shrink-0 text-inflow" />
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
        className="min-h-10 w-full justify-between rounded-xl border-border bg-white font-mono text-xs font-bold text-foreground transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground dark:border-zinc-700 dark:bg-muted dark:hover:border-primary dark:hover:bg-primary dark:hover:text-primary-foreground"
      >
        <Link to="/invoices">
          <span>View Invoices</span>
          <ArrowUpRight className="size-4" />
        </Link>
      </Button>
    </div>
  );
}
