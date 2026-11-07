import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, Eye, EyeOff, Lock } from "lucide-react";
import type { FormEvent } from "react";
import { useId, useState } from "react";
import { toast } from "sonner";
import { BrandLogo } from "#/components/brand-logo";
import { Button } from "#/components/ui/button";
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
			{/* Left Brand & Editorial Bento Column */}
			<div className="hidden flex-col justify-between border-r-2 border-border bg-card p-10 text-foreground xl:p-14 lg:flex">
				<div className="space-y-10">
					<Link
						to="/"
						className="group inline-flex items-center gap-3 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring"
					>
						<span className="brutal-surface flex size-10 items-center justify-center rounded-xl bg-primary transition-transform duration-200 group-hover:-rotate-6 group-hover:scale-105">
							<BrandLogo size={22} variant="monochrome" />
						</span>
						<span className="font-mono text-xl font-black tracking-tight text-foreground">
							Finly
						</span>
					</Link>

					<div className="max-w-md space-y-5">
						<span className="inline-block rounded-lg border-2 border-border bg-primary px-3 py-1 font-mono text-[10px] font-extrabold uppercase tracking-wider text-primary-foreground">
							Simple Money Tracker
						</span>
						<h1 className="font-mono text-4xl font-black leading-tight tracking-tight text-foreground">
							Know what is safe to spend today.
						</h1>
						<p className="font-mono text-xs leading-relaxed text-muted-foreground sm:text-sm">
							Simple, everyday money tracking built for freelancers, creators,
							and small businesses.
						</p>

						<ul className="space-y-3 pt-2 font-mono text-xs font-semibold text-foreground">
							<li className="flex items-center gap-3">
								<span className="flex size-6 shrink-0 items-center justify-center rounded-lg border border-inflow-border bg-inflow-bg text-inflow">
									<CheckCircle2 className="size-3.5" />
								</span>
								<span>Add income and expenses in seconds</span>
							</li>
							<li className="flex items-center gap-3">
								<span className="flex size-6 shrink-0 items-center justify-center rounded-lg border border-inflow-border bg-inflow-bg text-inflow">
									<CheckCircle2 className="size-3.5" />
								</span>
								<span>Automatic daily spending limit</span>
							</li>
							<li className="flex items-center gap-3">
								<span className="flex size-6 shrink-0 items-center justify-center rounded-lg border border-info-border bg-info-bg text-info">
									<CheckCircle2 className="size-3.5" />
								</span>
								<span>Easy client invoices and payment tracking</span>
							</li>
						</ul>
					</div>
				</div>

				{/* Social Proof Bento Tile */}
				<div className="bento-card bento-card-static max-w-md space-y-3 bg-background p-6">
					<p className="font-mono text-xs leading-relaxed text-foreground sm:text-sm">
						&ldquo;Finally, a money app that uses plain language instead of
						confusing accounting terms.&rdquo;
					</p>
					<div className="flex items-center gap-2.5 font-mono text-xs">
						<span className="brutal-surface flex size-8 items-center justify-center rounded-xl bg-primary font-extrabold text-primary-foreground">
							SM
						</span>
						<div>
							<p className="font-bold text-foreground">Studio Monolith</p>
							<p className="text-[11px] text-muted-foreground">
								Design Studio
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Right Sign-In Form Column */}
			<div className="flex flex-col justify-between p-6 sm:p-10">
				<div className="flex items-center justify-between">
					<Link
						to="/"
						className="group inline-flex items-center gap-2 font-mono text-xs font-bold text-muted-foreground hover:text-foreground"
					>
						<ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
						<span>Back to Dashboard</span>
					</Link>

					<div className="flex items-center gap-2 lg:hidden">
						<span className="brutal-surface flex size-8 items-center justify-center rounded-xl bg-primary">
							<BrandLogo size={18} variant="monochrome" />
						</span>
						<span className="font-mono text-sm font-black text-foreground">
							Finly
						</span>
					</div>
				</div>

				<div className="mx-auto w-full max-w-md py-8">
					<div className="space-y-1.5 text-center sm:text-left">
						<h2 className="font-mono text-2xl font-black tracking-tight text-foreground sm:text-3xl">
							Welcome back
						</h2>
						<p className="font-mono text-xs text-muted-foreground">
							Sign in to view your balance, daily limit, and invoices.
						</p>
					</div>

					<div className="bento-card bento-card-static mt-6 space-y-5 bg-card p-6">
						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="space-y-1.5">
								<Label
									htmlFor={`${baseId}-identifier`}
									className="font-mono text-[11px] font-bold uppercase tracking-wider text-muted-foreground"
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
										"h-11 rounded-xl bg-background font-mono text-xs",
										identifierInvalid && "border-destructive",
									)}
								/>
								{identifierInvalid && (
									<p className="font-mono text-[11px] font-medium text-outflow">
										Enter a valid email address or phone number.
									</p>
								)}
							</div>

							<div className="space-y-1.5">
								<div className="flex items-center justify-between">
									<Label
										htmlFor={`${baseId}-password`}
										className="font-mono text-[11px] font-bold uppercase tracking-wider text-muted-foreground"
									>
										Password
									</Label>
									<button
										type="button"
										onClick={() =>
											toast.info(
												"Your data is stored on this device — no server password reset needed.",
											)
										}
										className="font-mono text-xs font-bold text-foreground underline decoration-primary decoration-2 underline-offset-4 cursor-pointer"
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
							</div>

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
									className="font-mono text-xs text-muted-foreground cursor-pointer"
								>
									Keep me signed in on this device
								</Label>
							</div>

							<Button
								type="submit"
								className="h-11 w-full gap-2 rounded-xl bg-primary font-mono text-xs font-extrabold uppercase tracking-wider text-primary-foreground cursor-pointer"
							>
								<Lock className="size-4" />
								<span>Sign In</span>
							</Button>
						</form>

						<div className="relative flex items-center justify-center">
							<div className="w-full border-t-2 border-border" />
							<span className="bg-card px-3 font-mono text-[11px] font-bold uppercase text-muted-foreground">
								or
							</span>
							<div className="w-full border-t-2 border-border" />
						</div>

						<Button
							type="button"
							variant="outline"
							onClick={handleGoogleContinue}
							className="h-11 w-full gap-2.5 rounded-xl bg-background font-mono text-xs font-bold"
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
					</div>

					<p className="mt-6 text-center font-mono text-xs text-muted-foreground">
						New here?{" "}
						<Link
							to="/signup"
							className="font-bold text-foreground underline decoration-primary decoration-2 underline-offset-4"
						>
							Create free account
						</Link>
					</p>
				</div>

				<p className="text-center font-mono text-[11px] text-muted-foreground">
					100% private · Saved locally on your device
				</p>
			</div>
		</div>
	);
}
