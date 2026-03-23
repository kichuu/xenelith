"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "@/lib/api-client";

export interface GenerationStatus {
	id: string;
	status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
	progress: number;
	statusText: string;
	description: string | null;
	errorMessage: string | null;
	houseId: string;
	roomId: string | null;
	images: {
		id: string;
		url: string;
		category: string | null;
		sortOrder: number;
	}[];
}

export function useGenerationStatus(generationId: string | null) {
	const [generation, setGeneration] = useState<GenerationStatus | null>(null);
	const [loading, setLoading] = useState(true);
	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

	const poll = useCallback(async () => {
		if (!generationId) return;
		try {
			const data = await api.get<{ generation: GenerationStatus }>(
				`/generations/${generationId}`,
			);
			setGeneration(data.generation);
			setLoading(false);

			if (
				data.generation.status === "COMPLETED" ||
				data.generation.status === "FAILED"
			) {
				if (intervalRef.current) {
					clearInterval(intervalRef.current);
					intervalRef.current = null;
				}
			}
		} catch {
			setLoading(false);
		}
	}, [generationId]);

	useEffect(() => {
		if (!generationId) return;

		poll();
		intervalRef.current = setInterval(poll, 2000);

		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
				intervalRef.current = null;
			}
		};
	}, [generationId, poll]);

	return { generation, loading };
}
