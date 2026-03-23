import { cn } from "@interior-design-ai/ui/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

const badgeVariants = cva(
	"inline-flex items-center px-2 py-0.5 font-medium text-[10px] uppercase tracking-wider",
	{
		variants: {
			variant: {
				default: "border border-ef-border text-ef-text-secondary",
				accent: "border border-ef-accent/20 bg-ef-accent/10 text-ef-accent",
				gold: "border border-ef-gold/20 bg-ef-gold/10 text-ef-gold",
				success: "border border-green-500/20 bg-green-500/10 text-green-400",
				destructive:
					"border border-destructive/20 bg-destructive/10 text-destructive",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

function Badge({
	className,
	variant,
	...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
	return (
		<span
			data-slot="badge"
			className={cn(badgeVariants({ variant }), className)}
			{...props}
		/>
	);
}

export { Badge, badgeVariants };
