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
import { Button } from "#/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "#/components/ui/card";
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
		addWallet,
		exportCsv,
		exportJson,
		resetWorkspaceEmpty,
		restoreDemoWorkspace,
	} = useFinly();
	const { theme, setTheme } = useTheme();
	const baseId = useId();

	// Workspace form state
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

	// Payment details form state
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

	// New wallet form state
	const [newWalletName, setNewWalletName] = useState("");
	const [newWalletOpening, setNewWalletOpening] = useState("");
	const [newWalletIsBiz, setNewWalletIsBiz] = useState(true);

	// 2-Step Danger Zone Confirmation
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
		<div className="space-y-6">
			{/* Page Header */}
			<div className="space-y-1">
				<h1 className="font-mono text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
					Settings &amp; Preferences
				</h1>
				<p className="text-xs text-muted-foreground sm:text-sm">
					Configure your profile, plain-language display, invoice payment
					details, and local backups.
				</p>
			</div>

			<Tabs defaultValue="workspace" className="space-y-5">
				<TabsList className="shadow-neu-inset h-auto w-full flex-wrap justify-start gap-1 rounded-2xl bg-zinc-100 p-1.5 sm:w-auto dark:bg-zinc-800">
					<TabsTrigger
						value="workspace"
						className="gap-1.5 rounded-xl px-3.5 py-2 font-mono text-xs font-semibold data-[state=active]:shadow-neu-sm data-[state=active]:bg-zinc-900 data-[state=active]:text-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-zinc-900"
					>
						<UserCog className="size-3.5" />
						<span>Workspace Profile</span>
					</TabsTrigger>
					<TabsTrigger
						value="display"
						className="gap-1.5 rounded-xl px-3.5 py-2 font-mono text-xs font-semibold data-[state=active]:shadow-neu-sm data-[state=active]:bg-zinc-900 data-[state=active]:text-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-zinc-900"
					>
						<SlidersHorizontal className="size-3.5" />
						<span>Display &amp; Privacy</span>
					</TabsTrigger>
					<TabsTrigger
						value="payment"
						className="gap-1.5 rounded-xl px-3.5 py-2 font-mono text-xs font-semibold data-[state=active]:shadow-neu-sm data-[state=active]:bg-zinc-900 data-[state=active]:text-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-zinc-900"
					>
						<Landmark className="size-3.5" />
						<span>Payment Details</span>
					</TabsTrigger>
					<TabsTrigger
						value="backup"
						className="gap-1.5 rounded-xl px-3.5 py-2 font-mono text-xs font-semibold data-[state=active]:shadow-neu-sm data-[state=active]:bg-zinc-900 data-[state=active]:text-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-zinc-900"
					>
						<Database className="size-3.5" />
						<span>Data &amp; Backup</span>
					</TabsTrigger>
				</TabsList>

				{/* 1. Workspace Profile Tab */}
				<TabsContent value="workspace" className="space-y-5">
					<div className="grid gap-5 lg:grid-cols-2">
						{/* Safe-to-Spend & Profile Parameters */}
						<Card className="rounded-2xl border-border bg-card py-5 shadow-xs">
							<CardHeader>
								<CardTitle className="text-base font-bold">
									Profile &amp; Safe-to-Spend Parameters
								</CardTitle>
								<CardDescription className="text-xs">
									Configure your minimum safety reserve and monthly cycle day
								</CardDescription>
							</CardHeader>
							<CardContent>
								<form onSubmit={handleSaveWorkspace} className="space-y-4">
									<div className="grid gap-3 sm:grid-cols-2">
										<div className="space-y-1.5">
											<Label
												htmlFor={`${baseId}-name`}
												className="text-xs font-semibold"
											>
												Your Display Name
											</Label>
											<Input
												id={`${baseId}-name`}
												value={displayName}
												onChange={(e) => setDisplayName(e.target.value)}
												className="h-10 rounded-xl"
											/>
										</div>
										<div className="space-y-1.5">
											<Label
												htmlFor={`${baseId}-biz`}
												className="text-xs font-semibold"
											>
												Studio / Shop Name
											</Label>
											<Input
												id={`${baseId}-biz`}
												placeholder="Optional"
												value={businessName}
												onChange={(e) => setBusinessName(e.target.value)}
												className="h-10 rounded-xl"
											/>
										</div>
									</div>

									<div className="grid gap-3 sm:grid-cols-2">
										<div className="space-y-1.5">
											<Label
												htmlFor={`${baseId}-buffer`}
												className="text-xs font-semibold"
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
												className="h-10 rounded-xl tabular-nums"
											/>
										</div>
										<div className="space-y-1.5">
											<Label
												htmlFor={`${baseId}-baseline`}
												className="text-xs font-semibold"
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
												className="h-10 rounded-xl tabular-nums"
											/>
										</div>
									</div>

									<Button
										type="submit"
										className="min-h-10 gap-1.5 rounded-xl px-5 font-bold"
									>
										<Save className="size-4" />
										<span>Save Workspace Rules</span>
									</Button>
								</form>
							</CardContent>
						</Card>

						{/* Wallets Manager */}
						<Card className="rounded-2xl border-border bg-card py-5 shadow-xs">
							<CardHeader>
								<CardTitle className="text-base font-bold">
									Wallets &amp; Cash Accounts ({wallets.length})
								</CardTitle>
								<CardDescription className="text-xs">
									Separate business operating cash, tax reserves, and household
									funds
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="space-y-2">
									{wallets.map((w) => (
										<div
											key={w.id}
											className="flex items-center justify-between rounded-xl border border-border bg-background/60 px-3.5 py-2.5 text-xs"
										>
											<div>
												<p className="font-bold text-foreground">{w.name}</p>
												<p className="text-[11px] text-muted-foreground">
													{w.isBusinessWallet
														? "Business / Shop Account"
														: "Personal Household Account"}
												</p>
											</div>
											<span className="font-extrabold text-foreground tabular-nums">
												{CURRENCIES[profile.currency].symbol}
												{w.balance.toLocaleString()}
											</span>
										</div>
									))}
								</div>

								<form
									onSubmit={handleCreateWallet}
									className="space-y-3 rounded-xl border border-dashed border-border bg-muted/25 p-3.5"
								>
									<p className="text-xs font-bold text-foreground">
										Add Another Wallet
									</p>
									<div className="grid gap-2.5 sm:grid-cols-2">
										<Input
											placeholder="e.g., Petty Cash Drawer"
											value={newWalletName}
											onChange={(e) => setNewWalletName(e.target.value)}
											className="h-9 rounded-lg bg-card text-xs"
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
											className="h-9 rounded-lg bg-card text-xs tabular-nums"
										/>
									</div>
									<div className="flex items-center justify-between">
										<label
											htmlFor={`${baseId}-new-wal-biz`}
											className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer"
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
											variant="outline"
											disabled={!newWalletName.trim()}
											className="gap-1 rounded-lg font-semibold"
										>
											<Plus className="size-3.5" />
											<span>Add Wallet</span>
										</Button>
									</div>
								</form>
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				{/* 2. Display & Privacy Tab */}
				<TabsContent value="display">
					<Card className="rounded-2xl border-border bg-card py-5 shadow-xs">
						<CardHeader>
							<CardTitle className="text-base font-bold">
								Display, Terminology &amp; Privacy
							</CardTitle>
							<CardDescription className="text-xs">
								Control currency formatting, plain-English labels, privacy
								masking, and light/dark appearance.
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							{/* Enforced USD Currency Standard (PRD §1.3 & §6) */}
							<div className="grid gap-1.5 sm:max-w-sm">
								<Label className="text-xs font-semibold">
									Workspace Currency Standard
								</Label>
								<div className="flex h-10 items-center justify-between rounded-xl border border-border bg-muted/40 px-3.5 text-xs">
									<span className="font-semibold text-foreground">
										USD ($) — United States Dollar
									</span>
									<span className="rounded-md bg-background px-2 py-0.5 text-[10px] font-bold uppercase text-muted-foreground">
										Standard
									</span>
								</div>
							</div>

							{/* Plain Terms vs Accounting Terms */}
							<div className="space-y-2.5">
								<Label className="text-xs font-semibold">
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
									className="grid gap-3 sm:grid-cols-2"
								>
									<label
										htmlFor={`${baseId}-term-plain`}
										className={cn(
											"flex cursor-pointer items-start gap-3 rounded-xl border p-3.5",
											profile.plainTermsEnabled
												? "border-primary bg-primary/10"
												: "border-border bg-background/60",
										)}
									>
										<RadioGroupItem
											id={`${baseId}-term-plain`}
											value="plain"
											className="mt-0.5"
										/>
										<div>
											<p className="text-xs font-bold text-foreground">
												Plain Terms (Recommended)
											</p>
											<p className="mt-0.5 text-xs text-muted-foreground">
												Uses &ldquo;Money In&rdquo;, &ldquo;Money Out&rdquo;,
												&ldquo;Total Cash Available&rdquo;, and &ldquo;Unpaid
												Invoices&rdquo;.
											</p>
										</div>
									</label>

									<label
										htmlFor={`${baseId}-term-acct`}
										className={cn(
											"flex cursor-pointer items-start gap-3 rounded-xl border p-3.5",
											!profile.plainTermsEnabled
												? "border-primary bg-primary/10"
												: "border-border bg-background/60",
										)}
									>
										<RadioGroupItem
											id={`${baseId}-term-acct`}
											value="accounting"
											className="mt-0.5"
										/>
										<div>
											<p className="text-xs font-bold text-foreground">
												Accounting Terms
											</p>
											<p className="mt-0.5 text-xs text-muted-foreground">
												Uses &ldquo;Cash Inflow&rdquo;, &ldquo;Cash
												Outflow&rdquo;, &ldquo;Available Liquidity&rdquo;, and
												&ldquo;Accounts Receivable&rdquo;.
											</p>
										</div>
									</label>
								</RadioGroup>
							</div>

							{/* Privacy Masking Switch */}
							<div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-muted/35 p-4">
								<div className="flex items-start gap-3">
									<Eye className="mt-0.5 size-4 text-primary shrink-0" />
									<div>
										<Label
											htmlFor={`${baseId}-privacy`}
											className="text-xs font-bold text-foreground cursor-pointer"
										>
											Privacy Masking Mode (Blur Balances)
										</Label>
										<p className="text-xs text-muted-foreground">
											Blurs all monetary figures across the workspace when
											working in public spaces or cafés.
										</p>
									</div>
								</div>
								<Switch
									id={`${baseId}-privacy`}
									checked={profile.privacyBlurEnabled}
									onCheckedChange={(checked) =>
										updateProfile({ privacyBlurEnabled: checked })
									}
								/>
							</div>

							{/* Color Theme */}
							<div className="space-y-2.5">
								<Label className="text-xs font-semibold">App Appearance</Label>
								<RadioGroup
									value={theme ?? profile.themePreference}
									onValueChange={(val) => {
										setTheme(val);
										updateProfile({
											themePreference: val as ThemePreference,
										});
									}}
									className="grid max-w-md grid-cols-3 gap-2.5"
								>
									{(["system", "light", "dark"] as const).map((mode) => (
										<label
											key={mode}
											htmlFor={`${baseId}-theme-${mode}`}
											className={cn(
												"flex cursor-pointer items-center justify-center gap-2 rounded-xl border py-2.5 text-xs font-semibold capitalize",
												(theme ?? profile.themePreference) === mode
													? "border-primary bg-primary/10 font-bold text-foreground"
													: "border-border bg-background/60 text-muted-foreground",
											)}
										>
											<RadioGroupItem
												id={`${baseId}-theme-${mode}`}
												value={mode}
											/>
											<span>{mode}</span>
										</label>
									))}
								</RadioGroup>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				{/* 3. Default Payment Details Tab */}
				<TabsContent value="payment">
					<Card className="max-w-2xl rounded-2xl border-border bg-card py-5 shadow-xs">
						<CardHeader>
							<CardTitle className="text-base font-bold">
								Default Invoice Payment Instructions
							</CardTitle>
							<CardDescription className="text-xs">
								Automatically pre-filled onto every new client invoice and
								WhatsApp share link.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<form onSubmit={handleSavePaymentDetails} className="space-y-4">
								<div className="grid gap-3 sm:grid-cols-2">
									<div className="space-y-1.5">
										<Label
											htmlFor={`${baseId}-bank`}
											className="text-xs font-semibold"
										>
											Bank / Payment Provider
										</Label>
										<Input
											id={`${baseId}-bank`}
											placeholder="e.g., Mercury / BCA / Wise"
											value={bankName}
											onChange={(e) => setBankName(e.target.value)}
											className="h-10 rounded-xl"
										/>
									</div>
									<div className="space-y-1.5">
										<Label
											htmlFor={`${baseId}-acct-num`}
											className="text-xs font-semibold"
										>
											Account Number / IBAN
										</Label>
										<Input
											id={`${baseId}-acct-num`}
											value={accountNumber}
											onChange={(e) => setAccountNumber(e.target.value)}
											className="h-10 rounded-xl tabular-nums"
										/>
									</div>
									<div className="space-y-1.5">
										<Label
											htmlFor={`${baseId}-holder`}
											className="text-xs font-semibold"
										>
											Account Beneficiary Name
										</Label>
										<Input
											id={`${baseId}-holder`}
											value={accountHolder}
											onChange={(e) => setAccountHolder(e.target.value)}
											className="h-10 rounded-xl"
										/>
									</div>
									<div className="space-y-1.5">
										<Label className="text-xs font-semibold">
											Default Payment Terms
										</Label>
										<Select
											value={defaultTermsDays}
											onValueChange={setDefaultTermsDays}
										>
											<SelectTrigger className="h-10 w-full rounded-xl bg-background text-xs">
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
										className="text-xs font-semibold"
									>
										Additional Invoice Footer Notes
									</Label>
									<Textarea
										id={`${baseId}-pay-notes`}
										rows={3}
										value={paymentNotes}
										onChange={(e) => setPaymentNotes(e.target.value)}
										className="rounded-xl text-xs"
									/>
								</div>

								<Button
									type="submit"
									className="min-h-10 gap-1.5 rounded-xl px-5 font-bold"
								>
									<Save className="size-4" />
									<span>Save Payment Details</span>
								</Button>
							</form>
						</CardContent>
					</Card>
				</TabsContent>

				{/* 4. Data Management & Local Backup Tab */}
				<TabsContent value="backup" className="space-y-5">
					<Card className="rounded-2xl border-border bg-card py-5 shadow-xs">
						<CardHeader>
							<CardTitle className="text-base font-bold">
								Local-First Portability &amp; Export
							</CardTitle>
							<CardDescription className="text-xs">
								Your ledger lives privately inside your browser&apos;s IndexedDB
								storage. Export clean copies anytime for spreadsheets or tax
								filing.
							</CardDescription>
						</CardHeader>
						<CardContent className="flex flex-wrap gap-3">
							<Button
								type="button"
								variant="outline"
								onClick={exportCsv}
								className="min-h-11 gap-2 rounded-xl font-semibold"
							>
								<Download className="size-4 text-primary" />
								<span>Download Full Ledger as CSV</span>
							</Button>
							<Button
								type="button"
								variant="outline"
								onClick={exportJson}
								className="min-h-11 gap-2 rounded-xl font-semibold"
							>
								<FileJson className="size-4 text-primary" />
								<span>Download Workspace Backup (.JSON)</span>
							</Button>
							<Button
								type="button"
								variant="secondary"
								onClick={() => void restoreDemoWorkspace()}
								className="min-h-11 gap-2 rounded-xl font-semibold"
							>
								<RotateCcw className="size-4" />
								<span>Restore Sample Demo Data</span>
							</Button>
						</CardContent>
					</Card>

					{/* Danger Zone (PRD §4.6) */}
					<Card className="rounded-2xl border-destructive/35 bg-card py-5 shadow-xs">
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-base font-bold text-destructive">
								<ShieldAlert className="size-4" />
								<span>Danger Zone — Reset Local Storage</span>
							</CardTitle>
							<CardDescription className="text-xs">
								Permanently erase all locally stored transactions, invoices, and
								wallet balances on this browser to start from zero.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Button
								type="button"
								variant="destructive"
								onClick={() => {
									setDeleteConfirmationText("");
									setResetDialogOpen(true);
								}}
								className="min-h-11 gap-2 rounded-xl font-bold"
							>
								<Trash2 className="size-4" />
								<span>Erase All Data &amp; Reset Storage</span>
							</Button>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>

			{/* 2-Step Destructive Reset Dialog */}
			<Dialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
				<DialogContent className="rounded-2xl border-border bg-card p-6 shadow-2xl sm:max-w-md">
					<DialogHeader>
						<DialogTitle className="text-lg font-bold text-destructive">
							Erase All Local Cashflow Data?
						</DialogTitle>
						<DialogDescription className="text-xs">
							This action permanently clears your transactions, invoices, and
							wallet balances from IndexedDB. Download a JSON backup first if
							you want to keep a copy.
						</DialogDescription>
					</DialogHeader>

					<div className="space-y-2 py-2">
						<Label
							htmlFor={`${baseId}-confirm-delete`}
							className="text-xs font-semibold text-foreground"
						>
							Type <code className="font-mono font-bold">DELETE</code> to
							confirm:
						</Label>
						<Input
							id={`${baseId}-confirm-delete`}
							placeholder="DELETE"
							value={deleteConfirmationText}
							onChange={(e) => setDeleteConfirmationText(e.target.value)}
							className="h-10 rounded-xl font-mono"
						/>
					</div>

					<DialogFooter className="gap-2">
						<Button
							type="button"
							variant="outline"
							onClick={() => setResetDialogOpen(false)}
							className="min-h-11 rounded-xl font-semibold"
						>
							Cancel
						</Button>
						<Button
							type="button"
							variant="destructive"
							disabled={deleteConfirmationText !== "DELETE"}
							onClick={() => void handleConfirmReset()}
							className="min-h-11 rounded-xl font-bold"
						>
							Permanently Erase Workspace
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
