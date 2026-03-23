import { cn } from "@interior-design-ai/ui/lib/utils";
import { ChevronDown } from "lucide-react";
import type * as React from "react";

interface SelectProps extends React.ComponentProps<"select"> {
	options: { value: string; label: string }[];
	placeholder?: string;
}

function Select({ options, placeholder, className, ...props }: SelectProps) {
	return (
		<div className="relative">
			<select
				data-slot="select"
				className={cn(
					"h-10 w-full min-w-0 appearance-none rounded-none border border-input bg-transparent px-3 py-1.5 pr-8 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30",
					className,
				)}
				{...props}
			>
				{placeholder && (
					<option value="" disabled className="bg-[#1a1a2e] text-neutral-200">
						{placeholder}
					</option>
				)}
				{options.map((opt) => (
					<option key={opt.value} value={opt.value} className="bg-[#1a1a2e] text-neutral-200">
						{opt.label}
					</option>
				))}
			</select>
			<ChevronDown className="pointer-events-none absolute top-1/2 right-2 size-4 -translate-y-1/2 text-ef-text-secondary" />
		</div>
	);
}

export { Select };
