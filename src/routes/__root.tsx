import "@fontsource-variable/geist-mono";
import "@fontsource-variable/material-symbols-rounded/full.css";
import type { QueryClient } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	Link,
	Outlet,
	Scripts,
} from "@tanstack/react-router";
import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";
import { AppShell } from "#/components/layout/app-shell";
import { Button } from "#/components/ui/button";
import { Toaster } from "#/components/ui/sonner";
import { TooltipProvider } from "#/components/ui/tooltip";
import { FinlyProvider } from "#/context/finly-context";
import appCss from "../styles.css?url";

interface MyRouterContext {
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "Finly — Cashflow & Safe-to-Spend Workspace",
			},
			{
				name: "description",
				content:
					"Crystal-clear cashflow management, daily Safe-to-Spend insights, and plain-language invoicing for freelancers, employees, and micro-businesses.",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),
	component: RootLayout,
	notFoundComponent: RootNotFound,
	shellComponent: RootDocument,
});

function RootLayout() {
	return (
		<ThemeProvider
			attribute="class"
			defaultTheme="system"
			enableSystem
			disableTransitionOnChange
		>
			<TooltipProvider delayDuration={200}>
				<FinlyProvider>
					<AppShell>
						<Outlet />
					</AppShell>
					<Toaster position="top-right" closeButton />
				</FinlyProvider>
			</TooltipProvider>
		</ThemeProvider>
	);
}

function RootNotFound() {
	return (
		<div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-4 text-center">
			<p className="rounded-full bg-muted px-3 py-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
				404 · Page Not Found
			</p>
			<h1 className="text-2xl font-extrabold tracking-tight text-foreground">
				We couldn&apos;t find that workspace view
			</h1>
			<p className="text-sm text-muted-foreground">
				Return to your main cashflow dashboard to check your Safe-to-Spend
				balance and recent ledger entries.
			</p>
			<Button asChild className="min-h-11 rounded-xl px-5 font-bold">
				<Link to="/">Back to Cashflow Dashboard</Link>
			</Button>
		</div>
	);
}

function RootDocument({ children }: { children: ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<HeadContent />
			</head>
			<body>
				{children}
				<Scripts />
			</body>
		</html>
	);
}
