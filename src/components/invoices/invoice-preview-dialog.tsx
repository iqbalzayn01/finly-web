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
			<DialogContent className="brutal-surface max-h-[92vh] overflow-y-auto rounded-3xl border-2 border-border bg-popover p-6 sm:max-w-xl">
				<DialogHeader className="no-print">
					<DialogTitle className="font-mono text-base font-black uppercase tracking-tight">
						Invoice #{invoice.invoiceNumber}
					</DialogTitle>
					<DialogDescription className="font-mono text-xs">
						Preview, print, or share this invoice with your client.
					</DialogDescription>
				</DialogHeader>

				{/* Printable Sheet */}
				<div className="space-y-6 rounded-2xl border-2 border-border bg-background p-5 font-mono sm:p-6">
					<div className="flex items-start justify-between gap-4 border-b-2 border-border pb-4">
						<div className="flex items-center gap-2.5">
							<span className="brutal-surface flex size-9 items-center justify-center rounded-xl bg-primary">
								<BrandLogo size={20} variant="monochrome" />
							</span>
							<div>
								<p className="text-sm font-bold text-foreground">
									{profile.businessName || profile.displayName}
								</p>
								<p className="text-xs text-muted-foreground">{profile.email}</p>
							</div>
						</div>
						<div className="text-right">
							<p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
								Invoice
							</p>
							<p className="text-base font-black text-foreground tabular-nums">
								#{invoice.invoiceNumber}
							</p>
							<Badge variant="outline" className="mt-1 text-[10px] uppercase">
								{invoice.status}
							</Badge>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-4 text-xs">
						<div>
							<p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
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
						<div className="space-y-1 text-right">
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
									<span className="font-semibold text-inflow tabular-nums">
										{invoice.paidAtDate}
									</span>
								</div>
							)}
						</div>
					</div>

					<div className="overflow-hidden rounded-xl border-2 border-border">
						<table className="w-full text-xs">
							<thead className="border-b-2 border-border bg-muted/60 text-muted-foreground">
								<tr>
									<th className="px-3 py-2 text-left font-bold">Description</th>
									<th className="px-3 py-2 text-right font-bold">Qty</th>
									<th className="px-3 py-2 text-right font-bold">Price</th>
									<th className="px-3 py-2 text-right font-bold">Total</th>
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
										<td className="px-3 py-2.5 text-right font-bold text-foreground tabular-nums">
											{formatCurrency(item.total, profile.currency)}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>

					<div className="space-y-1.5 border-t-2 border-border pt-3 text-xs">
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
						<div className="flex justify-between pt-1 text-base font-black text-foreground">
							<span>Total Due</span>
							<span className="tabular-nums">
								{formatCurrency(invoice.totalAmount, profile.currency)}
							</span>
						</div>
					</div>

					{invoice.paymentInstructions && (
						<div className="whitespace-pre-line rounded-xl border-2 border-border bg-muted/40 p-3 text-xs text-muted-foreground">
							<p className="mb-0.5 font-bold text-foreground">
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
						className="h-10 gap-1.5 rounded-xl font-mono text-xs font-bold"
					>
						<Copy className="size-3.5" />
						<span>Copy</span>
					</Button>
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={() => window.print()}
						className="h-10 gap-1.5 rounded-xl font-mono text-xs font-bold"
					>
						<Printer className="size-3.5" />
						<span>Print / PDF</span>
					</Button>
					<Button
						type="button"
						size="sm"
						onClick={handleWhatsAppShare}
						className="h-10 gap-1.5 rounded-xl bg-primary px-4 font-mono text-xs font-extrabold uppercase tracking-wider text-primary-foreground"
					>
						<MessageCircle className="size-3.5" />
						<span>
							{invoice.status === "overdue"
								? "Send Reminder"
								: "Share on WhatsApp"}
						</span>
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
