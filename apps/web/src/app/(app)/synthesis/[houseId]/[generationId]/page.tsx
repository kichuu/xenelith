"use client";

import { Badge } from "@interior-design-ai/ui/components/badge";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { DnaSummary } from "@/components/synthesis/dna-summary";
import { FocusToggle } from "@/components/synthesis/focus-toggle";
import { ImageGallery } from "@/components/synthesis/image-gallery";
import { useGenerationStatus } from "@/hooks/use-generation-status";
import { useHouse } from "@/hooks/use-house";

export default function SynthesisPage() {
	const params = useParams<{ houseId: string; generationId: string }>();
	const { house, loading: houseLoading } = useHouse(params.houseId);
	const { generation, loading: genLoading } = useGenerationStatus(
		params.generationId,
	);
	const [activeCategory, setActiveCategory] = useState<string | null>(null);

	if (houseLoading || genLoading) {
		return (
			<div className="flex items-center justify-center py-20">
				<span className="animate-pulse text-[10px] text-ef-text-secondary uppercase tracking-widest">
					Loading synthesis...
				</span>
			</div>
		);
	}

	if (!house || !generation) {
		return (
			<div className="flex flex-col items-center justify-center py-20">
				<p className="text-ef-text-secondary text-xs">Not found</p>
				<Link
					href="/dashboard"
					className="mt-4 text-[11px] text-ef-accent uppercase tracking-widest"
				>
					Return to Foyer
				</Link>
			</div>
		);
	}

	const date = new Date(
		generation.images[0]?.id ? house.updatedAt : Date.now(),
	);

	return (
		<div className="mx-auto w-full max-w-6xl px-6 py-10">
			{/* Header */}
			<div className="mb-8">
				<div className="flex items-center gap-3">
					<h1 className="font-serif text-2xl text-ef-gold italic">
						Synthesis Complete
					</h1>
					<Badge variant="accent">{house.dnaCode}</Badge>
				</div>
				<p className="mt-1 text-[10px] text-ef-text-secondary uppercase tracking-widest">
					{date.toLocaleDateString("en-US", {
						year: "numeric",
						month: "long",
						day: "numeric",
					})}
				</p>
				{generation.description && (
					<p className="mt-3 max-w-2xl text-ef-text-secondary text-xs leading-relaxed">
						{generation.description}
					</p>
				)}
			</div>

			{/* Category filter */}
			<div className="mb-6">
				<FocusToggle active={activeCategory} onChange={setActiveCategory} />
			</div>

			{/* Content grid */}
			<div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_280px]">
				{/* Gallery */}
				<ImageGallery
					images={generation.images}
					activeCategory={activeCategory}
				/>

				{/* Sidebar */}
				<div className="flex flex-col gap-4">
					<DnaSummary house={house} />

					{/* Actions */}
					<div className="flex flex-col gap-2">
						<Link
							href="/dashboard"
							className="border border-ef-border px-4 py-2 text-center text-[11px] text-ef-text-secondary uppercase tracking-widest transition-colors hover:text-ef-text-primary"
						>
							Back to Foyer
						</Link>
						<Link
							href={`/sequencer/${house.id}`}
							className="border border-ef-accent bg-ef-accent/10 px-4 py-2 text-center text-[11px] text-ef-accent uppercase tracking-widest transition-colors hover:bg-ef-accent/20"
						>
							Edit DNA
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
