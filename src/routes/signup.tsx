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
			colorClass: "text-outflow",
		};
	}
	const hasMixed = /[A-Z]/.test(pwd) && /[0-9]/.test(pwd) && pwd.length >= 10;
	if (hasMixed) {
		return {
			tier: "Strong",
			score: 100,
			colorClass: "text-inflow",
		};
	}
	return {
		tier: "Good",
		score: 68,
		colorClass: "text-warning",
	};
}

function SignupOnboardingScreen() {
	const navigate = useNavigate();
	const { profile, completeOnboarding } = useFinly();
	const baseId = useId();
	const currencyMeta = CURRENCIES[profile.currency];

	const [step, setStep] = useState<1 | 2>(1);

	const [fullName, setFullName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [agreedToTerms, setAgreedToTerms] = useState(true);

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
		<div className="flex min-h-screen flex-col justify-between bg-background p-6 sm:p-10">
			{/* Top Header */}
			<div className="mx-auto flex w-full max-w-2xl items-center justify-between">
				<Link
					to="/"
					className="group inline-flex items-center gap-2.5 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring"
				>
					<span className="brutal-surface flex size-9 items-center justify-center rounded-xl bg-primary transition-transform duration-200 group-hover:-rotate-6 group-hover:scale-105">
						<BrandLogo size={20} variant="monochrome" />
					</span>
					<span className="font-mono text-lg font-black tracking-tight text-foreground">
						Finly
					</span>
				</Link>

				<Link
					to="/login"
					className="font-mono text-xs font-semibold text-muted-foreground hover:text-foreground"
				>
					Already have an account?{" "}
					<span className="font-bold text-foreground underline decoration-primary decoration-2 underline-offset-4">
						Sign in
					</span>
				</Link>
			</div>

			{/* Centered 2-Step Onboarding Bento Card */}
			<div className="mx-auto my-8 w-full max-w-xl space-y-5">
				<div className="space-y-2">
					<div className="flex items-center justify-between font-mono text-xs font-semibold">
						<span className="inline-flex items-center gap-1.5 rounded-lg border-2 border-border bg-primary px-2.5 py-0.5 text-[11px] font-extrabold uppercase text-primary-foreground">
							<Sparkles className="size-3" />
							<span>Step {step} of 2</span>
						</span>
						<span className="text-muted-foreground">
							{step === 1 ? "Your Details" : "Starting Balance"}
						</span>
					</div>
					<Progress value={step === 1 ? 50 : 100} className="h-2.5 border border-border" />
				</div>

				<div className="bento-card bento-card-static bg-card p-6 sm:p-8">
					{step === 1 ? (
						<form onSubmit={handleStep1Submit} className="space-y-5">
							<div className="space-y-1 border-b-2 border-border pb-4">
								<h1 className="font-mono text-2xl font-black tracking-tight text-foreground">
									Create your account
								</h1>
								<p className="font-mono text-xs text-muted-foreground">
									Get started in under a minute — no bank connection needed.
								</p>
							</div>

							<div className="space-y-4">
								<div className="space-y-1.5">
									<Label
										htmlFor={`${baseId}-fullname`}
										className="font-mono text-[11px] font-bold uppercase tracking-wider text-muted-foreground"
									>
										Your Name or Studio Name
									</Label>
									<Input
										id={`${baseId}-fullname`}
										required
										placeholder="Alex Zayyan"
										value={fullName}
										onChange={(e) => setFullName(e.target.value)}
										className="h-11 rounded-xl bg-background font-mono text-xs"
									/>
								</div>

								<div className="space-y-1.5">
									<Label
										htmlFor={`${baseId}-email`}
										className="font-mono text-[11px] font-bold uppercase tracking-wider text-muted-foreground"
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
										className="h-11 rounded-xl bg-background font-mono text-xs"
									/>
								</div>

								<div className="space-y-2">
									<Label
										htmlFor={`${baseId}-pwd`}
										className="font-mono text-[11px] font-bold uppercase tracking-wider text-muted-foreground"
									>
										Password (8+ characters)
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
											className="h-11 rounded-xl bg-background pr-11 font-mono text-xs"
										/>
										<button
											type="button"
											onClick={() => setShowPassword((prev) => !prev)}
											aria-label={
												showPassword ? "Hide password" : "Show password"
											}
											className="absolute top-1/2 right-2.5 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer"
										>
											{showPassword ? (
												<EyeOff className="size-4" />
											) : (
												<Eye className="size-4" />
											)}
										</button>
									</div>

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
										className="font-mono text-xs leading-relaxed text-muted-foreground cursor-pointer"
									>
										I agree to the Terms of Service and Privacy Policy.
									</Label>
								</div>
							</div>

							<Button
								type="submit"
								disabled={!canContinueStep1}
								className="h-11 w-full gap-2 rounded-xl bg-primary font-mono text-xs font-extrabold uppercase tracking-wider text-primary-foreground"
							>
								<span>Continue</span>
								<ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
							</Button>
						</form>
					) : (
						<form onSubmit={handleLaunchDashboard} className="space-y-6">
							<div className="space-y-1 border-b-2 border-border pb-4">
								<h1 className="font-mono text-2xl font-black tracking-tight text-foreground">
									Enter your starting balance
								</h1>
								<p className="font-mono text-xs text-muted-foreground">
									We use this to calculate your daily Safe-to-Spend limit. You
									can change it anytime in Settings.
								</p>
							</div>

							<div className="space-y-1.5">
								<Label
									htmlFor={`${baseId}-starting-cash`}
									className="font-mono text-[11px] font-bold uppercase tracking-wider text-muted-foreground"
								>
									Current Balance (Optional)
								</Label>
								<div className="brutal-surface relative flex items-center rounded-2xl bg-background px-4 py-2.5 focus-within:border-primary">
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
										className="w-full bg-transparent font-mono text-2xl font-black tracking-tight text-foreground placeholder:text-muted-foreground/40 focus-visible:outline-none focus-visible:ring-0 tabular-nums"
									/>
								</div>
								<p className="font-mono text-[11px] text-muted-foreground">
									Leave blank to start at {currencyMeta.symbol}0.00.
								</p>
							</div>

							<div className="flex items-center gap-3 pt-1">
								<Button
									type="button"
									variant="outline"
									onClick={() => setStep(1)}
									className="h-11 gap-1.5 rounded-xl px-4 font-mono text-xs font-bold"
								>
									<ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
									<span>Back</span>
								</Button>
								<Button
									type="submit"
									className="h-11 flex-1 gap-2 rounded-xl bg-primary font-mono text-xs font-extrabold uppercase tracking-wider text-primary-foreground"
								>
									<Rocket className="size-4" />
									<span>Open Dashboard</span>
								</Button>
							</div>
						</form>
					)}
				</div>
			</div>

			<p className="text-center font-mono text-[11px] text-muted-foreground">
				Finly · Simple daily money tracking
			</p>
		</div>
	);
}
