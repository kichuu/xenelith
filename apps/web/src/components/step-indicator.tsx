"use client";

import { cn } from "@interior-design-ai/ui/lib/utils";

const STEPS = [
	{ number: "01", label: "Structure" },
	{ number: "02", label: "Environment" },
	{ number: "03", label: "Synthesis" },
] as const;

interface StepIndicatorProps {
	currentStep: number;
	onStepClick: (step: number) => void;
}

export function StepIndicator({
	currentStep,
	onStepClick,
}: StepIndicatorProps) {
	return (
		<div className="flex flex-col gap-6">
			{STEPS.map((step, index) => {
				const stepNum = index + 1;
				const isActive = stepNum === currentStep;
				const isComplete = stepNum < currentStep;

				return (
					<button
						key={step.number}
						type="button"
						onClick={() => onStepClick(stepNum)}
						className={cn(
							"flex items-center gap-3 text-left transition-colors",
							isActive
								? "text-ef-accent"
								: isComplete
									? "text-ef-text-primary"
									: "text-ef-text-secondary",
						)}
					>
						<span
							className={cn(
								"flex size-8 items-center justify-center border font-mono text-xs",
								isActive
									? "border-ef-accent bg-ef-accent/10 text-ef-accent"
									: isComplete
										? "border-ef-text-secondary bg-ef-text-secondary/10"
										: "border-ef-border",
							)}
						>
							{step.number}
						</span>
						<span className="text-[11px] uppercase tracking-widest">
							{step.label}
						</span>
					</button>
				);
			})}
		</div>
	);
}
