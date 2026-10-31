import { useNavigate } from "@tanstack/react-router";
import {
	ArrowDownRight,
	ArrowUpRight,
	FileText,
	Plus,
	Search,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { MoneyValue } from "#/components/money-value";
import { Badge } from "#/components/ui/badge";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "#/components/ui/dialog";
import { Input } from "#/components/ui/input";
import { useFinly } from "#/context/finly-context";
import { formatFriendlyDate } from "#/lib/format";

interface CommandSearchDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function CommandSearchDialog({
	open,
	onOpenChange,
}: CommandSearchDialogProps) {
	const {
		transactions,
		invoices,
		todayISO,
		isInvoicingVisible,
		openQuickEntry,
	} = useFinly();
	const navigate = useNavigate();
	const [query, setQuery] = useState("");

	useEffect(() => {
		if (!open) setQuery("");
	}, [open]);

	// Global keyboard shortcut: Cmd/Ctrl + K
	useEffect(() => {
		const onKeyDown = (event: KeyboardEvent) => {
			if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
				event.preventDefault();
				onOpenChange(!open);
			}
		};
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [onOpenChange, open]);

	const normalizedQuery = query.trim().toLowerCase();

	const matchingTransactions = useMemo(() => {
		if (!normalizedQuery) return transactions.slice(0, 5);
		return transactions
			.filter(
				(tx) =>
					tx.category.toLowerCase().includes(normalizedQuery) ||
					(tx.note ?? "").toLowerCase().includes(normalizedQuery) ||
					String(tx.amount).includes(normalizedQuery),
			)
			.slice(0, 6);
	}, [normalizedQuery, transactions]);

	const matchingInvoices = useMemo(() => {
		if (!isInvoicingVisible) return [];
		if (!normalizedQuery) return invoices.slice(0, 3);
		return invoices
			.filter(
				(inv) =>
					inv.clientName.toLowerCase().includes(normalizedQuery) ||
					inv.invoiceNumber.toLowerCase().includes(normalizedQuery) ||
					(inv.projectTitle ?? "").toLowerCase().includes(normalizedQuery),
			)
			.slice(0, 5);
	}, [invoices, isInvoicingVisible, normalizedQuery]);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="rounded-2xl border-border bg-card p-0 shadow-2xl sm:max-w-lg overflow-hidden">
				<DialogHeader className="sr-only">
					<DialogTitle>Search Workspace</DialogTitle>
					<DialogDescription>
						Search transactions, categories, clients, and invoices
					</DialogDescription>
				</DialogHeader>

				<div className="flex items-center gap-2.5 border-b border-border px-4 py-3">
					<Search className="size-4 shrink-0 text-muted-foreground" />
					<Input
						placeholder="Search transactions, clients, notes..."
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						className="h-8 border-0 bg-transparent px-0 text-sm shadow-none focus-visible:ring-0"
					/>
				</div>

				<div className="max-h-[65vh] overflow-y-auto p-3 space-y-4">
					{/* Quick Action */}
					<div>
						<p className="px-2 pb-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
							Quick Actions
						</p>
						<button
							type="button"
							onClick={() => {
								onOpenChange(false);
								openQuickEntry("money_out");
							}}
							className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-xs font-semibold text-foreground hover:bg-secondary cursor-pointer"
						>
							<span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
								<Plus className="size-4" />
							</span>
							<span>Record New Transaction (3-Tap Entry)</span>
						</button>
					</div>

					{/* Transactions */}
					<div>
						<p className="px-2 pb-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
							Transactions ({matchingTransactions.length})
						</p>
						{matchingTransactions.length === 0 ? (
							<p className="px-2 py-3 text-xs text-muted-foreground">
								No matching transactions found.
							</p>
						) : (
							<div className="space-y-1">
								{matchingTransactions.map((tx) => (
									<button
										key={tx.id}
										type="button"
										onClick={() => {
											onOpenChange(false);
											void navigate({
												to: "/history",
												search: { q: query || undefined, category: undefined },
											});
										}}
										className="flex w-full items-center justify-between gap-3 rounded-xl px-2.5 py-2 text-left hover:bg-secondary cursor-pointer"
									>
										<div className="flex min-w-0 items-center gap-2.5">
											<span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-foreground dark:bg-zinc-800">
												{tx.type === "money_in" ? (
													<ArrowUpRight className="size-3.5" />
												) : (
													<ArrowDownRight className="size-3.5" />
												)}
											</span>
											<div className="min-w-0">
												<p className="truncate text-xs font-semibold text-foreground">
													{tx.note || tx.category}
												</p>
												<p className="text-[11px] text-muted-foreground">
													{tx.category} ·{" "}
													{formatFriendlyDate(tx.date, todayISO)}
												</p>
											</div>
										</div>
										<MoneyValue
											amount={tx.amount}
											signedType={tx.type}
											className="text-xs font-bold text-foreground shrink-0 tabular-nums font-mono"
										/>
									</button>
								))}
							</div>
						)}
					</div>

					{/* Invoices */}
					{isInvoicingVisible && (
						<div>
							<p className="px-2 pb-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
								Invoices ({matchingInvoices.length})
							</p>
							{matchingInvoices.length === 0 ? (
								<p className="px-2 py-2 text-xs text-muted-foreground">
									No matching invoices.
								</p>
							) : (
								<div className="space-y-1">
									{matchingInvoices.map((inv) => (
										<button
											key={inv.id}
											type="button"
											onClick={() => {
												onOpenChange(false);
												void navigate({ to: "/invoices" });
											}}
											className="flex w-full items-center justify-between gap-3 rounded-xl px-2.5 py-2 text-left hover:bg-secondary cursor-pointer"
										>
											<div className="flex min-w-0 items-center gap-2.5">
												<span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground">
													<FileText className="size-3.5" />
												</span>
												<div className="min-w-0">
													<p className="truncate text-xs font-semibold text-foreground">
														{inv.clientName}{" "}
														<span className="text-muted-foreground">
															#{inv.invoiceNumber}
														</span>
													</p>
													<p className="truncate text-[11px] text-muted-foreground">
														{inv.projectTitle || `Due ${inv.dueDate}`}
													</p>
												</div>
											</div>
											<div className="flex items-center gap-2 shrink-0">
												<Badge
													variant="outline"
													className="text-[10px] uppercase"
												>
													{inv.status}
												</Badge>
												<MoneyValue
													amount={inv.totalAmount}
													className="text-xs font-bold text-foreground"
												/>
											</div>
										</button>
									))}
								</div>
							)}
						</div>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
