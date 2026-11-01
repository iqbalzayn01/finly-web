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
		const idbData = await new Promise<FinlyPersistedState | null>((resolve) => {
			try {
				const tx = db.transaction(STORE_NAME, "readonly");
				const store = tx.objectStore(STORE_NAME);
				const req = store.get(WORKSPACE_KEY);
				req.onsuccess = () =>
					resolve((req.result as FinlyPersistedState | undefined) ?? null);
				req.onerror = () => resolve(null);
			} catch {
				resolve(null);
			}
		});
		db.close();
		if (idbData && idbData.version === 1) {
			return idbData;
		}
	}

	try {
		const raw = window.localStorage.getItem(WORKSPACE_KEY);
		if (!raw) return null;
		const parsed = JSON.parse(raw) as FinlyPersistedState;
		return parsed?.version === 1 ? parsed : null;
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
		// Ignore
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
		return JSON.parse(raw) as TransactionDraft;
	} catch {
		return null;
	}
}

export function saveTransactionDraft(draft: TransactionDraft): void {
	if (!isBrowser()) return;
	try {
		window.localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
	} catch {
		// Ignore
	}
}

export function clearTransactionDraft(): void {
	if (!isBrowser()) return;
	try {
		window.localStorage.removeItem(DRAFT_KEY);
	} catch {
		// Ignore
	}
}

function escapeCsvCell(value: string | number | boolean): string {
	const str = String(value ?? "");
	if (/[",\n\r]/.test(str)) {
		return `"${str.replace(/"/g, '""')}"`;
	}
	return str;
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
		tx.amount.toFixed(2),
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
	document.body.appendChild(anchor);
	anchor.click();
	document.body.removeChild(anchor);
	URL.revokeObjectURL(url);
}
