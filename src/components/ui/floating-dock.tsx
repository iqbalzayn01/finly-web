"use client";

import { Link, type LinkProps } from "@tanstack/react-router";
import {
	AnimatePresence,
	type MotionValue,
	motion,
	useMotionValue,
	useSpring,
	useTransform,
} from "motion/react";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { cn } from "#/lib/utils";

export interface FloatingDockItem {
	type?: "item";
	id: string;
	title: string;
	icon: ReactNode;
	to?: LinkProps["to"];
	onClick?: () => void;
	isActive?: boolean;
	variant?: "default" | "primary" | "brand" | "avatar";
	badge?: ReactNode;
	renderTrigger?: (button: ReactNode) => ReactNode;
}

export interface FloatingDockDivider {
	type: "divider";
	id: string;
}

export type FloatingDockEntry = FloatingDockItem | FloatingDockDivider;

interface FloatingDockProps {
	items: FloatingDockEntry[];
	placement?: "bottom" | "top";
	className?: string;
	dockClassName?: string;
	ariaLabel?: string;
}

const SPRING_CONFIG = {
	mass: 0.1,
	stiffness: 150,
	damping: 12,
};

function usePrefersReducedMotion() {
	const [reduced, setReduced] = useState(false);

	useEffect(() => {
		const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
		setReduced(mediaQuery.matches);
		const onChange = (event: MediaQueryListEvent) => {
			setReduced(event.matches);
		};
		mediaQuery.addEventListener("change", onChange);
		return () => mediaQuery.removeEventListener("change", onChange);
	}, []);

	return reduced;
}

export function FloatingDock({
	items,
	placement = "bottom",
	className,
	dockClassName,
	ariaLabel,
}: FloatingDockProps) {
	const mouseX = useMotionValue(Infinity);
	const isTop = placement === "top";

	const resolvedAriaLabel =
		ariaLabel ?? (isTop ? "Main navigation" : "Mobile bottom navigation");

	return (
		<nav
			aria-label={resolvedAriaLabel}
			className={cn(
				isTop
					? "no-print pointer-events-none sticky top-3 z-40 hidden w-full justify-center px-4 md:flex"
					: "no-print pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-3 pb-[max(0.875rem,env(safe-area-inset-bottom))] md:hidden",
				className,
			)}
		>
			<div
				onPointerMove={(e) => {
					if (e.pointerType === "mouse") {
						mouseX.set(e.clientX);
					}
				}}
				onPointerLeave={() => mouseX.set(Infinity)}
				className={cn(
					"liquid-glass-elevated pointer-events-auto flex max-w-full rounded-full bg-card/75 backdrop-blur-2xl",
					isTop
						? "h-14 items-start gap-2 px-3 pt-1.5"
						: "h-16 items-end gap-2.5 px-3 pb-2",
					dockClassName,
				)}
			>
				{items.map((entry) =>
					entry.type === "divider" ? (
						<span
							key={entry.id}
							aria-hidden="true"
							className={cn(
								"mx-0.5 w-px shrink-0 self-center bg-border/80",
								isTop ? "h-5" : "h-6",
							)}
						/>
					) : (
						<IconContainer
							key={entry.id}
							mouseX={mouseX}
							item={entry}
							placement={placement}
						/>
					),
				)}
			</div>
		</nav>
	);
}

function IconContainer({
	mouseX,
	item,
	placement,
}: {
	mouseX: MotionValue<number>;
	item: FloatingDockItem;
	placement: "bottom" | "top";
}) {
	const ref = useRef<HTMLDivElement>(null);
	const shouldReduceMotion = usePrefersReducedMotion();
	const [hovered, setHovered] = useState(false);

	const isTop = placement === "top";
	const baseSize = isTop ? 40 : 44;
	const maxSize = isTop ? 54 : 58;
	const baseIconSize = 18;
	const maxIconSize = 25;

	const distance = useTransform(mouseX, (val) => {
		const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
		return val - bounds.x - bounds.width / 2;
	});

	const sizeTransform = useTransform(
		distance,
		[-120, 0, 120],
		shouldReduceMotion
			? [baseSize, baseSize, baseSize]
			: [baseSize, maxSize, baseSize],
	);
	const iconSizeTransform = useTransform(
		distance,
		[-120, 0, 120],
		shouldReduceMotion
			? [baseIconSize, baseIconSize, baseIconSize]
			: [baseIconSize, maxIconSize, baseIconSize],
	);

	const width = useSpring(sizeTransform, SPRING_CONFIG);
	const height = useSpring(sizeTransform, SPRING_CONFIG);
	const widthIcon = useSpring(iconSizeTransform, SPRING_CONFIG);
	const heightIcon = useSpring(iconSizeTransform, SPRING_CONFIG);

	const variant = item.variant ?? "default";
	const isActive = Boolean(item.isActive) && variant === "default";

	const itemClassName = cn(
		"group relative flex size-full items-center justify-center rounded-full border transition-[color,background-color,border-color,box-shadow,transform] duration-150 outline-none cursor-pointer active:scale-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
		(variant === "primary" || variant === "brand") &&
			"border-white/50 bg-primary text-primary-foreground shadow-[0_6px_18px_-6px_rgba(201,243,29,0.55),inset_0_1px_1px_rgba(255,255,255,0.65)] hover:bg-[var(--primary-hover)]",
		variant === "avatar" &&
			"overflow-hidden border-white/40 bg-primary p-0 text-primary-foreground shadow-[0_4px_14px_-4px_rgba(0,0,0,0.28)]",
		isActive &&
			"border-transparent text-background shadow-[0_6px_16px_-6px_rgba(0,0,0,0.35)]",
		variant === "default" &&
			!isActive &&
			"border-white/45 bg-background/55 text-muted-foreground shadow-[inset_0_1px_1px_rgba(255,255,255,0.55)] hover:bg-background/85 hover:text-foreground dark:border-white/12 dark:bg-white/[0.06] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.16)] dark:hover:bg-white/[0.14]",
	);

	const innerContent = (
		<>
			<AnimatePresence>
				{hovered && (
					<motion.span
						initial={
							shouldReduceMotion
								? { opacity: 0 }
								: { opacity: 0, y: isTop ? -6 : 6 }
						}
						animate={
							shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }
						}
						exit={
							shouldReduceMotion
								? { opacity: 0 }
								: { opacity: 0, y: isTop ? -2 : 2 }
						}
						transition={{ duration: 0.14 }}
						className={cn(
							"liquid-glass-elevated pointer-events-none absolute left-1/2 z-30 -translate-x-1/2 whitespace-nowrap rounded-full bg-popover/90 px-2.5 py-1 text-[11px] font-semibold tracking-tight text-popover-foreground",
							isTop ? "-bottom-9" : "-top-9",
						)}
					>
						{item.title}
					</motion.span>
				)}
			</AnimatePresence>

			{isActive && (
				<motion.span
					layoutId={`floating-dock-active-pill-${placement}`}
					transition={
						shouldReduceMotion
							? { duration: 0 }
							: { type: "spring", stiffness: 500, damping: 35 }
					}
					aria-hidden="true"
					className="absolute inset-0 z-0 rounded-full bg-foreground shadow-[inset_0_1px_1px_rgba(255,255,255,0.28)]"
				/>
			)}

			{variant === "avatar" ? (
				<span className="relative z-10 flex size-full items-center justify-center">
					{item.icon}
				</span>
			) : (
				<motion.span
					style={{ width: widthIcon, height: heightIcon }}
					className="relative z-10 flex items-center justify-center [&>svg]:size-full"
				>
					{item.icon}
				</motion.span>
			)}

			{item.badge}
		</>
	);

	const triggerNode = item.to ? (
		<Link
			to={item.to}
			aria-label={item.title}
			aria-current={isActive ? "page" : undefined}
			className={itemClassName}
		>
			{innerContent}
		</Link>
	) : (
		<button
			type="button"
			onClick={item.onClick}
			aria-label={item.title}
			className={itemClassName}
		>
			{innerContent}
		</button>
	);

	return (
		<motion.div
			ref={ref}
			style={{ width, height }}
			onPointerEnter={(e) => {
				if (e.pointerType === "mouse") {
					setHovered(true);
				}
			}}
			onPointerLeave={() => setHovered(false)}
			onFocus={() => setHovered(true)}
			onBlur={() => setHovered(false)}
			className="relative flex aspect-square shrink-0 items-center justify-center"
		>
			{item.renderTrigger ? item.renderTrigger(triggerNode) : triggerNode}
		</motion.div>
	);
}
