import { createFileRoute } from "@tanstack/react-router";
import {
	Database,
	Download,
	Eye,
	FileJson,
	Landmark,
	Plus,
	RotateCcw,
	Save,
	ShieldAlert,
	SlidersHorizontal,
	Trash2,
	UserCog,
} from "lucide-react";
import { useTheme } from "next-themes";
import type { FormEvent } from "react";
import { useEffect, useId, useState } from "react";
import { toast } from "sonner";
import { MoneyValue } from "#/components/money-value";
import { Button } from "#/components/ui/button";
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
import { RadioGroup, RadioGroupItem } from "#/components/ui/radio-group";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#/components/ui/select";
import { Switch } from "#/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "#/components/ui/tabs";
import { Textarea } from "#/components/ui/textarea";
import { useFinly } from "#/context/finly-context";
import {
	CURRENCIES,
	formatLiveNumericInput,
	parseNumericInput,
} from "#/lib/format";
import { cn } from "#/lib/utils";
import type { ThemePreference } from "#/types/finly";

export const Route = createFileRoute("/settings")({
	component: SettingsScreen,
});

function SettingsScreen() {
	const {
		profile,
		wallets,
		updateProfile,
		togglePrivacyBlur,
		addWallet,
		exportCsv,
		exportJson,
		resetWorkspaceEmpty,
		restoreDemoWorkspace,
	} = useFinly();
	const { theme, setTheme } = useTheme();
	const baseId = useId();

	const [displayName, setDisplayName] = useState(profile.displayName);
	const [businessName, setBusinessName] = useState(profile.businessName ?? "");
	const [emergencyBufferRaw, setEmergencyBufferRaw] = useState(() =>
		formatLiveNumericInput(String(profile.emergencyBuffer), profile.currency),
	);
	const [baselineTargetRaw, setBaselineTargetRaw] = useState(() =>
		formatLiveNumericInput(
			String(profile.baselineDailyTarget),
			profile.currency,
		),
	);

	const [bankName, setBankName] = useState(profile.paymentDetails.bankName);
	const [accountNumber, setAccountNumber] = useState(
		profile.paymentDetails.accountNumber,
	);
	const [accountHolder, setAccountHolder] = useState(
		profile.paymentDetails.accountHolder,
	);
	const [defaultTermsDays, setDefaultTermsDays] = useState(
		String(profile.paymentDetails.defaultTermsDays),
	);
	const [paymentNotes, setPaymentNotes] = useState(
		profile.paymentDetails.notes ?? "",
	);

	const [newWalletName, setNewWalletName] = useState("");
	const [newWalletOpening, setNewWalletOpening] = useState("");
	const [newWalletIsBiz, setNewWalletIsBiz] = useState(true);

	const [resetDialogOpen, setResetDialogOpen] = useState(false);
	const [deleteConfirmationText, setDeleteConfirmationText] = useState("");

	useEffect(() => {
		setDisplayName(profile.displayName);
		setBusinessName(profile.businessName ?? "");
		setEmergencyBufferRaw(
			formatLiveNumericInput(String(profile.emergencyBuffer), profile.currency),
		);
		setBaselineTargetRaw(
			formatLiveNumericInput(
				String(profile.baselineDailyTarget),
				profile.currency,
			),
		);
		setBankName(profile.paymentDetails.bankName);
		setAccountNumber(profile.paymentDetails.accountNumber);
		setAccountHolder(profile.paymentDetails.accountHolder);
		setDefaultTermsDays(String(profile.paymentDetails.defaultTermsDays));
		setPaymentNotes(profile.paymentDetails.notes ?? "");
	}, [profile]);

	const handleSaveWorkspace = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		updateProfile({
			displayName: displayName.trim() || "Alex Zayyan",
			businessName: businessName.trim() || undefined,
			emergencyBuffer: parseNumericInput(emergencyBufferRaw),
			baselineDailyTarget: Math.max(1, parseNumericInput(baselineTargetRaw)),
		});
		toast.success("Workspace & Safe-to-Spend rules saved");
	};

	const handleSavePaymentDetails = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		updateProfile({
			paymentDetails: {
				bankName: bankName.trim(),
				accountNumber: accountNumber.trim(),
				accountHolder: accountHolder.trim(),
				defaultTermsDays: Number.parseInt(defaultTermsDays, 10) || 14,
				notes: paymentNotes.trim() || undefined,
			},
		});
		toast.success("Default invoice payment details updated");
	};

	const handleCreateWallet = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!newWalletName.trim()) return;
		addWallet({
			name: newWalletName.trim(),
			openingBalance: parseNumericInput(newWalletOpening),
			isBusinessWallet: newWalletIsBiz,
		});
		setNewWalletName("");
		setNewWalletOpening("");
	};

	const handleConfirmReset = async () => {
		if (deleteConfirmationText !== "DELETE") return;
		await resetWorkspaceEmpty();
		setDeleteConfirmationText("");
		setResetDialogOpen(false);
	};

	return (
		<div className="space-y-4">
			{/* Page Header */}
			<div className="space-y-0.5">
				<h1 className="font-mono text-2xl font-black uppercase tracking-tight text-foreground sm:text-3xl">
					Settings &amp; Preferences
				</h1>
				<p className="font-mono text-xs text-muted-foreground">
					Configure your profile, plain-language display, invoice payment
					details, and local backups.
				</p>
			</div>

			<Tabs defaultValue="workspace" className="space-y-4">
				<TabsList className="h-auto w-full flex-wrap justify-start gap-1 rounded-2xl border border-border bg-card p-1.5 sm:w-auto dark:border-zinc-800">
					<TabsTrigger
						value="workspace"
						className="gap-1.5 rounded-xl px-3.5 py-2 font-mono text-xs font-semibold data-[state=active]:bg-primary data-[state=active]:font-bold data-[state=active]:text-primary-foreground"
					>
						<UserCog className="size-3.5" />
						<span>Workspace Profile</span>
					</TabsTrigger>
					<TabsTrigger
						value="display"
						className="gap-1.5 rounded-xl px-3.5 py-2 font-mono text-xs font-semibold data-[state=active]:bg-primary data-[state=active]:font-bold data-[state=active]:text-primary-foreground"
					>
						<SlidersHorizontal className="size-3.5" />
						<span>Display &amp; Privacy</span>
					</TabsTrigger>
					<TabsTrigger
						value="payment"
						className="gap-1.5 rounded-xl px-3.5 py-2 font-mono text-xs font-semibold data-[state=active]:bg-primary data-[state=active]:font-bold data-[state=active]:text-primary-foreground"
					>
						<Landmark className="size-3.5" />
						<span>Payment Details</span>
					</TabsTrigger>
					<TabsTrigger
						value="backup"
						className="gap-1.5 rounded-xl px-3.5 py-2 font-mono text-xs font-semibold data-[state=active]:bg-primary data-[state=active]:font-bold data-[state=active]:text-primary-foreground"
					>
						<Database className="size-3.5" />
						<span>Data &amp; Backup</span>
					</TabsTrigger>
				</TabsList>

				{/* 1. Workspace Profile Tab */}
				<TabsContent value="workspace">
					<div className="grid grid-cols-12 gap-2 sm:gap-4">
						{/* Safe-to-Spend & Profile Parameters */}
						<div className="bento-card bento-card-static col-span-12 space-y-5 border border-border bg-card p-6 lg:col-span-6 dark:border-zinc-800">
							<div className="space-y-1">
								<h2 className="font-mono text-sm font-bold uppercase tracking-wider text-foreground">
									Profile &amp; Safe-to-Spend Rules
								</h2>
								<p className="font-mono text-xs text-muted-foreground">
									Configure your minimum safety reserve and target daily spend
								</p>
							</div>

							<form onSubmit={handleSaveWorkspace} className="space-y-4">
								<div className="grid gap-3 sm:grid-cols-2">
									<div className="space-y-1.5">
										<Label
											htmlFor={`${baseId}-name`}
											className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
										>
											Your Display Name
										</Label>
										<Input
											id={`${baseId}-name`}
											value={displayName}
											onChange={(e) => setDisplayName(e.target.value)}
											className="h-10 rounded-xl bg-card font-mono text-xs dark:bg-background"
										/>
									</div>
									<div className="space-y-1.5">
										<Label
											htmlFor={`${baseId}-biz`}
											className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
										>
											Studio / Shop Name
										</Label>
										<Input
											id={`${baseId}-biz`}
											placeholder="Optional"
											value={businessName}
											onChange={(e) => setBusinessName(e.target.value)}
											className="h-10 rounded-xl bg-card font-mono text-xs dark:bg-background"
										/>
									</div>
								</div>

								<div className="grid gap-3 sm:grid-cols-2">
									<div className="space-y-1.5">
										<Label
											htmlFor={`${baseId}-buffer`}
											className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
										>
											Safety Buffer ({CURRENCIES[profile.currency].symbol})
										</Label>
										<Input
											id={`${baseId}-buffer`}
											inputMode="decimal"
											value={emergencyBufferRaw}
											onChange={(e) =>
												setEmergencyBufferRaw(
													formatLiveNumericInput(
														e.target.value,
														profile.currency,
													),
												)
											}
											className="h-10 rounded-xl bg-card font-mono text-xs tabular-nums dark:bg-background"
										/>
									</div>
									<div className="space-y-1.5">
										<Label
											htmlFor={`${baseId}-baseline`}
											className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
										>
											Target Daily Spend
										</Label>
										<Input
											id={`${baseId}-baseline`}
											inputMode="decimal"
											value={baselineTargetRaw}
											onChange={(e) =>
												setBaselineTargetRaw(
													formatLiveNumericInput(
														e.target.value,
														profile.currency,
													),
												)
											}
											className="h-10 rounded-xl bg-card font-mono text-xs tabular-nums dark:bg-background"
										/>
									</div>
								</div>

								<Button
									type="submit"
									className="min-h-11 gap-1.5 rounded-xl bg-primary px-5 font-mono text-xs font-extrabold uppercase tracking-wider text-primary-foreground hover:bg-primary-hover cursor-pointer"
								>
									<Save className="size-4" />
									<span>Save Workspace Rules</span>
								</Button>
							</form>
						</div>

						{/* Wallets Manager */}
						<div className="bento-card bento-card-static col-span-12 space-y-5 border border-border bg-card p-6 lg:col-span-6 dark:border-zinc-800">
							<div className="flex items-start justify-between gap-2">
								<div className="space-y-1">
									<h2 className="font-mono text-sm font-bold uppercase tracking-wider text-foreground">
										Wallets &amp; Cash Accounts ({wallets.length})
									</h2>
									<p className="font-mono text-xs text-muted-foreground">
										Separate business operating cash, tax reserves, and personal
										funds
									</p>
								</div>
								<span className="rounded-full bg-accent px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase text-accent-foreground">
									Accounts
								</span>
							</div>

							<div className="space-y-2">
								{wallets.map((w) => (
									<div
										key={w.id}
										className="flex items-center justify-between rounded-2xl border border-border bg-white px-4 py-3 text-xs dark:border-zinc-700/70 dark:bg-muted"
									>
										<div>
											<p className="font-mono font-bold text-foreground">
												{w.name}
											</p>
											<p className="font-mono text-[11px] text-muted-foreground">
												{w.isBusinessWallet
													? "Business / Shop Account"
													: "Personal Household Account"}
											</p>
										</div>
										<MoneyValue
											amount={w.balance}
											className="font-mono text-sm font-extrabold text-foreground tabular-nums"
										/>
									</div>
								))}
							</div>

							<form
								onSubmit={handleCreateWallet}
								className="space-y-3 rounded-2xl border border-dashed border-border bg-white/60 p-4 dark:border-zinc-700 dark:bg-muted/60"
							>
								<p className="font-mono text-xs font-bold uppercase tracking-wider text-foreground">
									Add Another Wallet
								</p>
								<div className="grid gap-2.5 sm:grid-cols-2">
									<Input
										placeholder="e.g., Petty Cash Drawer"
										value={newWalletName}
										onChange={(e) => setNewWalletName(e.target.value)}
										className="h-9 rounded-xl bg-card font-mono text-xs dark:bg-background"
									/>
									<Input
										inputMode="decimal"
										placeholder="Opening balance (0.00)"
										value={newWalletOpening}
										onChange={(e) =>
											setNewWalletOpening(
												formatLiveNumericInput(
													e.target.value,
													profile.currency,
												),
											)
										}
										className="h-9 rounded-xl bg-card font-mono text-xs tabular-nums dark:bg-background"
									/>
								</div>
								<div className="flex items-center justify-between">
									<label
										htmlFor={`${baseId}-new-wal-biz`}
										className="flex items-center gap-2 font-mono text-xs text-muted-foreground cursor-pointer"
									>
										<Switch
											id={`${baseId}-new-wal-biz`}
											size="sm"
											checked={newWalletIsBiz}
											onCheckedChange={setNewWalletIsBiz}
										/>
										<span>Business wallet</span>
									</label>
									<Button
										type="submit"
										size="xs"
										disabled={!newWalletName.trim()}
										className="gap-1 rounded-xl bg-primary font-mono text-xs font-extrabold text-primary-foreground hover:bg-primary-hover"
									>
										<Plus className="size-3.5" />
										<span>Add Wallet</span>
									</Button>
								</div>
							</form>
						</div>
					</div>
				</TabsContent>

				{/* 2. Display & Privacy Tab */}
				<TabsContent value="display">
					<div className="bento-card bento-card-static space-y-6 border border-border bg-card p-6 dark:border-zinc-800">
						<div className="space-y-1">
							<h2 className="font-mono text-sm font-bold uppercase tracking-wider text-foreground">
								Display, Terminology &amp; Privacy
							</h2>
							<p className="font-mono text-xs text-muted-foreground">
								Control currency standard, plain-English labels, privacy
								masking, and light/dark appearance.
							</p>
						</div>

						{/* Enforced USD Currency Standard */}
						<div className="grid gap-1.5 sm:max-w-sm">
							<Label className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
								Workspace Currency Standard
							</Label>
							<div className="flex h-10 items-center justify-between rounded-xl border border-border bg-white px-3.5 font-mono text-xs dark:border-zinc-700 dark:bg-background">
								<span className="font-bold text-foreground">
									USD ($) — United States Dollar
								</span>
								<span className="rounded-md bg-primary px-2 py-0.5 text-[10px] font-extrabold uppercase text-primary-foreground">
									Standard
								</span>
							</div>
						</div>

						{/* Plain Terms vs Accounting Terms */}
						<div className="space-y-2.5">
							<Label className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
								Financial Terminology Mode
							</Label>
							<RadioGroup
								value={profile.plainTermsEnabled ? "plain" : "accounting"}
								onValueChange={(val) => {
									const plain = val === "plain";
									updateProfile({ plainTermsEnabled: plain });
									toast.success(
										plain
											? "Switched to Plain Human Terms"
											: "Switched to Standard Accounting Terms",
									);
								}}
								className="grid gap-2 sm:grid-cols-2 sm:gap-4"
							>
								<label
									htmlFor={`${baseId}-term-plain`}
									className={cn(
										"flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-colors",
										profile.plainTermsEnabled
											? "border-primary bg-card dark:bg-muted"
											: "border-border bg-card/60 dark:border-zinc-700 dark:bg-muted/60",
									)}
								>
									<RadioGroupItem
										id={`${baseId}-term-plain`}
										value="plain"
										className="mt-0.5"
									/>
									<div>
										<p className="font-mono text-xs font-bold text-foreground">
											Plain Terms (Recommended)
										</p>
										<p className="mt-0.5 font-mono text-xs text-muted-foreground">
											Uses &ldquo;Income&rdquo;, &ldquo;Expenses&rdquo;,
											&ldquo;Total Balance&rdquo;, and &ldquo;Unpaid
											Invoices&rdquo;.
										</p>
									</div>
								</label>

								<label
									htmlFor={`${baseId}-term-acct`}
									className={cn(
										"flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-colors",
										!profile.plainTermsEnabled
											? "border-primary bg-card dark:bg-muted"
											: "border-border bg-card/60 dark:border-zinc-700 dark:bg-muted/60",
									)}
								>
									<RadioGroupItem
										id={`${baseId}-term-acct`}
										value="accounting"
										className="mt-0.5"
									/>
									<div>
										<p className="font-mono text-xs font-bold text-foreground">
											Accounting Terms
										</p>
										<p className="mt-0.5 font-mono text-xs text-muted-foreground">
											Uses &ldquo;Cash Inflow&rdquo;, &ldquo;Cash
											Outflow&rdquo;, &ldquo;Available Liquidity&rdquo;, and
											&ldquo;Accounts Receivable&rdquo;.
										</p>
									</div>
								</label>
							</RadioGroup>
						</div>

						{/* Privacy Masking Switch */}
						<div className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-white p-4 dark:border-zinc-700 dark:bg-muted">
							<div className="flex items-start gap-3">
								<Eye className="mt-0.5 size-4 shrink-0 text-info" />
								<div>
									<Label
										htmlFor={`${baseId}-privacy`}
										className="font-mono text-xs font-bold text-foreground cursor-pointer"
									>
										Privacy Masking Mode ($ ••••••)
									</Label>
									<p className="font-mono text-xs text-muted-foreground">
										Masks all monetary figures across the workspace when working
										in public spaces or cafés.
									</p>
								</div>
							</div>
							<Switch
								id={`${baseId}-privacy`}
								checked={profile.privacyBlurEnabled}
								onCheckedChange={(checked) => togglePrivacyBlur(checked)}
							/>
						</div>

						{/* Color Theme */}
						<div className="space-y-2.5">
							<Label className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
								App Appearance
							</Label>
							<RadioGroup
								value={theme ?? profile.themePreference}
								onValueChange={(val) => {
									setTheme(val);
									updateProfile({
										themePreference: val as ThemePreference,
									});
								}}
								className="grid max-w-md grid-cols-3 gap-2"
							>
								{(["dark", "light", "system"] as const).map((mode) => {
									const active = (theme ?? profile.themePreference) === mode;
									return (
										<label
											key={mode}
											htmlFor={`${baseId}-theme-${mode}`}
											className={cn(
												"flex cursor-pointer items-center justify-center gap-2 rounded-xl border py-2.5 font-mono text-xs font-semibold capitalize transition-colors",
												active
													? "border-primary bg-primary font-bold text-primary-foreground"
													: "border-border bg-card text-muted-foreground hover:text-foreground dark:border-zinc-700 dark:bg-muted",
											)}
										>
											<RadioGroupItem
												id={`${baseId}-theme-${mode}`}
												value={mode}
												className="sr-only"
											/>
											<span>{mode}</span>
										</label>
									);
								})}
							</RadioGroup>
						</div>
					</div>
				</TabsContent>

				{/* 3. Default Payment Details Tab */}
				<TabsContent value="payment">
					<div className="bento-card bento-card-static max-w-2xl space-y-5 border border-border bg-card p-6 dark:border-zinc-800">
						<div className="space-y-1">
							<h2 className="font-mono text-sm font-bold uppercase tracking-wider text-foreground">
								Default Invoice Payment Instructions
							</h2>
							<p className="font-mono text-xs text-muted-foreground">
								Automatically pre-filled onto every new client invoice and
								WhatsApp share link.
							</p>
						</div>

						<form onSubmit={handleSavePaymentDetails} className="space-y-4">
							<div className="grid gap-3 sm:grid-cols-2">
								<div className="space-y-1.5">
									<Label
										htmlFor={`${baseId}-bank`}
										className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
									>
										Bank / Payment Provider
									</Label>
									<Input
										id={`${baseId}-bank`}
										placeholder="e.g., Mercury / BCA / Wise"
										value={bankName}
										onChange={(e) => setBankName(e.target.value)}
										className="h-10 rounded-xl bg-card font-mono text-xs dark:bg-background"
									/>
								</div>
								<div className="space-y-1.5">
									<Label
										htmlFor={`${baseId}-acct-num`}
										className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
									>
										Account Number / IBAN
									</Label>
									<Input
										id={`${baseId}-acct-num`}
										value={accountNumber}
										onChange={(e) => setAccountNumber(e.target.value)}
										className="h-10 rounded-xl bg-card font-mono text-xs tabular-nums dark:bg-background"
									/>
								</div>
								<div className="space-y-1.5">
									<Label
										htmlFor={`${baseId}-holder`}
										className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
									>
										Account Beneficiary Name
									</Label>
									<Input
										id={`${baseId}-holder`}
										value={accountHolder}
										onChange={(e) => setAccountHolder(e.target.value)}
										className="h-10 rounded-xl bg-card font-mono text-xs dark:bg-background"
									/>
								</div>
								<div className="space-y-1.5">
									<Label className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
										Default Payment Terms
									</Label>
									<Select
										value={defaultTermsDays}
										onValueChange={setDefaultTermsDays}
									>
										<SelectTrigger className="h-10 w-full rounded-xl bg-card font-mono text-xs dark:bg-background">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="7">Net 7 (+7 Days)</SelectItem>
											<SelectItem value="14">Net 14 (+14 Days)</SelectItem>
											<SelectItem value="30">Net 30 (+30 Days)</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>

							<div className="space-y-1.5">
								<Label
									htmlFor={`${baseId}-pay-notes`}
									className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
								>
									Additional Invoice Footer Notes
								</Label>
								<Textarea
									id={`${baseId}-pay-notes`}
									rows={3}
									value={paymentNotes}
									onChange={(e) => setPaymentNotes(e.target.value)}
									className="rounded-xl bg-card font-mono text-xs dark:bg-background"
								/>
							</div>

							<Button
								type="submit"
								className="min-h-11 gap-1.5 rounded-xl bg-primary px-5 font-mono text-xs font-extrabold uppercase tracking-wider text-primary-foreground hover:bg-primary-hover cursor-pointer"
							>
								<Save className="size-4" />
								<span>Save Payment Details</span>
							</Button>
						</form>
					</div>
				</TabsContent>

				{/* 4. Data Management & Local Backup Tab */}
				<TabsContent value="backup">
					<div className="grid grid-cols-12 gap-2 sm:gap-4">
						<div className="bento-card bento-card-static col-span-12 space-y-4 border border-border bg-card p-6 lg:col-span-7 dark:border-zinc-800">
							<div className="space-y-1">
								<h2 className="font-mono text-sm font-bold uppercase tracking-wider text-foreground">
									Local-First Portability &amp; Export
								</h2>
								<p className="font-mono text-xs text-muted-foreground">
									Your ledger lives privately inside IndexedDB. Export clean
									copies anytime for spreadsheets or tax filing.
								</p>
							</div>

							<div className="flex flex-wrap gap-2.5">
								<Button
									type="button"
									variant="outline"
									onClick={exportCsv}
									className="min-h-11 gap-2 rounded-xl border-border bg-card font-mono text-xs font-bold dark:border-zinc-700 dark:bg-muted"
								>
									<Download className="size-4 text-inflow" />
									<span>Download CSV Ledger</span>
								</Button>
								<Button
									type="button"
									variant="outline"
									onClick={exportJson}
									className="min-h-11 gap-2 rounded-xl border-border bg-card font-mono text-xs font-bold dark:border-zinc-700 dark:bg-muted"
								>
									<FileJson className="size-4 text-info" />
									<span>Download Backup (.JSON)</span>
								</Button>
								<Button
									type="button"
									variant="outline"
									onClick={() => void restoreDemoWorkspace()}
									className="min-h-11 gap-2 rounded-xl border-border bg-card font-mono text-xs font-bold dark:border-zinc-700 dark:bg-muted"
								>
									<RotateCcw className="size-4 text-warning" />
									<span>Restore Demo Data</span>
								</Button>
							</div>
						</div>

						{/* Danger Zone */}
						<div className="bento-card bento-card-static col-span-12 space-y-4 border border-outflow-border bg-outflow-bg p-6 lg:col-span-5">
							<div className="space-y-1">
								<h2 className="flex items-center gap-2 font-mono text-sm font-bold uppercase tracking-wider text-outflow">
									<ShieldAlert className="size-4" />
									<span>Danger Zone</span>
								</h2>
								<p className="font-mono text-xs text-muted-foreground">
									Permanently erase all locally stored transactions, invoices,
									and wallet balances on this browser.
								</p>
							</div>

							<Button
								type="button"
								onClick={() => {
									setDeleteConfirmationText("");
									setResetDialogOpen(true);
								}}
								className="min-h-11 gap-2 rounded-xl bg-outflow font-mono text-xs font-extrabold uppercase tracking-wider text-primary-foreground hover:bg-outflow/90 cursor-pointer"
							>
								<Trash2 className="size-4" />
								<span>Erase All Data &amp; Reset</span>
							</Button>
						</div>
					</div>
				</TabsContent>
			</Tabs>

			{/* 2-Step Destructive Reset Dialog */}
			<Dialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
				<DialogContent className="rounded-3xl border-border bg-popover p-6 shadow-2xl sm:max-w-md">
					<DialogHeader>
						<DialogTitle className="font-mono text-lg font-bold text-outflow">
							Erase All Local Cashflow Data?
						</DialogTitle>
						<DialogDescription className="font-mono text-xs">
							This action permanently clears your transactions, invoices, and
							wallet balances from IndexedDB. Download a JSON backup first if
							you want to keep a copy.
						</DialogDescription>
					</DialogHeader>

					<div className="space-y-2 py-2">
						<Label
							htmlFor={`${baseId}-confirm-delete`}
							className="font-mono text-xs font-semibold text-foreground"
						>
							Type <code className="font-mono font-bold">DELETE</code> to
							confirm:
						</Label>
						<Input
							id={`${baseId}-confirm-delete`}
							placeholder="DELETE"
							value={deleteConfirmationText}
							onChange={(e) => setDeleteConfirmationText(e.target.value)}
							className="h-10 rounded-xl bg-background font-mono text-xs"
						/>
					</div>

					<DialogFooter className="gap-2">
						<Button
							type="button"
							variant="outline"
							onClick={() => setResetDialogOpen(false)}
							className="min-h-11 rounded-xl font-mono text-xs font-semibold"
						>
							Cancel
						</Button>
						<Button
							type="button"
							disabled={deleteConfirmationText !== "DELETE"}
							onClick={() => void handleConfirmReset()}
							className="min-h-11 rounded-xl bg-outflow font-mono text-xs font-extrabold text-primary-foreground hover:bg-outflow/90"
						>
							Permanently Erase Workspace
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
