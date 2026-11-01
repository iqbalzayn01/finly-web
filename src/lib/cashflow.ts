import {
	addDaysISO,
	diffDaysISO,
	formatFullDate,
	formatMonthYear,
	formatShortAxisDate,
} from "#/lib/format";
import type {
	AreaChartDataPoint,
	ChartTimeRange,
	CommittedBill,
	Invoice,
	PaginatedResponse,
	SafeToSpendMetrics,
	SafeToSpendStatus,
	Transaction,
	UserProfile,
	Wallet,
} from "#/types/finly";

/**
 * Reconciles each wallet's current balance from its openingBalance + all ledger entries.
 */
export function reconcileWallets(
	wallets: Wallet[],
	transactions: Transaction[],
): Wallet[] {
	const deltaByWallet = new Map<string, number>();

	for (const tx of transactions) {
		const prev = deltaByWallet.get(tx.walletId) ?? 0;
		const signed = tx.type === "money_in" ? tx.amount : -tx.amount;
		deltaByWallet.set(tx.walletId, prev + signed);
	}

	return wallets.map((wallet) => {
		const delta = deltaByWallet.get(wallet.id) ?? 0;
		const balance = Math.round((wallet.openingBalance + delta) * 100) / 100;
		return {
			...wallet,
			balance,
		};
	});
}

/**
 * Automatically flags unpaid sent invoices past their due date as `overdue`.
 */
export function normalizeInvoices(
	invoices: Invoice[],
	todayISO: string,
): Invoice[] {
	return invoices.map((inv) => {
		if (inv.status === "paid" || inv.status === "draft") {
			return inv;
		}
		const isPastDue = diffDaysISO(todayISO, inv.dueDate) < 0;
		return {
			...inv,
			status: isPastDue ? "overdue" : "sent",
		};
	});
}

/**
 * Computes days remaining in the current cycle and human-readable target date
 * (days remaining until end of current month, rolling into next month if 0 days left).
 */
export function getCycleCountdown(
	todayISO: string,
	_profile?: UserProfile,
): { daysRemaining: number; cycleEndDateLabel: string } {
	const [year, month] = todayISO.split("-").map(Number);

	const lastDayOfMonth = new Date(year, month, 0);
	const targetISO = `${lastDayOfMonth.getFullYear()}-${String(
		lastDayOfMonth.getMonth() + 1,
	).padStart(2, "0")}-${String(lastDayOfMonth.getDate()).padStart(2, "0")}`;
	const rawDiff = diffDaysISO(todayISO, targetISO);

	if (rawDiff <= 0) {
		const nextMonthEnd = new Date(year, month + 1, 0);
		const nextISO = `${nextMonthEnd.getFullYear()}-${String(
			nextMonthEnd.getMonth() + 1,
		).padStart(2, "0")}-${String(nextMonthEnd.getDate()).padStart(2, "0")}`;
		return {
			daysRemaining: Math.max(1, diffDaysISO(todayISO, nextISO)),
			cycleEndDateLabel: new Intl.DateTimeFormat("en-US", {
				month: "short",
				day: "numeric",
			}).format(nextMonthEnd),
		};
	}

	return {
		daysRemaining: rawDiff,
		cycleEndDateLabel: new Intl.DateTimeFormat("en-US", {
			month: "short",
			day: "numeric",
		}).format(lastDayOfMonth),
	};
}

/**
 * Core Safe-to-Spend Calculation Engine (PRD §4.2):
 * Safe-to-Spend Daily = (Net Available Cash - Scheduled Obligations) / Days Left in Cycle
 */
export function calculateSafeToSpend(params: {
	wallets: Wallet[];
	transactions: Transaction[];
	committedBills: CommittedBill[];
	profile: UserProfile;
	todayISO: string;
}): SafeToSpendMetrics {
	const { wallets, transactions, committedBills, profile, todayISO } = params;

	const totalCashOnHand = wallets.reduce((sum, w) => sum + w.balance, 0);
	const netAvailableCash = totalCashOnHand - profile.emergencyBuffer;
	const committedFixedOutflows = committedBills
		.filter((bill) => !bill.isPaidThisCycle)
		.reduce((sum, bill) => sum + bill.amount, 0);

	const { daysRemaining, cycleEndDateLabel } = getCycleCountdown(
		todayISO,
		profile,
	);

	const discretionaryPool = netAvailableCash - committedFixedOutflows;
	const rawDaily = discretionaryPool / daysRemaining;
	const dailySafeToSpend = Math.round(rawDaily * 100) / 100;

	const thirtyDaysAgo = addDaysISO(todayISO, -30);
	const last30Outflow = transactions
		.filter((tx) => tx.type === "money_out" && tx.date >= thirtyDaysAgo)
		.reduce((sum, tx) => sum + tx.amount, 0);

	const effectiveMonthlyBurn = Math.max(
		last30Outflow,
		committedFixedOutflows,
		1,
	);
	const runwayMonths =
		totalCashOnHand <= 0
			? 0
			: Math.round((totalCashOnHand / effectiveMonthlyBurn) * 10) / 10;

	const baseline = Math.max(profile.baselineDailyTarget, 1);
	let status: SafeToSpendStatus;

	if (dailySafeToSpend < 0 || totalCashOnHand < committedFixedOutflows) {
		status = "deficit";
	} else if (dailySafeToSpend >= baseline * 1.2) {
		status = "healthy";
	} else {
		status = "caution";
	}

	return {
		totalCashOnHand,
		netAvailableCash,
		committedFixedOutflows,
		daysRemainingInCycle: daysRemaining,
		cycleEndDateLabel,
		dailySafeToSpend,
		status,
		runwayMonths,
	};
}

export interface MonthlySummary {
	moneyIn: number;
	moneyOut: number;
	netFlow: number;
	inflowCount: number;
	outflowCount: number;
	topOutflowCategories: Array<{
		category: string;
		amount: number;
		percentage: number;
	}>;
}

export function calculateMonthlySummary(
	transactions: Transaction[],
	todayISO: string,
	walletFilterId?: string,
): MonthlySummary {
	const windowStartISO = addDaysISO(todayISO, -30);
	let moneyIn = 0;
	let moneyOut = 0;
	let inflowCount = 0;
	let outflowCount = 0;
	const categoryTotals = new Map<string, number>();

	for (const tx of transactions) {
		if (
			walletFilterId &&
			walletFilterId !== "all" &&
			tx.walletId !== walletFilterId
		) {
			continue;
		}
		if (tx.date < windowStartISO || tx.date > todayISO) {
			continue;
		}
		if (tx.type === "money_in") {
			moneyIn = Math.round((moneyIn + tx.amount) * 100) / 100;
			inflowCount += 1;
		} else {
			moneyOut = Math.round((moneyOut + tx.amount) * 100) / 100;
			outflowCount += 1;
			categoryTotals.set(
				tx.category,
				(categoryTotals.get(tx.category) ?? 0) + tx.amount,
			);
		}
	}

	const topOutflowCategories = Array.from(categoryTotals.entries())
		.map(([category, amount]) => ({
			category,
			amount: Math.round(amount * 100) / 100,
			percentage: moneyOut > 0 ? Math.round((amount / moneyOut) * 100) : 0,
		}))
		.sort((a, b) => b.amount - a.amount);

	return {
		moneyIn,
		moneyOut,
		netFlow: Math.round((moneyIn - moneyOut) * 100) / 100,
		inflowCount,
		outflowCount,
		topOutflowCategories,
	};
}

/**
 * Builds interactive Area Chart series across 1W, 1M, 3M, 6M, and 1Y windows (PRD §4.3 & §6):
 * - 1W: Daily points (7 days)
 * - 1M: Daily points (30 days)
 * - 3M: Weekly buckets (13 weeks / 90 days)
 * - 6M: Bi-weekly buckets (13 buckets / 180 days)
 * - 1Y: Monthly buckets (12 months / 365 days)
 */
export function buildAreaChartSeries(
	transactions: Transaction[],
	todayISO: string,
	timeRange: ChartTimeRange,
	walletFilterId?: string,
): AreaChartDataPoint[] {
	const filtered = transactions.filter(
		(tx) =>
			!walletFilterId ||
			walletFilterId === "all" ||
			tx.walletId === walletFilterId,
	);

	if (timeRange === "1W" || timeRange === "1M") {
		const days = timeRange === "1W" ? 7 : 30;
		const buckets = new Map<string, { income: number; expenses: number }>();

		for (let i = days - 1; i >= 0; i--) {
			const dateISO = addDaysISO(todayISO, -i);
			buckets.set(dateISO, { income: 0, expenses: 0 });
		}

		for (const tx of filtered) {
			const slot = buckets.get(tx.date);
			if (!slot) continue;
			if (tx.type === "money_in") {
				slot.income = Math.round((slot.income + tx.amount) * 100) / 100;
			} else {
				slot.expenses = Math.round((slot.expenses + tx.amount) * 100) / 100;
			}
		}

		return Array.from(buckets.entries()).map(([date, vals]) => ({
			date,
			label: formatShortAxisDate(date),
			tooltipDate: formatFullDate(date),
			income: vals.income,
			expenses: vals.expenses,
			net: Math.round((vals.income - vals.expenses) * 100) / 100,
		}));
	}

	if (timeRange === "3M" || timeRange === "6M") {
		const stepDays = timeRange === "3M" ? 7 : 14;
		const bucketCount = 13;
		const points: AreaChartDataPoint[] = [];

		for (let idx = bucketCount - 1; idx >= 0; idx--) {
			const bucketEnd = addDaysISO(todayISO, -(idx * stepDays));
			const bucketStart = addDaysISO(bucketEnd, -(stepDays - 1));

			let income = 0;
			let expenses = 0;
			for (const tx of filtered) {
				if (tx.date >= bucketStart && tx.date <= bucketEnd) {
					if (tx.type === "money_in") income += tx.amount;
					else expenses += tx.amount;
				}
			}

			const roundedIn = Math.round(income * 100) / 100;
			const roundedOut = Math.round(expenses * 100) / 100;

			points.push({
				date: bucketEnd,
				label: formatShortAxisDate(bucketEnd),
				tooltipDate: `${formatShortAxisDate(bucketStart)} – ${formatFullDate(bucketEnd)}`,
				income: roundedIn,
				expenses: roundedOut,
				net: Math.round((roundedIn - roundedOut) * 100) / 100,
			});
		}

		return points;
	}

	// 1Y: 12 monthly buckets up to current month
	const [curYear, curMonth] = todayISO.split("-").map(Number);
	const monthlyPoints: AreaChartDataPoint[] = [];

	for (let mOffset = 11; mOffset >= 0; mOffset--) {
		const d = new Date(curYear, (curMonth || 1) - 1 - mOffset, 1);
		const ymPrefix = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
			2,
			"0",
		)}`;
		const monthISO = `${ymPrefix}-01`;

		let income = 0;
		let expenses = 0;
		for (const tx of filtered) {
			if (tx.date.startsWith(ymPrefix) && tx.date <= todayISO) {
				if (tx.type === "money_in") income += tx.amount;
				else expenses += tx.amount;
			}
		}

		const roundedIn = Math.round(income * 100) / 100;
		const roundedOut = Math.round(expenses * 100) / 100;

		monthlyPoints.push({
			date: monthISO,
			label: new Intl.DateTimeFormat("en-US", { month: "short" }).format(d),
			tooltipDate: formatMonthYear(monthISO),
			income: roundedIn,
			expenses: roundedOut,
			net: Math.round((roundedIn - roundedOut) * 100) / 100,
		});
	}

	return monthlyPoints;
}

/**
 * Generic 10-item pagination utility (PRD §4.4 & §6).
 */
export function paginateItems<T>(
	items: T[],
	requestedPage: number,
	pageSize = 10,
): PaginatedResponse<T> {
	const totalItems = items.length;
	const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
	const currentPage = Math.min(Math.max(1, requestedPage), totalPages);
	const startIdx = (currentPage - 1) * pageSize;
	const data = items.slice(startIdx, startIdx + pageSize);

	return {
		data,
		totalItems,
		currentPage,
		pageSize,
		totalPages,
	};
}

export interface InvoiceBoardSummary {
	waitingAmount: number;
	waitingCount: number;
	overdueAmount: number;
	overdueCount: number;
	collectedThisMonthAmount: number;
	collectedThisMonthCount: number;
}

export function calculateInvoiceSummary(
	invoices: Invoice[],
	todayISO: string,
): InvoiceBoardSummary {
	const thirtyDaysAgo = addDaysISO(todayISO, -30);
	let waitingAmount = 0;
	let waitingCount = 0;
	let overdueAmount = 0;
	let overdueCount = 0;
	let collectedThisMonthAmount = 0;
	let collectedThisMonthCount = 0;

	for (const inv of invoices) {
		if (inv.status === "sent" || inv.status === "overdue") {
			waitingAmount += inv.totalAmount;
			waitingCount += 1;
		}
		if (inv.status === "overdue") {
			overdueAmount += inv.totalAmount;
			overdueCount += 1;
		}
		if (
			inv.status === "paid" &&
			(!inv.paidAtDate || inv.paidAtDate >= thirtyDaysAgo)
		) {
			collectedThisMonthAmount += inv.totalAmount;
			collectedThisMonthCount += 1;
		}
	}

	return {
		waitingAmount,
		waitingCount,
		overdueAmount,
		overdueCount,
		collectedThisMonthAmount,
		collectedThisMonthCount,
	};
}

export interface EnvelopeBreakdown {
	needsSpent: number;
	needsBudget: number;
	wantsSpent: number;
	wantsBudget: number;
	savingsReserved: number;
	savingsTarget: number;
}

const NEEDS_CATEGORIES = new Set([
	"Rent",
	"Groceries",
	"Utilities",
	"Commute",
	"Workspace",
	"Store Rent",
]);

export function calculateEmployeeEnvelopes(
	transactions: Transaction[],
	wallets: Wallet[],
	todayISO: string,
): EnvelopeBreakdown {
	const startISO = addDaysISO(todayISO, -30);
	let monthlyInflow = 0;
	let needsSpent = 0;
	let wantsSpent = 0;

	for (const tx of transactions) {
		if (tx.date < startISO || tx.date > todayISO) continue;
		if (tx.type === "money_in") {
			monthlyInflow += tx.amount;
		} else if (NEEDS_CATEGORIES.has(tx.category)) {
			needsSpent += tx.amount;
		} else {
			wantsSpent += tx.amount;
		}
	}

	const baseIncome = Math.max(monthlyInflow, 4000);
	const reserveWalletTotal = wallets.reduce(
		(sum, w) => sum + Math.max(0, w.balance),
		0,
	);

	return {
		needsSpent,
		needsBudget: Math.round(baseIncome * 0.5),
		wantsSpent,
		wantsBudget: Math.round(baseIncome * 0.3),
		savingsReserved: Math.round(reserveWalletTotal * 0.25),
		savingsTarget: Math.round(baseIncome * 0.2),
	};
}

export interface MsmeMarginMetrics {
	todaySales: number;
	todayCosts: number;
	todayNetMargin: number;
	marginPercent: number;
	businessWalletTotal: number;
	personalWalletTotal: number;
}

export function calculateMsmeMargin(
	transactions: Transaction[],
	wallets: Wallet[],
	todayISO: string,
): MsmeMarginMetrics {
	let todaySales = 0;
	let todayCosts = 0;

	for (const tx of transactions) {
		if (tx.date !== todayISO) continue;
		if (tx.type === "money_in" && tx.isBusiness) {
			todaySales += tx.amount;
		} else if (tx.type === "money_out" && tx.isBusiness) {
			todayCosts += tx.amount;
		}
	}

	const todayNetMargin = todaySales - todayCosts;
	const marginPercent =
		todaySales > 0 ? Math.round((todayNetMargin / todaySales) * 100) : 0;

	const businessWalletTotal = wallets
		.filter((w) => w.isBusinessWallet)
		.reduce((sum, w) => sum + w.balance, 0);
	const personalWalletTotal = wallets
		.filter((w) => !w.isBusinessWallet)
		.reduce((sum, w) => sum + w.balance, 0);

	return {
		todaySales,
		todayCosts,
		todayNetMargin,
		marginPercent,
		businessWalletTotal,
		personalWalletTotal,
	};
}
