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
    <div className="bento-card col-span-12 flex h-full flex-col justify-between gap-5 bg-card p-6 text-foreground md:col-span-4">
      {/* 1. Header Row */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Safe to Spend Today
        </span>
        <span className="inline-flex h-6 items-center rounded-full border border-border bg-background/50 px-2.5 text-[11px] font-semibold text-foreground backdrop-blur-md tabular-nums">
          {safeToSpend.daysRemainingInCycle}d left
        </span>
      </div>

      {/* 2. Daily Allowance Figure */}
      <div className="space-y-1.5">
        <div className="flex flex-wrap items-baseline gap-1.5">
          <MoneyValue
            amount={safeToSpend.dailySafeToSpend}
            className="text-3xl font-extrabold tracking-tight text-foreground tabular-nums sm:text-4xl"
          />
          <span className="text-xs font-semibold text-muted-foreground">
            / day
          </span>
        </div>
        <p className="text-xs font-medium text-muted-foreground">
          {statusCopy}
        </p>
      </div>

      {/* 3. Progress Bar Block */}
      <div className="space-y-2 rounded-2xl border border-border bg-background/50 p-3.5 backdrop-blur-md">
        <div className="flex items-center justify-between text-xs font-semibold text-foreground tabular-nums">
          <span>Free to spend</span>
          <span>{headroomPercent}% of cash</span>
        </div>
        <div
          role="progressbar"
          aria-valuenow={headroomPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Free to spend percentage"
          className="h-2.5 w-full overflow-hidden rounded-full border border-border/60 bg-muted/50"
        >
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-300 ease-out"
            style={{ width: `${headroomPercent}%` }}
          />
        </div>
      </div>

      {/* 4. Aligned Footer */}
      <div className="flex items-center justify-between border-t border-border pt-3 text-xs">
        <span className="font-medium text-muted-foreground">
          Available this month
        </span>
        <MoneyValue
          amount={discretionaryPool}
          className="font-bold text-foreground tabular-nums"
        />
      </div>
    </div>
  );
}
