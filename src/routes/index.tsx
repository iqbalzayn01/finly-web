import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowRight, Plus, ShieldAlert } from 'lucide-react';
import { CashflowTrendChart } from '#/components/dashboard/cashflow-trend-chart';
import {
  CashSummaryBentoTile,
  TotalBalanceBentoTile,
} from '#/components/dashboard/monthly-summary-cards';
import { ReceivablesBentoTile } from '#/components/dashboard/receivables-bento-tile';
import { RecentTransactionsCard } from '#/components/dashboard/recent-transactions-card';
import { SafeToSpendHero } from '#/components/dashboard/safe-to-spend-hero';
import { MoneyValue } from '#/components/money-value';
import { Button } from '#/components/ui/button';
import { useFinly } from '#/context/finly-context';
import { formatMonthYear } from '#/lib/format';

export const Route = createFileRoute('/')({
  component: DashboardScreen,
});

function DashboardScreen() {
  const { safeToSpend, todayISO, openQuickEntry } = useFinly();

  const showDeficitAlert =
    safeToSpend.totalCashOnHand < 0 || safeToSpend.status === 'deficit';

  return (
    <div className="space-y-4">
      {/* Top Workspace Header Row (PRD v2.1.0 §3) */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div className="space-y-0.5">
          <h1 className="font-mono text-2xl font-black uppercase tracking-tight text-foreground sm:text-3xl">
            {formatMonthYear(todayISO)} Cashflow
          </h1>
          <p className="font-mono text-xs text-muted-foreground">
            Real-time cash position, daily spending headroom, and receivables
            matrix.
          </p>
        </div>

        <Button
          type="button"
          onClick={() => openQuickEntry('money_out')}
          className="min-h-11 gap-2 rounded-2xl bg-primary px-5 font-mono text-xs font-extrabold tracking-wider text-primary-foreground shadow-xs hover:bg-primary-hover cursor-pointer"
        >
          <Plus className="size-4 stroke-[2.5]" />
          <span>Record Transaction</span>
        </Button>
      </div>

      {/* 12-Column Asymmetrical Bento Grid Matrix (Strict gap-2 mobile / gap-4 desktop — PRD v2.1.0 §3) */}
      <div className="grid grid-cols-12 gap-2 sm:gap-4">
        {/* Optional Deficit Warning Tile */}
        {showDeficitAlert && (
          <div
            role="alert"
            className="bento-card bento-card-static col-span-12 flex flex-col justify-between gap-3 border border-outflow-border bg-outflow-bg p-4 text-foreground sm:flex-row sm:items-center"
          >
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-outflow-bg text-outflow">
                <ShieldAlert className="size-4" />
              </span>
              <div className="space-y-0.5 font-mono text-xs">
                <p className="font-bold uppercase tracking-wider text-outflow">
                  Cashflow Deficit Alert
                </p>
                <p className="text-muted-foreground">
                  Available balance is{' '}
                  <MoneyValue
                    amount={safeToSpend.totalCashOnHand}
                    className="font-bold text-foreground"
                  />{' '}
                  with{' '}
                  <MoneyValue
                    amount={safeToSpend.committedFixedOutflows}
                    className="font-bold text-foreground"
                  />{' '}
                  in scheduled obligations.
                </p>
              </div>
            </div>

            <Button
              asChild
              size="sm"
              variant="outline"
              className="shrink-0 gap-1.5 rounded-xl border-outflow-border bg-background font-mono text-xs font-bold hover:bg-outflow hover:text-primary-foreground"
            >
              <Link
                to="/history"
                search={{ sort: 'largest', q: undefined, category: undefined }}
              >
                <span>Review Largest Expenses</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </div>
        )}

        {/* Row 1: Tile 1 (Balance + Inline Eye) | Tile 2 (Safe-to-Spend Lime) | Tile 3 (Cash Summary Violet) */}
        <TotalBalanceBentoTile />
        <SafeToSpendHero />
        <CashSummaryBentoTile />

        {/* Row 2: Tile 4 (Span-8 Interactive Area Chart) | Tile 5 (Span-4 Unpaid Receivables) */}
        <CashflowTrendChart />
        <ReceivablesBentoTile />

        {/* Row 3: Tile 6 (Span-12 10-Row Paginated Recent Transactions Ledger) */}
        <section id="recent-transactions" className="col-span-12">
          <RecentTransactionsCard />
        </section>
      </div>
    </div>
  );
}
