// --- 1. User & Settings Model (PRD v2.0.0 §6) ---
export type SupportedCurrency = "USD";

export type ThemePreference = "system" | "light" | "dark";

export interface PaymentDetails {
	bankName: string;
	accountNumber: string;
	accountHolder: string;
	defaultTermsDays: number;
	notes?: string;
}

export interface UserProfile {
	id: string;
	displayName: string;
	businessName?: string;
	email: string;
	currency: "USD"; // Enforced USD globally (PRD §6)
	plainTermsEnabled: boolean;
	privacyBlurEnabled: boolean;
	emergencyBuffer: number;
	baselineDailyTarget: number;
	themePreference: ThemePreference;
	paymentDetails: PaymentDetails;
}

// --- 2. Cashflow Transaction Model ---
export type TransactionType = "money_in" | "money_out";

export interface Transaction {
	id: string;
	date: string; // ISO 8601 YYYY-MM-DD
	amount: number; // Stored as positive USD float (e.g., 45.00)
	type: TransactionType;
	category: string;
	walletId: string;
	note?: string;
	isBusiness?: boolean;
	invoiceReferenceId?: string;
	createdAt: number; // Unix timestamp
}

// --- 3. Invoice Model ---
export type InvoiceStatus = "draft" | "sent" | "overdue" | "paid";

export interface InvoiceItem {
	id: string;
	description: string;
	quantity: number;
	unitPrice: number; // In USD
	total: number; // In USD
}

export interface Invoice {
	id: string;
	invoiceNumber: string; // e.g., 'INV-004'
	projectTitle?: string;
	clientName: string;
	clientPhone?: string;
	clientEmail?: string;
	issueDate: string; // YYYY-MM-DD
	dueDate: string; // YYYY-MM-DD
	items: InvoiceItem[];
	subtotal: number; // USD
	taxRatePercent: number;
	totalAmount: number; // USD
	status: InvoiceStatus;
	paymentInstructions?: string;
	paidAtDate?: string;
	cashflowTransactionId?: string;
}

// --- 4. Wallet & Committed Bills ---
export interface Wallet {
	id: string;
	name: string;
	openingBalance: number;
	balance: number;
	isBusinessWallet: boolean;
}

export interface CommittedBill {
	id: string;
	title: string;
	amount: number;
	dueDay: number; // 1..28
	category: string;
	isPaidThisCycle: boolean;
}

// --- 5. Interactive Area Chart & Pagination Types (PRD §6) ---
export type ChartTimeRange = "1W" | "1M" | "3M" | "6M" | "1Y";

export interface AreaChartDataPoint {
	date: string; // e.g., "2026-10-14"
	label: string; // Axis label, e.g., "Oct 14"
	tooltipDate: string; // Full label, e.g., "October 14, 2026"
	income: number; // USD
	expenses: number; // USD
	net: number; // USD
}

export interface PaginatedResponse<T> {
	data: T[];
	totalItems: number;
	currentPage: number;
	pageSize: number; // Fixed at 10
	totalPages: number;
}

// --- 6. Draft & Safe-to-Spend Summary Models ---
export interface TransactionDraft {
	type: TransactionType;
	rawAmount: string;
	category: string;
	walletId: string;
	note: string;
	isBusiness: boolean;
	updatedAt: number;
}

export type SafeToSpendStatus = "healthy" | "caution" | "deficit";

export interface SafeToSpendMetrics {
	totalCashOnHand: number;
	netAvailableCash: number;
	committedFixedOutflows: number;
	daysRemainingInCycle: number;
	cycleEndDateLabel: string;
	dailySafeToSpend: number;
	status: SafeToSpendStatus;
	runwayMonths: number;
}

export interface FinlyPersistedState {
	version: number;
	profile: UserProfile;
	wallets: Wallet[];
	transactions: Transaction[];
	invoices: Invoice[];
	committedBills: CommittedBill[];
}
