import { Plus, ReceiptText, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { MoneyValue } from "#/components/money-value";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "#/components/ui/empty";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "#/components/ui/pagination";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "#/components/ui/table";
import { useFinly } from "#/context/finly-context";
import { paginateItems } from "#/lib/cashflow";
import { formatFriendlyDate } from "#/lib/format";
import { cn } from "#/lib/utils";

type LedgerFilterTab = "all" | "income" | "expenses";

const PAGE_SIZE = 10;

/**
 * Tile 6: Recent Transactions Bento Ledger (PRD v2.1.0 §3.1)
 * Span-12 full-width Bento container with strict 10-row pagination and
 * semantic Inflow (#34D399) / Outflow (#FB7185) filter pills and amounts.
 */
export function RecentTransactionsCard() {
	const {
		transactions,
		wallets,
		todayISO,
		terminology,
		selectedWalletId,
		setSelectedWalletId,
		openQuickEntry,
		deleteTransaction,
	} = useFinly();

	const [filterTab, setFilterTab] = useState<LedgerFilterTab>("all");
	const [page, setPage] = useState<number>(1);
	const [lastWalletId, setLastWalletId] = useState<string>(selectedWalletId);

	if (lastWalletId !== selectedWalletId) {
		setLastWalletId(selectedWalletId);
		setPage(1);
	}

	const walletNameById = useMemo(
		() => new Map(wallets.map((w) => [w.id, w.name])),
		[wallets],
	);

	const walletScoped = useMemo(() => {
		if (selectedWalletId === "all") return transactions;
		return transactions.filter((tx) => tx.walletId === selectedWalletId);
	}, [selectedWalletId, transactions]);

	const tabCounts = useMemo(() => {
		let income = 0;
		let expenses = 0;
		for (const tx of walletScoped) {
			if (tx.type === "money_in") income += 1;
			else expenses += 1;
		}
		return {
			all: walletScoped.length,
			income,
			expenses,
		};
	}, [walletScoped]);

	const filteredTransactions = useMemo(() => {
		if (filterTab === "income") {
			return walletScoped.filter((tx) => tx.type === "money_in");
		}
		if (filterTab === "expenses") {
			return walletScoped.filter((tx) => tx.type === "money_out");
		}
		return walletScoped;
	}, [filterTab, walletScoped]);

	const paginated = useMemo(
		() => paginateItems(filteredTransactions, page, PAGE_SIZE),
		[filteredTransactions, page],
	);

	const canPrev = paginated.currentPage > 1 && paginated.totalItems > PAGE_SIZE;
	const canNext =
		paginated.currentPage < paginated.totalPages &&
		paginated.totalItems > PAGE_SIZE;

	const rangeStart =
		paginated.totalItems === 0
			? 0
			: (paginated.currentPage - 1) * PAGE_SIZE + 1;
	const rangeEnd = Math.min(
		paginated.currentPage * PAGE_SIZE,
		paginated.totalItems,
	);

	return (
		<div className="bento-card bento-card-static col-span-12 overflow-hidden border border-border bg-card dark:border-zinc-800">
			{/* Bento Ledger Header */}
			<div className="flex flex-col justify-between gap-4 border-b border-border/70 p-5 sm:flex-row sm:items-center sm:px-6">
				<div className="space-y-0.5">
					<h2 className="font-mono text-sm font-bold uppercase tracking-wider text-foreground">
						Recent Activity
					</h2>
					<p className="font-mono text-xs text-muted-foreground">
						Chronological cashflow ledger · 10 records per page
					</p>
				</div>

				{/* Filter Pills: All, Inflow, Outflow */}
				<div
					role="tablist"
					aria-label="Filter recent transactions"
					className="flex flex-wrap items-center gap-1 rounded-xl border border-border bg-white p-1 dark:border-zinc-800 dark:bg-background"
				>
					<button
						type="button"
						role="tab"
						aria-selected={filterTab === "all"}
						onClick={() => {
							setFilterTab("all");
							setPage(1);
						}}
						className={cn(
							"inline-flex min-h-8 items-center gap-1.5 rounded-lg px-3 py-1 font-mono text-xs font-semibold transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring",
							filterTab === "all"
								? "bg-primary font-bold text-primary-foreground shadow-xs"
								: "text-muted-foreground hover:text-foreground",
						)}
					>
						<span>All ({tabCounts.all})</span>
					</button>

					<button
						type="button"
						role="tab"
						aria-selected={filterTab === "income"}
						onClick={() => {
							setFilterTab("income");
							setPage(1);
						}}
						className={cn(
							"inline-flex min-h-8 items-center gap-1.5 rounded-lg px-3 py-1 font-mono text-xs font-semibold transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring",
							filterTab === "income"
								? "bg-inflow font-bold text-primary-foreground shadow-xs"
								: "text-muted-foreground hover:text-foreground",
						)}
					>
						<span
							className={cn(
								"size-2 rounded-full",
								filterTab === "income" ? "bg-primary-foreground" : "bg-inflow",
							)}
						/>
						<span>
							{terminology.inflow} ({tabCounts.income})
						</span>
					</button>

					<button
						type="button"
						role="tab"
						aria-selected={filterTab === "expenses"}
						onClick={() => {
							setFilterTab("expenses");
							setPage(1);
						}}
						className={cn(
							"inline-flex min-h-8 items-center gap-1.5 rounded-lg px-3 py-1 font-mono text-xs font-semibold transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring",
							filterTab === "expenses"
								? "bg-outflow font-bold text-primary-foreground shadow-xs"
								: "text-muted-foreground hover:text-foreground",
						)}
					>
						<span
							className={cn(
								"size-2 rounded-full",
								filterTab === "expenses" ? "bg-primary-foreground" : "bg-outflow",
							)}
						/>
						<span>
							{terminology.outflow} ({tabCounts.expenses})
						</span>
					</button>
				</div>
			</div>

			{/* Table Content */}
			<div>
				{transactions.length === 0 ? (
					<div className="p-6">
						<Empty className="rounded-2xl border border-dashed border-border bg-white/60 py-10 dark:bg-muted/60">
							<EmptyHeader>
								<EmptyMedia variant="icon">
									<ReceiptText className="size-5 text-foreground" />
								</EmptyMedia>
								<EmptyTitle className="font-mono text-base font-bold">
									No transactions recorded yet
								</EmptyTitle>
								<EmptyDescription className="font-mono text-xs">
									Record your first income or expense in USD to see your
									Safe-to-Spend allowance and cashflow trend.
								</EmptyDescription>
							</EmptyHeader>
							<EmptyContent>
								<Button
									type="button"
									onClick={() => openQuickEntry("money_in")}
									className="min-h-11 gap-2 rounded-xl px-5 font-mono font-bold"
								>
									<Plus className="size-4" />
									<span>Record Transaction</span>
								</Button>
							</EmptyContent>
						</Empty>
					</div>
				) : paginated.data.length === 0 ? (
					<div className="p-6">
						<Empty className="rounded-2xl border border-dashed border-border bg-white/60 py-8 dark:bg-muted/60">
							<EmptyHeader>
								<EmptyTitle className="font-mono text-sm font-bold">
									No matching transactions
								</EmptyTitle>
								<EmptyDescription className="font-mono text-xs">
									Switch filter pills or clear the active wallet filter to view
									more records.
								</EmptyDescription>
							</EmptyHeader>
							<EmptyContent>
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={() => {
										setFilterTab("all");
										setSelectedWalletId("all");
										setPage(1);
									}}
									className="rounded-xl font-mono font-semibold"
								>
									Show All Transactions
								</Button>
							</EmptyContent>
						</Empty>
					</div>
				) : (
					<>
						<Table>
							<TableHeader className="bg-white/60 dark:bg-muted/70">
								<TableRow className="border-border/70">
									<TableHead className="pl-5 font-mono text-[11px] font-semibold uppercase tracking-widest text-muted-foreground sm:pl-6">
										Transaction / Note
									</TableHead>
									<TableHead className="hidden font-mono text-[11px] font-semibold uppercase tracking-widest text-muted-foreground sm:table-cell">
										Category
									</TableHead>
									<TableHead className="font-mono text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
										Date
									</TableHead>
									<TableHead className="hidden font-mono text-[11px] font-semibold uppercase tracking-widest text-muted-foreground md:table-cell">
										Wallet Account
									</TableHead>
									<TableHead className="text-right font-mono text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
										Amount
									</TableHead>
									<TableHead className="w-10 pr-4 text-right sm:pr-5">
										<span className="sr-only">Actions</span>
									</TableHead>
								</TableRow>
							</TableHeader>

							<TableBody>
								{paginated.data.map((tx) => {
									const walletName =
										walletNameById.get(tx.walletId) ?? "Checking";
									const isInflow = tx.type === "money_in";

									return (
										<TableRow
											key={tx.id}
											className="group border-border/60 transition-colors hover:bg-white/80 dark:hover:bg-muted/60"
										>
											<TableCell className="pl-5 sm:pl-6">
												<div className="flex items-center gap-2.5">
													<span
														className={cn(
															"size-2 shrink-0 rounded-full",
															isInflow ? "bg-inflow" : "bg-outflow",
														)}
													/>
													<div className="min-w-0">
														<p className="max-w-44 truncate font-mono text-xs font-semibold text-foreground sm:max-w-xs sm:text-sm">
															{tx.note || tx.category}
														</p>
														<p className="font-mono text-[11px] text-muted-foreground sm:hidden">
															{tx.category} · {walletName}
														</p>
													</div>
												</div>
											</TableCell>
											<TableCell className="hidden sm:table-cell">
												<Badge
													variant="outline"
													className="rounded-lg border-border bg-white/80 font-mono text-[11px] font-medium text-foreground dark:border-zinc-700 dark:bg-muted"
												>
													{tx.category}
												</Badge>
											</TableCell>
											<TableCell className="font-mono text-xs text-muted-foreground tabular-nums">
												{formatFriendlyDate(tx.date, todayISO)}
											</TableCell>
											<TableCell className="hidden font-mono text-xs text-muted-foreground md:table-cell">
												{walletName}
											</TableCell>
											<TableCell className="text-right">
												<MoneyValue
													amount={tx.amount}
													signedType={tx.type}
													className={cn(
														"font-mono text-xs font-extrabold tabular-nums sm:text-sm",
														isInflow ? "text-inflow" : "text-outflow",
													)}
												/>
											</TableCell>
											<TableCell className="pr-4 text-right sm:pr-5">
												<Button
													type="button"
													variant="ghost"
													size="icon-xs"
													onClick={() => deleteTransaction(tx.id)}
													aria-label={`Delete ${tx.note || tx.category}`}
													className="text-muted-foreground opacity-75 hover:text-outflow sm:opacity-0 sm:group-hover:opacity-100 focus-visible:opacity-100 dark:hover:text-outflow"
												>
													<Trash2 className="size-3.5" />
												</Button>
											</TableCell>
										</TableRow>
									);
								})}
							</TableBody>
						</Table>

						{/* Strict 10-Row Pagination Footer (PRD v2.1.0 §3 & §6) */}
						<div className="flex flex-col items-center justify-between gap-3 border-t border-border/70 bg-white/50 px-5 py-3.5 sm:flex-row sm:px-6 dark:bg-muted/60">
							<p className="font-mono text-xs text-muted-foreground tabular-nums">
								Showing{" "}
								<strong className="font-bold text-foreground">
									{rangeStart} - {rangeEnd}
								</strong>{" "}
								of{" "}
								<strong className="font-bold text-foreground">
									{paginated.totalItems}
								</strong>{" "}
								records
							</p>

							<Pagination className="mx-0 w-auto justify-end">
								<PaginationContent className="gap-1.5">
									<PaginationItem>
										<PaginationPrevious
											href="#recent-transactions"
											aria-disabled={!canPrev}
											tabIndex={!canPrev ? -1 : undefined}
											onClick={(e) => {
												e.preventDefault();
												if (canPrev) {
													setPage((prev) => Math.max(1, prev - 1));
												}
											}}
											className={cn(
												"h-8 rounded-xl font-mono text-xs cursor-pointer",
												!canPrev && "pointer-events-none opacity-45",
											)}
										/>
									</PaginationItem>

									<PaginationItem>
										<PaginationLink
											href="#recent-transactions"
											isActive
											size="default"
											onClick={(e) => e.preventDefault()}
											className="h-8 cursor-default rounded-xl border-none bg-primary px-3 font-mono text-xs font-bold text-primary-foreground tabular-nums hover:bg-primary hover:text-primary-foreground"
										>
											Page {paginated.currentPage} of {paginated.totalPages}
										</PaginationLink>
									</PaginationItem>

									<PaginationItem>
										<PaginationNext
											href="#recent-transactions"
											aria-disabled={!canNext}
											tabIndex={!canNext ? -1 : undefined}
											onClick={(e) => {
												e.preventDefault();
												if (canNext) {
													setPage((prev) =>
														Math.min(paginated.totalPages, prev + 1),
													);
												}
											}}
											className={cn(
												"h-8 rounded-xl font-mono text-xs cursor-pointer",
												!canNext && "pointer-events-none opacity-45",
											)}
										/>
									</PaginationItem>
								</PaginationContent>
							</Pagination>
						</div>
					</>
				)}
			</div>
		</div>
	);
}
