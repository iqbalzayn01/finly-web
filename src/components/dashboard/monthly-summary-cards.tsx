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
    <div className="bento-card col-span-12 flex flex-col justify-between bg-zinc-900 p-6 border border-zinc-900 text-white md:col-span-4 dark:bg-card dark:border-zinc-800">
      {/* Header Row */}
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-white dark:text-muted-foreground">
          {terminology.netBalance}
        </span>
        <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-primary">
          <span className="size-2.5 rounded-full bg-primary" />
          <span>Live</span>
        </span>
      </div>

      {/* Balance + Inline Privacy Eye Button */}
      <div className="my-5 space-y-2.5">
        <div className="flex items-center gap-3">
          <MoneyValue
            amount={displayedBalance}
            className="font-mono text-3xl font-black tracking-tighter text-white tabular-nums sm:text-4xl"
          />
          <button
            type="button"
            onClick={() => togglePrivacyBlur()}
            aria-label={isMasked ? 'Show balance' : 'Hide balance'}
            title={isMasked ? 'Show balance' : 'Hide balance'}
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl border border-zinc-700/80 bg-zinc-800/90 text-muted-foreground transition-colors hover:bg-zinc-700 hover:text-white cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {isMasked ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </div>

        <p className="font-mono text-xs text-white dark:text-muted-foreground">
          {activeWallet
            ? `Filtered to ${activeWallet.name}`
            : `Available across ${wallets.length} active ${wallets.length === 1 ? 'account' : 'accounts'}`}
        </p>

        {/* Wallet Filter Micro-Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <button
            type="button"
            onClick={() => setSelectedWalletId('all')}
            className={cn(
              'rounded-xl px-2.5 py-1 font-mono text-[11px] transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary border border-muted-foreground dark:border-border/80',
              selectedWalletId === 'all'
                ? 'bg-primary font-bold text-primary-foreground'
                : 'bg-zinc-800/90 font-medium text-muted-foreground hover:bg-zinc-700 hover:text-white',
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
                'rounded-xl px-2.5 py-1 font-mono text-[11px] transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary border border-muted-foreground dark:border-border/80',
                selectedWalletId === w.id
                  ? 'bg-primary font-bold text-primary-foreground'
                  : 'bg-zinc-800/90 font-medium text-muted-foreground hover:bg-zinc-700 hover:text-white',
              )}
            >
              {w.name}
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-border/80 pt-3">
        <span className="font-mono text-[11px] text-white dark:text-muted-foreground">
          {wallets.length} {wallets.length === 1 ? 'Account' : 'Accounts'}{' '}
          Active
        </span>
        <span className="font-mono text-[11px] font-semibold text-white dark:text-muted-foreground">
          Auto-updated
        </span>
      </div>
    </div>
  );
}

/**
 * Tile 3: Total Inflow & Outflow Summary Tile (PRD v2.1.0 §3.1)
 * Styled with neutral micro-badge,
 * Emerald (#34D399) Inflow, Rose (#FB7185) Outflow, and Net Cash Position.
 */
export function CashSummaryBentoTile() {
  const { transactions, todayISO, terminology, selectedWalletId } = useFinly();

  const summary = useMemo(
    () => calculateMonthlySummary(transactions, todayISO, selectedWalletId),
    [selectedWalletId, todayISO, transactions],
  );

  const isSurplus = summary.netFlow >= 0;

  return (
    <div className="bento-card col-span-12 flex flex-col justify-between border border-border bg-card p-6 md:col-span-4 dark:border-zinc-800">
      {/* Header Row */}
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Total Cash Summary
        </span>
        <span className="rounded-full bg-accent px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-accent-foreground">
          30D Flow
        </span>
      </div>

      {/* Inflow & Outflow Rows */}
      <div className="my-4 space-y-2.5">
        <div className="flex items-center justify-between gap-2 rounded-2xl border border-border/70 bg-white/85 px-3.5 py-2.5 dark:border-zinc-700/60 dark:bg-muted/85">
          <div className="flex items-center gap-2.5">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-xl bg-inflow-bg text-inflow">
              <ArrowUpRight className="size-4" />
            </span>
            <div>
              <p className="font-mono text-xs font-bold text-foreground">
                {terminology.inflow}
              </p>
              <p className="font-mono text-[10px] text-muted-foreground">
                {summary.inflowCount}{' '}
                {summary.inflowCount === 1 ? 'deposit' : 'deposits'}
              </p>
            </div>
          </div>
          <MoneyValue
            amount={summary.moneyIn}
            signedType="money_in"
            className="font-mono text-base font-extrabold text-inflow tabular-nums sm:text-lg"
          />
        </div>

        <div className="flex items-center justify-between gap-2 rounded-2xl border border-border/70 bg-white/85 px-3.5 py-2.5 dark:border-zinc-700/60 dark:bg-muted/85">
          <div className="flex items-center gap-2.5">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-xl bg-outflow-bg text-outflow">
              <ArrowDownRight className="size-4" />
            </span>
            <div>
              <p className="font-mono text-xs font-bold text-foreground">
                {terminology.outflow}
              </p>
              <p className="font-mono text-[10px] text-muted-foreground">
                {summary.outflowCount}{' '}
                {summary.outflowCount === 1 ? 'entry' : 'entries'}
              </p>
            </div>
          </div>
          <MoneyValue
            amount={summary.moneyOut}
            signedType="money_out"
            className="font-mono text-base font-extrabold text-outflow tabular-nums sm:text-lg"
          />
        </div>
      </div>

      {/* Net Cash Position Footer */}
      <div className="flex items-center justify-between gap-2 border-t border-border/80 pt-3">
        <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Net Cash
        </span>
        <div className="flex items-center gap-2">
          <MoneyValue
            amount={Math.abs(summary.netFlow)}
            signedType={isSurplus ? 'money_in' : 'money_out'}
            className={cn(
              'font-mono text-xs font-extrabold tabular-nums sm:text-sm',
              isSurplus ? 'text-inflow' : 'text-outflow',
            )}
          />
          <span
            className={cn(
              'rounded-full px-2 py-0.5 font-mono text-[10px] font-bold uppercase',
              isSurplus
                ? 'bg-inflow-bg text-inflow'
                : 'bg-outflow-bg text-outflow',
            )}
          >
            {isSurplus ? 'Surplus' : 'Deficit'}
          </span>
        </div>
      </div>
    </div>
  );
}
