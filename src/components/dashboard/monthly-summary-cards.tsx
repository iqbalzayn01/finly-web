import { ArrowDownRight, ArrowUpRight, Eye, EyeOff } from 'lucide-react';
import { useMemo } from 'react';
import { MoneyValue } from '#/components/money-value';
import { useFinly } from '#/context/finly-context';
import { calculateMonthlySummary } from '#/lib/cashflow';
import { cn } from '#/lib/utils';

/**
 * Tile 1: Total Balance Bento Card (PRD v2.1.0 §3.1 & DESIGN.md §6.1)
 * Features Dark Zinc surface (#27272A) and inline Eye / EyeOff privacy toggle
 * immediately to the right of the numeric balance string.
 */
export function TotalBalanceBentoTile() {
  const {
    profile,
    wallets,
    safeToSpend,
    terminology,
    selectedWalletId,
    setSelectedWalletId,
    togglePrivacyBlur,
  } = useFinly();

  const activeWallet = useMemo(
    () => wallets.find((w) => w.id === selectedWalletId),
    [selectedWalletId, wallets],
  );

  const displayedBalance = activeWallet
    ? activeWallet.balance
    : safeToSpend.totalCashOnHand;

  const isMasked = profile.privacyBlurEnabled;

  return (
    <div className="bento-card col-span-12 flex h-full flex-col justify-between gap-5 bg-card p-6 text-foreground md:col-span-4">
      {/* 1. Header Row */}
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
          {terminology.netBalance}
        </span>
        <span className="inline-flex h-6 items-center gap-1.5 rounded-lg border-2 border-border bg-muted px-2.5 font-mono text-[10px] font-bold uppercase tracking-wider text-foreground">
          <span className="size-2 rounded-full bg-inflow" />
          <span>Live</span>
        </span>
      </div>

      {/* 2. Main Balance + Privacy Eye Button */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-3">
          <MoneyValue
            amount={displayedBalance}
            className="font-mono text-3xl font-black tracking-tight text-foreground tabular-nums sm:text-4xl"
          />
          <button
            type="button"
            onClick={() => togglePrivacyBlur()}
            aria-label={isMasked ? 'Show balance' : 'Hide balance'}
            title={isMasked ? 'Show balance' : 'Hide balance'}
            className="brutal-btn inline-flex size-9 shrink-0 items-center justify-center rounded-xl border-border bg-muted text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer outline-none"
          >
            {isMasked ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </div>

        <p className="font-mono text-xs text-muted-foreground">
          {activeWallet
            ? `Showing ${activeWallet.name}`
            : `Cash across all ${wallets.length} wallets`}
        </p>
      </div>

      {/* 3. Wallet Filter Chips */}
      <div className="flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          onClick={() => setSelectedWalletId('all')}
          className={cn(
            'inline-flex h-8 items-center rounded-xl border-2 px-3 font-mono text-[11px] transition-all duration-150 active:scale-95 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1] focus-visible:border-[#6366F1]',
            selectedWalletId === 'all'
              ? 'border-[#6366F1] bg-[#6366F1]/15 font-extrabold text-[#6366F1]'
              : 'border-border bg-muted/60 font-semibold text-muted-foreground hover:border-[#6366F1]/60 hover:bg-[#6366F1]/10 hover:text-[#6366F1]',
          )}
        >
          All ({wallets.length})
        </button>
        {wallets.map((w) => (
          <button
            key={w.id}
            type="button"
            onClick={() =>
              setSelectedWalletId(selectedWalletId === w.id ? 'all' : w.id)
            }
            className={cn(
              'inline-flex h-8 items-center rounded-xl border-2 px-3 font-mono text-[11px] transition-all duration-150 active:scale-95 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1] focus-visible:border-[#6366F1]',
              selectedWalletId === w.id
                ? 'border-[#6366F1] bg-[#6366F1]/15 font-extrabold text-[#6366F1]'
                : 'border-border bg-muted/60 font-semibold text-muted-foreground hover:border-[#6366F1]/60 hover:bg-[#6366F1]/10 hover:text-[#6366F1]',
            )}
          >
            {w.name}
          </button>
        ))}
      </div>

      {/* 4. Aligned Footer */}
      <div className="flex items-center justify-between border-t-2 border-border pt-3 font-mono text-xs">
        <span className="text-muted-foreground">Safety buffer</span>
        <MoneyValue
          amount={profile.emergencyBuffer}
          className="font-bold text-foreground tabular-nums"
        />
      </div>
    </div>
  );
}

/**
 * Tile 3: This Month's Summary Tile
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
            signedType={isSurplus ? 'money_in' : 'money_out'}
            className={cn(
              'font-mono text-3xl font-black tracking-tight tabular-nums sm:text-4xl',
              isSurplus ? 'text-inflow' : 'text-outflow',
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
        <div className="flex items-center gap-2.5 rounded-xl border-2 border-border bg-muted/40 p-2.5">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-inflow-border bg-inflow-bg text-inflow">
            <ArrowUpRight className="size-4" />
          </span>
          <div className="min-w-0">
            <p className="truncate font-mono text-[10px] font-bold uppercase text-muted-foreground">
              {terminology.inflow}
            </p>
            <MoneyValue
              amount={summary.moneyIn}
              className="block truncate font-mono text-xs font-extrabold text-inflow tabular-nums sm:text-sm"
            />
          </div>
        </div>

        <div className="flex items-center gap-2.5 rounded-xl border-2 border-border bg-muted/40 p-2.5">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-outflow-border bg-outflow-bg text-outflow">
            <ArrowDownRight className="size-4" />
          </span>
          <div className="min-w-0">
            <p className="truncate font-mono text-[10px] font-bold uppercase text-muted-foreground">
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
