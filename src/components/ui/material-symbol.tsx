import { cn } from "cn";
import type * as React from "react";

export interface MaterialSymbolProps
	extends React.HTMLAttributes<HTMLSpanElement> {
	name: string;
	filled?: boolean;
	weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700;
	grade?: -25 | 0 | 200;
	opsz?: 20 | 24 | 40 | 48;
	size?: number | string;
}

export function MaterialSymbol({
	name,
	filled = false,
	weight = 400,
	grade = 0,
	opsz = 24,
	size,
	className,
	style,
	...props
}: MaterialSymbolProps) {
	return (
		<span
			className={cn(
				"material-symbols-rounded inline-flex select-none items-center justify-center leading-none",
				filled && "fill",
				className,
			)}
			style={{
				fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' ${weight}, 'GRAD' ${grade}, 'opsz' ${opsz}`,
				fontSize: size
					? typeof size === "number"
						? `${size}px`
						: size
					: undefined,
				...style,
			}}
			aria-hidden="true"
			{...props}
		>
			{name}
		</span>
	);
}
