"use client";

import { cn } from "@interior-design-ai/ui/lib/utils";
import { useState } from "react";

interface GalleryImage {
	id: string;
	url: string;
	width?: number | null;
	height?: number | null;
	category: string | null;
	sortOrder: number;
}

interface ImageGalleryProps {
	images: GalleryImage[];
	activeCategory: string | null;
}

export function ImageGallery({ images, activeCategory }: ImageGalleryProps) {
	const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

	const filtered = activeCategory
		? images.filter((img) => img.category === activeCategory)
		: images;

	return (
		<>
			<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
				{filtered.map((image) => (
					<button
						key={image.id}
						type="button"
						onClick={() => setSelectedImage(image)}
						className="group relative aspect-[4/3] overflow-hidden border border-ef-border transition-colors hover:border-ef-accent/30"
					>
						<img
							src={image.url}
							alt={image.category ?? "Generated interior"}
							className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
						/>
						{image.category && (
							<div className="absolute bottom-0 left-0 bg-ef-bg-deep/80 px-2 py-1 font-mono text-[10px] text-ef-accent uppercase tracking-wider backdrop-blur-sm">
								{image.category}
							</div>
						)}
					</button>
				))}
			</div>

			{/* Lightbox */}
			{selectedImage && (
				<div
					className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
					onClick={() => setSelectedImage(null)}
					onKeyDown={(e) => e.key === "Escape" && setSelectedImage(null)}
				>
					<div className="relative max-h-[90vh] max-w-[90vw]">
						<img
							src={selectedImage.url}
							alt={selectedImage.category ?? "Generated interior"}
							className="max-h-[90vh] max-w-[90vw] object-contain"
						/>
						{selectedImage.category && (
							<div className="absolute bottom-4 left-4 bg-ef-bg-deep/80 px-3 py-1 font-mono text-ef-accent text-xs uppercase tracking-wider backdrop-blur-sm">
								{selectedImage.category}
							</div>
						)}
					</div>
				</div>
			)}
		</>
	);
}
