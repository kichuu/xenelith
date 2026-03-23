"use client";

import { Label } from "@interior-design-ai/ui/components/label";
import { Select } from "@interior-design-ai/ui/components/select";
import type { SequencerState } from "@/hooks/use-sequencer-form";

const MATERIALS = [
	{ value: "CONCRETE", label: "Concrete" },
	{ value: "WOOD", label: "Wood" },
	{ value: "MARBLE", label: "Marble" },
	{ value: "STEEL", label: "Steel" },
	{ value: "GLASS", label: "Glass" },
	{ value: "BRICK", label: "Brick" },
	{ value: "STONE", label: "Stone" },
	{ value: "CERAMIC", label: "Ceramic" },
	{ value: "LEATHER", label: "Leather" },
	{ value: "FABRIC", label: "Fabric" },
];

const PALETTES = [
	{ value: "MONOCHROME", label: "Monochrome" },
	{ value: "EARTH_TONES", label: "Earth Tones" },
	{ value: "COOL_NEUTRALS", label: "Cool Neutrals" },
	{ value: "WARM_NEUTRALS", label: "Warm Neutrals" },
	{ value: "JEWEL_TONES", label: "Jewel Tones" },
	{ value: "PASTELS", label: "Pastels" },
	{ value: "HIGH_CONTRAST", label: "High Contrast" },
	{ value: "MUTED", label: "Muted" },
];

const TEXTURES = [
	{ value: "SMOOTH", label: "Smooth" },
	{ value: "ROUGH", label: "Rough" },
	{ value: "MATTE", label: "Matte" },
	{ value: "GLOSSY", label: "Glossy" },
	{ value: "TEXTURED", label: "Textured" },
	{ value: "ORGANIC", label: "Organic" },
	{ value: "POLISHED", label: "Polished" },
];

const MOODS = [
	{ value: "SERENE", label: "Serene" },
	{ value: "DRAMATIC", label: "Dramatic" },
	{ value: "COZY", label: "Cozy" },
	{ value: "ENERGETIC", label: "Energetic" },
	{ value: "LUXURIOUS", label: "Luxurious" },
	{ value: "RUSTIC", label: "Rustic" },
	{ value: "FUTURISTIC", label: "Futuristic" },
	{ value: "ROMANTIC", label: "Romantic" },
];

interface SynthesisSectionProps {
	state: SequencerState;
	setField: (field: keyof SequencerState, value: string | number) => void;
}

export function SynthesisSection({ state, setField }: SynthesisSectionProps) {
	return (
		<div className="flex flex-col gap-6">
			<div>
				<h2 className="font-serif text-ef-gold text-xl italic">Synthesis</h2>
				<p className="mt-1 text-[11px] text-ef-text-secondary uppercase tracking-widest">
					Material and atmospheric composition
				</p>
			</div>

			<div className="flex flex-col gap-4">
				<div className="flex flex-col gap-1.5">
					<Label className="text-[11px] text-ef-text-secondary uppercase tracking-widest">
						Primary Material
					</Label>
					<Select
						options={MATERIALS}
						value={state.primaryMaterial}
						onChange={(e) => setField("primaryMaterial", e.target.value)}
						placeholder="Select material..."
						className="border-ef-border bg-ef-bg-deep text-ef-text-primary"
					/>
				</div>

				<div className="flex flex-col gap-1.5">
					<Label className="text-[11px] text-ef-text-secondary uppercase tracking-widest">
						Secondary Material
					</Label>
					<Select
						options={MATERIALS}
						value={state.secondaryMaterial}
						onChange={(e) => setField("secondaryMaterial", e.target.value)}
						placeholder="Select material..."
						className="border-ef-border bg-ef-bg-deep text-ef-text-primary"
					/>
				</div>

				<div className="flex flex-col gap-1.5">
					<Label className="text-[11px] text-ef-text-secondary uppercase tracking-widest">
						Color Palette
					</Label>
					<Select
						options={PALETTES}
						value={state.colorPalette}
						onChange={(e) => setField("colorPalette", e.target.value)}
						placeholder="Select palette..."
						className="border-ef-border bg-ef-bg-deep text-ef-text-primary"
					/>
				</div>

				<div className="flex flex-col gap-1.5">
					<Label className="text-[11px] text-ef-text-secondary uppercase tracking-widest">
						Texture
					</Label>
					<Select
						options={TEXTURES}
						value={state.texture}
						onChange={(e) => setField("texture", e.target.value)}
						placeholder="Select texture..."
						className="border-ef-border bg-ef-bg-deep text-ef-text-primary"
					/>
				</div>

				<div className="flex flex-col gap-1.5">
					<Label className="text-[11px] text-ef-text-secondary uppercase tracking-widest">
						Mood
					</Label>
					<Select
						options={MOODS}
						value={state.mood}
						onChange={(e) => setField("mood", e.target.value)}
						placeholder="Select mood..."
						className="border-ef-border bg-ef-bg-deep text-ef-text-primary"
					/>
				</div>
			</div>
		</div>
	);
}
