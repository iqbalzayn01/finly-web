import { MoneyValue } from '#/components/money-value';
import { useFinly } from '#/context/finly-context';

/**
 * Tile 2: Daily Safe-to-Spend Hero Spotlight Tile (PRD v2.1.0 §3.1 & DESIGN.md §6.2)
 * Rendered in high-contrast Electric Lime (#C9F31D) with Deep Black (#111111) text.
 * Note: Hide balance button is intentionally absent per PRD v2.1.0 §3.1 & §6.
 */
export function SafeToSpendHero() {
  const { profile, safeToSpend } = useFinly();

  const statusCopy = {
    healthy: 'Paced to maintain positive month-end reserve',
    caution: `Pace discretionary spend · ${safeToSpend.runwayMonths} mo runway`,
    deficit: 'Scheduled obligations exceed available buffer',
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
    <div className="bento-card col-span-12 flex flex-col justify-between bg-primary border border-primary p-6 text-primary-foreground md:col-span-4">
      {/* Header Row */}
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-primary-foreground/75">
          Daily Safe-to-Spend
        </span>
        <span className="rounded-full bg-primary-foreground px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-primary tabular-nums">
          {safeToSpend.daysRemainingInCycle}D Left
        </span>
      </div>

      {/* Oversized Daily Allowance Figure */}
      <div className="my-5">
        <div className="flex flex-wrap items-baseline gap-1.5">
          <MoneyValue
            amount={safeToSpend.dailySafeToSpend}
            className="font-mono text-4xl font-black tracking-tighter text-primary-foreground tabular-nums sm:text-5xl"
          />
          <span className="font-mono text-sm font-bold text-primary-foreground/75">
            / day
          </span>
        </div>
        <p className="mt-2 font-mono text-xs font-medium text-primary-foreground/80">
          {statusCopy}
        </p>
      </div>

      {/* Solid Black Progress Bar (DESIGN.md §6.2) */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between font-mono text-[11px] font-bold text-primary-foreground/80 tabular-nums">
          <span>Spendable Pool ({headroomPercent}%)</span>
          <span>
            Buffer{' '}
            <MoneyValue
              amount={profile.emergencyBuffer}
              className="font-extrabold text-primary-foreground"
            />
          </span>
        </div>
        <div
          role="progressbar"
          aria-valuenow={headroomPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Spendable cash pool percentage"
          className="h-2 w-full overflow-hidden rounded-full bg-primary-foreground/20"
        >
          <div
            className="h-full rounded-full bg-primary-foreground transition-[width] duration-300 ease-out"
            style={{ width: `${headroomPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
