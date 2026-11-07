import { MoneyValue } from '#/components/money-value';
import { useFinly } from '#/context/finly-context';

/**
 * Tile 2: Daily Safe-to-Spend Hero Spotlight Tile (PRD v2.1.0 §3.1 & DESIGN.md §6.2)
 * Rendered in high-contrast Electric Lime (#C9F31D) with Deep Black (#111111) text.
 * Note: Hide balance button is intentionally absent per PRD v2.1.0 §3.1 & §6.
 */
export function SafeToSpendHero() {
  const { safeToSpend } = useFinly();

  const statusCopy = {
    healthy: 'On track to stay within your monthly budget',
    caution: `Watch daily spending · ${safeToSpend.runwayMonths} mo runway`,
    deficit: 'Upcoming bills are higher than your current balance',
  }[safeToSpend.status];

  const discretionaryPool = Math.max(
    0,
    safeToSpend.netAvailableCash - safeToSpend.committedFixedOutflows,
  );
  const headroomPercent =
    safeToSpend.totalCashOnHand > 0
      ? Math.min(
          100,
          Math.max(
            6,
            Math.round((discretionaryPool / safeToSpend.totalCashOnHand) * 100),
          ),
        )
      : 0;

  return (
    <div className="bento-card col-span-12 flex h-full flex-col justify-between gap-5 bg-primary p-6 text-primary-foreground md:col-span-4">
      {/* 1. Header Row */}
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-xs font-extrabold uppercase tracking-wider text-primary-foreground/80">
          Safe to Spend Today
        </span>
        <span className="inline-flex h-6 items-center rounded-lg border-2 border-primary-foreground/30 bg-primary-foreground px-2.5 font-mono text-[10px] font-bold uppercase tracking-wider text-primary tabular-nums">
          {safeToSpend.daysRemainingInCycle}d left
        </span>
      </div>

      {/* 2. Daily Allowance Figure */}
      <div className="space-y-1.5">
        <div className="flex flex-wrap items-baseline gap-1.5">
          <MoneyValue
            amount={safeToSpend.dailySafeToSpend}
            className="font-mono text-3xl font-black tracking-tight text-primary-foreground tabular-nums sm:text-4xl"
          />
          <span className="font-mono text-xs font-extrabold uppercase text-primary-foreground/75">
            / day
          </span>
        </div>
        <p className="font-mono text-xs font-medium text-primary-foreground/80">
          {statusCopy}
        </p>
      </div>

      {/* 3. Progress Bar Block */}
      <div className="space-y-2 rounded-xl border-2 border-primary-foreground/20 bg-primary-foreground/10 p-3">
        <div className="flex items-center justify-between font-mono text-[11px] font-bold text-primary-foreground tabular-nums">
          <span>Free to spend</span>
          <span>{headroomPercent}% of cash</span>
        </div>
        <div
          role="progressbar"
          aria-valuenow={headroomPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Free to spend percentage"
          className="h-2.5 w-full overflow-hidden rounded-full border border-primary-foreground/30 bg-primary-foreground/20"
        >
          <div
            className="h-full rounded-full bg-primary-foreground transition-[width] duration-300 ease-out"
            style={{ width: `${headroomPercent}%` }}
          />
        </div>
      </div>

      {/* 4. Aligned Footer */}
      <div className="flex items-center justify-between border-t-2 border-primary-foreground/20 pt-3 font-mono text-xs">
        <span className="font-medium text-primary-foreground/80">
          Available this month
        </span>
        <MoneyValue
          amount={discretionaryPool}
          className="font-extrabold text-primary-foreground tabular-nums"
        />
      </div>
    </div>
  );
}
