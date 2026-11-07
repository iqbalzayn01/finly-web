import { MessageCircle, Plus, Printer, Trash2 } from "lucide-react";
import type { FormEvent } from "react";
import { useEffect, useId, useMemo, useState } from "react";
import { Button } from "#/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "#/components/ui/dialog";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { Textarea } from "#/components/ui/textarea";
import { useFinly } from "#/context/finly-context";
import {
	addDaysISO,
	formatLiveNumericInput,
	formatUSD,
	parseNumericInput,
} from "#/lib/format";
import { cn } from "#/lib/utils";
import type { Invoice } from "#/types/finly";

interface DraftLineItem {
	key: string;
	description: string;
	quantity: string;
	unitPriceFormatted: string;
}

interface CreateInvoiceModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onCreatedAndShare?: (invoice: Invoice) => void;
	onCreatedAndPrint?: (invoice: Invoice) => void;
}

export function CreateInvoiceModal({
	open,
	onOpenChange,
	onCreatedAndShare,
	onCreatedAndPrint,
}: CreateInvoiceModalProps) {
	const { profile, todayISO, createInvoice } = useFinly();
	const baseId = useId();

	const [clientName, setClientName] = useState("");
	const [projectTitle, setProjectTitle] = useState("");
	const [clientPhone, setClientPhone] = useState("");
	const [clientEmail, setClientEmail] = useState("");
	const [issueDate, setIssueDate] = useState(todayISO);
	const [dueDate, setDueDate] = useState(
		addDaysISO(todayISO, profile.paymentDetails.defaultTermsDays || 14),
	);
	const [activePresetDays, setActivePresetDays] = useState<number | null>(
		profile.paymentDetails.defaultTermsDays || 14,
	);
	const [taxRate, setTaxRate] = useState("0");
	const [paymentInstructions, setPaymentInstructions] = useState("");
	const [lineItems, setLineItems] = useState<DraftLineItem[]>([
		{
			key: "line_1",
			description: "",
			quantity: "1",
			unitPriceFormatted: "",
		},
	]);

	useEffect(() => {
		if (!open) return;
		const defaultTerms = profile.paymentDetails.defaultTermsDays || 14;
		setClientName("");
		setProjectTitle("");
		setClientPhone("");
		setClientEmail("");
		setIssueDate(todayISO);
		setDueDate(addDaysISO(todayISO, defaultTerms));
		setActivePresetDays(defaultTerms);
		setTaxRate("0");
		setPaymentInstructions(
			`Bank: ${profile.paymentDetails.bankName} - Acct #${profile.paymentDetails.accountNumber} (${profile.paymentDetails.accountHolder})${profile.paymentDetails.notes ? `\nNote: "${profile.paymentDetails.notes}"` : ""}`,
		);
		setLineItems([
			{
				key: `line_${Date.now()}`,
				description: "",
				quantity: "1",
				unitPriceFormatted: "",
			},
		]);
	}, [open, profile.paymentDetails, todayISO]);

	const applyDuePreset = (days: number) => {
		setActivePresetDays(days);
		setDueDate(addDaysISO(issueDate, days));
	};

	const addLineItem = () => {
		setLineItems((prev) => [
			...prev,
			{
				key: `line_${Date.now()}_${prev.length}`,
				description: "",
				quantity: "1",
				unitPriceFormatted: "",
			},
		]);
	};

	const removeLineItem = (key: string) => {
		setLineItems((prev) =>
			prev.length > 1 ? prev.filter((item) => item.key !== key) : prev,
		);
	};

	const updateLineItem = (
		key: string,
		field: keyof Omit<DraftLineItem, "key">,
		value: string,
	) => {
		setLineItems((prev) =>
			prev.map((item) =>
				item.key === key ? { ...item, [field]: value } : item,
			),
		);
	};

	const computedTotals = useMemo(() => {
		const parsedItems = lineItems.map((item) => {
			const qty = Math.max(0, Number.parseFloat(item.quantity) || 0);
			const price = parseNumericInput(item.unitPriceFormatted);
			return {
				description: item.description.trim(),
				quantity: qty,
				unitPrice: price,
				subtotal: Math.round(qty * price * 100) / 100,
			};
		});

		const subtotal =
			Math.round(
				parsedItems.reduce((sum, item) => sum + item.subtotal, 0) * 100,
			) / 100;
		const taxPercent = Math.max(
			0,
			Math.min(100, Number.parseFloat(taxRate) || 0),
		);
		const taxAmount = Math.round(subtotal * (taxPercent / 100) * 100) / 100;
		const totalDue = Math.round((subtotal + taxAmount) * 100) / 100;

		return {
			parsedItems,
			subtotal,
			taxPercent,
			taxAmount,
			totalDue,
		};
	}, [lineItems, taxRate]);

	const validLineItems = computedTotals.parsedItems.filter(
		(i) => i.description.length > 0 && i.quantity > 0 && i.unitPrice > 0,
	);
	const canSave = clientName.trim().length > 0 && validLineItems.length > 0;

	const submitWithAction = (
		status: "draft" | "sent",
		followUp: "none" | "share" | "print",
	) => {
		if (!canSave) return;
		const created = createInvoice({
			clientName,
			projectTitle,
			clientPhone,
			clientEmail,
			issueDate,
			dueDate,
			items: validLineItems.map((item) => ({
				description: item.description,
				quantity: item.quantity,
				unitPrice: item.unitPrice,
			})),
			taxRatePercent: computedTotals.taxPercent,
			status,
			paymentInstructions,
		});
		onOpenChange(false);
		if (followUp === "share" && onCreatedAndShare) {
			onCreatedAndShare(created);
		} else if (followUp === "print") {
			if (onCreatedAndPrint) {
				onCreatedAndPrint(created);
			} else {
				window.setTimeout(() => window.print(), 200);
			}
		}
	};

	const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		submitWithAction("sent", "share");
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="brutal-surface max-h-[92vh] overflow-y-auto rounded-3xl border-2 border-border bg-popover p-6 sm:max-w-2xl">
				<DialogHeader>
					<DialogTitle className="font-mono text-lg font-black uppercase tracking-tight">
						New Invoice
					</DialogTitle>
					<DialogDescription className="font-mono text-xs">
						Fill in your client details and items. When marked paid, the amount
						is added to your balance.
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleFormSubmit} className="space-y-5">
					{/* CLIENT DETAILS */}
					<div className="grid gap-3.5 sm:grid-cols-2">
						<div className="space-y-1.5">
							<Label
								htmlFor={`${baseId}-client`}
								className="font-mono text-[11px] font-bold uppercase tracking-wider text-muted-foreground"
							>
								Client Name *
							</Label>
							<Input
								id={`${baseId}-client`}
								required
								placeholder="Acme Design Studio"
								value={clientName}
								onChange={(e) => setClientName(e.target.value)}
								className="h-10 rounded-xl bg-background font-mono text-xs"
							/>
						</div>
						<div className="space-y-1.5">
							<Label
								htmlFor={`${baseId}-phone`}
								className="font-mono text-[11px] font-bold uppercase tracking-wider text-muted-foreground"
							>
								Client Phone / WhatsApp
							</Label>
							<Input
								id={`${baseId}-phone`}
								placeholder="+1 (555) 019-2834"
								value={clientPhone}
								onChange={(e) => setClientPhone(e.target.value)}
								className="h-10 rounded-xl bg-background font-mono text-xs"
							/>
						</div>
						<div className="space-y-1.5">
							<Label
								htmlFor={`${baseId}-project`}
								className="font-mono text-[11px] font-bold uppercase tracking-wider text-muted-foreground"
							>
								Project Title (Optional)
							</Label>
							<Input
								id={`${baseId}-project`}
								placeholder="Website Redesign"
								value={projectTitle}
								onChange={(e) => setProjectTitle(e.target.value)}
								className="h-10 rounded-xl bg-background font-mono text-xs"
							/>
						</div>
						<div className="space-y-1.5">
							<Label
								htmlFor={`${baseId}-email`}
								className="font-mono text-[11px] font-bold uppercase tracking-wider text-muted-foreground"
							>
								Client Email (Optional)
							</Label>
							<Input
								id={`${baseId}-email`}
								type="email"
								placeholder="billing@acmedesign.co"
								value={clientEmail}
								onChange={(e) => setClientEmail(e.target.value)}
								className="h-10 rounded-xl bg-background font-mono text-xs"
							/>
						</div>
					</div>

					{/* TIMELINE & DUE DATE */}
					<div className="space-y-3 rounded-2xl border-2 border-border bg-muted/40 p-4">
						<div className="grid gap-3.5 sm:grid-cols-2">
							<div className="space-y-1.5">
								<Label
									htmlFor={`${baseId}-issue`}
									className="font-mono text-[11px] font-bold uppercase tracking-wider text-muted-foreground"
								>
									Issue Date
								</Label>
								<Input
									id={`${baseId}-issue`}
									type="date"
									value={issueDate}
									onChange={(e) => {
										setIssueDate(e.target.value);
										if (activePresetDays !== null) {
											setDueDate(addDaysISO(e.target.value, activePresetDays));
										}
									}}
									className="h-10 rounded-xl bg-background font-mono text-xs tabular-nums"
								/>
							</div>
							<div className="space-y-1.5">
								<Label
									htmlFor={`${baseId}-due`}
									className="font-mono text-[11px] font-bold uppercase tracking-wider text-muted-foreground"
								>
									Due Date
								</Label>
								<Input
									id={`${baseId}-due`}
									type="date"
									value={dueDate}
									onChange={(e) => {
										setDueDate(e.target.value);
										setActivePresetDays(null);
									}}
									className="h-10 rounded-xl bg-background font-mono text-xs tabular-nums"
								/>
							</div>
						</div>
						<div className="flex flex-wrap items-center gap-2">
							<span className="font-mono text-xs font-semibold text-muted-foreground">
								Due in:
							</span>
							{[7, 14, 30].map((days) => (
								<button
									key={days}
									type="button"
									onClick={() => applyDuePreset(days)}
									className={cn(
										"h-8 rounded-lg border-2 px-3 font-mono text-xs transition-all duration-150 active:scale-95 cursor-pointer",
										activePresetDays === days
											? "border-border bg-primary font-extrabold text-primary-foreground"
											: "border-border bg-background font-semibold text-foreground hover:bg-accent",
									)}
								>
									+{days} Days
								</button>
							))}
						</div>
					</div>

					{/* ITEMS & SERVICES (USD) */}
					<div className="space-y-2.5">
						<div className="flex items-center justify-between">
							<Label className="font-mono text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
								Items &amp; Services
							</Label>
							<Button
								type="button"
								size="xs"
								variant="outline"
								onClick={addLineItem}
								className="h-8 gap-1 rounded-xl px-3 font-mono text-xs font-bold"
							>
								<Plus className="size-3.5" />
								<span>Add Row</span>
							</Button>
						</div>

						<div className="hidden grid-cols-[1fr_72px_132px_104px_36px] gap-2 px-2 font-mono text-[11px] font-bold uppercase tracking-wider text-muted-foreground sm:grid">
							<span>Description</span>
							<span>Qty</span>
							<span>Price (USD)</span>
							<span className="text-right">Total (USD)</span>
							<span className="sr-only">Remove</span>
						</div>

						<div className="space-y-2">
							{lineItems.map((item, idx) => {
								const rowSubtotal =
									(Number.parseFloat(item.quantity) || 0) *
									parseNumericInput(item.unitPriceFormatted);

								return (
									<div
										key={item.key}
										className="grid grid-cols-1 gap-2 rounded-2xl border-2 border-border bg-muted/40 p-2.5 sm:grid-cols-[1fr_72px_132px_104px_36px] sm:items-center"
									>
										<Input
											placeholder={`Item #${idx + 1}`}
											value={item.description}
											onChange={(e) =>
												updateLineItem(item.key, "description", e.target.value)
											}
											className="h-9 rounded-xl bg-background font-mono text-xs"
										/>
										<Input
											type="number"
											min="1"
											step="1"
											placeholder="Qty"
											value={item.quantity}
											onChange={(e) =>
												updateLineItem(item.key, "quantity", e.target.value)
											}
											className="h-9 rounded-xl bg-background font-mono text-xs tabular-nums"
										/>
										<div className="relative flex items-center">
											<span className="pointer-events-none absolute left-2.5 font-mono text-xs font-bold text-muted-foreground">
												$
											</span>
											<Input
												type="text"
												inputMode="decimal"
												placeholder="0.00"
												value={item.unitPriceFormatted}
												onChange={(e) =>
													updateLineItem(
														item.key,
														"unitPriceFormatted",
														formatLiveNumericInput(e.target.value, "USD"),
													)
												}
												className="h-9 rounded-xl bg-background pl-6 font-mono text-xs tabular-nums"
											/>
										</div>
										<div className="flex items-center justify-between px-1 text-right font-mono text-xs font-extrabold text-foreground sm:justify-end tabular-nums">
											<span className="text-muted-foreground sm:hidden">
												Total:
											</span>
											<span>{formatUSD(rowSubtotal)}</span>
										</div>
										<Button
											type="button"
											variant="ghost"
											size="icon-sm"
											disabled={lineItems.length <= 1}
											onClick={() => removeLineItem(item.key)}
											aria-label="Remove item row"
											className="justify-self-end text-muted-foreground hover:text-outflow"
										>
											<Trash2 className="size-3.5" />
										</Button>
									</div>
								);
							})}
						</div>
					</div>

					{/* PAYMENT INSTRUCTIONS & TAX */}
					<div className="grid gap-3.5 sm:grid-cols-[1fr_120px]">
						<div className="space-y-1.5">
							<Label
								htmlFor={`${baseId}-instructions`}
								className="font-mono text-[11px] font-bold uppercase tracking-wider text-muted-foreground"
							>
								Payment Instructions
							</Label>
							<Textarea
								id={`${baseId}-instructions`}
								rows={2}
								value={paymentInstructions}
								onChange={(e) => setPaymentInstructions(e.target.value)}
								className="rounded-xl border-2 border-border bg-background font-mono text-xs"
							/>
						</div>
						<div className="space-y-1.5">
							<Label
								htmlFor={`${baseId}-tax`}
								className="font-mono text-[11px] font-bold uppercase tracking-wider text-muted-foreground"
							>
								Tax (%)
							</Label>
							<Input
								id={`${baseId}-tax`}
								type="number"
								min="0"
								max="100"
								step="0.5"
								value={taxRate}
								onChange={(e) => setTaxRate(e.target.value)}
								className="h-10 rounded-xl bg-background font-mono text-xs tabular-nums"
							/>
						</div>
					</div>

					{/* TOTAL DUE (USD) */}
					<div className="brutal-surface flex flex-col gap-1.5 rounded-2xl bg-muted/60 px-4 py-3.5 text-foreground">
						{computedTotals.taxPercent > 0 && (
							<div className="flex items-center justify-between font-mono text-xs text-muted-foreground">
								<span>
									Subtotal {formatUSD(computedTotals.subtotal)} + Tax (
									{computedTotals.taxPercent}%)
								</span>
								<span className="tabular-nums">
									{formatUSD(computedTotals.taxAmount)}
								</span>
							</div>
						)}
						<div className="flex items-center justify-between font-mono text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
							<span>Total Due</span>
							<span className="text-xl font-black tracking-tight text-foreground tabular-nums">
								{formatUSD(computedTotals.totalDue)}
							</span>
						</div>
					</div>

					{/* DialogFooter */}
					<DialogFooter className="flex-wrap gap-2 pt-1 sm:justify-between">
						<Button
							type="button"
							variant="outline"
							disabled={!canSave}
							onClick={() => submitWithAction("draft", "none")}
							className="h-10 rounded-xl font-mono text-xs font-bold"
						>
							Save Draft
						</Button>
						<div className="flex flex-wrap items-center gap-2">
							<Button
								type="button"
								variant="outline"
								disabled={!canSave}
								onClick={() => submitWithAction("sent", "print")}
								className="h-10 gap-1.5 rounded-xl font-mono text-xs font-bold"
							>
								<Printer className="size-3.5" />
								<span>Print / PDF</span>
							</Button>
							<Button
								type="submit"
								disabled={!canSave}
								className="h-10 gap-1.5 rounded-xl bg-primary px-5 font-mono text-xs font-extrabold uppercase tracking-wider text-primary-foreground cursor-pointer"
							>
								<MessageCircle className="size-3.5" />
								<span>Save &amp; Share</span>
							</Button>
						</div>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
