import { CheckCircle2 } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { MoneyValue } from "#/components/money-value";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#/components/ui/select";
import { useFinly } from "#/context/finly-context";
import { UNIVERSAL_INFLOW_CATEGORIES } from "#/lib/constants";
import { formatMonthYear, formatUSD } from "#/lib/format";
import type { Invoice } from "#/types/finly";

interface SettleInvoiceDialogProps {
	invoice: Invoice | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function SettleInvoiceDialog({
	invoice,
	open,
	onOpenChange,
}: SettleInvoiceDialogProps) {
	const { wallets, safeToSpend, todayISO, settleInvoice } = useFinly();
	const baseId = useId();

	const inflowCategories = UNIVERSAL_INFLOW_CATEGORIES;

	const [paidDate, setPaidDate] = useState(todayISO);
	const [walletId, setWalletId] = useState(wallets[0]?.id ?? "");
	const [category, setCategory] = useState(
		inflowCategories[0] ?? "Client Invoices",
	);

	useEffect(() => {
		if (!open) return;
		setPaidDate(todayISO);
		setWalletId(wallets[0]?.id ?? "");
		setCategory(inflowCategories[0] ?? "Client Invoices");
	}, [open, todayISO, wallets]);

	if (!invoice) return null;

	const projectedTotalBalance =
		safeToSpend.totalCashOnHand + invoice.totalAmount;

	const handleConfirm = () => {
		settleInvoice({
			invoiceId: invoice.id,
			walletId: walletId || wallets[0]?.id || "wal_business",
			category,
			paidDate,
			syncToCashflow: true,
		});
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="rounded-2xl border-border bg-card p-6 shadow-2xl sm:max-w-lg">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2 text-lg font-bold tracking-tight">
						<CheckCircle2 className="size-5 text-foreground" />
						<span>Confirm Payment Received</span>
					</DialogTitle>
					<DialogDescription className="text-xs">
						Record{" "}
						<strong className="font-bold text-foreground tabular-nums">
							{formatUSD(invoice.totalAmount)}
						</strong>{" "}
						from{" "}
						<strong className="font-bold text-foreground">
							{invoice.clientName}
						</strong>{" "}
						(#{invoice.invoiceNumber}) into your Cashflow?
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4 py-1 text-sm">
					{/* DEPOSIT DESTINATION (PRD §5.3) */}
					<div className="space-y-3 rounded-xl border border-border bg-muted/30 p-4">
						<p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
							Deposit Destination
						</p>

						<div className="space-y-1.5">
							<Label className="text-xs font-semibold text-foreground">
								Deposit Wallet
							</Label>
							<Select value={walletId} onValueChange={setWalletId}>
								<SelectTrigger className="h-10 w-full rounded-xl bg-card text-xs">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{wallets.map((w) => (
										<SelectItem key={w.id} value={w.id}>
											{w.name} ({formatUSD(w.balance)})
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="grid gap-3 sm:grid-cols-2">
							<div className="space-y-1.5">
								<Label className="text-xs font-semibold text-foreground">
									Income Category
								</Label>
								<Select value={category} onValueChange={setCategory}>
									<SelectTrigger className="h-10 w-full rounded-xl bg-card text-xs">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{inflowCategories.map((cat) => (
											<SelectItem key={cat} value={cat}>
												{cat}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-1.5">
								<Label
									htmlFor={`${baseId}-paid-date`}
									className="text-xs font-semibold text-foreground"
								>
									Payment Date
								</Label>
								<Input
									id={`${baseId}-paid-date`}
									type="date"
									value={paidDate}
									onChange={(e) => setPaidDate(e.target.value)}
									className="h-10 rounded-xl bg-card text-xs tabular-nums"
								/>
							</div>
						</div>
					</div>

					{/* Immediate Impact Preview (PRD §5.3) */}
					<div className="rounded-xl border border-zinc-200 bg-zinc-50/80 px-4 py-3 text-xs dark:border-zinc-800 dark:bg-zinc-900/60">
						<p className="font-semibold text-foreground">
							This action will immediately:
						</p>
						<ul className="mt-1.5 list-inside list-disc space-y-1 text-muted-foreground">
							<li>
								Increase Total Balance to{" "}
								<MoneyValue
									amount={projectedTotalBalance}
									className="font-bold text-foreground"
								/>{" "}
								(
								<MoneyValue
									amount={invoice.totalAmount}
									signedType="money_in"
									className="font-bold text-foreground"
								/>
								)
							</li>
							<li>Recalculate daily Safe-to-Spend limit</li>
							<li>
								Update Inflow chart for {formatMonthYear(paidDate || todayISO)}
							</li>
						</ul>
					</div>
				</div>

				<DialogFooter className="gap-2">
					<Button
						type="button"
						variant="outline"
						onClick={() => onOpenChange(false)}
						className="min-h-11 rounded-xl font-semibold cursor-pointer"
					>
						Cancel
					</Button>
					<Button
						type="button"
						onClick={handleConfirm}
						className="shadow-neu-sm min-h-11 rounded-xl bg-zinc-900 px-5 font-bold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 cursor-pointer"
					>
						Confirm &amp; Deposit
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
