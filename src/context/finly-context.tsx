import type { ReactNode } from "react";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import { toast } from "sonner";
import {
	calculateSafeToSpend,
	normalizeInvoices,
	reconcileWallets,
} from "#/lib/cashflow";
import type { TerminologyLabels } from "#/lib/constants";
import { createSeedWorkspaceState, getTerminology } from "#/lib/constants";
import { formatCurrency, getTodayISO } from "#/lib/format";
import {
	downloadTransactionsCsv,
	downloadWorkspaceJson,
	erasePersistedWorkspace,
	loadPersistedWorkspace,
	savePersistedWorkspace,
} from "#/lib/storage";
import type {
	CommittedBill,
	FinlyPersistedState,
	Invoice,
	InvoiceItem,
	InvoiceStatus,
	SafeToSpendMetrics,
	Transaction,
	TransactionType,
	UserProfile,
	Wallet,
} from "#/types/finly";

export interface AddTransactionInput {
	amount: number;
	type: TransactionType;
	category: string;
	walletId: string;
	date?: string;
	note?: string;
	isBusiness?: boolean;
	invoiceReferenceId?: string;
}

export interface CreateInvoiceInput {
	clientName: string;
	projectTitle?: string;
	clientPhone?: string;
	clientEmail?: string;
	issueDate: string;
	dueDate: string;
	items: Omit<InvoiceItem, "id" | "total">[];
	taxRatePercent: number;
	status: "draft" | "sent";
	paymentInstructions?: string;
}

export interface SettleInvoiceInput {
	invoiceId: string;
	walletId: string;
	category: string;
	paidDate: string;
	syncToCashflow: boolean;
}

export interface OnboardingPayload {
	displayName: string;
	email: string;
	startingBalance: number;
}

interface FinlyContextValue {
	isHydrated: boolean;
	todayISO: string;
	profile: UserProfile;
	wallets: Wallet[];
	transactions: Transaction[];
	invoices: Invoice[];
	committedBills: CommittedBill[];
	safeToSpend: SafeToSpendMetrics;
	terminology: TerminologyLabels;
	isInvoicingVisible: boolean;
	selectedWalletId: string;
	setSelectedWalletId: (walletId: string) => void;

	// Quick Transaction Modal State
	isQuickEntryOpen: boolean;
	quickEntryDefaultType: TransactionType;
	openQuickEntry: (defaultType?: TransactionType) => void;
	closeQuickEntry: () => void;

	// Actions
	togglePrivacyBlur: (forceState?: boolean) => void;
	updateProfile: (patch: Partial<UserProfile>) => void;
	completeOnboarding: (payload: OnboardingPayload) => void;
	addTransaction: (input: AddTransactionInput) => Transaction;
	deleteTransaction: (id: string) => void;
	createInvoice: (input: CreateInvoiceInput) => Invoice;
	deleteInvoice: (id: string) => void;
	settleInvoice: (input: SettleInvoiceInput) => void;
	toggleCommittedBill: (billId: string) => void;
	addWallet: (input: {
		name: string;
		openingBalance: number;
		isBusinessWallet: boolean;
	}) => void;
	exportCsv: () => void;
	exportJson: () => void;
	resetWorkspaceEmpty: () => Promise<void>;
	restoreDemoWorkspace: () => Promise<void>;
}

const FinlyContext = createContext<FinlyContextValue | null>(null);

function createUniqueId(prefix: string): string {
	if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
		return `${prefix}_${crypto.randomUUID().slice(0, 12)}`;
	}
	return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function getNextInvoiceNumber(invoices: Invoice[]): string {
	let maxSeq = 0;
	for (const inv of invoices) {
		const match = /^INV-(\d+)$/i.exec(inv.invoiceNumber.trim());
		if (match) {
			const seq = Number.parseInt(match[1], 10);
			if (Number.isFinite(seq) && seq > maxSeq) {
				maxSeq = seq;
			}
		}
	}
	return `INV-${String(maxSeq + 1).padStart(3, "0")}`;
}

function normalizeWorkspace(
	raw: FinlyPersistedState,
	todayISO: string,
): FinlyPersistedState {
	const sortedTransactions = [...raw.transactions].sort((a, b) => {
		if (a.date !== b.date) return b.date.localeCompare(a.date);
		return b.createdAt - a.createdAt;
	});

	return {
		...raw,
		version: 3,
		profile: {
			...raw.profile,
			currency: "USD",
		},
		transactions: sortedTransactions,
		wallets: reconcileWallets(raw.wallets, sortedTransactions),
		invoices: normalizeInvoices(raw.invoices, todayISO),
	};
}

export function FinlyProvider({ children }: { children: ReactNode }) {
	// Deterministic initial date for SSR consistency; refreshed on client mount
	const [todayISO, setTodayISO] = useState<string>("2026-10-31");
	const [workspace, setWorkspace] = useState<FinlyPersistedState>(() =>
		normalizeWorkspace(createSeedWorkspaceState("2026-10-31"), "2026-10-31"),
	);
	const [isHydrated, setIsHydrated] = useState(false);
	const [selectedWalletId, setSelectedWalletId] = useState<string>("all");
	const [isQuickEntryOpen, setIsQuickEntryOpen] = useState(false);
	const [quickEntryDefaultType, setQuickEntryDefaultType] =
		useState<TransactionType>("money_out");

	// Hydrate from IndexedDB / LocalStorage on client mount
	useEffect(() => {
		let cancelled = false;
		const clientToday = getTodayISO();
		setTodayISO(clientToday);

		loadPersistedWorkspace().then((saved) => {
			if (cancelled) return;
			if (saved && saved.version === 3) {
				setWorkspace(normalizeWorkspace(saved, clientToday));
			} else {
				const seeded = normalizeWorkspace(
					createSeedWorkspaceState(clientToday),
					clientToday,
				);
				setWorkspace(seeded);
				void savePersistedWorkspace(seeded);
			}
			setIsHydrated(true);
		});

		return () => {
			cancelled = true;
		};
	}, []);

	const commitWorkspace = useCallback(
		(updater: (prev: FinlyPersistedState) => FinlyPersistedState) => {
			setWorkspace((prev) => {
				const updated = normalizeWorkspace(updater(prev), todayISO);
				void savePersistedWorkspace(updated);
				return updated;
			});
		},
		[todayISO],
	);

	const openQuickEntry = useCallback((defaultType?: TransactionType) => {
		if (defaultType) {
			setQuickEntryDefaultType(defaultType);
		}
		setIsQuickEntryOpen(true);
	}, []);

	const closeQuickEntry = useCallback(() => {
		setIsQuickEntryOpen(false);
	}, []);

	const togglePrivacyBlur = useCallback(
		(forceState?: boolean) => {
			const nextBlur =
				typeof forceState === "boolean"
					? forceState
					: !workspace.profile.privacyBlurEnabled;

			commitWorkspace((prev) => ({
				...prev,
				profile: {
					...prev.profile,
					privacyBlurEnabled: nextBlur,
				},
			}));

			toast.info(
				nextBlur
					? "Privacy mask enabled — balances hidden"
					: "Privacy mask turned off",
				{ id: "privacy-mask-toast" },
			);
		},
		[commitWorkspace, workspace.profile.privacyBlurEnabled],
	);

	const updateProfile = useCallback(
		(patch: Partial<UserProfile>) => {
			commitWorkspace((prev) => ({
				...prev,
				profile: {
					...prev.profile,
					...patch,
					paymentDetails: patch.paymentDetails
						? { ...prev.profile.paymentDetails, ...patch.paymentDetails }
						: prev.profile.paymentDetails,
				},
			}));
		},
		[commitWorkspace],
	);

	const completeOnboarding = useCallback(
		(payload: OnboardingPayload) => {
			const defaultWallets: Wallet[] = [
				{
					id: "wal_business",
					name: "Main Business Account",
					openingBalance: payload.startingBalance,
					balance: payload.startingBalance,
					isBusinessWallet: true,
				},
				{
					id: "wal_checking",
					name: "Checking Debit",
					openingBalance: 0,
					balance: 0,
					isBusinessWallet: false,
				},
			];

			commitWorkspace((prev) => ({
				...prev,
				profile: {
					...prev.profile,
					displayName: payload.displayName.trim() || prev.profile.displayName,
					email: payload.email.trim() || prev.profile.email,
					paymentDetails: {
						...prev.profile.paymentDetails,
						accountHolder:
							payload.displayName.trim() ||
							prev.profile.paymentDetails.accountHolder,
					},
				},
				wallets: defaultWallets,
				transactions: [],
				invoices: [],
			}));
			setSelectedWalletId("all");
			toast.success("Workspace configured and ready!");
		},
		[commitWorkspace],
	);

	const addTransaction = useCallback(
		(input: AddTransactionInput): Transaction => {
			const fallbackWalletId = workspace.wallets[0]?.id ?? "wal_business";
			const safeAmount = Number.isFinite(input.amount)
				? Math.round(Math.abs(input.amount) * 100) / 100
				: 0;
			const newTx: Transaction = {
				id: createUniqueId("tx"),
				date: input.date || todayISO,
				amount: safeAmount,
				type: input.type,
				category: input.category.trim() || "Other",
				walletId: input.walletId || fallbackWalletId,
				note: input.note?.trim() || undefined,
				isBusiness: input.isBusiness ?? true,
				invoiceReferenceId: input.invoiceReferenceId,
				createdAt: Date.now(),
			};

			commitWorkspace((prev) => ({
				...prev,
				transactions: [newTx, ...prev.transactions],
			}));

			const label =
				input.type === "money_in"
					? getTerminology(workspace.profile.plainTermsEnabled).inflow
					: getTerminology(workspace.profile.plainTermsEnabled).outflow;

			toast.success(
				`${label} recorded: ${formatCurrency(newTx.amount, workspace.profile.currency)}`,
			);
			return newTx;
		},
		[
			commitWorkspace,
			todayISO,
			workspace.profile.currency,
			workspace.profile.plainTermsEnabled,
			workspace.wallets,
		],
	);

	const deleteTransaction = useCallback(
		(id: string) => {
			commitWorkspace((prev) => ({
				...prev,
				transactions: prev.transactions.filter((tx) => tx.id !== id),
			}));
			toast.info("Transaction removed from ledger");
		},
		[commitWorkspace],
	);

	const createInvoice = useCallback(
		(input: CreateInvoiceInput): Invoice => {
			const invoiceNumber = getNextInvoiceNumber(workspace.invoices);
			const clampedTaxRate = Number.isFinite(input.taxRatePercent)
				? Math.min(100, Math.max(0, input.taxRatePercent))
				: 0;

			const items: InvoiceItem[] = input.items.map((item) => {
				const safeQty = Number.isFinite(item.quantity)
					? Math.max(0, item.quantity)
					: 0;
				const safePrice = Number.isFinite(item.unitPrice)
					? Math.max(0, item.unitPrice)
					: 0;
				const total = Math.round(safeQty * safePrice * 100) / 100;
				return {
					id: createUniqueId("item"),
					description: item.description.trim(),
					quantity: safeQty,
					unitPrice: safePrice,
					total,
				};
			});

			const subtotal =
				Math.round(items.reduce((sum, i) => sum + i.total, 0) * 100) / 100;
			const taxAmount =
				Math.round(subtotal * (clampedTaxRate / 100) * 100) / 100;
			const totalAmount = Math.round((subtotal + taxAmount) * 100) / 100;

			const status: InvoiceStatus = input.status;
			const createdInvoice: Invoice = {
				id: createUniqueId("inv"),
				invoiceNumber,
				projectTitle: input.projectTitle?.trim() || undefined,
				clientName: input.clientName.trim(),
				clientPhone: input.clientPhone?.trim() || undefined,
				clientEmail: input.clientEmail?.trim() || undefined,
				issueDate: input.issueDate,
				dueDate: input.dueDate,
				items,
				subtotal,
				taxRatePercent: clampedTaxRate,
				totalAmount,
				status,
				paymentInstructions: input.paymentInstructions?.trim() || undefined,
			};

			commitWorkspace((prev) => ({
				...prev,
				invoices: [createdInvoice, ...prev.invoices],
			}));

			toast.success(
				status === "draft"
					? `Draft ${invoiceNumber} saved`
					: `Invoice ${invoiceNumber} issued to ${createdInvoice.clientName}`,
			);
			return createdInvoice;
		},
		[commitWorkspace, workspace.invoices],
	);

	const deleteInvoice = useCallback(
		(id: string) => {
			commitWorkspace((prev) => ({
				...prev,
				invoices: prev.invoices.filter((inv) => inv.id !== id),
			}));
			toast.info("Invoice deleted");
		},
		[commitWorkspace],
	);

	const settleInvoice = useCallback(
		(input: SettleInvoiceInput) => {
			const targetInvoice = workspace.invoices.find(
				(inv) => inv.id === input.invoiceId,
			);
			if (!targetInvoice || targetInvoice.status === "paid") return;

			const linkedTxId = input.syncToCashflow
				? createUniqueId("tx_inv")
				: undefined;

			commitWorkspace((prev) => {
				const updatedTransactions = input.syncToCashflow
					? [
							{
								id: linkedTxId as string,
								date: input.paidDate || todayISO,
								amount: targetInvoice.totalAmount,
								type: "money_in" as const,
								category: input.category || "Client Invoices",
								walletId:
									input.walletId || prev.wallets[0]?.id || "wal_business",
								note: `${targetInvoice.clientName} — Invoice #${targetInvoice.invoiceNumber}`,
								isBusiness: true,
								invoiceReferenceId: targetInvoice.id,
								createdAt: Date.now(),
							},
							...prev.transactions,
						]
					: prev.transactions;

				const updatedInvoices = prev.invoices.map((inv) =>
					inv.id === targetInvoice.id
						? {
								...inv,
								status: "paid" as const,
								paidAtDate: input.paidDate || todayISO,
								cashflowTransactionId: linkedTxId,
							}
						: inv,
				);

				return {
					...prev,
					transactions: updatedTransactions,
					invoices: updatedInvoices,
				};
			});

			toast.success(
				input.syncToCashflow
					? `#${targetInvoice.invoiceNumber} settled & ${formatCurrency(targetInvoice.totalAmount, workspace.profile.currency)} added to cashflow`
					: `#${targetInvoice.invoiceNumber} marked as Paid`,
			);
		},
		[commitWorkspace, todayISO, workspace.invoices, workspace.profile.currency],
	);

	const toggleCommittedBill = useCallback(
		(billId: string) => {
			commitWorkspace((prev) => ({
				...prev,
				committedBills: prev.committedBills.map((bill) =>
					bill.id === billId
						? { ...bill, isPaidThisCycle: !bill.isPaidThisCycle }
						: bill,
				),
			}));
		},
		[commitWorkspace],
	);

	const addWallet = useCallback(
		(input: {
			name: string;
			openingBalance: number;
			isBusinessWallet: boolean;
		}) => {
			const safeOpeningBalance = Number.isFinite(input.openingBalance)
				? Math.round(input.openingBalance * 100) / 100
				: 0;
			const wallet: Wallet = {
				id: createUniqueId("wal"),
				name: input.name.trim(),
				openingBalance: safeOpeningBalance,
				balance: safeOpeningBalance,
				isBusinessWallet: input.isBusinessWallet,
			};
			commitWorkspace((prev) => ({
				...prev,
				wallets: [...prev.wallets, wallet],
			}));
			toast.success(`Wallet "${wallet.name}" added`);
		},
		[commitWorkspace],
	);

	const exportCsv = useCallback(() => {
		downloadTransactionsCsv(
			workspace.transactions,
			workspace.wallets,
			workspace.profile.currency,
		);
		toast.success("Cashflow ledger exported as CSV");
	}, [workspace.profile.currency, workspace.transactions, workspace.wallets]);

	const exportJson = useCallback(() => {
		downloadWorkspaceJson(workspace);
		toast.success("Full workspace backup downloaded (.json)");
	}, [workspace]);

	const resetWorkspaceEmpty = useCallback(async () => {
		await erasePersistedWorkspace();
		const emptyState: FinlyPersistedState = {
			...workspace,
			wallets: workspace.wallets.map((w) => ({
				...w,
				openingBalance: 0,
				balance: 0,
			})),
			transactions: [],
			invoices: [],
			committedBills: workspace.committedBills.map((b) => ({
				...b,
				isPaidThisCycle: false,
			})),
		};
		setWorkspace(emptyState);
		await savePersistedWorkspace(emptyState);
		setSelectedWalletId("all");
		toast.success("All transactions and invoices have been erased");
	}, [workspace]);

	const restoreDemoWorkspace = useCallback(async () => {
		const seeded = normalizeWorkspace(
			createSeedWorkspaceState(todayISO),
			todayISO,
		);
		setWorkspace(seeded);
		await savePersistedWorkspace(seeded);
		setSelectedWalletId("all");
		toast.success("Sample cashflow workspace restored");
	}, [todayISO]);

	const safeToSpend = useMemo(
		() =>
			calculateSafeToSpend({
				wallets: workspace.wallets,
				transactions: workspace.transactions,
				committedBills: workspace.committedBills,
				profile: workspace.profile,
				todayISO,
			}),
		[
			todayISO,
			workspace.committedBills,
			workspace.profile,
			workspace.transactions,
			workspace.wallets,
		],
	);

	const terminology = useMemo(
		() => getTerminology(workspace.profile.plainTermsEnabled),
		[workspace.profile.plainTermsEnabled],
	);

	const isInvoicingVisible = true;

	const value = useMemo<FinlyContextValue>(
		() => ({
			isHydrated,
			todayISO,
			profile: workspace.profile,
			wallets: workspace.wallets,
			transactions: workspace.transactions,
			invoices: workspace.invoices,
			committedBills: workspace.committedBills,
			safeToSpend,
			terminology,
			isInvoicingVisible,
			selectedWalletId,
			setSelectedWalletId,
			isQuickEntryOpen,
			quickEntryDefaultType,
			openQuickEntry,
			closeQuickEntry,
			togglePrivacyBlur,
			updateProfile,
			completeOnboarding,
			addTransaction,
			deleteTransaction,
			createInvoice,
			deleteInvoice,
			settleInvoice,
			toggleCommittedBill,
			addWallet,
			exportCsv,
			exportJson,
			resetWorkspaceEmpty,
			restoreDemoWorkspace,
		}),
		[
			addTransaction,
			addWallet,
			closeQuickEntry,
			completeOnboarding,
			createInvoice,
			deleteInvoice,
			deleteTransaction,
			exportCsv,
			exportJson,
			isHydrated,
			isQuickEntryOpen,
			openQuickEntry,
			quickEntryDefaultType,
			resetWorkspaceEmpty,
			restoreDemoWorkspace,
			safeToSpend,
			selectedWalletId,
			settleInvoice,
			terminology,
			todayISO,
			toggleCommittedBill,
			togglePrivacyBlur,
			updateProfile,
			workspace.committedBills,
			workspace.invoices,
			workspace.profile,
			workspace.transactions,
			workspace.wallets,
		],
	);

	return (
		<FinlyContext.Provider value={value}>{children}</FinlyContext.Provider>
	);
}

export function useFinly(): FinlyContextValue {
	const context = useContext(FinlyContext);
	if (!context) {
		throw new Error("useFinly must be used within a <FinlyProvider />");
	}
	return context;
}
