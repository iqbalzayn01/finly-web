import { ArrowDownRight, ArrowUpRight, Wallet } from "lucide-react";
import { useMemo } from "react";
import { MoneyValue } from "#/components/money-value";
import { Card, CardContent } from "#/components/ui/card";
import { useFinly } from "#/context/finly-context";
import { calculateMonthlySummary } from "#/lib/cashflow";
import { cn } from "#/lib/utils";

export function MonthlySummaryCards() {
	const {
		transactions,
		wallets,
		safeToSpend,
		todayISO,
		selectedWalletId,
		setSelectedWalletId,
	} = useFinly();

	const summary = useMemo(
		() => calculateMonthlySummary(transactions, todayISO, selectedWalletId),
		[selectedWalletId, todayISO, transactions],
	);

	const activeWallet = useMemo(
		() => wallets.find((w) => w.id === selectedWalletId),
		[selectedWalletId, wallets],
	);

	const displayedBalance = activeWallet
		? activeWallet.balance
		: safeToSpend.totalCashOnHand;

	return (
		<div className="grid gap-4 md:grid-cols-3">
			{/* 1. TOTAL BALANCE CARD (PRD v2.0.0 §3.1) */}
			<Card className="shadow-neu-raised rounded-2xl border border-zinc-100 bg-white py-0 dark:border-zinc-800 dark:bg-zinc-900">
				<CardContent className="space-y-3 p-6">
					<div className="flex items-start justify-between gap-3">
						<div className="space-y-1.5">
							<p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
								TOTAL BALANCE
							</p>
							<MoneyValue
								amount={displayedBalance}
								className="text-3xl font-bold tracking-tight text-foreground"
							/>
							<p className="text-xs text-muted-foreground">
								{activeWallet
									? `Filtered to ${activeWallet.name}`
									: "Net available cash"}
							</p>
						</div>
						<span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-foreground dark:bg-zinc-800">
							<Wallet className="size-5" />
						</span>
					</div>

					{/* Subtle wallet filter chips */}
					<div className="flex flex-wrap items-center gap-1.5 border-t border-border/60 pt-2.5">
						<button
							type="button"
							onClick={() => setSelectedWalletId("all")}
							className={cn(
								"rounded-full px-2.5 py-0.5 text-[11px] transition-colors cursor-pointer",
								selectedWalletId === "all"
									? "shadow-neu-sm bg-zinc-900 font-bold text-white dark:bg-white dark:text-zinc-900"
									: "font-medium text-muted-foreground hover:text-foreground",
							)}
						>
							All ({wallets.length})
						</button>
						{wallets.map((w) => (
							<button
								key={w.id}
								type="button"
								onClick={() =>
									setSelectedWalletId(selectedWalletId === w.id ? "all" : w.id)
								}
								className={cn(
									"rounded-full px-2.5 py-0.5 text-[11px] transition-colors cursor-pointer",
									selectedWalletId === w.id
										? "shadow-neu-sm bg-zinc-900 font-bold text-white dark:bg-white dark:text-zinc-900"
										: "font-medium text-muted-foreground hover:text-foreground",
								)}
							>
								{w.name}
							</button>
						))}
					</div>
				</CardContent>
			</Card>

			{/* 2. TOTAL INCOME (MONTH) CARD (PRD v2.0.0 §3.1 - Monochrome Neutral) */}
			<Card className="shadow-neu-raised rounded-2xl border border-zinc-100 bg-white py-0 dark:border-zinc-800 dark:bg-zinc-900">
				<CardContent className="flex h-full flex-col justify-between gap-3 p-6">
					<div className="flex items-start justify-between gap-3">
						<div className="space-y-1.5">
							<p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
								TOTAL INCOME (MONTH)
							</p>
							<MoneyValue
								amount={summary.moneyIn}
								className="text-3xl font-bold tracking-tight text-foreground"
							/>
							<p className="text-xs text-muted-foreground">
								Total cash received
							</p>
						</div>
						<span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-foreground dark:bg-zinc-800">
							<ArrowUpRight className="size-5" />
						</span>
					</div>
				</CardContent>
			</Card>

			{/* 3. TOTAL EXPENSES (MONTH) CARD (PRD v2.0.0 §3.1 - Monochrome Neutral) */}
			<Card className="shadow-neu-raised rounded-2xl border border-zinc-100 bg-white py-0 dark:border-zinc-800 dark:bg-zinc-900">
				<CardContent className="flex h-full flex-col justify-between gap-3 p-6">
					<div className="flex items-start justify-between gap-3">
						<div className="space-y-1.5">
							<p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
								TOTAL EXPENSES (MONTH)
							</p>
							<MoneyValue
								amount={summary.moneyOut}
								className="text-3xl font-bold tracking-tight text-foreground"
							/>
							<p className="text-xs text-muted-foreground">
								Total cash disbursed
							</p>
						</div>
						<span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-foreground dark:bg-zinc-800">
							<ArrowDownRight className="size-5" />
						</span>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
