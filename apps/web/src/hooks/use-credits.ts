"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api-client";

export interface Plan {
	id: string;
	credits: number;
	amountPaise: number;
	label: string;
}

interface CreditsResponse {
	balance: number;
	plans: Plan[];
}

export function useCredits() {
	const [balance, setBalance] = useState<number>(0);
	const [plans, setPlans] = useState<Plan[]>([]);
	const [loading, setLoading] = useState(true);

	const fetch = useCallback(async () => {
		try {
			const data = await api.get<CreditsResponse>("/credits");
			setBalance(data.balance);
			setPlans(data.plans);
		} catch {
			// silently fail — balance stays at 0
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetch();
	}, [fetch]);

	return { balance, plans, loading, refetch: fetch };
}
