import { cn } from "cn";
import type * as React from "react";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
	return (
		<textarea
			data-slot="textarea"
			className={cn(
				"flex field-sizing-content min-h-16 w-full rounded-xl border border-input bg-card/65 px-3.5 py-2 text-base backdrop-blur-md shadow-[inset_0_1px_2px_rgba(15,23,42,0.05)] transition-[color,box-shadow,border-color,background-color] outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-[#6366F1]/70 focus-visible:border-[#6366F1] disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 md:text-sm dark:bg-white/[0.04] dark:aria-invalid:ring-destructive/40",
				className,
			)}
			{...props}
		/>
	);
}

export { Textarea };
