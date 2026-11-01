import { useFinly } from "#/context/finly-context";
import { CURRENCIES, formatCurrency, formatSignedCurrency } from "#/lib/format";
import { cn } from "#/lib/utils";
import type { TransactionType } from "#/types/finly";

interface MoneyValueProps {
	amount: number;
	signedType?: TransactionType;
	compact?: boolean;
	className?: string;
}

/**
 * Displays a monetary figure with Geist Mono `tabular-nums` alignment and
 * respects the global Privacy Mask Mode (`$ ••••••` — PRD v2.1.0 §3.1 & DESIGN.md §6.1).
 */
export function MoneyValue({
	amount,
	signedType,
	compact = false,
	className,
}: MoneyValueProps) {
	const { profile } = useFinly();
	const formatted = signedType
		? formatSignedCurrency(amount, signedType, profile.currency)
		: formatCurrency(amount, profile.currency, { compact });

	const isMasked = profile.privacyBlurEnabled;
	const symbol = CURRENCIES[profile.currency].symbol;
	const signPrefix =
		signedType === "money_in"
			? "+"
			: signedType === "money_out"
				? "-"
				: amount < 0
					? "-"
					: "";

	return (
		<span className={cn("tabular-nums inline-block font-mono", className)}>
			{isMasked ? (
				<>
					<span aria-hidden="true">
						{signPrefix}
						{symbol} ••••••
					</span>
					<span className="sr-only">{symbol} hidden balance</span>
				</>
			) : (
				formatted
			)}
		</span>
	);
}
