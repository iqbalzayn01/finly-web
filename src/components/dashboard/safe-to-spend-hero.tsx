import {
	Eye,
	EyeOff,
	ShieldAlert,
	ShieldCheck,
	TriangleAlert,
} from "lucide-react";
import { MoneyValue } from "#/components/money-value";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { Card, CardContent } from "#/components/ui/card";
import { useFinly } from "#/context/finly-context";

export function SafeToSpendHero() {
	const { profile, safeToSpend, togglePrivacyBlur } = useFinly();

	const statusConfig = {
		healthy: {
			label: "Healthy Buffer",
			summaryText: "You are on track.",
			icon: ShieldCheck,
		},
		caution: {
			label: "Caution",
			summaryText: "Pace discretionary spending to protect your buffer.",
			icon: TriangleAlert,
		},
		deficit: {
			label: "Deficit",
			summaryText: "Scheduled obligations exceed your available buffer.",
			icon: ShieldAlert,
		},
	}[safeToSpend.status];

	const StatusIcon = statusConfig.icon;

	return (
		<Card className="shadow-neu-raised rounded-2xl border border-zinc-100 bg-white py-0 dark:border-zinc-800 dark:bg-zinc-900">
			<CardContent className="flex flex-col justify-between gap-4 p-6 sm:flex-row sm:items-center">
				<div className="space-y-1.5">
					<div className="flex flex-wrap items-center gap-2.5">
						<span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
							SAFE-TO-SPEND TODAY:
						</span>
						<div className="flex items-baseline gap-1.5">
							<MoneyValue
								amount={safeToSpend.dailySafeToSpend}
								className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl"
							/>
							<span className="text-sm font-semibold text-muted-foreground">
								/ day
							</span>
						</div>
						<Badge
							variant="outline"
							className="gap-1.5 rounded-full border-zinc-300 bg-zinc-100 px-2.5 py-0.5 text-xs font-semibold text-foreground dark:border-zinc-700 dark:bg-zinc-800"
						>
							<StatusIcon className="size-3.5" />
							<span>{statusConfig.label}</span>
						</Badge>
					</div>

					<p className="text-xs text-muted-foreground sm:text-sm">
						Based on{" "}
						<MoneyValue
							amount={safeToSpend.totalCashOnHand}
							className="font-semibold text-foreground"
						/>{" "}
						cash on hand with{" "}
						<strong className="font-semibold text-foreground tabular-nums">
							{safeToSpend.daysRemainingInCycle} days
						</strong>{" "}
						remaining in this cycle.{" "}
						<span className="font-medium text-foreground">
							{statusConfig.summaryText}
						</span>
					</p>
				</div>

				<div className="flex shrink-0 items-center">
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={togglePrivacyBlur}
						aria-label={
							profile.privacyBlurEnabled
								? "Show monetary balances"
								: "Hide monetary balances"
						}
						className="min-h-10 gap-2 rounded-xl font-semibold"
					>
						{profile.privacyBlurEnabled ? (
							<>
								<Eye className="size-4 text-foreground" />
								<span>Show Balance</span>
							</>
						) : (
							<>
								<EyeOff className="size-4 text-muted-foreground" />
								<span>Hide Balance</span>
							</>
						)}
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
