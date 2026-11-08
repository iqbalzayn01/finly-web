import { Eye, EyeOff } from 'lucide-react';
import { useMemo } from 'react';
import { MoneyValue } from '#/components/money-value';
import { useFinly } from '#/context/finly-context';
import { cn } from '#/lib/utils';

/**
 * Tile 1: Total Balance Bento Card (PRD v2.1.0 §3.1 & DESIGN.md §6.1)
 * Displays net balance across all wallets or filtered by active wallet,
 * with inline privacy blur toggle and wallet filter chips.
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
    <div className="bento-card col-span-12 flex h-full flex-col justify-between gap-5 bg-primary p-6 text-primary-foreground md:col-span-4">
      {/* 1. Header Row */}
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-xs font-extrabold uppercase tracking-wider text-primary-foreground/80">
          {terminology.netBalance}
        </span>
        <span className="inline-flex h-6 items-center gap-1.5 rounded-lg border-2 border-primary-foreground/30 bg-primary-foreground px-2.5 font-mono text-[10px] font-bold uppercase tracking-wider text-primary tabular-nums">
          <span className="size-2 rounded-full bg-primary" />
          <span>Live</span>
        </span>
      </div>

      {/* 2. Main Balance + Privacy Eye Button */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-3">
          <MoneyValue
            amount={displayedBalance}
            className="font-mono text-3xl font-black tracking-tight text-primary-foreground tabular-nums sm:text-4xl"
          />
          <button
            type="button"
            onClick={() => togglePrivacyBlur()}
            aria-label={isMasked ? 'Show balance' : 'Hide balance'}
            title={isMasked ? 'Show balance' : 'Hide balance'}
            className="brutal-btn inline-flex size-9 shrink-0 items-center justify-center rounded-xl border-primary-foreground/30 bg-primary-foreground/15 text-primary-foreground hover:bg-primary-foreground/25 hover:border-primary-foreground cursor-pointer outline-none"
          >
            {isMasked ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </div>

        <p className="font-mono text-xs text-primary-foreground/80">
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
            'inline-flex h-8 items-center rounded-xl border-2 px-3 font-mono text-[11px] transition-all duration-150 active:scale-95 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground focus-visible:border-primary-foreground',
            selectedWalletId === 'all'
              ? 'border-primary-foreground bg-primary-foreground font-extrabold text-primary'
              : 'border-primary-foreground/30 bg-primary-foreground/10 font-semibold text-primary-foreground hover:border-primary-foreground hover:bg-primary-foreground/20',
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
              'inline-flex h-8 items-center rounded-xl border-2 px-3 font-mono text-[11px] transition-all duration-150 active:scale-95 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground focus-visible:border-primary-foreground',
              selectedWalletId === w.id
                ? 'border-primary-foreground bg-primary-foreground font-extrabold text-primary'
                : 'border-primary-foreground/30 bg-primary-foreground/10 font-semibold text-primary-foreground hover:border-primary-foreground hover:bg-primary-foreground/20',
            )}
          >
            {w.name}
          </button>
        ))}
      </div>

      {/* 4. Aligned Footer */}
      <div className="flex items-center justify-between border-t-2 border-primary-foreground/20 pt-3 font-mono text-xs">
        <span className="font-medium text-primary-foreground/80">
          Safety buffer
        </span>
        <MoneyValue
          amount={profile.emergencyBuffer}
          className="font-extrabold text-primary-foreground tabular-nums"
        />
      </div>
    </div>
  );
}
