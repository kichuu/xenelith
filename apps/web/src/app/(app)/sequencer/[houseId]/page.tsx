"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect } from "react";
import { toast } from "sonner";
import { EnvironmentSection } from "@/components/sequencer/environment-section";
import { StructureSection } from "@/components/sequencer/structure-section";
import { SynthesisSection } from "@/components/sequencer/synthesis-section";
import { StepIndicator } from "@/components/step-indicator";
import { useCreditsContext } from "@/components/credits-provider";
import { useHouse } from "@/hooks/use-house";
import { useSequencerForm } from "@/hooks/use-sequencer-form";
import { ApiError, api } from "@/lib/api-client";

export default function EditSequencerPage() {
	const params = useParams<{ houseId: string }>();
	const router = useRouter();
	const searchParams = useSearchParams();
	const step = Number(searchParams.get("step") || "1");
	const { house, loading } = useHouse(params.houseId);
	const { state, setField, load } = useSequencerForm();
	const { openBuyDialog, refetch } = useCreditsContext();

	useEffect(() => {
		if (house) {
			load({
				name: house.name,
				architecturalStyle: house.architecturalStyle,
				era: house.era,
				spatialDimensions: house.spatialDimensions,
				formComplexity: house.formComplexity,
				thermalOutput: house.thermalOutput,
				lightingExposure: house.lightingExposure,
				primaryMaterial: house.primaryMaterial ?? "",
				secondaryMaterial: house.secondaryMaterial ?? "",
				colorPalette: house.colorPalette ?? "",
				texture: house.texture ?? "",
				mood: house.mood ?? "",
			});
		}
	}, [house, load]);

	const setStep = useCallback(
		(s: number) => {
			const p = new URLSearchParams(searchParams);
			p.set("step", String(s));
			router.push(`?${p.toString()}`);
		},
		[router, searchParams],
	);

	const handleSubmit = async () => {
		await api.patch(`/houses/${params.houseId}`, {
			name: state.name || undefined,
			architecturalStyle: state.architecturalStyle,
			era: state.era,
			spatialDimensions: state.spatialDimensions,
			formComplexity: state.formComplexity,
			thermalOutput: state.thermalOutput,
			lightingExposure: state.lightingExposure,
			primaryMaterial: state.primaryMaterial || null,
			secondaryMaterial: state.secondaryMaterial || null,
			colorPalette: state.colorPalette || null,
			texture: state.texture || null,
			mood: state.mood || null,
		});

		try {
			const genData = await api.post<{ generation: { id: string } }>(
				`/houses/${params.houseId}/generate`,
			);
			refetch();
			router.push(`/sequencing/${genData.generation.id}`);
		} catch (error) {
			if (
				error instanceof ApiError &&
				error.code === "INSUFFICIENT_CREDITS"
			) {
				toast.error("Insufficient credits to begin synthesis");
				openBuyDialog();
				return;
			}
			throw error;
		}
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center py-20">
				<span className="animate-pulse text-[10px] text-ef-text-secondary uppercase tracking-widest">
					Loading DNA...
				</span>
			</div>
		);
	}

	return (
		<div className="mx-auto flex w-full max-w-4xl gap-10 px-6 py-10">
			<div className="hidden w-40 shrink-0 pt-2 md:block">
				<StepIndicator currentStep={step} onStepClick={setStep} />
			</div>

			<div className="flex-1">
				<div className="mb-8">
					<p className="text-[11px] text-ef-text-secondary uppercase tracking-widest">
						DNA Sequencer
					</p>
					<h1 className="mt-1 font-serif text-2xl text-ef-gold italic">
						Edit DNA — {house?.dnaCode}
					</h1>
				</div>

				<div className="mb-8 border border-ef-border bg-ef-bg-surface p-6">
					{step === 1 && <StructureSection state={state} setField={setField} />}
					{step === 2 && (
						<EnvironmentSection state={state} setField={setField} />
					)}
					{step === 3 && <SynthesisSection state={state} setField={setField} />}
				</div>

				<div className="flex justify-between">
					<button
						type="button"
						onClick={() => setStep(Math.max(1, step - 1))}
						disabled={step === 1}
						className="border border-ef-border px-4 py-2 text-[11px] text-ef-text-secondary uppercase tracking-widest transition-colors hover:text-ef-text-primary disabled:opacity-30"
					>
						Previous
					</button>

					{step < 3 ? (
						<button
							type="button"
							onClick={() => setStep(step + 1)}
							className="border border-ef-accent bg-ef-accent/10 px-6 py-2 text-[11px] text-ef-accent uppercase tracking-widest transition-colors hover:bg-ef-accent/20"
						>
							Continue
						</button>
					) : (
						<button
							type="button"
							onClick={handleSubmit}
							className="border border-ef-accent bg-ef-accent px-6 py-2 text-[11px] text-ef-bg-deep uppercase tracking-widest transition-colors hover:bg-ef-accent/90"
						>
							Re-Synthesize
						</button>
					)}
				</div>
			</div>
		</div>
	);
}
