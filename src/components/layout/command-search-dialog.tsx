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
import { cn } from "#/lib/utils";

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
			<DialogContent className="overflow-hidden rounded-3xl border-border bg-popover p-0 shadow-2xl sm:max-w-lg">
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
						className="h-8 border-0 bg-transparent px-0 font-mono text-xs shadow-none focus-visible:ring-0 sm:text-sm"
					/>
				</div>

				<div className="max-h-[65vh] space-y-4 overflow-y-auto p-3">
					{/* Quick Action */}
					<div>
						<p className="px-2 pb-1.5 font-mono text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
							Quick Actions
						</p>
						<button
							type="button"
							onClick={() => {
								onOpenChange(false);
								openQuickEntry("money_out");
							}}
							className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left font-mono text-xs font-bold text-foreground transition-colors hover:bg-secondary cursor-pointer"
						>
							<span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
								<Plus className="size-4 stroke-[2.5]" />
							</span>
							<span>Record New Transaction</span>
						</button>
					</div>

					{/* Transactions */}
					<div>
						<p className="px-2 pb-1.5 font-mono text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
							Transactions ({matchingTransactions.length})
						</p>
						{matchingTransactions.length === 0 ? (
							<p className="px-2 py-3 font-mono text-xs text-muted-foreground">
								No matching transactions found.
							</p>
						) : (
							<div className="space-y-1">
								{matchingTransactions.map((tx) => {
									const isInflow = tx.type === "money_in";
									return (
										<button
											key={tx.id}
											type="button"
											onClick={() => {
												onOpenChange(false);
												void navigate({
													to: "/history",
													search: {
														q: query || undefined,
														category: undefined,
													},
												});
											}}
											className="flex w-full items-center justify-between gap-3 rounded-xl px-2.5 py-2 text-left transition-colors hover:bg-secondary cursor-pointer"
										>
											<div className="flex min-w-0 items-center gap-2.5">
												<span
													className={cn(
														"flex size-7 shrink-0 items-center justify-center rounded-lg",
														isInflow
															? "bg-inflow-bg text-inflow"
															: "bg-outflow-bg text-outflow",
													)}
												>
													{isInflow ? (
														<ArrowUpRight className="size-3.5" />
													) : (
														<ArrowDownRight className="size-3.5" />
													)}
												</span>
												<div className="min-w-0">
													<p className="truncate font-mono text-xs font-semibold text-foreground">
														{tx.note || tx.category}
													</p>
													<p className="font-mono text-[11px] text-muted-foreground">
														{tx.category} ·{" "}
														{formatFriendlyDate(tx.date, todayISO)}
													</p>
												</div>
											</div>
											<MoneyValue
												amount={tx.amount}
												signedType={tx.type}
												className={cn(
													"shrink-0 font-mono text-xs font-extrabold tabular-nums",
													isInflow ? "text-inflow" : "text-outflow",
												)}
											/>
										</button>
									);
								})}
							</div>
						)}
					</div>

					{/* Invoices */}
					{isInvoicingVisible && (
						<div>
							<p className="px-2 pb-1.5 font-mono text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
								Invoices ({matchingInvoices.length})
							</p>
							{matchingInvoices.length === 0 ? (
								<p className="px-2 py-2 font-mono text-xs text-muted-foreground">
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
											className="flex w-full items-center justify-between gap-3 rounded-xl px-2.5 py-2 text-left transition-colors hover:bg-secondary cursor-pointer"
										>
											<div className="flex min-w-0 items-center gap-2.5">
												<span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-info-bg text-info">
													<FileText className="size-3.5" />
												</span>
												<div className="min-w-0">
													<p className="truncate font-mono text-xs font-semibold text-foreground">
														{inv.clientName}{" "}
														<span className="text-muted-foreground">
															#{inv.invoiceNumber}
														</span>
													</p>
													<p className="truncate font-mono text-[11px] text-muted-foreground">
														{inv.projectTitle || `Due ${inv.dueDate}`}
													</p>
												</div>
											</div>
											<div className="flex shrink-0 items-center gap-2">
												<Badge
													variant="outline"
													className="font-mono text-[10px] uppercase"
												>
													{inv.status}
												</Badge>
												<MoneyValue
													amount={inv.totalAmount}
													className="font-mono text-xs font-bold text-foreground"
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
