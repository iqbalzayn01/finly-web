import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import { Slot } from "radix-ui";
import type * as React from "react";

const buttonVariants = cva(
	"group inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-150 outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:transition-transform [&_svg]:duration-200 hover:[&_svg]:scale-110 active:[&_svg]:scale-95 [&_svg:not([class*='size-'])]:size-4",
	{
		variants: {
			variant: {
				default:
					"brutal-btn border-border bg-primary text-primary-foreground hover:bg-primary-hover",
				destructive:
					"brutal-btn border-outflow-border bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40",
				outline:
					"brutal-btn border-border bg-card text-foreground hover:bg-accent hover:text-accent-foreground dark:bg-card dark:hover:bg-muted",
				secondary:
					"brutal-btn border-border bg-secondary text-secondary-foreground hover:bg-secondary/80",
				ghost:
					"border-2 border-transparent hover:border-border hover:bg-accent hover:text-accent-foreground active:translate-y-0.5 dark:hover:bg-muted",
				link: "text-primary underline-offset-4 hover:underline active:translate-y-0.5",
			},
			size: {
				default: "h-10 px-4 py-2 has-[>svg]:px-3.5",
				xs: "h-7 gap-1 rounded-lg px-2.5 text-xs has-[>svg]:px-2 [&_svg:not([class*='size-'])]:size-3.5",
				sm: "h-9 gap-1.5 rounded-xl px-3.5 has-[>svg]:px-3",
				lg: "h-11 rounded-xl px-5 has-[>svg]:px-4",
				icon: "size-10 rounded-xl",
				"icon-xs": "size-7 rounded-lg [&_svg:not([class*='size-'])]:size-3.5",
				"icon-sm": "size-9 rounded-xl",
				"icon-lg": "size-11 rounded-xl",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

function Button({
	className,
	variant = "default",
	size = "default",
	asChild = false,
	...props
}: React.ComponentProps<"button"> &
	VariantProps<typeof buttonVariants> & {
		asChild?: boolean;
	}) {
	const Comp = asChild ? Slot.Root : "button";

	return (
		<Comp
			data-slot="button"
			data-variant={variant}
			data-size={size}
			className={cn(buttonVariants({ variant, size, className }))}
			{...props}
		/>
	);
}

export { Button, buttonVariants };
