"use client";

import { cn } from "@interior-design-ai/ui/lib/utils";
import * as React from "react";

interface TabsProps {
	value: string;
	onValueChange: (value: string) => void;
	children: React.ReactNode;
	className?: string;
}

function Tabs({ value, onValueChange, children, className }: TabsProps) {
	return (
		<div data-slot="tabs" data-value={value} className={className}>
			{React.Children.map(children, (child) => {
				if (
					React.isValidElement<{
						value?: string;
						onValueChange?: (v: string) => void;
					}>(child)
				) {
					return React.cloneElement(child, { value, onValueChange });
				}
				return child;
			})}
		</div>
	);
}

interface TabsListProps {
	children: React.ReactNode;
	value?: string;
	onValueChange?: (value: string) => void;
	className?: string;
}

function TabsList({
	children,
	value,
	onValueChange,
	className,
}: TabsListProps) {
	return (
		<div
			data-slot="tabs-list"
			className={cn("flex gap-1 border-ef-border border-b", className)}
		>
			{React.Children.map(children, (child) => {
				if (
					React.isValidElement<{
						activeValue?: string;
						onSelect?: (v: string) => void;
					}>(child)
				) {
					return React.cloneElement(child, {
						activeValue: value,
						onSelect: onValueChange,
					});
				}
				return child;
			})}
		</div>
	);
}

interface TabsTriggerProps {
	value: string;
	activeValue?: string;
	onSelect?: (value: string) => void;
	children: React.ReactNode;
	className?: string;
}

function TabsTrigger({
	value,
	activeValue,
	onSelect,
	children,
	className,
}: TabsTriggerProps) {
	const isActive = value === activeValue;

	return (
		<button
			type="button"
			data-slot="tabs-trigger"
			data-active={isActive || undefined}
			className={cn(
				"-mb-px border-transparent border-b-2 px-3 py-2 text-xs uppercase tracking-wider transition-colors",
				isActive
					? "border-ef-accent text-ef-accent"
					: "text-ef-text-secondary hover:text-ef-text-primary",
				className,
			)}
			onClick={() => onSelect?.(value)}
		>
			{children}
		</button>
	);
}

interface TabsContentProps {
	value: string;
	activeValue?: string;
	children: React.ReactNode;
	className?: string;
}

function TabsContent({
	value,
	activeValue,
	children,
	className,
}: TabsContentProps) {
	// Support both controlled (through parent clone) and reading from parent context
	const parentValue = activeValue;
	if (parentValue !== value) return null;

	return (
		<div data-slot="tabs-content" className={className}>
			{children}
		</div>
	);
}

export { Tabs, TabsContent, TabsList, TabsTrigger };
