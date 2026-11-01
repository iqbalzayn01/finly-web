import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Plus, ShieldAlert } from "lucide-react";
import { CashflowTrendChart } from "#/components/dashboard/cashflow-trend-chart";
import { MonthlySummaryCards } from "#/components/dashboard/monthly-summary-cards";
import { RecentTransactionsCard } from "#/components/dashboard/recent-transactions-card";
import { SafeToSpendHero } from "#/components/dashboard/safe-to-spend-hero";
import { MoneyValue } from "#/components/money-value";
import { Button } from "#/components/ui/button";
import { useFinly } from "#/context/finly-context";
import { formatMonthYear } from "#/lib/format";

export const Route = createFileRoute("/")({
	component: DashboardScreen,
});

function DashboardScreen() {
	const { safeToSpend, todayISO, openQuickEntry } = useFinly();

	const showDeficitAlert =
		safeToSpend.totalCashOnHand < 0 || safeToSpend.status === "deficit";

	return (
		<div className="space-y-6">
			{/* Consolidated Header Row (PRD v2.0.0 §3) */}
			<div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
				<div className="space-y-1">
					<h1 className="font-mono text-2xl font-bold uppercase tracking-tight text-foreground sm:text-3xl">
						{formatMonthYear(todayISO)} Cashflow
					</h1>
					<p className="text-xs text-muted-foreground sm:text-sm">
						Summary of net cash, daily spending limit, and trends.
					</p>
				</div>

				<Button
					type="button"
					onClick={() => openQuickEntry("money_out")}
					className="min-h-11 gap-2 rounded-xl px-5 font-mono font-bold shadow-neu-sm"
				>
					<Plus className="size-4 stroke-[2.5]" />
					<span>Record Transaction</span>
				</Button>
			</div>

			{/* Cashflow Deficit Alert Banner */}
			{showDeficitAlert && (
				<div
					role="alert"
					className="shadow-neu-raised flex flex-col justify-between gap-3 rounded-2xl border border-zinc-200 bg-zinc-50/90 p-4 text-foreground sm:flex-row sm:items-center dark:border-zinc-800 dark:bg-zinc-900/90"
				>
					<div className="flex items-start gap-3">
						<span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl bg-zinc-200 text-foreground dark:bg-zinc-800">
							<ShieldAlert className="size-4" />
						</span>
						<div className="space-y-0.5 text-xs sm:text-sm">
							<p className="font-bold">Cashflow Deficit Alert</p>
							<p className="text-xs text-muted-foreground">
								Available balance is{" "}
								<MoneyValue
									amount={safeToSpend.totalCashOnHand}
									className="font-bold text-foreground"
								/>{" "}
								with{" "}
								<MoneyValue
									amount={safeToSpend.committedFixedOutflows}
									className="font-bold text-foreground"
								/>{" "}
								in scheduled obligations.
							</p>
						</div>
					</div>

					<Button
						asChild
						size="sm"
						variant="outline"
						className="shrink-0 gap-1.5 rounded-xl border-zinc-300 bg-white font-bold text-foreground hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700 cursor-pointer"
					>
						<Link
							to="/history"
							search={{ sort: "largest", q: undefined, category: undefined }}
						>
							<span>Review Largest Expenses</span>
							<ArrowRight className="size-3.5" />
						</Link>
					</Button>
				</div>
			)}

			{/* 4.1 Summary Metric Cards (Total Balance, Total Income, Total Expenses) */}
			<MonthlySummaryCards />

			{/* 4.2 Safe-to-Spend Today Banner */}
			<SafeToSpendHero />

			{/* 4.3 Cashflow Overview: shadcn/ui Area Chart - Interactive (1W, 1M, 3M, 6M, 1Y) */}
			<CashflowTrendChart />

			{/* 4.4 Recent Transactions with Filters & 10-Row Pagination */}
			<section id="recent-transactions">
				<RecentTransactionsCard />
			</section>
		</div>
	);
}
