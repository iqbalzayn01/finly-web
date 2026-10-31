import { Copy, MessageCircle, Printer } from "lucide-react";
import { toast } from "sonner";
import { BrandLogo } from "#/components/brand-logo";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "#/components/ui/dialog";
import { useFinly } from "#/context/finly-context";
import { formatCurrency } from "#/lib/format";
import type { Invoice, SupportedCurrency } from "#/types/finly";

export function buildWhatsAppInvoiceUrl(
	invoice: Invoice,
	currency: SupportedCurrency,
	businessName?: string,
): string {
	const cleanPhone = (invoice.clientPhone ?? "").replace(/[^0-9]/g, "");
	const formattedAmount = formatCurrency(invoice.totalAmount, currency);
	const sender = businessName || "Finly Workspace";

	const message =
		invoice.status === "overdue"
			? `Hi ${invoice.clientName}, friendly reminder from ${sender} regarding Invoice #${invoice.invoiceNumber} (${formattedAmount}) which was due on ${invoice.dueDate}. Please let us know once transfer is scheduled. Thank you!`
			: `Hi ${invoice.clientName}, here is Invoice #${invoice.invoiceNumber} from ${sender} for ${formattedAmount} (Due: ${invoice.dueDate}).${invoice.paymentInstructions ? `\n\nPayment details:\n${invoice.paymentInstructions}` : ""}\n\nThank you!`;

	const encoded = encodeURIComponent(message);
	return cleanPhone
		? `https://wa.me/${cleanPhone}?text=${encoded}`
		: `https://wa.me/?text=${encoded}`;
}

interface InvoicePreviewDialogProps {
	invoice: Invoice | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function InvoicePreviewDialog({
	invoice,
	open,
	onOpenChange,
}: InvoicePreviewDialogProps) {
	const { profile } = useFinly();

	if (!invoice) return null;

	const handleCopySummary = async () => {
		const summary = `Invoice #${invoice.invoiceNumber} — ${invoice.clientName}\nTotal: ${formatCurrency(invoice.totalAmount, profile.currency)}\nDue: ${invoice.dueDate}\n${invoice.paymentInstructions ?? ""}`;
		try {
			await navigator.clipboard.writeText(summary);
			toast.success("Invoice summary copied to clipboard");
		} catch {
			toast.error("Unable to access clipboard");
		}
	};

	const handleWhatsAppShare = () => {
		const url = buildWhatsAppInvoiceUrl(
			invoice,
			profile.currency,
			profile.businessName || profile.displayName,
		);
		window.open(url, "_blank", "noopener,noreferrer");
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-h-[92vh] overflow-y-auto rounded-2xl border-border bg-card p-6 sm:max-w-xl">
				<DialogHeader className="no-print">
					<DialogTitle className="text-base font-bold">
						Invoice #{invoice.invoiceNumber}
					</DialogTitle>
					<DialogDescription className="text-xs">
						Printable client invoice summary &amp; 1-click sharing
					</DialogDescription>
				</DialogHeader>

				{/* Printable Sheet */}
				<div className="space-y-6 rounded-2xl border border-border bg-background p-5 sm:p-6">
					<div className="flex items-start justify-between gap-4 border-b border-border pb-4">
						<div className="flex items-center gap-2.5">
							<BrandLogo size={28} variant="brand" />
							<div>
								<p className="text-sm font-bold text-foreground">
									{profile.businessName || profile.displayName}
								</p>
								<p className="text-xs text-muted-foreground">{profile.email}</p>
							</div>
						</div>
						<div className="text-right">
							<p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
								Invoice
							</p>
							<p className="text-base font-extrabold text-foreground tabular-nums">
								#{invoice.invoiceNumber}
							</p>
							<Badge variant="outline" className="mt-1 text-[10px] uppercase">
								{invoice.status}
							</Badge>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-4 text-xs">
						<div>
							<p className="font-semibold uppercase tracking-wider text-muted-foreground">
								Billed To
							</p>
							<p className="mt-1 text-sm font-bold text-foreground">
								{invoice.clientName}
							</p>
							{invoice.projectTitle && (
								<p className="text-muted-foreground">{invoice.projectTitle}</p>
							)}
							{invoice.clientEmail && (
								<p className="text-muted-foreground">{invoice.clientEmail}</p>
							)}
							{invoice.clientPhone && (
								<p className="text-muted-foreground">{invoice.clientPhone}</p>
							)}
						</div>
						<div className="text-right space-y-1">
							<div>
								<span className="text-muted-foreground">Issued: </span>
								<span className="font-semibold text-foreground tabular-nums">
									{invoice.issueDate}
								</span>
							</div>
							<div>
								<span className="text-muted-foreground">Due Date: </span>
								<span className="font-semibold text-foreground tabular-nums">
									{invoice.dueDate}
								</span>
							</div>
							{invoice.paidAtDate && (
								<div>
									<span className="text-muted-foreground">Paid: </span>
									<span className="font-semibold text-foreground tabular-nums">
										{invoice.paidAtDate}
									</span>
								</div>
							)}
						</div>
					</div>

					<div className="overflow-hidden rounded-xl border border-border">
						<table className="w-full text-xs">
							<thead className="bg-muted/60 text-muted-foreground">
								<tr>
									<th className="px-3 py-2 text-left font-semibold">
										Description
									</th>
									<th className="px-3 py-2 text-right font-semibold">Qty</th>
									<th className="px-3 py-2 text-right font-semibold">Rate</th>
									<th className="px-3 py-2 text-right font-semibold">Total</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-border">
								{invoice.items.map((item) => (
									<tr key={item.id}>
										<td className="px-3 py-2.5 font-medium text-foreground">
											{item.description}
										</td>
										<td className="px-3 py-2.5 text-right text-muted-foreground tabular-nums">
											{item.quantity}
										</td>
										<td className="px-3 py-2.5 text-right text-muted-foreground tabular-nums">
											{formatCurrency(item.unitPrice, profile.currency)}
										</td>
										<td className="px-3 py-2.5 text-right font-semibold text-foreground tabular-nums">
											{formatCurrency(item.total, profile.currency)}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>

					<div className="space-y-1.5 border-t border-border pt-3 text-xs">
						<div className="flex justify-between text-muted-foreground">
							<span>Subtotal</span>
							<span className="tabular-nums">
								{formatCurrency(invoice.subtotal, profile.currency)}
							</span>
						</div>
						{invoice.taxRatePercent > 0 && (
							<div className="flex justify-between text-muted-foreground">
								<span>Tax ({invoice.taxRatePercent}%)</span>
								<span className="tabular-nums">
									{formatCurrency(
										invoice.totalAmount - invoice.subtotal,
										profile.currency,
									)}
								</span>
							</div>
						)}
						<div className="flex justify-between pt-1 text-base font-extrabold text-foreground">
							<span>Total Due</span>
							<span className="tabular-nums">
								{formatCurrency(invoice.totalAmount, profile.currency)}
							</span>
						</div>
					</div>

					{invoice.paymentInstructions && (
						<div className="rounded-xl bg-muted/50 p-3 text-xs text-muted-foreground whitespace-pre-line">
							<p className="font-semibold text-foreground mb-0.5">
								Payment Instructions
							</p>
							{invoice.paymentInstructions}
						</div>
					)}
				</div>

				<div className="no-print flex flex-wrap items-center justify-end gap-2">
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={handleCopySummary}
						className="min-h-10 gap-1.5 rounded-xl"
					>
						<Copy className="size-3.5" />
						<span>Copy</span>
					</Button>
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={() => window.print()}
						className="min-h-10 gap-1.5 rounded-xl"
					>
						<Printer className="size-3.5" />
						<span>Print / PDF</span>
					</Button>
					<Button
						type="button"
						size="sm"
						onClick={handleWhatsAppShare}
						className="min-h-10 gap-1.5 rounded-xl font-bold"
					>
						<MessageCircle className="size-3.5" />
						<span>
							{invoice.status === "overdue"
								? "Send WhatsApp Reminder"
								: "Share via WhatsApp"}
						</span>
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
