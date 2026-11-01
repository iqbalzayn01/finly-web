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
			<DialogContent className="rounded-3xl border-border bg-popover p-6 shadow-2xl sm:max-w-lg">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2 font-mono text-lg font-black uppercase tracking-tight">
						<CheckCircle2 className="size-5 text-inflow" />
						<span>Confirm Payment Received</span>
					</DialogTitle>
					<DialogDescription className="font-mono text-xs">
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
					{/* Deposit Destination */}
					<div className="space-y-3 rounded-2xl border border-border bg-card p-4 dark:border-zinc-700 dark:bg-muted">
						<p className="font-mono text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
							Deposit Destination
						</p>

						<div className="space-y-1.5">
							<Label className="font-mono text-xs font-semibold text-foreground">
								Deposit Wallet
							</Label>
							<Select value={walletId} onValueChange={setWalletId}>
								<SelectTrigger className="h-10 w-full rounded-xl bg-card font-mono text-xs dark:bg-background">
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
								<Label className="font-mono text-xs font-semibold text-foreground">
									Income Category
								</Label>
								<Select value={category} onValueChange={setCategory}>
									<SelectTrigger className="h-10 w-full rounded-xl bg-card font-mono text-xs dark:bg-background">
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
									className="font-mono text-xs font-semibold text-foreground"
								>
									Payment Date
								</Label>
								<Input
									id={`${baseId}-paid-date`}
									type="date"
									value={paidDate}
									onChange={(e) => setPaidDate(e.target.value)}
									className="h-10 rounded-xl bg-card font-mono text-xs tabular-nums dark:bg-background"
								/>
							</div>
						</div>
					</div>

					{/* Immediate Impact Preview */}
					<div className="rounded-2xl border border-inflow-border bg-inflow-bg px-4 py-3 font-mono text-xs">
						<p className="font-bold text-foreground">
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
									className="font-extrabold text-inflow"
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
						className="min-h-11 rounded-xl font-mono text-xs font-bold cursor-pointer"
					>
						Cancel
					</Button>
					<Button
						type="button"
						onClick={handleConfirm}
						className="min-h-11 rounded-xl bg-primary px-5 font-mono text-xs font-extrabold uppercase tracking-wider text-primary-foreground hover:bg-primary-hover cursor-pointer"
					>
						Confirm &amp; Deposit
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
