import { Plus, ReceiptText, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { MoneyValue } from "#/components/money-value";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "#/components/ui/card";
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
import { Tabs, TabsList, TabsTrigger } from "#/components/ui/tabs";
import { useFinly } from "#/context/finly-context";
import { paginateItems } from "#/lib/cashflow";
import { formatFriendlyDate } from "#/lib/format";
import { cn } from "#/lib/utils";

type LedgerFilterTab = "all" | "income" | "expenses";

const PAGE_SIZE = 10;

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

	// Wallet-scoped base transactions
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
		<Card className="shadow-neu-raised overflow-hidden rounded-2xl border border-zinc-100 bg-white py-0 dark:border-zinc-800 dark:bg-zinc-900">
			<CardHeader className="flex flex-col justify-between gap-4 border-b border-border/60 p-5 sm:flex-row sm:items-center sm:px-6">
				<div className="space-y-1">
					<CardTitle className="text-base font-bold">
						Recent Transactions
					</CardTitle>
					<CardDescription className="text-xs">
						Chronological cashflow ledger (10 records per page)
					</CardDescription>
				</div>

				{/* Filters: All, Income, Expenses via shadcn/ui Tabs (PRD v2.0.0 §3.4) */}
				<Tabs
					value={filterTab}
					onValueChange={(val) => {
						setFilterTab(val as LedgerFilterTab);
						setPage(1);
					}}
				>
					<TabsList className="shadow-neu-inset h-9 rounded-xl p-1 bg-zinc-100 dark:bg-zinc-800">
						<TabsTrigger
							value="all"
							className="rounded-lg px-3 text-xs font-semibold data-[state=active]:shadow-neu-sm data-[state=active]:bg-zinc-900 data-[state=active]:text-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-zinc-900"
						>
							All ({tabCounts.all})
						</TabsTrigger>
						<TabsTrigger
							value="income"
							className="rounded-lg px-3 text-xs font-semibold data-[state=active]:shadow-neu-sm data-[state=active]:bg-zinc-900 data-[state=active]:text-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-zinc-900"
						>
							{terminology.inflow} ({tabCounts.income})
						</TabsTrigger>
						<TabsTrigger
							value="expenses"
							className="rounded-lg px-3 text-xs font-semibold data-[state=active]:shadow-neu-sm data-[state=active]:bg-zinc-900 data-[state=active]:text-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-zinc-900"
						>
							{terminology.outflow} ({tabCounts.expenses})
						</TabsTrigger>
					</TabsList>
				</Tabs>
			</CardHeader>

			<CardContent className="p-0">
				{transactions.length === 0 ? (
					<div className="p-6">
						<Empty className="rounded-2xl border border-dashed border-border bg-muted/20 py-10">
							<EmptyHeader>
								<EmptyMedia variant="icon">
									<ReceiptText className="size-5 text-primary" />
								</EmptyMedia>
								<EmptyTitle className="text-base font-bold">
									No transactions recorded yet
								</EmptyTitle>
								<EmptyDescription className="text-xs">
									Record your first income or expense in USD to see your
									Safe-to-Spend allowance and cashflow trend.
								</EmptyDescription>
							</EmptyHeader>
							<EmptyContent>
								<Button
									type="button"
									onClick={() => openQuickEntry("money_in")}
									className="min-h-11 gap-2 rounded-xl px-5 font-bold"
								>
									<Plus className="size-4" />
									<span>Record Transaction</span>
								</Button>
							</EmptyContent>
						</Empty>
					</div>
				) : paginated.data.length === 0 ? (
					<div className="p-6">
						<Empty className="rounded-2xl border border-dashed border-border bg-muted/20 py-8">
							<EmptyHeader>
								<EmptyTitle className="text-sm font-bold">
									No matching transactions
								</EmptyTitle>
								<EmptyDescription className="text-xs">
									Switch tabs or clear the active wallet filter to view more
									records.
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
									className="rounded-xl font-semibold"
								>
									Show All Transactions
								</Button>
							</EmptyContent>
						</Empty>
					</div>
				) : (
					<>
						<Table>
							<TableHeader className="bg-muted/35">
								<TableRow>
									<TableHead className="pl-5 text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:pl-6">
										Transaction / Note
									</TableHead>
									<TableHead className="hidden text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:table-cell">
										Category
									</TableHead>
									<TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
										Date
									</TableHead>
									<TableHead className="hidden text-xs font-semibold uppercase tracking-wider text-muted-foreground md:table-cell">
										Wallet
									</TableHead>
									<TableHead className="text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
										Amount (USD)
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

									return (
										<TableRow
											key={tx.id}
											className="group hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
										>
											<TableCell className="pl-5 sm:pl-6">
												<p className="max-w-44 truncate text-sm font-medium text-foreground sm:max-w-xs">
													{tx.note || tx.category}
												</p>
												<p className="text-xs text-muted-foreground sm:hidden">
													{tx.category} · {walletName}
												</p>
											</TableCell>
											<TableCell className="hidden sm:table-cell">
												<Badge
													variant="secondary"
													className="rounded-md font-medium"
												>
													{tx.category}
												</Badge>
											</TableCell>
											<TableCell className="text-xs text-muted-foreground tabular-nums">
												{formatFriendlyDate(tx.date, todayISO)}
											</TableCell>
											<TableCell className="hidden text-xs text-muted-foreground md:table-cell">
												{walletName}
											</TableCell>
											<TableCell className="text-right">
												<MoneyValue
													amount={tx.amount}
													signedType={tx.type}
													className="text-sm font-bold text-foreground tabular-nums"
												/>
											</TableCell>
											<TableCell className="pr-4 text-right sm:pr-5">
												<Button
													type="button"
													variant="ghost"
													size="icon-xs"
													onClick={() => deleteTransaction(tx.id)}
													aria-label={`Delete ${tx.note || tx.category}`}
													className="text-muted-foreground opacity-70 hover:text-destructive sm:opacity-0 sm:group-hover:opacity-100 focus-visible:opacity-100"
												>
													<Trash2 className="size-3.5" />
												</Button>
											</TableCell>
										</TableRow>
									);
								})}
							</TableBody>
						</Table>

						{/* Strict 10-Row Pagination Footer (PRD §4.4 & §8) */}
						<div className="flex flex-col items-center justify-between gap-3 border-t border-border/60 bg-muted/20 px-5 py-3.5 sm:flex-row sm:px-6">
							<p className="text-xs text-muted-foreground tabular-nums">
								Showing{" "}
								<strong className="font-semibold text-foreground">
									{rangeStart} - {rangeEnd}
								</strong>{" "}
								of{" "}
								<strong className="font-semibold text-foreground">
									{paginated.totalItems}
								</strong>{" "}
								transactions
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
												"h-8 rounded-lg text-xs cursor-pointer",
												!canPrev && "pointer-events-none opacity-50",
											)}
										/>
									</PaginationItem>

									<PaginationItem>
										<PaginationLink
											href="#recent-transactions"
											isActive
											size="default"
											onClick={(e) => e.preventDefault()}
											className="h-8 cursor-default rounded-lg px-3 text-xs font-semibold tabular-nums"
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
												"h-8 rounded-lg text-xs cursor-pointer",
												!canNext && "pointer-events-none opacity-50",
											)}
										/>
									</PaginationItem>
								</PaginationContent>
							</Pagination>
						</div>
					</>
				)}
			</CardContent>
		</Card>
	);
}
