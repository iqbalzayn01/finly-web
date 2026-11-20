import { z } from "zod";
import type {
	FinlyPersistedState,
	Transaction,
	TransactionDraft,
	Wallet,
} from "#/types/finly";

const DB_NAME = "finly_ledger_db";
const DB_VERSION = 1;
const STORE_NAME = "workspace";
const WORKSPACE_KEY = "finly_workspace_v1";
const DRAFT_KEY = "finly_unsaved_tx_draft_v1";
const CURRENT_WORKSPACE_VERSION = 3;

const finiteNumber = z.number().finite();
const isoDateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

const paymentDetailsSchema = z.object({
	bankName: z.string(),
	accountNumber: z.string(),
	accountHolder: z.string(),
	defaultTermsDays: finiteNumber.min(0).max(365),
	notes: z.string().optional(),
});

const userProfileSchema = z.object({
	id: z.string().min(1),
	displayName: z.string(),
	businessName: z.string().optional(),
	email: z.string(),
	currency: z.literal("USD"),
	plainTermsEnabled: z.boolean(),
	privacyBlurEnabled: z.boolean(),
	emergencyBuffer: finiteNumber.min(0),
	baselineDailyTarget: finiteNumber.min(0),
	themePreference: z.enum(["system", "light", "dark"]),
	paymentDetails: paymentDetailsSchema,
});

const walletSchema = z.object({
	id: z.string().min(1),
	name: z.string(),
	openingBalance: finiteNumber,
	balance: finiteNumber,
	isBusinessWallet: z.boolean(),
});

const transactionSchema = z.object({
	id: z.string().min(1),
	date: isoDateString,
	amount: finiteNumber.min(0),
	type: z.enum(["money_in", "money_out"]),
	category: z.string(),
	walletId: z.string(),
	note: z.string().optional(),
	isBusiness: z.boolean().optional(),
	invoiceReferenceId: z.string().optional(),
	createdAt: finiteNumber,
});

const invoiceItemSchema = z.object({
	id: z.string().min(1),
	description: z.string(),
	quantity: finiteNumber.min(0),
	unitPrice: finiteNumber.min(0),
	total: finiteNumber.min(0),
});

const invoiceSchema = z.object({
	id: z.string().min(1),
	invoiceNumber: z.string(),
	projectTitle: z.string().optional(),
	clientName: z.string(),
	clientPhone: z.string().optional(),
	clientEmail: z.string().optional(),
	issueDate: isoDateString,
	dueDate: isoDateString,
	items: z.array(invoiceItemSchema),
	subtotal: finiteNumber.min(0),
	taxRatePercent: finiteNumber.min(0).max(100),
	totalAmount: finiteNumber.min(0),
	status: z.enum(["draft", "sent", "overdue", "paid"]),
	paymentInstructions: z.string().optional(),
	paidAtDate: isoDateString.optional(),
	cashflowTransactionId: z.string().optional(),
});

const committedBillSchema = z.object({
	id: z.string().min(1),
	title: z.string(),
	amount: finiteNumber.min(0),
	dueDay: finiteNumber.int().min(1).max(31),
	category: z.string(),
	isPaidThisCycle: z.boolean(),
});

const persistedWorkspaceSchema = z.object({
	version: z.literal(CURRENT_WORKSPACE_VERSION),
	profile: userProfileSchema,
	wallets: z.array(walletSchema),
	transactions: z.array(transactionSchema),
	invoices: z.array(invoiceSchema),
	committedBills: z.array(committedBillSchema),
});

const transactionDraftSchema = z.object({
	type: z.enum(["money_in", "money_out"]),
	rawAmount: z.string(),
	category: z.string(),
	walletId: z.string(),
	note: z.string(),
	isBusiness: z.boolean(),
	updatedAt: finiteNumber,
});

function parsePersistedWorkspace(raw: unknown): FinlyPersistedState | null {
	const result = persistedWorkspaceSchema.safeParse(raw);
	return result.success ? result.data : null;
}

function isBrowser(): boolean {
	return typeof window !== "undefined";
}

function openIndexedDB(): Promise<IDBDatabase | null> {
	if (!isBrowser() || typeof window.indexedDB === "undefined") {
		return Promise.resolve(null);
	}

	return new Promise((resolve) => {
		try {
			const request = window.indexedDB.open(DB_NAME, DB_VERSION);

			request.onupgradeneeded = () => {
				const db = request.result;
				if (!db.objectStoreNames.contains(STORE_NAME)) {
					db.createObjectStore(STORE_NAME);
				}
			};

			request.onsuccess = () => resolve(request.result);
			request.onerror = () => resolve(null);
		} catch {
			resolve(null);
		}
	});
}

export async function loadPersistedWorkspace(): Promise<FinlyPersistedState | null> {
	if (!isBrowser()) return null;

	const db = await openIndexedDB();
	if (db) {
		const idbData = await new Promise<unknown>((resolve) => {
			try {
				const tx = db.transaction(STORE_NAME, "readonly");
				const store = tx.objectStore(STORE_NAME);
				const req = store.get(WORKSPACE_KEY);
				req.onsuccess = () => resolve(req.result ?? null);
				req.onerror = () => resolve(null);
			} catch {
				resolve(null);
			}
		});
		db.close();
		const validatedIdb = parsePersistedWorkspace(idbData);
		if (validatedIdb) {
			return validatedIdb;
		}
	}

	try {
		const raw = window.localStorage.getItem(WORKSPACE_KEY);
		if (!raw) return null;
		return parsePersistedWorkspace(JSON.parse(raw));
	} catch {
		return null;
	}
}

export async function savePersistedWorkspace(
	state: FinlyPersistedState,
): Promise<void> {
	if (!isBrowser()) return;

	try {
		window.localStorage.setItem(WORKSPACE_KEY, JSON.stringify(state));
	} catch {
		// Ignore quota errors on fallback mirror
	}

	const db = await openIndexedDB();
	if (!db) return;

	await new Promise<void>((resolve) => {
		try {
			const tx = db.transaction(STORE_NAME, "readwrite");
			const store = tx.objectStore(STORE_NAME);
			store.put(state, WORKSPACE_KEY);
			tx.oncomplete = () => resolve();
			tx.onerror = () => resolve();
		} catch {
			resolve();
		}
	});
	db.close();
}

export async function erasePersistedWorkspace(): Promise<void> {
	if (!isBrowser()) return;

	try {
		window.localStorage.removeItem(WORKSPACE_KEY);
		window.localStorage.removeItem(DRAFT_KEY);
	} catch {
		// Ignore storage access errors
	}

	const db = await openIndexedDB();
	if (!db) return;

	await new Promise<void>((resolve) => {
		try {
			const tx = db.transaction(STORE_NAME, "readwrite");
			const store = tx.objectStore(STORE_NAME);
			store.delete(WORKSPACE_KEY);
			tx.oncomplete = () => resolve();
			tx.onerror = () => resolve();
		} catch {
			resolve();
		}
	});
	db.close();
}

export function loadTransactionDraft(): TransactionDraft | null {
	if (!isBrowser()) return null;
	try {
		const raw = window.localStorage.getItem(DRAFT_KEY);
		if (!raw) return null;
		const parsed = transactionDraftSchema.safeParse(JSON.parse(raw));
		return parsed.success ? parsed.data : null;
	} catch {
		return null;
	}
}

export function saveTransactionDraft(draft: TransactionDraft): void {
	if (!isBrowser()) return;
	try {
		window.localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
	} catch {
		// Ignore storage quota errors
	}
}

export function clearTransactionDraft(): void {
	if (!isBrowser()) return;
	try {
		window.localStorage.removeItem(DRAFT_KEY);
	} catch {
		// Ignore storage access errors
	}
}

const CSV_FORMULA_PREFIX = /^[=+\-@\t\r]/;

function escapeCsvCell(value: string | number | boolean): string {
	const raw = String(value ?? "");
	const neutralized =
		typeof value === "string" && CSV_FORMULA_PREFIX.test(raw)
			? `'${raw}`
			: raw;

	if (/[",\n\r]/.test(neutralized)) {
		return `"${neutralized.replace(/"/g, '""')}"`;
	}
	return neutralized;
}

export function downloadTransactionsCsv(
	transactions: Transaction[],
	wallets: Wallet[],
	currency: string,
): void {
	if (!isBrowser()) return;

	const walletNames = new Map(wallets.map((w) => [w.id, w.name]));
	const headers = [
		"ID",
		"Date",
		"Type",
		"Amount",
		"Currency",
		"Category",
		"Wallet",
		"Business Expense",
		"Invoice Reference",
		"Note",
	];

	const rows = transactions.map((tx) => [
		tx.id,
		tx.date,
		tx.type === "money_in" ? "Money In" : "Money Out",
		Number(tx.amount.toFixed(2)),
		currency,
		tx.category,
		walletNames.get(tx.walletId) ?? tx.walletId,
		tx.isBusiness ? "Yes" : "No",
		tx.invoiceReferenceId ?? "",
		tx.note ?? "",
	]);

	const csvContent = [
		headers.map(escapeCsvCell).join(","),
		...rows.map((row) => row.map(escapeCsvCell).join(",")),
	].join("\n");

	triggerFileDownload(
		csvContent,
		`finly-ledger-${new Date().toISOString().slice(0, 10)}.csv`,
		"text/csv;charset=utf-8;",
	);
}

export function downloadWorkspaceJson(state: FinlyPersistedState): void {
	if (!isBrowser()) return;
	const json = JSON.stringify(state, null, 2);
	triggerFileDownload(
		json,
		`finly-backup-${new Date().toISOString().slice(0, 10)}.json`,
		"application/json;charset=utf-8;",
	);
}

function triggerFileDownload(
	content: string,
	filename: string,
	mimeType: string,
): void {
	const blob = new Blob([content], { type: mimeType });
	const url = URL.createObjectURL(blob);
	const anchor = document.createElement("a");
	anchor.href = url;
	anchor.download = filename;
	anchor.rel = "noopener noreferrer";
	document.body.appendChild(anchor);
	anchor.click();
	document.body.removeChild(anchor);
	window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
