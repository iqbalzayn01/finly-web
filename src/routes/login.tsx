import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, Eye, EyeOff, Lock } from "lucide-react";
import type { FormEvent } from "react";
import { useId, useState } from "react";
import { toast } from "sonner";
import { BrandLogo } from "#/components/brand-logo";
import { Button } from "#/components/ui/button";
import { Card, CardContent } from "#/components/ui/card";
import { Checkbox } from "#/components/ui/checkbox";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { useFinly } from "#/context/finly-context";
import { cn } from "#/lib/utils";

export const Route = createFileRoute("/login")({
	component: LoginScreen,
});

function isValidEmailOrPhone(raw: string): boolean {
	const value = raw.trim();
	if (!value) return false;
	const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	const phonePattern = /^\+?[0-9\s()-]{8,18}$/;
	return emailPattern.test(value) || phonePattern.test(value);
}

function LoginScreen() {
	const navigate = useNavigate();
	const { profile, updateProfile } = useFinly();
	const baseId = useId();

	const [identifier, setIdentifier] = useState(profile.email);
	const [identifierTouched, setIdentifierTouched] = useState(false);
	const [password, setPassword] = useState("••••••••••••");
	const [showPassword, setShowPassword] = useState(false);
	const [rememberDevice, setRememberDevice] = useState(true);

	const identifierInvalid =
		identifierTouched && !isValidEmailOrPhone(identifier);

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIdentifierTouched(true);
		if (!isValidEmailOrPhone(identifier) || password.trim().length < 4) {
			return;
		}
		if (identifier.includes("@")) {
			updateProfile({ email: identifier.trim() });
		}
		toast.success("Signed in to your local Finly workspace");
		void navigate({ to: "/" });
	};

	const handleGoogleContinue = () => {
		toast.success("Authenticated with Google workspace profile");
		void navigate({ to: "/" });
	};

	return (
		<div className="grid min-h-screen bg-background lg:grid-cols-2">
			{/* Left Brand & Trust Column (Desktop >= 1024px — PRD §4.1) */}
			<div className="hidden flex-col justify-between border-r border-border bg-muted/40 p-10 xl:p-14 lg:flex">
				<div className="space-y-10">
					<Link
						to="/"
						className="inline-flex items-center gap-3 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring"
					>
						<BrandLogo size={32} variant="neutral" />
						<span className="font-mono text-xl font-extrabold tracking-tight text-foreground">
							Finly
						</span>
					</Link>

					<div className="max-w-md space-y-5">
						<h1 className="text-4xl font-extrabold tracking-tight text-foreground leading-tight">
							Know what is safe to spend today.
						</h1>
						<p className="text-sm text-muted-foreground leading-relaxed">
							Calm, plain-language cashflow clarity designed for independent
							creators, salaried professionals, and micro-businesses.
						</p>

						<ul className="space-y-3.5 pt-2 text-sm font-medium text-foreground">
							<li className="flex items-center gap-3">
								<CheckCircle2 className="size-4 shrink-0 text-foreground" />
								<span>
									3-second transaction logging with zero accounting jargon
								</span>
							</li>
							<li className="flex items-center gap-3">
								<CheckCircle2 className="size-4 shrink-0 text-foreground" />
								<span>
									Real-time daily Safe-to-Spend &amp; runway calculation
								</span>
							</li>
							<li className="flex items-center gap-3">
								<CheckCircle2 className="size-4 shrink-0 text-foreground" />
								<span>Instant client invoice tracking &amp; cashflow sync</span>
							</li>
						</ul>
					</div>
				</div>

				{/* Social Proof Quote Card */}
				<Card className="shadow-neu-raised max-w-md rounded-2xl border border-zinc-100 bg-white py-0 dark:border-zinc-800 dark:bg-zinc-900">
					<CardContent className="space-y-3 p-5">
						<p className="text-sm font-medium italic text-foreground leading-relaxed">
							&ldquo;Finally, a finance tracker that speaks human language
							instead of accounting textbooks.&rdquo;
						</p>
						<div className="flex items-center gap-2.5 text-xs">
							<span className="flex size-7 items-center justify-center rounded-full bg-primary/20 font-bold text-foreground">
								SM
							</span>
							<div>
								<p className="font-bold text-foreground">Studio Monolith</p>
								<p className="text-muted-foreground">Independent Design Lab</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Right Sign-In Form Column */}
			<div className="flex flex-col justify-between p-6 sm:p-10">
				<div className="flex items-center justify-between">
					<Link
						to="/"
						className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground"
					>
						<ArrowLeft className="size-3.5" />
						<span>Back to Workspace</span>
					</Link>

					<div className="flex items-center gap-2 lg:hidden">
						<BrandLogo size={24} variant="neutral" />
						<span className="font-mono text-sm font-extrabold text-foreground">
							Finly
						</span>
					</div>
				</div>

				<div className="mx-auto w-full max-w-md py-8">
					<div className="space-y-2 text-center sm:text-left">
						<h2 className="font-mono text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
							Welcome back
						</h2>
						<p className="text-xs text-muted-foreground sm:text-sm">
							Sign in to review your daily Safe-to-Spend allowance and ledger.
						</p>
					</div>

					<Card className="shadow-neu-raised mt-6 rounded-2xl border border-zinc-100 bg-white py-0 dark:border-zinc-800 dark:bg-zinc-900">
						<CardContent className="space-y-5 p-6">
							<form onSubmit={handleSubmit} className="space-y-4">
								{/* Email or Phone */}
								<div className="space-y-1.5">
									<Label
										htmlFor={`${baseId}-identifier`}
										className="text-xs font-semibold"
									>
										Email or Phone Number
									</Label>
									<Input
										id={`${baseId}-identifier`}
										type="text"
										required
										placeholder="alex@designstudio.dev or +1 (555) 019-2834"
										value={identifier}
										onChange={(e) => setIdentifier(e.target.value)}
										onBlur={() => setIdentifierTouched(true)}
										aria-invalid={identifierInvalid}
										className={cn(
											"h-11 rounded-xl",
											identifierInvalid && "border-destructive",
										)}
									/>
									{identifierInvalid && (
										<p className="text-[11px] font-medium text-destructive">
											Enter a valid email address or phone number.
										</p>
									)}
								</div>

								{/* Password + Show/Hide Toggle */}
								<div className="space-y-1.5">
									<div className="flex items-center justify-between">
										<Label
											htmlFor={`${baseId}-password`}
											className="text-xs font-semibold"
										>
											Password
										</Label>
										<button
											type="button"
											onClick={() =>
												toast.info(
													"Local-first workspace: no server password reset needed.",
												)
											}
											className="text-xs font-semibold text-primary hover:underline cursor-pointer"
										>
											Forgot password?
										</button>
									</div>
									<div className="relative">
										<Input
											id={`${baseId}-password`}
											type={showPassword ? "text" : "password"}
											required
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
								</div>

								{/* Remember Device */}
								<div className="flex items-center gap-2.5">
									<Checkbox
										id={`${baseId}-remember`}
										checked={rememberDevice}
										onCheckedChange={(checked) =>
											setRememberDevice(checked === true)
										}
									/>
									<Label
										htmlFor={`${baseId}-remember`}
										className="text-xs text-muted-foreground cursor-pointer"
									>
										Remember this device for 30 days
									</Label>
								</div>

								{/* Primary CTA */}
								<Button
									type="submit"
									className="min-h-11 w-full gap-2 rounded-xl font-bold text-sm shadow-xs"
								>
									<Lock className="size-4" />
									<span>Sign In to Dashboard</span>
								</Button>
							</form>

							<div className="relative flex items-center justify-center">
								<div className="w-full border-t border-border" />
								<span className="bg-card px-3 text-[11px] font-medium uppercase text-muted-foreground">
									or
								</span>
								<div className="w-full border-t border-border" />
							</div>

							<Button
								type="button"
								variant="outline"
								onClick={handleGoogleContinue}
								className="min-h-11 w-full gap-2.5 rounded-xl font-semibold"
							>
								<svg
									aria-hidden="true"
									viewBox="0 0 24 24"
									className="size-4 shrink-0"
								>
									<path
										fill="#4285F4"
										d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v2.98h3.86c2.26-2.09 3.56-5.17 3.56-8.8Z"
									/>
									<path
										fill="#34A853"
										d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-2.98c-1.08.72-2.45 1.16-4.07 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24Z"
									/>
									<path
										fill="#FBBC05"
										d="M5.28 14.31A7.2 7.2 0 0 1 4.9 12c0-.8.14-1.58.38-2.31V6.6H1.29A11.99 11.99 0 0 0 0 12c0 1.93.46 3.77 1.29 5.4l3.99-3.09Z"
									/>
									<path
										fill="#EA4335"
										d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.6l3.99 3.09c.95-2.85 3.6-4.94 6.72-4.94Z"
									/>
								</svg>
								<span>Continue with Google</span>
							</Button>
						</CardContent>
					</Card>

					<p className="mt-6 text-center text-xs text-muted-foreground">
						Don&apos;t have an account?{" "}
						<Link
							to="/signup"
							className="font-bold text-primary hover:underline"
						>
							Create free workspace
						</Link>
					</p>
				</div>

				<p className="text-center text-[11px] text-muted-foreground">
					100% client-side privacy · Stored locally in IndexedDB
				</p>
			</div>
		</div>
	);
}
