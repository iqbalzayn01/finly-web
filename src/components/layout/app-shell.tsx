import { Link, useLocation } from "@tanstack/react-router";
import {
	Bell,
	ChevronDown,
	Download,
	EyeOff,
	FileText,
	History,
	LayoutDashboard,
	LogOut,
	Moon,
	Plus,
	Search,
	Settings,
	ShieldAlert,
	Sun,
	TriangleAlert,
	WifiOff,
} from "lucide-react";
import { useTheme } from "next-themes";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { BrandLogo } from "#/components/brand-logo";
import { CommandSearchDialog } from "#/components/layout/command-search-dialog";
import { MoneyValue } from "#/components/money-value";
import { QuickTransactionModal } from "#/components/transactions/quick-transaction-modal";
import { Avatar, AvatarFallback } from "#/components/ui/avatar";
import { Button } from "#/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "#/components/ui/popover";
import { Switch } from "#/components/ui/switch";
import { useFinly } from "#/context/finly-context";
import { calculateInvoiceSummary } from "#/lib/cashflow";
import { formatMonthYear } from "#/lib/format";
import { cn } from "#/lib/utils";

export function AppShell({ children }: { children: ReactNode }) {
	const location = useLocation();
	const {
		profile,
		invoices,
		safeToSpend,
		todayISO,
		isInvoicingVisible,
		togglePrivacyBlur,
		openQuickEntry,
		exportCsv,
	} = useFinly();
	const { resolvedTheme, setTheme } = useTheme();

	const [searchOpen, setSearchOpen] = useState(false);
	const [notificationsOpen, setNotificationsOpen] = useState(false);
	const [isOffline, setIsOffline] = useState(false);

	useEffect(() => {
		setIsOffline(!navigator.onLine);
		const onOnline = () => setIsOffline(false);
		const onOffline = () => setIsOffline(true);
		window.addEventListener("online", onOnline);
		window.addEventListener("offline", onOffline);
		return () => {
			window.removeEventListener("online", onOnline);
			window.removeEventListener("offline", onOffline);
		};
	}, []);

	const invoiceSummary = useMemo(
		() => calculateInvoiceSummary(invoices, todayISO),
		[invoices, todayISO],
	);

	const alertCount = useMemo(() => {
		let count = 0;
		if (invoiceSummary.overdueCount > 0) count += 1;
		else if (invoiceSummary.waitingCount > 0) count += 1;
		if (safeToSpend.status !== "healthy") count += 1;
		return count;
	}, [
		invoiceSummary.overdueCount,
		invoiceSummary.waitingCount,
		safeToSpend.status,
	]);

	const isAuthRoute =
		location.pathname === "/login" || location.pathname === "/signup";

	if (isAuthRoute) {
		return <div className="min-h-screen bg-background">{children}</div>;
	}

	// Clean Top Bar Center Navigation — ONLY Dashboard, History, Invoices (PRD §1.3, §2.1, §8)
	const centerNavItems = [
		{
			label: "Dashboard",
			to: "/" as const,
			active: location.pathname === "/",
		},
		{
			label: "History",
			to: "/history" as const,
			active: location.pathname.startsWith("/history"),
		},
		...(isInvoicingVisible
			? [
					{
						label: "Invoices",
						to: "/invoices" as const,
						active: location.pathname.startsWith("/invoices"),
					},
				]
			: []),
	];

	const initials = profile.displayName
		.split(" ")
		.map((part) => part[0])
		.join("")
		.slice(0, 2)
		.toUpperCase();

	const handleToggleTheme = () => {
		const nextTheme = resolvedTheme === "dark" ? "light" : "dark";
		setTheme(nextTheme);
	};

	return (
		<div className="flex min-h-screen flex-col bg-zinc-100 text-foreground dark:bg-zinc-950">
			{/* Offline Resilience Sticky Banner */}
			{isOffline && (
				<div className="no-print sticky top-0 z-50 flex items-center justify-center gap-2 border-b border-amber-300 bg-amber-50 px-4 py-1.5 text-xs font-semibold text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200">
					<WifiOff className="size-3.5 shrink-0" />
					<span>
						Working Offline. Transactions saved locally on this device.
					</span>
				</div>
			)}

			{/* Modern Borderless Pure White Top Bar (PRD v2.0.0 §12 & §2.1) */}
			<header className="no-print sticky top-0 z-40 border-none bg-white shadow-none dark:bg-zinc-950">
				<div className="mx-auto grid h-16 max-w-7xl grid-cols-[1fr_auto] items-center gap-4 px-4 sm:px-6 md:grid-cols-[1fr_auto_1fr] lg:px-8">
					{/* 1. Left Zone: Brand Identity (Monochrome Neutral) */}
					<div className="flex items-center">
						<Link
							to="/"
							className="inline-flex items-center gap-2.5 rounded-xl py-1 pr-2 outline-none focus-visible:ring-2 focus-visible:ring-ring"
						>
							<BrandLogo size={28} variant="neutral" />
							<span className="font-mono text-lg font-bold tracking-tight text-foreground">
								Finly
							</span>
						</Link>
					</div>

					{/* 2. Center Zone: Core Workspace Tabs with Inset Neumorphic Styling (Desktop >= 768px - PRD §2.1) */}
					<nav
						aria-label="Core workspace navigation"
						className="shadow-neu-inset hidden items-center justify-center gap-1.5 rounded-2xl bg-zinc-100 p-1 md:flex dark:bg-zinc-800"
					>
						{centerNavItems.map((item) => (
							<Link
								key={item.to}
								to={item.to}
								className={cn(
									"rounded-xl px-4 py-2 font-mono text-xs uppercase tracking-wider transition-colors",
									item.active
										? "shadow-neu-sm bg-zinc-900 font-bold text-white dark:bg-white dark:text-zinc-900"
										: "font-medium text-muted-foreground hover:text-foreground",
								)}
							>
								{item.label}
							</Link>
						))}
					</nav>

					{/* 3. Right Zone: Utilities & User Profile Dropdown */}
					<div className="flex items-center justify-end gap-1.5 sm:gap-2">
						{/* Quick Search (⌘K) */}
						<Button
							type="button"
							variant="ghost"
							size="icon"
							onClick={() => setSearchOpen(true)}
							aria-label="Search transactions and invoices (Cmd+K)"
							className="min-h-10 min-w-10 rounded-full text-muted-foreground hover:text-foreground sm:size-9 sm:min-h-9 sm:min-w-9"
						>
							<Search className="size-4" />
						</Button>

						{/* Single-Click Theme Switcher (PRD §2.1.3) */}
						<Button
							type="button"
							variant="ghost"
							size="icon"
							onClick={handleToggleTheme}
							aria-label="Switch between light and dark mode"
							className="min-h-10 min-w-10 rounded-full text-muted-foreground hover:text-foreground sm:size-9 sm:min-h-9 sm:min-w-9"
						>
							<Sun className="size-4 scale-100 rotate-0 transition-transform dark:scale-0 dark:-rotate-90" />
							<Moon className="absolute size-4 scale-0 rotate-90 transition-transform dark:scale-100 dark:rotate-0" />
						</Button>

						{/* Notification Dropdown (PRD §2.1.3) */}
						<Popover
							open={notificationsOpen}
							onOpenChange={setNotificationsOpen}
						>
							<PopoverTrigger asChild>
								<Button
									type="button"
									variant="ghost"
									size="icon"
									aria-label="View cashflow and invoice notifications"
									className="relative min-h-10 min-w-10 rounded-full text-muted-foreground hover:text-foreground sm:size-9 sm:min-h-9 sm:min-w-9"
								>
									<Bell className="size-4" />
									{alertCount > 0 && (
										<span className="absolute top-2 right-2 size-2 rounded-full bg-foreground ring-2 ring-card" />
									)}
								</Button>
							</PopoverTrigger>
							<PopoverContent
								align="end"
								className="w-80 rounded-2xl border-border bg-card p-4 shadow-xl"
							>
								<div className="flex items-center justify-between border-b border-border pb-2.5">
									<p className="text-xs font-bold text-foreground">
										Cashflow Alerts
									</p>
									<span className="text-[11px] text-muted-foreground">
										{formatMonthYear(todayISO)}
									</span>
								</div>

								<div className="mt-3 space-y-2.5 text-xs">
									{invoiceSummary.overdueCount > 0 && (
										<Link
											to="/invoices"
											onClick={() => setNotificationsOpen(false)}
											className="flex items-start gap-2.5 rounded-xl border border-zinc-200 bg-zinc-50 p-2.5 transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900/60"
										>
											<TriangleAlert className="mt-0.5 size-4 shrink-0 text-foreground" />
											<div>
												<p className="font-semibold text-foreground">
													{invoiceSummary.overdueCount} Overdue Invoice
													{invoiceSummary.overdueCount > 1 ? "s" : ""}
												</p>
												<p className="text-muted-foreground">
													<MoneyValue
														amount={invoiceSummary.overdueAmount}
														className="font-semibold text-foreground"
													/>{" "}
													past due — click to review &amp; ping
												</p>
											</div>
										</Link>
									)}

									{invoiceSummary.waitingCount > 0 && (
										<Link
											to="/invoices"
											onClick={() => setNotificationsOpen(false)}
											className="flex items-start gap-2.5 rounded-xl border border-border bg-muted/35 p-2.5 transition-colors hover:bg-secondary"
										>
											<FileText className="mt-0.5 size-4 shrink-0 text-foreground" />
											<div>
												<p className="font-semibold text-foreground">
													{invoiceSummary.waitingCount} Pending Client{" "}
													{invoiceSummary.waitingCount === 1
														? "Invoice"
														: "Invoices"}
												</p>
												<p className="text-muted-foreground">
													<MoneyValue
														amount={invoiceSummary.waitingAmount}
														className="font-semibold text-foreground"
													/>{" "}
													waiting to settle
												</p>
											</div>
										</Link>
									)}

									<div
										className={cn(
											"flex items-start gap-2.5 rounded-xl border p-2.5",
											safeToSpend.status === "deficit"
												? "border-zinc-300 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800/80"
												: "border-border bg-background/60",
										)}
									>
										<ShieldAlert className="mt-0.5 size-4 shrink-0 text-foreground" />
										<div>
											<p className="font-semibold text-foreground">
												Safe-to-Spend:{" "}
												<MoneyValue
													amount={safeToSpend.dailySafeToSpend}
													className="font-bold"
												/>{" "}
												/ day
											</p>
											<p className="text-muted-foreground">
												{safeToSpend.daysRemainingInCycle} days remaining in
												cycle · {safeToSpend.runwayMonths} mo runway
											</p>
										</div>
									</div>
								</div>
							</PopoverContent>
						</Popover>

						{/* User Profile Dropdown ([AZ v] — PRD v2.0.0 §2.1.3) */}
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<button
									type="button"
									aria-label="Open user profile and workspace menu"
									className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-border bg-background/80 py-1 pr-2.5 pl-1 transition-colors hover:bg-secondary cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring sm:min-h-9"
								>
									<Avatar className="size-7">
										<AvatarFallback className="bg-muted text-[11px] font-bold text-foreground">
											{initials || "AZ"}
										</AvatarFallback>
									</Avatar>
									<ChevronDown className="size-3.5 text-muted-foreground" />
								</button>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								align="end"
								className="w-64 rounded-2xl p-1.5 shadow-xl"
							>
								{/* Header: User Name + Email (No persona badge - PRD §2.1) */}
								<DropdownMenuLabel className="flex flex-col gap-0.5 px-2.5 py-2">
									<p className="truncate text-xs font-bold text-foreground">
										{profile.displayName}
									</p>
									<p className="truncate text-[11px] font-normal text-muted-foreground">
										{profile.email}
									</p>
								</DropdownMenuLabel>

								<DropdownMenuSeparator />

								{/* Privacy Masking Toggle ($ ••••) */}
								<div className="flex items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-xs">
									<div className="flex items-center gap-2">
										<EyeOff className="size-3.5 text-muted-foreground" />
										<span className="font-medium text-foreground">
											Privacy Mask ($ ••••)
										</span>
									</div>
									<Switch
										size="sm"
										checked={profile.privacyBlurEnabled}
										onCheckedChange={togglePrivacyBlur}
										aria-label="Toggle privacy balance blur"
									/>
								</div>

								<DropdownMenuSeparator />

								{/* Settings & Preferences (/settings) */}
								<DropdownMenuItem
									asChild
									className="rounded-lg px-2.5 py-2 text-xs font-medium cursor-pointer"
								>
									<Link to="/settings">
										<Settings className="size-3.5" />
										<span>Settings &amp; Preferences</span>
									</Link>
								</DropdownMenuItem>

								{/* Export Data (CSV) (PRD §2.1) */}
								<DropdownMenuItem
									onClick={exportCsv}
									className="rounded-lg px-2.5 py-2 text-xs font-medium cursor-pointer"
								>
									<Download className="size-3.5" />
									<span>Export Data (CSV)</span>
								</DropdownMenuItem>

								<DropdownMenuSeparator />

								{/* Sign Out */}
								<DropdownMenuItem
									asChild
									className="rounded-lg px-2.5 py-2 text-xs font-medium text-destructive focus:text-destructive cursor-pointer"
								>
									<Link to="/login">
										<LogOut className="size-3.5" />
										<span>Sign Out</span>
									</Link>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
			</header>

			{/* Main Content Container with Rounded Top Corners (PRD v2.0.0 §13 & §2.1) */}
			<main className="shadow-neu-raised mx-auto mb-16 w-full max-w-7xl flex-1 rounded-t-[32px] bg-white p-6 sm:mb-0 sm:rounded-t-[40px] sm:p-8 lg:p-10 dark:bg-zinc-900">
				{children}
			</main>

			{/* Mobile Bottom Navigation (< 768px — PRD §2.1.3) */}
			<nav
				aria-label="Mobile bottom navigation"
				className="no-print fixed inset-x-0 bottom-0 z-40 flex h-16 items-center justify-around border-t border-border bg-card/95 px-2 backdrop-blur-md md:hidden"
			>
				<Link
					to="/"
					className={cn(
						"flex min-h-11 min-w-11 flex-col items-center justify-center gap-0.5 rounded-xl px-2 text-[10px] font-semibold transition-colors",
						location.pathname === "/"
							? "font-bold text-foreground"
							: "text-muted-foreground hover:text-foreground",
					)}
				>
					<LayoutDashboard className="size-4" />
					<span>Dashboard</span>
				</Link>

				<Link
					to="/history"
					className={cn(
						"flex min-h-11 min-w-11 flex-col items-center justify-center gap-0.5 rounded-xl px-2 text-[10px] font-semibold transition-colors",
						location.pathname.startsWith("/history")
							? "font-bold text-foreground"
							: "text-muted-foreground hover:text-foreground",
					)}
				>
					<History className="size-4" />
					<span>History</span>
				</Link>

				<button
					type="button"
					onClick={() => openQuickEntry("money_out")}
					aria-label="Record new transaction"
					className="flex size-12 -translate-y-2 items-center justify-center rounded-2xl bg-zinc-900 text-white shadow-md transition-transform active:scale-95 cursor-pointer dark:bg-white dark:text-zinc-900"
				>
					<Plus className="size-6 stroke-[2.5]" />
				</button>

				<Link
					to="/invoices"
					className={cn(
						"flex min-h-11 min-w-11 flex-col items-center justify-center gap-0.5 rounded-xl px-2 text-[10px] font-semibold transition-colors",
						location.pathname.startsWith("/invoices")
							? "font-bold text-foreground"
							: "text-muted-foreground hover:text-foreground",
					)}
				>
					<FileText className="size-4" />
					<span>Invoices</span>
				</Link>

				<Link
					to="/settings"
					className={cn(
						"flex min-h-11 min-w-11 flex-col items-center justify-center gap-0.5 rounded-xl px-2 text-[10px] font-semibold transition-colors",
						location.pathname.startsWith("/settings")
							? "font-bold text-foreground"
							: "text-muted-foreground hover:text-foreground",
					)}
				>
					<Settings className="size-4" />
					<span>Settings</span>
				</Link>
			</nav>

			{/* Global Dialogs */}
			<CommandSearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
			<QuickTransactionModal />
		</div>
	);
}
