"use client";

import Link from "next/link";
import type { HouseListItem } from "@/hooks/use-houses";

export function DnaCard({ house }: { house: HouseListItem }) {
	const latestGen = house.generations[0];
	const thumbnail = latestGen?.images[0]?.url;

	return (
		<Link
			href={
				latestGen
					? `/synthesis/${house.id}/${latestGen.id}`
					: `/sequencer/${house.id}`
			}
			className="group relative flex flex-col overflow-hidden border border-ef-border bg-ef-bg-surface transition-colors hover:border-ef-accent/30"
		>
			{/* Thumbnail */}
			<div className="relative aspect-[4/3] overflow-hidden bg-ef-bg-deep">
				{thumbnail ? (
					<img
						src={thumbnail}
						alt={house.name}
						className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
					/>
				) : (
					<div className="flex size-full items-center justify-center">
						<div className="flex flex-col items-center gap-2 text-ef-text-secondary">
							<div className="size-8 border border-ef-border border-dashed" />
							<span className="text-[10px] uppercase tracking-widest">
								No synthesis
							</span>
						</div>
					</div>
				)}
				{/* DNA code overlay */}
				<div className="absolute top-2 left-2 bg-ef-bg-deep/80 px-2 py-0.5 font-mono text-[10px] text-ef-accent tracking-wider backdrop-blur-sm">
					{house.dnaCode}
				</div>
			</div>

			{/* Info */}
			<div className="flex flex-col gap-1 p-3">
				<h3 className="truncate font-medium text-ef-text-primary text-xs">
					{house.name}
				</h3>
				<div className="flex items-center gap-2 text-[10px] text-ef-text-secondary">
					<span>{house.architecturalStyle}</span>
					<span className="text-ef-border">|</span>
					<span>{house.rooms.length} rooms</span>
				</div>
				{/* Mini sliders */}
				<div className="mt-1 flex gap-1">
					{[
						house.formComplexity,
						house.thermalOutput,
						house.lightingExposure,
					].map((val, i) => (
						<div key={i} className="h-0.5 flex-1 bg-ef-border">
							<div
								className="h-full bg-ef-accent/60"
								style={{ width: `${val}%` }}
							/>
						</div>
					))}
				</div>
			</div>
		</Link>
	);
}

export function DnaCardSkeleton() {
	return (
		<div className="flex flex-col overflow-hidden border border-ef-border bg-ef-bg-surface">
			<div className="aspect-[4/3] animate-pulse bg-ef-bg-deep" />
			<div className="flex flex-col gap-2 p-3">
				<div className="h-3 w-2/3 animate-pulse bg-ef-border" />
				<div className="h-2 w-1/2 animate-pulse bg-ef-border" />
			</div>
		</div>
	);
}
