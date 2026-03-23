interface DnaSummaryProps {
	house: {
		architecturalStyle: string;
		era: string;
		spatialDimensions: string;
		formComplexity: number;
		thermalOutput: number;
		lightingExposure: number;
		primaryMaterial: string | null;
		secondaryMaterial: string | null;
		colorPalette: string | null;
		texture: string | null;
		mood: string | null;
	};
}

function ParamRow({
	label,
	value,
}: {
	label: string;
	value: string | number | null;
}) {
	if (value == null || value === "") return null;

	return (
		<div className="flex items-center justify-between border-ef-border border-b py-2">
			<span className="text-[10px] text-ef-text-secondary uppercase tracking-widest">
				{label}
			</span>
			{typeof value === "number" ? (
				<div className="flex items-center gap-2">
					<div className="h-1 w-16 bg-ef-border">
						<div
							className="h-full bg-ef-accent"
							style={{ width: `${value}%` }}
						/>
					</div>
					<span className="min-w-[3ch] font-mono text-ef-text-primary text-xs">
						{value}
					</span>
				</div>
			) : (
				<span className="text-ef-text-primary text-xs">{value}</span>
			)}
		</div>
	);
}

export function DnaSummary({ house }: DnaSummaryProps) {
	return (
		<div className="border border-ef-border bg-ef-bg-surface p-4">
			<h3 className="mb-3 font-medium text-[10px] text-ef-gold uppercase tracking-widest">
				Architectural DNA
			</h3>
			<div className="flex flex-col">
				<ParamRow label="Style" value={house.architecturalStyle} />
				<ParamRow label="Era" value={house.era} />
				<ParamRow label="Dimensions" value={house.spatialDimensions} />
				<ParamRow label="Form Complexity" value={house.formComplexity} />
				<ParamRow label="Thermal Output" value={house.thermalOutput} />
				<ParamRow label="Lighting Exposure" value={house.lightingExposure} />
				<ParamRow label="Primary Material" value={house.primaryMaterial} />
				<ParamRow label="Secondary Material" value={house.secondaryMaterial} />
				<ParamRow label="Color Palette" value={house.colorPalette} />
				<ParamRow label="Texture" value={house.texture} />
				<ParamRow label="Mood" value={house.mood} />
			</div>
		</div>
	);
}
