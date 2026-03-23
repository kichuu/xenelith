"use client";

import { cn } from "@interior-design-ai/ui/lib/utils";
import { X } from "lucide-react";
import type * as React from "react";
import { useEffect, useRef } from "react";

interface DialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	children: React.ReactNode;
}

function Dialog({ open, onOpenChange, children }: DialogProps) {
	const dialogRef = useRef<HTMLDialogElement>(null);

	useEffect(() => {
		const el = dialogRef.current;
		if (!el) return;

		if (open) {
			if (!el.open) el.showModal();
		} else {
			if (el.open) el.close();
		}
	}, [open]);

	return (
		<dialog
			ref={dialogRef}
			data-slot="dialog"
			className="m-auto max-h-[85vh] w-full max-w-lg border border-ef-border bg-ef-bg-surface p-0 text-ef-text-primary backdrop:bg-black/60 open:flex open:flex-col"
			onClose={() => onOpenChange(false)}
			onClick={(e) => {
				if (e.target === dialogRef.current) onOpenChange(false);
			}}
		>
			{open && children}
		</dialog>
	);
}

function DialogContent({
	className,
	children,
	...props
}: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="dialog-content"
			className={cn("flex flex-col gap-4 p-6", className)}
			{...props}
		>
			{children}
		</div>
	);
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="dialog-header"
			className={cn(
				"flex items-center justify-between border-ef-border border-b p-4",
				className,
			)}
			{...props}
		/>
	);
}

function DialogTitle({ className, ...props }: React.ComponentProps<"h2">) {
	return (
		<h2
			data-slot="dialog-title"
			className={cn("font-medium text-sm uppercase tracking-wider", className)}
			{...props}
		/>
	);
}

function DialogClose({ onClick }: { onClick: () => void }) {
	return (
		<button
			type="button"
			onClick={onClick}
			className="text-ef-text-secondary transition-colors hover:text-ef-text-primary"
		>
			<X className="size-4" />
		</button>
	);
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="dialog-footer"
			className={cn(
				"flex justify-end gap-2 border-ef-border border-t p-4",
				className,
			)}
			{...props}
		/>
	);
}

export {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
};
