import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
	ArrowDownRight,
	ArrowUpRight,
	Download,
	FilterX,
	Plus,
	ReceiptText,
	Search,
	Trash2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
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
import { Input } from "#/components/ui/input";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "#/components/ui/pagination";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "#/components/ui/table";
import { useFinly } from "#/context/finly-context";
import { calculateMonthlySummary, paginateItems } from "#/lib/cashflow";
import { formatFriendlyDate } from "#/lib/format";
import { cn } from "#/lib/utils";
import type { TransactionType } from "#/types/finly";

export interface HistorySearchParams {
	q?: string;
	category?: string;
	sort?: "recent" | "largest";
}

const PAGE_SIZE = 10;

export const Route = createFileRoute("/history")({
	validateSearch: (search: Record<string, unknown>): HistorySearchParams => ({
		q: typeof search.q === "string" && search.q.trim() ? search.q : undefined,
		category:
			typeof search.category === "string" && search.category.trim()
				? search.category
				: undefined,
		sort:
			search.sort === "largest" || search.sort === "recent"
				? search.sort
				: undefined,
	}),
	component: HistoryScreen,
});

function HistoryScreen() {
	const searchParams = Route.useSearch();
	const navigate = useNavigate({ from: Route.fullPath });
	const {
		transactions,
		wallets,
		todayISO,
		terminology,
		openQuickEntry,
		deleteTransaction,
		exportCsv,
	} = useFinly();

	const [query, setQuery] = useState(searchParams.q ?? "");
	const [typeFilter, setTypeFilter] = useState<"all" | TransactionType>(
		searchParams.sort === "largest" ? "money_out" : "all",
	);
	const [walletFilter, setWalletFilter] = useState<string>("all");
	const [categoryFilter, setCategoryFilter] = useState<string>(
		searchParams.category ?? "all",
	);
	const [sortMode, setSortMode] = useState<"recent" | "largest">(
		searchParams.sort ?? "recent",
	);
	const [page, setPage] = useState<number>(1);

	useEffect(() => {
		setQuery(searchParams.q ?? "");
		if (searchParams.category) {
			setCategoryFilter(searchParams.category);
		}
		if (searchParams.sort === "largest") {
			setSortMode("largest");
			setTypeFilter("money_out");
		}
		setPage(1);
	}, [searchParams.category, searchParams.q, searchParams.sort]);

	const walletNameById = useMemo(
		() => new Map(wallets.map((w) => [w.id, w.name])),
		[wallets],
	);

	const monthlySummary = useMemo(
		() => calculateMonthlySummary(transactions, todayISO, walletFilter),
		[todayISO, transactions, walletFilter],
	);

	const allCategories = useMemo(() => {
		const unique = new Set<string>();
		for (const tx of transactions) {
			unique.add(tx.category);
		}
		return Array.from(unique).sort();
	}, [transactions]);

	const filteredTransactions = useMemo(() => {
		const normalizedQuery = query.trim().toLowerCase();

		const list = transactions.filter((tx) => {
			if (typeFilter !== "all" && tx.type !== typeFilter) return false;
			if (walletFilter !== "all" && tx.walletId !== walletFilter) return false;
			if (categoryFilter !== "all" && tx.category !== categoryFilter) {
				return false;
			}
			if (normalizedQuery) {
				const haystack =
					`${tx.category} ${tx.note ?? ""} ${tx.date} ${tx.amount}`.toLowerCase();
				if (!haystack.includes(normalizedQuery)) return false;
			}
			return true;
		});

		if (sortMode === "largest") {
			return [...list].sort((a, b) => b.amount - a.amount);
		}
		return list;
	}, [categoryFilter, query, sortMode, transactions, typeFilter, walletFilter]);

	const paginated = useMemo(
		() => paginateItems(filteredTransactions, page, PAGE_SIZE),
		[filteredTransactions, page],
	);

	const filteredStats = useMemo(() => {
		let totalIn = 0;
		let totalOut = 0;
		for (const tx of filteredTransactions) {
			if (tx.type === "money_in") totalIn += tx.amount;
			else totalOut += tx.amount;
		}
		return {
			totalIn,
			totalOut,
			net: totalIn - totalOut,
		};
	}, [filteredTransactions]);

	const hasActiveFilters =
		query.trim().length > 0 ||
		typeFilter !== "all" ||
		walletFilter !== "all" ||
		categoryFilter !== "all" ||
		sortMode !== "recent";

	const resetAllFilters = () => {
		setQuery("");
		setTypeFilter("all");
		setWalletFilter("all");
		setCategoryFilter("all");
		setSortMode("recent");
		setPage(1);
		void navigate({
			search: { q: undefined, category: undefined, sort: undefined },
			replace: true,
		});
	};

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
		<div className="space-y-6">
			{/* Page Header */}
			<div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
				<div className="space-y-1">
					<h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
						Activity History
					</h1>
					<p className="text-xs text-muted-foreground sm:text-sm">
						Search, filter, and export every USD{" "}
						{terminology.inflow.toLowerCase()} &amp;{" "}
						{terminology.outflow.toLowerCase()} entry.
					</p>
				</div>

				<div className="flex flex-wrap items-center gap-2">
					<Button
						type="button"
						variant="outline"
						onClick={exportCsv}
						disabled={transactions.length === 0}
						className="min-h-10 gap-1.5 rounded-xl font-semibold"
					>
						<Download className="size-4" />
						<span>Export CSV</span>
					</Button>
					<Button
						type="button"
						onClick={() => openQuickEntry("money_out")}
						className="min-h-10 gap-1.5 rounded-xl px-4 font-bold"
					>
						<Plus className="size-4 stroke-[2.5]" />
						<span>Record Transaction</span>
					</Button>
				</div>
			</div>

			{/* Largest Spending Categories Breakdown */}
			{monthlySummary.topOutflowCategories.length > 0 && (
				<Card className="shadow-neu-raised rounded-2xl border border-zinc-100 bg-white py-4 dark:border-zinc-800 dark:bg-zinc-900">
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-bold">
							Top {terminology.outflow} Categories (This Month)
						</CardTitle>
						<CardDescription className="text-xs">
							Select a category pill to filter the ledger below
						</CardDescription>
					</CardHeader>
					<CardContent className="flex flex-wrap gap-2 pt-1">
						{monthlySummary.topOutflowCategories.slice(0, 6).map((cat) => {
							const active = categoryFilter === cat.category;
							return (
								<button
									key={cat.category}
									type="button"
									onClick={() => {
										if (active) {
											setCategoryFilter("all");
										} else {
											setCategoryFilter(cat.category);
											setTypeFilter("money_out");
										}
										setPage(1);
									}}
									className={cn(
										"flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs transition-colors cursor-pointer",
										active
											? "border-zinc-900 bg-zinc-900 font-bold text-white shadow-neu-sm dark:border-white dark:bg-white dark:text-zinc-900"
											: "border-zinc-200 bg-zinc-50 text-foreground hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800/50 dark:hover:bg-zinc-800",
									)}
								>
									<span className="font-semibold">{cat.category}</span>
									<MoneyValue
										amount={cat.amount}
										className={cn(
											"font-bold tabular-nums",
											active
												? "text-white dark:text-zinc-900"
												: "text-foreground",
										)}
									/>
									<span
										className={cn(
											"rounded-md px-1.5 py-0.5 text-[10px] font-bold tabular-nums",
											active
												? "bg-white/20 text-white dark:bg-black/20 dark:text-zinc-900"
												: "bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300",
										)}
									>
										{cat.percentage}%
									</span>
								</button>
							);
						})}
					</CardContent>
				</Card>
			)}

			{/* Filter Controls */}
			<Card className="shadow-neu-raised rounded-2xl border border-zinc-100 bg-white py-4 dark:border-zinc-800 dark:bg-zinc-900">
				<CardContent className="space-y-3">
					<div className="grid gap-3 md:grid-cols-12">
						<div className="relative md:col-span-5">
							<Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
							<Input
								placeholder="Search notes, categories, or USD amounts..."
								value={query}
								onChange={(e) => {
									setQuery(e.target.value);
									setPage(1);
								}}
								className="h-10 rounded-xl bg-background pl-9 text-xs sm:text-sm"
							/>
						</div>

						<div className="md:col-span-3">
							<Select
								value={walletFilter}
								onValueChange={(val) => {
									setWalletFilter(val);
									setPage(1);
								}}
							>
								<SelectTrigger
									aria-label="Filter by wallet"
									className="h-10 w-full rounded-xl bg-background text-xs"
								>
									<SelectValue placeholder="All Wallets" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Wallets</SelectItem>
									{wallets.map((w) => (
										<SelectItem key={w.id} value={w.id}>
											{w.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="md:col-span-2">
							<Select
								value={categoryFilter}
								onValueChange={(val) => {
									setCategoryFilter(val);
									setPage(1);
								}}
							>
								<SelectTrigger
									aria-label="Filter by category"
									className="h-10 w-full rounded-xl bg-background text-xs"
								>
									<SelectValue placeholder="All Categories" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Categories</SelectItem>
									{allCategories.map((cat) => (
										<SelectItem key={cat} value={cat}>
											{cat}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="md:col-span-2">
							<Select
								value={sortMode}
								onValueChange={(val) => {
									setSortMode(val as "recent" | "largest");
									setPage(1);
								}}
							>
								<SelectTrigger
									aria-label="Sort transactions"
									className="h-10 w-full rounded-xl bg-background text-xs"
								>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="recent">Most Recent</SelectItem>
									<SelectItem value="largest">Largest Amount</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>

					<div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/70 pt-3">
						<div className="shadow-neu-inset flex flex-wrap items-center gap-1 rounded-xl bg-zinc-100 p-1 dark:bg-zinc-800">
							{(
								[
									{ id: "all", label: "All" },
									{ id: "money_in", label: terminology.inflow },
									{ id: "money_out", label: terminology.outflow },
								] as const
							).map((item) => (
								<button
									key={item.id}
									type="button"
									onClick={() => {
										setTypeFilter(item.id);
										setPage(1);
									}}
									className={cn(
										"rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer",
										typeFilter === item.id
											? "shadow-neu-sm bg-zinc-900 font-bold text-white dark:bg-white dark:text-zinc-900"
											: "text-muted-foreground hover:text-foreground",
									)}
								>
									{item.label}
								</button>
							))}

							{hasActiveFilters && (
								<Button
									type="button"
									variant="ghost"
									size="xs"
									onClick={resetAllFilters}
									className="gap-1 rounded-lg text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
								>
									<FilterX className="size-3.5" />
									<span>Reset</span>
								</Button>
							)}
						</div>

						<div className="flex flex-wrap items-center gap-4 text-xs tabular-nums">
							<span className="text-muted-foreground">
								{terminology.inflow}:{" "}
								<strong className="text-foreground">
									<MoneyValue amount={filteredStats.totalIn} />
								</strong>
							</span>
							<span className="text-muted-foreground">
								{terminology.outflow}:{" "}
								<strong className="text-foreground">
									<MoneyValue amount={filteredStats.totalOut} />
								</strong>
							</span>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Paginated Ledger Table */}
			<Card className="shadow-neu-raised overflow-hidden rounded-2xl border border-zinc-100 bg-white py-0 dark:border-zinc-800 dark:bg-zinc-900">
				<CardContent className="p-0">
					{paginated.data.length === 0 ? (
						<div className="p-6">
							<Empty className="rounded-2xl border border-dashed border-border bg-muted/20 py-10">
								<EmptyHeader>
									<EmptyMedia variant="icon">
										<ReceiptText className="size-5 text-primary" />
									</EmptyMedia>
									<EmptyTitle className="text-base font-bold">
										{transactions.length === 0
											? "Your ledger is empty"
											: "No matching transactions"}
									</EmptyTitle>
									<EmptyDescription className="text-xs">
										{transactions.length === 0
											? "Record your first income or expense in USD to populate your cashflow history."
											: "Try broadening your search terms or clearing active filters."}
									</EmptyDescription>
								</EmptyHeader>
								<EmptyContent>
									{transactions.length === 0 ? (
										<Button
											type="button"
											onClick={() => openQuickEntry("money_in")}
											className="min-h-11 gap-2 rounded-xl px-5 font-bold"
										>
											<Plus className="size-4" />
											<span>Record First Transaction</span>
										</Button>
									) : (
										<Button
											type="button"
											variant="outline"
											onClick={resetAllFilters}
											className="min-h-10 rounded-xl font-semibold cursor-pointer"
										>
											Clear All Filters
										</Button>
									)}
								</EmptyContent>
							</Empty>
						</div>
					) : (
						<>
							<Table>
								<TableHeader className="bg-muted/40">
									<TableRow>
										<TableHead className="pl-5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
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
										<TableHead className="w-12 pr-4 text-right">
											<span className="sr-only">Actions</span>
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{paginated.data.map((tx) => {
										const isInflow = tx.type === "money_in";
										return (
											<TableRow key={tx.id}>
												<TableCell className="pl-5">
													<div className="flex items-center gap-2.5">
														<span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-foreground dark:bg-zinc-800">
															{isInflow ? (
																<ArrowUpRight className="size-4" />
															) : (
																<ArrowDownRight className="size-4" />
															)}
														</span>
														<div className="min-w-0">
															<p className="max-w-xs truncate text-sm font-medium text-foreground">
																{tx.note || tx.category}
															</p>
															<p className="text-xs text-muted-foreground sm:hidden">
																{tx.category}
															</p>
														</div>
													</div>
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
													<div>{formatFriendlyDate(tx.date, todayISO)}</div>
													<div className="text-[11px] opacity-75">
														{tx.date}
													</div>
												</TableCell>
												<TableCell className="hidden text-xs text-muted-foreground md:table-cell">
													{walletNameById.get(tx.walletId) ?? "Checking"}
												</TableCell>
												<TableCell className="text-right">
													<MoneyValue
														amount={tx.amount}
														signedType={tx.type}
														className="text-sm font-bold text-foreground tabular-nums font-mono"
													/>
												</TableCell>
												<TableCell className="pr-4 text-right">
													<Button
														type="button"
														variant="ghost"
														size="icon-sm"
														onClick={() => deleteTransaction(tx.id)}
														aria-label={`Delete ${tx.note || tx.category}`}
														className="text-muted-foreground hover:text-destructive cursor-pointer"
													>
														<Trash2 className="size-3.5" />
													</Button>
												</TableCell>
											</TableRow>
										);
									})}
								</TableBody>
							</Table>

							{/* 10-Row Pagination Footer */}
							<div className="flex flex-col items-center justify-between gap-3 border-t border-border/60 bg-muted/20 px-5 py-3.5 sm:flex-row">
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
												href="#history-table"
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
												href="#history-table"
												isActive
												size="default"
												onClick={(e) => e.preventDefault()}
												className="shadow-neu-sm h-8 cursor-default rounded-lg bg-zinc-900 px-3 text-xs font-bold text-white tabular-nums dark:bg-white dark:text-zinc-900"
											>
												Page {paginated.currentPage} of {paginated.totalPages}
											</PaginationLink>
										</PaginationItem>

										<PaginationItem>
											<PaginationNext
												href="#history-table"
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
		</div>
	);
}
