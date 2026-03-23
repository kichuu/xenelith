"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api-client";

export interface HouseDetail {
	id: string;
	dnaCode: string;
	name: string;
	architecturalStyle: string;
	era: string;
	spatialDimensions: string;
	spatialLayout: string | null;
	formComplexity: number;
	thermalOutput: number;
	lightingExposure: number;
	primaryMaterial: string | null;
	secondaryMaterial: string | null;
	colorPalette: string | null;
	texture: string | null;
	patternStyle: string | null;
	mood: string | null;
	soundDna: string | null;
	description: string | null;
	createdAt: string;
	updatedAt: string;
	rooms: {
		id: string;
		name: string;
		roomType: string;
		architecturalStyle: string | null;
		formComplexity: number | null;
		thermalOutput: number | null;
		lightingExposure: number | null;
	}[];
	generations: {
		id: string;
		status: string;
		progress: number;
		description: string | null;
		createdAt: string;
		images: {
			id: string;
			url: string;
			width: number | null;
			height: number | null;
			category: string | null;
			sortOrder: number;
		}[];
	}[];
}

export function useHouse(id: string | null) {
	const [house, setHouse] = useState<HouseDetail | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchHouse = useCallback(async () => {
		if (!id) return;
		try {
			setLoading(true);
			const data = await api.get<{ house: HouseDetail }>(`/houses/${id}`);
			setHouse(data.house);
			setError(null);
		} catch (e) {
			setError(e instanceof Error ? e.message : "Failed to load house");
		} finally {
			setLoading(false);
		}
	}, [id]);

	useEffect(() => {
		fetchHouse();
	}, [fetchHouse]);

	return { house, loading, error, refetch: fetchHouse };
}
