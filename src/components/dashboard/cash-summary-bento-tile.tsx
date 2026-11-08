import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { useMemo } from 'react';
import { MoneyValue } from '#/components/money-value';
import { useFinly } from '#/context/finly-context';
import { calculateMonthlySummary } from '#/lib/cashflow';
import { cn } from '#/lib/utils';

/**
 * Tile 3: This Month's Summary Bento Card (PRD v2.1.0 §3.1 & DESIGN.md §6.3)
 * Displays current month's net cashflow, money in, money out,
 * and total recorded transaction entries.
 */
export function CashSummaryBentoTile() {
  const { transactions, todayISO, terminology, selectedWalletId } = useFinly();

  const summary = useMemo(
    () => calculateMonthlySummary(transactions, todayISO, selectedWalletId),
    [selectedWalletId, todayISO, transactions],
  );

  const isSurplus = summary.netFlow >= 0;

  return (
    <div className="bento-card col-span-12 flex h-full flex-col justify-between gap-5 bg-card p-6 text-foreground md:col-span-4">
      {/* 1. Header Row */}
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
          This Month
        </span>
        <span
          className={cn(
            'inline-flex h-6 items-center rounded-lg border-2 px-2.5 font-mono text-[10px] font-bold uppercase tracking-wider',
            isSurplus
              ? 'border-inflow-border bg-inflow-bg text-inflow'
              : 'border-outflow-border bg-outflow-bg text-outflow',
          )}
        >
          {isSurplus ? 'Positive' : 'Over Spent'}
        </span>
      </div>

      {/* 2. Main Net Cashflow Figure */}
      <div className="space-y-1.5">
        <div className="flex items-baseline gap-2">
          <MoneyValue
            amount={Math.abs(summary.netFlow)}
            // signedType={isSurplus ? 'money_in' : 'money_out'}
            className={cn(
              'font-mono text-3xl text-foreground font-black tracking-tight tabular-nums sm:text-4xl',
              // isSurplus ? 'text-inflow' : 'text-outflow',
            )}
          />
        </div>
        <p className="font-mono text-xs text-muted-foreground">
          {isSurplus
            ? 'Saved so far this month'
            : 'Spent more than earned this month'}
        </p>
      </div>

      {/* 3. Side-by-Side Income & Expenses Boxes */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="flex items-center gap-2.5 rounded-xl border-2 border-border bg-background p-2.5">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-inflow-border bg-inflow-bg text-inflow">
            <ArrowUpRight className="size-4" />
          </span>
          <div className="min-w-0">
            <p className="truncate font-mono text-[11px] font-bold text-foreground">
              {terminology.inflow}
            </p>
            <MoneyValue
              amount={summary.moneyIn}
              className="block truncate font-mono text-xs font-extrabold text-inflow tabular-nums sm:text-sm"
            />
          </div>
        </div>

        <div className="flex items-center gap-2.5 rounded-xl border-2 border-border bg-background p-2.5">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-outflow-border bg-outflow-bg text-outflow">
            <ArrowDownRight className="size-4" />
          </span>
          <div className="min-w-0">
            <p className="truncate font-mono text-[11px] font-bold text-foreground">
              {terminology.outflow}
            </p>
            <MoneyValue
              amount={summary.moneyOut}
              className="block truncate font-mono text-xs font-extrabold text-outflow tabular-nums sm:text-sm"
            />
          </div>
        </div>
      </div>

      {/* 4. Aligned Footer */}
      <div className="flex items-center justify-between border-t-2 border-border pt-3 font-mono text-xs">
        <span className="text-muted-foreground">Recorded this month</span>
        <span className="font-bold text-foreground tabular-nums">
          {summary.inflowCount + summary.outflowCount} entries
        </span>
      </div>
    </div>
  );
}
