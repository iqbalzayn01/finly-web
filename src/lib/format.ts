import type { SupportedCurrency, TransactionType } from "#/types/finly";

export interface CurrencyMeta {
	code: SupportedCurrency;
	symbol: string;
	name: string;
	locale: string;
	fractionDigits: number;
	overflowThreshold: number;
}

export const CURRENCIES: Record<SupportedCurrency, CurrencyMeta> = {
	USD: {
		code: "USD",
		symbol: "$",
		name: "United States Dollar",
		locale: "en-US",
		fractionDigits: 2,
		overflowThreshold: 1_000_000,
	},
};

/**
 * Global strict USD currency helper (PRD §7.3).
 */
export const formatUSD = (val: number): string => {
	const safeAmount = Number.isFinite(val) ? val : 0;
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}).format(safeAmount);
};

export function formatCurrency(
	amount: number,
	_currency: SupportedCurrency = "USD",
	options?: { compact?: boolean },
): string {
	const safeAmount = Number.isFinite(amount) ? amount : 0;
	if (!options?.compact) {
		return formatUSD(safeAmount);
	}

	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		notation: "compact",
		minimumFractionDigits: 0,
		maximumFractionDigits: 1,
	}).format(safeAmount);
}

export function formatSignedCurrency(
	amount: number,
	type: TransactionType,
	_currency: SupportedCurrency = "USD",
): string {
	const formatted = formatUSD(Math.abs(amount));
	return type === "money_in" ? `+${formatted}` : `-${formatted}`;
}

/**
 * Dynamically formats numeric user input with thousands separators in real time
 * while preserving trailing decimal points during active typing.
 */
export function formatLiveNumericInput(
	rawValue: string,
	_currency: SupportedCurrency = "USD",
): string {
	const cleaned = rawValue.replace(/[^0-9.]/g, "");
	if (!cleaned) return "";

	const parts = cleaned.split(".");
	const integerRaw = parts[0].replace(/^0+(?=\d)/, "") || "0";
	const formattedInt = integerRaw.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

	if (parts.length === 1) {
		return formattedInt;
	}

	const decimalPart = parts.slice(1).join("").slice(0, 2);
	return `${formattedInt}.${decimalPart}`;
}

export function parseNumericInput(formatted: string): number {
	const normalized = formatted.replace(/,/g, "").trim();
	if (!normalized) return 0;
	const parsed = Number.parseFloat(normalized);
	return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

export function getTodayISO(): string {
	const now = new Date();
	const year = now.getFullYear();
	const month = String(now.getMonth() + 1).padStart(2, "0");
	const day = String(now.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
}

export function addDaysISO(baseISO: string, offsetDays: number): string {
	const [y, m, d] = baseISO.split("-").map(Number);
	const date = new Date(y, (m || 1) - 1, (d || 1) + offsetDays);
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
}

export function diffDaysISO(fromISO: string, toISO: string): number {
	const [y1, m1, d1] = fromISO.split("-").map(Number);
	const [y2, m2, d2] = toISO.split("-").map(Number);
	const utc1 = Date.UTC(y1, (m1 || 1) - 1, d1 || 1);
	const utc2 = Date.UTC(y2, (m2 || 1) - 1, d2 || 1);
	return Math.round((utc2 - utc1) / 86_400_000);
}

export function formatFriendlyDate(dateISO: string, todayISO: string): string {
	const diff = diffDaysISO(dateISO, todayISO);
	if (diff === 0) return "Today";
	if (diff === 1) return "Yesterday";
	if (diff === -1) return "Tomorrow";

	const [y, m, d] = dateISO.split("-").map(Number);
	const date = new Date(y, (m || 1) - 1, d || 1);
	return new Intl.DateTimeFormat("en-US", {
		month: "short",
		day: "2-digit",
		year: y !== Number(todayISO.slice(0, 4)) ? "numeric" : undefined,
	}).format(date);
}

export function formatShortAxisDate(dateISO: string): string {
	const [y, m, d] = dateISO.split("-").map(Number);
	const date = new Date(y, (m || 1) - 1, d || 1);
	return new Intl.DateTimeFormat("en-US", {
		month: "short",
		day: "2-digit",
	}).format(date);
}

export function formatFullDate(dateISO: string): string {
	const [y, m, d] = dateISO.split("-").map(Number);
	const date = new Date(y, (m || 1) - 1, d || 1);
	return new Intl.DateTimeFormat("en-US", {
		month: "long",
		day: "numeric",
		year: "numeric",
	}).format(date);
}

export function formatMonthYear(dateISO: string): string {
	const [y, m] = dateISO.split("-").map(Number);
	const date = new Date(y, (m || 1) - 1, 1);
	return new Intl.DateTimeFormat("en-US", {
		month: "long",
		year: "numeric",
	}).format(date);
}

export function formatRelativeDueDate(
	dueDateISO: string,
	todayISO: string,
	isPaid: boolean,
): string {
	if (isPaid) {
		return formatFriendlyDate(dueDateISO, todayISO);
	}
	const daysUntilDue = diffDaysISO(todayISO, dueDateISO);
	if (daysUntilDue === 0) return "Due today";
	if (daysUntilDue === 1) return "In 1 day";
	if (daysUntilDue > 1 && daysUntilDue <= 14) return `In ${daysUntilDue} days`;
	if (daysUntilDue === -1) return "1 day overdue";
	if (daysUntilDue < -1) return `${Math.abs(daysUntilDue)} days ago`;
	return formatFriendlyDate(dueDateISO, todayISO);
}
