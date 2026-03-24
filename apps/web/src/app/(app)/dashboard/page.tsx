"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { useCreditsContext } from "@/components/credits-provider";
import { DnaCard, DnaCardSkeleton } from "@/components/dna-card";
import { useHouses } from "@/hooks/use-houses";
import { api } from "@/lib/api-client";

export default function DashboardPage() {
	const { houses, loading, error } = useHouses();
	const { refetch } = useCreditsContext();
	const searchParams = useSearchParams();
	const router = useRouter();

	useEffect(() => {
		if (searchParams.get("payment") === "success") {
			api.post<{ balance: number; credited: number }>("/credits/sync")
				.then((data) => {
					refetch();
					if (data.credited > 0) {
						toast.success(`${data.credited} credits added`);
					} else {
						toast.success("Payment received");
					}
				})
				.catch(() => {
					refetch();
					toast.info("Payment is being processed");
				})
				.finally(() => {
					router.replace("/dashboard");
				});
		}
	}, [searchParams, refetch, router]);

	return (
		<div className="mx-auto w-full max-w-6xl px-6 py-10">
			{/* Hero */}
			<div className="mb-10 flex items-end justify-between">
				<div>
					<h1 className="font-serif text-3xl text-ef-gold italic">
						Your Architectural Genome
					</h1>
					<p className="mt-1 text-ef-text-secondary text-xs uppercase tracking-widest">
						The Foyer
					</p>
				</div>
				<Link
					href="/sequencer/new"
					className="flex items-center gap-2 border border-ef-accent bg-ef-accent/10 px-4 py-2 text-[11px] text-ef-accent uppercase tracking-widest transition-colors hover:bg-ef-accent/20"
				>
					<Plus className="size-3.5" />
					Extract New DNA
				</Link>
			</div>

			{/* Error */}
			{error && (
				<div className="mb-6 border border-destructive/30 bg-destructive/10 p-4 text-destructive text-xs">
					{error}
				</div>
			)}

			{/* Gallery */}
			{loading ? (
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{Array.from({ length: 6 }, (_, i) => (
						<DnaCardSkeleton key={i} />
					))}
				</div>
			) : houses.length === 0 ? (
				<div className="flex flex-col items-center justify-center py-20">
					<div className="mb-4 size-16 border border-ef-border border-dashed" />
					<p className="mb-1 text-ef-text-secondary text-xs uppercase tracking-widest">
						No DNA sequences found
					</p>
					<p className="mb-6 text-[10px] text-ef-text-secondary">
						Initialize your first architectural genome
					</p>
					<Link
						href="/sequencer/new"
						className="border border-ef-accent bg-ef-accent/10 px-4 py-2 text-[11px] text-ef-accent uppercase tracking-widest transition-colors hover:bg-ef-accent/20"
					>
						Initialize Sequence
					</Link>
				</div>
			) : (
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{houses.map((house) => (
						<DnaCard key={house.id} house={house} />
					))}
				</div>
			)}
		</div>
	);
}
