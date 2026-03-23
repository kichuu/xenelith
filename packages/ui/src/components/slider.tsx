"use client";

import { cn } from "@interior-design-ai/ui/lib/utils";
import * as React from "react";

interface SliderProps {
	value: number;
	onChange: (value: number) => void;
	min?: number;
	max?: number;
	step?: number;
	labelStart?: string;
	labelEnd?: string;
	className?: string;
}

function Slider({
	value,
	onChange,
	min = 0,
	max = 100,
	step = 1,
	labelStart,
	labelEnd,
	className,
}: SliderProps) {
	const percentage = ((value - min) / (max - min)) * 100;

	return (
		<div className={cn("flex flex-col gap-2", className)}>
			<div className="flex items-center gap-3">
				<input
					type="range"
					min={min}
					max={max}
					step={step}
					value={value}
					onChange={(e) => onChange(Number(e.target.value))}
					className="h-1 w-full cursor-pointer appearance-none bg-ef-border [&::-webkit-slider-thumb]:size-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-none [&::-webkit-slider-thumb]:bg-ef-accent"
					style={{
						background: `linear-gradient(to right, var(--ef-accent) ${percentage}%, var(--ef-border) ${percentage}%)`,
					}}
				/>
				<span className="min-w-[3ch] text-right font-mono text-ef-text-secondary text-xs">
					{value}%
				</span>
			</div>
			{(labelStart || labelEnd) && (
				<div className="flex justify-between text-[10px] text-ef-text-secondary uppercase tracking-widest">
					{labelStart && <span>{labelStart}</span>}
					{labelEnd && <span>{labelEnd}</span>}
				</div>
			)}
		</div>
	);
}

export { Slider };
