import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
	ArrowLeft,
	ArrowRight,
	Eye,
	EyeOff,
	Rocket,
	Sparkles,
} from "lucide-react";
import type { FormEvent } from "react";
import { useId, useMemo, useState } from "react";
import { BrandLogo } from "#/components/brand-logo";
import { Button } from "#/components/ui/button";
import { Card, CardContent } from "#/components/ui/card";
import { Checkbox } from "#/components/ui/checkbox";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { Progress } from "#/components/ui/progress";
import { useFinly } from "#/context/finly-context";
import {
	CURRENCIES,
	formatLiveNumericInput,
	parseNumericInput,
} from "#/lib/format";
import { cn } from "#/lib/utils";

export const Route = createFileRoute("/signup")({
	component: SignupOnboardingScreen,
});

function evaluatePasswordStrength(pwd: string): {
	tier: "Weak" | "Good" | "Strong";
	score: number;
	colorClass: string;
} {
	if (pwd.length < 8) {
		return {
			tier: "Weak",
			score: 33,
			colorClass: "text-zinc-500",
		};
	}
	const hasMixed = /[A-Z]/.test(pwd) && /[0-9]/.test(pwd) && pwd.length >= 10;
	if (hasMixed) {
		return {
			tier: "Strong",
			score: 100,
			colorClass: "text-foreground font-bold",
		};
	}
	return {
		tier: "Good",
		score: 68,
		colorClass: "text-zinc-700 dark:text-zinc-300 font-semibold",
	};
}

function SignupOnboardingScreen() {
	const navigate = useNavigate();
	const { profile, completeOnboarding } = useFinly();
	const baseId = useId();
	const currencyMeta = CURRENCIES[profile.currency];

	const [step, setStep] = useState<1 | 2>(1);

	// Step 1 fields
	const [fullName, setFullName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [agreedToTerms, setAgreedToTerms] = useState(true);

	// Step 2 fields
	const [startingCashRaw, setStartingCashRaw] = useState("4,250.00");

	const pwdStrength = useMemo(
		() => evaluatePasswordStrength(password),
		[password],
	);

	const canContinueStep1 =
		fullName.trim().length >= 2 &&
		/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) &&
		password.length >= 8 &&
		agreedToTerms;

	const handleStep1Submit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!canContinueStep1) return;
		setStep(2);
	};

	const handleLaunchDashboard = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const startingBalance = parseNumericInput(startingCashRaw);
		completeOnboarding({
			displayName: fullName.trim(),
			email: email.trim(),
			startingBalance,
		});
		void navigate({ to: "/" });
	};

	return (
		<div className="flex min-h-screen flex-col justify-between bg-zinc-100 p-6 sm:p-10 dark:bg-zinc-950">
			{/* Top Header */}
			<div className="mx-auto flex w-full max-w-2xl items-center justify-between">
				<Link
					to="/"
					className="inline-flex items-center gap-2.5 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring"
				>
					<BrandLogo size={28} variant="neutral" />
					<span className="font-mono text-lg font-extrabold tracking-tight text-foreground">
						Finly
					</span>
				</Link>

				<Link
					to="/login"
					className="font-mono text-xs font-semibold text-muted-foreground hover:text-foreground"
				>
					Already have a workspace?{" "}
					<span className="font-bold text-foreground underline">Sign in</span>
				</Link>
			</div>

			{/* Centered 2-Step Onboarding Card */}
			<div className="mx-auto my-8 w-full max-w-xl space-y-6">
				{/* Step Indicator */}
				<div className="space-y-2">
					<div className="flex items-center justify-between font-mono text-xs font-semibold">
						<span className="inline-flex items-center gap-1.5 text-foreground">
							<Sparkles className="size-3.5" />
							<span>Step {step} of 2</span>
						</span>
						<span className="text-muted-foreground">
							{step === 1 ? "Account Credentials" : "Starting Cash on Hand"}
						</span>
					</div>
					<Progress value={step === 1 ? 50 : 100} className="h-2" />
				</div>

				<Card className="shadow-neu-raised rounded-2xl border border-zinc-100 bg-white py-0 dark:border-zinc-800 dark:bg-zinc-900">
					<CardContent className="p-6 sm:p-8">
						{step === 1 ? (
							<form onSubmit={handleStep1Submit} className="space-y-5">
								<div className="space-y-1">
									<h1 className="font-mono text-2xl font-extrabold tracking-tight text-foreground">
										Create your cashflow workspace
									</h1>
									<p className="text-xs text-muted-foreground sm:text-sm">
										Get set up in under 60 seconds — zero bank credentials
										required.
									</p>
								</div>

								<div className="space-y-4">
									<div className="space-y-1.5">
										<Label
											htmlFor={`${baseId}-fullname`}
											className="font-mono text-xs font-semibold"
										>
											Full Name or Studio Name
										</Label>
										<Input
											id={`${baseId}-fullname`}
											required
											placeholder="Alex Zayyan"
											value={fullName}
											onChange={(e) => setFullName(e.target.value)}
											className="h-11 rounded-xl"
										/>
									</div>

									<div className="space-y-1.5">
										<Label
											htmlFor={`${baseId}-email`}
											className="font-mono text-xs font-semibold"
										>
											Email Address
										</Label>
										<Input
											id={`${baseId}-email`}
											type="email"
											required
											placeholder="alex@designstudio.dev"
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											className="h-11 rounded-xl"
										/>
									</div>

									<div className="space-y-2">
										<Label
											htmlFor={`${baseId}-pwd`}
											className="font-mono text-xs font-semibold"
										>
											Create Password (8+ characters)
										</Label>
										<div className="relative">
											<Input
												id={`${baseId}-pwd`}
												type={showPassword ? "text" : "password"}
												required
												minLength={8}
												placeholder="At least 8 characters"
												value={password}
												onChange={(e) => setPassword(e.target.value)}
												className="h-11 rounded-xl pr-11"
											/>
											<button
												type="button"
												onClick={() => setShowPassword((prev) => !prev)}
												aria-label={
													showPassword ? "Hide password" : "Show password"
												}
												className="absolute top-1/2 right-2.5 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground cursor-pointer"
											>
												{showPassword ? (
													<EyeOff className="size-4" />
												) : (
													<Eye className="size-4" />
												)}
											</button>
										</div>

										{/* 3-Tier Password Strength Meter */}
										{password.length > 0 && (
											<div className="space-y-1 pt-0.5">
												<Progress value={pwdStrength.score} className="h-1.5" />
												<div className="flex items-center justify-between font-mono text-[11px]">
													<span className="text-muted-foreground">
														Password strength
													</span>
													<span
														className={cn("font-bold", pwdStrength.colorClass)}
													>
														{pwdStrength.tier}
													</span>
												</div>
											</div>
										)}
									</div>

									<div className="flex items-start gap-2.5 pt-1">
										<Checkbox
											id={`${baseId}-terms`}
											checked={agreedToTerms}
											onCheckedChange={(checked) =>
												setAgreedToTerms(checked === true)
											}
											className="mt-0.5"
										/>
										<Label
											htmlFor={`${baseId}-terms`}
											className="text-xs text-muted-foreground leading-relaxed cursor-pointer"
										>
											I agree to Finly&apos;s Terms of Service &amp; Local-First
											Privacy Policy.
										</Label>
									</div>
								</div>

								<Button
									type="submit"
									disabled={!canContinueStep1}
									className="min-h-11 w-full gap-2 rounded-xl font-mono font-bold text-sm shadow-neu-sm"
								>
									<span>Continue to Workspace Setup</span>
									<ArrowRight className="size-4" />
								</Button>
							</form>
						) : (
							<form onSubmit={handleLaunchDashboard} className="space-y-6">
								<div className="space-y-1">
									<h1 className="font-mono text-2xl font-extrabold tracking-tight text-foreground">
										Set starting cash on hand
									</h1>
									<p className="text-xs text-muted-foreground sm:text-sm">
										Finly calculates your daily Safe-to-Spend limit
										automatically. You can adjust this anytime in Settings.
									</p>
								</div>

								{/* Starting Cash on Hand */}
								<div className="space-y-1.5">
									<Label
										htmlFor={`${baseId}-starting-cash`}
										className="font-mono text-xs font-semibold"
									>
										Current Cash on Hand (Optional)
									</Label>
									<div className="shadow-neu-inset relative flex items-center rounded-2xl bg-zinc-100 px-4 py-2.5 focus-within:ring-2 focus-within:ring-ring dark:bg-zinc-800">
										<span className="mr-2 font-mono text-xl font-bold text-muted-foreground select-none">
											{currencyMeta.symbol}
										</span>
										<input
											id={`${baseId}-starting-cash`}
											type="text"
											inputMode="decimal"
											placeholder="0.00"
											value={startingCashRaw}
											onChange={(e) =>
												setStartingCashRaw(
													formatLiveNumericInput(
														e.target.value,
														profile.currency,
													),
												)
											}
											className="w-full bg-transparent font-mono text-2xl font-extrabold tracking-tight text-foreground focus-visible:outline-none focus-visible:ring-0 placeholder:text-muted-foreground/40 tabular-nums"
										/>
									</div>
									<p className="text-[11px] text-muted-foreground">
										Leave blank to start at {currencyMeta.symbol}0.00 and log
										entries as you go.
									</p>
								</div>

								<div className="flex items-center gap-3 pt-1">
									<Button
										type="button"
										variant="outline"
										onClick={() => setStep(1)}
										className="min-h-11 gap-1.5 rounded-xl px-4 font-mono font-semibold"
									>
										<ArrowLeft className="size-4" />
										<span>Back</span>
									</Button>
									<Button
										type="submit"
										className="min-h-11 flex-1 gap-2 rounded-xl font-mono font-bold text-sm shadow-neu-sm"
									>
										<Rocket className="size-4" />
										<span>Launch My Cashflow Dashboard</span>
									</Button>
								</div>
							</form>
						)}
					</CardContent>
				</Card>
			</div>

			<p className="text-center font-mono text-[11px] text-muted-foreground">
				Finly · Built for instant daily cashflow clarity
			</p>
		</div>
	);
}
