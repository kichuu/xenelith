"use client";

import { Progress } from "@interior-design-ai/ui/components/progress";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { DnaVisualization } from "@/components/sequencing/dna-visualization";
import { useGenerationStatus } from "@/hooks/use-generation-status";

export default function SequencingPage() {
	const params = useParams<{ generationId: string }>();
	const router = useRouter();
	const { generation } = useGenerationStatus(params.generationId);

	useEffect(() => {
		if (generation?.status === "COMPLETED") {
			router.push(`/synthesis/${generation.houseId}/${generation.id}`);
		}
	}, [generation, router]);

	return (
		<div className="flex min-h-full flex-col items-center justify-center px-6 py-10">
			{/* Status bar */}
			<div className="mb-8 flex items-center gap-3 font-mono text-[10px] text-ef-text-secondary">
				<span className="text-ef-accent">SYS.MEM.OK</span>
				<span className="text-ef-border">|</span>
				<span>DNA.CORE.ACTIVE</span>
				<span className="text-ef-border">|</span>
				<span className="animate-pulse text-ef-accent">
					{generation?.status === "FAILED" ? "ERR" : "RUN"}
				</span>
			</div>

			{/* DNA visualization */}
			<DnaVisualization progress={generation?.progress ?? 0} />

			{/* Status text */}
			<div className="mt-8 text-center">
				<p className="font-mono text-ef-accent text-xs uppercase tracking-widest">
					{generation?.statusText ?? "INITIALIZING..."}
				</p>
			</div>

			{/* Progress bar */}
			<div className="mt-6 w-full max-w-md">
				<Progress value={generation?.progress ?? 0} />
				<div className="mt-2 flex justify-between font-mono text-[10px] text-ef-text-secondary">
					<span>PROGRESS</span>
					<span>{generation?.progress ?? 0}%</span>
				</div>
			</div>

			{/* Error state */}
			{generation?.status === "FAILED" && (
				<div className="mt-8 max-w-md border border-destructive/30 bg-destructive/10 p-4 text-center text-destructive text-xs">
					<p className="mb-2 font-mono uppercase tracking-wider">
						Synthesis Failed
					</p>
					<p>{generation.errorMessage}</p>
					<button
						type="button"
						onClick={() => router.push("/dashboard")}
						className="mt-4 border border-ef-border px-4 py-2 text-[11px] text-ef-text-secondary uppercase tracking-widest transition-colors hover:text-ef-text-primary"
					>
						Return to Foyer
					</button>
				</div>
			)}
		</div>
	);
}
