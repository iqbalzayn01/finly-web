import { addDaysISO } from "#/lib/format";
import type { FinlyPersistedState, TransactionType } from "#/types/finly";

export const UNIVERSAL_INFLOW_CATEGORIES = [
	"Client Invoices",
	"Salary & Retainers",
	"Sales & Income",
	"Consulting",
	"Internal Transfer",
	"Investment & Other",
];

export const UNIVERSAL_OUTFLOW_CATEGORIES = [
	"Food & Personal",
	"Software & Tools",
	"Workspace & Rent",
	"Groceries",
	"Commute & Fuel",
	"Utilities",
	"Dining & Personal",
	"Equipment",
	"Internal Transfer",
	"Taxes",
];

export function isTransferCategory(category: string): boolean {
	return category.toLowerCase().includes("transfer");
}

export function getUniversalCategories(type: TransactionType): string[] {
	return type === "money_in"
		? UNIVERSAL_INFLOW_CATEGORIES
		: UNIVERSAL_OUTFLOW_CATEGORIES;
}

export interface TerminologyLabels {
	inflow: string;
	outflow: string;
	inflowAction: string;
	outflowAction: string;
	netBalance: string;
	unpaidBills: string;
}

export function getTerminology(plainTermsEnabled: boolean): TerminologyLabels {
	if (plainTermsEnabled) {
		return {
			inflow: "Income",
			outflow: "Expenses",
			inflowAction: "Money In (+)",
			outflowAction: "Money Out (-)",
			netBalance: "Total Balance",
			unpaidBills: "Unpaid Invoices",
		};
	}

	return {
		inflow: "Cash In",
		outflow: "Cash Out",
		inflowAction: "Cash In (+)",
		outflowAction: "Cash Out (-)",
		netBalance: "Total Balance",
		unpaidBills: "Receivables",
	};
}

/**
 * Generates realistic USD workspace data anchored to `todayISO` matching PRD v2.0.0:
 * - Total Balance: $4,250.00 across 2 wallets (Business Bank $3,225.00 + Checking Debit $1,025.00)
 * - Total Income (30d): +$8,500.00 (2 client invoices paid)
 * - Total Expenses (30d): -$4,250.00 (14 expense transactions recorded)
 * - Historical 12-month transactions so 1W, 1M, 3M, 6M, and 1Y interactive area charts render smoothly.
 */
export function createSeedWorkspaceState(
	todayISO: string,
): FinlyPersistedState {
	const baseTimestamp = Date.UTC(2026, 9, 31, 9, 0, 0);

	return {
		version: 3,
		profile: {
			id: "usr_alex_01",
			displayName: "Alex Zayyan",
			businessName: "Studio Monolith",
			email: "alex@designstudio.dev",
			currency: "USD",
			plainTermsEnabled: true,
			privacyBlurEnabled: false,
			emergencyBuffer: 1200,
			baselineDailyTarget: 65,
			themePreference: "dark",
			paymentDetails: {
				bankName: "Chase Business Checking",
				accountNumber: "****9812",
				accountHolder: "Alex Zayyan",
				defaultTermsDays: 14,
				notes: "Please include invoice number in wire memo.",
			},
		},
		wallets: [
			{
				id: "wal_business",
				name: "Business Bank",
				openingBalance: 0,
				balance: 3225,
				isBusinessWallet: true,
			},
			{
				id: "wal_checking",
				name: "Checking Debit",
				openingBalance: 0,
				balance: 1025,
				isBusinessWallet: false,
			},
		],
		transactions: [
			// --- Current 30-Day Window (2 Income = +$8,500.00 | 14 Expenses = -$4,250.00) ---
			{
				id: "tx_01",
				date: todayISO,
				amount: 4.5,
				type: "money_out",
				category: "Food & Personal",
				walletId: "wal_checking",
				note: "Specialty Coffee Roasters",
				isBusiness: false,
				createdAt: baseTimestamp + 26000,
			},
			{
				id: "tx_02",
				date: addDaysISO(todayISO, -1),
				amount: 5300,
				type: "money_in",
				category: "Client Invoices",
				walletId: "wal_business",
				note: "UI Design Retainer (#INV-001)",
				isBusiness: true,
				invoiceReferenceId: "inv_001",
				createdAt: baseTimestamp + 25000,
			},
			{
				id: "tx_03",
				date: addDaysISO(todayISO, -2),
				amount: 125,
				type: "money_out",
				category: "Software & Tools",
				walletId: "wal_checking",
				note: "Cloud Server Hosting",
				isBusiness: true,
				createdAt: baseTimestamp + 24000,
			},
			{
				id: "tx_04",
				date: addDaysISO(todayISO, -4),
				amount: 380,
				type: "money_out",
				category: "Workspace",
				walletId: "wal_business",
				note: "Coworking Hot Desk",
				isBusiness: true,
				createdAt: baseTimestamp + 23000,
			},
			{
				id: "tx_05",
				date: addDaysISO(todayISO, -6),
				amount: 164.5,
				type: "money_out",
				category: "Groceries",
				walletId: "wal_checking",
				note: "Weekly Organic Groceries",
				isBusiness: false,
				createdAt: baseTimestamp + 22000,
			},
			{
				id: "tx_06",
				date: addDaysISO(todayISO, -8),
				amount: 45,
				type: "money_out",
				category: "Software & Tools",
				walletId: "wal_business",
				note: "Figma Professional Plan",
				isBusiness: true,
				createdAt: baseTimestamp + 21000,
			},
			{
				id: "tx_07",
				date: addDaysISO(todayISO, -9),
				amount: 62,
				type: "money_out",
				category: "Commute",
				walletId: "wal_checking",
				note: "Gas Station Fill-up",
				isBusiness: false,
				createdAt: baseTimestamp + 20000,
			},
			{
				id: "tx_08",
				date: addDaysISO(todayISO, -11),
				amount: 850,
				type: "money_out",
				category: "Taxes",
				walletId: "wal_business",
				note: "Quarterly Estimated Tax Reserve",
				isBusiness: true,
				createdAt: baseTimestamp + 19000,
			},
			{
				id: "tx_09",
				date: addDaysISO(todayISO, -13),
				amount: 3200,
				type: "money_in",
				category: "Client Invoices",
				walletId: "wal_checking",
				note: "Logo & Design System Sprint",
				isBusiness: true,
				createdAt: baseTimestamp + 18000,
			},
			{
				id: "tx_10",
				date: addDaysISO(todayISO, -14),
				amount: 98,
				type: "money_out",
				category: "Food & Personal",
				walletId: "wal_checking",
				note: "Client Strategy Lunch",
				isBusiness: true,
				createdAt: baseTimestamp + 17000,
			},
			{
				id: "tx_11",
				date: addDaysISO(todayISO, -16),
				amount: 110,
				type: "money_out",
				category: "Utilities",
				walletId: "wal_checking",
				note: "Internet Fiber Connection",
				isBusiness: false,
				createdAt: baseTimestamp + 16000,
			},
			{
				id: "tx_12",
				date: addDaysISO(todayISO, -18),
				amount: 1350,
				type: "money_out",
				category: "Rent",
				walletId: "wal_checking",
				note: "Monthly Apartment Lease",
				isBusiness: false,
				createdAt: baseTimestamp + 15000,
			},
			{
				id: "tx_13",
				date: addDaysISO(todayISO, -20),
				amount: 490,
				type: "money_out",
				category: "Equipment",
				walletId: "wal_business",
				note: "Calibrated 4K Studio Display",
				isBusiness: true,
				createdAt: baseTimestamp + 14000,
			},
			{
				id: "tx_14",
				date: addDaysISO(todayISO, -22),
				amount: 145,
				type: "money_out",
				category: "Groceries",
				walletId: "wal_checking",
				note: "Fresh Market Groceries",
				isBusiness: false,
				createdAt: baseTimestamp + 13000,
			},
			{
				id: "tx_15",
				date: addDaysISO(todayISO, -25),
				amount: 310,
				type: "money_out",
				category: "Workspace",
				walletId: "wal_business",
				note: "Motion Assets Contractor",
				isBusiness: true,
				createdAt: baseTimestamp + 12000,
			},
			{
				id: "tx_16",
				date: addDaysISO(todayISO, -27),
				amount: 116,
				type: "money_out",
				category: "Utilities",
				walletId: "wal_checking",
				note: "City Power & Water Utility",
				isBusiness: false,
				createdAt: baseTimestamp + 11000,
			},

			// --- Historical Entries (3M, 6M, 1Y Trend Points — balanced net $0) ---
			{
				id: "tx_h01",
				date: addDaysISO(todayISO, -45),
				amount: 6400,
				type: "money_in",
				category: "Client Invoices",
				walletId: "wal_business",
				note: "Q3 Web Platform Milestone",
				isBusiness: true,
				createdAt: baseTimestamp + 10000,
			},
			{
				id: "tx_h02",
				date: addDaysISO(todayISO, -52),
				amount: 4200,
				type: "money_out",
				category: "Workspace",
				walletId: "wal_business",
				note: "Studio Operations & Subcontractors",
				isBusiness: true,
				createdAt: baseTimestamp + 9000,
			},
			{
				id: "tx_h03",
				date: addDaysISO(todayISO, -78),
				amount: 5800,
				type: "money_in",
				category: "Retainers",
				walletId: "wal_checking",
				note: "Product Advisory Retainer",
				isBusiness: true,
				createdAt: baseTimestamp + 8000,
			},
			{
				id: "tx_h04",
				date: addDaysISO(todayISO, -84),
				amount: 5800,
				type: "money_out",
				category: "Rent",
				walletId: "wal_checking",
				note: "Quarterly Lease & Living Allocation",
				isBusiness: false,
				createdAt: baseTimestamp + 7000,
			},
			{
				id: "tx_h05",
				date: addDaysISO(todayISO, -145),
				amount: 7200,
				type: "money_in",
				category: "Client Invoices",
				walletId: "wal_business",
				note: "Mobile App UX Overhaul",
				isBusiness: true,
				createdAt: baseTimestamp + 6000,
			},
			{
				id: "tx_h06",
				date: addDaysISO(todayISO, -155),
				amount: 6500,
				type: "money_out",
				category: "Taxes",
				walletId: "wal_business",
				note: "Mid-Year Tax & Software Renewal",
				isBusiness: true,
				createdAt: baseTimestamp + 5000,
			},
			{
				id: "tx_h07",
				date: addDaysISO(todayISO, -235),
				amount: 5500,
				type: "money_in",
				category: "Client Invoices",
				walletId: "wal_business",
				note: "Spring Brand Sprint Delivery",
				isBusiness: true,
				createdAt: baseTimestamp + 4000,
			},
			{
				id: "tx_h08",
				date: addDaysISO(todayISO, -248),
				amount: 8400,
				type: "money_out",
				category: "Equipment",
				walletId: "wal_business",
				note: "Workstation Upgrade & Studio Rig",
				isBusiness: true,
				createdAt: baseTimestamp + 3000,
			},
			{
				id: "tx_h09",
				date: addDaysISO(todayISO, -315),
				amount: 6100,
				type: "money_in",
				category: "Retainers",
				walletId: "wal_business",
				note: "Annual Design System Retainer",
				isBusiness: true,
				createdAt: baseTimestamp + 2000,
			},
			{
				id: "tx_h10",
				date: addDaysISO(todayISO, -328),
				amount: 6100,
				type: "money_out",
				category: "Taxes",
				walletId: "wal_business",
				note: "Annual Tax Settlement & Studio Insurance",
				isBusiness: true,
				createdAt: baseTimestamp + 1000,
			},
		],
		invoices: [
			{
				id: "inv_004",
				invoiceNumber: "INV-004",
				projectTitle: "Frontend Dashboard Setup",
				clientName: "Acme Design Studio",
				clientPhone: "+1 (555) 019-2834",
				clientEmail: "billing@acmedesign.co",
				issueDate: addDaysISO(todayISO, -5),
				dueDate: addDaysISO(todayISO, 7),
				items: [
					{
						id: "item_4a",
						description: "Frontend Dashboard Setup",
						quantity: 1,
						unitPrice: 1000,
						total: 1000,
					},
					{
						id: "item_4b",
						description: "Mobile UI Responsive Polish",
						quantity: 1,
						unitPrice: 500,
						total: 500,
					},
				],
				subtotal: 1500,
				taxRatePercent: 0,
				totalAmount: 1500,
				status: "sent",
				paymentInstructions:
					"Chase Business Checking - Acct #****9812 (Alex Zayyan)\nPlease include invoice number in wire memo.",
			},
			{
				id: "inv_003",
				invoiceNumber: "INV-003",
				projectTitle: "Brand Identity & Packaging Kit",
				clientName: "Northstar Coffee Co",
				clientPhone: "+1 (415) 555-0142",
				clientEmail: "ap@northstarcoffee.com",
				issueDate: addDaysISO(todayISO, -18),
				dueDate: addDaysISO(todayISO, -3),
				items: [
					{
						id: "item_3a",
						description: "Logo Suite & Storefront Packaging Guidelines",
						quantity: 1,
						unitPrice: 850,
						total: 850,
					},
				],
				subtotal: 850,
				taxRatePercent: 0,
				totalAmount: 850,
				status: "overdue",
				paymentInstructions:
					"Chase Business Checking - Acct #****9812 (Alex Zayyan)",
			},
			{
				id: "inv_002",
				invoiceNumber: "INV-002",
				projectTitle: "Product Strategy Sprint",
				clientName: "Global Media Corp",
				clientPhone: "+1 (212) 555-0148",
				clientEmail: "finance@globalmedia.io",
				issueDate: addDaysISO(todayISO, -3),
				dueDate: addDaysISO(todayISO, 14),
				items: [
					{
						id: "item_2a",
						description: "Interactive Analytics Prototype & UX Audit",
						quantity: 2,
						unitPrice: 900,
						total: 1800,
					},
				],
				subtotal: 1800,
				taxRatePercent: 0,
				totalAmount: 1800,
				status: "sent",
				paymentInstructions:
					"Chase Business Checking - Acct #****9812 (Alex Zayyan)",
			},
			{
				id: "inv_001",
				invoiceNumber: "INV-001",
				projectTitle: "UI Design Retainer",
				clientName: "Startup Lab Inc",
				clientPhone: "+1 (650) 555-0188",
				clientEmail: "finance@startuplab.dev",
				issueDate: addDaysISO(todayISO, -15),
				dueDate: addDaysISO(todayISO, -2),
				items: [
					{
						id: "item_1a",
						description: "Full-Stack Client Dashboard Design & Handoff",
						quantity: 1,
						unitPrice: 5300,
						total: 5300,
					},
				],
				subtotal: 5300,
				taxRatePercent: 0,
				totalAmount: 5300,
				status: "paid",
				paidAtDate: addDaysISO(todayISO, -1),
				cashflowTransactionId: "tx_02",
				paymentInstructions:
					"Chase Business Checking - Acct #****9812 (Alex Zayyan)",
			},
		],
		committedBills: [
			{
				id: "bill_01",
				title: "Cloud Hosting & Domains",
				amount: 95,
				dueDay: 24,
				category: "Utilities",
				isPaidThisCycle: false,
			},
			{
				id: "bill_02",
				title: "Studio Fiber Internet",
				amount: 145,
				dueDay: 27,
				category: "Utilities",
				isPaidThisCycle: false,
			},
			{
				id: "bill_03",
				title: "Health & Studio Insurance",
				amount: 210,
				dueDay: 28,
				category: "Rent",
				isPaidThisCycle: false,
			},
		],
	};
}
