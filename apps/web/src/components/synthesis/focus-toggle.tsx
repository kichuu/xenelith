"use client";

import { cn } from "@interior-design-ai/ui/lib/utils";

const CATEGORIES = [
	"OVERVIEW",
	"TEXTILE FOCUS",
	"LIGHTING DETAIL",
	"SPATIAL FLOW",
] as const;

interface FocusToggleProps {
	active: string | null;
	onChange: (category: string | null) => void;
}

export function FocusToggle({ active, onChange }: FocusToggleProps) {
	return (
		<div className="flex flex-wrap gap-2">
			<button
				type="button"
				onClick={() => onChange(null)}
				className={cn(
					"border px-3 py-1 text-[10px] uppercase tracking-widest transition-colors",
					active === null
						? "border-ef-accent bg-ef-accent/10 text-ef-accent"
						: "border-ef-border text-ef-text-secondary hover:text-ef-text-primary",
				)}
			>
				All
			</button>
			{CATEGORIES.map((cat) => (
				<button
					key={cat}
					type="button"
					onClick={() => onChange(cat)}
					className={cn(
						"border px-3 py-1 text-[10px] uppercase tracking-widest transition-colors",
						active === cat
							? "border-ef-accent bg-ef-accent/10 text-ef-accent"
							: "border-ef-border text-ef-text-secondary hover:text-ef-text-primary",
					)}
				>
					{cat}
				</button>
			))}
		</div>
	);
}
