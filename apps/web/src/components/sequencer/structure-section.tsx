"use client";

import { Input } from "@interior-design-ai/ui/components/input";
import { Label } from "@interior-design-ai/ui/components/label";
import { Select } from "@interior-design-ai/ui/components/select";
import type { SequencerState } from "@/hooks/use-sequencer-form";

const STYLES = [
	{ value: "MODERN", label: "Modern" },
	{ value: "MINIMALIST", label: "Minimalist" },
	{ value: "INDUSTRIAL", label: "Industrial" },
	{ value: "SCANDINAVIAN", label: "Scandinavian" },
	{ value: "BRUTALIST", label: "Brutalist" },
	{ value: "ART_DECO", label: "Art Deco" },
	{ value: "MID_CENTURY", label: "Mid-Century Modern" },
	{ value: "JAPANESE", label: "Japanese / Wabi-Sabi" },
	{ value: "MEDITERRANEAN", label: "Mediterranean" },
	{ value: "BOHEMIAN", label: "Bohemian" },
	{ value: "CONTEMPORARY", label: "Contemporary" },
	{ value: "TRADITIONAL", label: "Traditional" },
];

const ERAS = [
	{ value: "CONTEMPORARY", label: "Contemporary (2020s)" },
	{ value: "MODERN", label: "Modern (2000s-2010s)" },
	{ value: "LATE_20TH", label: "Late 20th Century" },
	{ value: "MID_20TH", label: "Mid 20th Century" },
	{ value: "EARLY_20TH", label: "Early 20th Century" },
	{ value: "FUTURISTIC", label: "Futuristic" },
];

const DIMENSIONS = [
	{ value: "COMPACT", label: "Compact (< 50m\u00B2)" },
	{ value: "SMALL", label: "Small (50-80m\u00B2)" },
	{ value: "MEDIUM", label: "Medium (80-150m\u00B2)" },
	{ value: "LARGE", label: "Large (150-300m\u00B2)" },
	{ value: "EXPANSIVE", label: "Expansive (300m\u00B2+)" },
];

interface StructureSectionProps {
	state: SequencerState;
	setField: (field: keyof SequencerState, value: string | number) => void;
}

export function StructureSection({ state, setField }: StructureSectionProps) {
	return (
		<div className="flex flex-col gap-6">
			<div>
				<h2 className="font-serif text-ef-gold text-xl italic">Structure</h2>
				<p className="mt-1 text-[11px] text-ef-text-secondary uppercase tracking-widest">
					Define the architectural foundation
				</p>
			</div>

			<div className="flex flex-col gap-4">
				<div className="flex flex-col gap-1.5">
					<Label className="text-[11px] text-ef-text-secondary uppercase tracking-widest">
						Project Name
					</Label>
					<Input
						value={state.name}
						onChange={(e) => setField("name", e.target.value)}
						placeholder="e.g. Nordic Sanctuary"
						className="border-ef-border bg-ef-bg-deep text-ef-text-primary placeholder:text-ef-text-secondary/50"
					/>
				</div>

				<div className="flex flex-col gap-1.5">
					<Label className="text-[11px] text-ef-text-secondary uppercase tracking-widest">
						Architectural Style
					</Label>
					<Select
						options={STYLES}
						value={state.architecturalStyle}
						onChange={(e) => setField("architecturalStyle", e.target.value)}
						className="border-ef-border bg-ef-bg-deep text-ef-text-primary"
					/>
				</div>

				<div className="flex flex-col gap-1.5">
					<Label className="text-[11px] text-ef-text-secondary uppercase tracking-widest">
						Era
					</Label>
					<Select
						options={ERAS}
						value={state.era}
						onChange={(e) => setField("era", e.target.value)}
						className="border-ef-border bg-ef-bg-deep text-ef-text-primary"
					/>
				</div>

				<div className="flex flex-col gap-1.5">
					<Label className="text-[11px] text-ef-text-secondary uppercase tracking-widest">
						Spatial Dimensions
					</Label>
					<Select
						options={DIMENSIONS}
						value={state.spatialDimensions}
						onChange={(e) => setField("spatialDimensions", e.target.value)}
						className="border-ef-border bg-ef-bg-deep text-ef-text-primary"
					/>
				</div>
			</div>
		</div>
	);
}
