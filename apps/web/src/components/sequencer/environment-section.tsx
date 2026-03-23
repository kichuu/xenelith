"use client";

import { Label } from "@interior-design-ai/ui/components/label";
import { Slider } from "@interior-design-ai/ui/components/slider";
import type { SequencerState } from "@/hooks/use-sequencer-form";

interface EnvironmentSectionProps {
	state: SequencerState;
	setField: (field: keyof SequencerState, value: string | number) => void;
}

export function EnvironmentSection({
	state,
	setField,
}: EnvironmentSectionProps) {
	return (
		<div className="flex flex-col gap-6">
			<div>
				<h2 className="font-serif text-ef-gold text-xl italic">Environment</h2>
				<p className="mt-1 text-[11px] text-ef-text-secondary uppercase tracking-widest">
					Calibrate the sensory parameters
				</p>
			</div>

			<div className="flex flex-col gap-6">
				<div className="flex flex-col gap-2">
					<Label className="text-[11px] text-ef-text-secondary uppercase tracking-widest">
						Form Complexity
					</Label>
					<Slider
						value={state.formComplexity}
						onChange={(v) => setField("formComplexity", v)}
						labelStart="Minimal"
						labelEnd="Maximal"
					/>
				</div>

				<div className="flex flex-col gap-2">
					<Label className="text-[11px] text-ef-text-secondary uppercase tracking-widest">
						Thermal Output
					</Label>
					<Slider
						value={state.thermalOutput}
						onChange={(v) => setField("thermalOutput", v)}
						labelStart="Cool"
						labelEnd="Warm"
					/>
				</div>

				<div className="flex flex-col gap-2">
					<Label className="text-[11px] text-ef-text-secondary uppercase tracking-widest">
						Lighting Exposure
					</Label>
					<Slider
						value={state.lightingExposure}
						onChange={(v) => setField("lightingExposure", v)}
						labelStart="Dim"
						labelEnd="Bright"
					/>
				</div>
			</div>
		</div>
	);
}
