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
 * Displays a monetary figure with `tabular-nums` alignment and respects
 * the global Privacy Blur Mode (DESIGN.md §3.1 & §5.3).
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

	const isBlurred = profile.privacyBlurEnabled;
	const symbol = CURRENCIES[profile.currency].symbol;

	return (
		<span className={cn("tabular-nums inline-block", className)}>
			{isBlurred ? (
				<>
					<span aria-hidden="true" className="privacy-masked">
						{formatted}
					</span>
					<span className="sr-only">{symbol} hidden balance</span>
				</>
			) : (
				formatted
			)}
		</span>
	);
}
