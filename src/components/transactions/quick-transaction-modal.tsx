import {
	AlertTriangle,
	ArrowDownRight,
	ArrowUpRight,
	Plus,
	RotateCcw,
} from "lucide-react";
import type { FormEvent } from "react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Button } from "#/components/ui/button";
import { Checkbox } from "#/components/ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "#/components/ui/dialog";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#/components/ui/select";
import { useFinly } from "#/context/finly-context";
import { getUniversalCategories } from "#/lib/constants";
import {
	CURRENCIES,
	formatLiveNumericInput,
	formatUSD,
	parseNumericInput,
} from "#/lib/format";
import {
	clearTransactionDraft,
	loadTransactionDraft,
	saveTransactionDraft,
} from "#/lib/storage";
import { cn } from "#/lib/utils";
import type { TransactionDraft, TransactionType } from "#/types/finly";

export function QuickTransactionModal() {
	const {
		wallets,
		todayISO,
		terminology,
		isQuickEntryOpen,
		quickEntryDefaultType,
		closeQuickEntry,
		addTransaction,
	} = useFinly();

	const amountInputRef = useRef<HTMLInputElement | null>(null);
	const baseId = useId();

	const [txType, setTxType] = useState<TransactionType>(quickEntryDefaultType);
	const [rawAmount, setRawAmount] = useState<string>("");
	const [category, setCategory] = useState<string>("");
	const [customCategoryMode, setCustomCategoryMode] = useState<boolean>(false);
	const [customCategoryText, setCustomCategoryText] = useState<string>("");
	const [walletId, setWalletId] = useState<string>(wallets[0]?.id ?? "");
	const [txDate, setTxDate] = useState<string>(todayISO);
	const [note, setNote] = useState<string>("");
	const [isBusiness, setIsBusiness] = useState<boolean>(true);
	const [confirmOverflow, setConfirmOverflow] = useState<boolean>(false);
	const [recoverableDraft, setRecoverableDraft] =
		useState<TransactionDraft | null>(null);

	const presetCategories = useMemo(
		() => getUniversalCategories(txType),
		[txType],
	);

	// Initialize form state whenever modal opens
	useEffect(() => {
		if (!isQuickEntryOpen) return;

		const defaultCategories = getUniversalCategories(quickEntryDefaultType);
		setTxType(quickEntryDefaultType);
		setRawAmount("");
		setCategory(defaultCategories[0] ?? "Food & Personal");
		setCustomCategoryMode(false);
		setCustomCategoryText("");
		setWalletId(wallets[0]?.id ?? "");
		setTxDate(todayISO);
		setNote("");
		setIsBusiness(true);
		setConfirmOverflow(false);

		const savedDraft = loadTransactionDraft();
		if (savedDraft?.rawAmount && parseNumericInput(savedDraft.rawAmount) > 0) {
			setRecoverableDraft(savedDraft);
		} else {
			setRecoverableDraft(null);
		}

		const focusTimer = window.setTimeout(() => {
			amountInputRef.current?.focus();
		}, 60);

		return () => window.clearTimeout(focusTimer);
	}, [isQuickEntryOpen, quickEntryDefaultType, todayISO, wallets]);

	// Persist unsaved draft while modal is open
	useEffect(() => {
		if (!isQuickEntryOpen) return;
		if (!rawAmount.trim() && !note.trim()) return;

		saveTransactionDraft({
			type: txType,
			rawAmount,
			category: customCategoryMode
				? customCategoryText.trim() || category
				: category,
			walletId,
			note,
			isBusiness,
			updatedAt: Date.now(),
		});
	}, [
		category,
		customCategoryMode,
		customCategoryText,
		isBusiness,
		isQuickEntryOpen,
		note,
		rawAmount,
		txType,
		walletId,
	]);

	const handleTypeSwitch = (nextType: TransactionType) => {
		setTxType(nextType);
		const nextPresets = getUniversalCategories(nextType);
		if (!customCategoryMode) {
			setCategory(nextPresets[0] ?? "Client Invoices");
		}
	};

	const handleRestoreDraft = () => {
		if (!recoverableDraft) return;
		setTxType(recoverableDraft.type);
		setRawAmount(recoverableDraft.rawAmount);
		const presets = getUniversalCategories(recoverableDraft.type);
		if (presets.includes(recoverableDraft.category)) {
			setCustomCategoryMode(false);
			setCategory(recoverableDraft.category);
		} else {
			setCustomCategoryMode(true);
			setCustomCategoryText(recoverableDraft.category);
		}
		if (wallets.some((w) => w.id === recoverableDraft.walletId)) {
			setWalletId(recoverableDraft.walletId);
		}
		setNote(recoverableDraft.note);
		setIsBusiness(recoverableDraft.isBusiness);
		setRecoverableDraft(null);
	};

	const handleDismissDraft = () => {
		clearTransactionDraft();
		setRecoverableDraft(null);
	};

	const numericAmount = parseNumericInput(rawAmount);
	const currencyMeta = CURRENCIES.USD;
	const isOverflow = numericAmount > currencyMeta.overflowThreshold;

	const resolvedCategory = customCategoryMode
		? customCategoryText.trim()
		: category;
	const canSubmit =
		numericAmount > 0 &&
		resolvedCategory.length > 0 &&
		(!isOverflow || confirmOverflow);

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!canSubmit) return;

		addTransaction({
			amount: numericAmount,
			type: txType,
			category: resolvedCategory,
			walletId: walletId || wallets[0]?.id || "wal_business",
			date: txDate || todayISO,
			note: note.trim() || undefined,
			isBusiness,
		});

		clearTransactionDraft();
		setRecoverableDraft(null);
		closeQuickEntry();
	};

	return (
		<Dialog
			open={isQuickEntryOpen}
			onOpenChange={(open) => {
				if (!open) closeQuickEntry();
			}}
		>
			<DialogContent className="max-h-[92vh] overflow-y-auto rounded-2xl border-border bg-card p-6 shadow-2xl sm:max-w-lg">
				<DialogHeader>
					<DialogTitle className="text-lg font-bold tracking-tight">
						Record Transaction
					</DialogTitle>
					<DialogDescription className="text-xs">
						Log money moving into or out of your cashflow.
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-4">
					{/* Draft Recovery Banner */}
					{recoverableDraft && (
						<div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-secondary/70 px-3.5 py-2.5 text-xs">
							<div className="flex items-center gap-2 font-medium text-foreground">
								<RotateCcw className="size-3.5 text-primary" />
								<span>
									Restore unsaved entry ($
									{recoverableDraft.rawAmount})?
								</span>
							</div>
							<div className="flex items-center gap-1.5">
								<Button
									type="button"
									size="xs"
									variant="default"
									onClick={handleRestoreDraft}
								>
									Restore
								</Button>
								<Button
									type="button"
									size="xs"
									variant="ghost"
									onClick={handleDismissDraft}
								>
									Dismiss
								</Button>
							</div>
						</div>
					)}

					{/* TRANSACTION TYPE (PRD §5.1) */}
					<div className="space-y-1.5">
						<Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
							Transaction Type
						</Label>
						<div className="shadow-neu-inset grid grid-cols-2 gap-2 rounded-xl bg-zinc-100 p-1 dark:bg-zinc-800">
							<button
								type="button"
								onClick={() => handleTypeSwitch("money_out")}
								className={cn(
									"flex min-h-10 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors cursor-pointer",
									txType === "money_out"
										? "shadow-neu-sm bg-zinc-900 font-bold text-white dark:bg-white dark:text-zinc-900"
										: "text-muted-foreground hover:text-foreground",
								)}
							>
								<ArrowDownRight className="size-4 shrink-0" />
								<span>{terminology.outflowAction}</span>
							</button>
							<button
								type="button"
								onClick={() => handleTypeSwitch("money_in")}
								className={cn(
									"flex min-h-10 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors cursor-pointer",
									txType === "money_in"
										? "shadow-neu-sm bg-zinc-900 font-bold text-white dark:bg-white dark:text-zinc-900"
										: "text-muted-foreground hover:text-foreground",
								)}
							>
								<ArrowUpRight className="size-4 shrink-0" />
								<span>{terminology.inflowAction}</span>
							</button>
						</div>
					</div>

					{/* AMOUNT (USD) — Tap 1 */}
					<div className="space-y-1.5">
						<Label
							htmlFor={`${baseId}-amount`}
							className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
						>
							Amount (USD)
						</Label>
						<div className="flex items-center gap-2 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 transition-colors focus-within:border-zinc-900 focus-within:bg-white dark:border-zinc-800 dark:bg-zinc-900 dark:focus-within:border-white">
							<span className="text-2xl font-bold select-none tabular-nums text-foreground">
								$
							</span>
							<input
								ref={amountInputRef}
								id={`${baseId}-amount`}
								type="text"
								inputMode="decimal"
								autoComplete="off"
								placeholder="0.00"
								value={rawAmount}
								onChange={(e) => {
									setRawAmount(formatLiveNumericInput(e.target.value, "USD"));
									setConfirmOverflow(false);
								}}
								className="h-10 w-full bg-transparent text-2xl font-bold tracking-tight text-foreground placeholder:text-muted-foreground/40 focus:outline-hidden tabular-nums font-mono"
							/>
						</div>
					</div>

					{/* Overflow Safeguard */}
					{isOverflow && (
						<div className="space-y-2 rounded-xl border border-amber-300 bg-amber-50/90 p-3 text-xs dark:border-amber-800 dark:bg-amber-950/50">
							<div className="flex items-start gap-2 text-amber-900 dark:text-amber-200">
								<AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" />
								<p className="font-medium">
									Large amount alert:{" "}
									<strong className="tabular-nums">
										{formatUSD(numericAmount)}
									</strong>{" "}
									exceeds $1,000,000.00.
								</p>
							</div>
							<div className="flex items-center gap-2 pl-6">
								<Checkbox
									id={`${baseId}-overflow-confirm`}
									checked={confirmOverflow}
									onCheckedChange={(checked) =>
										setConfirmOverflow(checked === true)
									}
								/>
								<Label
									htmlFor={`${baseId}-overflow-confirm`}
									className="cursor-pointer text-xs font-semibold text-amber-950 dark:text-amber-100"
								>
									Confirm this USD amount contains correct zeros.
								</Label>
							</div>
						</div>
					)}

					{/* CATEGORY — Tap 2 */}
					<div className="space-y-2">
						<Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
							Category
						</Label>
						<div className="flex flex-wrap gap-1.5">
							{presetCategories.map((preset) => {
								const isSelected = !customCategoryMode && category === preset;
								return (
									<button
										key={preset}
										type="button"
										onClick={() => {
											setCustomCategoryMode(false);
											setCategory(preset);
										}}
										className={cn(
											"inline-flex min-h-9 items-center rounded-xl border px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer",
											isSelected
												? "border-zinc-900 bg-zinc-900 font-bold text-white shadow-neu-sm dark:border-white dark:bg-white dark:text-zinc-900"
												: "border-zinc-200 bg-zinc-50 text-foreground hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800/50 dark:hover:bg-zinc-800",
										)}
									>
										{preset}
									</button>
								);
							})}
							<button
								type="button"
								onClick={() => setCustomCategoryMode(true)}
								className={cn(
									"inline-flex min-h-9 items-center gap-1 rounded-xl border border-dashed px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer",
									customCategoryMode
										? "border-zinc-900 bg-zinc-900 font-bold text-white dark:border-white dark:bg-white dark:text-zinc-900"
										: "border-zinc-300 bg-transparent text-muted-foreground hover:text-foreground dark:border-zinc-700",
								)}
							>
								<Plus className="size-3.5" />
								<span>Add Custom Category</span>
							</button>
						</div>
						{customCategoryMode && (
							<Input
								placeholder="Enter custom category name..."
								value={customCategoryText}
								onChange={(e) => setCustomCategoryText(e.target.value)}
								className="mt-1.5 h-10 rounded-xl"
							/>
						)}
					</div>

					{/* WALLET ACCOUNT & DATE (PRD §5.1) */}
					<div className="grid gap-3 sm:grid-cols-2">
						<div className="space-y-1.5">
							<Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
								Wallet Account
							</Label>
							<Select value={walletId} onValueChange={setWalletId}>
								<SelectTrigger className="h-10 w-full rounded-xl bg-background text-xs">
									<SelectValue placeholder="Choose wallet" />
								</SelectTrigger>
								<SelectContent>
									{wallets.map((w) => (
										<SelectItem key={w.id} value={w.id}>
											{w.name} ({formatUSD(w.balance)})
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-1.5">
							<Label
								htmlFor={`${baseId}-date`}
								className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
							>
								Date
							</Label>
							<Input
								id={`${baseId}-date`}
								type="date"
								value={txDate}
								onChange={(e) => setTxDate(e.target.value)}
								className="h-10 rounded-xl bg-background text-xs tabular-nums"
							/>
						</div>
					</div>

					{/* NOTE / DESCRIPTION (Optional) */}
					<div className="space-y-1.5">
						<Label
							htmlFor={`${baseId}-note`}
							className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
						>
							Note / Description (Optional)
						</Label>
						<Input
							id={`${baseId}-note`}
							placeholder="e.g., Lunch meeting with client"
							value={note}
							onChange={(e) => setNote(e.target.value)}
							className="h-10 rounded-xl bg-background text-xs sm:text-sm"
						/>
					</div>

					{/* Business Transaction Checkbox (PRD §5.1) */}
					<div className="flex items-center gap-2.5 rounded-xl border border-border bg-muted/30 px-3.5 py-2.5">
						<Checkbox
							id={`${baseId}-biz`}
							checked={isBusiness}
							onCheckedChange={(checked) => setIsBusiness(checked === true)}
						/>
						<Label
							htmlFor={`${baseId}-biz`}
							className="cursor-pointer text-xs font-medium text-foreground"
						>
							Business transaction (Tag for tax &amp; business deductions)
						</Label>
					</div>

					{/* DialogFooter — Tap 3 */}
					<DialogFooter className="gap-2 pt-2">
						<Button
							type="button"
							variant="outline"
							onClick={closeQuickEntry}
							className="min-h-11 rounded-xl font-semibold"
						>
							Cancel
						</Button>
						<Button
							type="submit"
							disabled={!canSubmit}
							className="min-h-11 rounded-xl px-6 font-bold"
						>
							Save Transaction
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
