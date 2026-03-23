"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api-client";

export interface HouseListItem {
	id: string;
	dnaCode: string;
	name: string;
	architecturalStyle: string;
	formComplexity: number;
	thermalOutput: number;
	lightingExposure: number;
	updatedAt: string;
	rooms: { id: string; name: string; roomType: string }[];
	generations: {
		id: string;
		status: string;
		images: { url: string }[];
	}[];
}

export function useHouses() {
	const [houses, setHouses] = useState<HouseListItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchHouses = useCallback(async () => {
		try {
			setLoading(true);
			const data = await api.get<{ houses: HouseListItem[] }>("/houses");
			setHouses(data.houses);
			setError(null);
		} catch (e) {
			setError(e instanceof Error ? e.message : "Failed to load houses");
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchHouses();
	}, [fetchHouses]);

	return { houses, loading, error, refetch: fetchHouses };
}
