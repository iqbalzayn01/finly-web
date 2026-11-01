import { createFileRoute } from "@tanstack/react-router";
import {
	CheckCircle2,
	Clock,
	Eye,
	FileText,
	MessageCircle,
	Plus,
	Search,
	Trash2,
	TriangleAlert,
} from "lucide-react";
import { useMemo, useState } from "react";
import { CreateInvoiceModal } from "#/components/invoices/create-invoice-modal";
import {
	buildWhatsAppInvoiceUrl,
	InvoicePreviewDialog,
} from "#/components/invoices/invoice-preview-dialog";
import { SettleInvoiceDialog } from "#/components/invoices/settle-invoice-dialog";
import { MoneyValue } from "#/components/money-value";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { Card, CardContent } from "#/components/ui/card";
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
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "#/components/ui/table";
import { useFinly } from "#/context/finly-context";
import { calculateInvoiceSummary } from "#/lib/cashflow";
import { formatRelativeDueDate } from "#/lib/format";
import { cn } from "#/lib/utils";
import type { Invoice, InvoiceStatus } from "#/types/finly";

export const Route = createFileRoute("/invoices")({
	component: InvoicesScreen,
});

type FilterTab = "all" | InvoiceStatus;

function renderInvoiceStatusBadge(status: InvoiceStatus) {
	switch (status) {
		case "draft":
			return (
				<Badge
					variant="outline"
					className="rounded-md border-zinc-300 bg-zinc-100 text-[10px] font-bold uppercase text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400"
				>
					Draft
				</Badge>
			);
		case "sent":
			return (
				<Badge
					variant="outline"
					className="rounded-md border-zinc-300 bg-zinc-50 text-[10px] font-bold uppercase text-foreground dark:border-zinc-700 dark:bg-zinc-900"
				>
					Sent
				</Badge>
			);
		case "overdue":
			return (
				<Badge
					variant="outline"
					className="gap-1 rounded-md border-zinc-400 bg-zinc-100 text-[10px] font-bold uppercase text-foreground dark:border-zinc-600 dark:bg-zinc-800"
				>
					<span className="size-1.5 rounded-full bg-foreground animate-pulse" />
					<span>Overdue</span>
				</Badge>
			);
		case "paid":
			return (
				<Badge
					variant="default"
					className="rounded-md bg-zinc-900 text-[10px] font-bold uppercase text-white dark:bg-white dark:text-zinc-900"
				>
					Paid
				</Badge>
			);
	}
}

function InvoicesScreen() {
	const { profile, invoices, todayISO, deleteInvoice } = useFinly();

	const [statusTab, setStatusTab] = useState<FilterTab>("all");
	const [query, setQuery] = useState("");
	const [createModalOpen, setCreateModalOpen] = useState(false);
	const [invoiceToSettle, setInvoiceToSettle] = useState<Invoice | null>(null);
	const [invoiceToPreview, setInvoiceToPreview] = useState<Invoice | null>(
		null,
	);

	const summary = useMemo(
		() => calculateInvoiceSummary(invoices, todayISO),
		[invoices, todayISO],
	);

	const countsByStatus = useMemo(() => {
		const counts: Record<FilterTab, number> = {
			all: invoices.length,
			sent: 0,
			overdue: 0,
			paid: 0,
			draft: 0,
		};
		for (const inv of invoices) {
			counts[inv.status] += 1;
		}
		return counts;
	}, [invoices]);

	const filteredInvoices = useMemo(() => {
		const normalizedQuery = query.trim().toLowerCase();
		return invoices.filter((inv) => {
			if (statusTab !== "all" && inv.status !== statusTab) return false;
			if (normalizedQuery) {
				const haystack =
					`${inv.clientName} ${inv.invoiceNumber} ${inv.projectTitle ?? ""}`.toLowerCase();
				if (!haystack.includes(normalizedQuery)) return false;
			}
			return true;
		});
	}, [invoices, query, statusTab]);

	const handleWhatsAppShare = (invoice: Invoice) => {
		const url = buildWhatsAppInvoiceUrl(
			invoice,
			profile.currency,
			profile.businessName || profile.displayName,
		);
		window.open(url, "_blank", "noopener,noreferrer");
	};

	const filterTabs: Array<{ id: FilterTab; label: string }> = [
		{ id: "all", label: "All" },
		{ id: "sent", label: "Sent" },
		{ id: "overdue", label: "Overdue" },
		{ id: "paid", label: "Paid" },
		{ id: "draft", label: "Drafts" },
	];

	return (
		<div className="space-y-6">
			{/* Page Header */}
			<div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
				<div className="space-y-1">
					<h1 className="font-mono text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
						Invoices &amp; Receivables
					</h1>
					<p className="text-xs text-muted-foreground sm:text-sm">
						Issue client bills, track payment statuses, and deposit settled
						funds directly into cashflow.
					</p>
				</div>

				<Button
					type="button"
					onClick={() => setCreateModalOpen(true)}
					className="min-h-11 gap-2 rounded-xl font-mono font-bold shadow-neu-sm"
				>
					<Plus className="size-4 stroke-[2.5]" />
					<span>Create New Invoice</span>
				</Button>
			</div>

			{/* 3 Top Receivables KPI Cards (PRD v2.0.0 §4) */}
			<div className="grid gap-4 sm:grid-cols-3">
				<Card className="shadow-neu-raised rounded-2xl border border-zinc-100 bg-white py-0 dark:border-zinc-800 dark:bg-zinc-900">
					<CardContent className="flex items-start justify-between gap-3 p-5">
						<div className="space-y-1">
							<p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
								WAITING TO BE PAID
							</p>
							<MoneyValue
								amount={summary.waitingAmount}
								className="text-2xl font-extrabold tracking-tight text-foreground"
							/>
							<p className="text-xs text-muted-foreground">
								{summary.waitingCount} Invoices Pending
							</p>
						</div>
						<span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-foreground dark:bg-zinc-800">
							<Clock className="size-5" />
						</span>
					</CardContent>
				</Card>

				<Card className="shadow-neu-raised rounded-2xl border border-zinc-100 bg-white py-0 dark:border-zinc-800 dark:bg-zinc-900">
					<CardContent className="flex items-start justify-between gap-3 p-5">
						<div className="space-y-1">
							<p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
								OVERDUE
							</p>
							<MoneyValue
								amount={summary.overdueAmount}
								className="text-2xl font-extrabold tracking-tight text-foreground"
							/>
							<p className="text-xs text-muted-foreground">
								{summary.overdueCount}{" "}
								{summary.overdueCount === 1 ? "Invoice" : "Invoices"} Overdue
							</p>
						</div>
						<span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-foreground dark:bg-zinc-800">
							<TriangleAlert className="size-5" />
						</span>
					</CardContent>
				</Card>

				<Card className="shadow-neu-raised rounded-2xl border border-zinc-100 bg-white py-0 dark:border-zinc-800 dark:bg-zinc-900">
					<CardContent className="flex items-start justify-between gap-3 p-5">
						<div className="space-y-1">
							<p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
								PAID THIS MONTH
							</p>
							<MoneyValue
								amount={summary.collectedThisMonthAmount}
								className="text-2xl font-extrabold tracking-tight text-foreground"
							/>
							<p className="text-xs text-muted-foreground">
								{summary.collectedThisMonthCount}{" "}
								{summary.collectedThisMonthCount === 1 ? "Invoice" : "Invoices"}{" "}
								Collected
							</p>
						</div>
						<span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-foreground dark:bg-zinc-800">
							<CheckCircle2 className="size-5" />
						</span>
					</CardContent>
				</Card>
			</div>

			{/* Filter Bar: Status Tabs + Client Search */}
			<div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
				<div
					role="tablist"
					aria-label="Filter invoices by status"
					className="shadow-neu-inset flex flex-wrap items-center gap-1 rounded-xl bg-zinc-100 p-1 dark:bg-zinc-800"
				>
					{filterTabs.map((tab) => {
						const active = statusTab === tab.id;
						return (
							<button
								key={tab.id}
								type="button"
								role="tab"
								aria-selected={active}
								onClick={() => setStatusTab(tab.id)}
								className={cn(
									"inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-mono text-xs font-semibold transition-colors cursor-pointer",
									active
										? "shadow-neu-sm bg-zinc-900 font-bold text-white dark:bg-white dark:text-zinc-900"
										: "text-muted-foreground hover:text-foreground",
								)}
							>
								<span>{tab.label}</span>
								<span
									className={cn(
										"rounded-md px-1.5 py-0.2 text-[10px] tabular-nums",
										active
											? "bg-white/20 text-white dark:bg-black/20 dark:text-zinc-900"
											: "bg-muted text-muted-foreground",
									)}
								>
									{countsByStatus[tab.id]}
								</span>
							</button>
						);
					})}
				</div>

				<div className="relative w-full sm:w-64">
					<Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						placeholder="Search client or #INV..."
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						className="h-10 rounded-xl bg-card pl-9 text-xs"
					/>
				</div>
			</div>

			{/* Invoices Status Board */}
			<Card className="shadow-neu-raised overflow-hidden rounded-2xl border border-zinc-100 bg-white py-0 dark:border-zinc-800 dark:bg-zinc-900">
				<CardContent className="p-0">
					{filteredInvoices.length === 0 ? (
						<div className="p-6">
							<Empty className="rounded-2xl border border-dashed border-border bg-muted/20 py-10">
								<EmptyHeader>
									<EmptyMedia variant="icon">
										<FileText className="size-5 text-primary" />
									</EmptyMedia>
									<EmptyTitle className="text-base font-bold">
										{invoices.length === 0
											? "No invoices created yet"
											: "No invoices match this filter"}
									</EmptyTitle>
									<EmptyDescription className="text-xs">
										Create a clean, printable client invoice in seconds and sync
										its payment straight into your cashflow balance.
									</EmptyDescription>
								</EmptyHeader>
								<EmptyContent>
									<Button
										type="button"
										onClick={() => setCreateModalOpen(true)}
										className="min-h-11 gap-2 rounded-xl px-5 font-bold"
									>
										<Plus className="size-4" />
										<span>Create First Invoice</span>
									</Button>
								</EmptyContent>
							</Empty>
						</div>
					) : (
						<>
							{/* Desktop Table */}
							<div className="hidden md:block">
								<Table>
									<TableHeader className="bg-muted/40">
										<TableRow>
											<TableHead className="pl-5 text-xs font-semibold">
												Client &amp; Project
											</TableHead>
											<TableHead className="text-xs font-semibold">
												Invoice #
											</TableHead>
											<TableHead className="text-right text-xs font-semibold">
												Amount
											</TableHead>
											<TableHead className="text-xs font-semibold">
												Due Date
											</TableHead>
											<TableHead className="text-xs font-semibold">
												Status
											</TableHead>
											<TableHead className="pr-5 text-right text-xs font-semibold">
												Actions
											</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{filteredInvoices.map((inv) => {
											const isPaid = inv.status === "paid";
											return (
												<TableRow key={inv.id}>
													<TableCell className="pl-5">
														<p className="text-sm font-bold text-foreground">
															{inv.clientName}
														</p>
														<p className="text-xs text-muted-foreground">
															{inv.projectTitle ||
																`${inv.items.length} item(s)`}
														</p>
													</TableCell>
													<TableCell className="text-xs font-semibold text-foreground tabular-nums">
														#{inv.invoiceNumber}
													</TableCell>
													<TableCell className="text-right">
														<MoneyValue
															amount={inv.totalAmount}
															className="text-sm font-extrabold text-foreground"
														/>
													</TableCell>
													<TableCell>
														<p
															className={cn(
																"text-xs font-semibold",
																inv.status === "overdue"
																	? "text-amber-700 dark:text-amber-300"
																	: "text-foreground",
															)}
														>
															{formatRelativeDueDate(
																inv.dueDate,
																todayISO,
																isPaid,
															)}
														</p>
														<p className="text-[11px] text-muted-foreground tabular-nums">
															{inv.dueDate}
														</p>
													</TableCell>
													<TableCell>
														{renderInvoiceStatusBadge(inv.status)}
													</TableCell>
													<TableCell className="pr-5">
														<div className="flex items-center justify-end gap-1.5">
															{!isPaid && (
																<Button
																	type="button"
																	size="xs"
																	onClick={() => setInvoiceToSettle(inv)}
																	className="gap-1 rounded-lg bg-zinc-900 font-bold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 cursor-pointer"
																>
																	<CheckCircle2 className="size-3.5" />
																	<span>Mark as Paid</span>
																</Button>
															)}
															{!isPaid && (
																<Button
																	type="button"
																	size="xs"
																	variant="outline"
																	onClick={() => handleWhatsAppShare(inv)}
																	className="gap-1 rounded-lg font-semibold"
																>
																	<MessageCircle className="size-3.5" />
																	<span>
																		{inv.status === "overdue"
																			? "WhatsApp Ping"
																			: "Share"}
																	</span>
																</Button>
															)}
															<Button
																type="button"
																size="xs"
																variant="ghost"
																onClick={() => setInvoiceToPreview(inv)}
																aria-label={`Preview invoice ${inv.invoiceNumber}`}
																className="gap-1 rounded-lg text-muted-foreground hover:text-foreground"
															>
																<Eye className="size-3.5" />
																<span className="hidden lg:inline">
																	{isPaid ? "Receipt" : "Preview"}
																</span>
															</Button>
															<Button
																type="button"
																size="icon-xs"
																variant="ghost"
																onClick={() => deleteInvoice(inv.id)}
																aria-label={`Delete invoice ${inv.invoiceNumber}`}
																className="text-muted-foreground hover:text-destructive"
															>
																<Trash2 className="size-3.5" />
															</Button>
														</div>
													</TableCell>
												</TableRow>
											);
										})}
									</TableBody>
								</Table>
							</div>

							{/* Mobile Cards */}
							<div className="divide-y divide-border md:hidden">
								{filteredInvoices.map((inv) => {
									const isPaid = inv.status === "paid";
									return (
										<div key={inv.id} className="space-y-3 p-4">
											<div className="flex items-start justify-between gap-2">
												<div className="min-w-0">
													<div className="flex items-center gap-2">
														<p className="truncate text-sm font-bold text-foreground">
															{inv.clientName}
														</p>
														<span className="text-xs text-muted-foreground tabular-nums">
															#{inv.invoiceNumber}
														</span>
													</div>
													<p className="truncate text-xs text-muted-foreground">
														{inv.projectTitle || `Due ${inv.dueDate}`} ·{" "}
														{formatRelativeDueDate(
															inv.dueDate,
															todayISO,
															isPaid,
														)}
													</p>
												</div>
												<div className="text-right shrink-0">
													<MoneyValue
														amount={inv.totalAmount}
														className="text-base font-extrabold text-foreground"
													/>
													<div className="mt-0.5">
														{renderInvoiceStatusBadge(inv.status)}
													</div>
												</div>
											</div>

											<div className="flex flex-wrap items-center justify-end gap-2">
												<Button
													type="button"
													size="xs"
													variant="outline"
													onClick={() => setInvoiceToPreview(inv)}
													className="min-h-9 gap-1 rounded-lg font-semibold"
												>
													<Eye className="size-3.5" />
													<span>{isPaid ? "Receipt" : "Preview"}</span>
												</Button>
												{!isPaid && (
													<Button
														type="button"
														size="xs"
														variant="outline"
														onClick={() => handleWhatsAppShare(inv)}
														className="min-h-9 gap-1 rounded-lg font-semibold"
													>
														<MessageCircle className="size-3.5" />
														<span>
															{inv.status === "overdue" ? "Ping" : "WhatsApp"}
														</span>
													</Button>
												)}
												{!isPaid && (
													<Button
														type="button"
														size="xs"
														onClick={() => setInvoiceToSettle(inv)}
														className="min-h-9 gap-1 rounded-lg bg-zinc-900 font-bold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 cursor-pointer"
													>
														<CheckCircle2 className="size-3.5" />
														<span>Mark Paid</span>
													</Button>
												)}
											</div>
										</div>
									);
								})}
							</div>
						</>
					)}
				</CardContent>
			</Card>

			<CreateInvoiceModal
				open={createModalOpen}
				onOpenChange={setCreateModalOpen}
				onCreatedAndShare={(created) => handleWhatsAppShare(created)}
				onCreatedAndPrint={(created) => {
					setInvoiceToPreview(created);
					window.setTimeout(() => window.print(), 250);
				}}
			/>

			<SettleInvoiceDialog
				invoice={invoiceToSettle}
				open={invoiceToSettle !== null}
				onOpenChange={(open) => {
					if (!open) setInvoiceToSettle(null);
				}}
			/>

			<InvoicePreviewDialog
				invoice={invoiceToPreview}
				open={invoiceToPreview !== null}
				onOpenChange={(open) => {
					if (!open) setInvoiceToPreview(null);
				}}
			/>
		</div>
	);
}
