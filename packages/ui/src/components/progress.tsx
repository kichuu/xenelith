import { cn } from "@interior-design-ai/ui/lib/utils";
import type * as React from "react";

interface ProgressProps extends React.ComponentProps<"div"> {
	value: number;
	max?: number;
}

function Progress({ value, max = 100, className, ...props }: ProgressProps) {
	const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

	return (
		<div
			data-slot="progress"
			className={cn(
				"relative h-1 w-full overflow-hidden bg-ef-border",
				className,
			)}
			{...props}
		>
			<div
				className="h-full bg-ef-accent transition-all duration-500 ease-out"
				style={{ width: `${percentage}%` }}
			/>
		</div>
	);
}

export { Progress };
