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
    <div className="space-y-6">
      {/* Top Workspace Header Row */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="space-y-1">
          <h1 className="font-mono text-2xl font-black uppercase tracking-tight text-foreground sm:text-3xl">
            {formatMonthYear(todayISO)} Overview
          </h1>
          <p className="font-mono text-xs text-muted-foreground sm:text-sm">
            See your balance, daily spending limit, and unpaid invoices in one
            place.
          </p>
        </div>

        <Button
          type="button"
          size="default"
          onClick={() => openQuickEntry('money_out')}
          className="h-10 gap-2 rounded-xl bg-primary px-4 font-mono text-xs font-extrabold uppercase tracking-wider text-primary-foreground"
        >
          <Plus className="size-4 stroke-[2.5] transition-transform duration-200 group-hover:rotate-90" />
          <span>Add Transaction</span>
        </Button>
      </div>

      {/* 12-Column Rounded Brutalism Bento Grid */}
      <div className="grid grid-cols-12 items-stretch gap-4">
        {/* Optional Low Balance Warning Tile */}
        {showDeficitAlert && (
          <div
            role="alert"
            className="bento-card bento-card-static col-span-12 flex flex-col justify-between gap-4 border-outflow-border bg-outflow-bg p-5 text-foreground sm:flex-row sm:items-center"
          >
            <div className="flex items-start gap-3.5">
              <span className="brutal-surface flex size-10 shrink-0 items-center justify-center rounded-xl border-outflow-border bg-card text-outflow">
                <ShieldAlert className="size-5" />
              </span>
              <div className="space-y-1 font-mono text-xs">
                <p className="font-extrabold uppercase tracking-wider text-outflow">
                  Low Balance Warning
                </p>
                <p className="text-muted-foreground">
                  Your balance is{' '}
                  <MoneyValue
                    amount={safeToSpend.totalCashOnHand}
                    className="font-bold text-foreground"
                  />{' '}
                  with{' '}
                  <MoneyValue
                    amount={safeToSpend.committedFixedOutflows}
                    className="font-bold text-foreground"
                  />{' '}
                  in upcoming bills.
                </p>
              </div>
            </div>

            <Button
              asChild
              size="sm"
              variant="outline"
              className="shrink-0 gap-1.5 rounded-xl border-outflow-border bg-card font-mono text-xs font-bold hover:bg-outflow hover:text-primary-foreground"
            >
              <Link
                to="/history"
                search={{ sort: 'largest', q: undefined, category: undefined }}
              >
                <span>View Largest Expenses</span>
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
          </div>
        )}

        {/* Row 1: 3 Equal 4-Column Bento Tiles */}
        <TotalBalanceBentoTile />
        <SafeToSpendHero />
        <CashSummaryBentoTile />

        {/* Row 2: 8-Col Trend Chart + 4-Col Unpaid Invoices */}
        <CashflowTrendChart />
        <ReceivablesBentoTile />

        {/* Row 3: 12-Col Recent Activity Table */}
        <section id="recent-transactions" className="col-span-12">
          <RecentTransactionsCard />
        </section>
      </div>
    </div>
  );
}
